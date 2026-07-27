package db

import "gorm.io/gorm"

const (
	basePageID      = "189639335119687680"
	groupInfoPageID = "base_group_info_20260727"
)

// ensureGroupInfoMenu 为现有数据库幂等补齐班组信息菜单，并授权给已经拥有基础设置菜单的角色。
func ensureGroupInfoMenu(database *gorm.DB) error {
	return database.Transaction(func(tx *gorm.DB) error {
		if err := tx.Exec(`
			INSERT INTO pages (
				page_id, parent_page, page_name, page_path, page_icon, page_component,
				page_order, can_edit, is_out_site, out_site_link, create_time, update_time, delete_time
			) VALUES (?, ?, '班组信息', '/base/group', 'TeamOutlined', 'baseGroup', 6, 1, 0, NULL, NOW(), NOW(), NULL)
			ON DUPLICATE KEY UPDATE
				parent_page = VALUES(parent_page), page_name = VALUES(page_name),
				page_path = VALUES(page_path), page_icon = VALUES(page_icon),
				page_component = VALUES(page_component), page_order = VALUES(page_order),
				delete_time = NULL
		`, groupInfoPageID, basePageID).Error; err != nil {
			return err
		}

		return tx.Exec(`
			INSERT INTO roles_pages (role_id, page_id)
			SELECT DISTINCT parent_role.role_id, ?
			FROM roles_pages AS parent_role
			WHERE parent_role.page_id = ?
			  AND NOT EXISTS (
				SELECT 1 FROM roles_pages AS existing
				WHERE existing.role_id = parent_role.role_id AND existing.page_id = ?
			  )
		`, groupInfoPageID, basePageID, groupInfoPageID).Error
	})
}
