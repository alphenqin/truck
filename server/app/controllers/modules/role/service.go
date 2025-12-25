package roleControllersModules

import (
	"errors"
	"github.com/Xi-Yuer/cms/domain/types"
	repositories "github.com/Xi-Yuer/cms/infra/repositories/modules"
	"strconv"
)

var RolesService = &rolesService{}
var RoleService = RolesService

type rolesService struct{}

func (r *rolesService) CreateRole(role *types.CreateRoleParams) error {
	roleID := repositories.RoleRepositorysModules.CreateRole(role)
	if roleID == 0 {
		return errors.New("角色创建失败")
	}
	return r.CreateRolePermissionsRecord(&types.CreateRolePermissionRecordParams{RoleID: strconv.FormatInt(roleID, 10), PageID: role.PageID, InterfaceID: role.InterfaceID})
}

func (r *rolesService) DeleteRole(id string) error {
	singleRoleResponse := repositories.RoleRepositorysModules.FindRoleById(id)
	if singleRoleResponse == nil {
		return errors.New("资源不存在")
	}
	if singleRoleResponse.CanEdit == 0 {
		return errors.New("该角色禁止删除")
	}
	return repositories.RoleRepositorysModules.DeleteRole(id)
}

func (r *rolesService) UpdateRole(role *types.UpdateRoleParams, id string) error {
	singleRoleResponse := repositories.RoleRepositorysModules.FindRoleById(id)
	if singleRoleResponse == nil {
		return errors.New("资源不存在")
	}
	if singleRoleResponse.CanEdit == 0 {
		return errors.New("该角色禁止编辑")
	}
	var err error
	// 更新角色权限
	err = r.CreateRolePermissionsRecord(&types.CreateRolePermissionRecordParams{RoleID: id, PageID: role.PageID, InterfaceID: role.InterfaceID})
	if err != nil {
		return err
	}
	// 更新角色基本信息
	err = repositories.RoleRepositorysModules.UpdateRole(role, id)
	return err

}
func (r *rolesService) GetRoles(params *types.QueryRolesParams) (*types.HasTotalResponseData, error) {
	return repositories.RoleRepositorysModules.GetRoles(params)
}

func (r *rolesService) CreateRolePermissionsRecord(params *types.CreateRolePermissionRecordParams) error {
	// 检查角色是否存在
	if err := repositories.RoleRepositorysModules.CheckRolesExistence([]string{params.RoleID}); err != nil {
		return errors.New("资源不存在")
	}
	// 检查页面是否存在
	if params.PageID != nil && len(params.PageID) > 0 {
		if err := repositories.PageRepositorysModules.CheckPagesExistence(params.PageID); err != nil {
			return errors.New("资源不存在")
		}
	}

	if params.InterfaceID != nil && len(params.InterfaceID) > 0 {
		if err := repositories.InterfaceRepository.CheckInterfacesExistence(params.InterfaceID); err != nil {
			return errors.New("资源不存在")
		}
	}
	var err error
	// 创建角色接口权限
	err = repositories.RolesAndInterfacesRepository.CreateRecord(params)
	if err != nil {
		return err
	}
	// 创建角色页面权限
	err = repositories.RolesAndPagesRepository.CreateRecord(params)
	return err
}
func (r *rolesService) ExportExcel(params *types.ExportExcelResponse) ([]*types.SingleRoleResponse, error) {
	return repositories.RoleRepositorysModules.ExportExcel(params)
}

func (r *rolesService) CreateOneRecord(params *types.CreateOneRecord) error {
	return repositories.UsersAndRolesRepositorys.CreateOneRecord(params)
}

func (r *rolesService) DeleteOneRecord(params *types.DeleteOneRecord) error {
	user, b := repositories.UserRepositorysModules.FindUserById(params.UserID)
	if !b {
		return errors.New("资源不存在")
	}
	if user.IsAdmin == 1 {
		return errors.New("系统资源，禁止删除")
	}
	return repositories.UsersAndRolesRepositorys.DeleteOneRecord(params)
}
