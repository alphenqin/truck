package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Xi-Yuer/cms/bootStrap"
	"github.com/Xi-Yuer/cms/services/tcpserver"
)

func main() {
	//const secret = "your_secret_key" // 你自定义的密钥
	//if !license.CheckLicense("license.json", secret) {
	//	fmt.Println("授权校验失败，程序即将退出")
	//	os.Exit(1)
	//}
	bootStrap.Start()
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)
	<-quit
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	// 优雅关闭 TCP 监听
	tcpserver.Shutdown(ctx)
}
