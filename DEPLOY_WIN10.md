# Win10 服务器部署（不使用 Docker）

本文给出在 Win10 服务器上部署本项目的完整步骤（后端 Go + Gin，前端 Vite）。

## 一、准备环境

1. 安装 MySQL 8.x。
2. 选择并安装一个 Web 服务器：Nginx for Windows 或 IIS。
3. 如需在 Win10 本机生成授权或重新编译，再安装 Go 1.23.5 与 Node.js + pnpm。

## 二、在 macOS 上打包 deploy 目录

在项目根目录执行以下步骤，把部署所需文件集中到 `deploy/`。

### 1) 创建目录结构

```bash
mkdir -p deploy/backend/config deploy/sql deploy/web
```

### 2) 后端跨平台编译（macOS -> Windows）

```bash
cd /path/to/project/server
GOOS=windows GOARCH=amd64 go build -o ../deploy/backend/cms-server.exe .
```

如果 Win10 是 ARM 机器，将 `GOARCH=amd64` 改为 `GOARCH=arm64`。

### 3) 拷贝配置与数据库脚本

```bash
cd /path/to/project
cp server/config/config.toml server/config/config.prod.toml deploy/backend/config/
cp server/sql/cms.sql deploy/sql/
cp web/nginx.conf deploy/web/
```

### 4) 前端构建并打包

```bash
cd /path/to/project/web
npm install
npm run build
cp -R dist ../deploy/web/dist
```

### 5) deploy 目录结构

```
deploy/
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

## 三、拷贝 deploy 到 Win10 并初始化数据库

将 `deploy/` 整个目录拷贝到 Win10 服务器（示例路径：`C:\truck\deploy`）。

1. 创建数据库（示例库名 `cms`）。
2. 导入初始化脚本：`deploy/sql/cms.sql`。

示例：

```powershell
mysql -u root -p -e "CREATE DATABASE cms DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p cms < C:\truck\deploy\sql\cms.sql
```

## 四、后端配置

1. 设置运行环境：`deploy/backend/config/config.toml`

```toml
env = "prod"
```

2. 修改 `deploy/backend/config/config.prod.toml`（关键项）：

```toml
[app]
port = ":8081"
baseurl = "/cms"
domain = "localhost"

[db]
user = "root"
password = "你的密码"
host = "127.0.0.1"
name = "cms"
port = "3306"

[license]
path = "C:\\truck\\deploy\\backend\\license.json"
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

2. 在 macOS 上生成授权文件（`--mac` 支持逗号分隔多个 MAC）：

```bash
cd /path/to/project/server/support/tools
go run gen_license.go --mac "AA-BB-CC-DD-EE-FF" --days 30 --secret "YOUR_SECRET"
```

3. 将生成的 `license.json` 放到 `license.path` 指定位置（建议放在 `C:\truck\deploy\backend\license.json`）。

## 六、启动后端

```powershell
cd C:\truck\deploy\backend
.\cms-server.exe
```

端口默认 `8081`（可在配置中修改）。如启用 TCP（`tcp_enable = true`），还需要放行 `tcp_addr` 端口。

## 七、部署前端与反向代理

### 方案 A：Nginx（推荐）

1. 将 `deploy/web/dist` 拷贝到 Nginx 的静态目录（如 `C:\nginx\html`）。
2. 参考 `deploy/web/nginx.conf`，配置 `/cms` 反向代理到后端：

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

停止 Nginx：

```powershell
taskkill /f /im nginx.exe
```

### 方案 B：IIS

1. 将 `deploy/web/dist` 作为站点根目录。
2. 配置 URL Rewrite（或 ARR）把 `/cms` 转发到 `http://127.0.0.1:8081/cms/`。

## 八、验证

1. 浏览器访问：`http://服务器IP/`。
2. 登录与接口请求正常（请求路径应为 `/cms` 前缀）。

## 九、数据库维护

在 Win10 上对 `cms` 数据库做导出 / 重建 / 导入：

```powershell
# 导出
mysqldump -u root -p cms > "D:\backup\cms.sql"

# 删除
mysql -u root -p -e "DROP DATABASE IF EXISTS cms;"

# 创建
mysql -u root -p -e "CREATE DATABASE cms DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 导入
mysql -u root -p cms < "D:\backup\cms.sql"
```

## 十、常见问题

- 前端请求 404：检查 `baseurl` 与前端 `VITE_APP_BASE_URL` 是否一致。
- 授权失败：确认 `license.secret` 与生成授权时的 `--secret` 一致，且 `license.json` 路径正确。
- 数据库连接失败：检查 `db.host`、端口、防火墙与账号权限。
