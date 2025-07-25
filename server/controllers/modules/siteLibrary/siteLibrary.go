package siteLibaryControllersModules

import (
	"github.com/Xi-Yuer/cms/db"
	"github.com/Xi-Yuer/cms/dto"
	"github.com/Xi-Yuer/cms/services"
	"github.com/Xi-Yuer/cms/utils"
	"github.com/gin-gonic/gin"
)

var SiteLibraryController = &siteLibraryController{}

type siteLibraryController struct{}

func (c siteLibraryController) AddGarden(context *gin.Context) {
	// 获取id列表
	var garden dto.Garden
	err := context.ShouldBind(&garden)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	// 服务层
	err = services.SiteLibraryService.AddGarden(garden)
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c siteLibraryController) GetGardens(context *gin.Context) {
	var params dto.QueryGardenParams
	if err := context.ShouldBind(&params); err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}

	if params.Limit < 0 || params.Limit > 100 {
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
	var gardenVOs []dto.GardenVO
	if err := query.
		Offset(params.Offset).
		Limit(params.Limit).
		Scan(&gardenVOs).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}

	// 组装响应
	res := &dto.HasTotalResponseData{
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
		utils.Response.ServerError(ctx, "查询附表失败: "+err.Error())
		return
	}

	// 删除 gardens 主表
	if err := tx.Table("gardens").Where("garden_id IN ?", ids).Delete(&dto.Garden{}).Error; err != nil {
		tx.Rollback()
		utils.Response.ServerError(ctx, "删除主表失败: "+err.Error())
		return
	}

	// 删除 stores 附表
	if len(storeIds) > 0 {
		if err := tx.Table("stores").Where("store_id IN ?", storeIds).Delete(&dto.Store{}).Error; err != nil {
			tx.Rollback()
			utils.Response.ServerError(ctx, "删除附表失败: "+err.Error())
			return
		}
	}

	// 提交事务
	if err := tx.Commit().Error; err != nil {
		utils.Response.ServerError(ctx, "提交事务失败: "+err.Error())
		return
	}

	utils.Response.SuccessNoData(ctx)
}

func (c siteLibraryController) UpdateGarden(context *gin.Context) {
	var garden dto.Garden
	err := context.ShouldBind(&garden)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	// 服务层
	err = db.GormDB.Table("gardens").Where("garden_id = ?", garden.GardenId).Updates(garden).Error
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c siteLibraryController) AddStore(context *gin.Context) {
	var storeDTO dto.StoreDTO
	if err := context.ShouldBindJSON(&storeDTO); err != nil {
		utils.Response.ParameterTypeError(context, "请求参数绑定失败: "+err.Error())
		return
	}

	// 判断 garden_id 是否存在
	var count int64
	if err := db.GormDB.
		Table("gardens").
		Where("garden_id = ?", storeDTO.GardenId).
		Count(&count).Error; err != nil {
		utils.Response.ServerError(context, "查询园区信息失败: "+err.Error())
		return
	}

	if count == 0 {
		utils.Response.ParameterTypeError(context, "指定的园区不存在")
		return
	}

	// 创建 store 记录
	store := dto.Store{
		StoreName: storeDTO.StoreName,
		GardenId:  storeDTO.GardenId,
	}

	if err := db.GormDB.Create(&store).Error; err != nil {
		utils.Response.ServerError(context, "新增 store 失败: "+err.Error())
		return
	}

	utils.Response.SuccessNoData(context)
}

func (c siteLibraryController) DelStores(context *gin.Context) {
	var ids []uint
	err := context.ShouldBind(&ids)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	// 服务层
	err = db.GormDB.Table("stores").Delete(&dto.Store{}, ids).Error
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c siteLibraryController) UpdateStore(ctx *gin.Context) {
	var storeDTO dto.StoreDTO
	if err := ctx.ShouldBindJSON(&storeDTO); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}

	// 校验 garden 是否存在
	var count int64
	if err := db.GormDB.
		Table("gardens").
		Where("garden_id = ?", storeDTO.GardenId).
		Count(&count).Error; err != nil || count == 0 {
		utils.Response.ServerError(ctx, "garden 不存在或查询出错")
		return
	}

	// 更新 store
	store := dto.Store{
		StoreId:   storeDTO.StoreId,
		GardenId:  storeDTO.GardenId,
		StoreName: storeDTO.StoreName,
	}
	if err := db.GormDB.
		Table("stores").
		Where("store_id = ?", store.StoreId).
		Updates(&store).Error; err != nil {
		utils.Response.ServerError(ctx, err.Error())
		return
	}

	utils.Response.SuccessNoData(ctx)
}

func (c siteLibraryController) GetStore(ctx *gin.Context) {
	var params dto.QueryStoreParams
	if err := ctx.ShouldBind(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}
	if params.Limit > 100 || params.Limit < 0 {
		utils.Response.ParameterTypeError(ctx, "limit参数不正确")
		return
	}

	query := db.GormDB.Table("stores")
	if params.StoreName != "" {
		query = query.Where("store_name LIKE ?", "%"+params.StoreName+"%")
	}
	var stores []dto.Store
	if err := query.
		Offset(params.Offset).
		Limit(params.Limit).
		Scan(&stores).Error; err != nil {
		utils.Response.ServerError(ctx, err.Error())
		return
	}
	storeVOs := make([]dto.StoreVO, 0, len(stores))
	for _, store := range stores {
		storeVO := dto.StoreVO{
			StoreId:   store.StoreId,
			StoreName: store.StoreName,
			GardenId:  store.GardenId,
		}
		storeVOs = append(storeVOs, storeVO)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		utils.Response.ServerError(ctx, err.Error())
		return
	}

	utils.Response.Success(ctx, &dto.HasTotalResponseData{
		List:  storeVOs,
		Total: int(total),
	})
}

// GetStoreMap 获取场库映射
func (c siteLibraryController) GetStoreMap(ctx *gin.Context) {
	var stores []dto.Store
	if err := db.GormDB.Find(&stores).Error; err != nil {
		utils.Response.ServerError(ctx, "获取场库列表失败")
		return
	}

	// 转换为 VO 格式
	var storeVOs []dto.StoreMapVO
	for _, store := range stores {
		storeVOs = append(storeVOs, dto.StoreMapVO{
			StoreId:   store.StoreId,
			StoreName: store.StoreName,
		})
	}

	utils.Response.Success(ctx, storeVOs)
}
