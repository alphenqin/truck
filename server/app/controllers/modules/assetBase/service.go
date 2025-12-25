package assetBaseControllersModules

import (
	"github.com/Xi-Yuer/cms/domain/types"
	repositories "github.com/Xi-Yuer/cms/infra/repositories/modules"
)

var AssetBaseService = &assetBaseService{}

type assetBaseService struct{}

func (s *assetBaseService) CreateAssetDepartment(dept *types.Department) error {
	return repositories.AssetBaseRepository.CreateAssetDepartment(dept)
}

func (s *assetBaseService) DeleteAssetDepartments(ids []int64) error {
	return repositories.AssetBaseRepository.DeleteAssetDepartments(ids)
}

func (s *assetBaseService) UpdateAssetDepartment(dept *types.Department) error {
	return repositories.AssetBaseRepository.UpdateAssetDepartment(dept)
}

func (s *assetBaseService) QueryAssetDepartments(params *types.QueryDepartmentsParams) ([]types.Department, int64, error) {
	return repositories.AssetBaseRepository.QueryAssetDepartments(params)
}

func (s *assetBaseService) CreateAssetType(assetType *types.AssetType) error {
	return repositories.AssetBaseRepository.CreateAssetType(assetType)
}

func (s *assetBaseService) DeleteAssetTypes(ids []int64) error {
	return repositories.AssetBaseRepository.DeleteAssetTypes(ids)
}

func (s *assetBaseService) UpdateAssetType(assetType *types.AssetType) error {
	return repositories.AssetBaseRepository.UpdateAssetType(assetType)
}

func (s *assetBaseService) QueryAssetTypes(params *types.QueryAssetTypesParams) ([]types.AssetType, int64, error) {
	return repositories.AssetBaseRepository.QueryAssetTypes(params)
}

func (s *assetBaseService) CreateLine(line *types.Line) error {
	return repositories.AssetBaseRepository.CreateLine(line)
}

func (s *assetBaseService) DeleteLines(ids []int64) error {
	return repositories.AssetBaseRepository.DeleteLines(ids)
}

func (s *assetBaseService) UpdateLine(line *types.Line) error {
	return repositories.AssetBaseRepository.UpdateLine(line)
}

func (s *assetBaseService) QueryLines(params *types.QueryLinesParams) ([]types.Line, int64, error) {
	return repositories.AssetBaseRepository.QueryLines(params)
}

func (s *assetBaseService) CreateArg(arg *types.Arg) error {
	return repositories.AssetBaseRepository.CreateArg(arg)
}

func (s *assetBaseService) DeleteArgs(ids []int64) error {
	return repositories.AssetBaseRepository.DeleteArgs(ids)
}

func (s *assetBaseService) UpdateArg(id int64, updates map[string]interface{}) error {
	return repositories.AssetBaseRepository.UpdateArg(id, updates)
}

func (s *assetBaseService) QueryArgs(params *types.QueryArgsParams) ([]types.Arg, int64, error) {
	return repositories.AssetBaseRepository.QueryArgs(params)
}

func (s *assetBaseService) CreateAlarmRule(rule *types.AlarmRule) error {
	return repositories.AssetBaseRepository.CreateAlarmRule(rule)
}

func (s *assetBaseService) DeleteAlarmRules(ids []int64) error {
	return repositories.AssetBaseRepository.DeleteAlarmRules(ids)
}

func (s *assetBaseService) UpdateAlarmRule(rule *types.AlarmRule) error {
	return repositories.AssetBaseRepository.UpdateAlarmRule(rule)
}

func (s *assetBaseService) QueryAlarmRules(params *types.QueryAlarmRulesParams) ([]types.AlarmRule, int64, error) {
	return repositories.AssetBaseRepository.QueryAlarmRules(params)
}
