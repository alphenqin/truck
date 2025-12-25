package userControllersModules

import (
	"errors"
	"github.com/Xi-Yuer/cms/domain/types"
	repositories "github.com/Xi-Yuer/cms/infra/repositories/modules"
)

var UserAndRolesService = &userAndRolesService{}

type userAndRolesService struct {
}

func (u *userAndRolesService) FindRoleById(id string) error {
	singleRoleResponse := repositories.RoleRepositorysModules.FindRoleById(id)
	if singleRoleResponse == nil {
		return errors.New("资源不存在")
	}
	return nil
}

func (u *userAndRolesService) GetRoles(params *types.QueryRolesParams) (*types.HasTotalResponseData, error) {
	return repositories.RoleRepositorysModules.GetRoles(params)
}

func (u *userAndRolesService) UpdateRole(role *types.UpdateRoleParams, id string) error {
	singleRoleResponse := repositories.RoleRepositorysModules.FindRoleById(id)
	if singleRoleResponse == nil {
		return errors.New("资源不存在")
	}
	return repositories.RoleRepositorysModules.UpdateRole(role, id)
}
