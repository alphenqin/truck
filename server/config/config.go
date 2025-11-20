package config

import (
	"os"
)

var Config = config{
	APP: APP{
		PORT:          ":8081",
		SESSIONSECRET: "FUCNdjYGFg4G",
		JWT:           "P8BkI2OpBkY",
		SWAGPATH:      "http://localhost:8081/swagger/docs/index.html#/example",
		BASEURL:       "/cms",
		FILEPATH:      "./uploadFile/",
		DOMAIN:        "localhost",
		TCPADDR:       getEnv("TCP_ADDR", ":9000"),
		REMOTE_ADDRS:  getEnv("TCP_REMOTE_ADDRS", "192.168.1.168:20058"),
	},
	DB: DB{
		NAME:     getEnv("DB_USER", "root"),
		PASSWORD: getEnv("DB_PASSWORD", "123456"),
		HOST:     getEnv("DB_HOST", "localhost"),
		DB:       getEnv("DB_NAME", "cms"),
		PORT:     getEnv("DB_PORT", "3306"),
	},
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

type config struct {
	APP
	DB
}

type APP struct {
	PORT          string
	SESSIONSECRET string
	JWT           string
	SWAGPATH      string
	BASEURL       string
	FILEPATH      string
	DOMAIN        string
	TCPADDR       string
	REMOTE_ADDRS  string
}
type DB struct {
	NAME     string
	PASSWORD string
	HOST     string
	DB       string
	PORT     string
}
