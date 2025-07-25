package siteLibraryResponsiesModules

type Gardens struct {
	GardenId   int64 `gorm:"primaryKey;autoIncrement"` // 自增主键
	GardenName string
}
type Store struct {
	StoreId   int64 `gorm:"primaryKey;autoIncrement"` // 自增主键
	GardenId  int64
	StoreName string
}
type StoreMapVO struct {
	StoreId   int64  `json:"storeId"`
	StoreName string `json:"storeName"`
}

type QueryGardenParams struct {
	GardenName string `json:"gardenName"`
	Limit      int    `json:"limit"`
	Offset     int    `json:"offset"`
}
type QueryStoreParams struct {
	StoreName string `json:"storeName"`
	Limit     int    `json:"limit"`
	Offset    int    `json:"offset"`
}

type GardenVO struct {
	GardenId   int64  `json:"gardenId"`
	GardenName string `json:"gardenName"`
}

type StoreVO struct {
	StoreId    int64  `json:"storeId"`
	GardenId   int64  `json:"gardenId"`
	StoreName  string `json:"storeName"`
	GardenName string `json:"gardenName"`
}

type StoreDTO struct {
	StoreId   int64  `json:"storeId"`
	StoreName string `json:"storeName"`
	GardenId  int64  `json:"gardenId"`
}
