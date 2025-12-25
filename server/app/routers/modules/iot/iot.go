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
}
