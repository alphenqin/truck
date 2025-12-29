package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"time"

	"github.com/Xi-Yuer/cms/license"
)

func main() {
	mac := flag.String("mac", "", "目标机器MAC地址（支持逗号分隔）")
	days := flag.Int("days", 30, "试用天数")
	secret := flag.String("secret", "", "签名密钥（必填，需与服务端一致）")
	flag.Parse()
	if *mac == "" {
		fmt.Println("请指定 --mac 参数")
		return
	}
	if *secret == "" {
		fmt.Println("请指定 --secret 参数")
		return
	}
	expire := time.Now().Add(time.Duration(*days) * 24 * time.Hour).UTC().Format(time.RFC3339)
	sign := license.GenSign(*mac, expire, *secret)
	lic := license.License{
		Mac:    *mac,
		Expire: expire,
		Sign:   sign,
	}
	data, _ := json.MarshalIndent(lic, "", "  ")
	os.WriteFile("license.json", data, 0644)
	fmt.Println("授权文件已生成: license.json")
}
