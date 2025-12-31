package tcpserver

import (
	"context"
	"encoding/hex"
	"io"
	"net"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/Xi-Yuer/cms/config"
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

// Start 在独立协程中启动 TCP 监听
func Start() {
	// 使用原子操作保护srv的初始化
	srvMu.Lock()
	if srv != nil {
		srvMu.Unlock()
		return
	}
	s := &Server{
		closed:   make(chan struct{}),
		handlers: snapshotHandlers(),
		remote:   snapshotRemoteHandlers(),
	}
	srvMu.Unlock()

	// 支持多地址监听：以逗号分隔，例如 ":9000,0.0.0.0:9100,127.0.0.1:9200"
	addrs := strings.Split(config.Config.APP.TCPADDR, ",")
	for _, raw := range addrs {
		addr := strings.TrimSpace(raw)
		if addr == "" {
			continue
		}
		ln, err := net.Listen("tcp", addr)
		if err != nil {
			utils.Log.Error("TCP 监听启动失败:", addr, err)
			continue
		}
		s.listeners = append(s.listeners, listenerItem{ln: ln, addr: addr})
		utils.Log.Info("TCP 监听启动成功，地址:", addr)
	}
	if len(s.listeners) == 0 {
		utils.Log.Warn("未成功启动任何 TCP 监听，请检查 TCPADDR 配置:", config.Config.APP.TCPADDR)
		return
	}

	// 使用原子操作保护srv的赋值
	srvMu.Lock()
	if srv == nil {
		srv = s
	}
	srvMu.Unlock()

	// 为每个监听器启动独立的 accept 循环
	for _, item := range s.listeners {
		go s.acceptLoop(item.ln, item.addr)
	}
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

// SetupHandlersFromConfig 基于配置的 TCPADDR 为每个监听地址注册一个默认处理器
// 默认处理器仅打印来源与数据长度（以及前 32 字节十六进制预览），随后丢弃数据。
// 若在外部已通过 RegisterHandler 注册了相同地址，会被此函数覆盖；如不希望被覆盖，请在调用 Start 前自行控制调用顺序。
func SetupHandlersFromConfig() {
	addrs := strings.Split(config.Config.APP.TCPADDR, ",")
	for _, raw := range addrs {
		addr := strings.TrimSpace(raw)
		if addr == "" {
			continue
		}
		RegisterHandler(addr, func(conn net.Conn, data []byte) {
			preview := data
			if len(preview) > 32 {
				preview = preview[:32]
			}
			utils.Log.Info(
				"TCP 数据",
				"local", addr,
				"remote", conn.RemoteAddr().String(),
				"len", len(data),
				"hex", strings.ToUpper(hex.EncodeToString(preview)),
			)
			_, _ = io.Discard.Write(data)
		})
	}
}
