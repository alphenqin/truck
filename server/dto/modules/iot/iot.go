package iotResponsiesModules

import "time"

type Gateway struct {
	Id          string `gorm:"primaryKey;autoIncrement" json:"id"`
	GatewayName string `json:"gatewayName"`
	GatewayCode string `json:"gatewayCode"`
	GatewayType string `json:"gatewayType"`
	Status      *int   `json:"status"`
}

type QueryGatewaysParams struct {
	GatewayName string `json:"gatewayName"`
	GatewayCode string `json:"gatewayCode"`
	GatewayType string `json:"gatewayType"`
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
