package license

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net"
	"os"
	"time"
)

type License struct {
	Mac    string `json:"mac"`
	Expire string `json:"expire"`
	Sign   string `json:"sign"`
}

func GetMacAddr() string {
	interfaces, _ := net.Interfaces()
	for _, inter := range interfaces {
		mac := inter.HardwareAddr.String()
		if mac != "" {
			return mac
		}
	}
	return ""
}

func GenSign(mac, expire, secret string) string {
	data := mac + expire + secret
	hash := md5.Sum([]byte(data))
	return hex.EncodeToString(hash[:])
}

// CheckLicense 校验授权文件，secret 只在你手里
func CheckLicense(licensePath, secret string) bool {
	data, err := os.ReadFile(licensePath)
	if err != nil {
		fmt.Println("无法读取授权文件:", err)
		return false
	}
	var lic License
	if err := json.Unmarshal(data, &lic); err != nil {
		fmt.Println("授权文件格式错误:", err)
		return false
	}
	// 校验签名
	if lic.Sign != GenSign(lic.Mac, lic.Expire, secret) {
		fmt.Println("授权文件签名无效")
		return false
	}
	// 校验MAC
	localMac := GetMacAddr()
	if localMac != lic.Mac {
		fmt.Println("本机未授权")
		return false
	}
	// 校验时间
	expireTime, err := time.Parse(time.RFC3339, lic.Expire)
	if err != nil {
		fmt.Println("到期时间格式错误")
		return false
	}
	if time.Now().After(expireTime) {
		fmt.Println("授权已过期")
		return false
	}
	return true
}
