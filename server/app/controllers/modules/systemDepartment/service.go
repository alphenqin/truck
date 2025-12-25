package systemDepartmentControllerModules

import (
	"errors"
	"github.com/Xi-Yuer/cms/domain/types"
	repositories "github.com/Xi-Yuer/cms/infra/repositories/modules"
	"github.com/Xi-Yuer/cms/support/utils"
)

var SystemDepartmentService = &departmentService{}

type departmentService struct{}

func (d *departmentService) CreateDepartment(params *types.CreateDepartmentRequest) error {
	return repositories.SystemDepartmentRepository.CreateDepartment(params)
}

func (d *departmentService) DeleteDepartment(id string) error {
	if department := repositories.SystemDepartmentRepository.GetDepartmentByID(id); department.ID == "" {
		return errors.New("资源不存在")
	}
	return repositories.SystemDepartmentRepository.DeleteDepartment(id)
}

func (d *departmentService) GetDepartments() ([]*types.DepartmentResponse, error) {
	department, err := repositories.SystemDepartmentRepository.GetDepartments()
	if err != nil {
		return nil, err
	}
	buildDepartment := utils.BuildDepartment(department)
	return buildDepartment, nil
}

func (d *departmentService) UpdateDepartment(id string, params *types.UpdateDepartmentRequest) error {
	if department := repositories.SystemDepartmentRepository.GetDepartmentByID(id); department.ID == "" {
		return errors.New("资源不存在")
	}
	return repositories.SystemDepartmentRepository.UpdateDepartment(id, params)
}
