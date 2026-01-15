package iotControllersModules

import (
	"strconv"
	"strings"
	"time"

	"github.com/Xi-Yuer/cms/domain/types"
	iotResponsiesModules "github.com/Xi-Yuer/cms/domain/types/modules/iot"
	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/infra/tcpserver"
	"github.com/Xi-Yuer/cms/support/utils"
	"github.com/gin-gonic/gin"
)

var IotController = &iotController{}

type iotController struct{}

func (c iotController) AddGateway(context *gin.Context) {
	var gateway types.Gateway
	err := context.ShouldBindJSON(&gateway)
	if err != nil {
		utils.Log.Warn("添加网关参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}

	insertData := map[string]interface{}{
		"gateway_name": gateway.GatewayName,
		"gateway_code": gateway.GatewayCode,
		"gateway_type": gateway.GatewayType,
		"ip_address":   gateway.IpAddress,
		"port":         gateway.Port,
	}

	// Only include status if it's not nil
	if gateway.Status != nil {
		insertData["status"] = *gateway.Status
	}

	if err := db.GormDB.Table("gateways").Create(insertData).Error; err != nil {
		utils.Log.Error("添加网关失败", "error", err, "gateway", gateway)
		utils.Response.ServerError(context, "添加失败，请稍后重试")
		return
	}

	// 触发即时连接（如果是启用状态）
	tcpserver.ConnectGateway(gateway)

	utils.Response.SuccessNoData(context)
}

func (c iotController) DelGateway(context *gin.Context) {
	var ids []string
	err := context.ShouldBindJSON(&ids)
	if err != nil {
		utils.Log.Warn("删除网关参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	if err := db.GormDB.Table("gateways").Delete(&types.Gateway{}, ids).Error; err != nil {
		utils.Log.Error("删除网关失败", "error", err, "gatewayIds", ids)
		utils.Response.ServerError(context, "删除失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c iotController) UpdateGateway(context *gin.Context) {
	var gateway types.Gateway
	err := context.ShouldBindJSON(&gateway)
	if err != nil {
		utils.Log.Warn("更新网关参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}

	updates := map[string]interface{}{
		"gateway_name": gateway.GatewayName,
		"gateway_code": gateway.GatewayCode,
		"gateway_type": gateway.GatewayType,
		"ip_address":   gateway.IpAddress,
		"port":         gateway.Port,
	}

	if gateway.Id == "" {
		utils.Response.ParameterTypeError(context, "id不能为空")
		return
	}

	// Only include status if it's not nil
	if gateway.Status != nil {
		updates["status"] = *gateway.Status
	}

	if err := db.GormDB.Table("gateways").Where("id = ?", gateway.Id).Updates(updates).Error; err != nil {
		utils.Log.Error("更新网关失败", "error", err, "gatewayId", gateway.Id)
		utils.Response.ServerError(context, "更新失败，请稍后重试")
		return
	}

	// Fetch full gateway info to ensure we have IP and Port for connection
	var fullGateway types.Gateway
	if err := db.GormDB.Table("gateways").Where("id = ?", gateway.Id).First(&fullGateway).Error; err == nil {
		// 触发即时连接（配置变更生效）
		tcpserver.ConnectGateway(fullGateway)
	}

	utils.Response.SuccessNoData(context)
}

func (c iotController) GetGateways(context *gin.Context) {
	var params types.QueryGatewaysParams
	if err := context.ShouldBindJSON(&params); err != nil {
		utils.Log.Warn("参数绑定失败", "error", err)
utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)
	query := db.GormDB.Table("gateways")
	if params.GatewayName != "" {
		query = query.Where("gateway_name LIKE ?", "%"+params.GatewayName+"%")
	}
	if params.GatewayCode != "" {
		query = query.Where("gateway_code LIKE ?", "%"+params.GatewayCode+"%")
	}
	if params.GatewayType != 0 {
		query = query.Where("gateway_type = ?", params.GatewayType)
	}
	if params.Status != 0 {
		query = query.Where("status = ?", params.Status)
	}
	var total int64
	var gateways []types.Gateway
	if err := query.Count(&total).
		Limit(params.Limit).
		Offset(params.Offset).
		Find(&gateways).Error; err != nil {
		utils.Response.ServerError(context, "查询失败，请稍后重试")
		return
	}
	utils.Response.Success(context, gin.H{
		"list":  gateways,
		"total": total,
	})
}

func (c iotController) GetOfflineGateways(context *gin.Context) {
	minutes := int64(10)
	if raw := strings.TrimSpace(context.Query("minutes")); raw != "" {
		parsed, err := strconv.ParseInt(raw, 10, 64)
		if err != nil || parsed <= 0 {
			utils.Response.ParameterTypeError(context, "minutes格式错误")
			return
		}
		minutes = parsed
	}
	if minutes > 1440 {
		minutes = 1440
	}

	type OfflineGateway struct {
		ID       int64      `json:"id"`
		Name     string     `json:"gatewayName"`
		Code     string     `json:"gatewayCode"`
		LastSeen *time.Time `json:"lastSeen"`
	}

	cutoff := time.Now().Add(-time.Duration(minutes) * time.Minute)
	var list []OfflineGateway
	if err := db.GormDB.Raw(`
		SELECT
			g.id AS id,
			g.gateway_name AS gateway_name,
			g.gateway_code AS gateway_code,
			MAX(m.detection_time) AS last_seen
		FROM gateways g
		LEFT JOIN monitors m ON m.gateway_id = g.id
		WHERE g.status = 1
		GROUP BY g.id
		HAVING last_seen IS NULL OR last_seen < ?
		ORDER BY last_seen ASC
	`, cutoff).Scan(&list).Error; err != nil {
		utils.Log.Error("查询离线网关失败", "error", err)
		utils.Response.ServerError(context, "查询失败，请稍后重试")
		return
	}

	utils.Response.Success(context, gin.H{
		"list":    list,
		"minutes": minutes,
	})
}

func (c iotController) AddTag(context *gin.Context) {
	var rfidTag types.RfidTagDTO
	err := context.ShouldBindJSON(&rfidTag)
	if err != nil {
		utils.Log.Warn("参数绑定失败", "error", err)
utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}

	insertData := map[string]interface{}{
		"tag_code":    rfidTag.TagCode,
		"electricity": rfidTag.Electricity,
	}

	if rfidTag.Status != nil {
		insertData["status"] = *rfidTag.Status
	}
	if rfidTag.Heartbeat != nil {
		insertData["heartbeat"] = *rfidTag.Heartbeat
	}

	if rfidTag.ReportTime != nil && *rfidTag.ReportTime != "" {
		parsedTime, err := time.Parse("2006-01-02 15:04:05", *rfidTag.ReportTime)
		if err != nil {
			utils.Log.Warn("时间格式错误", "error", err)
utils.Response.ParameterTypeError(context, "时间格式错误")
			return
		}
		insertData["report_time"] = parsedTime
	} else {
		insertData["report_time"] = nil
	}

	if err := db.GormDB.Table("rfid_tags").Create(insertData).Error; err != nil {
		utils.Log.Error("添加标签失败", "error", err, "tag", rfidTag)
		utils.Response.ServerError(context, "添加失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c iotController) DelTag(context *gin.Context) {
	var ids []string
	err := context.ShouldBindJSON(&ids)
	if err != nil {
		utils.Log.Warn("参数绑定失败", "error", err)
utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	if err := db.GormDB.Table("rfid_tags").Delete(&types.RfidTag{}, ids).Error; err != nil {
		utils.Log.Error("删除标签失败", "error", err, "tagIds", ids)
		utils.Response.ServerError(context, "删除失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c iotController) UpdateTag(context *gin.Context) {
	var rfidTag types.RfidTagDTO
	err := context.ShouldBindJSON(&rfidTag)
	if err != nil {
		utils.Log.Warn("参数绑定失败", "error", err)
utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}

	if rfidTag.Id == "" {
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}

	updates := map[string]interface{}{
		"tag_code":    rfidTag.TagCode,
		"electricity": rfidTag.Electricity,
	}

	// Only include status, heartbeat if they are not nil
	if rfidTag.Status != nil {
		updates["status"] = *rfidTag.Status
	}
	if rfidTag.Heartbeat != nil {
		updates["heartbeat"] = *rfidTag.Heartbeat
	}

	if rfidTag.ReportTime != nil && *rfidTag.ReportTime != "" {
		parsedTime, err := time.Parse("2006-01-02 15:04:05", *rfidTag.ReportTime)
		if err != nil {
			utils.Log.Warn("时间格式错误", "error", err)
utils.Response.ParameterTypeError(context, "时间格式错误")
			return
		}
		updates["report_time"] = parsedTime
	} else { // If ReportTime is nil or an empty string from frontend, set to NULL in DB
		updates["report_time"] = nil
	}

	if err := db.GormDB.Table("rfid_tags").Where("id = ?", rfidTag.Id).Updates(updates).Error; err != nil {
		utils.Log.Error("更新标签失败", "error", err, "tagId", rfidTag.Id)
		utils.Response.ServerError(context, "更新失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c iotController) GetTags(context *gin.Context) {
	var params types.QueryRfidTagsParams
	if err := context.ShouldBindJSON(&params); err != nil {
		utils.Log.Warn("参数绑定失败", "error", err)
utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)
	query := db.GormDB.Table("rfid_tags")
	if params.TagCode != "" {
		query = query.Where("tag_code LIKE ?", "%"+params.TagCode+"%")
	}
	if params.Status != nil {
		query = query.Where("status = ?", *params.Status)
	}
	if params.Heartbeat != nil {
		query = query.Where("heartbeat LIKE ?", "%"+*params.Heartbeat+"%")
	}
	if params.ReportTime != nil {
		query = query.Where("report_time = ?", *params.ReportTime)
	}

	var total int64
	var rfidTags []types.RfidTag
	if err := query.Count(&total).
		Limit(params.Limit).
		Offset(params.Offset).
		Find(&rfidTags).Error; err != nil {
		utils.Log.Error("查询标签失败", "error", err)
		utils.Response.ServerError(context, "查询失败，请稍后重试")
		return
	}
	utils.Response.Success(context, gin.H{
		"list":  rfidTags,
		"total": total,
	})
}

// GetTagMap 获取标签ID和编码的映射
func (c iotController) GetTagMap(context *gin.Context) {
	type TagMap struct {
		Id      string `json:"id"`
		TagCode string `json:"tagCode"`
	}

	var tags []TagMap
	if err := db.GormDB.Table("rfid_tags").
		Select("id, tag_code").
		Find(&tags).Error; err != nil {
		utils.Log.Error("查询标签映射失败", "error", err)
		utils.Response.ServerError(context, "查询失败，请稍后重试")
		return
	}

	utils.Response.Success(context, tags)
}

func (c iotController) GetInventoryDetails(context *gin.Context) {
	var params iotResponsiesModules.QueryInventoryDetailParams
	if err := context.ShouldBindJSON(&params); err != nil {
		utils.Log.Warn("参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)

	query := db.GormDB.Table("inventory_records AS r").
		Select(`
			r.id, r.tag_code, r.asset_id, r.store_id, r.gateway_id,
			r.inventory_time, r.rssi, r.antenna_num, r.battery_level,
			r.pc_value, r.additional_category, r.inventory_status, r.remark,
			r.created_at, a.asset_code
		`).
		Joins("LEFT JOIN asset AS a ON r.asset_id = a.asset_id")

	if params.AssetCode != "" {
		query = query.Where("a.asset_code = ?", params.AssetCode)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		utils.Log.Error("查询盘点详情失败", "error", err)
		utils.Response.ServerError(context, "查询失败，请稍后重试")
		return
	}

	var inventoryDetails []iotResponsiesModules.InventoryDetail
	if err := query.
		Order("r.inventory_time DESC").
		Offset(params.Offset).
		Limit(params.Limit).
		Scan(&inventoryDetails).Error; err != nil {
		utils.Log.Error("查询盘点详情失败", "error", err)
		utils.Response.ServerError(context, "查询失败，请稍后重试")
		return
	}

	utils.Response.Success(context, gin.H{
		"list":  inventoryDetails,
		"total": total,
	})
}

func (c iotController) GetInventoryStatusTrend(context *gin.Context) {
	var trendItems []iotResponsiesModules.InventoryStatusTrendItem
	query := `
		SELECT
			DATE_FORMAT(r.inventory_time, '%Y-%m-%d %H:00') AS time,
			r.inventory_status AS inventory_status,
			IFNULL(a.asset_type, 0) AS asset_type,
			COUNT(*) AS count
		FROM inventory_records r
		LEFT JOIN asset a ON r.asset_id = a.asset_id
		WHERE r.inventory_time >= DATE_SUB(NOW(), INTERVAL 12 HOUR)
		GROUP BY time, inventory_status, asset_type
		ORDER BY time ASC, inventory_status ASC, asset_type ASC
	`

	if err := db.GormDB.Raw(query).Scan(&trendItems).Error; err != nil {
		utils.Log.Error("查询盘点状态趋势失败", "error", err)
		utils.Response.ServerError(context, "查询失败，请稍后重试")
		return
	}

	utils.Response.Success(context, gin.H{
		"list": trendItems,
	})
}
