package assetControllersModules

import (
	"errors"
	"strconv"
	"strings"
	"time"

	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/support/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var AssetController = &assetController{}

type assetController struct{}

// AddAsset 增
func (a *assetController) AddAsset(context *gin.Context) {
	// 获取id列表
	type AssetParams struct {
		AssetCode string `json:"assetCode"`
		AssetType int    `json:"assetType"`
		Status    int    `json:"status"`
		Quantity  int64  `json:"quantity"`
		TagId     int64  `json:"tagId"`
	}
	var params AssetParams
	err := context.ShouldBind(&params)
	if err != nil {
		utils.Log.Warn("参数绑定失败", "error", err)
utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}

	// 检查 assetCode 是否已存在
	var count int64
	if err := db.GormDB.Table("asset").Where("asset_code = ?", params.AssetCode).Count(&count).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	if count > 0 {
		utils.Response.ParameterTypeError(context, "资产编码已存在")
		return
	}

	tx := db.GormDB.Begin()
	if tx.Error != nil {
		utils.Log.Error("开启事务失败", "error", tx.Error)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}

	asset := types.Asset{
		AssetCode: params.AssetCode,
		AssetType: params.AssetType,
		Status:    params.Status,
		Quantity:  params.Quantity,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// 服务层
	err = tx.Table("asset").Create(&asset).Error
	if err != nil {
		tx.Rollback()
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}

	if params.TagId > 0 {
		var tagCount int64
		if err := tx.Table("asset_tags").
			Where("tag_id = ?", params.TagId).
			Count(&tagCount).Error; err != nil {
			tx.Rollback()
			utils.Log.Error("检查标签绑定失败", "error", err)
			utils.Response.ServerError(context, "操作失败，请稍后重试")
			return
		}
		if tagCount > 0 {
			tx.Rollback()
			utils.Response.ParameterTypeError(context, "标签已绑定其他资产")
			return
		}
		if err := tx.Table("asset_tags").Create(&types.AssetTag{
			AssetId: asset.AssetId,
			TagId:   params.TagId,
		}).Error; err != nil {
			tx.Rollback()
			utils.Log.Error("资产标签绑定失败", "error", err)
			utils.Response.ServerError(context, "操作失败，请稍后重试")
			return
		}
	}

	if err := tx.Commit().Error; err != nil {
		utils.Log.Error("提交事务失败", "error", err)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *assetController) GetAssets(ctx *gin.Context) {
	var params types.QueryAssetParams
	if err := ctx.ShouldBind(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}

	// 校验分页参数
	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)

	// 构建查询
	query := db.GormDB.Table("asset").
		Select("asset.asset_id, asset.asset_code, asset.asset_type, asset.status, asset.created_at, asset.quantity, at.tag_id, asset.updated_at, MIN(group_stores.store_id) as store_id").
		Joins("LEFT JOIN asset_tags AS at ON asset.asset_id = at.asset_id").
		Joins("LEFT JOIN asset_groups ON asset.asset_id = asset_groups.asset_id").
		Joins("LEFT JOIN group_stores ON asset_groups.group_id = group_stores.group_id").
		Group("asset.asset_id, asset.asset_code, asset.asset_type, asset.status, asset.created_at, asset.updated_at, at.tag_id")

	// 添加查询条件
	if params.AssetID > 0 {
		query = query.Where("asset.asset_id = ?", params.AssetID)
	}
	if params.AssetType > 0 {
		query = query.Where("asset.asset_type = ?", params.AssetType)
	}
	if params.Status > 0 {
		query = query.Where("asset.status = ?", params.Status)
	}
	if params.StoreId > 0 {
		query = query.Where("group_stores.store_id = ?", params.StoreId)
	}
	if params.AssetCode != "" {
		query = query.Where("asset.asset_code LIKE ?", "%"+params.AssetCode+"%")
	}
	if params.CreatedAt != "" {
		if t1, t2 := parseTimeRange(params.CreatedAt); !t1.IsZero() && !t2.IsZero() {
			query = query.Where("asset.created_at BETWEEN ? AND ?", t1, t2)
		}
	}
	if params.UpdatedAt != "" {
		if t1, t2 := parseTimeRange(params.UpdatedAt); !t1.IsZero() && !t2.IsZero() {
			query = query.Where("asset.updated_at BETWEEN ? AND ?", t1, t2)
		}
	}

	// 添加排序
	query = query.Order("asset.created_at DESC")

	var total int64
	var assets []types.AssetVO

	// 执行查询
	if err := query.Count(&total).
		Limit(params.Limit).
		Offset(params.Offset).
		Scan(&assets).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	utils.Response.Success(ctx, gin.H{
		"list":  assets,
		"total": total,
	})
}

func (a *assetController) DelAsset(context *gin.Context) {

	// 获取id列表
	var ids []int64
	err := context.ShouldBind(&ids)
	if err != nil {
		utils.Log.Warn("参数绑定失败", "error", err)
utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}

	if len(ids) == 0 {
		utils.Response.ParameterTypeError(context, "资产ID不能为空")
		return
	}

	tx := db.GormDB.Begin()
	if tx.Error != nil {
		utils.Log.Error("开启事务失败", "error", tx.Error)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}

	if err := tx.Table("asset_repairs").Where("asset_id IN ?", ids).Delete(&types.AssetRepairRecord{}).Error; err != nil {
		tx.Rollback()
		utils.Log.Error("删除资产报修记录失败", "error", err)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}

	if err := tx.Table("exception_records").Where("asset_id IN ?", ids).Delete(&types.ExceptionRecord{}).Error; err != nil {
		tx.Rollback()
		utils.Log.Error("删除异常记录失败", "error", err)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}

	if err := tx.Table("asset_groups").Where("asset_id IN ?", ids).Delete(&types.AssetGroup{}).Error; err != nil {
		tx.Rollback()
		utils.Log.Error("删除资产分组关联失败", "error", err)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}

	if err := tx.Table("asset_tags").Where("asset_id IN ?", ids).Delete(&types.AssetTag{}).Error; err != nil {
		tx.Rollback()
		utils.Log.Error("删除资产标签关联失败", "error", err)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}

	err = tx.Table("asset").Delete(&types.Asset{}, ids).Error
	if err != nil {
		tx.Rollback()
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	if err := tx.Commit().Error; err != nil {
		utils.Log.Error("提交事务失败", "error", err)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *assetController) UpdateAsset(context *gin.Context) {
	// 获取
	type AssetParams struct {
		AssetId   int64  `json:"assetId"`
		AssetCode string `json:"assetCode"`
		AssetType int    `json:"assetType"`
		Status    int    `json:"status"`
		Quantity  int64  `json:"quantity"`
		TagId     int64  `json:"tagId"`
	}
	var params AssetParams
	err := context.ShouldBind(&params)
	if err != nil {
		utils.Log.Warn("参数绑定失败", "error", err)
utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}

	// 检查 assetCode 是否已存在(排除自身)
	var count int64
	if err := db.GormDB.Table("asset").
		Where("asset_code = ? AND asset_id != ?", params.AssetCode, params.AssetId).
		Count(&count).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	if count > 0 {
		utils.Response.ParameterTypeError(context, "资产编码已存在")
		return
	}

	tx := db.GormDB.Begin()
	if tx.Error != nil {
		utils.Log.Error("开启事务失败", "error", tx.Error)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}

	if err := tx.Table("asset").Where("asset_id = ?", params.AssetId).Updates(map[string]interface{}{
		"asset_code": params.AssetCode,
		"asset_type": params.AssetType,
		"status":     params.Status,
		"quantity":   params.Quantity,
		"updated_at": time.Now(),
	}).Error; err != nil {
		tx.Rollback()
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}

	if err := tx.Table("asset_tags").Where("asset_id = ?", params.AssetId).Delete(&types.AssetTag{}).Error; err != nil {
		tx.Rollback()
		utils.Log.Error("清除资产标签关联失败", "error", err)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}

	if params.TagId > 0 {
		var tagCount int64
		if err := tx.Table("asset_tags").
			Where("tag_id = ? AND asset_id <> ?", params.TagId, params.AssetId).
			Count(&tagCount).Error; err != nil {
			tx.Rollback()
			utils.Log.Error("检查标签绑定失败", "error", err)
			utils.Response.ServerError(context, "操作失败，请稍后重试")
			return
		}
		if tagCount > 0 {
			tx.Rollback()
			utils.Response.ParameterTypeError(context, "标签已绑定其他资产")
			return
		}
		if err := tx.Table("asset_tags").Create(&types.AssetTag{
			AssetId: params.AssetId,
			TagId:   params.TagId,
		}).Error; err != nil {
			tx.Rollback()
			utils.Log.Error("资产标签绑定失败", "error", err)
			utils.Response.ServerError(context, "操作失败，请稍后重试")
			return
		}
	}

	if err := tx.Commit().Error; err != nil {
		utils.Log.Error("提交事务失败", "error", err)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *assetController) GetStatus(ctx *gin.Context) {
	type AssetStatusStatistic struct {
		Status int   `json:"status"` // 资产状态ID
		Count  int64 `json:"count"`  // 对应数量
	}

	// 资产状态统计响应
	type AssetStatusStatisticsVO struct {
		List []AssetStatusStatistic `json:"list"`
	}

	var result []AssetStatusStatistic
	var assetStatusStatisticsVO AssetStatusStatisticsVO

	// 使用 GORM 分组聚合查询
	err := db.GormDB.
		Table("asset").
		Select("status, COUNT(*) as count").
		Group("status").
		Scan(&result).Error

	if err != nil {
		utils.Log.Error("查询资产状态统计失败", "error", err)
utils.Response.ServerError(ctx, "查询失败，请稍后重试")
		return
	}
	assetStatusStatisticsVO.List = result

	utils.Response.Success(ctx, assetStatusStatisticsVO)
}

func (a *assetController) GetInStorageDistribution(ctx *gin.Context) {
	type InStorageItem struct {
		StoreId   int64  `json:"storeId"`
		StoreName string `json:"storeName"`
		Count     int64  `json:"count"`
	}
	type InStorageVO struct {
		List []InStorageItem `json:"list"`
	}

	var result []InStorageItem
	err := db.GormDB.
		Table("asset AS a").
		Select("IFNULL(a.store_id, 0) AS store_id, IFNULL(s.store_name, '未分配') AS store_name, COUNT(*) AS count").
		Joins("LEFT JOIN stores s ON a.store_id = s.store_id").
		Where("a.status IN ?", []int{1, 4}).
		Group("store_id, store_name").
		Scan(&result).Error
	if err != nil {
		utils.Log.Error("查询在库分布失败", "error", err)
		utils.Response.ServerError(ctx, "查询失败，请稍后重试")
		return
	}

	utils.Response.Success(ctx, InStorageVO{List: result})
}

func (a *assetController) GetAssetBinds(ctx *gin.Context) {
	var params types.AssetBindQueryParams
	if err := ctx.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}
	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)

	query := db.GormDB.Table("asset_tags AS at").
		Select("at.id, at.asset_id, a.asset_code, at.tag_id, t.tag_code").
		Joins("LEFT JOIN asset AS a ON a.asset_id = at.asset_id").
		Joins("LEFT JOIN rfid_tags AS t ON t.id = at.tag_id")

	if params.AssetCode != "" {
		query = query.Where("a.asset_code LIKE ?", "%"+params.AssetCode+"%")
	}
	if params.TagCode != "" {
		query = query.Where("t.tag_code LIKE ?", "%"+params.TagCode+"%")
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		utils.Log.Error("查询资产绑定失败", "error", err)
		utils.Response.ServerError(ctx, "查询失败，请稍后重试")
		return
	}

	var list []types.AssetBindResponse
	if err := query.Order("at.id DESC").Offset(params.Offset).Limit(params.Limit).Scan(&list).Error; err != nil {
		utils.Log.Error("查询资产绑定失败", "error", err)
		utils.Response.ServerError(ctx, "查询失败，请稍后重试")
		return
	}

	utils.Response.Success(ctx, gin.H{
		"list":  list,
		"total": total,
	})
}

func (a *assetController) CreateAssetBind(ctx *gin.Context) {
	var params types.AssetBindCreateParams
	if err := ctx.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}
	if params.AssetCode == "" || params.TagCode == "" {
		utils.Response.ParameterTypeError(ctx, "资产编码和标签编码不能为空")
		return
	}

	var assetId int64
	if err := db.GormDB.Table("asset").Select("asset_id").Where("asset_code = ?", params.AssetCode).Scan(&assetId).Error; err != nil || assetId == 0 {
		utils.Response.ParameterTypeError(ctx, "资产不存在")
		return
	}

	var tagId int64
	if err := db.GormDB.Table("rfid_tags").Select("id").Where("tag_code = ?", params.TagCode).Scan(&tagId).Error; err != nil || tagId == 0 {
		utils.Response.ParameterTypeError(ctx, "标签不存在")
		return
	}

	tx := db.GormDB.Begin()
	if tx.Error != nil {
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	var count int64
	if err := tx.Table("asset_tags").Where("asset_id = ? OR tag_id = ?", assetId, tagId).Count(&count).Error; err != nil {
		tx.Rollback()
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}
	if count > 0 {
		tx.Rollback()
		utils.Response.ParameterTypeError(ctx, "资产或标签已绑定")
		return
	}

	if err := tx.Table("asset_tags").Create(&types.AssetTag{
		AssetId: assetId,
		TagId:   tagId,
	}).Error; err != nil {
		tx.Rollback()
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	if err := tx.Commit().Error; err != nil {
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(ctx)
}

func (a *assetController) UpdateAssetBind(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		utils.Response.ParameterTypeError(ctx, "参数错误")
		return
	}

	var params types.AssetBindUpdateParams
	if err := ctx.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}
	if params.AssetCode == "" || params.TagCode == "" {
		utils.Response.ParameterTypeError(ctx, "资产编码和标签编码不能为空")
		return
	}

	var assetId int64
	if err := db.GormDB.Table("asset").Select("asset_id").Where("asset_code = ?", params.AssetCode).Scan(&assetId).Error; err != nil || assetId == 0 {
		utils.Response.ParameterTypeError(ctx, "资产不存在")
		return
	}

	var tagId int64
	if err := db.GormDB.Table("rfid_tags").Select("id").Where("tag_code = ?", params.TagCode).Scan(&tagId).Error; err != nil || tagId == 0 {
		utils.Response.ParameterTypeError(ctx, "标签不存在")
		return
	}

	tx := db.GormDB.Begin()
	if tx.Error != nil {
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	var count int64
	if err := tx.Table("asset_tags").
		Where("(asset_id = ? OR tag_id = ?) AND id <> ?", assetId, tagId, id).
		Count(&count).Error; err != nil {
		tx.Rollback()
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}
	if count > 0 {
		tx.Rollback()
		utils.Response.ParameterTypeError(ctx, "资产或标签已绑定")
		return
	}

	if err := tx.Table("asset_tags").Where("id = ?", id).Updates(map[string]interface{}{
		"asset_id": assetId,
		"tag_id":   tagId,
	}).Error; err != nil {
		tx.Rollback()
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	if err := tx.Commit().Error; err != nil {
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(ctx)
}

func (a *assetController) DeleteAssetBind(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		utils.Response.ParameterTypeError(ctx, "参数错误")
		return
	}
	if err := db.GormDB.Table("asset_tags").Where("id = ?", id).Delete(&types.AssetTag{}).Error; err != nil {
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(ctx)
}

func (a *assetController) BatchDeleteAssetBind(ctx *gin.Context) {
	var ids []int64
	if err := ctx.ShouldBind(&ids); err != nil {
		utils.Response.ParameterTypeError(ctx, "参数格式错误")
		return
	}
	if len(ids) == 0 {
		utils.Response.ParameterTypeError(ctx, "参数不能为空")
		return
	}
	if err := db.GormDB.Table("asset_tags").Where("id IN ?", ids).Delete(&types.AssetTag{}).Error; err != nil {
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(ctx)
}

func (a *assetController) UpdateType(ctx *gin.Context) {
	var params types.UpdateAssetStatusParams
	if err := ctx.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}
	// 检查资产是否存在
	var asset types.Asset
	if err := db.GormDB.Table("asset").First(&asset, params.AssetId).Error; err != nil {
		utils.Response.ParameterTypeError(ctx, "资产不存在")
		return
	}

	// 更新状态
	if err := db.GormDB.Table("asset").
		Where("asset_id = ?", params.AssetId).
		Update("status", params.Status).Error; err != nil {
		utils.Log.Error("状态更新失败", "error", err)
utils.Response.ServerError(ctx, "更新失败，请稍后重试")
		return
	}

	if params.Status == 3 && params.RepairReason != "" {
		repair := types.AssetRepairRecord{
			AssetID:      params.AssetId,
			RepairReason: params.RepairReason,
		}
		if err := db.GormDB.Table("asset_repairs").Create(&repair).Error; err != nil {
			utils.Log.Error("报修原因写入失败", "error", err, "assetId", params.AssetId)
			utils.Response.ServerError(ctx, "报修原因保存失败，请稍后重试")
			return
		}
	}
	utils.Response.SuccessNoData(ctx)
}

// GetAssetRepairs 获取资产报修记录
func (a *assetController) GetAssetRepairs(ctx *gin.Context) {
	assetIdStr := ctx.Param("assetId")
	if assetIdStr == "" {
		utils.Response.ParameterTypeError(ctx, "assetId不能为空")
		return
	}
	assetId, err := strconv.ParseInt(assetIdStr, 10, 64)
	if err != nil || assetId <= 0 {
		utils.Response.ParameterTypeError(ctx, "assetId格式错误")
		return
	}

	var repairs []types.AssetRepairRecord
	if err := db.GormDB.Table("asset_repairs").
		Where("asset_id = ?", assetId).
		Order("create_time DESC").
		Find(&repairs).Error; err != nil {
		utils.Log.Error("获取报修记录失败", "error", err, "assetId", assetId)
		utils.Response.ServerError(ctx, "获取报修记录失败")
		return
	}

	utils.Response.Success(ctx, gin.H{
		"list": repairs,
	})
}

func (a *assetController) QueryLost(ctx *gin.Context) {
	var params types.QueryLostAssetParams
	if err := ctx.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}
	hours := params.Hours
	if hours <= 0 {
		hours = 24
	}
	timeThreshold := time.Now().Add(-time.Duration(hours) * time.Hour)

	var total int64
	var list []types.LostAssetRecordVO

	// 子查询：找出某 asset_id 是否还有更新记录
	subQuery := db.GormDB.Table("io_records as r2").
		Select("1").
		Where("r2.asset_id = r1.asset_id AND r2.action_time > r1.action_time")

	// 主查询：找出最新为出库且早于阈值的记录
	query := db.GormDB.Table("io_records as r1").
		Select("r1.asset_id, a.asset_code, r1.action_type, r1.action_time, r1.store_from, r1.store_to").
		Joins("LEFT JOIN asset AS a ON r1.asset_id = a.asset_id").
		Where("r1.action_type = ?", 2).
		Where("r1.action_time < ?", timeThreshold).
		Where("NOT EXISTS (?)", subQuery)

	// 总数
	if err := query.Count(&total).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	// 分页查询
	if err := query.
		Order("r1.action_time DESC").
		Limit(params.Limit).
		Offset(params.Offset).
		Scan(&list).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	result := types.HasTotalResponseData{
		List:  list,
		Total: int(total),
	}

	utils.Response.Success(ctx, result)
}

func (a *assetController) GetTrack(ctx *gin.Context) {
	var params types.QueryTrackParams
	if err := ctx.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}

	startTime, err1 := time.Parse("2006-01-02 15:04:05", params.StartTime)
	endTime, err2 := time.Parse("2006-01-02 15:04:05", params.EndTime)
	if err1 != nil || err2 != nil {
		utils.Response.ParameterTypeError(ctx, "时间格式错误，应为 2006-01-02 15:04:05")
		return
	}

	var total int64
	var records []types.MonitorRecordVO

	dbQuery := db.GormDB.Table("monitor AS m").
		Select("m.monitor_id, m.asset_id, a.asset_code, m.gateway_id, g.gateway_name, DATE_FORMAT(m.detection_time, '%Y-%m-%d %H:%i:%s') as detection_time").
		Joins("LEFT JOIN asset AS a ON m.asset_id = a.asset_id").
		Joins("LEFT JOIN gateways AS g ON m.gateway_id = g.id").
		Where("m.detection_time BETWEEN ? AND ?", startTime, endTime)
	if params.AssetCode != "" {
		dbQuery = dbQuery.Where("a.asset_code = ?", params.AssetCode)
	} else if params.AssetId > 0 {
		dbQuery = dbQuery.Where("m.asset_id = ?", params.AssetId)
	}

	// 计算总数
	if err := dbQuery.Count(&total).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	// 分页查询
	if err := dbQuery.
		Order("m.detection_time ASC").
		Limit(params.Limit).
		Offset(params.Offset).
		Scan(&records).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	result := types.HasTotalResponseData{
		List:  records,
		Total: int(total),
	}

	utils.Response.Success(ctx, result)
}

func (a *assetController) GetLocation(ctx *gin.Context) {
	var params struct {
		AssetId   int64  `json:"assetId"`
		AssetCode string `json:"assetCode"`
	}
	if err := ctx.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}

	var monitor types.MonitorRecordVO
	query := db.GormDB.Table("monitor AS m").
		Select("m.monitor_id, m.asset_id, a.asset_code, m.gateway_id, g.gateway_name, DATE_FORMAT(m.detection_time, '%Y-%m-%d %H:%i:%s') as detection_time").
		Joins("LEFT JOIN asset AS a ON m.asset_id = a.asset_id").
		Joins("LEFT JOIN gateways AS g ON m.gateway_id = g.id")
	if params.AssetCode != "" {
		query = query.Where("a.asset_code = ?", params.AssetCode)
	} else if params.AssetId > 0 {
		query = query.Where("m.asset_id = ?", params.AssetId)
	}
	err := query.
		Order("m.detection_time DESC").
		Take(&monitor).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			utils.Response.Success(ctx, nil) // 没查到就返回 null
		} else {
			utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		}
		return
	}

	utils.Response.Success(ctx, monitor)
}

func (a *assetController) GetStores(ctx *gin.Context) {
	var stores []types.Store
	if err := db.GormDB.Find(&stores).Error; err != nil {
		utils.Response.ServerError(ctx, "数据库错误")
		return
	}
	utils.Response.Success(ctx, stores)
}

func (a *assetController) GetGroups(c *gin.Context) {
	var params types.QueryGroupParams
	if err := c.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterError(c, "参数错误")
		return
	}

	var total int64
	var groups []types.Group

	tx := db.GormDB.Model(&types.Group{})
	if params.GroupName != "" {
		tx = tx.Where("group_name LIKE ?", "%"+params.GroupName+"%")
	}
	tx.Count(&total)
	tx.Limit(params.Limit).Offset(params.Offset).Find(&groups)

	// 查找 group_id -> store_id 映射
	var groupIds []int64
	for _, g := range groups {
		groupIds = append(groupIds, g.GroupId)
	}
	var groupStores []types.GroupStore
	db.GormDB.Where("group_id IN ?", groupIds).Find(&groupStores)

	// 构建映射 map[groupId]storeId
	groupStoreMap := make(map[int64]int64)
	for _, gs := range groupStores {
		groupStoreMap[gs.GroupId] = gs.StoreId
	}

	// 组装 VO
	var groupVOs []types.GroupVO
	for _, g := range groups {
		groupVOs = append(groupVOs, types.GroupVO{
			GroupId:   g.GroupId,
			GroupName: g.GroupName,
			StoreId:   groupStoreMap[g.GroupId],
		})
	}

	result := types.HasTotalResponseData{
		List:  groupVOs,
		Total: int(total),
	}
	utils.Response.Success(c, result)
}

