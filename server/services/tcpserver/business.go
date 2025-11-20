package tcpserver

import (
	"bytes"
	"encoding/hex"
	"fmt"
	"net"
	"sync"
	"time"

	"github.com/Xi-Yuer/cms/db"
	"github.com/Xi-Yuer/cms/dto"
	"github.com/Xi-Yuer/cms/utils"
)

// --------------------
// in 业务处理逻辑
// --------------------

var (
	// 使用连接级缓冲处理粘包/半包
	connBuffers sync.Map // key: connKey(conn) -> *bytes.Buffer
)

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
	case 10:
		parseNoTimeFrame(data, deviceAddr)
	case 18:
		parseWithTimeFrame(data, deviceAddr)
	}

	return true, totalLen
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
	batStr := fmt.Sprintf("%02X", batteryLevel)

	printLine(uid, pcValue, batStr, rssi, antennaNum, time.Now().Format("2006-01-02 15:04:05"), deviceAddr)
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
	batStr := fmt.Sprintf("%02X", batteryLevel)

	printLine(uid, pcValue, batStr, rssi, antennaNum, readTime, deviceAddr)
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

func printLine(uid, pcValue, batStr string, rssi, antenna int, ts, deviceAddr string) {
	switch deviceAddr {
	case "192.168.1.168:20058":
		fmt.Printf("[入库设备] UID=%s PC=%s Bat=%s RSSI=%d Ant=%d Time=%s Dev=%s\n",
			uid, pcValue, batStr, rssi, antenna, ts, deviceAddr)
		go saveRecordToDB(uid, pcValue, batStr, rssi, antenna, ts, deviceAddr)

	case "192.168.1.168:20059":
		fmt.Printf("[出库设备] UID=%s PC=%s Bat=%s RSSI=%d Ant=%d Time=%s Dev=%s\n",
			uid, pcValue, batStr, rssi, antenna, ts, deviceAddr)
		go saveRecordToDB(uid, pcValue, batStr, rssi, antenna, ts, deviceAddr)

	case "192.168.1.168:20060":
		fmt.Printf("[出库设备] 发送MQ消息 UID=%s\n", uid)
		go saveRecordToDB(uid, pcValue, batStr, rssi, antenna, ts, deviceAddr)

	default:
		// 其他设备：打印警告
		fmt.Printf("[未知设备 %s] UID=%s PC=%s Bat=%s RSSI=%d Ant=%d Time=%s\n",
			deviceAddr, uid, pcValue, batStr, rssi, antenna, ts)
	}
}
func saveRecordToDB(uid, pcValue, batStr string, rssi, antenna int, ts, deviceAddr string) {
	// 1. 根据 deviceAddr 判断动作类型和仓库位置
	var actionType int // 1=入库，2=出库

	switch deviceAddr {
	case "192.168.1.168:20058": // 入库设备
		actionType = 1
	case "192.168.1.170:20060": // 出库设备
		actionType = 2
	default:
		return
	}

	// 2. 解析时间字符串为 time.Time
	t, err := time.Parse("2006-01-02 15:04:05", ts)
	if err != nil {
		t = time.Now()
	}

	// 3. 生成入库对象
	record := dto.IoRecord{
		TagCode:    uid,
		ActionType: actionType,
		ActionTime: &t,
	}

	// 4. 写入数据库
	if err := db.GormDB.Create(&record).Error; err != nil {
		utils.Log.Error("写入IoRecord失败", "error", err)
	} else {
		utils.Log.Info("成功写入IoRecord", "assetId", record.AssetId, "actionType", record.ActionType)
	}
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

// RegisterBusinessHandlers 将三个监听地址与各自处理函数进行绑定
func RegisterBusinessHandlers() {
	// 按远端设备 IP+端口分发（严格匹配）
	RegisterRemoteHandler("192.168.1.168:20058", handle)

	// 仍保留按本地监听地址分发的示例（可选）
	RegisterHandler("0.0.0.0:9100", handle9100)
	RegisterHandler("127.0.0.1:9200", handle9200)
}
