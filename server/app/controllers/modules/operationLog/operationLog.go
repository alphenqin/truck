package operationLogControllerModules

import (
	"github.com/Xi-Yuer/cms/domain/constant"
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/support/utils"
	"github.com/gin-gonic/gin"
)

var OperationLogController = &operationLogController{}

type operationLogController struct{}

// GetOperationLogs 获取操作日志列表（仅管理员）
func (c *operationLogController) GetOperationLogs(ctx *gin.Context) {
	// 仅管理员可查看操作日志
	payload, exist := ctx.Get(constant.JWTPAYLOAD)
	if !exist {
		utils.Response.NoPermission(ctx, "请先登录")
		return
	}
	jwtPayload, ok := payload.(*types.JWTPayload)
	if !ok || jwtPayload.IsAdmin != 1 {
		utils.Response.NoPermission(ctx, "仅管理员可查看操作日志")
		return
	}

	var params types.QueryOperationLogsParams
	if err := ctx.ShouldBind(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}

	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)
	if params.Limit == 0 {
		utils.Response.ParameterTypeError(ctx, "limit 参数必须在 1 到 100 之间")
		return
	}

	list, total, err := OperationLogService.GetOperationLogs(&params)
	if err != nil {
		utils.Log.Error("查询操作日志失败", "error", err)
		utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	utils.Response.Success(ctx, types.HasTotalResponseData{
		List:  list,
		Total: total,
	})
}
