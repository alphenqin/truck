import { Key, ReactNode, useEffect, useState, useCallback } from 'react';
import { Button, Input, Select, TableProps, Modal, message } from 'antd';
import { DownloadOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  createAssetRequest,
  exportAssetRequest,
  getAssetRequest,
  IQueryAssetParams,
  IAssetResponse,
  ICreateUpdateAssetParams,
  updateAssetRequest,
  deleteAssetRequest,
  assetTypeMap,
  statusMap,
} from './index';
import { useSearchFrom } from '@/hooks/useSearchForm';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';

export const useAssetPageHooks = () => {
  const [formRef] = useForm();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [list, setAsset] = useState<IAssetResponse[]>([]);
  const [currentEditAsset, setCurrentEditAsset] = useState<IAssetResponse | undefined>();
  const [isEdit, setIsEdit] = useState(false);
  const [editAssetModalOpen, setEditAssetModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<Partial<IQueryAssetParams>>({});

  // Define queryInfo state explicitly
  const [queryInfo, setQueryInfo] = useState<IQueryAssetParams>({
    limit: limit,
    offset: (page - 1) * limit,
    ...searchParams
  });

  const assetTypeOptions = Object.entries(assetTypeMap).map(([value, label]) => ({
    label,
    value: parseInt(value, 10),
  }));

  const statusOptions = Object.entries(statusMap).map(([value, label]) => ({
    label,
    value: parseInt(value, 10),
  }));

  const searchConfig: {
    label: string;
    name: keyof IQueryAssetParams;
    component: ReactNode;
  }[] = [
    { label: '资产ID', name: 'assetId', component: <Input placeholder="请输入资产ID" allowClear /> },
    { label: '资产编码', name: 'assetCode', component: <Input placeholder="请输入资产编码" allowClear /> },
    { label: '资产类型', name: 'assetType', component: <Select placeholder="请选择资产类型" allowClear options={assetTypeOptions} /> },
    { label: '资产状态', name: 'status', component: <Select placeholder="请选择状态" allowClear options={statusOptions} /> },
    { label: '仓库ID', name: 'storeId', component: <Input placeholder="请输入仓库ID" allowClear /> },
    { label: '部门ID', name: 'departmentId', component: <Input placeholder="请输入部门ID" allowClear /> },
    { label: '园区ID', name: 'gardenId', component: <Input placeholder="请输入园区ID" allowClear /> },
  ];

  const getPageData = useCallback(async (values?: Partial<IQueryAssetParams>) => {
    setLoading(true);
    try {
      const params = {
        limit,
        offset: (page - 1) * limit,
        ...searchParams,
        ...values,
      };
      const res = await getAssetRequest(params as IQueryAssetParams);
      if (res.data) {
        setAsset(res.data.list);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error('获取资产数据失败:', error);
      message.error('获取资产数据失败');
    } finally {
      setLoading(false);
    }
  }, [limit, page, searchParams]);

  const handleSearch = (values: Partial<IQueryAssetParams>) => {
    setSearchParams(values);
    setPage(1);
  };

  const batchDeleteAssets = async (ids: number[]) => {
    if (!ids.length) return;

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的${ids.length}个资产吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteAssetRequest(ids);
          message.success('删除成功');
          setSelectedRowKeys([]);
          getPageData();
        } catch (e) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleSingleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该资产吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteAssetRequest([id]);
          message.success('删除成功');
          getPageData(); // Refresh data after single delete
        } catch (e) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleExport = async () => {
    if (!selectedRowKeys.length) {
      message.warning('请选择要导出的资产');
      return;
    }
    try {
      const res = await exportAssetRequest(selectedRowKeys as number[]);
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assets_export_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
      console.error('导出失败:', error);
    }
  };

  const editAssetAction = (row: IAssetResponse) => {
    setCurrentEditAsset(row);
    setIsEdit(true);
    setEditAssetModalOpen(true);
    formRef.setFieldsValue({
      assetCode: row.assetCode,
      assetType: row.assetType,
      status: row.status,
      storeId: row.storeId,
      departmentId: row.departmentId,
      gardenId: row.gardenId,
    });
  };

  const onFinish = async () => {
    try {
      const values: ICreateUpdateAssetParams = await formRef.validateFields();
      setLoading(true);

      // Convert string IDs to numbers
      const numericValues = {
        ...values,
        storeId: parseInt(values.storeId as any, 10),
        departmentId: parseInt(values.departmentId as any, 10),
        gardenId: parseInt(values.gardenId as any, 10),
      };

      if (isEdit && currentEditAsset) {
        await updateAssetRequest(currentEditAsset.assetId, numericValues);
        message.success('更新资产成功');
      } else {
        await createAssetRequest(numericValues);
        message.success('创建资产成功');
      }
      setEditAssetModalOpen(false);
      formRef.resetFields();
      getPageData();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: TableProps<IAssetResponse>['columns'] = [
    { title: '资产ID', dataIndex: 'assetId', key: 'assetId' },
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode' },
    { title: '资产类型', dataIndex: 'assetType', key: 'assetType', render: (text: number) => assetTypeMap[text] || '-' },
    { title: '资产状态', dataIndex: 'status', key: 'status', render: (text: number) => statusMap[text] || '-' },
    { title: '仓库ID', dataIndex: 'storeId', key: 'storeId' },
    { title: '部门ID', dataIndex: 'departmentId', key: 'departmentId' },
    { title: '园区ID', dataIndex: 'gardenId', key: 'gardenId' },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-' },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-' },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, row) => (
        <div className='gap-2 flex text-[#5bb4ef] items-center cursor-pointer justify-center'>
          <span onClick={() => handleSingleDelete(row.assetId)} style={{ color: 'red' }}>{'删除'}</span>
          <span onClick={() => editAssetAction(row)}>{'编辑'}</span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getPageData();
  }, [limit, page, getPageData]);

  const { SearchFormComponent } = useSearchFrom<IQueryAssetParams>({
    getDataRequestFn: handleSearch,
    onNewRecordFn: () => {
      setIsEdit(false);
      formRef.resetFields();
      setEditAssetModalOpen(true);
    },
    formItems: searchConfig,
    operateComponent: selectedRowKeys.length > 0 ? (
      <>
        <Button
          type='primary'
          icon={<DownloadOutlined />}
          onClick={handleExport}
        >
          {'导出'}
        </Button>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => {
            setIsEdit(false);
            formRef.resetFields();
            setEditAssetModalOpen(true);
          }}
        >
          {'新增'}
        </Button>
      </>
    ) : (
      <Button
        type='primary'
        icon={<PlusOutlined />}
        onClick={() => {
          setIsEdit(false);
          formRef.resetFields();
          setEditAssetModalOpen(true);
        }}
      >
        {'新增'}
      </Button>
    ),
    formName: 'assetSearchForm',
    showAddBtn: false,
  });

  return {
    list,
    columns,
    SearchFormComponent,
    total,
    limit,
    loading,
    isEdit,
    formRef,
    editAssetModalOpen,
    setPage,
    setLimit,
    setSelectedRowKeys,
    selectedRowKeys,
    setEditAssetModalOpen,
    onFinish,
    batchDeleteAssets,
    handleExport,
    handleSearch,
    queryInfo,
    editAssetAction,
    handleSingleDelete,
  };
};
