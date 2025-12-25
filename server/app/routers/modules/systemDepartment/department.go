package systemDepartmentRouterModules

import (
	"github.com/Xi-Yuer/cms/app/controllers"
	"github.com/gin-gonic/gin"
)

func UseDepartmentRoutes(r *gin.RouterGroup) {
	group := r.Group("/department")
	group.POST("", controllers.SystemDepartmentController.CreateDepartment)
	group.DELETE("/:id", controllers.SystemDepartmentController.DeleteDepartment)
	group.GET("", controllers.SystemDepartmentController.GetDepartments)
	group.PATCH("/:id", controllers.SystemDepartmentController.UpdateDepartment)
}
