package pagesControllerModules

import (
	"github.com/Xi-Yuer/cms/domain/constant"
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/support/utils"
	"github.com/gin-gonic/gin"
)

var PagesController = &pagesController{}

type pagesController struct {
}

// CreatePage 创建菜单
func (p *pagesController) CreatePage(context *gin.Context) {
	var pageParams types.CreatePageParams
	if err := context.ShouldBind(&pageParams); err != nil {
		utils.Log.Warn("创建菜单参数绑定失败", "error", err)
		utils.Response.ParameterMissing(context, "参数缺失")
		return
	}
	if pageParams.IsOutSite && *pageParams.OutSiteLink == "" {
		utils.Response.ParameterMissing(context, "外链地址不能为空")
		return
	}
	err := PageService.CreatePage(&pageParams)
	if err != nil {
		utils.Log.Error("创建菜单失败", "error", err, "page", pageParams)
		utils.Response.ServerError(context, "创建失败，请稍后重试")
		return
	}
	utils.Response.Success(context, nil)
}

// DeletePage 删除菜单
func (p *pagesController) DeletePage(context *gin.Context) {
	param := context.Param("id")
	if param == "" {
		utils.Response.ParameterMissing(context, "pageID不能为空")
		return
	}
	err := PageService.DeletePage(param)
	if err != nil {
		utils.Log.Error("删除菜单失败", "error", err, "pageId", param)
		utils.Response.ServerError(context, "删除失败，请稍后重试")
		return
	}
	utils.Response.Success(context, nil)
}

// GetPages 获取菜单
func (p *pagesController) GetPages(context *gin.Context) {
	pages, err := PageService.GetPages()
	if err != nil {
		utils.Log.Error("查询菜单失败", "error", err)
		utils.Response.ServerError(context, "查询失败，请稍后重试")
		return
	}
	utils.Response.Success(context, pages)
}

// GetUserMenus 获取用户菜单
func (p *pagesController) GetUserMenus(context *gin.Context) {
	jwtPayload, exist := context.Get(constant.JWTPAYLOAD)
	if !exist {
		utils.Response.ParameterMissing(context, "用户id不能为空")
		return
	}
	menus, err := PageService.GetUserMenus(jwtPayload.(*types.JWTPayload).ID)
	if err != nil {
		utils.Log.Error("查询用户菜单失败", "error", err, "userId", jwtPayload.(*types.JWTPayload).ID)
		utils.Response.ServerError(context, "查询失败，请稍后重试")
		return
	}
	utils.Response.Success(context, menus)
}

// UpdatePage 更新菜单
func (p *pagesController) UpdatePage(context *gin.Context) {
	var params *types.UpdatePageRequest
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterMissing(context, "id不能为空")
		return
	}
	err := context.ShouldBind(&params)
	if err != nil {
		utils.Log.Warn("更新菜单参数绑定失败", "error", err, "pageId", id)
		utils.Response.ParameterError(context, "参数格式错误")
		return
	}
	if err := PageService.UpdatePage(id, params); err != nil {
		utils.Log.Error("更新菜单失败", "error", err, "pageId", id)
		utils.Response.ServerError(context, "更新失败，请稍后重试")
		return
	}
	utils.Response.Success(context, "更新成功")
}

// GetPagesByRoleID 根据角色 ID 获取菜单
func (p *pagesController) GetPagesByRoleID(context *gin.Context) {
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterMissing(context, "id不能为空")
		return
	}
	pages, err := PageService.GetPagesByRoleID(id)
	if err != nil {
		utils.Log.Error("查询角色菜单失败", "error", err, "roleId", id)
		utils.Response.ServerError(context, "查询失败，请稍后重试")
		return
	}
	utils.Response.Success(context, pages)
}
