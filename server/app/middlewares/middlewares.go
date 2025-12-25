package middlewares

import (
	authMiddleWareModule "github.com/Xi-Yuer/cms/app/middlewares/modules/auth"
	corsMiddlewareModule "github.com/Xi-Yuer/cms/app/middlewares/modules/cors"
)
import sessionMiddleWareModule "github.com/Xi-Yuer/cms/app/middlewares/modules/session"

var SessionMiddleWareModule = sessionMiddleWareModule.Session

var AuthMiddleWareModule = authMiddleWareModule.AuthTokenMiddleWare

var AuthMethodMiddleWare = authMiddleWareModule.AuthMethodMiddleWare

var AuthVerifyCookie = authMiddleWareModule.AuthVerifyCookie

var Cors = corsMiddlewareModule.Cors
