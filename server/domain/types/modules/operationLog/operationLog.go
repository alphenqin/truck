package operationLogResponsivesModules

import "time"

// OperationLog 操作日志模型
type OperationLog struct {
	ID         int64     `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	UserID     string    `gorm:"column:user_id" json:"userId"`
	Account    string    `gorm:"column:account" json:"account"`
	Method     string    `gorm:"column:method" json:"method"`
	Path       string    `gorm:"column:path" json:"path"`
	IP         string    `gorm:"column:ip" json:"ip"`
	StatusCode int       `gorm:"column:status_code" json:"statusCode"`
	CreatedAt  time.Time `gorm:"column:created_at" json:"createdAt"`
}

// QueryOperationLogsParams 查询操作日志参数
type QueryOperationLogsParams struct {
	Account   string `json:"account"`
	Method    string `json:"method"`
	Path      string `json:"path"`
	StartTime string `json:"startTime"`
	EndTime   string `json:"endTime"`
	Limit     int    `json:"limit"`
	Offset    int    `json:"offset"`
}
