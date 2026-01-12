import { ReactNode, useEffect, useState } from 'react';
import { Button, Form, Input, Modal, TableProps, message } from 'antd';
import { useSearchFrom } from '@/hooks/useSearchForm.tsx';
import { createAssetBindRequest, deleteAssetBindRequest, getAssetBindRequest, IAssetBindResponse, IQueryAssetBindParams, batchDeleteAssetBindRequest, updateAssetBindRequest } from '@/service/api/assetBind';

export const useAssetBindPageHooks = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<IAssetBindResponse[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingRow, setEditingRow] = useState<IAssetBindResponse | null>(null);
  const [formRef] = Form.useForm();
  const [editFormRef] = Form.useForm();

  const searchConfig: { label: string; name: keyof IQueryAssetBindParams; component: ReactNode }[] = [
    {
      label: '资产编码',
      name: 'assetCode',
      component: <Input placeholder="请输入资产编码" allowClear />,
    },
    {
      label: '标签编码',
      name: 'tagCode',
      component: <Input placeholder="请输入标签编码" allowClear />,
    },
  ];

  const getPageData = (values?: IQueryAssetBindParams) => {
    setLoading(true);
    getAssetBindRequest({ limit, offset: (page - 1) * limit, ...values } as IQueryAssetBindParams)
      .then((res) => {
        setList(res.data.list);
        setTotal(res.data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const openCreate = () => {
    formRef.resetFields();
    setCreateOpen(true);
  };

  const handleCreate = () => {
    formRef.validateFields().then((values) => {
      setCreateLoading(true);
      createAssetBindRequest(values)
        .then(() => {
          message.success('绑定成功');
          setCreateOpen(false);
          getPageData();
        })
        .finally(() => {
          setCreateLoading(false);
        });
    });
  };

  const openEdit = (row: IAssetBindResponse) => {
    setEditingRow(row);
    editFormRef.setFieldsValue({
      assetCode: row.assetCode,
      tagCode: row.tagCode,
    });
    setEditOpen(true);
  };

  const handleEdit = () => {
    if (!editingRow) return;
    editFormRef.validateFields().then((values) => {
      setEditLoading(true);
      updateAssetBindRequest(editingRow.id, values)
        .then(() => {
          message.success('已更新');
          setEditOpen(false);
          setEditingRow(null);
          getPageData();
        })
        .finally(() => {
          setEditLoading(false);
        });
    });
  };

  const handleDelete = (row: IAssetBindResponse) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该绑定关系吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        deleteAssetBindRequest(row.id).then(() => {
          message.success('已删除');
          getPageData();
        });
      },
    });
  };

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的记录');
      return;
    }
    Modal.confirm({
      title: '确认删除',
      content: '确定要批量删除选中的绑定关系吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        batchDeleteAssetBindRequest(selectedRowKeys as number[]).then(() => {
          message.success('已删除');
          setSelectedRowKeys([]);
          getPageData();
        });
      },
    });
  };

  const columns: TableProps<IAssetBindResponse>['columns'] = [
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode' },
    { title: '标签编码', dataIndex: 'tagCode', key: 'tagCode' },
    {
      title: '操作',
      key: 'action',
      render: (_, row) => (
        <div className='flex gap-3'>
          <span className='text-[#5bb4ef] cursor-pointer' onClick={() => openEdit(row)}>
            编辑
          </span>
          <span className='text-red-500 cursor-pointer' onClick={() => handleDelete(row)}>
            删除
          </span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getPageData();
  }, [limit, page]);

  const { SearchFormComponent } = useSearchFrom({
    getDataRequestFn: (values) => getPageData(values),
    onNewRecordFn: () => {},
    formItems: searchConfig,
    formName: 'assetBindSearchForm',
    showAddBtn: false,
    actionSize: 'small',
    actionWrap: true,
    actionWrapperClassName: 'flex-wrap md:flex-nowrap items-center',
    actionButtonClassName: 'h-8 md:h-10 text-xs md:text-sm px-3 md:px-4',
    containerClassName: 'p-3 pt-4 mb-3',
    operateComponent: (
      <div className='flex gap-2 items-center flex-wrap md:flex-nowrap'>
        <Button type='primary' onClick={openCreate} size='small' className='h-8 md:h-10 text-xs md:text-sm px-3 md:px-4'>新增</Button>
        <Button size='small' className='h-8 md:h-10 text-xs md:text-sm px-3 md:px-4'>导入</Button>
        <Button type='link' size='small' className='h-8 md:h-10 text-xs md:text-sm px-3 md:px-4'>模板下载</Button>
        <Button danger onClick={handleBatchDelete} size='small' className='h-8 md:h-10 text-xs md:text-sm px-3 md:px-4'>批量删除</Button>
      </div>
    ),
  });

  return {
    list,
    columns,
    SearchFormComponent,
    total,
    limit,
    loading,
    setPage,
    setLimit,
    openCreate,
    createOpen,
    setCreateOpen,
    handleCreate,
    createLoading,
    formRef,
    editOpen,
    setEditOpen,
    handleEdit,
    editLoading,
    editFormRef,
    selectedRowKeys,
    setSelectedRowKeys,
    handleBatchDelete,
  };
};
