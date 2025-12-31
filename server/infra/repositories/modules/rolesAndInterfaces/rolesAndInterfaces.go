package rolesAndInterfacesRepositoryModules

import (
	"fmt"
	"strings"
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/support/utils"
)

var RolesAndInterfacesRepository = &rolesAndInterfacesRepository{}

type rolesAndInterfacesRepository struct{}

func (r *rolesAndInterfacesRepository) CreateRecord(params *types.CreateRolePermissionRecordParams) error {
	tx, err := db.DB.Begin()
	if err != nil {
		utils.Log.Error("开启事务失败", "error", err, "roleID", params.RoleID)
		return err
	}

	// 使用defer确保事务回滚或提交
	defer func() {
		if err != nil {
			if rollbackErr := tx.Rollback(); rollbackErr != nil {
				utils.Log.Error("事务回滚失败", "error", rollbackErr, "roleID", params.RoleID)
			}
		}
	}()

	// 给角色分配接口权限，需要清空之前的数据
	query := `DELETE FROM roles_interfaces WHERE role_id = ?`
	if _, err = tx.Exec(query, params.RoleID); err != nil {
		utils.Log.Error("删除角色接口权限失败", "error", err, "roleID", params.RoleID)
		return err
	}

	// 接口ID为空，直接提交事务并返回
	if len(params.InterfaceID) == 0 {
		if err = tx.Commit(); err != nil {
			utils.Log.Error("提交事务失败", "error", err, "roleID", params.RoleID)
			return err
		}
		return nil
	}

	// 使用参数化批量插入防止SQL注入
	query = `INSERT INTO roles_interfaces (role_id, interface_id) VALUES `
	placeholders := make([]string, len(params.InterfaceID))
	args := make([]interface{}, len(params.InterfaceID)*2)

	for i, inter := range params.InterfaceID {
		placeholders[i] = "(?, ?)"
		args[i*2] = params.RoleID
		args[i*2+1] = inter
	}
	query += strings.Join(placeholders, ",")

	if _, err = tx.Exec(query, args...); err != nil {
		utils.Log.Error("批量插入角色接口权限失败", "error", err, "roleID", params.RoleID, "interfaceIDs", params.InterfaceID)
		return err
	}

	// 提交事务
	if err = tx.Commit(); err != nil {
		utils.Log.Error("提交事务失败", "error", err, "roleID", params.RoleID)
		return err
	}

	return nil
}
func (r *rolesAndInterfacesRepository) GetRecordByRoleID(roleID string) ([]string, error) {
	query := "SELECT interface_id FROM roles_interfaces WHERE role_id = ?"
	rows, err := db.DB.Query(query, roleID)
	if err != nil {
		utils.Log.Error("查询角色接口权限失败", "error", err, "roleID", roleID)
		return nil, err
	}
	defer rows.Close()

	var interfaceIDs []string
	for rows.Next() {
		var interfaceID string
		if err := rows.Scan(&interfaceID); err != nil {
			utils.Log.Error("扫描接口ID失败", "error", err, "roleID", roleID)
			return nil, err
		}
		interfaceIDs = append(interfaceIDs, interfaceID)
	}

	if err = rows.Err(); err != nil {
		utils.Log.Error("遍历角色接口权限失败", "error", err, "roleID", roleID)
		return nil, err
	}

	return interfaceIDs, nil
}
