package types

import (
	authResponsiesModules "github.com/Xi-Yuer/cms/domain/types/modules/auth"
	commonResponsiesModules "github.com/Xi-Yuer/cms/domain/types/modules/common"
	departmentResponsiesModules "github.com/Xi-Yuer/cms/domain/types/modules/department"
	interfaceResponsiesModules "github.com/Xi-Yuer/cms/domain/types/modules/interface"
	pagesResponsiesModules "github.com/Xi-Yuer/cms/domain/types/modules/pages"
	rolesResponsiesModules "github.com/Xi-Yuer/cms/domain/types/modules/roles"
	timeTaskResponsiesModules "github.com/Xi-Yuer/cms/domain/types/modules/timeTask"
	usersResponsiesModules "github.com/Xi-Yuer/cms/domain/types/modules/users"

	assetResponsiesModules "github.com/Xi-Yuer/cms/domain/types/modules/asset"
	baseRespModules "github.com/Xi-Yuer/cms/domain/types/modules/base"
	ioRecordRespModules "github.com/Xi-Yuer/cms/domain/types/modules/ioRecord"
	iotRespModules "github.com/Xi-Yuer/cms/domain/types/modules/iot"
	siteLibraryRespModules "github.com/Xi-Yuer/cms/domain/types/modules/siteLibrary"
)

// LoginResponse 用户登录
type LoginResponse authResponsiesModules.LoginResponse

// UsersSingleResponse 查询单个用户
type UsersSingleResponse usersResponsiesModules.SingleUserResponse

// SingleUserByRoleIDResponse 根据角色id查询单个用户
type SingleUserByRoleIDResponse usersResponsiesModules.SingleUserByRoleIDResponse

type SingleUserResponseHasPassword usersResponsiesModules.SingleUserResponseHasPassword

// CreateSingleUserRequest 创建用户
type CreateSingleUserRequest usersResponsiesModules.CreateUserParams

// UpdateSingleUserRequest 更新用户
type UpdateSingleUserRequest usersResponsiesModules.UpdateUserParams

// QueryUsersParams 查询用户
type QueryUsersParams usersResponsiesModules.QueryUsersParams

// UpdateUserRequest 更新用户
type UpdateUserRequest usersResponsiesModules.UpdateUserParams

// Page 查询参数
type Page usersResponsiesModules.Page

// LoginRequestParams 登录请求
type LoginRequestParams = authResponsiesModules.LoginRequestParams

// JWTPayload 生成JWT
type JWTPayload = usersResponsiesModules.JWTPayload

// CreateRoleParams 创建角色
type CreateRoleParams = rolesResponsiesModules.CreateRoleParams

// UpdateRoleParams 更新角色
type UpdateRoleParams = rolesResponsiesModules.UpdateRoleParams

// QueryRolesParams 查询角色
type QueryRolesParams = rolesResponsiesModules.QueryRoleListParams

// SingleRoleResponse 查询单个角色
type SingleRoleResponse = rolesResponsiesModules.SingleRoleResponse

// CreateOneRecord 角色新增用户
type CreateOneRecord = rolesResponsiesModules.CreateOneRecord

// DeleteOneRecord 角色删除用户
type DeleteOneRecord = rolesResponsiesModules.DeleteOneRecord

// AuthorizationManagementParams 给用户分配角色
type AuthorizationManagementParams = authResponsiesModules.CreateUserRoleRecordParams

// CreatePageParams 创建页面
type CreatePageParams = pagesResponsiesModules.CreatePageParams

// UpdatePageRequest 更新页面
type UpdatePageRequest = pagesResponsiesModules.UpdatePageRequest

// SinglePageResponse 查询页面
type SinglePageResponse = pagesResponsiesModules.SinglePageResponse

// CreateRolePermissionRecordParams 分配角色权限
type CreateRolePermissionRecordParams = authResponsiesModules.CreateRolePermissionRecordParams

// CreateDepartmentRequest 创建部门
type CreateDepartmentRequest = departmentResponsiesModules.CreateDepartmentRequest

// DepartmentResponse 查询部门
type DepartmentResponse = departmentResponsiesModules.DepartmentResponse

// UpdateDepartmentRequest 更新部门
type UpdateDepartmentRequest = departmentResponsiesModules.UpdateDepartmentRequest

// CreateInterfaceRequest 创建接口
type CreateInterfaceRequest = interfaceResponsiesModules.CreateInterfaceRequest

