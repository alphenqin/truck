package db

import (
	"database/sql"
	"fmt"
	"github.com/Xi-Yuer/cms/config"
	"github.com/Xi-Yuer/cms/utils"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var (
	DB     *sql.DB  // database/sql 实例
	GormDB *gorm.DB // GORM 实例
)

func InitDB() error {
	// 构建 DSN
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/cms?charset=utf8mb4&parseTime=True&loc=Local",
		config.Config.DB.NAME,
		config.Config.DB.PASSWORD,
		config.Config.DB.HOST,
		config.Config.DB.PORT,
	)

	// 初始化 database/sql
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		utils.Log.Panic(err)
	}
	DB = db
	DB.SetMaxOpenConns(20)
	DB.SetMaxIdleConns(10)
	DB.SetConnMaxLifetime(time.Minute * 60)

	if err = DB.Ping(); err != nil {
		utils.Log.Panic(err)
		return err
	}

	utils.Log.Info("database/sql 数据库连接成功")

	// 使用已建立的 *sql.DB 实例初始化 GORM
	GormDB, err = gorm.Open(mysql.New(mysql.Config{
		Conn: DB,
	}), &gorm.Config{})

	if err != nil {
		utils.Log.Panic("GORM 初始化失败:", err)
		return err
	}

	utils.Log.Info("GORM 数据库连接成功")
	return nil
}
