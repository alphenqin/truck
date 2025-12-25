package siteLibaryControllersModules

import (
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/infra/db"
)

var SiteLibraryService = &siteLibraryService{}

type siteLibraryService struct{}

func (s siteLibraryService) AddGarden(garden types.Garden) error {
	return db.GormDB.Create(&garden).Error
}
