package usersAndRolesRepositorysModules

import (
	"database/sql"
	"fmt"
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/support/utils"
)

var UsersAndRolesRepositorys = &usersAndRolesRepositorys{}

type usersAndRolesRepositorys struct {
}

func (u *usersAndRolesRepositorys) CreateRecords(userID string, roleID []string) error {
	if len(roleID) == 0 {
		return fmt.Errorf("roleID列表不能为空")
	}

	// 创建用户角色之前需要先将之前的记录全部删除，并且要保证事务的一致性
	tx, err := db.DB.Begin()
	if err != nil {
		utils.Log.Error("开启事务失败", "error", err, "userID", userID)
		return err
	}

	// 使用defer确保事务回滚或提交
	defer func() {
		if err != nil {
			if rollbackErr := tx.Rollback(); rollbackErr != nil {
				utils.Log.Error("事务回滚失败", "error", rollbackErr, "userID", userID)
			}
		}
	}()

	// 使用事务执行删除操作
	_, err = tx.Exec("DELETE FROM users_roles WHERE user_id = ?", userID)
	if err != nil {
		utils.Log.Error("删除用户角色失败", "error", err, "userID", userID)
		return err
	}

	// 使用参数化批量插入防止SQL注入
	query := "INSERT INTO users_roles (user_id, role_id) VALUES "
	placeholders := make([]string, len(roleID))
	args := make([]interface{}, len(roleID)*2)

	for i, rid := range roleID {
		placeholders[i] = "(?, ?)"
		args[i*2] = userID
		args[i*2+1] = rid
	}
	query += strings.Join(placeholders, ",")

	_, err = tx.Exec(query, args...)
	if err != nil {
		utils.Log.Error("批量插入用户角色失败", "error", err, "userID", userID, "roleIDs", roleID)
		return err
	}

	// 提交事务
	if err = tx.Commit(); err != nil {
		utils.Log.Error("提交事务失败", "error", err, "userID", userID)
		return err
	}

	return nil
}

func (u *usersAndRolesRepositorys) FindUserRolesHasDetail(userID string) ([]*types.SingleRoleResponse, error) {
	// 连表查询
	query := "SELECT r.role_id, role_name,description,create_time,update_time FROM users_roles JOIN cms.roles r on r.role_id = users_roles.role_id WHERE user_id = ? AND delete_time IS NULL"
	rows, err := db.DB.Query(query, userID)

	if err != nil {
		return nil, err
	}

	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			utils.Log.Error(err)
		}
	}(rows)

	var roles = make([]*types.SingleRoleResponse, 0)
	for rows.Next() {
		role := &types.SingleRoleResponse{}
		err := rows.Scan(&role.ID, &role.RoleName, &role.Description, &role.CreateTime, &role.UpdateTime)
		if err != nil {
			continue
		}
		roles = append(roles, role)
	}
	return roles, nil
}

func (u *usersAndRolesRepositorys) FindUserRolesID(userID string) []string {
	query := "SELECT role_id FROM users_roles WHERE user_id = ?"
	rows, err := db.DB.Query(query, userID)
	if err != nil {
		utils.Log.Error(err)
		return nil
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			utils.Log.Error(err)
		}
	}(rows)

	var roleIDs []string
	for rows.Next() {
		var roleID string
		err := rows.Scan(&roleID)
		if err != nil {
			continue
		}
		roleIDs = append(roleIDs, roleID)
	}
	return roleIDs
}

func (u *usersAndRolesRepositorys) CreateOneRecord(params *types.CreateOneRecord) error {
	query := "INSERT INTO users_roles (user_id, role_id) VALUES (?, ?)"
	if _, err := db.DB.Exec(query, params.UserID, params.RoleID); err != nil {
		return err
	}
	return nil
}

func (u *usersAndRolesRepositorys) DeleteOneRecord(params *types.DeleteOneRecord) error {
	query := "DELETE FROM users_roles WHERE user_id = ? AND role_id = ?"
	if _, err := db.DB.Exec(query, params.UserID, params.RoleID); err != nil {
		return err
	}
	return nil
}
