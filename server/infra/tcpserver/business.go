package tcpserver

import (
	"bytes"
	"database/sql"
	"encoding/hex"
	"fmt"
	"net"
	"sync"
	"time"

	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/support/utils"
)

// --------------------
// in 业务处理逻辑
// --------------------

var (
	// 使用连接级缓冲处理粘包/半包
	connBuffers     sync.Map // key: connKey(conn) -> *bytes.Buffer
	// 维护 IP:Port -> 网关类型的映射 (int: 1=入库, 2=出库, 3=盘点)
	gatewayTypeMap  sync.Map // key: deviceAddr (string) -> gatewayType (int)
	queueOnce       sync.Once
	recordQueue     chan recordJob
	recordQueueMu   sync.RWMutex
	recordClosing   bool
	recordWg        sync.WaitGroup
	recordWorkersWg sync.WaitGroup
	workerCount     = 4
	queueSize       = 1024
)

// SetGatewayType 动态设置网关地址对应的类型（供外部调用）
func SetGatewayType(addr string, gatewayType int) {
	gatewayTypeMap.Store(addr, gatewayType)
}

func getGatewayType(addr string) int {
	if val, ok := gatewayTypeMap.Load(addr); ok {
		return val.(int)
	}
	return 0
}

func handle(conn net.Conn, data []byte) {
	key := connKey(conn)

	bufAny, _ := connBuffers.LoadOrStore(key, &bytes.Buffer{})
	buf := bufAny.(*bytes.Buffer)
	buf.Write(data)

	for {
		ok, consumed := parseFrame(buf.Bytes(), conn.RemoteAddr().String())
		if !ok {
			break
		}
		buf.Next(consumed)
	}
}

func connKey(conn net.Conn) string {
	return conn.RemoteAddr().String() + "->" + conn.LocalAddr().String()
}

func cleanupConnBuffer(conn net.Conn) {
	connBuffers.Delete(connKey(conn))
}

// 解析单帧；返回是否成功解析以及消耗的字节数
func parseFrame(frameData []byte, deviceAddr string) (bool, int) {
	if len(frameData) < 6 {
		return false, 0
	}

	lenLow := int(frameData[4])
	lenHigh := int(frameData[5])
	dataLen := lenLow + lenHigh*256
	totalLen := 6 + dataLen + 1
	if len(frameData) < totalLen {
		return false, 0
	}

	data := frameData[6 : 6+dataLen]
	check := frameData[6+dataLen]

	var bcc byte
	for _, b := range data {
		bcc ^= b
	}
	if bcc != check {
		return true, totalLen // 丢弃校验失败的帧
	}

	switch dataLen {
	case 1:
		parseAckFrame(data, deviceAddr)
	case 10:
		parseNoTimeFrame(data, deviceAddr)
	case 18:
		parseWithTimeFrame(data, deviceAddr)
	}

	return true, totalLen
}

func parseAckFrame(data []byte, deviceAddr string) {
	if len(data) < 1 {
		return
	}
	status := data[0]
	utils.Log.Info("收到设备确认帧", "device", deviceAddr, "status", status)
}

func parseNoTimeFrame(data []byte, deviceAddr string) {
	if len(data) < 9 {
		return
	}
	tagDataLen := data[0]
	if tagDataLen == 0 {
		return
	}

	rssi := int(data[1])
	pcValue := fmt.Sprintf("%02X", data[2])
	batteryLevel := data[3]
	uid := hex.EncodeToString(data[4:8])
	antennaNum := int(data[8])
	
	var additionalCategory byte
	if len(data) >= 10 {
		additionalCategory = data[9]
	}

	batStr := fmt.Sprintf("%02X", batteryLevel)

	printLine(uid, pcValue, batStr, rssi, antennaNum, int(additionalCategory), time.Now().Format("2006-01-02 15:04:05"), deviceAddr)
}

