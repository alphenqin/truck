package assetControllersModules

import (
	"errors"
	"github.com/Xi-Yuer/cms/db"
	"github.com/Xi-Yuer/cms/dto"
	"github.com/Xi-Yuer/cms/services"
	"github.com/Xi-Yuer/cms/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"strings"
	"time"
)

var AssetController = &assetController{}

type assetController struct{}

// AddAsset 增
func (a *assetController) AddAsset(context *gin.Context) {

	// 获取id列表
	var asset dto.Asset
	err := context.ShouldBind(&asset)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	// 服务层
	err = services.AssetService.AddAsset(asset)
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *assetController) GetAssets(ctx *gin.Context) {
	var params dto.QueryAssetParams
	if err := ctx.ShouldBind(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}

	// 校验 limit 合法范围
	if params.Limit <= 0 || params.Limit > 100 {
		params.Limit = 10 // 默认分页
	}
	if params.Offset < 0 {
		params.Offset = 0
	}

	// 构建查询条件
	query := db.GormDB.Table("asset")

	if params.AssetID > 0 {
		query = query.Where("id = ?", params.AssetID)
	}
	if params.AssetCode != "" {
		query = query.Where("asset_code = ?", params.AssetCode)
	}
	if params.AssetType > 0 {
		query = query.Where("asset_type = ?", params.AssetType)
	}
	if params.Status > 0 {
		query = query.Where("status = ?", params.Status)
	}
	if params.StoreId > 0 {
		query = query.Where("store_id = ?", params.StoreId)
	}
	if params.DepartmentId > 0 {
		query = query.Where("department_id = ?", params.DepartmentId)
	}
	if params.GardenId > 0 {
		query = query.Where("garden_id = ?", params.GardenId)
	}

	// 时间范围处理，例如 "2025-06-01,2025-06-04"
	if params.CreatedAt != "" {
		if t1, t2 := parseTimeRange(params.CreatedAt); !t1.IsZero() && !t2.IsZero() {
			query = query.Where("created_at BETWEEN ? AND ?", t1, t2)
		}
	}
	if params.UpdatedAt != "" {
		if t1, t2 := parseTimeRange(params.UpdatedAt); !t1.IsZero() && !t2.IsZero() {
			query = query.Where("updated_at BETWEEN ? AND ?", t1, t2)
		}
	}

	var total int64
	var assets []dto.Asset

	// 分页 + 查询
	if err := query.Count(&total).
		Limit(params.Limit).
		Offset(params.Offset).
		Find(&assets).Error; err != nil {
		utils.Response.ServerError(ctx, err.Error())
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
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	// 服务层
	err = services.AssetService.DelAssets(ids)
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *assetController) UpdateAsset(context *gin.Context) {

	// 获取
	var asset dto.Asset
	err := context.ShouldBind(&asset)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	// 服务层
	err = services.AssetService.UpdateAsset(asset)
	if err != nil {
		utils.Response.ServerError(context, err.Error())
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
		utils.Response.ServerError(ctx, "查询资产状态统计失败: "+err.Error())
		return
	}
	assetStatusStatisticsVO.List = result

	utils.Response.Success(ctx, assetStatusStatisticsVO)
}

func (a *assetController) UpdateType(ctx *gin.Context) {
	var params dto.UpdateAssetStatusParams
	if err := ctx.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}
	// 检查资产是否存在
	var asset dto.Asset
	if err := db.GormDB.Table("asset").First(&asset, params.AssetId).Error; err != nil {
		utils.Response.ParameterTypeError(ctx, "资产不存在")
		return
	}

	// 更新状态
	if err := db.GormDB.Table("asset").
		Where("asset_id = ?", params.AssetId).
		Update("status", params.Status).Error; err != nil {
		utils.Response.ServerError(ctx, "状态更新失败: "+err.Error())
		return
	}
	utils.Response.SuccessNoData(ctx)
}

func (a *assetController) QueryLost(ctx *gin.Context) {
	var params dto.QueryLostAssetParams
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
	var list []dto.LostAssetRecordVO

	// 子查询：找出某 asset_id 是否还有更新记录
	subQuery := db.GormDB.Table("io_records as r2").
		Select("1").
		Where("r2.asset_id = r1.asset_id AND r2.action_time > r1.action_time")

	// 主查询：找出最新为出库且早于阈值的记录
	query := db.GormDB.Table("io_records as r1").
		Select("r1.asset_id, r1.action_type, r1.action_time, r1.store_from, r1.store_to").
		Where("r1.action_type = ?", 2).
		Where("r1.action_time < ?", timeThreshold).
		Where("NOT EXISTS (?)", subQuery)

	// 总数
	if err := query.Count(&total).Error; err != nil {
		utils.Response.ServerError(ctx, err.Error())
		return
	}

	// 分页查询
	if err := query.
		Order("r1.action_time DESC").
		Limit(params.Limit).
		Offset(params.Offset).
		Scan(&list).Error; err != nil {
		utils.Response.ServerError(ctx, err.Error())
		return
	}

	result := dto.HasTotalResponseData{
		List:  list,
		Total: int(total),
	}

	utils.Response.Success(ctx, result)
}

