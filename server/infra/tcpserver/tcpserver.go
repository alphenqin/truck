package tcpserver

import (
	"context"
	"io"
	"net"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/Xi-Yuer/cms/support/utils"
)

// Server 负责长期监听来自硬件的 TCP 连接（主体架构）
type Server struct {
	listeners []listenerItem
	handlers  map[string]DataHandler
	remote    map[string]DataHandler
	mu        sync.RWMutex
	wg        sync.WaitGroup
	closed    chan struct{}
}

var (
	srv *Server
	srvMu sync.Mutex // 保护srv变量的并发访问
)

type listenerItem struct {
	ln   net.Listener
	addr string
}

// DataHandler 针对某个监听地址的数据处理回调
type DataHandler func(conn net.Conn, data []byte)

// RegisterHandler 为指定监听地址注册数据处理器（addr 与 TCPADDR 配置中的片段一致，如 \":9000\"）
func RegisterHandler(addr string, handler DataHandler) {
	if handler == nil {
		return
	}

	// 使用原子操作保护srv的初始化
	if srv == nil {
		srvMu.Lock()
		if srv == nil {
			srv = &Server{
				closed:   make(chan struct{}),
				handlers: map[string]DataHandler{},
				remote:   map[string]DataHandler{},
			}
		}
		srvMu.Unlock()
	}

	srv.mu.Lock()
	if srv.handlers == nil {
		srv.handlers = map[string]DataHandler{}
	}
	srv.handlers[strings.TrimSpace(addr)] = handler
	srv.mu.Unlock()
}

// RegisterRemoteHandler 为指定远端设备地址注册数据处理器（remoteAddr 例如 "192.168.1.168:20058"）
func RegisterRemoteHandler(remoteAddr string, handler DataHandler) {
	if handler == nil {
		return
	}

	// 使用原子操作保护srv的初始化
	if srv == nil {
		srvMu.Lock()
		if srv == nil {
			srv = &Server{
				closed:   make(chan struct{}),
				handlers: map[string]DataHandler{},
				remote:   map[string]DataHandler{},
			}
		}
		srvMu.Unlock()
	}

	srv.mu.Lock()
	if srv.remote == nil {
		srv.remote = map[string]DataHandler{}
	}
	srv.remote[strings.TrimSpace(remoteAddr)] = handler
	srv.mu.Unlock()
}

func Start() {
	// 该功能已由 StartClients 接管，如需开启服务端模式，请重新设计。
}

func (s *Server) acceptLoop(listener net.Listener, confAddr string) {
	for {
		// 退出检查
		select {
		case <-s.closed:
			return
		default:
		}

		conn, err := listener.Accept()
		if err != nil {
			select {
			case <-s.closed:
				return
			default:
			}
			utils.Log.Error("TCP Accept 失败:", err)
			continue
		}
		utils.Log.Info("TCP 新连接:", conn.RemoteAddr().String())
		s.wg.Add(1)
		go s.handleConn(conn, confAddr)
	}
}

// 连接处理：读取数据占位（预留协议解析位置）
func (s *Server) handleConn(conn net.Conn, confAddr string) {
	defer s.wg.Done()
	defer cleanupConnBuffer(conn)
	defer conn.Close()

	// 长连接可不设置超时；如需心跳可在此处调整
	_ = conn.SetReadDeadline(time.Time{})

	readBuf := make([]byte, 4096) // 读取缓冲
	for {
		n, err := conn.Read(readBuf)
		if err != nil {
			utils.Log.Warn("TCP 连接读取结束:", err)
			return
		}
		if n <= 0 {
			continue
		}

		data := readBuf[:n]
		if h := s.GetHandler(confAddr); h != nil {
			h(conn, data)
		} else if rh := s.GetRemoteHandler(conn.RemoteAddr().String()); rh != nil {
			rh(conn, data)
		} else {
			_, _ = io.Discard.Write(data)
		}
	}
}

// Shutdown 优雅关闭
func Shutdown(ctx context.Context) {
	// 使用原子操作保护srv的访问
	srvMu.Lock()
	currentSrv := srv
	srv = nil
	srvMu.Unlock()

	if currentSrv == nil {
		return
	}
	ShutdownRecordQueue()
	close(currentSrv.closed)
	for _, item := range currentSrv.listeners {
		_ = item.ln.Close()
	}

	ch := make(chan struct{})
	go func() {
		currentSrv.wg.Wait()
		close(ch)
	}()

	select {
	case <-ctx.Done():
		utils.Log.Warn("TCP 监听未在超时时间内完全退出")
	case <-ch:
		utils.Log.Info("TCP 监听已优雅退出")
	}
}

func (s *Server) SetHandler(addr string, handler DataHandler) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.handlers[strings.TrimSpace(addr)] = handler
}

func (s *Server) GetHandler(addr string) DataHandler {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.handlers[strings.TrimSpace(addr)]
}

// 启动时复制一份已注册的 handler，避免运行中被改动
func snapshotHandlers() map[string]DataHandler {
	// 使用原子操作保护srv的访问
	srvMu.Lock()
	currentSrv := srv
	srvMu.Unlock()

	if currentSrv == nil || currentSrv.handlers == nil {
		return map[string]DataHandler{}
	}
	// 为了稳定性，按 key 排序拷贝（非必须）
	keys := make([]string, 0, len(currentSrv.handlers))
	for k := range currentSrv.handlers {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	dst := make(map[string]DataHandler, len(keys))
	for _, k := range keys {
		dst[k] = currentSrv.handlers[k]
	}
	return dst
}

func (s *Server) GetRemoteHandler(remote string) DataHandler {
	s.mu.RLock()
	defer s.mu.RUnlock()
	remote = strings.TrimSpace(remote)
	if h, ok := s.remote[remote]; ok {
		return h
	}
	// 降级：仅按 IP 匹配（忽略端口）
	if i := strings.LastIndex(remote, ":"); i > 0 {
		ip := remote[:i]
		if h, ok := s.remote[ip]; ok {
			return h
		}
	}
	return nil
}

func snapshotRemoteHandlers() map[string]DataHandler {
	// 使用原子操作保护srv的访问
	srvMu.Lock()
	currentSrv := srv
	srvMu.Unlock()

	if currentSrv == nil || currentSrv.remote == nil {
		return map[string]DataHandler{}
	}
	keys := make([]string, 0, len(currentSrv.remote))
	for k := range currentSrv.remote {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	dst := make(map[string]DataHandler, len(keys))
	for _, k := range keys {
		dst[k] = currentSrv.remote[k]
	}
	return dst
}

