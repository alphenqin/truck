# 使用 golang 官方镜像作为基础镜像
FROM golang:1.21-alpine

# 设置工作目录
WORKDIR /app

# 复制 go.mod 和 go.sum
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 编译
RUN go build -o main .

# 暴露端口
EXPOSE 8081

# 运行
CMD ["./main"] 