package assetBaseControllersModules

import (
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/support/utils"
	"github.com/gin-gonic/gin"
)

var AssetBaseController = &baseController{}

type baseController struct{}

func (a *baseController) AddDepartment(context *gin.Context) {
	var department types.Department
	err := context.ShouldBindJSON(&department)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := AssetBaseService.CreateAssetDepartment(&department); err != nil {
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
	if err := AssetBaseService.DeleteAssetDepartments(ids); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) UpdateDepartment(context *gin.Context) {
	var department types.Department
	err := context.ShouldBindJSON(&department)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := AssetBaseService.UpdateAssetDepartment(&department); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) GetDepartments(ctx *gin.Context) {
	var params types.QueryDepartmentsParams
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
	departments, total, err := AssetBaseService.QueryAssetDepartments(&params)
	if err != nil {
		utils.Response.ServerError(ctx, err.Error())
		return
	}

	utils.Response.Success(ctx, gin.H{
		"list":  departments,
		"total": total,
	})
}

func (a *baseController) AddBType(context *gin.Context) {
	var assetType types.AssetType
	err := context.ShouldBindJSON(&assetType)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := AssetBaseService.CreateAssetType(&assetType); err != nil {
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
	if err := AssetBaseService.DeleteAssetTypes(ids); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) UpdateBType(context *gin.Context) {
	var assetType types.AssetType
	err := context.ShouldBindJSON(&assetType)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := AssetBaseService.UpdateAssetType(&assetType); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) GetBTypes(ctx *gin.Context) {
	var params types.QueryAssetTypesParams
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
	assetTypes, total, err := AssetBaseService.QueryAssetTypes(&params)
	if err != nil {
		utils.Response.ServerError(ctx, err.Error())
		return
	}

	utils.Response.Success(ctx, gin.H{
		"list":  assetTypes,
		"total": total,
	})
}

func (a *baseController) AddLine(context *gin.Context) {
	var line types.Line
	err := context.ShouldBindJSON(&line)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := AssetBaseService.CreateLine(&line); err != nil {
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
	if err := AssetBaseService.DeleteLines(ids); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) UpdateLine(context *gin.Context) {
	var line types.Line
	err := context.ShouldBindJSON(&line)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := AssetBaseService.UpdateLine(&line); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) GetLines(context *gin.Context) {
	var params types.QueryLinesParams
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
	lines, total, err := AssetBaseService.QueryLines(&params)
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}

	utils.Response.Success(context, gin.H{
		"list":  lines,
		"total": total,
	})
}

func (a *baseController) AddArg(context *gin.Context) {
	var arg types.Arg
	err := context.ShouldBindJSON(&arg)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := AssetBaseService.CreateArg(&arg); err != nil {
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
	if err := AssetBaseService.DeleteArgs(ids); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) UpdateArg(context *gin.Context) {
	var arg types.Arg
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

	if err := AssetBaseService.UpdateArg(arg.Id, updates); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) GetArgs(context *gin.Context) {
	var params types.QueryArgsParams
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
	args, total, err := AssetBaseService.QueryArgs(&params)
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.Success(context, gin.H{
		"list":  args,
		"total": total,
	})
}

func (a *baseController) AddNotice(context *gin.Context) {
	var rule types.AlarmRule
	err := context.ShouldBindJSON(&rule)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := AssetBaseService.CreateAlarmRule(&rule); err != nil {
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
	if err := AssetBaseService.DeleteAlarmRules(ids); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) UpdateNotice(context *gin.Context) {
	var rule types.AlarmRule
	err := context.ShouldBindJSON(&rule)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := AssetBaseService.UpdateAlarmRule(&rule); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) GetNotices(context *gin.Context) {
	var params types.QueryAlarmRulesParams
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
	rules, total, err := AssetBaseService.QueryAlarmRules(&params)
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.Success(context, gin.H{
		"list":  rules,
		"total": total,
	})
}
