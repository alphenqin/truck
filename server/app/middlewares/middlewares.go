package middlewares

import (
	authMiddleWareModule "github.com/Xi-Yuer/cms/app/middlewares/modules/auth"
	corsMiddlewareModule "github.com/Xi-Yuer/cms/app/middlewares/modules/cors"
	operationLogMiddlewareModule "github.com/Xi-Yuer/cms/app/middlewares/modules/operationLog"
)
import sessionMiddleWareModule "github.com/Xi-Yuer/cms/app/middlewares/modules/session"

var SessionMiddleWareModule = sessionMiddleWareModule.Session

var AuthMiddleWareModule = authMiddleWareModule.AuthTokenMiddleWare

var AuthMethodMiddleWare = authMiddleWareModule.AuthMethodMiddleWare

var AuthVerifyCookie = authMiddleWareModule.AuthVerifyCookie

var OperationLogMiddleWare = operationLogMiddlewareModule.OperationLogMiddleWare

var Cors = corsMiddlewareModule.Cors
