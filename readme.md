<div align="center">

# 🚛 工装车管理系统

**Cargo / Tooling Vehicle Management System**

后端 Go + Gin + GORM + MySQL · 前端 React + Vite + Ant Design + TailwindCSS · 可选 TCP 设备接入

[功能特性](#-功能特性) · [技术栈](#-技术栈) · [目录结构](#-目录结构) · [快速开始](#-快速开始) · [配置说明](#-配置说明) · [授权机制](#-授权机制) · [部署](#-部署)

</div>

---

## ✨ 功能特性

- **资产管理**：工装车 / 资产全生命周期管理，支持资产绑定、分类、分组、产线与部门归属。
- **出入库记录**：涵盖面板（Panel）、台账（Ledger）、蜂鸣器（Buzzer）等出入库流水与异常记录。
- **IoT 设备接入**：内置 TCP Server，对接 RFID 网关与标签，实时采集标签观测数据（带去重窗口、多 Worker 异步入库）。
- **站点库**：园区（Garden）、门店（Store）等站点信息维护。
- **实时监控**：车辆监控、网关监控、定时任务（TimeTask）调度。
- **数据分析**：资产状态、流转、流量多维分析与可视化看板（ECharts / AntV）。
- **异常管理**：流失（Lost）、流转异常（Flow）跟踪。
- **系统管理**：用户、角色、菜单、部门、通知、参数等 RBAC 权限体系。
- **授权校验**：基于 MAC + 过期时间的离线授权，启动强制校验。

## 🧱 技术栈

### 后端（`server/`）

| 能力 | 选型 |
| --- | --- |
| 语言 / 框架 | Go · [Gin](https://github.com/gin-gonic/gin) · [GORM](https://gorm.io) |
| 数据库 | MySQL 8 |
| 设备接入 | 自研 TCP Server（多监听、回调注册、优雅关闭） |
| 授权 | HMAC-SHA256 + MD5 签名校验 |
| 配置 | TOML（dev / prod 多环境） |

### 前端（`web/`）

| 能力 | 选型 |
| --- | --- |
| 框架 | React 18 · TypeScript · [Vite 5](https://vitejs.dev) |
| UI | [Ant Design 5](https://ant.design) · Pro Components · TailwindCSS |
| 状态 | Redux Toolkit · redux-persist |
| 路由 | React Router v6 |
| 图表 | ECharts · @ant-design/charts · Recharts · Chart.js |
| 编辑器 | Monaco Editor |
| 其他 | ahooks · axios · dayjs · xlsx |

## 📁 目录结构

```
项目根目录/
├── server/                         # 后端服务
│   ├── app/
│   │   ├── bootStrap/              # 启动引导
│   │   ├── controllers/            # 控制器（按模块组织）
│   │   ├── middlewares/            # 认证 / 会话 / 权限中间件
│   │   └── routers/                # 路由（按模块组织）
│   ├── config/                     # 配置文件（config.toml + dev/prod）
│   ├── domain/                     # 领域模型与常量
│   │   ├── constant/
│   │   └── types/
│   ├── infra/
│   │   ├── db/                     # 数据库连接与菜单初始化
│   │   ├── repositories/           # 仓储层
│   │   └── tcpserver/              # TCP 设备接入服务
│   ├── license/                    # 授权校验逻辑
│   ├── support/
│   │   ├── tools/                  # 运维工具（gen_license 等）
│   │   └── utils/                  # 工具函数
│   ├── sql/                        # 数据库初始化脚本
│   └── main.go                     # 后端入口
├── web/                            # 前端项目
│   ├── src/
│   │   ├── LayOut/                 # 全局布局
│   │   ├── components/             # 通用组件
│   │   ├── pages/                  # 业务页面
│   │   ├── router/                 # 路由配置
│   │   ├── service/                # API 与请求封装
│   │   ├── store/                  # Redux 状态
│   │   ├── theme/                  # 主题
│   │   └── utils/                  # 工具函数
│   ├── public/
│   └── nginx.conf                  # Nginx 部署示例
├── deplay/                         # 部署产物目录（后端 exe / 前端 dist / sql / nginx）
├── DEPLOY_WIN10.md                 # Win10 部署详细文档
└── readme.md
```

### 后端业务模块

`users` · `auth` · `roles` · `pages` · `systemDepartment` · `interface` · `system` · `timeTask` · `asset` · `siteLibrary` · `ioRecord` · `assetBase` · `iot` · `analysis`

### 前端业务页面

`Dashboard` · `Asset` · `AssetBind` · `ioRecord` · `Iot` · `Monitor` · `Analysis` · `Exception` · `SiteLibrary` · `Panel` · `System` · `base` · `Login` · `About`

## 🚀 快速开始

### 前置条件

- Go 1.23+
- Node.js 18+ / pnpm
- MySQL 8（默认库名 `cms`，账号 `root` / 密码 `123456`，可按需修改）

### 1. 后端

1. 创建数据库 `cms` 并导入初始化脚本：

   ```bash
   mysql -uroot -p cms < server/sql/cms.sql
   ```

2. 选择环境并在 `server/config/config.dev.toml`（或 `config.prod.toml`）中配置数据库、端口、JWT、授权等。
3. 启动服务：

   ```bash
   cd server
   go run .
   ```

   默认 HTTP 端口 `:8081`，接口前缀 `/cms`。

> 启动时会强制校验授权文件，缺少 `license.secret` 或校验失败将直接退出。详见 [授权机制](#-授权机制)。

### 2. 前端

```bash
cd web
pnpm install
pnpm run dev      # 开发模式
pnpm run build    # 生产构建，产物输出到 web/dist
```

## ⚙️ 配置说明

`server/config/config.toml` 仅用于指定运行环境：

```toml
env = "dev"   # 或 "prod"
```

实际配置在 `config.dev.toml` / `config.prod.toml`：

| 配置项 | 说明 |
| --- | --- |
| `app.port` | HTTP 服务端口（默认 `:8081`） |
| `app.baseurl` | 接口前缀（默认 `/cms`） |
| `app.session_secret` | 会话签名密钥 |
| `app.jwt_secret` | JWT 签名密钥 |
| `app.tcp_enable` | 是否启用 TCP 设备服务 |
| `db.*` | 数据库连接（user / password / host / port / name） |
| `license.path` | 授权文件路径（默认 `license.json`） |
| `license.secret` | 授权校验密钥（**必填**） |

## 🔐 授权机制

项目内置基于 **MAC 地址 + 过期时间** 的离线授权，启动时强制校验。

1. 生成授权文件（需与配置中 `license.secret` 一致）：

   ```bash
   cd server/support/tools
   go run gen_license.go --mac "AA-BB-CC-DD-EE-FF" --days 30 --secret "YOUR_SECRET"
   ```

2. 将生成的 `license.json` 放到 `license.path` 指定路径，启动后端即可。

## 📡 TCP 设备接入（可选）

当 `app.tcp_enable = true` 时，后端启动 TCP Server 监听硬件连接，主要能力：

- 多地址监听 + 按地址注册数据处理回调（`RegisterHandler`）。
- RFID 网关 / 标签数据解析，带 **2 秒去重窗口** 与 **4 Worker 异步入库队列**。
- 连接级缓冲管理、网关信息映射（`SetGatewayInfo` / `DeleteGatewayInfo`）。
- 支持优雅关闭（`Shutdown`）。

## 📦 部署

### Win10 服务器（不使用 Docker）

完整步骤见 [`DEPLOY_WIN10.md`](./DEPLOY_WIN10.md)，要点：

1. **后端**：跨平台编译后部署 `cms-server.exe`，配置 `config/config.prod.toml` 与 `license.json`。

   ```bash
   # macOS -> Windows 交叉编译
   cd server
   GOOS=windows GOARCH=amd64 go build -o ../deplay/backend/cms-server.exe .
   ```

   ```powershell
   # Win10 上运行
   .\cms-server.exe
   ```

2. **前端**：构建 `web/dist`，部署到 Nginx 或 IIS，Nginx 配置参考 `web/nginx.conf`。

   ```bash
   cd web
   pnpm install
   pnpm run build
   ```

3. **数据库**：导入 `server/sql/cms.sql`（或 `deplay/sql/cms.sql`）。

### 获取服务器 MAC 地址（用于生成授权）

```powershell
getmac /v /fo list
# 或
ipconfig /all
```

## 📌 其他

- 前端详细说明见 [`web/README.md`](./web/README.md)。
- Win10 部署完整文档见 [`DEPLOY_WIN10.md`](./DEPLOY_WIN10.md)。
- Nginx 示例配置见 [`web/nginx.conf`](./web/nginx.conf)。
