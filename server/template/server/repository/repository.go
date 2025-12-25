package TableNameRepository

import (
	"github.com/Xi-Yuer/cms/infra/db"
	"github.com/Xi-Yuer/cms/template/server/dto"
	"log"
)

func NewTableNameRepository() RepositoryInterface {
	return &repository{}
}

type RepositoryInterface interface {
	GetTableNameListRepo(params *TableNameTypes.TableNameFindRequestDTO) ([]*TableNameTypes.TableNameFindRequestDTO, error)
	CreateTableNameRecordRepo(params *TableNameTypes.TableNameCreateRequestDTO) error
	UpdateTableNameRecordRepo(id string, params *TableNameTypes.TableNameUpdateRequestDTO) error
	DeleteTableNameRecordRepo(id string) error
}

type repository struct{}

func (r *repository) GetTableNameListRepo(params *TableNameTypes.TableNameFindRequestDTO) ([]*TableNameTypes.TableNameFindRequestDTO, error) {
	querySQL := "SELECT * FROM TableName LIMIT ?,?"
	rows, err := db.DB.Query(querySQL, params.Limit, params.Offset)
	if err != nil {
		return nil, err
	}
	var tableNameList []*TableNameTypes.TableNameFindRequestDTO
	for rows.Next() {
		var params TableNameTypes.TableNameFindRequestDTO
		if err := rows.Scan(&params.Name, &params.Age); err != nil {
			log.Fatal(err)
		}
		tableNameList = append(tableNameList, &params)
	}
	return tableNameList, nil
}

func (r *repository) CreateTableNameRecordRepo(params *TableNameTypes.TableNameCreateRequestDTO) error {
	querySQL := "INSERT INTO TableName (Name,Age) VALUES (?,?)"
	if _, err := db.DB.Exec(querySQL, params.Name, params.Age); err != nil {
		return err
	}
	return nil
}

func (r *repository) UpdateTableNameRecordRepo(id string, params *TableNameTypes.TableNameUpdateRequestDTO) error {
	querySQL := "UPDATE TableName SET Name=?,Age=? WHERE id=?"
	if _, err := db.DB.Exec(querySQL, params.Name, params.Age); err != nil {
		return err
	}
	return nil
}

func (r *repository) DeleteTableNameRecordRepo(id string) error {
	querySQL := "DELETE FROM TableName WHERE id=?"
	if _, err := db.DB.Exec(querySQL, id); err != nil {
		return err
	}
	return nil
}
