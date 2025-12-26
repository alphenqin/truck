FROM golang:1.22-alpine AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/bin/server ./main.go

FROM alpine:3.20
WORKDIR /app

RUN adduser -D -g '' appuser

COPY --from=builder /app/bin/server /app/server
COPY config /app/config

EXPOSE 8081 9000
USER appuser

CMD ["/app/server"]
