package interfaceControllerModules

import (
	"errors"
	"github.com/Xi-Yuer/cms/domain/types"
	repositories "github.com/Xi-Yuer/cms/infra/repositories/modules"
)

var InterfaceService = &interfaceService{}

type interfaceService struct{}

func (i *interfaceService) CreateInterface(params *types.CreateInterfaceRequest) error {
	return repositories.InterfaceRepository.CreateInterface(params)
}

func (i *interfaceService) GetInterfaceByPageID(id string) []*types.GetInterfaceResponse {
	return repositories.InterfaceRepository.GetInterfaceByPageID(id)
}

func (i *interfaceService) UpdateInterfaceByID(id string, params *types.UpdateInterfaceRequest) error {
	inter, exist := repositories.InterfaceRepository.GetInterfaceByID(id)
	if !exist {
		return errors.New("资源不存在")
	}
	if !inter.CanEdit {
		return errors.New("该资源无法修改")
	}
	return repositories.InterfaceRepository.UpdateInterfaceByID(id, params)
}

func (i *interfaceService) DeleteInterfaceByID(id string) error {
	inter, exist := repositories.InterfaceRepository.GetInterfaceByID(id)
	if !exist {
		return errors.New("资源不存在")
	}
	if !inter.CanEdit {
		return errors.New("该资源无法删除")
	}
	return repositories.InterfaceRepository.DeleteInterfaceByID(id)
}

func (i *interfaceService) GetAllInterface() ([]*types.AllInterfaceResponse, error) {
	return repositories.InterfaceRepository.GetAllInterface()
}
