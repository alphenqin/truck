package assetBaseRouterModules

import (
	"github.com/Xi-Yuer/cms/app/controllers"
	"github.com/gin-gonic/gin"
)

func AssetBaseRoutes(r *gin.RouterGroup) {
	// 资产部门
	groupBaseDepartment := r.Group("/base/department")
	{
		// 增
		groupBaseDepartment.POST("", controllers.AssetBaseController.AddDepartment)
		// 删
		groupBaseDepartment.DELETE("/batch-delete", controllers.AssetBaseController.DelDepartment)
		// 改
		groupBaseDepartment.PATCH("/update", controllers.AssetBaseController.UpdateDepartment)
		// 查
		groupBaseDepartment.POST("/query", controllers.AssetBaseController.GetDepartments)
	}

	// 资产类型
	groupBaseType := r.Group("/base/type")
	{
		// 增
		groupBaseType.POST("", controllers.AssetBaseController.AddBType)
		// 删
		groupBaseType.DELETE("/batch-delete", controllers.AssetBaseController.DelBType)
		// 改
		groupBaseType.PATCH("/update", controllers.AssetBaseController.UpdateBType)
		// 查
		groupBaseType.POST("/query", controllers.AssetBaseController.GetBTypes)
	}

	// 周转线路设置
	groupLine := r.Group("/base/line")
	{
		// 增
		groupLine.POST("", controllers.AssetBaseController.AddLine)
		// 删
		groupLine.DELETE("/batch-delete", controllers.AssetBaseController.DelLine)
		// 改
		groupLine.PATCH("/update", controllers.AssetBaseController.UpdateLine)
		// 查
		groupLine.POST("/query", controllers.AssetBaseController.GetLines)
	}

	groupArg := r.Group("/base/arg")
	{
		// 增
		groupArg.POST("", controllers.AssetBaseController.AddArg)
		// 删
		groupArg.DELETE("/batch-delete", controllers.AssetBaseController.DelArg)
		// 改
		groupArg.PATCH("/update/:id", controllers.AssetBaseController.UpdateArg)
		// 查
		groupArg.POST("/query", controllers.AssetBaseController.GetArgs)
	}

	groupNotice := r.Group("/base/notice")
	{
		// 增
		groupNotice.POST("", controllers.AssetBaseController.AddNotice)
		// 删
		groupNotice.DELETE("/batch-delete", controllers.AssetBaseController.DelNotice)
		// 改
		groupNotice.PATCH("/update/:id", controllers.AssetBaseController.UpdateNotice)
		// 查
		groupNotice.POST("/query", controllers.AssetBaseController.GetNotices)
	}
}