func (a *assetController) UpdateAssetGroup(c *gin.Context) {
	type UpdateAssetGroupParams struct {
		AssetId int64 `json:"assetId"`
		GroupId int64 `json:"groupId"`
	}

	var param UpdateAssetGroupParams
	if err := c.ShouldBindJSON(&param); err != nil {
		utils.Response.ParameterError(c, "参数错误")
		return
	}

	var ag types.AssetGroup
	err := db.GormDB.Where("asset_id = ?", param.AssetId).First(&ag).Error
	if err != nil {
		// 插入新记录
		if err := db.GormDB.Create(&types.AssetGroup{
			AssetId: param.AssetId,
			GroupId: param.GroupId,
		}).Error; err != nil {
			utils.Response.ServerError(c, "绑定资产失败")
			return
		}
	} else {
		// 更新旧记录
		ag.GroupId = param.GroupId
		if err := db.GormDB.Save(&ag).Error; err != nil {
			utils.Response.ServerError(c, "更新绑定失败")
			return
		}
	}
	utils.Response.SuccessNoData(c)
}

func (a *assetController) UpdateGroupStore(c *gin.Context) {
	type UpdateGroupStoreParams struct {
		GroupId int64 `json:"groupId"`
		StoreId int64 `json:"storeId"`
	}
	var param UpdateGroupStoreParams
	if err := c.ShouldBindJSON(&param); err != nil {
		utils.Response.ParameterError(c, "参数错误")
		return
	}

	var gs types.GroupStore
	err := db.GormDB.Where("group_id = ?", param.GroupId).First(&gs).Error
	if err != nil {
		// 新增
		if err := db.GormDB.Create(&types.GroupStore{
			GroupId: param.GroupId,
			StoreId: param.StoreId,
		}).Error; err != nil {
			utils.Response.ServerError(c, "设置失败")
			return
		}
	} else {
		// 更新
		gs.StoreId = param.StoreId
		if err := db.GormDB.Save(&gs).Error; err != nil {
			utils.Response.ServerError(c, "更新失败")
			return
		}
	}
	utils.Response.SuccessNoData(c)
}

