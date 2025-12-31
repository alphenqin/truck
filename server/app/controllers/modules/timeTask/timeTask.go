package timeTaskControllerModules

import (
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/support/utils"
	"github.com/gin-gonic/gin"
)

var TimeTaskController = &timeTaskController{}

type timeTaskController struct{}

// GetTimeTask 获取定时任务
func (t *timeTaskController) GetTimeTask(context *gin.Context) {
	tasks := TimeTaskService.GetTimeTask()
	utils.Response.Success(context, tasks)
}

// StartTimeTask 开启定时任务
func (t *timeTaskController) StartTimeTask(context *gin.Context) {
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterMissing(context, "id不能为空")
		return
	}
	if err := TimeTaskService.StartTimeTask(id); err != nil {
		utils.Log.Error("启动定时任务失败", "error", err, "id", id)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.Success(context, "启动定时任务成功")
}

// StopTimeTask 停止定时任务
func (t *timeTaskController) StopTimeTask(context *gin.Context) {
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterMissing(context, "id不能为空")
		return
	}
	if err := TimeTaskService.StopTimeTask(id); err != nil {
		utils.Log.Error("停止定时任务失败", "error", err, "id", id)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.Success(context, "停止定时任务成功")
}

// UpdateTimeTask 更新定时任务
func (t *timeTaskController) UpdateTimeTask(context *gin.Context) {
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterMissing(context, "id不能为空")
		return
	}

	var params types.UpdateTimeTask
	if err := context.ShouldBind(&params); err != nil {
		utils.Log.Warn("更新定时任务参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}

	if err := TimeTaskService.UpdateTask(id, &params); err != nil {
		utils.Log.Error("更新定时任务失败", "error", err, "id", id, "params", params)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.Success(context, "更新定时任务成功")
}
