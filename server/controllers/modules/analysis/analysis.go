package analysisControllersModules

import (
	"github.com/Xi-Yuer/cms/db"
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
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	var count1, count2 int64
	db.GormDB.Table("assets").Where("type = ? AND created_at BETWEEN ? AND ?", "工装车", params.StartTime, params.EndTime).Count(&count1)
	db.GormDB.Table("assets").Where("type = ? AND created_at BETWEEN ? AND ?", "牵引车", params.StartTime, params.EndTime).Count(&count2)
	ctx.JSON(200, gin.H{"list": []AssetCountVO{
		{Type: "工装车", Count: int(count1)},
		{Type: "牵引车", Count: int(count2)},
	}})
}
