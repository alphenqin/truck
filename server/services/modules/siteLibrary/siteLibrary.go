package siteLibraryServiceModules

import (
	"github.com/Xi-Yuer/cms/db"
	"github.com/Xi-Yuer/cms/dto"
)

var SiteLibraryService = &siteLibraryService{}

type siteLibraryService struct{}

func (s siteLibraryService) AddGarden(garden dto.Garden) error {
	return db.GormDB.Create(&garden).Error
}
