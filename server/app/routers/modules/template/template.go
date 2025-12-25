package templateRouterModules

import (
	"github.com/Xi-Yuer/cms/app/controllers"
	"github.com/gin-gonic/gin"
)

func UseTTemplateRoutes(r *gin.RouterGroup) {
	group := r.Group("/template")
	{
		group.POST("", controllers.TemplateController.CreateTemplate)
		group.POST("/download", controllers.TemplateController.DownloadTemplateZip)
	}
}
