package bootStrap

import (
	"github.com/Xi-Yuer/cms/app/routers"
	"github.com/Xi-Yuer/cms/config"
	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/infra/tcpserver"
	"github.com/Xi-Yuer/cms/support/utils"
)

func Start() {
	if err := db.InitDB(); err != nil {
		utils.Log.Panic(err)
		return
	}

	r := routers.SetUpRouters()
	go func() {
		err := r.Run(config.Config.APP.PORT)
		if err != nil {
			utils.Log.Panic(err)
		}
	}()

	// 基于配置为每个监听地址注册默认处理器（可被外部自定义覆盖）
	tcpserver.SetupHandlersFromConfig()
	// 注册业务处理器（覆盖默认处理器），按端口区分处理逻辑
	tcpserver.RegisterBusinessHandlers()
	if config.Config.APP.TCP_ENABLE {
		// 启动 TCP 监听（独立协程，多地址并发监听）
		go tcpserver.Start()
	}
	// 启动 TCP 客户端（主动连接远端设备，设备作为服务端）
	go tcpserver.StartClients()

	utils.Log.Info("服务器启动成功，运行端口", config.Config.APP.PORT)
}
