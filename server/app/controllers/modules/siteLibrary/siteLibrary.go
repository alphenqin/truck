package siteLibaryControllersModules

import (
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/support/utils"
	"github.com/gin-gonic/gin"
)

var SiteLibraryController = &siteLibraryController{}

type siteLibraryController struct{}

func (c siteLibraryController) AddGarden(context *gin.Context) {
	// 获取id列表
	var garden types.Garden
	err := context.ShouldBind(&garden)
	if err != nil {
		utils.Log.Warn("添加园区参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	// 服务层
	err = SiteLibraryService.AddGarden(garden)
	if err != nil {
		utils.Log.Error("添加园区失败", "error", err, "garden", garden)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c siteLibraryController) GetGardens(context *gin.Context) {
	var params types.QueryGardenParams
	if err := context.ShouldBind(&params); err != nil {
		utils.Log.Warn("查询园区参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}

	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)
	if params.Limit == 0 {
		utils.Response.ParameterTypeError(context, "limit 参数必须在 1 到 100 之间")
		return
	}

	// 查询总条数（用于分页）
	query := db.GormDB.Table("gardens")
	if params.GardenName != "" {
		query = query.Where("garden_name LIKE ?", "%"+params.GardenName+"%")
	}
	var total int64
	if err := query.Count(&total).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}

	// 分页查询
	var gardenVOs []types.GardenVO
	if err := query.
		Offset(params.Offset).
		Limit(params.Limit).
		Scan(&gardenVOs).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}

	// 组装响应
	res := &types.HasTotalResponseData{
		List:  gardenVOs,
		Total: int(total),
	}
	utils.Response.Success(context, res)
}

func (c siteLibraryController) DelGardens(ctx *gin.Context) {
	var ids []uint
	if err := ctx.BindJSON(&ids); err != nil || len(ids) == 0 {
		utils.Response.ParameterTypeError(ctx, "参数错误或为空")
		return
	}

	tx := db.GormDB.Begin()
	if tx.Error != nil {
		utils.Response.ServerError(ctx, "开启事务失败")
		return
	}

	// 查找要删除的 garden 对应的 storeId
	var storeIds []uint
	if err := tx.Table("stores").
		Where("garden_id IN ?", ids).
		Pluck("store_id", &storeIds).Error; err != nil {
		tx.Rollback()
		utils.Log.Error("查询附表失败", "error", err, "ids", ids)
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	// 删除 gardens 主表
	if err := tx.Table("gardens").Where("garden_id IN ?", ids).Delete(&types.Garden{}).Error; err != nil {
		tx.Rollback()
		utils.Log.Error("删除主表失败", "error", err, "ids", ids)
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	// 删除 stores 附表
	if len(storeIds) > 0 {
		if err := tx.Table("stores").Where("store_id IN ?", storeIds).Delete(&types.Store{}).Error; err != nil {
			tx.Rollback()
			utils.Log.Error("删除附表失败", "error", err, "storeIds", storeIds)
			utils.Response.ServerError(ctx, "操作失败，请稍后重试")
			return
		}
	}

	// 提交事务
	if err := tx.Commit().Error; err != nil {
		utils.Log.Error("提交事务失败", "error", err)
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	utils.Response.SuccessNoData(ctx)
}

func (c siteLibraryController) UpdateGarden(context *gin.Context) {
	var garden types.Garden
	err := context.ShouldBind(&garden)
	if err != nil {
		utils.Log.Warn("查询园区参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	// 服务层
	err = db.GormDB.Table("gardens").Where("garden_id = ?", garden.GardenId).Updates(garden).Error
	if err != nil {
		utils.Log.Error("更新园区失败", "error", err, "garden", garden)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c siteLibraryController) AddStore(context *gin.Context) {
	var storeDTO types.StoreDTO
	if err := context.ShouldBindJSON(&storeDTO); err != nil {
		utils.Log.Warn("添加库房参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}

	// 判断 garden_id 是否存在
	var count int64
	if err := db.GormDB.
		Table("gardens").
		Where("garden_id = ?", storeDTO.GardenId).
		Count(&count).Error; err != nil {
		utils.Log.Error("查询园区信息失败", "error", err, "gardenId", storeDTO.GardenId)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}

	if count == 0 {
		utils.Response.ParameterTypeError(context, "指定的园区不存在")
		return
	}

	// 创建 store 记录
	store := types.Store{
		StoreName: storeDTO.StoreName,
		GardenId:  storeDTO.GardenId,
	}

	if err := db.GormDB.Create(&store).Error; err != nil {
		utils.Log.Error("新增库房失败", "error", err, "store", store)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}

	utils.Response.SuccessNoData(context)
}

func (c siteLibraryController) DelStores(context *gin.Context) {
	var ids []uint
	err := context.ShouldBind(&ids)
	if err != nil {
		utils.Log.Warn("查询园区参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	// 服务层
	err = db.GormDB.Table("stores").Delete(&types.Store{}, ids).Error
	if err != nil {
		utils.Log.Error("删除库房失败", "error", err, "ids", ids)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c siteLibraryController) UpdateStore(ctx *gin.Context) {
	var storeDTO types.StoreDTO
	if err := ctx.ShouldBindJSON(&storeDTO); err != nil {
		utils.Log.Warn("更新库房参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(ctx, "参数格式错误")
		return
	}

	// 校验 garden 是否存在
	var count int64
	if err := db.GormDB.
		Table("gardens").
		Where("garden_id = ?", storeDTO.GardenId).
		Count(&count).Error; err != nil || count == 0 {
		utils.Log.Error("查询园区信息失败", "error", err, "gardenId", storeDTO.GardenId)
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	// 更新 store
	store := types.Store{
		StoreId:   storeDTO.StoreId,
		GardenId:  storeDTO.GardenId,
		StoreName: storeDTO.StoreName,
	}
	if err := db.GormDB.
		Table("stores").
		Where("store_id = ?", store.StoreId).
		Updates(&store).Error; err != nil {
		utils.Log.Error("更新库房失败", "error", err, "store", store)
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	utils.Response.SuccessNoData(ctx)
}

func (c siteLibraryController) GetStore(ctx *gin.Context) {
	var params types.QueryStoreParams
	if err := ctx.ShouldBind(&params); err != nil {
		utils.Log.Warn("查询库房参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(ctx, "参数格式错误")
		return
	}
	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)
	if params.Limit == 0 {
		utils.Response.ParameterTypeError(ctx, "limit参数不正确")
		return
	}

	query := db.GormDB.Table("stores")
	if params.StoreName != "" {
		query = query.Where("store_name LIKE ?", "%"+params.StoreName+"%")
	}
	var stores []types.Store
	if err := query.
		Offset(params.Offset).
		Limit(params.Limit).
		Scan(&stores).Error; err != nil {
		utils.Log.Error("查询库房列表失败", "error", err)
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}
	storeVOs := make([]types.StoreVO, 0, len(stores))
	for _, store := range stores {
		storeVO := types.StoreVO{
			StoreId:   store.StoreId,
			StoreName: store.StoreName,
			GardenId:  store.GardenId,
		}
		storeVOs = append(storeVOs, storeVO)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		utils.Log.Error("查询库房总数失败", "error", err)
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	utils.Response.Success(ctx, &types.HasTotalResponseData{
		List:  storeVOs,
		Total: int(total),
	})
}

// GetStoreMap 获取场库映射
func (c siteLibraryController) GetStoreMap(ctx *gin.Context) {
	var stores []types.Store
	if err := db.GormDB.Find(&stores).Error; err != nil {
		utils.Log.Error("获取场库列表失败", "error", err)
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	// 转换为 VO 格式
	var storeVOs []types.StoreMapVO
	for _, store := range stores {
		storeVOs = append(storeVOs, types.StoreMapVO{
			StoreId:   store.StoreId,
			StoreName: store.StoreName,
		})
	}

	utils.Response.Success(ctx, storeVOs)
}
