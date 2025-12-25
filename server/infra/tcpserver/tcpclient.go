package tcpserver

import (
	"bytes"
	"net"
	"strings"
	"time"

	"github.com/Xi-Yuer/cms/config"
	"github.com/Xi-Yuer/cms/support/utils"
)

// StartClients 主动连接远端设备（设备作为服务器），支持多个地址，逗号分隔
func StartClients() {
	addrs := strings.Split(config.Config.APP.REMOTE_ADDRS, ",")
	for _, raw := range addrs {
		addr := strings.TrimSpace(raw)
		if addr == "" {
			continue
		}
		go connectLoop(addr)
	}
}

func connectLoop(addr string) {
	backoff := time.Second
	maxBackoff := 30 * time.Second

	for {
		conn, err := net.Dial("tcp", addr)
		if err != nil {
			utils.Log.Warn("TCP 客户端连接失败:", addr, err)
			time.Sleep(backoff)
			if backoff < maxBackoff {
				backoff *= 2
				if backoff > maxBackoff {
					backoff = maxBackoff
				}
			}
			continue
		}

		utils.Log.Info("TCP 客户端已连接:", addr)
		handleClientConn(conn, addr)
		_ = conn.Close()
		utils.Log.Warn("TCP 客户端连接断开，将重连:", addr)
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
