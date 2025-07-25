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
}

type Monitor struct {
	MonitorId     int64      `json:"monitorId"`     // 监控记录ID
	AssetId       int64      `json:"assetId"`       // 资产ID
	GatewayId     int64      `json:"gatewayId"`     // 网关ID
	DetectionTime *time.Time `json:"detectionTime"` // 检测到资产的时间
}

type QueryTrackParams struct {
	AssetId   int64  `json:"assetId"`
	StartTime string `json:"startTime"`
	EndTime   string `json:"endTime"`

	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}

type MonitorRecordVO struct {
	MonitorId     int64  `json:"monitorId"`
	AssetId       int64  `json:"assetId"`
	GatewayId     int64  `json:"gatewayId"`
	DetectionTime string `json:"detectionTime"`
}

type QueryLostAssetParams struct {
	Hours  int64 `json:"hours"`
	Limit  int   `json:"limit"`
	Offset int   `json:"offset"`
}

type LostAssetRecordVO struct {
	AssetId    int64      `json:"assetId"`
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
