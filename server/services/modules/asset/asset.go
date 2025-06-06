package assetServiceModules

import (
	"github.com/Xi-Yuer/cms/dto"
	commonResponsiesModules "github.com/Xi-Yuer/cms/dto/modules/common"
	repositories "github.com/Xi-Yuer/cms/repositories/modules"
)

var AssetService = &assetService{}

type assetService struct{}

func (a *assetService) AddAsset(asset dto.Asset) error {
	return repositories.AssetRepoModules.AddAsset(asset)
}

func (a *assetService) GetAssets(queryAssetParams dto.QueryAssetParams) (res *commonResponsiesModules.HasTotalResponseData, err error) {
	list, err := repositories.AssetRepoModules.GetAssets(queryAssetParams)
	if err != nil {
		return nil, err
	}
	res = &commonResponsiesModules.HasTotalResponseData{}
	res.List = list
	res.Total = len(list)
	return
}

func (a *assetService) DelAssets(ids []int64) error {
	return repositories.AssetRepoModules.DelAssets(ids)
}

func (a *assetService) UpdateAsset(asset dto.Asset) error {
	return repositories.AssetRepoModules.UpdateAsset(asset)
}
