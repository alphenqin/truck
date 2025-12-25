# 工装车管理系统

后端基于 Go + Gin + Gorm + MySQL，前端基于 React + Vite + Ant Design + TailwindCSS，支持 Web 管理端与可选的 TCP 设备接入能力。

## 目录结构

```
项目根目录/
├── server/                     # 后端服务
│   ├── app/                    # 启动与路由
│   ├── config/                 # 配置文件
│   ├── domain/                 # 领域/业务模型
│   ├── infra/                  # 基础设施（DB、TCP 等）
│   ├── license/                # 授权校验逻辑
│   ├── main.go                 # 后端入口
│   ├── sql/                    # 数据库脚本
│   └── support/                # 工具与通用能力
│       ├── tools/              # 运维/授权工具
│       └── utils/              # 工具函数
├── web/                        # 前端项目（Vite）
│   ├── src/                    # 前端源码
│   ├── public/                 # 公共资源
│   └── nginx.conf              # 前端部署示例配置
└── readme.md                   # 项目说明
```

## 本地启动

### 1. 后端

1. 准备 MySQL，并导入初始化脚本：`server/sql/wms.sql`。
2. 修改后端配置：`server/config/config.toml` 选择环境（dev/prod），并在对应的 `config.dev.toml` 或 `config.prod.toml` 中配置数据库账号、端口、JWT 等。
3. 启动后端服务：

```bash
cd server

go run .
```

默认端口为 `:8081`（可在配置中调整）。

### 2. 前端

```bash
cd web

pnpm install
pnpm run dev
```

如需构建生产包：

```bash
pnpm run build
```

## 配置说明（后端）

- `server/config/config.toml`：仅用于指定环境（如 `env = "dev"`）。
- `server/config/config.dev.toml` / `config.prod.toml`：服务端完整配置。
  - `app.port`：HTTP 服务端口
  - `app.baseurl`：接口前缀（默认 `/cms`）
  - `app.tcp_enable`：是否启用 TCP 服务
  - `db.*`：数据库连接信息

## 授权机制（可选）

项目内置机器码 + 试用期授权逻辑，默认在 `server/main.go` 中**未启用**。如需启用：

1. 在 `server/main.go` 中取消授权校验的注释，并替换自定义密钥。
2. 使用授权生成工具：

```bash
cd server/support/tools

go run gen_license.go --mac=目标MAC地址 --days=30 --secret=your_secret_key
```

将生成的 `license.json` 与后端可执行文件放在同一目录后运行。

## 其他

- 前端详细结构与技术栈说明见 `web/README.md`。
- 如需部署到 Nginx，可参考 `web/nginx.conf`。
