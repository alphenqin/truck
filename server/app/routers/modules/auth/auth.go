package authRouterModules

import (
	"github.com/Xi-Yuer/cms/app/controllers"
	"github.com/gin-gonic/gin"
)

func UseAuthRoutes(r *gin.RouterGroup) {
	group := r.Group("/auth")
	{
		group.POST("/login", controllers.AuthController.Login)
	}
}
