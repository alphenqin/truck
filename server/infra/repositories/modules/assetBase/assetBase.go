package assetBaseRepositoryModules

import (
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/infra/db"
)

var AssetBaseRepository = &assetBaseRepository{}

type assetBaseRepository struct{}

func (r *assetBaseRepository) CreateAssetDepartment(dept *types.Department) error {
	return db.GormDB.Table("departments").Create(dept).Error
}

func (r *assetBaseRepository) DeleteAssetDepartments(ids []int64) error {
	return db.GormDB.Table("departments").Delete(&types.Department{}, ids).Error
}

func (r *assetBaseRepository) UpdateAssetDepartment(dept *types.Department) error {
	return db.GormDB.Table("departments").Where("department_id = ?", dept.DepartmentId).Updates(dept).Error
}

func (r *assetBaseRepository) QueryAssetDepartments(params *types.QueryDepartmentsParams) ([]types.Department, int64, error) {
	query := db.GormDB.Table("departments AS d").
		Select("d.department_id, d.department_name, d.store_id, s.store_name").
		Joins("LEFT JOIN stores AS s ON d.store_id = s.store_id")
	if params.DepartmentId > 0 {
		query = query.Where("d.department_id = ?", params.DepartmentId)
	}
	if params.DepartmentName != "" {
		query = query.Where("d.department_name LIKE ?", "%"+params.DepartmentName+"%")
	}
	if params.StoreName != "" {
		query = query.Where("s.store_name LIKE ?", "%"+params.StoreName+"%")
	} else if params.StoreId > 0 {
		query = query.Where("d.store_id = ?", params.StoreId)
	}

	var total int64
	var list []types.Department
	if err := query.Count(&total).Limit(params.Limit).Offset(params.Offset).Scan(&list).Error; err != nil {
		return nil, 0, err
	}
	return list, total, nil
}

func (r *assetBaseRepository) CreateAssetType(assetType *types.AssetType) error {
	return db.GormDB.Table("asset_types").Create(assetType).Error
}

func (r *assetBaseRepository) DeleteAssetTypes(ids []int64) error {
	return db.GormDB.Table("asset_types").Delete(&types.AssetType{}, ids).Error
}

func (r *assetBaseRepository) UpdateAssetType(assetType *types.AssetType) error {
	return db.GormDB.Table("asset_types").Where("type_id = ?", assetType.TypeId).Updates(assetType).Error
}

func (r *assetBaseRepository) QueryAssetTypes(params *types.QueryAssetTypesParams) ([]types.AssetType, int64, error) {
	query := db.GormDB.Table("asset_types")
	if params.TypeId > 0 {
		query = query.Where("type_id = ?", params.TypeId)
	}
	if params.TypeName != "" {
		query = query.Where("type_name LIKE ?", "%"+params.TypeName+"%")
	}

	var total int64
	var list []types.AssetType
	if err := query.Count(&total).Limit(params.Limit).Offset(params.Offset).Find(&list).Error; err != nil {
		return nil, 0, err
	}
	return list, total, nil
}

func (r *assetBaseRepository) CreateLine(line *types.Line) error {
	return db.GormDB.Table("lines").Create(line).Error
}

func (r *assetBaseRepository) DeleteLines(ids []int64) error {
	return db.GormDB.Table("lines").Delete(&types.Line{}, ids).Error
}

func (r *assetBaseRepository) UpdateLine(line *types.Line) error {
	return db.GormDB.Table("lines").Where("line_id = ?", line.LineId).Updates(line).Error
}

func (r *assetBaseRepository) QueryLines(params *types.QueryLinesParams) ([]types.Line, int64, error) {
	query := db.GormDB.Table("lines")
	if params.LineId > 0 {
		query = query.Where("line_id = ?", params.LineId)
	}
	if params.LineName != "" {
		query = query.Where("line_name LIKE ?", "%"+params.LineName+"%")
	}

	var total int64
	var list []types.Line
	if err := query.Count(&total).Limit(params.Limit).Offset(params.Offset).Find(&list).Error; err != nil {
		return nil, 0, err
	}
	return list, total, nil
}

func (r *assetBaseRepository) CreateArg(arg *types.Arg) error {
	return db.GormDB.Table("args").Create(arg).Error
}

func (r *assetBaseRepository) DeleteArgs(ids []int64) error {
	return db.GormDB.Table("args").Delete(&types.Arg{}, ids).Error
}

func (r *assetBaseRepository) UpdateArg(id int64, updates map[string]interface{}) error {
	return db.GormDB.Table("args").Where("id = ?", id).Updates(updates).Error
}

func (r *assetBaseRepository) QueryArgs(params *types.QueryArgsParams) ([]types.Arg, int64, error) {
	query := db.GormDB.Table("args")
	if params.ArgKey != "" {
		query = query.Where("arg_key LIKE ?", "%"+params.ArgKey+"%")
	}
	if params.ArgName != "" {
		query = query.Where("arg_name LIKE ?", "%"+params.ArgName+"%")
	}
	if params.ArgValue != "" {
		query = query.Where("arg_value LIKE ?", "%"+params.ArgValue+"%")
	}

	var total int64
	var list []types.Arg
	if err := query.Count(&total).Limit(params.Limit).Offset(params.Offset).Find(&list).Error; err != nil {
		return nil, 0, err
	}
	return list, total, nil
}

func (r *assetBaseRepository) CreateAlarmRule(rule *types.AlarmRule) error {
	return db.GormDB.Table("alarm_rules").Create(rule).Error
}

func (r *assetBaseRepository) DeleteAlarmRules(ids []int64) error {
	return db.GormDB.Table("alarm_rules").Delete(&types.AlarmRule{}, ids).Error
}

func (r *assetBaseRepository) UpdateAlarmRule(rule *types.AlarmRule) error {
	return db.GormDB.Table("alarm_rules").Where("id = ?", rule.Id).Updates(rule).Error
}

func (r *assetBaseRepository) QueryAlarmRules(params *types.QueryAlarmRulesParams) ([]types.AlarmRule, int64, error) {
	query := db.GormDB.Table("alarm_rules")
	if params.RuleName != "" {
		query = query.Where("rule_name LIKE ?", "%"+params.RuleName+"%")
	}
	if params.RuleKey != "" {
		query = query.Where("rule_key LIKE ?", "%"+params.RuleKey+"%")
	}
	if params.RuleValue != "" {
		query = query.Where("rule_value LIKE ?", "%"+params.RuleValue+"%")
	}

	var total int64
	var list []types.AlarmRule
	if err := query.Count(&total).Limit(params.Limit).Offset(params.Offset).Find(&list).Error; err != nil {
		return nil, 0, err
	}
	return list, total, nil
}
