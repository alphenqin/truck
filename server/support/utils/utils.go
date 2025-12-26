package utils

import (
	"github.com/Xi-Yuer/cms/support/utils/modules/bcrypt"
	"github.com/Xi-Yuer/cms/support/utils/modules/buildTree"
	"github.com/Xi-Yuer/cms/support/utils/modules/buildZip"
	"github.com/Xi-Yuer/cms/support/utils/modules/contain"
	"github.com/Xi-Yuer/cms/support/utils/modules/exportExcel"
	"github.com/Xi-Yuer/cms/support/utils/modules/file"
	"github.com/Xi-Yuer/cms/support/utils/modules/jwt"
	"github.com/Xi-Yuer/cms/support/utils/modules/response"
	"github.com/Xi-Yuer/cms/support/utils/modules/snowflake"
	"github.com/Xi-Yuer/cms/support/utils/modules/timeTask"
	"github.com/Xi-Yuer/cms/support/utils/modules/translator"
	"github.com/Xi-Yuer/cms/support/utils/modules/unique"
)

var Response = responseModules.Response
var GenID = snowflake.GenID
var Bcrypt = &bcrypt.Bcrypt{}
var Translator = translator.ValidatorTrans
var Trans = translator.Trans
var Jsonwebtoken = &jwt.Jsonwebtoken{}
var Unique = unique.RemoveDuplicatesAndEmpty
var BuildPages = buildTree.BuildMenu
var BuildDepartment = buildTree.BuildDepartment
var Contain = contain.StringInSlice
var ExportExcel = exportExcel.ExportExcel
var TimeTask = timeTask.TimeTask
var File = file.File
var CreateFilesAndZip = buildZip.CreateFilesAndZip
