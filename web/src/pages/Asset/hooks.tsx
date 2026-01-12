import { Key, ReactNode, useEffect, useState } from 'react';
import { Button, Input, TableProps, Select, Modal, message } from 'antd';
import {
  createAssetRequest,
  deleteAssetRequest,
  getAssetRequest,
  IQueryAssetParams,
  IAssetResponse,
  IUpdateAssetParams,
  IUpdateAssetStatusParams,
  updateAssetRequest,
  updateAssetStatus,
  getStoreMapRequest,
  StoreMap,
  statusMap,
  getTagMapRequest,
  TagMap,
  getAssetRepairRecordsRequest,
  IAssetRepairRecord,
} from './index.ts';
import { getAssetTypesRequest, IAssetTypesResponse } from '@/pages/base/type/index.ts';
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
  const [assetTypeOptions, setAssetTypeOptions] = useState<{ label: string; value: number }[]>([]);
  const [assetTypeLabelMap, setAssetTypeLabelMap] = useState<Record<number, string>>({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [repairModalOpen, setRepairModalOpen] = useState(false);
  const [repairAssetId, setRepairAssetId] = useState<number | null>(null);
  const [repairReason, setRepairReason] = useState<string>('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailAsset, setDetailAsset] = useState<IAssetResponse | null>(null);
  const [repairRecords, setRepairRecords] = useState<IAssetRepairRecord[]>([]);
  const [repairRecordsLoading, setRepairRecordsLoading] = useState(false);

  // 获取场库映射
  useEffect(() => {
    getStoreMapRequest().then((res) => {
      setStoreMap(res.data);
    });
  }, []);

  // 获取标签映射（用于详情展示）
  useEffect(() => {
    getTagMapRequest().then((res) => {
      setTagMap(res.data || []);
    });
  }, []);

  // 获取资产类型（从表里读）
  useEffect(() => {
    getAssetTypesRequest({ limit: 999, offset: 0 }).then((res) => {
      const list = (res.data?.list || []) as IAssetTypesResponse[];
      const options = list.map((item) => ({
        label: item.typeName,
        value: item.typeId,
      }));
      const map: Record<number, string> = {};
      list.forEach((item) => {
        map[item.typeId] = item.typeName;
      });
      setAssetTypeOptions(options);
      setAssetTypeLabelMap(map);
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
    setIsEdit(true);
    setCurrentEditAsset(undefined);
    formRef.resetFields();
    setEditAssetModalOpen(true);
    getAssetRequest({ limit: 1, offset: 0, assetId: row.assetId } as IQueryAssetParams)
      .then((res) => {
        const asset = res?.data?.list?.[0];
        if (asset) {
          setCurrentEditAsset(asset);
        } else {
          message.error('获取资产详情失败');
          setEditAssetModalOpen(false);
        }
      })
      .catch(() => {
        message.error('获取资产详情失败');
        setEditAssetModalOpen(false);
      });
  };

  const onFinish = () => {
    formRef.validateFields().then((values) => {
      // 转换数据类型
      const params = {
        ...values,
        quantity: Number(values.quantity),
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

  const handleUpdateStatus = async (assetId: number, status: number, reason?: string) => {
    setUpdateLoading(true);
    try {
      const params: IUpdateAssetStatusParams = {
        assetId,
        status,
        repairReason: reason,
      };
      const res: any = await updateAssetStatus(params);
      if (res?.code === 200 || res?.data?.code === 200) {
        message.success('资产状态更新成功！');
        getPageData();
      } else {
        message.error(`资产状态更新失败: ${res?.msg || res?.data?.msg || '未知错误'}`);
      }
    } catch (error) {
      message.error('更新资产状态失败。');
    } finally {
      setUpdateLoading(false);
    }
  };

  const openRepairModal = (assetId: number) => {
    setRepairAssetId(assetId);
    setRepairReason('');
    setRepairModalOpen(true);
    setRepairRecords([]);
    setRepairRecordsLoading(true);
    getAssetRepairRecordsRequest(assetId)
      .then((res) => {
        setRepairRecords(res.data.list || []);
      })
      .catch(() => {
        message.error('获取报修记录失败');
      })
      .finally(() => {
        setRepairRecordsLoading(false);
      });
  };

  const submitRepair = async () => {
    if (!repairAssetId) {
      return;
    }
    if (!repairReason) {
      message.error('请选择报修原因');
      return;
    }
    await handleUpdateStatus(repairAssetId, 3, repairReason);
    setRepairModalOpen(false);
  };

  const openDetailModal = (row: IAssetResponse) => {
    setDetailModalOpen(true);
    setDetailAsset(null);
    setRepairRecords([]);
    setRepairRecordsLoading(true);
    getAssetRequest({ limit: 1, offset: 0, assetId: row.assetId } as IQueryAssetParams)
      .then((res) => {
        const asset = res?.data?.list?.[0];
        if (asset) {
          setDetailAsset(asset);
        } else {
          message.error('获取资产详情失败');
        }
      })
      .catch(() => {
        message.error('获取资产详情失败');
      });
    getAssetRepairRecordsRequest(row.assetId)
      .then((res) => {
        setRepairRecords(res.data.list || []);
      })
      .catch(() => {
        message.error('获取报修记录失败');
      })
      .finally(() => {
        setRepairRecordsLoading(false);
      });
  };

  const roleColumns: TableProps<IAssetResponse>['columns'] = [
    {
        title: '资产编码',
        dataIndex: 'assetCode',
        key: 'assetCode',
    },
    
    {
        title: '资产类型',
        dataIndex: 'assetType',
        key: 'assetType',
        render: (type: number) => assetTypeLabelMap[type] || '-',
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
        title: '所在场库',
        dataIndex: 'storeId',
        key: 'storeName',
        render: (storeId: number) => {
          const store = storeMap.find((s) => s.storeId === storeId);
          return store?.storeName || '未设置';
        },
    },
    
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, row) => {
        return (
          <div className='gap-2 flex text-[#5bb4ef] items-center cursor-pointer justify-center'>
            <span onClick={() => openDetailModal(row)}>详情</span>
            <span onClick={() => editAssetAction(row)}>编辑</span>
            <span className='text-red-500' onClick={() => deleteAssetAction(row.assetId)}>
              删除
            </span>
            <span className='text-red-500' onClick={() => openRepairModal(row.assetId)}>
              报修
            </span>
            <span className='text-red-500' onClick={() => handleUpdateStatus(row.assetId, 5)}>
              报废
            </span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (editAssetModalOpen && isEdit && currentEditAsset) {
      formRef.setFieldsValue(currentEditAsset);
    }
  }, [editAssetModalOpen, isEdit, currentEditAsset]);

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
    repairModalOpen,
    setRepairModalOpen,
    repairReason,
    setRepairReason,
    submitRepair,
    updateLoading,
    detailModalOpen,
    detailAsset,
    storeMap,
    tagMap,
    assetTypeOptions,
    assetTypeLabelMap,
    repairRecords,
    repairRecordsLoading,
    setDetailModalOpen: (open: boolean) => {
      setDetailModalOpen(open);
      if (!open) {
        setDetailAsset(null);
        setRepairRecords([]);
      }
    },
  };
};
