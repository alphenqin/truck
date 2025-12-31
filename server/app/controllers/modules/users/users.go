package userControllersModules

import (
	"github.com/Xi-Yuer/cms/domain/constant"
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/support/utils"
	"github.com/gin-gonic/gin"
)

var UserController = &userController{}

type userController struct{}

// CreateUser 创建用户
func (u *userController) CreateUser(context *gin.Context) {
	var user types.CreateSingleUserRequest
	err := context.ShouldBind(&user)
	if err != nil {
		utils.Log.Warn("创建用户参数绑定失败", "error", err, "user", user)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	err = UserService.CreateUser(&user)
	if err != nil {
		utils.Log.Error("创建用户失败", "error", err, "user", user)
		utils.Response.ServerError(context, "创建用户失败，请稍后重试")
		return
	}
	utils.Response.Success(context, nil)
}

// GetUser 获取用户
func (u *userController) GetUser(context *gin.Context) {
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterTypeError(context, "id不能为空")
		return
	}
	user, err := UserService.GetUser(id)
	if err != nil {
		utils.Response.NotFound(context, "资源不存在")
		return
	}
	utils.Response.Success(context, user)
}

// GetUsers 查询用户
func (u *userController) GetUsers(context *gin.Context) {
	var params types.QueryUsersParams
	err := context.ShouldBind(&params)
	if err != nil {
		utils.Log.Warn("查询用户参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "查询参数格式错误")
		return
	}
	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)
	if params.Limit == 0 {
		utils.Response.ParameterTypeError(context, "limit参数不正确")
		return
	}
	users, err := UserService.FindUserByParams(&params)
	if err != nil {
		utils.Log.Error("查询用户列表失败", "error", err)
		utils.Response.ServerError(context, "查询失败，请稍后重试")
		return
	}
	utils.Response.Success(context, users)
}

// FindUserByParamsAndOutRoleID 查询角色以外的用户
func (u *userController) FindUserByParamsAndOutRoleID(context *gin.Context) {
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterTypeError(context, "id不能为空")
		return
	}
	var params types.QueryUsersParams
	err := context.ShouldBind(&params)
	if err != nil {
		utils.Log.Warn("查询角色外用户参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "查询参数格式错误")
		return
	}
	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)
	if params.Limit == 0 {
		utils.Response.ParameterTypeError(context, "limit参数不正确")
		return
	}
	users, err := UserService.FindUserByParamsAndOutRoleID(id, &params)
	if err != nil {
		utils.Log.Error("查询角色外用户失败", "error", err, "roleID", id)
		utils.Response.ServerError(context, "查询失败，请稍后重试")
		return
	}
	utils.Response.Success(context, users)
}

// UpdateUser 更新用户
func (u *userController) UpdateUser(context *gin.Context) {
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterTypeError(context, "id不能为空")
		return
	}
	var user types.UpdateUserRequest
	err := context.ShouldBind(&user)
	if err != nil {
		utils.Log.Warn("更新用户参数绑定失败", "error", err, "userId", id)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	jwtPayload, exist := context.Get(constant.JWTPAYLOAD)
	// 判断是否为管理员或者用户自己
	if jwtPayload.(*types.JWTPayload).IsAdmin == 1 || jwtPayload.(*types.JWTPayload).ID == id {
		err = UserService.UpdateUser(&user, id)
		if err != nil {
			utils.Log.Error("更新用户失败", "error", err, "userId", id)
			utils.Response.ServerError(context, "更新失败，请稍后重试")
			return
		}
		utils.Response.Success(context, nil)
		return
	}
	// 判断是否为普通用户
	if !exist || jwtPayload.(*types.JWTPayload).ID != id {
		utils.Log.Warn("更新用户权限不足", "userId", id, "jwtPayload", jwtPayload)
		utils.Response.NoPermission(context, "暂无权限")
		return
	}
}

// DeleteUser 删除用户
func (u *userController) DeleteUser(context *gin.Context) {
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterTypeError(context, "id不能为空")
		return
	}
	err := UserService.DeleteUser(id)
	if err != nil {
		utils.Log.Error("删除用户失败", "error", err, "userId", id)
		utils.Response.ServerError(context, "删除失败，请稍后重试")
		return
	}
	utils.Response.Success(context, nil)
}

// GetUserByRoleID 查询用户（查询某个角色下的所有用户）
func (u *userController) GetUserByRoleID(context *gin.Context) {
	roleID := context.Param("id")
	var params types.Page
	if roleID == "" {
		utils.Response.ParameterTypeError(context, "角色ID不能为空")
		return
	}
	err := context.ShouldBind(&params)
	if err != nil {
		utils.Log.Warn("查询角色下用户参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	validatedLimit, validatedOffset := utils.Pagination.ValidatePaginationParams(params.Limit, params.Offset)
	*params.Limit = validatedLimit
	*params.Offset = validatedOffset
	singleResponses, err := UserService.GetUserByRoleID(roleID, params)
	if err != nil {
		utils.Log.Error("查询角色下用户失败", "error", err, "roleID", roleID, "params", params)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	utils.Response.Success(context, singleResponses)
}

// ExportExcel 导出用户
func (u *userController) ExportExcel(context *gin.Context) {
	var IDs types.ExportExcelResponse
	err := context.ShouldBind(&IDs)
	if err != nil {
		utils.Log.Warn("导出用户参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	responses, err := UserService.ExportExcel(&IDs)
	if err != nil {
		utils.Log.Error("导出用户失败", "error", err, "IDs", IDs)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
	var data [][]interface{}
	data = append(data, []interface{}{"ID", "账号", "昵称", "头像", "状态", "部门ID", "角色ID", "接口权限", "创建时间", "更新时间"})
	for _, response := range responses {
		data = append(data, []interface{}{response.ID, response.Account, response.Nickname, response.Avatar, response.Status, response.DepartmentID, response.RolesID, response.InterfaceDic, response.CreateTime.Format("2006/01/02 03:04:05"), response.UpdateTime.Format("2006/01/02 03:04:05")})
	}
	if err := utils.ExportExcel(context, data, "用户表"); err != nil {
		utils.Log.Error("导出Excel文件失败", "error", err)
		utils.Response.ServerError(context, "操作失败，请稍后重试")
		return
	}
}
