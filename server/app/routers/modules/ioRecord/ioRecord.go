package ioRecordRouterModules

import (
	"github.com/Xi-Yuer/cms/app/controllers"
	"github.com/gin-gonic/gin"
)

func IoRecordRoutes(r *gin.RouterGroup) {
	group := r.Group("/io-record")
	{
		group.POST("/query", controllers.IoRecordController.GetIoRecords)
		group.GET("/panel", controllers.IoRecordController.GetPanel)
		group.GET("/panel-v2", controllers.IoRecordController.GetPanelV2)
		group.GET("/flow/stats", controllers.IoRecordController.GetFlowStats)
		group.GET("/stay", controllers.IoRecordController.GetAssetStay)

		group.POST("/buzzer", controllers.IoRecordController.AddBuzzer)
		group.DELETE("/buzzer/batch-delete", controllers.IoRecordController.DelBuzzers)
		group.PATCH("/buzzer/update", controllers.IoRecordController.UpdateBuzzer)
		group.POST("/buzzer/query", controllers.IoRecordController.GetBuzzer)

		group.POST("/flow", controllers.IoRecordController.GetFlows)
	}
}
