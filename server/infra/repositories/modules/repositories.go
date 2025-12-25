package repositories

import (
	assetBaseRepositoryModules "github.com/Xi-Yuer/cms/infra/repositories/modules/assetBase"
	interfaceRepositoryModules "github.com/Xi-Yuer/cms/infra/repositories/modules/interface"
	pagesRepositoryModules "github.com/Xi-Yuer/cms/infra/repositories/modules/pages"
	rolesRepositorysModules "github.com/Xi-Yuer/cms/infra/repositories/modules/roles"
	rolesAndInterfacesRepositoryModules "github.com/Xi-Yuer/cms/infra/repositories/modules/rolesAndInterfaces"
	rolesAndPagesRepositoryModules "github.com/Xi-Yuer/cms/infra/repositories/modules/rolesAndPages"
	systemDepartmentRepositoryModules "github.com/Xi-Yuer/cms/infra/repositories/modules/systemDepartment"
	userRepositorysModules "github.com/Xi-Yuer/cms/infra/repositories/modules/users"
	usersAndRolesRepositorysModules "github.com/Xi-Yuer/cms/infra/repositories/modules/usersAndRoles"
)

var UserRepositorysModules = userRepositorysModules.UserRepository
var RoleRepositorysModules = rolesRepositorysModules.RolesRepository
var UsersAndRolesRepositorys = usersAndRolesRepositorysModules.UsersAndRolesRepositorys
var PageRepositorysModules = pagesRepositoryModules.PageRepository
var RolesAndPagesRepository = rolesAndPagesRepositoryModules.RolesAndPagesRepository
var SystemDepartmentRepository = systemDepartmentRepositoryModules.DepartmentRepository
var AssetBaseRepository = assetBaseRepositoryModules.AssetBaseRepository
var InterfaceRepository = interfaceRepositoryModules.InterfaceRepository
var RolesAndInterfacesRepository = rolesAndInterfacesRepositoryModules.RolesAndInterfacesRepository
