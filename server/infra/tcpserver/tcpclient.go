package tcpserver

import (
	"bytes"
	"fmt"
	"net"
	"sync"
	"time"

	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/support/utils"
)

var (
	// 简单的去重/管理映射，防止短时间内对同一地址重复发起连接任务
	// key: address (string) -> value: bool (true)
	activeConnections sync.Map
)

// StartClients 主动连接远端设备（设备作为服务器），支持多个地址，逗号分隔
func StartClients() {
	var gateways []types.Gateway
	// Assuming status 1 is enabled
	if err := db.GormDB.Table("gateways").Where("status = ?", 1).Find(&gateways).Error; err != nil {
		utils.Log.Error("Failed to load gateways from DB", err)
		return
	}

	for _, gw := range gateways {
		ConnectGateway(gw)
	}
}

// ConnectGateway 对外暴露，允许动态触发连接
func ConnectGateway(gw types.Gateway) {
	if gw.IpAddress == "" || gw.Port == 0 {
		return
	}
	// 只有启用状态才连接
	if gw.Status != nil && *gw.Status != 1 {
		return
	}

	addr := fmt.Sprintf("%s:%d", gw.IpAddress, gw.Port)
	
	// 简单去重：如果该地址已经在连接循环中，暂不重复启动
	// 注意：这里仅防止启动时的重复，并不能处理“修改IP后旧连接自动断开”的复杂逻辑
	// 如果IP变了，新IP会启动新任务；旧IP的任务会因为连不上或超时而重试（需人工重启或等待TCP超时）
	if _, loaded := activeConnections.LoadOrStore(addr, true); loaded {
		utils.Log.Info("该地址已在连接任务中，跳过启动", "addr", addr)
		// 更新类型映射，确保即使不重启连接，类型变更也能生效
		SetGatewayType(addr, gw.GatewayType)
		return
	}

	// 将网关地址与类型绑定
	SetGatewayType(addr, gw.GatewayType)
	go connectLoop(addr)
}

func connectLoop(addr string) {
	backoff := time.Second
	maxBackoff := 30 * time.Second

	defer activeConnections.Delete(addr) // 如果循环退出（虽然目前是死循环），清除标记

	for {
		conn, err := net.Dial("tcp", addr)
		if err != nil {
			utils.Log.Warn("TCP 客户端连接失败", "addr", addr, "error", err)
			time.Sleep(backoff)
			if backoff < maxBackoff {
				backoff *= 2
				if backoff > maxBackoff {
					backoff = maxBackoff
				}
			}
			continue
		}

		utils.Log.Info("TCP 客户端已连接", "addr", addr)
		handleClientConn(conn, addr)
		_ = conn.Close()
		utils.Log.Warn("TCP 客户端连接断开，将重连", "addr", addr)
		time.Sleep(time.Second)
		backoff = time.Second
	}
}

// 读取远端设备数据并复用业务解析（与 handle 一致的粘包处理）
func handleClientConn(conn net.Conn, deviceAddr string) {
	var buf bytes.Buffer
	readBuf := make([]byte, 4096)

	for {
		n, err := conn.Read(readBuf)
		if err != nil {
			return
		}
		if n <= 0 {
			continue
		}
		buf.Write(readBuf[:n])
		for {
			ok, consumed := parseFrame(buf.Bytes(), deviceAddr)
			if !ok {
				break
			}
			buf.Next(consumed)
		}
	}
}
