package templateControllerModules

import (
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/support/utils"
	"github.com/gin-gonic/gin"
)

var TemplateController = &templateController{}

type templateController struct{}

// CreateTemplate 创建模板
// @Summary 创建模板
// @Description 创建模板
// @Tags 代码生成器
// @Accept json
// @Produce json
// @Success 200 {string} json "{"code":200,"data":{},"msg":"ok"}"
// @Router /template [post]
func (t *templateController) CreateTemplate(context *gin.Context) {
	var params types.CreateTemplateRequestParams
	if err := context.ShouldBind(&params); err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	parseTemplate, err := TemplateService.CreateTemplate(&params)
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	utils.Response.Success(context, parseTemplate)
}

// DownloadTemplateZip 下载模板
// @Summary 下载模板
// @Description 下载模板
// @Tags 代码生成器
// @Accept json
// @Produce json
// @Success 200 {string} json "{"code":200,"data":{},"msg":"ok"}"
// @Router /template/download [post]
func (t *templateController) DownloadTemplateZip(context *gin.Context) {
	var params types.DownloadTemplateRequestParams
	if err := context.ShouldBind(&params); err != nil {
		utils.Response.ParameterTypeError(context, err.Error())
		return
	}
	zip, err := TemplateService.DownloadTemplateZip(&params)
	if err != nil {
		utils.Response.ServerError(context, err.Error())
		return
	}
	context.Header("Content-Type", "application/zip")
	context.Header("Content-Disposition", "attachment; filename="+params.TableName+".zip")
	context.Header("Content-Transfer-Encoding", "binary")
	context.Header("Expires", "0")
	context.Header("Cache-Control", "must-revalidate")
	context.Header("Pragma", "public")
	context.Data(200, "application/zip", zip)
}
