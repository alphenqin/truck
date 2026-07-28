package operationLogControllerModules

import (
	"errors"
	"time"

	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/infra/db"
)

var OperationLogService = &operationLogService{}

type operationLogService struct{}

// GetOperationLogs 查询操作日志
func (s *operationLogService) GetOperationLogs(params *types.QueryOperationLogsParams) ([]types.OperationLog, int, error) {
	query := db.GormDB.Table("operation_logs")

	if params.Account != "" {
		query = query.Where("account LIKE ?", "%"+params.Account+"%")
	}
	if params.Method != "" {
		query = query.Where("method = ?", params.Method)
	}
	if params.Path != "" {
		query = query.Where("path LIKE ?", "%"+params.Path+"%")
	}
	if params.StartTime != "" && params.EndTime != "" {
		startTime, errStart := time.ParseInLocation("2006-01-02 15:04:05", params.StartTime, time.Local)
		endTime, errEnd := time.ParseInLocation("2006-01-02 15:04:05", params.EndTime, time.Local)
		if errStart != nil || errEnd != nil {
			return nil, 0, errors.New("时间格式应为 YYYY-MM-DD HH:mm:ss")
		}
		query = query.Where("created_at BETWEEN ? AND ?", startTime, endTime)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	var logs []types.OperationLog
	if err := query.
		Order("created_at DESC").
		Offset(params.Offset).
		Limit(params.Limit).
		Scan(&logs).Error; err != nil {
		return nil, 0, err
	}

	return logs, int(total), nil
}
