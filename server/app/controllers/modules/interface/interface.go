package interfaceControllerModules

import (
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/support/utils"
	"github.com/gin-gonic/gin"
)

var InterfaceController = &interfaceControllerModules{}

type interfaceControllerModules struct{}

// CreateInterface 创建接口
func (i *interfaceControllerModules) CreateInterface(context *gin.Context) {
	var params types.CreateInterfaceRequest
	err := context.ShouldBind(&params)
	if err != nil {
		utils.Log.Warn("创建接口参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}

	if err := InterfaceService.CreateInterface(&params); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.Success(context, "创建成功")
}

// UpdateInterface 更新接口
func (i *interfaceControllerModules) UpdateInterface(context *gin.Context) {
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterMissing(context, "id不能为空")
		return
	}
	var params types.UpdateInterfaceRequest

	if err := context.ShouldBind(&params); err != nil {
		utils.Log.Warn("更新接口参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}

	if err := InterfaceService.UpdateInterfaceByID(id, &params); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.Success(context, "更新成功")
}

// GetInterfaceByPageID 获取接口（根据页面ID）
func (i *interfaceControllerModules) GetInterfaceByPageID(context *gin.Context) {
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterMissing(context, "id不能为空")
		return
	}
	interfaceResponses := InterfaceService.GetInterfaceByPageID(id)
	utils.Response.Success(context, interfaceResponses)
}

// DeleteInterface 删除接口
func (i *interfaceControllerModules) DeleteInterface(context *gin.Context) {
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterMissing(context, "id不能为空")
		return
	}

	if err := InterfaceService.DeleteInterfaceByID(id); err != nil {
		utils.Log.Error("删除接口失败", "error", err, "id", id)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.Success(context, "删除成功")
}

// GetInterfacesByRoleID 获取接口（根据角色ID）
func (i *interfaceControllerModules) GetInterfacesByRoleID(context *gin.Context) {
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterMissing(context, "id不能为空")
		return
	}
	interfaceResponses, err := RolesAndInterfacesService.GetInterfacesByRoleID(id)
	if err != nil {
		utils.Log.Error("根据角色ID获取接口失败", "error", err, "id", id)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.Success(context, interfaceResponses)
}

// GetAllInterface 获取接口（所有页面）
func (i *interfaceControllerModules) GetAllInterface(context *gin.Context) {
	allInterface, err := InterfaceService.GetAllInterface()
	if err != nil {
		utils.Log.Error("获取所有接口失败", "error", err)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.Success(context, allInterface)
}
