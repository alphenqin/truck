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
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	err := SystemDepartmentService.CreateDepartment(&createParams)
	if err != nil {
		utils.Response.ServerError(context, err.Error())
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
		utils.Response.ServerError(context, err.Error())
		return
	}

	utils.Response.Success(context, nil)
}

// GetDepartments 获取部门
func (d *departmentController) GetDepartments(context *gin.Context) {
	department, err := SystemDepartmentService.GetDepartments()
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.Success(context, department)
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
		utils.Response.ParameterError(context, err.Error())
		return
	}

	if err := SystemDepartmentService.UpdateDepartment(id, &params); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}

	utils.Response.Success(context, nil)
}
