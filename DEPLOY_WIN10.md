# Win10 服务器部署（不使用 Docker）

部署分四步：**打包 → 初始化数据库 → 配置并启动后端 → 部署前端与反向代理**。

## 一、环境准备（Win10 服务器）

1. MySQL 8.x（本地安装）
2. Nginx for Windows（推荐）或 IIS
3. 打包机需要 Go 1.23+ 与 Node.js + pnpm（Win10 本机重编译时才需要）

## 二、打包 deploy 目录（在开发机执行）

```bash
# 1. 目录结构
mkdir -p deploy/backend/config deploy/sql deploy/web

# 2. 后端跨平台编译（开发机 -> Windows exe；ARM 机器把 GOARCH 改为 arm64）
cd server
GOOS=windows GOARCH=amd64 go build -o ../deploy/backend/cms-server.exe .

# 3. 拷贝配置与数据库脚本
cd ..
cp server/config/config.toml server/config/config.prod.toml deploy/backend/config/
cp server/sql/cms.sql deploy/sql/
cp web/nginx.conf deploy/web/

# 4. 前端构建
cd web
npm install && npm run build
cp -R dist ../deploy/web/dist
```

产物结构：

```
deploy/
├── backend/
│   ├── cms-server.exe
│   └── config/          # config.toml + config.prod.toml
├── sql/cms.sql
└── web/
    ├── dist/
    └── nginx.conf
```

## 三、初始化数据库

将 `deploy/` 拷贝到服务器（示例路径 `C:\truck\deploy`），导入初始化脚本：

```bat
mysql -u root -p -e "CREATE DATABASE cms DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p cms < C:\truck\deploy\sql\cms.sql
```

## 四、后端配置与启动

1. `deploy/backend/config/config.toml` 设置 `env = "prod"`。

2. 修改 `deploy/backend/config/config.prod.toml` 关键项：

```toml
[app]
port = ":8081"
baseurl = "/cms"          # 需与前端 VITE_APP_BASE_URL 一致
domain = "localhost"

[db]
user = "root"
password = "你的密码"
host = "127.0.0.1"
name = "cms"
port = "3306"

[license]
path = "C:\\truck\\deploy\\backend\\license.json"   # 建议绝对路径
secret = "YOUR_SECRET"
```

3. 生成授权文件 license.json：

```powershell
# Win10 上获取 MAC（多个 MAC 用逗号分隔）
getmac /v /fo list
```

```bash
# 开发机上生成，把 license.json 放到 license.path 指定位置
cd server/support/tools
go run gen_license.go --mac "AA-BB-CC-DD-EE-FF" --days 30 --secret "YOUR_SECRET"
```

4. 启动后端：

```powershell
cd C:\truck\deploy\backend
.\cms-server.exe
```

端口默认 `8081`；如 `tcp_enable = true`，还需放行 `tcp_addr` 端口。

## 五、前端与反向代理

### 方案 A：Nginx（推荐）

`deploy/web/dist` 拷贝到 Nginx 静态目录（如 `C:\nginx\html`），配置 `/cms` 反代到后端：

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

停止 Nginx：`taskkill /f /im nginx.exe`

### 方案 B：IIS

`deploy/web/dist` 作为站点根目录，用 URL Rewrite（或 ARR）把 `/cms` 转发到 `http://127.0.0.1:8081/cms/`。

## 六、验证

浏览器访问 `http://服务器IP/`，登录并确认接口请求带 `/cms` 前缀且正常返回。

## 七、数据库维护

```powershell
# 导出
mysqldump -u root -p cms > "D:\backup\cms.sql"

# 重建
mysql -u root -p -e "DROP DATABASE IF EXISTS cms;"
mysql -u root -p -e "CREATE DATABASE cms DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p cms < "D:\backup\cms.sql"
```

## 八、存量库升级：允许不同类型下重复的资产编码

业务规则：同一资产编码在不同资产类型下允许重复（如 Dolly车 和 双层平板车 都可以有编号 001），只有"同编码 + 同类型"才算重复。

**1. 改数据库**（在 Win10 的 cmd 中执行，先备份数据）：

```bat
mysql -u root -p cms -e "ALTER TABLE asset DROP INDEX uniq_asset_code, ADD UNIQUE KEY uniq_asset_code_type (asset_code, asset_type);"
```

说明：
- 原索引 `uniq_asset_code` 只按 `asset_code` 判重；新索引 `uniq_asset_code_type` 按 `(asset_code, asset_type)` 判重。
- 若 `asset` 表已存在"同编码同类型"的重复数据，ALTER 会失败，先清理重复数据再执行。
- 验证索引：

```bat
mysql -u root -p cms -e "SHOW INDEX FROM asset WHERE Key_name = 'uniq_asset_code_type';"
```

**2. 换应用版本**：部署包含本次修改的后端（新增/编辑资产、资产绑定、Excel 导入均按"编码 + 类型"判重）和前端（资产绑定页面及导入模板增加"资产类型"字段），重新按第二章打包部署。

## 九、常见问题

- 前端请求 404：检查 `baseurl` 与前端 `VITE_APP_BASE_URL` 是否一致。
- 授权失败：确认 `license.secret` 与生成授权时的 `--secret` 一致，且 `license.json` 路径正确。
- 数据库连接失败：检查 `db.host`、端口、防火墙与账号权限。