func parseWithTimeFrame(data []byte, deviceAddr string) {
	if len(data) < 17 {
		return
	}
	tagDataLen := data[0]
	if tagDataLen == 0 {
		return
	}

	rssi := int(data[1])
	pcValue := fmt.Sprintf("%02X", data[2])
	batteryLevel := data[3]
	uid := hex.EncodeToString(data[4:8])
	antennaNum := int(data[8])
	_, readTime := parseTime(data[9:17])

	var additionalCategory byte
	if len(data) >= 18 {
		additionalCategory = data[17]
	}

	batStr := fmt.Sprintf("%02X", batteryLevel)

	printLine(uid, pcValue, batStr, rssi, antennaNum, int(additionalCategory), readTime, deviceAddr)
}

func parseTime(data []byte) (time.Time, string) {
	year := 2000 + bcdToDec(data[0])
	month := bcdToDec(data[1])
	day := bcdToDec(data[2])
	hour := bcdToDec(data[3])
	minute := bcdToDec(data[4])
	second := bcdToDec(data[5])
	millisecond := int(data[6])*256 + int(data[7])
	t := time.Date(year, time.Month(month), day, hour, minute, second, millisecond*1e6, time.Local)
	return t, t.Format("2006-01-02 15:04:05")
}

func bcdToDec(b byte) int {
	return int(b>>4)*10 + int(b&0x0F)
}

func printLine(uid, pcValue, batStr string, rssi, antenna, addCat int, ts, deviceAddr string) {
	gwType := getGatewayType(deviceAddr)

	switch gwType {
	case 1: // 入库
		fmt.Printf("[入库设备] UID=%s PC=%s Bat=%s RSSI=%d Ant=%d AddCat=%d Time=%s Dev=%s\n",
			uid, pcValue, batStr, rssi, antenna, addCat, ts, deviceAddr)
		enqueueRecord(uid, pcValue, batStr, rssi, antenna, addCat, ts, deviceAddr)

	case 2: // 出库
		fmt.Printf("[出库设备] UID=%s PC=%s Bat=%s RSSI=%d Ant=%d AddCat=%d Time=%s Dev=%s\n",
			uid, pcValue, batStr, rssi, antenna, addCat, ts, deviceAddr)
		enqueueRecord(uid, pcValue, batStr, rssi, antenna, addCat, ts, deviceAddr)

	case 3: // 盘点
		fmt.Printf("[盘点设备] UID=%s PC=%s Bat=%s RSSI=%d Ant=%d AddCat=%d Time=%s Dev=%s\n",
			uid, pcValue, batStr, rssi, antenna, addCat, ts, deviceAddr)
		enqueueRecord(uid, pcValue, batStr, rssi, antenna, addCat, ts, deviceAddr)

	default:
		// 如果没找到类型，打印警告
		fmt.Printf("[未知网关类型 %d] 地址=%s UID=%s PC=%s Bat=%s RSSI=%d Ant=%d AddCat=%d Time=%s\n",
			gwType, deviceAddr, uid, pcValue, batStr, rssi, antenna, addCat, ts)
	}
}

type recordJob struct {
	uid                string
	pcValue            string
	batStr             string
	rssi               int
	antenna            int
	additionalCategory int
	ts                 string
	deviceAddr         string
}

func ensureRecordWorkers() {
	queueOnce.Do(func() {
		recordQueue = make(chan recordJob, queueSize)
		for i := 0; i < workerCount; i++ {
			recordWorkersWg.Add(1)
			go recordWorker()
		}
	})
}

func enqueueRecord(uid, pcValue, batStr string, rssi, antenna, addCat int, ts, deviceAddr string) {
	ensureRecordWorkers()
	recordQueueMu.RLock()
	if recordClosing {
		recordQueueMu.RUnlock()
		utils.Log.Warn("入库队列已关闭，丢弃记录", "uid", uid, "deviceAddr", deviceAddr)
		return
	}
	job := recordJob{
		uid:                uid,
		pcValue:            pcValue,
		batStr:             batStr,
		rssi:               rssi,
		antenna:            antenna,
		additionalCategory: addCat,
		ts:                 ts,
		deviceAddr:         deviceAddr,
	}
	recordWg.Add(1)
	select {
	case recordQueue <- job:
		recordQueueMu.RUnlock()
	default:
		recordWg.Done()
		recordQueueMu.RUnlock()
		utils.Log.Warn("入库队列已满，丢弃记录", "uid", uid, "deviceAddr", deviceAddr)
	}
}

