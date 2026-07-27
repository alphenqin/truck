package tcpserver

import (
	"bytes"
	"database/sql"
	"encoding/hex"
	"errors"
	"fmt"
	"net"
	"strings"
	"sync"
	"time"

	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/support/utils"
	"gorm.io/gorm"
)

const (
	recordWorkerCount = 4
	recordQueueSize   = 1024
	tagDedupWindow    = 2 * time.Second
)

type gatewayInfo struct {
	ID   int64
	Type int
}

type tagObservation struct {
	UID                string
	PCValue            string
	Battery            string
	RSSI               int
	Antenna            int
	AdditionalCategory int
	ObservedAt         time.Time
	DeviceAddr         string
	Gateway            gatewayInfo
}

var (
	connBuffers    sync.Map // key: connKey(conn) -> *bytes.Buffer
	gatewayInfoMap sync.Map // key: IP:Port -> gatewayInfo

	queueOnce       sync.Once
	recordQueue     chan tagObservation
	recordQueueMu   sync.RWMutex
	recordClosing   bool
	recordWg        sync.WaitGroup
	recordWorkersWg sync.WaitGroup

	dedupMu       sync.Mutex
	lastTagReport = make(map[string]time.Time)
	tagSyncMu     sync.Mutex
)

func SetGatewayInfo(addr string, gatewayID int64, gatewayType int) {
	gatewayInfoMap.Store(addr, gatewayInfo{ID: gatewayID, Type: gatewayType})
}

func DeleteGatewayInfo(addr string) {
	gatewayInfoMap.Delete(addr)
}

func getGatewayInfo(addr string) (gatewayInfo, bool) {
	value, ok := gatewayInfoMap.Load(addr)
	if !ok {
		return gatewayInfo{}, false
	}
	info, ok := value.(gatewayInfo)
	return info, ok
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

// parseFrame 解析单帧。协议当前仅支持 1、10、18 字节数据区；遇到非法长度或
// 校验失败时前移一个字节重新同步，避免一个坏包永久堵塞整条 TCP 字节流。
func parseFrame(frameData []byte, deviceAddr string) (bool, int) {
	if len(frameData) < 6 {
		return false, 0
	}

	dataLen := int(frameData[4]) + int(frameData[5])*256
	if dataLen != 1 && dataLen != 10 && dataLen != 18 {
		return true, 1
	}

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
		utils.Log.Warn("标签帧 BCC 校验失败", "device", deviceAddr)
		return true, 1
	}

	switch dataLen {
	case 1:
		parseAckFrame(data, deviceAddr)
	case 10:
		parseTagFrame(data, deviceAddr, false)
	case 18:
		parseTagFrame(data, deviceAddr, true)
	}
	return true, totalLen
}

func parseAckFrame(data []byte, deviceAddr string) {
	utils.Log.Info("收到设备确认帧", "device", deviceAddr, "status", data[0])
}

func parseTagFrame(data []byte, deviceAddr string, hasDeviceTime bool) {
	minimumLength := 10
	if hasDeviceTime {
		minimumLength = 18
	}
	if len(data) < minimumLength || data[0] == 0 {
		return
	}

	info, ok := getGatewayInfo(deviceAddr)
	if !ok || info.Type < 1 || info.Type > 3 {
		utils.Log.Warn("收到未登记网关的数据，已忽略", "device", deviceAddr)
		return
	}

	observedAt := time.Now()
	if hasDeviceTime {
		parsed, err := parseDeviceTime(data[9:17])
		if err != nil {
			utils.Log.Warn("设备时间无效，改用服务器当前时间", "device", deviceAddr, "error", err)
		} else {
			observedAt = parsed
		}
	}

	observation := tagObservation{
		UID:                strings.ToLower(hex.EncodeToString(data[4:8])),
		RSSI:               int(int8(data[1])),
		PCValue:            fmt.Sprintf("%02X", data[2]),
		Battery:            fmt.Sprintf("%02X", data[3]),
		Antenna:            int(data[8]),
		AdditionalCategory: int(data[len(data)-1]),
		ObservedAt:         observedAt,
		DeviceAddr:         deviceAddr,
		Gateway:            info,
	}

	dedupKey := fmt.Sprintf("%s|%d|%s", deviceAddr, info.Type, observation.UID)
	if !acceptTagReport(dedupKey, time.Now()) {
		return
	}

	utils.Log.Info("收到标签", "gatewayId", info.ID, "gatewayType", info.Type,
		"uid", observation.UID, "rssi", observation.RSSI, "antenna", observation.Antenna)
	enqueueRecord(observation)
}

