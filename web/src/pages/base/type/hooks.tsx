import { Key, ReactNode, useEffect, useState } from 'react';
import { Button, Input, TableProps } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import {
  createAssetTypesRequest,
  deleteAssetTypesRequest,
  exportAssetTypesRequest,
  getAssetTypesRequest,
  IQueryAssetTypesParams,
  IAssetTypesResponse,
  IUpdateAssetTypesParams,
  updateAssetTypesRequest,
} from './index.ts';
import { useSearchFrom } from '@/hooks/useSearchForm.tsx';
import { useForm } from 'antd/es/form/Form';

export const useAssetTypesPageHooks = () => {
  const [formRef] = useForm();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Key[]>([]);
  const [list, setAssetTypes] = useState<IAssetTypesResponse[]>([]);
  const [currentEditAssetTypes, setCurrentEditAssetTypes] = useState<IAssetTypesResponse>();
  const [isEdit, setIsEdit] = useState(false);
  const [editAssetTypesModalOpen, setEditAssetTypesModalOpen] = useState(false);
  const searchConfig: { label: string; name: keyof IQueryAssetTypesParams; component: ReactNode }[] = [
    {
      label: '类型ID',
        name: 'typeId',
      component: <Input type="number" allowClear min={1} />,
    },
    {
      label: '类型名称',
        name: 'typeName',
        component: <Input allowClear />,
    },
  ];
  const { SearchFormComponent } = useSearchFrom({
    getDataRequestFn: (values) => getPageData(values),
    onNewRecordFn: () => {
      setIsEdit(false);
      setEditAssetTypesModalOpen(true);
      formRef.resetFields();
    },
    formItems: searchConfig,
    operateComponent: !!selected.length && (
      <Button type='primary' icon={<DownloadOutlined />} onClick={() => exportAssetTypesRequest(selected.map(key => Number(key)))}>
        导出
      </Button>
    ),
    formName: 'roleSearchUserForm',
  });

  const getPageData = (values?: IAssetTypesResponse) => {
    setLoading(true);
    const params = {
      limit,
      offset: (page - 1) * limit,
      ...values,
    } as IQueryAssetTypesParams;
    
    // Convert typeId to number if it exists
    if (params.typeId) {
      params.typeId = Number(params.typeId);
    }
    
    getAssetTypesRequest(params)
      .then((res) => {
        setAssetTypes(res.data.list);
        setTotal(res.data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteAssetTypesAction = (id: number) => {
    deleteAssetTypesRequest([id]).then(() => getPageData());
  };

  const editAssetTypesAction = async (row: IAssetTypesResponse) => {
    setCurrentEditAssetTypes(row);
    setIsEdit(true);
    setEditAssetTypesModalOpen(true);
  };

  const onFinish = () => {
    formRef.validateFields().then((values) => {
      // 编辑
      if (isEdit) {
        updateAssetTypesRequest(currentEditAssetTypes!.typeId, values as IUpdateAssetTypesParams).then(() => {
          setEditAssetTypesModalOpen(false);
          getPageData();
        });
      } else {
        // 新增
        if (!values.typeId) {
          formRef.setFields([{
            name: 'typeId',
            errors: ['请输入类型ID']
          }]);
          return;
        }
        // 确保typeId是数字类型
        const params = {
          ...values,
          typeId: Number(values.typeId)
        } as IUpdateAssetTypesParams;
        createAssetTypesRequest(params).then(() => {
          setEditAssetTypesModalOpen(false);
          getPageData();
        });
      }
    });
  };

  const roleColumns: TableProps<IAssetTypesResponse>['columns'] = [
    {
        title: '类型ID',
        dataIndex: 'typeId',
        key: 'typeId',
    },
    
    {
        title: '类型名称',
        dataIndex: 'typeName',
        key: 'typeName',
    },
    
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, row) => {
        return (
          <div className='gap-2 flex text-[#5bb4ef] items-center cursor-pointer justify-center'>
            <span onClick={() => editAssetTypesAction(row)}>编辑</span>
            <span className='text-red-500' onClick={() => deleteAssetTypesAction(row.typeId)}>
              删除
            </span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (editAssetTypesModalOpen && isEdit) {
      formRef.setFieldsValue(currentEditAssetTypes);
    }
  }, [editAssetTypesModalOpen]);

  useEffect(() => {
    getPageData();
  }, [limit, page]);

  return {
    list,
    roleColumns,
    SearchFormComponent,
    total,
    limit,
    loading,
    isEdit,
    formRef,
    editAssetTypesModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditAssetTypesModalOpen,
    onFinish,
  };
};
