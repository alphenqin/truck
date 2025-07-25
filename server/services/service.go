package services

import (
	authServiceModules "github.com/Xi-Yuer/cms/services/modules/auth"
	departmentServiceModules "github.com/Xi-Yuer/cms/services/modules/department"
	interfaceServiceModules "github.com/Xi-Yuer/cms/services/modules/interface"
	logsServiceModules "github.com/Xi-Yuer/cms/services/modules/logs"
	pagesServiceModules "github.com/Xi-Yuer/cms/services/modules/pages"
	rolesServiceModules "github.com/Xi-Yuer/cms/services/modules/roles"
	rolesAndInterfacesServiceModules "github.com/Xi-Yuer/cms/services/modules/rolesAndInterfaces"
	siteLibraryServiceModules "github.com/Xi-Yuer/cms/services/modules/siteLibrary"
	templateServiceModule "github.com/Xi-Yuer/cms/services/modules/template"
	timeTaskServiceModules "github.com/Xi-Yuer/cms/services/modules/timeTask"
	uploadServiceModules "github.com/Xi-Yuer/cms/services/modules/upload"
	userServiceModules "github.com/Xi-Yuer/cms/services/modules/users"
)

var UserService = userServiceModules.UserService
var AuthService = authServiceModules.AuthService
var RoleService = rolesServiceModules.RolesService
var PageService = pagesServiceModules.PageService
var DepartmentService = departmentServiceModules.DepartmentService
var InterfaceService = interfaceServiceModules.InterfaceService
var LogsService = logsServiceModules.LogsService
var RolesAndInterfacesService = rolesAndInterfacesServiceModules.RolesAndInterfacesService
var TimeTaskService = timeTaskServiceModules.TimeTaskService
var UploadService = uploadServiceModules.UploadService
var TemplateService = templateServiceModule.TemplateService

var SiteLibraryService = siteLibraryServiceModules.SiteLibraryService
