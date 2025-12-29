package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/Xi-Yuer/cms/app/bootStrap"
	"github.com/Xi-Yuer/cms/config"
	"github.com/Xi-Yuer/cms/infra/tcpserver"
	"github.com/Xi-Yuer/cms/license"
)

func main() {
	licensePath := strings.TrimSpace(config.Config.LICENSE.PATH)
	if licensePath == "" {
		licensePath = "license.json"
	}
	secret := strings.TrimSpace(config.Config.LICENSE.SECRET)
	if secret == "" {
		fmt.Println("missing license.secret in config")
		os.Exit(1)
	}
	if err := license.ValidateLicense(licensePath, secret); err != nil {
		fmt.Println("license check failed:", err.Error())
		os.Exit(1)
	}
	bootStrap.Start()
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)
	<-quit
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	// 优雅关闭 TCP 监听
	tcpserver.Shutdown(ctx)
}
