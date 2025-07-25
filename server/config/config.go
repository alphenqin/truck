package config

var Config = config{
	APP: APP{
		PORT:          ":8081",
		SESSIONSECRET: "FUCNdjYGFg4G",
		JWT:           "P8BkI2OpBkY",
		SWAGPATH:      "http://localhost:8081/swagger/docs/index.html#/example",
		BASEURL:       "/cms",
		FILEPATH:      "./uploadFile/",
		DOMAIN:        "localhost",
	},
	DB: DB{
		NAME:     "root",
		PASSWORD: "123456",
		HOST:     "localhost",
		DB:       "cms",
		PORT:     "3306",
	},
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
}
type DB struct {
	NAME     string
	PASSWORD string
	HOST     string
	DB       string
	PORT     string
}
