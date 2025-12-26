package roleControllersModules

import (
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/support/utils"
	"github.com/gin-gonic/gin"
)

var RoleController = &roleController{}

type roleController struct {
}

// CreateRole 创建角色
func (r *roleController) CreateRole(context *gin.Context) {
	var role types.CreateRoleParams
	err := context.ShouldBind(&role)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err = RoleService.CreateRole(&role); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.Success(context, "创建成功")
}

// DeleteRole 删除角色
func (r *roleController) DeleteRole(context *gin.Context) {
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterTypeError(context, "id不能为空")
		return
	}

	err := RoleService.DeleteRole(id)
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}

	utils.Response.Success(context, "删除成功")
}

// UpdateRole 更新角色
func (r *roleController) UpdateRole(context *gin.Context) {
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterTypeError(context, "id不能为空")
		return
	}
	var role types.UpdateRoleParams
	err := context.ShouldBind(&role)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err = RoleService.UpdateRole(&role, id); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.Success(context, "更新成功")
}

// GetRoles 获取角色
func (r *roleController) GetRoles(context *gin.Context) {
	var params types.QueryRolesParams
	err := context.ShouldBind(&params)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if params.Limit > 100 || params.Limit < 0 {
		utils.Response.ParameterTypeError(context, "limit参数不正确")
		return
	}
	if roles, err := RoleService.GetRoles(&params); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	} else {
		utils.Response.Success(context, roles)
	}
}

// ExportExcel 导出角色
func (r *roleController) ExportExcel(context *gin.Context) {
	var IDs types.ExportExcelResponse
	err := context.ShouldBind(&IDs)
	if err != nil {
		utils.Response.ParameterMissing(context, err.Error())
		return
	}
	responses, err := RoleService.ExportExcel(&IDs)
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	var data [][]interface{}
	data = append(data, []interface{}{"ID", "角色名", "接口ID", "描述", "创建时间", "更新时间"})
	for _, response := range responses {
		data = append(data, []interface{}{response.ID, response.RoleName, response.InterfaceID, response.Description, response.CreateTime, response.UpdateTime})
	}
	if err := utils.ExportExcel(context, data, "角色表"); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
}

// CreateOneRecord 绑定用户
func (r *roleController) CreateOneRecord(context *gin.Context) {
	var params types.CreateOneRecord
	if err := context.ShouldBind(&params); err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := RoleService.CreateOneRecord(&params); err != nil {
		utils.Response.ServerError(context, err.Error())
		return

	}
	utils.Response.Success(context, "添加成功")
}

// DeleteOneRecord 解绑用户
func (r *roleController) DeleteOneRecord(context *gin.Context) {
	var params types.DeleteOneRecord
	if err := context.ShouldBind(&params); err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	if err := RoleService.DeleteOneRecord(&params); err != nil {
		utils.Response.ServerError(context, err.Error())
		return

	}
	utils.Response.Success(context, "删除成功")
}
