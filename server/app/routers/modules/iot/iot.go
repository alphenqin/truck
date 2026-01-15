package iotRouterModules

import (
	"github.com/Xi-Yuer/cms/app/controllers"
	"github.com/gin-gonic/gin"
)

func IotAuthRoutes(r *gin.RouterGroup) {
	groupGateway := r.Group("/iot/gateway")
	{
		// 增
		groupGateway.POST("", controllers.IotController.AddGateway)
		// 删
		groupGateway.DELETE("/batch-delete", controllers.IotController.DelGateway)
		// 改
		groupGateway.PATCH("/update/:id", controllers.IotController.UpdateGateway)
		// 查
		groupGateway.POST("/query", controllers.IotController.GetGateways)
		// 开启但离线的网关
		groupGateway.GET("/offline", controllers.IotController.GetOfflineGateways)
	}

	groupTag := r.Group("/iot/tag")
	{
		// 增
		groupTag.POST("", controllers.IotController.AddTag)
		// 删
		groupTag.DELETE("/batch-delete", controllers.IotController.DelTag)
		// 改
		groupTag.PATCH("/update/:id", controllers.IotController.UpdateTag)
		// 查
		groupTag.POST("/query", controllers.IotController.GetTags)

		groupTag.GET("/map", controllers.IotController.GetTagMap)
	}

	groupInventoryDetail := r.Group("/iot/inventory-detail")
	{
		// 查 - 盘点详情
		groupInventoryDetail.POST("/query", controllers.IotController.GetInventoryDetails)
	}

	groupInventoryRecords := r.Group("/iot/inventory-records")
	{
		// 查 - 近24小时盘点状态趋势
		groupInventoryRecords.GET("/status-trend", controllers.IotController.GetInventoryStatusTrend)
	}
}
