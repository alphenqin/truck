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
// @Summary 创建菜单
// @Description 创建菜单
// @Tags 菜单管理
// @Accept json
// @Produce json
// @Router /pages [post]
func (p *pagesController) CreatePage(context *gin.Context) {
	var pageParams types.CreatePageParams
	if err := context.ShouldBind(&pageParams); err != nil {
		utils.Response.ParameterMissing(context, err.Error())
		return
	}
	if pageParams.IsOutSite && *pageParams.OutSiteLink == "" {
		utils.Response.ParameterMissing(context, "外链地址不能为空")
		return
	}
	err := PageService.CreatePage(&pageParams)
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.Success(context, nil)
}

// DeletePage 删除菜单
// @Summary 删除菜单
// @Description 删除菜单
// @Tags 菜单管理
// @Accept json
// @Produce json
// @Router /pages/{id} [delete]
func (p *pagesController) DeletePage(context *gin.Context) {
	param := context.Param("id")
	if param == "" {
		utils.Response.ParameterMissing(context, "pageID不能为空")
		return
	}
	err := PageService.DeletePage(param)
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.Success(context, nil)
}

// GetPages 获取菜单
// @Summary 获取菜单
// @Description 获取菜单
// @Tags 菜单管理
// @Accept json
// @Produce json
// @Router /pages [get]
func (p *pagesController) GetPages(context *gin.Context) {
	pages, err := PageService.GetPages()
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.Success(context, pages)
}

// GetUserMenus 获取用户菜单
// @Summary 获取用户菜单
// @Description 获取用户菜单
// @Tags 菜单管理
// @Accept json
// @Produce json
// @Success 200 {string} json "{"code":200,"data":{},"msg":"ok"}"
// @Router /pages/user [get]
func (p *pagesController) GetUserMenus(context *gin.Context) {
	jwtPayload, exist := context.Get(constant.JWTPAYLOAD)
	if !exist {
		utils.Response.ParameterMissing(context, "用户id不能为空")
		return
	}
	menus, err := PageService.GetUserMenus(jwtPayload.(*types.JWTPayload).ID)
	if err != nil {
		return
	}
	utils.Response.Success(context, menus)
}

// UpdatePage 更新菜单
// @Summary 更新菜单
// @Description 更新菜单
// @Tags 菜单管理
// @Accept json
// @Produce json
// @Success 200 {string} json "{"code":200,"data":{},"msg":"ok"}"
// @Router /pages/{id} [patch]
func (p *pagesController) UpdatePage(context *gin.Context) {
	var params *types.UpdatePageRequest
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterMissing(context, "id不能为空")
		return
	}
	err := context.ShouldBind(&params)
	if err != nil {
		utils.Response.ParameterError(context, err.Error())
		return
	}
	if err := PageService.UpdatePage(id, params); err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.Success(context, "更新成功")
}

// GetPagesByRoleID 根据角色 ID 获取菜单
// @Summary 获取角色菜单
// @Description 获取角色菜单
// @Tags 获取角色菜单
// @Accept json
// @Produce json
// @Success 200 {string} json "{"code":200,"data":{},"msg":"ok"}"
// @Router /pages/role/{id} [get]
func (p *pagesController) GetPagesByRoleID(context *gin.Context) {
	id := context.Param("id")
	if id == "" {
		utils.Response.ParameterMissing(context, "id不能为空")
		return
	}
	pages, err := PageService.GetPagesByRoleID(id)
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.Success(context, pages)
}
