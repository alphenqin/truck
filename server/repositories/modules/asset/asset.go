package assetRepositorysModules

import (
	"github.com/Xi-Yuer/cms/db"
	"github.com/Xi-Yuer/cms/dto"
)

var AssetRepository = &assetRepository{}

type assetRepository struct{}

func (a *assetRepository) GetAssets(queryAssetParams dto.QueryAssetParams) ([]dto.AssetSingleResponse, error) {
	var assets []dto.AssetSingleResponse

	err := db.GormDB.
		Table("asset").
		Select("asset_id, asset_code, asset_type, status, created_at, updated_at").
		Offset(queryAssetParams.Offset).
		Limit(queryAssetParams.Limit).
		Scan(&assets).Error

	if err != nil {
		return nil, err
	}
	return assets, nil
}

func (a *assetRepository) DelAssets(ids []int64) error {
	return db.GormDB.Table("asset").Delete(&dto.Asset{}, ids).Error
}

func (a *assetRepository) AddAsset(asset dto.Asset) error {
	return db.GormDB.Table("asset").Create(&asset).Error
}

func (a *assetRepository) UpdateAsset(asset dto.Asset) error {
	return db.GormDB.Table("asset").Where("asset_id = ?", asset.AssetId).Updates(asset).Error
}
