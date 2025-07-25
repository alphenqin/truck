package controllers

import (
	analysisControllersModules "github.com/Xi-Yuer/cms/controllers/modules/analysis"
	assetControllersModules "github.com/Xi-Yuer/cms/controllers/modules/asset"
	authControllersModules "github.com/Xi-Yuer/cms/controllers/modules/auth"
	baseControllersModules "github.com/Xi-Yuer/cms/controllers/modules/base"
	commitsControllerModules "github.com/Xi-Yuer/cms/controllers/modules/commits"
	departmentControllerModules "github.com/Xi-Yuer/cms/controllers/modules/department"
	interfaceControllerModules "github.com/Xi-Yuer/cms/controllers/modules/interface"
	ioRecordControllersModules "github.com/Xi-Yuer/cms/controllers/modules/ioRecord"
	iotControllersModules "github.com/Xi-Yuer/cms/controllers/modules/iot"
	logsControllerModules "github.com/Xi-Yuer/cms/controllers/modules/logs"
	pagesControllerModules "github.com/Xi-Yuer/cms/controllers/modules/pages"
	roleControllersModules "github.com/Xi-Yuer/cms/controllers/modules/role"
	siteLibraryControllersModules "github.com/Xi-Yuer/cms/controllers/modules/siteLibrary"
	systemControllerModules "github.com/Xi-Yuer/cms/controllers/modules/system"
	templateControllerModules "github.com/Xi-Yuer/cms/controllers/modules/template"
	timeTaskControllerModules "github.com/Xi-Yuer/cms/controllers/modules/timeTask"
	uploadControllerModules "github.com/Xi-Yuer/cms/controllers/modules/upload"
	userControllersModules "github.com/Xi-Yuer/cms/controllers/modules/users"
)

// UserController 用户管理控制器，处理用户的增删改查等操作
var UserController = userControllersModules.UserController

// AuthController 认证控制器，处理登录、登出、权限校验等功能
var AuthController = authControllersModules.AuthController

// RoleController 角色管理控制器，处理角色的配置与权限分配等操作
var RoleController = roleControllersModules.RoleController

// PagesController 页面管理控制器，处理前端页面结构或页面权限配置
var PagesController = pagesControllerModules.PagesController

// DepartmentController 部门管理控制器，处理组织架构中的部门信息维护
var DepartmentController = departmentControllerModules.DepartmentController

// InterfaceController 接口管理控制器，处理 API 接口的注册、权限绑定等
var InterfaceController = interfaceControllerModules.InterfaceController

// LogsController 日志管理控制器，处理系统操作日志的查询与管理
var LogsController = logsControllerModules.LogsController

// CommitsController 提交记录控制器，通常用于代码版本、配置更改等记录
var CommitsController = commitsControllerModules.CommitsController

// SystemController 系统设置控制器，处理系统参数配置、平台设置等
var SystemController = systemControllerModules.SystemController

// TimeTaskController 定时任务控制器，处理定时任务的创建、调度与执行
var TimeTaskController = timeTaskControllerModules.TimeTaskController

// UploadController 上传控制器，处理文件上传、存储和访问路径管理等
var UploadController = uploadControllerModules.UploadController

// TemplateController 模板管理控制器，处理模板内容的增删改查，比如导出模板等
var TemplateController = templateControllerModules.TemplateController

// AssetController 资产
var AssetController = assetControllersModules.AssetController

// SiteLibraryController 场库
var SiteLibraryController = siteLibraryControllersModules.SiteLibraryController

var IoRecordController = ioRecordControllersModules.IoRecordController

var BaseController = baseControllersModules.BaseController

var IotController = iotControllersModules.IotController

var AnalysisController = analysisControllersModules.AnalysisController
