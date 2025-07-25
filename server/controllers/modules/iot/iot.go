package iotControllersModules

import (
	"time"

	"github.com/Xi-Yuer/cms/db"
	"github.com/Xi-Yuer/cms/dto"
	"github.com/Xi-Yuer/cms/utils"
	"github.com/gin-gonic/gin"
)

var IotController = &iotController{}

type iotController struct{}

func (c iotController) AddGateway(context *gin.Context) {
	var gateway dto.Gateway
	err := context.ShouldBindJSON(&gateway)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
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
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c iotController) DelGateway(context *gin.Context) {
	var ids []string
	err := context.ShouldBindJSON(&ids)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := db.GormDB.Table("gateways").Delete(&dto.Gateway{}, ids).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c iotController) UpdateGateway(context *gin.Context) {
	var gateway dto.Gateway
	err := context.ShouldBindJSON(&gateway)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}

	updates := map[string]interface{}{
		"gateway_name": gateway.GatewayName,
		"gateway_code": gateway.GatewayCode,
		"gateway_type": gateway.GatewayType,
	}

	if gateway.Id == "" {
		utils.Response.ParameterTypeError(context, "id is required for update")
		return
	}

	// Only include status if it's not nil
	if gateway.Status != nil {
		updates["status"] = *gateway.Status
	}

	if err := db.GormDB.Table("gateways").Where("id = ?", gateway.Id).Updates(updates).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c iotController) GetGateways(context *gin.Context) {
	var params dto.QueryGatewaysParams
	if err := context.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if params.Limit <= 0 || params.Limit > 100 {
		params.Limit = 10
	}
	if params.Offset < 0 {
		params.Offset = 0
	}
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
	var gateways []dto.Gateway
	if err := query.Count(&total).
		Limit(params.Limit).
		Offset(params.Offset).
		Find(&gateways).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.Success(context, gin.H{
		"list":  gateways,
		"total": total,
	})
}

func (c iotController) AddTag(context *gin.Context) {
	var rfidTag dto.RfidTagDTO
	err := context.ShouldBindJSON(&rfidTag)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
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
			utils.Response.ParameterTypeError(context, "Invalid reportTime format: "+err.Error())
			return
		}
		insertData["report_time"] = parsedTime
	} else {
		insertData["report_time"] = nil
	}

	if err := db.GormDB.Table("rfid_tags").Create(insertData).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c iotController) DelTag(context *gin.Context) {
	var ids []string
	err := context.ShouldBindJSON(&ids)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := db.GormDB.Table("rfid_tags").Delete(&dto.RfidTag{}, ids).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c iotController) UpdateTag(context *gin.Context) {
	var rfidTag dto.RfidTagDTO
	err := context.ShouldBindJSON(&rfidTag)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}

	if rfidTag.Id == "" {
		utils.Response.ParameterTypeError(context, "id is required for update")
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
			utils.Response.ParameterTypeError(context, "Invalid reportTime format: "+err.Error())
			return
		}
		updates["report_time"] = parsedTime
	} else { // If ReportTime is nil or an empty string from frontend, set to NULL in DB
		updates["report_time"] = nil
	}

	if err := db.GormDB.Table("rfid_tags").Where("id = ?", rfidTag.Id).Updates(updates).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c iotController) GetTags(context *gin.Context) {
	var params dto.QueryRfidTagsParams
	if err := context.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if params.Limit <= 0 || params.Limit > 100 {
		params.Limit = 10
	}
	if params.Offset < 0 {
		params.Offset = 0
	}
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
	var rfidTags []dto.RfidTag
	if err := query.Count(&total).
		Limit(params.Limit).
		Offset(params.Offset).
		Find(&rfidTags).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
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
		utils.Response.ServerError(context, err.Error())
		return
	}

	utils.Response.Success(context, tags)
}
