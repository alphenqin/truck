package operationLogMiddlewareModule

import (
	"strings"

	"github.com/Xi-Yuer/cms/config"
	"github.com/Xi-Yuer/cms/domain/constant"
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/support/utils"
	"github.com/gin-gonic/gin"
)

// skipPaths 需要跳过记录的路径前缀（登录、操作日志查询本身）
var skipPaths = []string{
	config.Config.APP.BASEURL + "/auth/login",
	config.Config.APP.BASEURL + "/monitor/logs/query",
}

// OperationLogMiddleWare 操作日志记录中间件，记录已执行的请求
func OperationLogMiddleWare(context *gin.Context) {
	// 跳过噪音端点
	path := context.Request.URL.Path
	for _, p := range skipPaths {
		if strings.HasPrefix(path, p) {
			context.Next()
			return
		}
	}

	// 先执行后续处理器
	context.Next()

	// Next() 返回后采集响应状态与用户信息
	method := context.Request.Method
	ip := context.ClientIP()
	statusCode := context.Writer.Status()

	var userID, account string
	if payload, exists := context.Get(constant.JWTPAYLOAD); exists {
		if jwtPayload, ok := payload.(*types.JWTPayload); ok {
			userID = jwtPayload.ID
			account = jwtPayload.Account
		}
	}

	// path 列为 varchar(500)，超长截断避免写入失败
	if len(path) > 500 {
		path = path[:500]
	}

	log := types.OperationLog{
		UserID:     userID,
		Account:    account,
		Method:     method,
		Path:       path,
		IP:         ip,
		StatusCode: statusCode,
	}

	// 异步写入，避免阻塞请求；值已拷贝进 struct，不可在 goroutine 中引用 context
	go func(l types.OperationLog) {
		if err := db.GormDB.Table("operation_logs").Create(&l).Error; err != nil {
			utils.Log.Error("记录操作日志失败", "error", err)
		}
	}(log)
}
