package routers

import (
	"github.com/Xi-Yuer/cms/app/middlewares"
	analysisRouterModules "github.com/Xi-Yuer/cms/app/routers/modules/analysis"
	assetRouterModules "github.com/Xi-Yuer/cms/app/routers/modules/asset"
	assetBaseRouterModules "github.com/Xi-Yuer/cms/app/routers/modules/assetBase"
	authRouterModules "github.com/Xi-Yuer/cms/app/routers/modules/auth"
	interfaceRpoterModuels "github.com/Xi-Yuer/cms/app/routers/modules/interface"
	ioRecordRouterModules "github.com/Xi-Yuer/cms/app/routers/modules/ioRecord"
	iotRouterModules "github.com/Xi-Yuer/cms/app/routers/modules/iot"
	pagesRouterModules "github.com/Xi-Yuer/cms/app/routers/modules/pages"
	rolesRouterModules "github.com/Xi-Yuer/cms/app/routers/modules/roles"
	siteLibraryRouterModules "github.com/Xi-Yuer/cms/app/routers/modules/siteLibrary"
	systemRouterModules "github.com/Xi-Yuer/cms/app/routers/modules/system"
	systemDepartmentRouterModules "github.com/Xi-Yuer/cms/app/routers/modules/systemDepartment"
	timeTaskRouterModules "github.com/Xi-Yuer/cms/app/routers/modules/timeTask"
	usersRouterModules "github.com/Xi-Yuer/cms/app/routers/modules/users"
	"github.com/Xi-Yuer/cms/config"
	"github.com/gin-gonic/gin"
)

func SetUpRouters() *gin.Engine {
	// 设置 Gin 的运行模式为 Release 模式
	gin.SetMode(gin.ReleaseMode)
	// 创建一个新的 Gin 引擎实例
	r := gin.New()

	// 创建一个路由组 v1，并为该组应用中间件
	v1 := r.Group(
		config.Config.APP.BASEURL,        // 基础 URL
		gin.Logger(),                     // 日志中间件
		middlewares.AuthMiddleWareModule, // 认证中间件
		middlewares.AuthMethodMiddleWare, // 认证方法中间件
		middlewares.SessionMiddleWareModule(config.Config.APP.SESSIONSECRET), // 会话中间件
	)

	{
		// 注册用户相关的路由
		usersRouterModules.UseUserRoutes(v1)
		// 注册认证相关的路由
		authRouterModules.UseAuthRoutes(v1)
		// 注册角色相关的路由
		rolesRouterModules.UseRolesRoutes(v1)
		// 注册页面相关的路由
		pagesRouterModules.UsePagesRoutes(v1)
		// 注册部门相关的路由
		systemDepartmentRouterModules.UseDepartmentRoutes(v1)
		// 注册接口报告相关的路由
		interfaceRpoterModuels.UseInterfaceRouter(v1)
		// 注册系统相关的路由
		systemRouterModules.UseSystemRoutes(v1)
		// 注册定时任务相关的路由
		timeTaskRouterModules.UseTimeTaskRoutes(v1)

		assetRouterModules.AssetRoutes(v1)
		siteLibraryRouterModules.SiteLibraryRoutes(v1)
		ioRecordRouterModules.IoRecordRoutes(v1)
		assetBaseRouterModules.AssetBaseRoutes(v1)
		iotRouterModules.IotAuthRoutes(v1)
		analysisRouterModules.AnalysisRoutes(v1)

	}

	// 返回配置好的 Gin 引擎实例
	return r
}
