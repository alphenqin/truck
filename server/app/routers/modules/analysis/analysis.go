package analysisRouterModules

import (
	"github.com/Xi-Yuer/cms/app/controllers"
	"github.com/gin-gonic/gin"
)

func AnalysisRoutes(r *gin.RouterGroup) {
	group := r.Group("/analysis")
	{
		group.POST("/asset/count", controllers.AnalysisController.Asset)
	}
}
