package assetControllersModules

import (
	"strconv"
	"time"

	"github.com/Xi-Yuer/cms/domain/constant"
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/support/utils"
)

// getArgInt 按 arg_key 读取业务参数并解析为整数，失败或不存在时回退到 defaultVal。
func getArgInt(key string, defaultVal int) int {
	var arg types.Arg
	if err := db.GormDB.Table("args").Where("arg_key = ?", key).First(&arg).Error; err != nil {
		return defaultVal
	}
	v, err := strconv.Atoi(arg.ArgValue)
	if err != nil || v <= 0 {
		return defaultVal
	}
	return v
}

// RunStatusDetection 根据业务参数阈值扫描资产，把符合"疑似丢失"/"呆滞"的资产状态物化写入 asset.status。
//   - 疑似丢失(7)：最新一条 io_records 是出库(action_type=2)且距今超过 lost_timeout 小时
//   - 呆滞(6)：最新一条 io_records 是入库(action_type=1)且距今超过 idle_timeout 小时
//
// 恢复由 business.go 在每次新出入库时将 status 重置为 1/2 完成。
func RunStatusDetection() {
	lostHours := getArgInt(constant.ArgKeyLostTimeout, 24)
	idleHours := getArgInt(constant.ArgKeyIdleTimeout, 168)

	now := time.Now()
	lostThreshold := now.Add(-time.Duration(lostHours) * time.Hour)
	idleThreshold := now.Add(-time.Duration(idleHours) * time.Hour)

	// 疑似丢失：最新动作为出库且早于阈值
	if err := db.GormDB.Exec(`
		UPDATE asset SET status = 7, updated_at = ?
		WHERE status NOT IN (6, 7)
		  AND asset_id IN (
		    SELECT r1.asset_id FROM io_records r1
		    WHERE r1.action_type = 2
		      AND r1.action_time < ?
		      AND NOT EXISTS (
		        SELECT 1 FROM io_records r2
		        WHERE r2.asset_id = r1.asset_id AND r2.action_time > r1.action_time
		      )
		  )
	`, now, lostThreshold).Error; err != nil {
		utils.Log.Error("疑似丢失状态检测失败", "error", err)
	}

	// 呆滞：最新动作为入库且早于阈值
	if err := db.GormDB.Exec(`
		UPDATE asset SET status = 6, updated_at = ?
		WHERE status NOT IN (6, 7)
		  AND asset_id IN (
		    SELECT r1.asset_id FROM io_records r1
		    WHERE r1.action_type = 1
		      AND r1.action_time < ?
		      AND NOT EXISTS (
		        SELECT 1 FROM io_records r2
		        WHERE r2.asset_id = r1.asset_id AND r2.action_time > r1.action_time
		      )
		  )
	`, now, idleThreshold).Error; err != nil {
		utils.Log.Error("呆滞状态检测失败", "error", err)
	}
}