func parseDeviceTime(data []byte) (time.Time, error) {
	if len(data) != 8 {
		return time.Time{}, errors.New("设备时间长度错误")
	}
	for i := 0; i < 6; i++ {
		if data[i]>>4 > 9 || data[i]&0x0f > 9 {
			return time.Time{}, errors.New("设备时间不是有效 BCD")
		}
	}
	year := 2000 + bcdToDec(data[0])
	month := bcdToDec(data[1])
	day := bcdToDec(data[2])
	hour := bcdToDec(data[3])
	minute := bcdToDec(data[4])
	second := bcdToDec(data[5])
	millisecond := int(data[6])*256 + int(data[7])
	if month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59 || second > 59 || millisecond > 999 {
		return time.Time{}, errors.New("设备时间字段超出范围")
	}
	t := time.Date(year, time.Month(month), day, hour, minute, second, millisecond*int(time.Millisecond), time.Local)
	if t.Year() != year || int(t.Month()) != month || t.Day() != day {
		return time.Time{}, errors.New("设备日期无效")
	}
	return t, nil
}

func bcdToDec(b byte) int {
	return int(b>>4)*10 + int(b&0x0f)
}

func acceptTagReport(key string, now time.Time) bool {
	dedupMu.Lock()
	defer dedupMu.Unlock()
	if previous, ok := lastTagReport[key]; ok && now.Sub(previous) < tagDedupWindow {
		return false
	}
	lastTagReport[key] = now
	if len(lastTagReport) > 10000 {
		cutoff := now.Add(-time.Minute)
		for reportKey, reportedAt := range lastTagReport {
			if reportedAt.Before(cutoff) {
				delete(lastTagReport, reportKey)
			}
		}
	}
	return true
}

func ensureRecordWorkers() {
	queueOnce.Do(func() {
		recordQueue = make(chan tagObservation, recordQueueSize)
		for i := 0; i < recordWorkerCount; i++ {
			recordWorkersWg.Add(1)
			go recordWorker()
		}
	})
}

func enqueueRecord(observation tagObservation) {
	ensureRecordWorkers()
	recordQueueMu.RLock()
	if recordClosing {
		recordQueueMu.RUnlock()
		utils.Log.Warn("标签记录队列已关闭，丢弃记录", "uid", observation.UID)
		return
	}
	recordWg.Add(1)
	select {
	case recordQueue <- observation:
		recordQueueMu.RUnlock()
	default:
		recordWg.Done()
		recordQueueMu.RUnlock()
		utils.Log.Warn("标签记录队列已满，丢弃记录", "uid", observation.UID, "device", observation.DeviceAddr)
	}
}

