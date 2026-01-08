# Win10 服务器部署（不使用 Docker）

本文给出在 Win10 服务器上部署本项目的完整步骤（后端 Go + Gin，前端 Vite）。

## 一、准备环境

1. 安装 MySQL 8.x。
2. 选择并安装一个 Web 服务器：Nginx for Windows 或 IIS。
3. 如需在 Win10 本机生成授权或重新编译，再安装 Go 1.23.5 与 Node.js + pnpm。

## 二、在 macOS 上打包 deplay 目录

在项目根目录执行以下步骤，把部署所需文件集中到 `deplay/`。

### 1) 创建目录结构

```bash
mkdir -p deplay/backend/config deplay/sql deplay/web
```

### 2) 后端跨平台编译（macOS -> Windows）

```bash
cd /path/to/project/server
GOOS=windows GOARCH=amd64 go build -o ../deplay/backend/cms-server.exe .
```

如果 Win10 是 ARM 机器，将 `GOARCH=amd64` 改为 `GOARCH=arm64`。

### 3) 拷贝配置与数据库脚本

```bash
cd /path/to/project
cp server/config/config.toml server/config/config.prod.toml deplay/backend/config/
cp server/sql/cms.sql deplay/sql/
cp web/nginx.conf deplay/web/
```

### 4) 前端构建并打包

```bash
cd /path/to/project/web
npm install
npm run build
cp -R dist ../deplay/web/dist
```

### 5) deplay 目录结构

```
deplay/
├── backend/
│   ├── cms-server.exe
│   └── config/
│       ├── config.toml
│       └── config.prod.toml
├── sql/
│   └── cms.sql
└── web/
    ├── dist/
    └── nginx.conf
```

## 三、拷贝 deplay 到 Win10 并部署

将 `deplay/` 整个目录拷贝到 Win10 服务器（示例路径：`C:\truck\deplay`）。

### 1) 数据库初始化

1. 创建数据库（示例库名 `cms`）。
2. 导入初始化脚本：`deplay/sql/cms.sql`。

示例：

```powershell
mysql -u root -p -e "CREATE DATABASE cms DEFAULT CHARSET utf8mb4;"
mysql -u root -p cms < C:\truck\deplay\sql\cms.sql
```

## 四、后端配置

1. 设置运行环境：`deplay/backend/config/config.toml`

```toml
env = "prod"
```

2. 修改 `deplay/backend/config/config.prod.toml`（关键项）：

```toml
[app]
port = ":8081"
baseurl = "/cms"
tcp_enable = false

[db]
user = "root"
password = "你的密码"
host = "127.0.0.1"
name = "cms"
port = "3306"

[license]
path = "C:\\truck\\deplay\\backend\\license.json"
secret = "YOUR_SECRET"
```

说明：
- `db.*` 填实际数据库连接信息。
- `baseurl` 默认 `/cms`，需与前端一致。
- `license.path` 建议使用绝对路径。

## 五、生成授权文件（license.json）

1. 获取服务器 MAC 地址：

```powershell
getmac /v /fo list
```

2. 在 macOS 上生成授权文件：

```bash
cd /path/to/project/server/support/tools
go run gen_license.go --mac "AA-BB-CC-DD-EE-FF" --days 30 --secret "YOUR_SECRET"
```

3. 将生成的 `license.json` 放到 `license.path` 指定位置（建议放在 `C:\truck\deplay\backend\license.json`）。

## 六、启动后端

```powershell
cd C:\truck\deplay\backend
.\cms-server.exe
```

端口默认 `8081`（可在配置中修改）。如启用 TCP（`tcp_enable = true`），还需要放行 `tcp_addr` 端口。

## 七、部署前端与反向代理

### 方案 A：Nginx（推荐）

1. 将 `deplay/web/dist` 拷贝到 Nginx 的静态目录（如 `C:\nginx\html`）。
2. 参考 `deplay/web/nginx.conf`，配置 `/cms` 反向代理到后端：

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root C:/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /cms/ {
        proxy_pass http://127.0.0.1:8081/cms/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 方案 B：IIS

1. 将 `deplay/web/dist` 作为站点根目录。
2. 配置 URL Rewrite（或 ARR）把 `/cms` 转发到 `http://127.0.0.1:8081/cms/`。

## 八、验证

1. 浏览器访问：`http://服务器IP/`。
2. 登录与接口请求正常（请求路径应为 `/cms` 前缀）。

## 九、常见问题

- 前端请求 404：检查 `baseurl` 与前端 `VITE_APP_BASE_URL` 是否一致。
- 授权失败：确认 `license.secret` 与生成授权时的 `--secret` 一致，且 `license.json` 路径正确。
- 数据库连接失败：检查 `db.host`、端口、防火墙与账号权限。





把 mysql的cms数据库导出覆盖到 server/sql/cms.sql

mysqladmin -u root -p drop cms

mysqladmin -u root -p create cms
mysql -u root -p cms < cms.sql



docker exec wms-mysql mysqldump -uroot -p123456 wms> wms.sql