func (a *assetController) AssetList(c *gin.Context) {
	type AssetVO struct {
		AssetID   int64  `json:"assetId"`
		AssetCode string `json:"assetCode"`
		AssetType int    `json:"assetType"`
		Status    int    `json:"status"`
		GroupId   *int64 `json:"groupId"`
		CreatedAt string `json:"createdAt"`
		UpdatedAt string `json:"updatedAt"`
	}

	var params types.QueryAssetParams
	if err := c.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterError(c, "参数错误")
		return
	}

	var total int64
	var assets []types.Asset

	tx := db.GormDB.Table("asset").Model(&types.Asset{})
	if params.AssetCode != "" {
		tx = tx.Where("asset_code LIKE ?", "%"+params.AssetCode+"%")
	}

	// 统计总数
	tx.Count(&total)

	// 分页查询
	tx.Limit(params.Limit).Offset(params.Offset).Find(&assets)

	// 查询 assetId -> groupId 映射
	var assetIds []int64
	for _, asset := range assets {
		assetIds = append(assetIds, asset.AssetId)
	}

	groupMap := make(map[int64]int64) // assetId -> groupId
	if len(assetIds) > 0 {
		var agList []types.AssetGroup
		db.GormDB.Model(&types.AssetGroup{}).
			Where("asset_id IN ?", assetIds).
			Find(&agList)
		for _, ag := range agList {
			groupMap[ag.AssetId] = ag.GroupId
		}
	}

	// 封装返回数据
	var AssetVOs []AssetVO
	for _, asset := range assets {
		var groupIdPtr *int64
		if gid, ok := groupMap[asset.AssetId]; ok {
			groupIdPtr = &gid
		}
		AssetVOs = append(AssetVOs, AssetVO{
			AssetID:   asset.AssetId,
			AssetCode: asset.AssetCode,
			AssetType: asset.AssetType,
			Status:    asset.Status,
			GroupId:   groupIdPtr,
			CreatedAt: asset.CreatedAt.Format("2006-01-02 15:04:05"),
			UpdatedAt: asset.UpdatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	result := types.HasTotalResponseData{
		List:  AssetVOs,
		Total: int(total),
	}

	utils.Response.Success(c, result)
}

func (a *assetController) QueryFlow(ctx *gin.Context) {
	var params types.QueryExceptionParams
	if err := ctx.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}

	// 校验分页参数
	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)

	dbQuery := db.GormDB.Table("exception_records AS e").
		Select("e.id, e.exception_type, e.asset_id, a.asset_code, e.detection_time, e.status, e.exception_note, e.remark, e.create_time, e.update_time").
		Joins("LEFT JOIN asset AS a ON e.asset_id = a.asset_id")

	// 查询条件
	if params.ExceptionType != nil {
		dbQuery = dbQuery.Where("exception_type = ?", *params.ExceptionType)
	}
	if params.Status != nil {
		dbQuery = dbQuery.Where("status = ?", *params.Status)
	}
	if params.AssetCode != nil && *params.AssetCode != "" {
		dbQuery = dbQuery.Where("a.asset_code = ?", *params.AssetCode)
	} else if params.AssetID != nil {
		dbQuery = dbQuery.Where("e.asset_id = ?", *params.AssetID)
	}
	if params.StartTime != "" && params.EndTime != "" {
		dbQuery = dbQuery.Where("detection_time BETWEEN ? AND ?", params.StartTime, params.EndTime)
	} else if params.StartTime != "" {
		dbQuery = dbQuery.Where("detection_time >= ?", params.StartTime)
	} else if params.EndTime != "" {
		dbQuery = dbQuery.Where("detection_time <= ?", params.EndTime)
	}

	// 查询总数
	var total int64
	if err := dbQuery.Count(&total).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	// 查询数据
	var list []types.ExceptionRecordVO
	if err := dbQuery.Order("detection_time DESC").
		Limit(params.Limit).
		Offset(params.Offset).
		Scan(&list).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	// 返回
	utils.Response.Success(ctx, gin.H{
		"list":  list,
		"total": total,
	})
}

