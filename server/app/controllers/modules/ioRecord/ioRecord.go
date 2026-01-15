package ioRecordControllersModules

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/support/utils"
	"github.com/gin-gonic/gin"
)

var IoRecordController = &ioRecordController{}

type ioRecordController struct{}

func (c *ioRecordController) GetIoRecords(ctx *gin.Context) {
	var params types.QueryIoRecordsParams
	if err := ctx.ShouldBind(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}

	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)
	if params.Limit == 0 {
		utils.Response.ParameterTypeError(ctx, "limit 参数必须在 1 到 100 之间")
		return
	}

	// 构建查询
	query := db.GormDB.Table("io_records AS r").
		Select(`
			r.asset_id, r.tag_code, r.action_type, r.action_time, r.store_to, r.store_from,
			a.asset_code, a.asset_type
		`).
		Joins("LEFT JOIN asset AS a ON r.asset_id = a.asset_id")

	// 添加查询条件
	if params.AssetCode != "" {
		query = query.Where("a.asset_code = ?", params.AssetCode)
	}
	if params.ActionType > 0 {
		query = query.Where("r.action_type = ?", params.ActionType)
	}

	// 获取总数
	var total int64
	if err := query.Count(&total).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	// 分页查询
	var ioRecords []types.IoRecordVO
	if err := query.
		Order("r.action_time DESC").
		Offset(params.Offset).
		Limit(params.Limit).
		Scan(&ioRecords).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	// 组装响应
	res := types.HasTotalResponseData{
		List:  ioRecords,
		Total: int(total),
	}
	utils.Response.Success(ctx, res)
}

