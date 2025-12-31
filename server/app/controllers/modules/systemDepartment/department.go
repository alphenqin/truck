package systemDepartmentControllerModules

import (
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/support/utils"
	"github.com/gin-gonic/gin"
)

var SystemDepartmentController = &departmentController{}

type departmentController struct{}

// CreateDepartment 创建部门
func (d *departmentController) CreateDepartment(context *gin.Context) {
	var createParams types.CreateDepartmentRequest
	if err := context.ShouldBind(&createParams); err != nil {
		utils.Log.Warn("创建部门参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	err := SystemDepartmentService.CreateDepartment(&createParams)
	if err != nil {
		utils.Log.Error("创建部门失败", "error", err, "department", createParams)
		utils.Response.ServerError(context, "创建失败，请稍后重试")
		return
	}
	utils.Response.Success(context, nil)
}

// DeleteDepartment 删除部门
func (d *departmentController) DeleteDepartment(context *gin.Context) {
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterMissing(context, "id不能为空")
		return
	}
	err := SystemDepartmentService.DeleteDepartment(id)
	if err != nil {
		utils.Log.Error("删除部门失败", "error", err, "departmentId", id)
		utils.Response.ServerError(context, "删除失败，请稍后重试")
		return
	}

	utils.Response.Success(context, nil)
}

// GetDepartments 获取部门
func (d *departmentController) GetDepartments(context *gin.Context) {
	departments, err := SystemDepartmentService.GetDepartments()
	if err != nil {
		utils.Log.Error("查询部门失败", "error", err)
		utils.Response.ServerError(context, "查询失败，请稍后重试")
		return
	}
	utils.Response.Success(context, departments)
}

// UpdateDepartment 修改部门
func (d *departmentController) UpdateDepartment(context *gin.Context) {
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterMissing(context, "id不能为空")
		return
	}
	var params types.UpdateDepartmentRequest
	err := context.ShouldBind(&params)
	if err != nil {
		utils.Log.Warn("更新部门参数绑定失败", "error", err, "departmentId", id)
		utils.Response.ParameterError(context, "参数格式错误")
		return
	}

	if err := SystemDepartmentService.UpdateDepartment(id, &params); err != nil {
		utils.Log.Error("更新部门失败", "error", err, "departmentId", id)
		utils.Response.ServerError(context, "更新失败，请稍后重试")
		return
	}

	utils.Response.Success(context, nil)
}
