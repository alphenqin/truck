package tcpserver

import (
	"bytes"
	"context"
	"fmt"
	"net"
	"strconv"
	"sync"
	"time"

	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/support/utils"
)

type gatewayClient struct {
	id     string
	addr   string
	cancel context.CancelFunc

	mu   sync.Mutex
	conn net.Conn
}

func (c *gatewayClient) setConn(conn net.Conn) {
	c.mu.Lock()
	c.conn = conn
	c.mu.Unlock()
}

func (c *gatewayClient) clearConn(conn net.Conn) {
	c.mu.Lock()
	if c.conn == conn {
		c.conn = nil
	}
	c.mu.Unlock()
}

func (c *gatewayClient) stop() {
	c.cancel()
	c.mu.Lock()
	if c.conn != nil {
		_ = c.conn.Close()
		c.conn = nil
	}
	c.mu.Unlock()
}

var (
	gatewayClientsMu sync.Mutex
	gatewayClients   = make(map[string]*gatewayClient)
)

// StartClients 从数据库加载全部启用网关。设备作为 TCP 服务端，本程序主动连接。
func StartClients() {
	var gateways []types.Gateway
	if err := db.GormDB.Table("gateways").Where("status = ?", 1).Find(&gateways).Error; err != nil {
		utils.Log.Error("从数据库加载网关失败", "error", err)
		return
	}

	for _, gw := range gateways {
		ConnectGateway(gw)
	}
}

// ConnectGateway 使某个网关的运行连接与数据库配置保持一致。
// 同一网关修改 IP/端口时会先停止旧连接；禁用状态会停止已有连接。
func ConnectGateway(gw types.Gateway) {
	clientID := gatewayClientID(gw)
	if gw.Status == nil || *gw.Status != 1 || gw.IpAddress == "" || gw.Port <= 0 {
		StopGateway(gw.Id)
		return
	}

	addr := fmt.Sprintf("%s:%d", gw.IpAddress, gw.Port)
	gatewayID, _ := strconv.ParseInt(gw.Id, 10, 64)

	gatewayClientsMu.Lock()
	if current, ok := gatewayClients[clientID]; ok && current.addr == addr {
		SetGatewayInfo(addr, gatewayID, gw.GatewayType)
		gatewayClientsMu.Unlock()
		return
	}

	var previous *gatewayClient
	if current, ok := gatewayClients[clientID]; ok {
		previous = current
		delete(gatewayClients, clientID)
	}
	for id, current := range gatewayClients {
		if current.addr == addr && id != clientID {
			gatewayClientsMu.Unlock()
			if previous != nil {
				previous.stop()
				DeleteGatewayInfo(previous.addr)
			}
			utils.Log.Warn("多个网关配置了相同地址，跳过重复连接", "gatewayId", gw.Id, "addr", addr)
			return
		}
	}

	ctx, cancel := context.WithCancel(context.Background())
	client := &gatewayClient{id: clientID, addr: addr, cancel: cancel}
	gatewayClients[clientID] = client
	SetGatewayInfo(addr, gatewayID, gw.GatewayType)
	gatewayClientsMu.Unlock()

	if previous != nil {
		previous.stop()
		DeleteGatewayInfo(previous.addr)
	}
	go connectLoop(ctx, client)
}

func gatewayClientID(gw types.Gateway) string {
	if gw.Id != "" {
		return "id:" + gw.Id
	}
	return fmt.Sprintf("addr:%s:%d", gw.IpAddress, gw.Port)
}

// StopGateway 停止指定数据库网关 ID 对应的连接和重连任务。
func StopGateway(gatewayID string) {
	if gatewayID == "" {
		return
	}
	clientID := "id:" + gatewayID
	gatewayClientsMu.Lock()
	client := gatewayClients[clientID]
	delete(gatewayClients, clientID)
	gatewayClientsMu.Unlock()
	if client != nil {
		client.stop()
		DeleteGatewayInfo(client.addr)
	}
}

// ShutdownClients 停止全部连接，供进程优雅退出使用。
func ShutdownClients() {
	gatewayClientsMu.Lock()
	clients := make([]*gatewayClient, 0, len(gatewayClients))
	for id, client := range gatewayClients {
		clients = append(clients, client)
		delete(gatewayClients, id)
	}
	gatewayClientsMu.Unlock()

	for _, client := range clients {
		client.stop()
		DeleteGatewayInfo(client.addr)
	}
}

func connectLoop(ctx context.Context, client *gatewayClient) {
	backoff := time.Second
	const maxBackoff = 30 * time.Second
	dialer := net.Dialer{Timeout: 10 * time.Second, KeepAlive: 30 * time.Second}

	for {
		conn, err := dialer.DialContext(ctx, "tcp", client.addr)
		if err != nil {
			if ctx.Err() != nil {
				return
			}
			utils.Log.Warn("TCP 客户端连接失败", "addr", client.addr, "error", err)
			if !waitForRetry(ctx, backoff) {
				return
			}
			backoff *= 2
			if backoff > maxBackoff {
				backoff = maxBackoff
			}
			continue
		}

		client.setConn(conn)
		utils.Log.Info("TCP 客户端已连接", "addr", client.addr)
		handleClientConn(conn, client.addr)
		client.clearConn(conn)
		_ = conn.Close()
		if ctx.Err() != nil {
			return
		}
		utils.Log.Warn("TCP 客户端连接断开，将重连", "addr", client.addr)
		if !waitForRetry(ctx, time.Second) {
			return
		}
		backoff = time.Second
	}
}

func waitForRetry(ctx context.Context, delay time.Duration) bool {
	timer := time.NewTimer(delay)
	defer timer.Stop()
	select {
	case <-ctx.Done():
		return false
	case <-timer.C:
		return true
	}
}

// handleClientConn 按连接维护缓冲区，支持 TCP 半包和粘包。
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
