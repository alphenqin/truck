package controllers

import (
	analysisControllersModules "github.com/Xi-Yuer/cms/app/controllers/modules/analysis"
	assetControllersModules "github.com/Xi-Yuer/cms/app/controllers/modules/asset"
	assetBaseControllersModules "github.com/Xi-Yuer/cms/app/controllers/modules/assetBase"
	authControllersModules "github.com/Xi-Yuer/cms/app/controllers/modules/auth"
	interfaceControllerModules "github.com/Xi-Yuer/cms/app/controllers/modules/interface"
	ioRecordControllersModules "github.com/Xi-Yuer/cms/app/controllers/modules/ioRecord"
	iotControllersModules "github.com/Xi-Yuer/cms/app/controllers/modules/iot"
	pagesControllerModules "github.com/Xi-Yuer/cms/app/controllers/modules/pages"
	roleControllersModules "github.com/Xi-Yuer/cms/app/controllers/modules/role"
	siteLibraryControllersModules "github.com/Xi-Yuer/cms/app/controllers/modules/siteLibrary"
	systemControllerModules "github.com/Xi-Yuer/cms/app/controllers/modules/system"
	systemDepartmentControllerModules "github.com/Xi-Yuer/cms/app/controllers/modules/systemDepartment"
	templateControllerModules "github.com/Xi-Yuer/cms/app/controllers/modules/template"
	timeTaskControllerModules "github.com/Xi-Yuer/cms/app/controllers/modules/timeTask"
	userControllersModules "github.com/Xi-Yuer/cms/app/controllers/modules/users"
)

// UserController 用户管理控制器，处理用户的增删改查等操作
var UserController = userControllersModules.UserController

// AuthController 认证控制器，处理登录、登出、权限校验等功能
var AuthController = authControllersModules.AuthController

// RoleController 角色管理控制器，处理角色的配置与权限分配等操作
var RoleController = roleControllersModules.RoleController

// PagesController 页面管理控制器，处理前端页面结构或页面权限配置
var PagesController = pagesControllerModules.PagesController

// SystemDepartmentController 部门管理控制器，处理组织架构中的部门信息维护
var SystemDepartmentController = systemDepartmentControllerModules.SystemDepartmentController

// InterfaceController 接口管理控制器，处理 API 接口的注册、权限绑定等
var InterfaceController = interfaceControllerModules.InterfaceController

// SystemController 系统设置控制器，处理系统参数配置、平台设置等
var SystemController = systemControllerModules.SystemController

// TimeTaskController 定时任务控制器，处理定时任务的创建、调度与执行
var TimeTaskController = timeTaskControllerModules.TimeTaskController

// TemplateController 模板管理控制器，处理模板内容的增删改查，比如导出模板等
var TemplateController = templateControllerModules.TemplateController

// AssetController 资产
var AssetController = assetControllersModules.AssetController

// SiteLibraryController 场库
var SiteLibraryController = siteLibraryControllersModules.SiteLibraryController

var IoRecordController = ioRecordControllersModules.IoRecordController

var AssetBaseController = assetBaseControllersModules.AssetBaseController

var IotController = iotControllersModules.IotController

var AnalysisController = analysisControllersModules.AnalysisController
