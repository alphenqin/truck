package assetRouterModules

import (
	"github.com/Xi-Yuer/cms/controllers"
	"github.com/gin-gonic/gin"
)

func AssetRoutes(r *gin.RouterGroup) {
	groupAsset := r.Group("/asset")
	{
		groupAsset.POST("", controllers.AssetController.AddAsset)
		groupAsset.PATCH("/update/:assetId", controllers.AssetController.UpdateAsset)
		groupAsset.DELETE("/batch-delete", controllers.AssetController.DelAsset)
		groupAsset.POST("/query", controllers.AssetController.GetAssets)

		groupAsset.GET("/status", controllers.AssetController.GetStatus)
		groupAsset.POST("/update/type", controllers.AssetController.UpdateType)

		groupAsset.POST("/exception/lost", controllers.AssetController.QueryLost)
		groupAsset.POST("/exception/flow/list", controllers.AssetController.QueryFlow)
	}
	groupMonitor := r.Group("/monitor")
	{
		groupMonitor.POST("/track", controllers.AssetController.GetTrack)
		groupMonitor.POST("/location", controllers.AssetController.GetLocation)

		groupMonitor.GET("/store/list", controllers.AssetController.GetStores)
		groupMonitor.POST("/group/list", controllers.AssetController.GetGroups)
		groupMonitor.POST("/asset/list", controllers.AssetController.AssetList)
		groupMonitor.POST("/ag/update", controllers.AssetController.UpdateAssetGroup)
		groupMonitor.POST("/gs/update", controllers.AssetController.UpdateGroupStore)

	}
}
