package baseControllersModules

import (
	"github.com/Xi-Yuer/cms/db"
	"github.com/Xi-Yuer/cms/dto"
	"github.com/Xi-Yuer/cms/utils"
	"github.com/gin-gonic/gin"
)

var BaseController = &baseController{}

type baseController struct{}

func (a *baseController) AddDepartment(context *gin.Context) {
	var department dto.Department
	err := context.ShouldBindJSON(&department)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	// 直接使用GORM创建
	if err := db.GormDB.Table("departments").Create(&department).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) DelDepartment(context *gin.Context) {
	// 获取id列表
	var ids []int64
	err := context.ShouldBindJSON(&ids)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	// 直接使用GORM删除
	if err := db.GormDB.Table("departments").Delete(&dto.Department{}, ids).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) UpdateDepartment(context *gin.Context) {
	var department dto.Department
	err := context.ShouldBindJSON(&department)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	// 直接使用GORM更新
	if err := db.GormDB.Table("departments").Where("department_id = ?", department.DepartmentId).Updates(department).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) GetDepartments(ctx *gin.Context) {
	var params dto.QueryDepartmentsParams
	if err := ctx.ShouldBindJSON(&params); err != nil {
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
	query := db.GormDB.Table("departments")

	if params.DepartmentId > 0 {
		query = query.Where("department_id = ?", params.DepartmentId)
	}
	if params.DepartmentName != "" {
		query = query.Where("department_name LIKE ?", "%"+params.DepartmentName+"%")
	}
	if params.StoreId > 0 {
		query = query.Where("store_id = ?", params.StoreId)
	}

	var total int64
	var departments []dto.Department

	// 分页 + 查询
	if err := query.Count(&total).
		Limit(params.Limit).
		Offset(params.Offset).
		Find(&departments).Error; err != nil {
		utils.Response.ServerError(ctx, err.Error())
		return
	}

	utils.Response.Success(ctx, gin.H{
		"list":  departments,
		"total": total,
	})
}

func (a *baseController) AddBType(context *gin.Context) {
	var assetType dto.AssetType
	err := context.ShouldBindJSON(&assetType)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	// 直接使用GORM创建
	if err := db.GormDB.Table("asset_types").Create(&assetType).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) DelBType(context *gin.Context) {
	// 获取id列表
	var ids []int64
	err := context.ShouldBindJSON(&ids)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	// 直接使用GORM删除
	if err := db.GormDB.Table("asset_types").Delete(&dto.AssetType{}, ids).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) UpdateBType(context *gin.Context) {
	var assetType dto.AssetType
	err := context.ShouldBindJSON(&assetType)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	// 直接使用GORM更新
	if err := db.GormDB.Table("asset_types").Where("type_id = ?", assetType.TypeId).Updates(assetType).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) GetBTypes(ctx *gin.Context) {
	var params dto.QueryAssetTypesParams
	if err := ctx.ShouldBindJSON(&params); err != nil {
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
	query := db.GormDB.Table("asset_types")

	if params.TypeId > 0 {
		query = query.Where("type_id = ?", params.TypeId)
	}
	if params.TypeName != "" {
		query = query.Where("type_name LIKE ?", "%"+params.TypeName+"%")
	}

	var total int64
	var assetTypes []dto.AssetType

	// 分页 + 查询
	if err := query.Count(&total).
		Limit(params.Limit).
		Offset(params.Offset).
		Find(&assetTypes).Error; err != nil {
		utils.Response.ServerError(ctx, err.Error())
		return
	}

	utils.Response.Success(ctx, gin.H{
		"list":  assetTypes,
		"total": total,
	})
}

func (a *baseController) AddLine(context *gin.Context) {
	var line dto.Line
	err := context.ShouldBindJSON(&line)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	// 直接使用GORM创建
	if err := db.GormDB.Table("lines").Create(&line).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) DelLine(context *gin.Context) {
	// 获取id列表
	var ids []int64
	err := context.ShouldBindJSON(&ids)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	// 直接使用GORM删除
	if err := db.GormDB.Table("lines").Delete(&dto.Line{}, ids).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) UpdateLine(context *gin.Context) {
	var line dto.Line
	err := context.ShouldBindJSON(&line)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	// 直接使用GORM更新
	if err := db.GormDB.Table("lines").Where("line_id = ?", line.LineId).Updates(line).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) GetLines(context *gin.Context) {
	var params dto.QueryLinesParams
	if err := context.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
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
	query := db.GormDB.Table("lines")

	if params.LineId > 0 {
		query = query.Where("line_id = ?", params.LineId)
	}
	if params.LineName != "" {
		query = query.Where("line_name LIKE ?", "%"+params.LineName+"%")
	}

	var total int64
	var lines []dto.Line

	// 分页 + 查询
	if err := query.Count(&total).
		Limit(params.Limit).
		Offset(params.Offset).
		Find(&lines).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}

	utils.Response.Success(context, gin.H{
		"list":  lines,
		"total": total,
	})
}

func (a *baseController) AddArg(context *gin.Context) {
	var arg dto.Arg
	err := context.ShouldBindJSON(&arg)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := db.GormDB.Table("args").Create(&arg).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) DelArg(context *gin.Context) {
	var ids []int64
	err := context.ShouldBindJSON(&ids)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := db.GormDB.Table("args").Delete(&dto.Arg{}, ids).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) UpdateArg(context *gin.Context) {
	var arg dto.Arg
	err := context.ShouldBindJSON(&arg)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}

	if arg.Id == 0 {
		utils.Response.ParameterTypeError(context, "id is required for update")
		return
	}

	updates := map[string]interface{}{
		"arg_key":   arg.ArgKey,
		"arg_name":  arg.ArgName,
		"arg_value": arg.ArgValue,
	}

	if err := db.GormDB.Table("args").Where("id = ?", arg.Id).Updates(updates).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) GetArgs(context *gin.Context) {
	var params dto.QueryArgsParams
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
	query := db.GormDB.Table("args")
	if params.ArgKey != "" {
		query = query.Where("arg_key LIKE ?", "%"+params.ArgKey+"%")
	}
	if params.ArgName != "" {
		query = query.Where("arg_name LIKE ?", "%"+params.ArgName+"%")
	}
	if params.ArgValue != "" {
		query = query.Where("arg_value LIKE ?", "%"+params.ArgValue+"%")
	}
	var total int64
	var args []dto.Arg
	if err := query.Count(&total).
		Limit(params.Limit).
		Offset(params.Offset).
		Find(&args).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.Success(context, gin.H{
		"list":  args,
		"total": total,
	})
}

