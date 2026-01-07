package buildTree

import (
	"github.com/Xi-Yuer/cms/domain/types"
	"sort"
)

// BuildMenu 构建菜单树
func BuildMenu(pages []*types.SinglePageResponse) []*types.SinglePageResponse {
	// 构建完整的树形结构（先建索引，再挂载子节点，避免因顺序导致子节点丢失）
	pageMap := make(map[string]*types.SinglePageResponse, len(pages))
	for _, page := range pages {
		page.Children = nil
		pageMap[page.PageID] = page
	}
	for _, page := range pages {
		if page.ParentPage == nil {
			continue
		}
		parent := pageMap[*page.ParentPage]
		if parent != nil {
			parent.Children = append(parent.Children, page)
		}
	}
	// 找到所有根节点
	var roots []*types.SinglePageResponse
	for _, page := range pages {
		if page.ParentPage == nil {
			roots = append(roots, page)
		}
	}
	// 按照PageOrder排序子页面
	for _, root := range roots {
		sortSubmenu(root)
	}
	// 按照PageOrder排序根节点
	sort.Slice(roots, func(i, j int) bool {
		return roots[i].PageOrder < roots[j].PageOrder
	})
	return roots
}

// sortSubmenu 对子菜单按照PageOrder排序
func sortSubmenu(page *types.SinglePageResponse) {
	sort.Slice(page.Children, func(i, j int) bool {
		return page.Children[i].PageOrder < page.Children[j].PageOrder
	})
	for _, child := range page.Children {
		sortSubmenu(child)
	}
}

// BuildDepartment 构建部门树
func BuildDepartment(departments []*types.DepartmentResponse) []*types.DepartmentResponse {
	// 构建完整的树形结构
	pageMap := make(map[string]*types.DepartmentResponse)
	for _, department := range departments {
		pageMap[department.ID] = department
	}
	var roots []*types.DepartmentResponse
	for _, department := range departments {
		if department.ParentDepartment == nil {
			roots = append(roots, department)
		} else {
			parent := pageMap[*department.ParentDepartment]
			if parent != nil {
				parent.Children = append(parent.Children, department) // 使用部门的指针
			}
		}
	}
	// 按照DepartmentOrder排序根节点
	sort.Slice(roots, func(i, j int) bool {
		return roots[i].DepartmentOrder < roots[j].DepartmentOrder
	})
	// 按照DepartmentOrder排序子部门
	for _, root := range roots {
		sortSubDepartment(root)
	}
	return roots
}

// sortSubDepartment 对子部门按照DepartmentOrder排序
func sortSubDepartment(department *types.DepartmentResponse) {
	sort.Slice(department.Children, func(i, j int) bool {
		return department.Children[i].DepartmentOrder < department.Children[j].DepartmentOrder
	})
	for _, child := range department.Children {
		sortSubDepartment(child)
	}
}