// GetInterfaceResponse 获取接口
type GetInterfaceResponse = interfaceResponsiesModules.GetInterfaceResponse

// UpdateInterfaceRequest 更新接口
type UpdateInterfaceRequest = interfaceResponsiesModules.UpdateInterfaceRequest

// ExportExcelResponse 导出Excel
type ExportExcelResponse = commonResponsiesModules.ExportExcelResponse

// StartTimeTack 开始定时任务
type StartTimeTack = timeTaskResponsiesModules.StartTimeTack

// StopTimeTack 停止定时任务
type StopTimeTack = timeTaskResponsiesModules.StopTimeTack

// DeleteTimeTack 删除定时任务
type DeleteTimeTack = timeTaskResponsiesModules.DeleteTimeTack

// CreateTimeTack 创建定时任务
type CreateTimeTack = timeTaskResponsiesModules.CreateTimeTack

// UpdateTimeTask 更新定时任务
type UpdateTimeTask = timeTaskResponsiesModules.UpdateTimeTask

// TimeTaskResponse 获取定时任务
type TimeTaskResponse = timeTaskResponsiesModules.TimeTaskResponse

type HasTotalResponseData = commonResponsiesModules.HasTotalResponseData

type AllInterfaceResponse = interfaceResponsiesModules.AllInterfaceResponse

type QueryParams struct {
	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}

// Asset model
type Asset = assetResponsiesModules.Asset
type Monitor = assetResponsiesModules.Monitor
type QueryTrackParams = assetResponsiesModules.QueryTrackParams
type MonitorRecordVO = assetResponsiesModules.MonitorRecordVO

// QueryAssetParams 查询资产参数
type QueryAssetParams = assetResponsiesModules.QueryAssetParams

type AssetVO = assetResponsiesModules.AssetVO
type UpdateAssetStatusParams = assetResponsiesModules.UpdateAssetStatusParams
type QueryLostAssetParams = assetResponsiesModules.QueryLostAssetParams
type LostAssetRecordVO = assetResponsiesModules.LostAssetRecordVO
type Group = assetResponsiesModules.Group
type GroupVO = assetResponsiesModules.GroupVO
type QueryGroupParams = assetResponsiesModules.QueryGroupParams
type AssetGroup = assetResponsiesModules.AssetGroup
type GroupStore = assetResponsiesModules.GroupStore

// 异常流转

type QueryExceptionParams = assetResponsiesModules.QueryExceptionParams
type ExceptionRecord = assetResponsiesModules.ExceptionRecord

type Garden = siteLibraryRespModules.Gardens
type GardenVO = siteLibraryRespModules.GardenVO
type Store = siteLibraryRespModules.Store
type StoreMapVO = siteLibraryRespModules.StoreMapVO
type QueryGardenParams = siteLibraryRespModules.QueryGardenParams
type StoreDTO = siteLibraryRespModules.StoreDTO
type QueryStoreParams = siteLibraryRespModules.QueryStoreParams
type StoreVO = siteLibraryRespModules.StoreVO

type IoRecord = ioRecordRespModules.IoRecord
type QueryIoRecordsParams = ioRecordRespModules.QueryIoRecordsParams
type IoRecordVO = ioRecordRespModules.IoRecordVO
type Buzzer = ioRecordRespModules.Buzzer
type QueryBuzzersParams = ioRecordRespModules.QueryBuzzersParams
type QueryFlowParams = ioRecordRespModules.QueryFlowParams
type FlowVO = ioRecordRespModules.FlowVO

// base

type Department = baseRespModules.Department
type AssetType = baseRespModules.AssetType
type QueryAssetTypesParams = baseRespModules.QueryAssetTypesParams
type QueryDepartmentsParams = baseRespModules.QueryDepartmentsParams
type Line = baseRespModules.Line
type QueryLinesParams = baseRespModules.QueryLinesParams
type Arg = baseRespModules.Arg
type QueryArgsParams = baseRespModules.QueryArgsParams
type AlarmRule = baseRespModules.AlarmRule
type QueryAlarmRulesParams = baseRespModules.QueryAlarmRulesParams

type Gateway = iotRespModules.Gateway
type QueryGatewaysParams = iotRespModules.QueryGatewaysParams

type RfidTag = iotRespModules.RfidTag
type RfidTagDTO = iotRespModules.RfidTagDTO
type QueryRfidTagsParams = iotRespModules.QueryRfidTagsParams
type InventoryRecord = iotRespModules.InventoryRecord