func (a *baseController) AddNotice(context *gin.Context) {
	var rule dto.AlarmRule
	err := context.ShouldBindJSON(&rule)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := db.GormDB.Table("alarm_rules").Create(&rule).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) DelNotice(context *gin.Context) {
	var ids []int64
	err := context.ShouldBindJSON(&ids)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := db.GormDB.Table("alarm_rules").Delete(&dto.AlarmRule{}, ids).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) UpdateNotice(context *gin.Context) {
	var rule dto.AlarmRule
	err := context.ShouldBindJSON(&rule)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := db.GormDB.Table("alarm_rules").Where("id = ?", rule.Id).Updates(rule).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) GetNotices(context *gin.Context) {
	var params dto.QueryAlarmRulesParams
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
	query := db.GormDB.Table("alarm_rules")
	if params.RuleName != "" {
		query = query.Where("rule_name LIKE ?", "%"+params.RuleName+"%")
	}
	if params.RuleKey != "" {
		query = query.Where("rule_key LIKE ?", "%"+params.RuleKey+"%")
	}
	if params.RuleValue != "" {
		query = query.Where("rule_value LIKE ?", "%"+params.RuleValue+"%")
	}
	var total int64
	var rules []dto.AlarmRule
	if err := query.Count(&total).
		Limit(params.Limit).
		Offset(params.Offset).
		Find(&rules).Error; err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.Success(context, gin.H{
		"list":  rules,
		"total": total,
	})
}
