package siteLibaryControllersModules

import (
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/support/utils"
)

var SiteLibraryService = &siteLibraryService{}

type siteLibraryService struct{}

func (s siteLibraryService) AddGarden(garden types.Garden) error {
	if err := db.GormDB.Create(&garden).Error; err != nil {
		utils.Log.Error("服务层添加园区失败", "error", err, "garden", garden)
		return err
	}
	return nil
}
