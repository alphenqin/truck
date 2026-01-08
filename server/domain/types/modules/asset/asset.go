package assetResponsiesModules

import "time"

type Asset struct {
	AssetId   int64     `gorm:"primaryKey;autoIncrement" json:"assetId"`
	AssetCode string    `json:"assetCode"`
	AssetType int       `json:"assetType"`
	Status    int       `json:"status"`
	Quantity  int64     `json:"quantity"`
	TagId     int64     `json:"tagId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
type QueryAssetParams struct {
	AssetID   int64  `json:"assetId"`
	AssetCode string `json:"assetCode"`
	AssetType int    `json:"assetType"`
	Status    int    `json:"status"`
	StoreId   int64  `json:"storeId"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`

	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}
type AssetVO struct {
	AssetID   int    `json:"assetId"`
	AssetCode string `json:"assetCode"`
	AssetType int    `json:"assetType"`
	StoreId   int64  `json:"storeId"`
	Status    int    `json:"status"`
	Quantity  int64  `json:"quantity"`
	TagId     int64  `json:"tagId"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

type UpdateAssetStatusParams struct {
	AssetId int64 `json:"assetId"`
	Status  int   `json:"status"`
	RepairReason string `json:"repairReason"`
}

type Monitor struct {
	MonitorId     int64      `json:"monitorId"`     // 监控记录ID
	AssetId       int64      `json:"assetId"`       // 资产ID
	GatewayId     int64      `json:"gatewayId"`     // 网关ID
	DetectionTime *time.Time `json:"detectionTime"` // 检测到资产的时间
}

type QueryTrackParams struct {
	AssetId   int64  `json:"assetId"`
	AssetCode string `json:"assetCode"`
	StartTime string `json:"startTime"`
	EndTime   string `json:"endTime"`

	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}

type MonitorRecordVO struct {
	MonitorId     int64  `json:"monitorId"`
	AssetId       int64  `json:"assetId"`
	AssetCode     string `json:"assetCode"`
	GatewayId     int64  `json:"gatewayId"`
	GatewayName   string `json:"gatewayName"`
	DetectionTime string `json:"detectionTime"`
}

type QueryLostAssetParams struct {
	Hours  int64 `json:"hours"`
	Limit  int   `json:"limit"`
	Offset int   `json:"offset"`
}

type LostAssetRecordVO struct {
	AssetId    int64      `json:"assetId"`
	AssetCode  string     `json:"assetCode"`
	ActionType int        `json:"actionType"`
	ActionTime *time.Time `json:"actionTime"`
	StoreFrom  int64      `json:"storeFrom"`
	StoreTo    int64      `json:"storeTo"`
}

type Group struct {
	GroupId   int64  `json:"groupId"`
	GroupName string `json:"groupName"`
}

type GroupVO struct {
	GroupId   int64  `json:"groupId"`
	GroupName string `json:"groupName"`
	StoreId   int64  `json:"storeId"`
}
type QueryGroupParams struct {
	GroupId   int64  `json:"groupId"`
	GroupName string `json:"groupName"`

	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}
type AssetGroup struct {
	AssetId int64 `gorm:"primaryKey" json:"assetId"`
	GroupId int64 `json:"groupId"`
}
type GroupStore struct {
	GroupId int64 `gorm:"primaryKey" json:"groupId"`
	StoreId int64 `json:"storeId"`
}

// QueryExceptionParams 异常记录查询参数
type QueryExceptionParams struct {
	StartTime     string `json:"startTime" form:"startTime"`         // 开始时间（可选，格式：yyyy-MM-dd HH:mm:ss）
	EndTime       string `json:"endTime" form:"endTime"`             // 结束时间（可选）
	ExceptionType *int   `json:"exceptionType" form:"exceptionType"` // 异常类型（可选）
	Status        *int   `json:"status" form:"status"`               // 处理状态（可选）
	AssetID       *int   `json:"assetId" form:"assetId"`             // 资产ID（可选）
	AssetCode     *string `json:"assetCode" form:"assetCode"`        // 资产编码（可选）

	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}

// ExceptionRecordVO 异常记录返回结构（包含资产编码）
type ExceptionRecordVO struct {
	ID            int64     `json:"id"`
	ExceptionType int       `json:"exceptionType"`
	AssetId       int       `json:"assetId"`
	AssetCode     string    `json:"assetCode"`
	DetectionTime time.Time `json:"detectionTime"`
	Status        int       `json:"status"`
	ExceptionNote string    `json:"exceptionNote"`
	Remark        string    `json:"remark"`
	CreateTime    time.Time `json:"createTime"`
	UpdateTime    time.Time `json:"updateTime"`
}

// ExceptionRecord 异常记录表 exception_records
type ExceptionRecord struct {
	ID            int64     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`        // 自增ID
	ExceptionType int       `gorm:"column:exception_type" json:"exceptionType"`          // 异常类型
	AssetID       int       `gorm:"column:asset_id" json:"assetId"`                      // 相关的资产id
	DetectionTime time.Time `gorm:"column:detection_time" json:"detectionTime"`          // 检测时间
	Status        int       `gorm:"column:status" json:"status"`                         // 处理状态
	ExceptionNote string    `gorm:"column:exception_note" json:"exceptionNote"`          // 异常内容
	Remark        string    `gorm:"column:remark" json:"remark"`                         // 备注
	CreateTime    time.Time `gorm:"column:create_time;autoCreateTime" json:"createTime"` // 创建时间
	UpdateTime    time.Time `gorm:"column:update_time;autoUpdateTime" json:"updateTime"` // 更新时间
}

// AssetRepairRecord 资产报修记录表 asset_repairs
type AssetRepairRecord struct {
	ID           int64     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	AssetID      int64     `gorm:"column:asset_id" json:"assetId"`
	RepairReason string    `gorm:"column:repair_reason" json:"repairReason"`
	CreateTime   time.Time `gorm:"column:create_time;autoCreateTime" json:"createTime"`
}
