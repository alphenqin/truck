package rolesAndPagesRepositoryModules

import (
	"database/sql"
	"fmt"
	"strings"
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/support/utils"
)

var RolesAndPagesRepository = &rolesAndPagesRepository{}

type rolesAndPagesRepository struct {
}

func (r *rolesAndPagesRepository) CreateRecord(params *types.CreateRolePermissionRecordParams) error {
	if len(params.PageID) == 0 {
		return fmt.Errorf("pageID列表不能为空")
	}

	// 创建角色页面权限之前需要先将之前的记录全部删除，并且要保证事务的一致性
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

	// 使用事务执行删除操作
	_, err = tx.Exec("DELETE FROM roles_pages WHERE role_id = ?", params.RoleID)
	if err != nil {
		utils.Log.Error("删除角色页面权限失败", "error", err, "roleID", params.RoleID)
		return err
	}

	// 使用参数化批量插入防止SQL注入
	query := "INSERT INTO roles_pages (role_id, page_id) VALUES "
	placeholders := make([]string, len(params.PageID))
	args := make([]interface{}, len(params.PageID)*2)

	for i, pageID := range params.PageID {
		placeholders[i] = "(?, ?)"
		args[i*2] = params.RoleID
		args[i*2+1] = pageID
	}
	query += strings.Join(placeholders, ",")

	_, err = tx.Exec(query, args...)
	if err != nil {
		utils.Log.Error("批量插入角色页面权限失败", "error", err, "roleID", params.RoleID, "pageIDs", params.PageID)
		return err
	}

	// 提交事务
	if err = tx.Commit(); err != nil {
		utils.Log.Error("提交事务失败", "error", err, "roleID", params.RoleID)
		return err
	}

	return nil
}

func (r *rolesAndPagesRepository) GetRecordsByRoleID(roleID string) ([]string, error) {
	rows, err := db.DB.Query("SELECT page_id FROM roles_pages WHERE role_id = ?", roleID)
	if err != nil {
		return nil, err
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			utils.Log.Error(err)
		}
	}(rows)

	var pageIDs []string

	for rows.Next() {
		var pageID string
		err := rows.Scan(&pageID)
		if err != nil {
			return nil, err
		}
		pageIDs = append(pageIDs, pageID)
	}

	return pageIDs, nil
}
