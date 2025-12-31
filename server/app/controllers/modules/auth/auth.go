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
		utils.Log.Warn("登录参数绑定失败", "error", err, "account", loginParams.Account)
		utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}

	// 登录
	s, err := AuthService.Login(&loginParams)
	if err != nil {
		// 登录失败不记录详细错误信息（防止信息泄露）
		utils.Log.Warn("登录失败", "account", loginParams.Account)
		utils.Response.ServerError(context, "登录失败，请检查账号密码")
		return
	}
	utils.Response.Success(context, s)
}
