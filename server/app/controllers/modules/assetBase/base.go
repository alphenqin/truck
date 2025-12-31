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
		utils.Log.Warn("添加部门参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	if err := AssetBaseService.CreateAssetDepartment(&department); err != nil {
		utils.Log.Error("添加部门失败", "error", err, "department", department)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) DelDepartment(context *gin.Context) {
	// 获取id列表
	var ids []int64
	err := context.ShouldBindJSON(&ids)
	if err != nil {
		utils.Log.Warn("删除部门参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	if err := AssetBaseService.DeleteAssetDepartments(ids); err != nil {
		utils.Log.Error("删除部门失败", "error", err, "ids", ids)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) UpdateDepartment(context *gin.Context) {
	var department types.Department
	err := context.ShouldBindJSON(&department)
	if err != nil {
		utils.Log.Warn("更新部门参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	if err := AssetBaseService.UpdateAssetDepartment(&department); err != nil {
		utils.Log.Error("更新部门失败", "error", err, "department", department)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) GetDepartments(ctx *gin.Context) {
	var params types.QueryDepartmentsParams
	if err := ctx.ShouldBindJSON(&params); err != nil {
		utils.Log.Warn("查询资产类型参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(ctx, "参数格式错误")
		return
	}

	// 校验 limit 合法范围
	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)

	// 构建查询条件
	departments, total, err := AssetBaseService.QueryAssetDepartments(&params)
	if err != nil {
		utils.Log.Error("查询资产类型失败", "error", err, "params", params)
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
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
		utils.Log.Warn("添加资产类型参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	if err := AssetBaseService.CreateAssetType(&assetType); err != nil {
		utils.Log.Error("添加资产类型失败", "error", err, "assetType", assetType)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) DelBType(context *gin.Context) {
	// 获取id列表
	var ids []int64
	err := context.ShouldBindJSON(&ids)
	if err != nil {
		utils.Log.Warn("删除资产类型参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	if err := AssetBaseService.DeleteAssetTypes(ids); err != nil {
		utils.Log.Error("删除资产类型失败", "error", err, "ids", ids)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) UpdateBType(context *gin.Context) {
	var assetType types.AssetType
	err := context.ShouldBindJSON(&assetType)
	if err != nil {
		utils.Log.Warn("更新资产类型参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	if err := AssetBaseService.UpdateAssetType(&assetType); err != nil {
		utils.Log.Error("更新资产类型失败", "error", err, "assetType", assetType)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) GetBTypes(ctx *gin.Context) {
	var params types.QueryAssetTypesParams
	if err := ctx.ShouldBindJSON(&params); err != nil {
		utils.Log.Warn("查询资产类型参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(ctx, "参数格式错误")
		return
	}

	// 校验 limit 合法范围
	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)

	// 构建查询条件
	assetTypes, total, err := AssetBaseService.QueryAssetTypes(&params)
	if err != nil {
		utils.Log.Error("查询资产类型失败", "error", err, "params", params)
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
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
		utils.Log.Warn("添加线路参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	if err := AssetBaseService.CreateLine(&line); err != nil {
		utils.Log.Error("添加线路失败", "error", err, "line", line)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) DelLine(context *gin.Context) {
	// 获取id列表
	var ids []int64
	err := context.ShouldBindJSON(&ids)
	if err != nil {
		utils.Log.Warn("删除线路参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	if err := AssetBaseService.DeleteLines(ids); err != nil {
		utils.Log.Error("删除线路失败", "error", err, "ids", ids)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) UpdateLine(context *gin.Context) {
	var line types.Line
	err := context.ShouldBindJSON(&line)
	if err != nil {
		utils.Log.Warn("更新线路参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	if err := AssetBaseService.UpdateLine(&line); err != nil {
		utils.Log.Error("更新线路失败", "error", err, "line", line)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
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
	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)

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
		utils.Log.Warn("添加参数参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	if err := AssetBaseService.CreateArg(&arg); err != nil {
		utils.Log.Error("添加参数失败", "error", err, "arg", arg)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) DelArg(context *gin.Context) {
	var ids []int64
	err := context.ShouldBindJSON(&ids)
	if err != nil {
		utils.Log.Warn("删除参数参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	if err := AssetBaseService.DeleteArgs(ids); err != nil {
		utils.Log.Error("删除参数失败", "error", err, "ids", ids)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) UpdateArg(context *gin.Context) {
	var arg types.Arg
	err := context.ShouldBindJSON(&arg)
	if err != nil {
		utils.Log.Warn("更新参数参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
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
		utils.Log.Error("更新参数失败", "error", err, "arg", arg, "updates", updates)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
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
	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)
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
		utils.Log.Warn("添加告警规则参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	if err := AssetBaseService.CreateAlarmRule(&rule); err != nil {
		utils.Log.Error("添加告警规则失败", "error", err, "rule", rule)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) DelNotice(context *gin.Context) {
	var ids []int64
	err := context.ShouldBindJSON(&ids)
	if err != nil {
		utils.Log.Warn("删除告警规则参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	if err := AssetBaseService.DeleteAlarmRules(ids); err != nil {
		utils.Log.Error("删除告警规则失败", "error", err, "ids", ids)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (a *baseController) UpdateNotice(context *gin.Context) {
	var rule types.AlarmRule
	err := context.ShouldBindJSON(&rule)
	if err != nil {
		utils.Log.Warn("更新告警规则参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	if err := AssetBaseService.UpdateAlarmRule(&rule); err != nil {
		utils.Log.Error("更新告警规则失败", "error", err, "rule", rule)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
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
	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)
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
