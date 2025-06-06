package ioRecordControllersModules

import (
	"github.com/Xi-Yuer/cms/db"
	"github.com/Xi-Yuer/cms/dto"
	commonResponsiesModules "github.com/Xi-Yuer/cms/dto/modules/common"
	"github.com/Xi-Yuer/cms/utils"
	"github.com/gin-gonic/gin"
	"time"
)

var IoRecordController = &ioRecordController{}

type ioRecordController struct{}

func (c *ioRecordController) GetIoRecords(ctx *gin.Context) {
	var params dto.QueryParams
	if err := ctx.ShouldBind(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}

	if params.Limit < 0 || params.Limit > 100 {
		utils.Response.ParameterTypeError(ctx, "limit 参数必须在 1 到 100 之间")
		return
	}

	// 查询总条数（用于分页）
	var total int64
	if err := db.GormDB.
		Table("io_records").
		Count(&total).Error; err != nil {
		utils.Response.ServerError(ctx, err.Error())
		return
	}

	// 分页查询
	var IoRecords []dto.IoRecord
	if err := db.GormDB.
		Table("io_records").
		Offset(params.Offset).
		Limit(params.Limit).
		Scan(&IoRecords).Error; err != nil {
		utils.Response.ServerError(ctx, err.Error())
		return
	}

	// 组装响应
	res := &commonResponsiesModules.HasTotalResponseData{
		List:  IoRecords,
		Total: int(total),
	}
	utils.Response.Success(ctx, res)
}

func (c *ioRecordController) AddBuzzer(context *gin.Context) {
	var buzzer dto.Buzzer
	if err := context.ShouldBindJSON(&buzzer); err != nil {
		utils.Response.ParameterTypeError(context, "请求参数绑定失败: "+err.Error())
		return
	}
	if err := db.GormDB.
		Table("buzzers").
		Create(&buzzer).
		Error; err != nil {
		utils.Response.ServerError(context, "新增 buzzer 失败: "+err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c *ioRecordController) DelBuzzers(context *gin.Context) {
	var ids []int64
	err := context.ShouldBind(&ids)
	if err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	// 服务层
	err = db.GormDB.Table("buzzers").Delete(&dto.Buzzer{}, ids).Error
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.SuccessNoData(context)
}

func (c *ioRecordController) UpdateBuzzer(ctx *gin.Context) {
	var buzzer dto.Buzzer
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
		utils.Response.ServerError(ctx, err.Error())
		return
	}

	utils.Response.SuccessNoData(ctx)
}

func (c *ioRecordController) GetBuzzer(ctx *gin.Context) {
	var params dto.QueryParams
	if err := ctx.ShouldBind(&params); err != nil {
		utils.Response.ParameterTypeError(ctx, err.Error())
		return
	}
	if params.Limit > 100 || params.Limit < 0 {
		utils.Response.ParameterTypeError(ctx, "limit参数不正确")
		return
	}

	var buzzers []dto.Buzzer
	err := db.GormDB.
		Table("buzzers").
		Offset(params.Offset).
		Limit(params.Limit).
		Scan(&buzzers).Error
	if err != nil {
		utils.Response.ServerError(ctx, err.Error())
		return
	}

	var total int64
	if err := db.GormDB.
		Table("buzzers").
		Count(&total).Error; err != nil {
		utils.Response.ServerError(ctx, err.Error())
		return
	}

	utils.Response.Success(ctx, &commonResponsiesModules.HasTotalResponseData{
		List:  buzzers,
		Total: int(total),
	})
}

func (c *ioRecordController) GetPanel(ctx *gin.Context) {
	// 当前时间精确到分钟
	now := time.Now().Truncate(time.Minute)
	start := now.Add(-24 * time.Hour)
	// 查询 24 小时内的记录
	var records []dto.IoRecord
	if err := db.GormDB.
		Table("io_records").
		Select("action_type, action_time").
		Where("action_time BETWEEN ? AND ?", start, now).
		Find(&records).Error; err != nil {
		utils.Response.ServerError(ctx, err.Error())
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

func (c *ioRecordController) GetFlows(ctx *gin.Context) {

	var params dto.QueryFlowParams
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
		utils.Response.ServerError(ctx, err.Error())
		return
	}

	// 查询记录（分页）
	var flowVOs []dto.FlowVO
	if err := query.
		Order("r.action_time DESC").
		Limit(params.Limit).
		Offset(params.Offset).
		Scan(&flowVOs).Error; err != nil {
		utils.Response.ServerError(ctx, err.Error())
		return
	}

	// 返回结果
	res := dto.HasTotalResponseData{
		List:  flowVOs,
		Total: int(total),
	}
	utils.Response.Success(ctx, res)
}
