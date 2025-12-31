package analysisControllersModules

import (
	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/support/utils"
	"github.com/gin-gonic/gin"
)

var AnalysisController = &analysisController{}

type analysisController struct{}

func (c analysisController) Asset(ctx *gin.Context) {
	type AssetCountParams struct {
		StartTime string `json:"startTime"`
		EndTime   string `json:"endTime"`
	}
	type AssetCountVO struct {
		Type  string `json:"type"`
		Count int    `json:"count"`
	}

	var params AssetCountParams
	if err := ctx.ShouldBindJSON(&params); err != nil {
		utils.Log.Warn("资产分析参数绑定失败", "error", err)
		utils.Response.ParameterTypeError(ctx, "参数格式错误")
		return
	}
	var count1, count2 int64
	// asset.asset_type: 0=牵引车, 1=工装车
	db.GormDB.Table("asset").Where("asset_type = ? AND created_at BETWEEN ? AND ?", 1, params.StartTime, params.EndTime).Count(&count1)
	db.GormDB.Table("asset").Where("asset_type = ? AND created_at BETWEEN ? AND ?", 0, params.StartTime, params.EndTime).Count(&count2)
	utils.Response.Success(ctx, gin.H{"list": []AssetCountVO{
		{Type: "工装车", Count: int(count1)},
		{Type: "牵引车", Count: int(count2)},
	}})
}