func recordWorker() {
	defer recordWorkersWg.Done()
	for observation := range recordQueue {
		if err := saveRecordToDB(observation); err != nil {
			utils.Log.Error("保存标签记录失败", "error", err, "uid", observation.UID,
				"gatewayId", observation.Gateway.ID, "gatewayType", observation.Gateway.Type)
		}
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

type assetContext struct {
	AssetID sql.NullInt64 `gorm:"column:asset_id"`
	StoreID sql.NullInt64 `gorm:"column:store_id"`
	Status  sql.NullInt64 `gorm:"column:status"`
}

func saveRecordToDB(observation tagObservation) error {
	// 防止四个工作线程同时为同一个新 UID 创建重复标签。数据库升级脚本还会增加唯一索引。
	tagSyncMu.Lock()
	defer tagSyncMu.Unlock()

	return db.GormDB.Transaction(func(tx *gorm.DB) error {
		asset, err := syncTagAndResolveAsset(tx, observation)
		if err != nil {
			return err
		}

		assetID := nullableInt64(asset.AssetID)
		storeID := nullableInt64(asset.StoreID)
		status := 1
		if asset.Status.Valid && asset.Status.Int64 >= 1 && asset.Status.Int64 <= 7 {
			status = int(asset.Status.Int64)
		}

		switch observation.Gateway.Type {
		case 1:
			record := map[string]interface{}{
				"tag_code": observation.UID, "asset_id": assetID, "action_type": 1,
				"action_time": observation.ObservedAt, "store_to": storeID,
			}
			if err := tx.Table("io_records").Create(&record).Error; err != nil {
				return fmt.Errorf("写入入库记录: %w", err)
			}
			if asset.AssetID.Valid {
				if err := tx.Table("asset").Where("asset_id = ?", asset.AssetID.Int64).
					Updates(map[string]interface{}{"status": 1, "updated_at": time.Now()}).Error; err != nil {
					return fmt.Errorf("更新入库资产状态: %w", err)
				}
			}
		case 2:
			record := map[string]interface{}{
				"tag_code": observation.UID, "asset_id": assetID, "action_type": 2,
				"action_time": observation.ObservedAt, "store_from": storeID,
			}
			if err := tx.Table("io_records").Create(&record).Error; err != nil {
				return fmt.Errorf("写入出库记录: %w", err)
			}
			if asset.AssetID.Valid {
				if err := tx.Table("asset").Where("asset_id = ?", asset.AssetID.Int64).
					Updates(map[string]interface{}{"status": 2, "updated_at": time.Now()}).Error; err != nil {
					return fmt.Errorf("更新出库资产状态: %w", err)
				}
			}
		case 3:
			record := map[string]interface{}{
				"tag_code": observation.UID, "asset_id": assetID, "store_id": storeID,
				"gateway_id": observation.Gateway.ID, "inventory_time": observation.ObservedAt,
				"rssi": observation.RSSI, "antenna_num": observation.Antenna,
				"battery_level": observation.Battery, "pc_value": observation.PCValue,
				"additional_category": observation.AdditionalCategory,
				"inventory_status":    status,
			}

			// 资产与标签的组合在盘点表中保持唯一。网关再次扫描到同一组合时只更新
			// 原记录的时间和读数；解除绑定后改绑到其他资产，才会形成新的组合。
			type existingInventory struct {
				ID int64 `gorm:"column:id"`
			}
			var existing existingInventory
			existingQuery := tx.Table("inventory_records").Select("id").Where("tag_code = ?", observation.UID)
			if asset.AssetID.Valid {
				existingQuery = existingQuery.Where("asset_id = ?", asset.AssetID.Int64)
			} else {
				existingQuery = existingQuery.Where("asset_id IS NULL")
			}
			err := existingQuery.Order("id DESC").Take(&existing).Error
			switch {
			case err == nil:
				// 顺便清理修复前遗留的同组合重复行，使已经再次扫描过的组合在数据库中也只剩一条。
				if err := tx.Exec(
					"DELETE FROM inventory_records WHERE id <> ? AND tag_code = ? AND asset_id <=> ?",
					existing.ID, observation.UID, assetID,
				).Error; err != nil {
					return fmt.Errorf("清理重复盘点记录: %w", err)
				}
				if err := tx.Table("inventory_records").Where("id = ?", existing.ID).Updates(record).Error; err != nil {
					return fmt.Errorf("更新盘点记录: %w", err)
				}
			case errors.Is(err, gorm.ErrRecordNotFound):
				record["created_at"] = time.Now()
				if err := tx.Table("inventory_records").Create(&record).Error; err != nil {
					return fmt.Errorf("写入盘点记录: %w", err)
				}
			default:
				return fmt.Errorf("查询重复盘点记录: %w", err)
			}
		default:
			return fmt.Errorf("不支持的网关类型: %d", observation.Gateway.Type)
		}

		if observation.Gateway.ID > 0 {
			monitor := map[string]interface{}{
				"asset_id": assetID, "gateway_id": observation.Gateway.ID, "detection_time": observation.ObservedAt,
			}
			if err := tx.Table("monitors").Create(&monitor).Error; err != nil {
				return fmt.Errorf("写入网关监控记录: %w", err)
			}
		}
		return nil
	})
}

func syncTagAndResolveAsset(tx *gorm.DB, observation tagObservation) (assetContext, error) {
	type tagRow struct {
		ID int64 `gorm:"column:id"`
	}
	var tag tagRow
	err := tx.Table("rfid_tags").Select("id").Where("tag_code = ?", observation.UID).Take(&tag).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		created := map[string]interface{}{
			"tag_code": observation.UID, "status": 1, "report_time": observation.ObservedAt,
			"electricity": observation.Battery, "heartbeat": tagHeartbeat(observation),
		}
		if err := tx.Table("rfid_tags").Create(&created).Error; err != nil {
			return assetContext{}, fmt.Errorf("自动创建标签: %w", err)
		}
		if err := tx.Table("rfid_tags").Select("id").Where("tag_code = ?", observation.UID).Take(&tag).Error; err != nil {
			return assetContext{}, fmt.Errorf("读取新标签: %w", err)
		}
	} else if err != nil {
		return assetContext{}, fmt.Errorf("查询标签: %w", err)
	} else {
		updates := map[string]interface{}{
			"status": 1, "report_time": observation.ObservedAt,
			"electricity": observation.Battery, "heartbeat": tagHeartbeat(observation),
		}
		if err := tx.Table("rfid_tags").Where("id = ?", tag.ID).Updates(updates).Error; err != nil {
			return assetContext{}, fmt.Errorf("更新标签状态: %w", err)
		}
	}

	var asset assetContext
	err = tx.Table("asset_tags AS at").
		Select("a.asset_id, a.store_id, a.status").
		Joins("JOIN asset AS a ON a.asset_id = at.asset_id").
		Where("at.tag_id = ?", tag.ID).
		Take(&asset).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return assetContext{}, nil
	}
	if err != nil {
		return assetContext{}, fmt.Errorf("查询标签绑定资产: %w", err)
	}
	return asset, nil
}

func tagHeartbeat(observation tagObservation) string {
	return fmt.Sprintf("gateway=%d;rssi=%d;antenna=%d", observation.Gateway.ID, observation.RSSI, observation.Antenna)
}

func nullableInt64(value sql.NullInt64) interface{} {
	if !value.Valid {
		return nil
	}
	return value.Int64
}

// 其他端口占位。
func handle9100(conn net.Conn, data []byte) {}
func handle9200(conn net.Conn, data []byte) {}
