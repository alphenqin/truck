package authControllersModules

import (
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/support/utils"
	"github.com/gin-gonic/gin"
)

var AuthController = &authController{}

type authController struct{}

// Login 登录
func (a *authController) Login(context *gin.Context) {
	var loginParams types.LoginRequestParams
	if err := context.ShouldBind(&loginParams); err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}

	// 登录
	s, err := AuthService.Login(&loginParams)
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.Success(context, s)
}
