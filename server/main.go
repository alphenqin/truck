package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Xi-Yuer/cms/bootStrap"
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
	_, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
}
