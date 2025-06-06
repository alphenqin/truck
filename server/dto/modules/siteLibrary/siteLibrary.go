package siteLibraryResponsiesModules

type Gardens struct {
	GardenId   uint `gorm:"primaryKey;autoIncrement"` // 自增主键
	GardenName string
}
type Store struct {
	StoreId   uint `gorm:"primaryKey;autoIncrement"` // 自增主键
	GardenId  uint
	StoreName string
}

type QueryGardenParams struct {
	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}
type QueryStoreParams struct {
	Limit  int `json:"limit"`
	Offset int `json:"offset"`
}

type GardenVO struct {
	GardenId   uint   `json:"gardenId"`
	GardenName string `json:"gardenName"`
}

type StoreVO struct {
	StoreId    uint   `json:"storeId"`
	GardenId   uint   `json:"gardenId"`
	StoreName  string `json:"storeName"`
	GardenName string `json:"gardenName"`
}

type StoreDTO struct {
	StoreId   uint   `json:"storeId"`
	StoreName string `json:"storeName"`
	GardenId  uint   `json:"gardenId"`
}
