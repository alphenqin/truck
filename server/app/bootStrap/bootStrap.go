package bootStrap

import (
	"github.com/Xi-Yuer/cms/app/routers"
	"github.com/Xi-Yuer/cms/config"
	"github.com/Xi-Yuer/cms/infra/db"
	repositories "github.com/Xi-Yuer/cms/infra/repositories/modules"
	"github.com/Xi-Yuer/cms/infra/tcpserver"
	"github.com/Xi-Yuer/cms/support/utils"
)

func Start() {
	if err := db.InitDB(); err != nil {
		utils.Log.Panic(err)
		return
	}

	// 幂等播种内置业务参数（疑似丢失/呆滞阈值等）
	if err := repositories.AssetBaseRepository.EnsureBuiltinArgs(); err != nil {
		utils.Log.Error("初始化内置业务参数失败", "error", err)
	}

	r := routers.SetUpRouters()
	go func() {
		err := r.Run(config.Config.APP.PORT)
		if err != nil {
			utils.Log.Panic(err)
		}
	}()

	// 启动 TCP 客户端（根据数据库网关配置自动连接）
	go tcpserver.StartClients()

	utils.Log.Info("服务器启动成功，运行端口", config.Config.APP.PORT)
}
