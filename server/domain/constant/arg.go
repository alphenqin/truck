package constant

// BuiltinArg 内置业务参数定义。键名固定不可改、记录不可删，仅允许修改 arg_value。
type BuiltinArg struct {
	Key   string // arg_key
	Name  string // arg_name
	Value string // arg_value（默认值，仅首次播种写入）
}

// 疑似丢失时间（小时）：最新动作为出库且距今超过该时长 → status=7
const (
	ArgKeyLostTimeout = "lost_timeout"
	ArgNameLostTimeout = "疑似丢失时间(小时)"
)

// 呆滞时间（小时）：最新动作为入库且距今超过该时长 → status=6
const (
	ArgKeyIdleTimeout = "idle_timeout"
	ArgNameIdleTimeout = "呆滞时间(小时)"
)

// BuiltinArgs 内置业务参数清单，供启动播种与删除/改键保护共用。
var BuiltinArgs = []BuiltinArg{
	{Key: ArgKeyLostTimeout, Name: ArgNameLostTimeout, Value: "24"},
	{Key: ArgKeyIdleTimeout, Name: ArgNameIdleTimeout, Value: "168"},
}

// IsBuiltinArgKey 判断给定 arg_key 是否为内置参数键。
func IsBuiltinArgKey(key string) bool {
	for _, a := range BuiltinArgs {
		if a.Key == key {
			return true
		}
	}
	return false
}
