package siteLibraryRouterModules

import (
	"github.com/Xi-Yuer/cms/controllers"
	"github.com/gin-gonic/gin"
)

func SiteLibraryRoutes(r *gin.RouterGroup) {
	groupGarden := r.Group("/sl/garden")
	{
		groupGarden.POST("", controllers.SiteLibraryController.AddGarden)
		groupGarden.DELETE("/batch-delete", controllers.SiteLibraryController.DelGardens)
		groupGarden.PATCH("/update", controllers.SiteLibraryController.UpdateGarden)
		groupGarden.POST("/query", controllers.SiteLibraryController.GetGardens)
	}
	groupStore := r.Group("/sl/store")
	{
		groupStore.POST("", controllers.SiteLibraryController.AddStore)
		groupStore.DELETE("/batch-delete", controllers.SiteLibraryController.DelStores)
		groupStore.PATCH("/update", controllers.SiteLibraryController.UpdateStore)
		groupStore.POST("/query", controllers.SiteLibraryController.GetStore)

		groupStore.GET("/map", controllers.SiteLibraryController.GetStoreMap)
	}
}
