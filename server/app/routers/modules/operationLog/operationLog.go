package operationLogRouterModules

import (
	"github.com/Xi-Yuer/cms/app/controllers"
	"github.com/gin-gonic/gin"
)

func UseOperationLogRoutes(r *gin.RouterGroup) {
	group := r.Group("/monitor")
	{
		group.POST("/logs/query", controllers.OperationLogController.GetOperationLogs)
	}
}
