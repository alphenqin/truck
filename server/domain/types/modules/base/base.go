package baseResponsiesModules

type Department struct {
	DepartmentId   int64  `gorm:"primaryKey;autoIncrement" json:"departmentId"`
	DepartmentName string `json:"departmentName"`
	StoreId        int64  `json:"storeId"`
	StoreName      string `json:"storeName"`
}

type QueryDepartmentsParams struct {
	DepartmentId   int64  `json:"departmentId"`
	DepartmentName string `json:"departmentName"`
	StoreId        int64  `json:"storeId"`
	StoreName      string `json:"storeName"`

	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}

type AssetType struct {
	TypeId   int64  `gorm:"primaryKey" json:"typeId"`
	TypeName string `json:"typeName"`
}

type QueryAssetTypesParams struct {
	TypeId   int64  `json:"typeId"`
	TypeName string `json:"typeName"`
	Limit    int    `json:"limit"`
	Offset   int    `json:"offset"`
}

type Line struct {
	LineId   int64  `gorm:"primaryKey;autoIncrement" json:"lineId"`
	LineName string `json:"lineName"`
}

type QueryLinesParams struct {
	LineId   int64  `json:"lineId"`
	LineName string `json:"lineName"`
	Limit    int    `json:"limit"`
	Offset   int    `json:"offset"`
}

type Arg struct {
	Id       int64  `gorm:"primaryKey;autoIncrement" json:"id"`
	ArgKey   string `json:"argKey"`
	ArgName  string `json:"argName"`
	ArgValue string `json:"argValue"`
}

type QueryArgsParams struct {
	ArgKey   string `json:"argKey"`
	ArgName  string `json:"argName"`
	ArgValue string `json:"argValue"`
	Limit    int    `json:"limit"`
	Offset   int    `json:"offset"`
}

type AlarmRule struct {
	Id        int64  `gorm:"primaryKey;autoIncrement" json:"id"`
	RuleName  string `json:"ruleName"`
	RuleKey   string `json:"ruleKey"`
	RuleValue string `json:"ruleValue"`
}

type QueryAlarmRulesParams struct {
	RuleName  string `json:"ruleName"`
	RuleKey   string `json:"ruleKey"`
	RuleValue string `json:"ruleValue"`
	Limit     int    `json:"limit"`
	Offset    int    `json:"offset"`
}
