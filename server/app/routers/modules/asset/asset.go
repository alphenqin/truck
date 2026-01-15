package assetRouterModules

import (
	"github.com/Xi-Yuer/cms/app/controllers"
	"github.com/gin-gonic/gin"
)

func AssetRoutes(r *gin.RouterGroup) {
	groupAsset := r.Group("/asset")
	{
		groupAsset.POST("", controllers.AssetController.AddAsset)
		groupAsset.PATCH("/update/:assetId", controllers.AssetController.UpdateAsset)
		groupAsset.DELETE("/batch-delete", controllers.AssetController.DelAsset)
		groupAsset.POST("/query", controllers.AssetController.GetAssets)
		groupAsset.POST("/bind/query", controllers.AssetController.GetAssetBinds)
		groupAsset.POST("/bind", controllers.AssetController.CreateAssetBind)
		groupAsset.PATCH("/bind/:id", controllers.AssetController.UpdateAssetBind)
		groupAsset.DELETE("/bind/:id", controllers.AssetController.DeleteAssetBind)
		groupAsset.DELETE("/bind/batch-delete", controllers.AssetController.BatchDeleteAssetBind)

		groupAsset.GET("/status", controllers.AssetController.GetStatus)
		groupAsset.GET("/in-storage/distribution", controllers.AssetController.GetInStorageDistribution)
		groupAsset.POST("/update/type", controllers.AssetController.UpdateType)
		groupAsset.GET("/repairs/:assetId", controllers.AssetController.GetAssetRepairs)

		groupAsset.POST("/exception/lost", controllers.AssetController.QueryLost)
		groupAsset.GET("/exception/lost/stats", controllers.AssetController.QueryLostStats)
		groupAsset.POST("/exception/flow/list", controllers.AssetController.QueryFlow)
		groupAsset.POST("/exception/handle", controllers.AssetController.HandleException)
		groupAsset.POST("/exception/batchHandle", controllers.AssetController.BatchHandleException)
		groupAsset.POST("/exception/export", controllers.AssetController.ExportException)
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