// HandleException 处理单个异常记录
func (a *assetController) HandleException(ctx *gin.Context) {
	var params struct {
		ID         string `json:"id"`
		Status     int    `json:"status"`
		HandleNote string `json:"handleNote"`
	}
	if err := ctx.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}

	// 更新异常记录状态
	if err := db.GormDB.Table("exception_records").
		Where("id = ?", params.ID).
		Updates(map[string]interface{}{
			"status":         params.Status,
			"exception_note": params.HandleNote,
			"update_time":    time.Now(),
		}).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	utils.Response.Success(ctx, nil)
}

// BatchHandleException 批量处理异常记录
func (a *assetController) BatchHandleException(ctx *gin.Context) {
	var params struct {
		IDs        []string `json:"ids"`
		Status     int      `json:"status"`
		HandleNote string   `json:"handleNote"`
	}
	if err := ctx.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}

	// 批量更新异常记录状态
	if err := db.GormDB.Table("exception_records").
		Where("id IN ?", params.IDs).
		Updates(map[string]interface{}{
			"status":         params.Status,
			"exception_note": params.HandleNote,
			"update_time":    time.Now(),
		}).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	utils.Response.Success(ctx, nil)
}

// ExportException 导出异常记录
func (a *assetController) ExportException(ctx *gin.Context) {
	var params types.QueryExceptionParams
	if err := ctx.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}

	// 查询异常记录
	dbQuery := db.GormDB.Table("exception_records AS e").
		Joins("LEFT JOIN asset AS a ON e.asset_id = a.asset_id")

	// 查询条件
	if params.ExceptionType != nil {
		dbQuery = dbQuery.Where("exception_type = ?", *params.ExceptionType)
	}
	if params.Status != nil {
		dbQuery = dbQuery.Where("status = ?", *params.Status)
	}
	if params.AssetCode != nil && *params.AssetCode != "" {
		dbQuery = dbQuery.Where("a.asset_code = ?", *params.AssetCode)
	} else if params.AssetID != nil {
		dbQuery = dbQuery.Where("e.asset_id = ?", *params.AssetID)
	}
	if params.StartTime != "" && params.EndTime != "" {
		dbQuery = dbQuery.Where("detection_time BETWEEN ? AND ?", params.StartTime, params.EndTime)
	} else if params.StartTime != "" {
		dbQuery = dbQuery.Where("detection_time >= ?", params.StartTime)
	} else if params.EndTime != "" {
		dbQuery = dbQuery.Where("detection_time <= ?", params.EndTime)
	}

	var list []types.ExceptionRecord
	if err := dbQuery.Order("e.detection_time DESC").Find(&list).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	// 生成下载链接（这里简化处理，实际应该生成文件）
	downloadURL := "/api/exception/export/download"
	utils.Response.Success(ctx, downloadURL)
}

func parseTimeRange(input string) (time.Time, time.Time) {
	parts := strings.Split(input, ",")
	if len(parts) != 2 {
		return time.Time{}, time.Time{}
	}
	layout := "2006-01-02 15:04:05"
	start, err1 := time.ParseInLocation(layout, strings.TrimSpace(parts[0]), time.Local)
	end, err2 := time.ParseInLocation(layout, strings.TrimSpace(parts[1]), time.Local)
	if err1 != nil || err2 != nil {
		return time.Time{}, time.Time{}
	}
	return start, end
}
