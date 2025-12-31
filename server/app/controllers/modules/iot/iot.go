package iotControllersModules

import (
	"time"

	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/infra/db"
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
	if params.GatewayType != "" {
		query = query.Where("gateway_type LIKE ?", "%"+params.GatewayType+"%")
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