func (a *assetController) GetTrack(ctx *gin.Context) {
	var params dto.QueryTrackParams
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
	var records []dto.Monitor

	dbQuery := db.GormDB.Model(&dto.Monitor{}).
		Where("asset_id = ?", params.AssetId).
		Where("detection_time BETWEEN ? AND ?", startTime, endTime)

	// 计算总数
	if err := dbQuery.Count(&total).Error; err != nil {
		utils.Response.ServerError(ctx, err.Error())
		return
	}

	// 分页查询
	if err := dbQuery.
		Order("detection_time ASC").
		Limit(params.Limit).
		Offset(params.Offset).
		Find(&records).Error; err != nil {
		utils.Response.ServerError(ctx, err.Error())
		return
	}

	// 转换成 VO 格式
	list := make([]dto.MonitorRecordVO, 0, len(records))
	for _, r := range records {
		list = append(list, dto.MonitorRecordVO{
			MonitorId:     r.MonitorId,
			AssetId:       r.AssetId,
			GatewayId:     r.GatewayId,
			DetectionTime: r.DetectionTime.Format("2006-01-02 15:04:05"),
		})
	}

	result := dto.HasTotalResponseData{
		List:  list,
		Total: int(total),
	}

	utils.Response.Success(ctx, result)
}

func (a *assetController) GetLocation(ctx *gin.Context) {
	var params struct {
		AssetId int64 `json:"assetId"`
	}
	if err := ctx.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}

	var monitor dto.Monitor
	err := db.GormDB.
		Where("asset_id = ?", params.AssetId).
		Order("detection_time DESC").
		First(&monitor).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			utils.Response.Success(ctx, nil) // 没查到就返回 null
		} else {
			utils.Response.ServerError(ctx, err.Error())
		}
		return
	}

	utils.Response.Success(ctx, monitor)
}

func (a *assetController) GetStores(ctx *gin.Context) {
	var stores []dto.Store
	if err := db.GormDB.Find(&stores).Error; err != nil {
		utils.Response.ServerError(ctx, "数据库错误")
		return
	}
	utils.Response.Success(ctx, stores)
}

func (a *assetController) GetGroups(c *gin.Context) {
	var params dto.QueryGroupParams
	if err := c.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterError(c, "参数错误")
		return
	}

	var total int64
	var groups []dto.Group

	tx := db.GormDB.Model(&dto.Group{})
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
	var groupStores []dto.GroupStore
	db.GormDB.Where("group_id IN ?", groupIds).Find(&groupStores)

	// 构建映射 map[groupId]storeId
	groupStoreMap := make(map[int64]int64)
	for _, gs := range groupStores {
		groupStoreMap[gs.GroupId] = gs.StoreId
	}

	// 组装 VO
	var groupVOs []dto.GroupVO
	for _, g := range groups {
		groupVOs = append(groupVOs, dto.GroupVO{
			GroupId:   g.GroupId,
			GroupName: g.GroupName,
			StoreId:   groupStoreMap[g.GroupId],
		})
	}

	result := dto.HasTotalResponseData{
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

	var ag dto.AssetGroup
	err := db.GormDB.Where("asset_id = ?", param.AssetId).First(&ag).Error
	if err != nil {
		// 插入新记录
		if err := db.GormDB.Create(&dto.AssetGroup{
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

	var gs dto.GroupStore
	err := db.GormDB.Where("group_id = ?", param.GroupId).First(&gs).Error
	if err != nil {
		// 新增
		if err := db.GormDB.Create(&dto.GroupStore{
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

	var params dto.QueryAssetParams
	if err := c.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterError(c, "参数错误")
		return
	}

	var total int64
	var assets []dto.Asset

	tx := db.GormDB.Table("asset").Model(&dto.Asset{})
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
		var agList []dto.AssetGroup
		db.GormDB.Model(&dto.AssetGroup{}).
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

	result := dto.HasTotalResponseData{
		List:  AssetVOs,
		Total: int(total),
	}

	utils.Response.Success(c, result)
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
