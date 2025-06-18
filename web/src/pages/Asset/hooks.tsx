import { Key, ReactNode, useEffect, useState } from 'react';
import { Button, Input, TableProps, Select, Modal } from 'antd';
import {
  createAssetRequest,
  deleteAssetRequest,
  getAssetRequest,
  IQueryAssetParams,
  IAssetResponse,
  IUpdateAssetParams,
  updateAssetRequest,
  getStoreMapRequest,
  StoreMap,
  assetTypeMap,
  statusMap,
  getTagMapRequest,
  TagMap,
} from './index.ts';
import { useTranslation } from 'react-i18next';
import { useSearchFrom } from '@/hooks/useSearchForm.tsx';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';

export const useAssetPageHooks = () => {
  const [formRef] = useForm();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Key[]>([]);
  const [list, setAsset] = useState<IAssetResponse[]>([]);
  const [currentEditAsset, setCurrentEditAsset] = useState<IAssetResponse>();
  const [isEdit, setIsEdit] = useState(false);
  const [editAssetModalOpen, setEditAssetModalOpen] = useState(false);
  const [storeMap, setStoreMap] = useState<StoreMap[]>([]);
  const [tagMap, setTagMap] = useState<TagMap[]>([]);
  const { t } = useTranslation();

  // 获取场库映射
  useEffect(() => {
    getStoreMapRequest().then((res) => {
      setStoreMap(res.data);
    });
  }, []);

  // 获取标签映射
  useEffect(() => {
    getTagMapRequest().then((res) => {
      setTagMap(res.data);
    });
  }, []);

  const searchConfig: { label: string; name: keyof IQueryAssetParams; component: ReactNode }[] = [
    {
      label: '资产编码',
      name: 'assetCode',
      component: <Input placeholder="请输入资产编码" allowClear />,
    },
    {
      label: '场库',
      name: 'storeId',
      component: (
        <Select placeholder="请选择场库" allowClear>
          {storeMap.map((store) => (
            <Select.Option key={store.storeId} value={store.storeId}>
              {store.storeName}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  const { SearchFormComponent } = useSearchFrom({
    getDataRequestFn: (values) => getPageData(values),
    onNewRecordFn: () => {
      setIsEdit(false);
      formRef.resetFields();
      setEditAssetModalOpen(true);
    },
    formItems: searchConfig,
    formName: 'roleSearchUserForm',
  });

  const getPageData = (values?: IAssetResponse) => {
    setLoading(true);
    getAssetRequest({ limit, offset: (page - 1) * limit, ...values } as IQueryAssetParams)
      .then((res) => {
        setAsset(res.data.list);
        setTotal(res.data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteAssetAction = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该资产吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        deleteAssetRequest([id]).then(() => getPageData());
      },
    });
  };

  const editAssetAction = async (row: IAssetResponse) => {
    setCurrentEditAsset(row);
    setIsEdit(true);
    setEditAssetModalOpen(true);
  };

  const onFinish = () => {
    formRef.validateFields().then((values) => {
      // 转换数据类型
      const params = {
        ...values,
        quantity: Number(values.quantity),
        tagId: Number(values.tagId),
      };

      // 编辑
      if (isEdit && currentEditAsset) {
        updateAssetRequest(currentEditAsset.assetId, { ...currentEditAsset, ...params } as IUpdateAssetParams).then(() => {
          setEditAssetModalOpen(false);
          formRef.resetFields();
          getPageData();
        });
      } else {
        // 新增
        createAssetRequest(params as IUpdateAssetParams).then(() => {
          setEditAssetModalOpen(false);
          formRef.resetFields();
          getPageData();
        });
      }
    });
  };

  const roleColumns: TableProps<IAssetResponse>['columns'] = [
    {
        title: '资产ID',
        dataIndex: 'assetId',
        key: 'assetId',
    },
    
    {
        title: '资产编码',
        dataIndex: 'assetCode',
        key: 'assetCode',
    },
    
    {
        title: '资产类型',
        dataIndex: 'assetType',
        key: 'assetType',
        render: (type: number) => assetTypeMap[type] || '-',
    },
    
    {
        title: '资产状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: number) => statusMap[status] || '-',
    },
    
    {
        title: '数量',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    
    {
        title: '标签编码',
        dataIndex: 'tagId',
        key: 'tagCode',
        render: (tagId: number) => {
          const tag = tagMap.find((t) => Number(t.id) === tagId);
          return tag?.tagCode || '未设置';
        },
    },
    
    {
        title: '场库名称',
        dataIndex: 'storeId',
        key: 'storeName',
        render: (storeId: number) => {
          const store = storeMap.find((s) => s.storeId === storeId);
          return store?.storeName || '未设置';
        },
    },
    
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    
    {
        title: '更新时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    
    {
      title: t('operate'),
      key: 'action',
      align: 'center',
      render: (_, row) => {
        return (
          <div className='gap-2 flex text-[#5bb4ef] items-center cursor-pointer justify-center'>
            <span onClick={() => editAssetAction(row)}>{t('edit')}</span>
            <span className='text-red-500' onClick={() => deleteAssetAction(row.assetId)}>
              {t('delete')}
            </span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (editAssetModalOpen && isEdit) {
      formRef.setFieldsValue(currentEditAsset);
    }
  }, [editAssetModalOpen]);

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
    editAssetModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditAssetModalOpen: (open: boolean) => {
      setEditAssetModalOpen(open);
      if (!open) {
        formRef.resetFields();
      }
    },
    onFinish,
    tagMap,
  };
};
