package baseRouterModules

import (
	"github.com/Xi-Yuer/cms/controllers"
	"github.com/gin-gonic/gin"
)

func BaseAuthRoutes(r *gin.RouterGroup) {
	// 资产部门
	groupBaseDepartment := r.Group("/base/department")
	{
		// 增
		groupBaseDepartment.POST("", controllers.BaseController.AddDepartment)
		// 删
		groupBaseDepartment.DELETE("/batch-delete", controllers.BaseController.DelDepartment)
		// 改
		groupBaseDepartment.PATCH("/update", controllers.BaseController.UpdateDepartment)
		// 查
		groupBaseDepartment.POST("/query", controllers.BaseController.GetDepartments)
	}

	// 资产类型
	groupBaseType := r.Group("/base/type")
	{
		// 增
		groupBaseType.POST("", controllers.BaseController.AddBType)
		// 删
		groupBaseType.DELETE("/batch-delete", controllers.BaseController.DelBType)
		// 改
		groupBaseType.PATCH("/update", controllers.BaseController.UpdateBType)
		// 查
		groupBaseType.POST("/query", controllers.BaseController.GetBTypes)
	}

	// 周转线路设置
	groupLine := r.Group("/base/line")
	{
		// 增
		groupLine.POST("", controllers.BaseController.AddLine)
		// 删
		groupLine.DELETE("/batch-delete", controllers.BaseController.DelLine)
		// 改
		groupLine.PATCH("/update", controllers.BaseController.UpdateLine)
		// 查
		groupLine.POST("/query", controllers.BaseController.GetLines)
	}

	groupArg := r.Group("/base/arg")
	{
		// 增
		groupArg.POST("", controllers.BaseController.AddArg)
		// 删
		groupArg.DELETE("/batch-delete", controllers.BaseController.DelArg)
		// 改
		groupArg.PATCH("/update/:id", controllers.BaseController.UpdateArg)
		// 查
		groupArg.POST("/query", controllers.BaseController.GetArgs)
	}

	groupNotice := r.Group("/base/notice")
	{
		// 增
		groupNotice.POST("", controllers.BaseController.AddNotice)
		// 删
		groupNotice.DELETE("/batch-delete", controllers.BaseController.DelNotice)
		// 改
		groupNotice.PATCH("/update/:id", controllers.BaseController.UpdateNotice)
		// 查
		groupNotice.POST("/query", controllers.BaseController.GetNotices)
	}
}