func recordWorker() {
	defer recordWorkersWg.Done()
	for job := range recordQueue {
		saveRecordToDB(job)
		recordWg.Done()
	}
}

func ShutdownRecordQueue() {
	if recordQueue == nil {
		return
	}
	recordQueueMu.Lock()
	if recordClosing {
		recordQueueMu.Unlock()
		return
	}
	recordClosing = true
	close(recordQueue)
	recordQueueMu.Unlock()
	recordWg.Wait()
	recordWorkersWg.Wait()
}

func saveRecordToDB(job recordJob) {
	gwType := getGatewayType(job.deviceAddr)

	// 解析时间字符串为 time.Time
	t, err := time.Parse("2006-01-02 15:04:05", job.ts)
	if err != nil {
		t = time.Now()
	}
	assetId := resolveAssetIdByTagCode(job.uid)

	switch gwType {
	case 1: // 入库
		record := map[string]interface{}{
			"tag_code":    job.uid,
			"asset_id":    assetId,
			"action_type": 1,
			"action_time": &t,
		}
		if err := db.GormDB.Table("io_records").Create(&record).Error; err != nil {
			utils.Log.Error("写入IoRecord失败", "error", err, "uid", job.uid, "tagCode", job.uid, "actionType", 1)
		} else {
			utils.Log.Info("成功写入入库记录", "assetId", assetId, "tagCode", job.uid)
		}

	case 2: // 出库
		record := map[string]interface{}{
			"tag_code":    job.uid,
			"asset_id":    assetId,
			"action_type": 2,
			"action_time": &t,
		}
		if err := db.GormDB.Table("io_records").Create(&record).Error; err != nil {
			utils.Log.Error("写入IoRecord失败", "error", err, "uid", job.uid, "tagCode", job.uid, "actionType", 2)
		} else {
			utils.Log.Info("成功写入出库记录", "assetId", assetId, "tagCode", job.uid)
		}

	case 3: // 盘点
		inventoryRecord := map[string]interface{}{
			"tag_code":            job.uid,
			"asset_id":            assetId,
			"inventory_time":      t,
			"rssi":                job.rssi,
			"antenna_num":         job.antenna,
			"battery_level":       job.batStr,
			"pc_value":            job.pcValue,
			"additional_category": job.additionalCategory,
			"inventory_status":    1, // 默认正常
			"created_at":          time.Now(),
		}
		if err := db.GormDB.Table("inventory_records").Create(&inventoryRecord).Error; err != nil {
			utils.Log.Error("写入InventoryRecord失败", "error", err, "uid", job.uid, "tagCode", job.uid)
		} else {
			utils.Log.Info("成功写入盘点记录", "assetId", assetId, "tagCode", job.uid)
		}

	default:
		return
	}
}

func resolveAssetIdByTagCode(tagCode string) interface{} {
	var assetId sql.NullInt64
	if err := db.GormDB.Table("rfid_tags").
		Select("asset_tags.asset_id").
		Joins("JOIN asset_tags ON asset_tags.tag_id = rfid_tags.id").
		Where("rfid_tags.tag_code = ?", tagCode).
		Limit(1).
		Scan(&assetId).Error; err != nil {
		utils.Log.Warn("查询资产关联失败", "error", err, "tagCode", tagCode)
		return nil
	}
	if !assetId.Valid {
		return nil
	}
	return assetId.Int64
}

// --------------------
// 其他端口占位
// --------------------

func handle9100(conn net.Conn, data []byte) {
	// TODO: 在这里实现 0.0.0.0:9100 的协议解析 / 入库 / 回 ACK
}

func handle9200(conn net.Conn, data []byte) {
	// TODO: 在这里实现 127.0.0.1:9200 的协议解析 / 入库 / 回 ACK
}
