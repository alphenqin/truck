package config

import (
	"os"
	"path/filepath"

	"github.com/pelletier/go-toml/v2"
)

var Config = loadConfig()

func defaultConfig() config {
	return config{
		APP: APP{
			PORT:    ":8081",
			BASEURL: "/cms",
			DOMAIN:  "localhost",
		},
		DB: DB{
			NAME: "root",
			HOST: "localhost",
			DB:   "cms",
			PORT: "3306",
		},
		LICENSE: LICENSE{
			PATH: "license.json",
		},
	}
}

func loadConfig() config {
	cfg := defaultConfig()

	env := "dev"
	envPath := resolveConfigPath("config.toml")
	if data, err := os.ReadFile(envPath); err == nil {
		var envCfg struct {
			Env string `toml:"env"`
		}
		if err := toml.Unmarshal(data, &envCfg); err != nil {
			panic("config file parse error: " + err.Error())
		}
		if envCfg.Env != "" {
			env = envCfg.Env
		}
	}
	path := resolveConfigPath("config." + env + ".toml")

	data, err := os.ReadFile(path)
	if err != nil {
		panic("config file not found: " + path)
	}
	if err := toml.Unmarshal(data, &cfg); err != nil {
		panic("config file parse error: " + err.Error())
	}

	validateConfig(cfg)
	return cfg
}

// resolveConfigPath 优先使用当前工作目录下的 config，并允许测试或运维命令
// 从 server 的子目录启动。正式部署目录结构仍然使用 backend/config。
func resolveConfigPath(filename string) string {
	dir, err := os.Getwd()
	if err != nil {
		return filepath.Join("config", filename)
	}
	for i := 0; i < 8; i++ {
		candidate := filepath.Join(dir, "config", filename)
		if _, err := os.Stat(candidate); err == nil {
			return candidate
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}
	return filepath.Join("config", filename)
}

func validateConfig(cfg config) {
	if cfg.APP.SESSIONSECRET == "" {
		panic("missing required config: app.session_secret")
	}
	if cfg.APP.JWT == "" {
		panic("missing required config: app.jwt_secret")
	}
	if cfg.DB.PASSWORD == "" {
		panic("missing required config: db.password")
	}
	if cfg.LICENSE.SECRET == "" {
		panic("missing required config: license.secret")
	}
}

type config struct {
	APP     APP     `toml:"app"`
	DB      DB      `toml:"db"`
	LICENSE LICENSE `toml:"license"`
}

type APP struct {
	PORT          string `toml:"port"`
	SESSIONSECRET string `toml:"session_secret"`
	JWT           string `toml:"jwt_secret"`
	BASEURL       string `toml:"baseurl"`
	DOMAIN        string `toml:"domain"`
}

type DB struct {
	NAME     string `toml:"user"`
	PASSWORD string `toml:"password"`
	HOST     string `toml:"host"`
	DB       string `toml:"name"`
	PORT     string `toml:"port"`
}

type LICENSE struct {
	PATH   string `toml:"path"`
	SECRET string `toml:"secret"`
}
