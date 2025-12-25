package systemDepartmentRepositoryModules

import (
	"database/sql"
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/support/utils"
)

var DepartmentRepository = &departmentRepository{}

type departmentRepository struct{}

func (d *departmentRepository) CreateDepartment(params *types.CreateDepartmentRequest) error {

	id := utils.GenID()
	query := "INSERT INTO department (id,department_name, description, parent_department, department_order) VALUES (?,?,?,?,?)"
	values := []interface{}{id, params.DepartmentName, params.DepartmentDescription, params.ParentDepartment, params.DepartmentOrder}
	if _, err := db.DB.Exec(query, values...); err != nil {
		return err
	}
	return nil
}

func (d *departmentRepository) DeleteDepartment(id string) error {
	query := "DELETE FROM department WHERE id = ?"
	_, err := db.DB.Exec(query, id)
	return err
}

func (d *departmentRepository) GetDepartments() ([]*types.DepartmentResponse, error) {
	query := "SELECT id,department_name,parent_department,description,department_order, create_time,update_time FROM department WHERE delete_time IS NULL"
	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			utils.Log.Error(err)
		}
	}(rows)
	var departments []*types.DepartmentResponse
	for rows.Next() {
		var department types.DepartmentResponse
		err := rows.Scan(&department.ID, &department.DepartmentName, &department.ParentDepartment, &department.DepartmentDescription, &department.DepartmentOrder, &department.CreateTime, &department.UpdateTime)
		if err != nil {
			return nil, err
		}
		departments = append(departments, &department)
	}
	return departments, nil
}

func (d *departmentRepository) UpdateDepartment(id string, params *types.UpdateDepartmentRequest) error {
	query := "UPDATE department SET "
	var (
		queryParams []any
		hasSet      bool
	)
	if params.DepartmentName != "" {
		query += "department_name = ?,"
		queryParams = append(queryParams, params.DepartmentName)
		hasSet = true
	}
	if params.ParentDepartment != "" {
		query += "parent_department = ?,"
		queryParams = append(queryParams, params.ParentDepartment)
		hasSet = true
	}
	if params.DepartmentDescription != "" {
		query += "description = ?,"
		queryParams = append(queryParams, params.DepartmentDescription)
		hasSet = true
	}
	if params.DepartmentOrder != 0 {
		query += "department_order = ?,"
		queryParams = append(queryParams, params.DepartmentOrder)
		hasSet = true
	}
	if !hasSet {
		return nil
	}
	query = query[:len(query)-1] // remove the last comma
	query += " WHERE id = ?"
	queryParams = append(queryParams, id)
	_, err := db.DB.Exec(query, queryParams...)
	return err
}

func (d *departmentRepository) GetDepartmentByID(id string) *types.DepartmentResponse {
	query := "SELECT id, department_name, parent_department, create_time, update_time, department_order FROM department WHERE id = ? AND delete_time IS NULL"
	rows, err := db.DB.Query(query, id)
	if err != nil {
		return nil
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			utils.Log.Error(err)
		}
	}(rows)
	var department types.DepartmentResponse
	for rows.Next() {
		err := rows.Scan(&department.ID, &department.DepartmentName, &department.ParentDepartment, &department.CreateTime, &department.UpdateTime, &department.DepartmentOrder)
		if err != nil {
			utils.Log.Error(err)
			return nil
		}
	}
	return &department
}