func (c *ioRecordController) AddBuzzer(context *gin.Context) {
	var buzzer types.Buzzer
	if err := context.ShouldBindJSON(&buzzer); err != nil {
		utils.Log.Warn("请求参数绑定失败", "error", err)
utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	if err := db.GormDB.
		Table("buzzers").
		Create(&buzzer).
		Error; err != nil {
		utils.Log.Error("新增buzzer失败", "error", err)
utils.Response.ServerError(context, "新增失败，请稍后重试")
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c *ioRecordController) DelBuzzers(context *gin.Context) {
	var ids []int64
	err := context.ShouldBind(&ids)
	if err != nil {
		utils.Log.Warn("参数绑定失败", "error", err)
utils.Response.ParameterTypeError(context, "参数格式错误")
		return
	}
	// 服务层
	err = db.GormDB.Table("buzzers").Delete(&types.Buzzer{}, ids).Error
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c *ioRecordController) UpdateBuzzer(ctx *gin.Context) {
	var buzzer types.Buzzer
	if err := ctx.ShouldBindJSON(&buzzer); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}

	// 校验 buzzer 是否存在
	var count int64
	if err := db.GormDB.
		Table("buzzers").
		Where("buzzer_id = ?", buzzer.BuzzerId).
		Count(&count).Error; err != nil || count == 0 {
		utils.Response.ServerError(ctx, "buzzer 不存在或查询出错")
		return
	}

	if err := db.GormDB.
		Table("buzzers").
		Where("buzzer_id = ?", buzzer.BuzzerId).
		Updates(&buzzer).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	utils.Response.SuccessNoData(ctx)
}

func (c *ioRecordController) GetBuzzer(ctx *gin.Context) {
	var params types.QueryBuzzersParams
	if err := ctx.ShouldBind(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}
	params.Limit, params.Offset = utils.Pagination.ValidatePagination(params.Limit, params.Offset)
	// 保留原始的错误消息
	if params.Limit == 0 {
		utils.Response.ParameterTypeError(ctx, "limit参数不正确")
		return
	}

	// 构建查询
	query := db.GormDB.Table("buzzers")

	// 如果有 buzzer_rule 参数，添加查询条件
	if params.BuzzerRule != "" {
		query = query.Where("buzzer_rule LIKE ?", "%"+params.BuzzerRule+"%")
	}

	// 获取总数
	var total int64
	if err := query.Count(&total).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	// 查询数据
	var buzzers []types.Buzzer
	err := query.
		Offset(params.Offset).
		Limit(params.Limit).
		Scan(&buzzers).Error
	if err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	utils.Response.Success(ctx, types.HasTotalResponseData{
		List:  buzzers,
		Total: int(total),
	})
}

func (c *ioRecordController) GetPanel(ctx *gin.Context) {
	// 当前时间精确到分钟
	now := time.Now().Truncate(time.Minute)
	start := now.Add(-24 * time.Hour)
	// 查询 24 小时内的记录
	var records []types.IoRecord
	if err := db.GormDB.
		Table("io_records").
		Select("action_type, action_time").
		Where("action_time BETWEEN ? AND ?", start, now).
		Find(&records).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	// 初始化24个小时区间
	type Interval struct {
		StartTime     string `json:"startTime"`
		EndTime       string `json:"endTime"`
		InboundCount  int    `json:"inboundCount"`
		OutboundCount int    `json:"outboundCount"`
	}
	intervals := make([]Interval, 24)
	for i := 0; i < 24; i++ {
		from := start.Add(time.Duration(i) * time.Hour)
		to := from.Add(time.Hour)
		intervals[i] = Interval{
			StartTime: from.Format("2006-01-02 15:04"),
			EndTime:   to.Format("2006-01-02 15:04"),
		}
	}

	// 分类统计
	for _, r := range records {
		idx := int(r.ActionTime.Sub(start).Hours())
		if idx >= 0 && idx < 24 {
			if r.ActionType == 1 {
				intervals[idx].InboundCount++
			} else if r.ActionType == 2 {
				intervals[idx].OutboundCount++
			}
		}
	}

	// 返回响应
	response := gin.H{
		"startTime": start.Format("2006-01-02 15:04"),
		"endTime":   now.Format("2006-01-02 15:04"),
		"intervals": intervals,
	}
	utils.Response.Success(ctx, response)
}

func (c *ioRecordController) GetPanelV2(ctx *gin.Context) {
	now := time.Now().Truncate(time.Minute)
	oneHourAgo := now.Add(-1 * time.Hour)
	twentyFourHoursAgo := now.Add(-24 * time.Hour)

	// 最近1小时统计
	var lastHourInbound, lastHourOutbound int64
	db.GormDB.Table("io_records").
		Where("action_time >= ? AND action_time <= ? AND action_type = 1", oneHourAgo, now).
		Count(&lastHourInbound)
	db.GormDB.Table("io_records").
		Where("action_time >= ? AND action_time <= ? AND action_type = 2", oneHourAgo, now).
		Count(&lastHourOutbound)

	// 最近24小时每小时统计，intervals为map，key为小时字符串
	type Interval struct {
		Inbound  int `json:"inbound"`
		Outbound int `json:"outbound"`
	}
	intervals := make(map[string]Interval)

	// 使用单次查询替代循环查询
	type HourlyCount struct {
		HourStart  string `json:"hour_start"`
		ActionType int    `json:"action_type"`
		Count      int    `json:"count"`
	}

	var hourlyCounts []HourlyCount
	db.GormDB.Raw(`
		SELECT
			DATE_FORMAT(action_time, '%H') as hour_start,
			action_type,
			COUNT(*) as count
		FROM io_records
		WHERE action_time >= ? AND action_time < ? AND action_type IN (1, 2)
		GROUP BY DATE_FORMAT(action_time, '%H'), action_type
		ORDER BY hour_start
	`, twentyFourHoursAgo, now).Scan(&hourlyCounts)

	// 初始化所有小时的数据
	for i := 0; i < 24; i++ {
		hourKey := fmt.Sprintf("%02d", i)
		intervals[hourKey] = Interval{
			Inbound:  0,
			Outbound: 0,
		}
	}

	// 填充查询结果
	for _, hc := range hourlyCounts {
		if interval, exists := intervals[hc.HourStart]; exists {
			if hc.ActionType == 1 {
				interval.Inbound = hc.Count
			} else if hc.ActionType == 2 {
				interval.Outbound = hc.Count
			}
			intervals[hc.HourStart] = interval
		}
	}

	response := gin.H{
		"lastHour": gin.H{
			"inbound":  lastHourInbound,
			"outbound": lastHourOutbound,
		},
		"intervals": intervals,
	}
	utils.Response.Success(ctx, response)
}

func (c *ioRecordController) GetFlowStats(ctx *gin.Context) {
	type FlowStatsItem struct {
		ActionType int   `json:"actionType"`
		Count      int64 `json:"count"`
	}

	hours := int64(24)
	if hoursStr := strings.TrimSpace(ctx.Query("hours")); hoursStr != "" {
		parsed, err := strconv.ParseInt(hoursStr, 10, 64)
		if err != nil || parsed <= 0 {
			utils.Response.ParameterTypeError(ctx, "hours格式错误")
			return
		}
		hours = parsed
	}
	if hours > 168 {
		hours = 168
	}

	end := time.Now()
	start := end.Add(-time.Duration(hours) * time.Hour)

	type row struct {
		ActionType int   `gorm:"column:action_type"`
		Count      int64 `gorm:"column:count"`
	}
	var rows []row
	if err := db.GormDB.
		Table("io_records").
		Select("action_type, COUNT(*) AS count").
		Where("action_time >= ? AND action_time <= ? AND action_type IN ?", start, end, []int{1, 2}).
		Group("action_type").
		Scan(&rows).Error; err != nil {
		utils.Log.Error("查询流转统计失败", "error", err)
		utils.Response.ServerError(ctx, "查询失败，请稍后重试")
		return
	}

	countMap := map[int]int64{1: 0, 2: 0}
	for _, r := range rows {
		countMap[r.ActionType] = r.Count
	}

	list := []FlowStatsItem{
		{ActionType: 1, Count: countMap[1]},
		{ActionType: 2, Count: countMap[2]},
	}

	utils.Response.Success(ctx, gin.H{
		"startTime": start.Format("2006-01-02 15:04:05"),
		"endTime":   end.Format("2006-01-02 15:04:05"),
		"list":      list,
	})
}

func (c *ioRecordController) GetAssetStay(ctx *gin.Context) {
	type StayItem struct {
		Asset    string  `json:"asset"`
		Location string  `json:"location"`
		Type     string  `json:"type"`
		Start    float64 `json:"startTime"`
		End      float64 `json:"endTime"`
	}

	hours := int64(24)
	if hoursStr := strings.TrimSpace(ctx.Query("hours")); hoursStr != "" {
		parsed, err := strconv.ParseInt(hoursStr, 10, 64)
		if err != nil || parsed <= 0 {
			utils.Response.ParameterTypeError(ctx, "hours格式错误")
			return
		}
		hours = parsed
	}
	if hours > 168 {
		hours = 168
	}

	limit := int64(200)
	if limitStr := strings.TrimSpace(ctx.Query("limit")); limitStr != "" {
		parsed, err := strconv.ParseInt(limitStr, 10, 64)
		if err != nil || parsed <= 0 {
			utils.Response.ParameterTypeError(ctx, "limit格式错误")
			return
		}
		limit = parsed
	}
	if limit > 1000 {
		limit = 1000
	}

	assetCode := strings.TrimSpace(ctx.Query("assetCode"))

	end := time.Now()
	start := end.Add(-time.Duration(hours) * time.Hour)

	type row struct {
		AssetID    int64     `gorm:"column:asset_id"`
		AssetCode  string    `gorm:"column:asset_code"`
		AssetType  int       `gorm:"column:asset_type"`
		StartTime  time.Time `gorm:"column:start_time"`
		EndTime    time.Time `gorm:"column:end_time"`
		StoreID    int64     `gorm:"column:store_id"`
		StoreName  string    `gorm:"column:store_name"`
	}

	var rows []row
	baseSQL := `
		SELECT
			r.asset_id,
			a.asset_code,
			a.asset_type,
			r.action_time AS start_time,
			r.next_action_time AS end_time,
			COALESCE(r.store_to, r.store_from) AS store_id,
			s.store_name
		FROM (
			SELECT
				asset_id,
				action_type,
				action_time,
				store_to,
				store_from,
				LEAD(action_type) OVER (PARTITION BY asset_id ORDER BY action_time) AS next_action_type,
				LEAD(action_time) OVER (PARTITION BY asset_id ORDER BY action_time) AS next_action_time
			FROM io_records
			WHERE action_time IS NOT NULL
		) r
		LEFT JOIN asset a ON a.asset_id = r.asset_id
		LEFT JOIN stores s ON s.store_id = COALESCE(r.store_to, r.store_from)
		WHERE r.action_type = 1
		  AND r.next_action_type = 2
		  AND r.next_action_time IS NOT NULL
		  AND r.action_time < ?
		  AND r.next_action_time > ?
	`

	var err error
	if assetCode != "" {
		baseSQL += " AND a.asset_code = ? ORDER BY r.action_time DESC LIMIT ?"
		err = db.GormDB.Raw(baseSQL, end, start, assetCode, limit).Scan(&rows).Error
	} else {
		baseSQL += " ORDER BY r.action_time DESC LIMIT ?"
		err = db.GormDB.Raw(baseSQL, end, start, limit).Scan(&rows).Error
	}
	if err != nil {
		utils.Log.Error("查询资产停留分布失败", "error", err)
		utils.Response.ServerError(ctx, "查询失败，请稍后重试")
		return
	}

	items := make([]StayItem, 0, len(rows))
	for _, r := range rows {
		overlapStart := r.StartTime
		if overlapStart.Before(start) {
			overlapStart = start
		}
		overlapEnd := r.EndTime
		if overlapEnd.After(end) {
			overlapEnd = end
		}
		if !overlapEnd.After(overlapStart) {
			continue
		}
		startHour := overlapStart.Sub(start).Hours()
		endHour := overlapEnd.Sub(start).Hours()

		typeLabel := "未知"
		if r.AssetType == 1 {
			typeLabel = "工装车"
		} else if r.AssetType == 0 {
			typeLabel = "牵引车"
		}

		assetLabel := r.AssetCode
		if strings.TrimSpace(assetLabel) == "" {
			assetLabel = fmt.Sprintf("资产-%d", r.AssetID)
		}
		assetLabel = fmt.Sprintf("%s-%s", typeLabel, assetLabel)

		location := r.StoreName
		if strings.TrimSpace(location) == "" {
			if r.StoreID > 0 {
				location = fmt.Sprintf("场库-%d", r.StoreID)
			} else {
				location = "未知"
			}
		}

		items = append(items, StayItem{
			Asset:    assetLabel,
			Location: location,
			Type:     typeLabel,
			Start:    startHour,
			End:      endHour,
		})
	}

	utils.Response.Success(ctx, gin.H{
		"startTime": start.Format("2006-01-02 15:04:05"),
		"endTime":   end.Format("2006-01-02 15:04:05"),
		"list":      items,
	})
}

func (c *ioRecordController) GetFlows(ctx *gin.Context) {

	var params types.QueryFlowParams
	if err := ctx.ShouldBindJSON(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}

	// 时间格式校验并解析
	startTime, errStart := time.Parse("2006-01-02 15:04:05", params.StartTime)
	endTime, errEnd := time.Parse("2006-01-02 15:04:05", params.EndTime)
	if errStart != nil || errEnd != nil {
		utils.Response.ParameterTypeError(ctx, "时间格式应为 YYYY-MM-DD HH:mm:ss")
		return
	}

	// 构建查询
	query := db.GormDB.Table("io_records AS r").
		Select(`
			r.asset_id, a.asset_code, a.asset_type, r.action_type, r.action_time, r.store_to, r.store_from
		`).
		Joins("LEFT JOIN asset AS a ON r.asset_id = a.asset_id").
		Where("r.action_time BETWEEN ? AND ?", startTime, endTime)

	if params.AssetCode != "" {
		query = query.Where("a.asset_code = ?", params.AssetCode)
	}

	// 获取总数
	var total int64
	if err := query.Count(&total).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	// 查询记录（分页）
	var flowVOs []types.FlowVO
	if err := query.
		Order("r.action_time DESC").
		Limit(params.Limit).
		Offset(params.Offset).
		Scan(&flowVOs).Error; err != nil {
		utils.Log.Error("操作失败", "error", err)
utils.Response.ServerError(ctx, "操作失败，请稍后重试")
		return
	}

	// 返回结果
	res := types.HasTotalResponseData{
		List:  flowVOs,
		Total: int(total),
	}
	utils.Response.Success(ctx, res)
}
