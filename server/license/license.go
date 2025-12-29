package license

import (
	"crypto/hmac"
	"crypto/md5"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net"
	"os"
	"sort"
	"strings"
	"time"
)

type License struct {
	Mac    string `json:"mac"`
	Expire string `json:"expire"`
	Sign   string `json:"sign"`
}

func GetMacAddr() string {
	macs := GetMacAddrs()
	if len(macs) > 0 {
		return macs[0]
	}
	return ""
}

func GetMacAddrs() []string {
	interfaces, _ := net.Interfaces()
	macs := collectMacs(interfaces, func(inter net.Interface) bool {
		return inter.Flags&net.FlagUp != 0 && inter.Flags&net.FlagLoopback == 0
	})
	if len(macs) == 0 {
		macs = collectMacs(interfaces, func(inter net.Interface) bool {
			return inter.HardwareAddr.String() != ""
		})
	}
	sort.Strings(macs)
	return macs
}

func GenSign(mac, expire, secret string) string {
	payload := normalizeMacListString(mac) + "|" + strings.TrimSpace(expire)
	h := hmac.New(sha256.New, []byte(secret))
	_, _ = h.Write([]byte(payload))
	return hex.EncodeToString(h.Sum(nil))
}

func legacySign(mac, expire, secret string) string {
	data := mac + expire + secret
	hash := md5.Sum([]byte(data))
	return hex.EncodeToString(hash[:])
}

// CheckLicense 校验授权文件，secret 只在你手里
func CheckLicense(licensePath, secret string) bool {
	if err := ValidateLicense(licensePath, secret); err != nil {
		fmt.Println(err.Error())
		return false
	}
	return true
}

func ValidateLicense(licensePath, secret string) error {
	data, err := os.ReadFile(licensePath)
	if err != nil {
		return fmt.Errorf("license read failed: %w", err)
	}
	var lic License
	if err := json.Unmarshal(data, &lic); err != nil {
		return fmt.Errorf("license json invalid: %w", err)
	}
	if err := verifySign(lic, secret); err != nil {
		return err
	}
	if err := verifyMac(lic); err != nil {
		return err
	}
	if err := verifyExpire(lic); err != nil {
		return err
	}
	return nil
}

func verifySign(lic License, secret string) error {
	if strings.TrimSpace(lic.Sign) == "" {
		return errors.New("license signature missing")
	}
	macCandidates := candidateMacStrings(lic.Mac)
	if len(macCandidates) == 0 {
		return errors.New("license mac missing")
	}
	expire := strings.TrimSpace(lic.Expire)
	for _, mac := range macCandidates {
		if lic.Sign == GenSign(mac, expire, secret) {
			return nil
		}
	}
	for _, mac := range macCandidates {
		if lic.Sign == legacySign(mac, expire, secret) {
			return nil
		}
	}
	return errors.New("license signature invalid")
}

func verifyMac(lic License) error {
	allowed := normalizeMacs(splitMacs(lic.Mac))
	if len(allowed) == 0 {
		return errors.New("license mac missing")
	}
	local := GetMacAddrs()
	if len(local) == 0 {
		return errors.New("local mac not found")
	}
	localSet := make(map[string]struct{}, len(local))
	for _, mac := range local {
		localSet[normalizeMac(mac)] = struct{}{}
	}
	for _, mac := range allowed {
		if _, ok := localSet[mac]; ok {
			return nil
		}
	}
	return errors.New("local mac not authorized")
}

func verifyExpire(lic License) error {
	expire := strings.TrimSpace(lic.Expire)
	if expire == "" {
		return errors.New("license expire missing")
	}
	expireTime, err := time.Parse(time.RFC3339, expire)
	if err != nil {
		expireTime, err = time.Parse(time.RFC3339Nano, expire)
		if err != nil {
			return errors.New("license expire invalid")
		}
	}
	if time.Now().After(expireTime) {
		return errors.New("license expired")
	}
	return nil
}

func normalizeMac(mac string) string {
	mac = strings.TrimSpace(strings.ToLower(mac))
	mac = strings.ReplaceAll(mac, "-", ":")
	return mac
}

func normalizeMacListString(raw string) string {
	parts := splitMacs(raw)
	if len(parts) == 0 {
		return normalizeMac(raw)
	}
	for i, part := range parts {
		parts[i] = normalizeMac(part)
	}
	return strings.Join(parts, ",")
}

func splitMacs(raw string) []string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil
	}
	return strings.FieldsFunc(raw, func(r rune) bool {
		switch r {
		case ',', ';', '|', ' ', '\t', '\n', '\r':
			return true
		default:
			return false
		}
	})
}

func normalizeMacs(list []string) []string {
	seen := make(map[string]struct{}, len(list))
	var macs []string
	for _, mac := range list {
		mac = normalizeMac(mac)
		if mac == "" || mac == "00:00:00:00:00:00" {
			continue
		}
		if _, ok := seen[mac]; ok {
			continue
		}
		seen[mac] = struct{}{}
		macs = append(macs, mac)
	}
	sort.Strings(macs)
	return macs
}

func collectMacs(interfaces []net.Interface, allow func(net.Interface) bool) []string {
	var macs []string
	for _, inter := range interfaces {
		if allow != nil && !allow(inter) {
			continue
		}
		mac := normalizeMac(inter.HardwareAddr.String())
		if mac == "" || mac == "00:00:00:00:00:00" {
			continue
		}
		macs = append(macs, mac)
	}
	return normalizeMacs(macs)
}

func candidateMacStrings(raw string) []string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil
	}
	normalized := normalizeMacListString(raw)
	if normalized == raw {
		return []string{raw}
	}
	return []string{raw, normalized}
}
