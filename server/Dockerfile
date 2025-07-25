FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY ./server /app
RUN go mod tidy
RUN go build -o app main.go

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/app .
COPY ./server/license.json .
COPY ./server/config ./config/
EXPOSE 8081
CMD ["./app"]