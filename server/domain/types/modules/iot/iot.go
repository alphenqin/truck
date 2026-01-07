package iotResponsiesModules

import "time"

type Gateway struct {
	Id          string `gorm:"primaryKey;autoIncrement" json:"id"`
	GatewayName string `json:"gatewayName"`
	GatewayCode string `json:"gatewayCode"`
	GatewayType int    `json:"gatewayType"`
	IpAddress   string `json:"ipAddress"`
	Port        int    `json:"port"`
	Status      *int   `json:"status"`
}

type QueryGatewaysParams struct {
	GatewayName string `json:"gatewayName"`
	GatewayCode string `json:"gatewayCode"`
	GatewayType int    `json:"gatewayType"`
	Status      int    `json:"status"`
	Limit       int    `json:"limit"`
	Offset      int    `json:"offset"`
}

type RfidTag struct {
	Id          string     `gorm:"primaryKey;autoIncrement" json:"id"`
	TagCode     string     `json:"tagCode"`
	Status      *int       `json:"status"`
	Heartbeat   *string    `json:"heartbeat"`
	ReportTime  *time.Time `json:"reportTime"`
	Electricity string     `json:"electricity"`
}
type RfidTagDTO struct {
	Id          string  `gorm:"primaryKey;autoIncrement" json:"id"`
	TagCode     string  `json:"tagCode"`
	Status      *int    `json:"status"`
	Heartbeat   *string `json:"heartbeat"`
	ReportTime  *string `json:"reportTime"`
	Electricity string  `json:"electricity"`
}

type QueryRfidTagsParams struct {
	TagCode     string     `json:"tagCode"`
	Status      *int       `json:"status"`
	Heartbeat   *string    `json:"heartbeat"`
	ReportTime  *time.Time `json:"reportTime"`
	Electricity string     `json:"electricity"`

	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}

// InventoryDetail 盘点详情
type InventoryDetail struct {
	ID                  int64      `gorm:"primaryKey;autoIncrement" json:"id"`
	TagCode             string     `json:"tagCode"`
	AssetId             int64      `json:"assetId"`
	StoreId             int64      `json:"storeId"`
	GatewayId           int64      `json:"gatewayId"`
	InventoryTime       time.Time  `json:"inventoryTime"`
	Rssi                int        `json:"rssi"`
	AntennaNum          int        `json:"antennaNum"`
	BatteryLevel        string     `json:"batteryLevel"`
	PcValue             string     `json:"pcValue"`
	AdditionalCategory  int        `json:"additionalCategory"`
	InventoryStatus     int        `json:"inventoryStatus"`
	Remark              string     `json:"remark"`
	CreatedAt           time.Time  `json:"createdAt"`
	AssetCode           string     `json:"assetCode"` // 关联的资产编码
}

// QueryInventoryDetailParams 盘点详情查询参数
type QueryInventoryDetailParams struct {
	AssetCode  string `json:"assetCode"`
	Limit      int    `json:"limit"`
	Offset     int    `json:"offset"`
}

// InventoryRecord 盘点记录
type InventoryRecord struct {
	ID                  int64      `gorm:"primaryKey;autoIncrement" json:"id"`
	TagCode             string     `json:"tagCode"`
	AssetId             int64      `json:"assetId"`
	StoreId             int64      `json:"storeId"`
	GatewayId           int64      `json:"gatewayId"`
	InventoryTime       time.Time  `json:"inventoryTime"`
	Rssi                int        `json:"rssi"`
	AntennaNum          int        `json:"antennaNum"`
	BatteryLevel        string     `json:"batteryLevel"`
	PcValue             string     `json:"pcValue"`
	AdditionalCategory  int        `json:"additionalCategory"`
	InventoryStatus     int        `json:"inventoryStatus"`
	Remark              string     `json:"remark"`
	CreatedAt           time.Time  `json:"createdAt"`
}

// QueryInventoryRecordsParams 盘点记录查询参数
type QueryInventoryRecordsParams struct {
	TagCode        string    `json:"tagCode"`
	AssetId        int64     `json:"assetId"`
	StoreId        int64     `json:"storeId"`
	GatewayId      int64     `json:"gatewayId"`
	StartTime      string    `json:"startTime"`
	EndTime        string    `json:"endTime"`
	InventoryStatus int      `json:"inventoryStatus"`
	Limit          int       `json:"limit"`
	Offset         int       `json:"offset"`
}
