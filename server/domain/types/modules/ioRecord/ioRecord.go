package ioRecordResponsiesModules

import "time"

type IoRecord struct {
	ID         int64      `gorm:"primaryKey;autoIncrement" json:"id"`
	TagCode    string     `json:"tagCode"`
	AssetId    int64      `json:"assetId"`
	ActionType int        `json:"actionType"`
	ActionTime *time.Time `json:"actionTime"`
	StoreTo    int64      `json:"storeTo"`
	StoreFrom  int64      `json:"storeFrom"`
}
type QueryIoRecordsParams struct {
	AssetCode  string `json:"assetCode"`
	ActionType int    `json:"actionType"`
	Limit      int    `json:"limit"`
	Offset     int    `json:"offset"`
}
type IoRecordVO struct {
	AssetId    int64      `json:"assetId"`
	AssetCode  string     `json:"assetCode"`
	TagCode    string     `json:"tagCode"`
	ActionType int        `json:"actionType"`
	ActionTime *time.Time `json:"actionTime"`
	StoreTo    int64      `json:"storeTo"`
	StoreFrom  int64      `json:"storeFrom"`
}

// Buzzer 蜂鸣器
type Buzzer struct {
	BuzzerId   int64  `gorm:"primaryKey;autoIncrement" json:"buzzerId"`
	BuzzerRule string `json:"buzzerRule"`
}
type QueryBuzzersParams struct {
	BuzzerId   int64  `json:"buzzerId"`
	BuzzerRule string `json:"buzzerRule"`
	Limit      int    `json:"limit"`
	Offset     int    `json:"offset"`
}

type QueryFlowParams struct {
	AssetCode string `json:"assetCode"`
	StartTime string `json:"startTime"` // e.g. "2025-06-01 00:00:00"
	EndTime   string `json:"endTime"`

	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}

type FlowVO struct {
	AssetId    int64      `json:"assetId"`
	AssetCode  string     `json:"assetCode"`
	ActionType int        `json:"actionType"` // 1: 入库，2: 出库
	ActionTime *time.Time `json:"actionTime"`
	StoreTo    int64      `json:"storeTo"`
	StoreFrom  int64      `json:"storeFrom"`
}
