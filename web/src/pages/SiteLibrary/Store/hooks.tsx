import { Key, ReactNode, useEffect, useState } from 'react';
import { Button, Input, TableProps, Modal, message, Select } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import {
  createStoreRequest,
  deleteStoreRequest,
  exportStoreRequest,
  getStoreRequest,
  IQueryStoreParams,
  IStoreResponse,
  IUpdateStoreParams,
  updateStoreRequest,
} from './index.ts';
import { getgarendsRequest, IgarendsResponse } from '@/pages/SiteLibrary/Garden/index.ts';
import { useSearchFrom } from '@/hooks/useSearchForm.tsx';
import { useForm } from 'antd/es/form/Form';

export const useStorePageHooks = () => {
  const [formRef] = useForm();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [list, setList] = useState<IStoreResponse[]>([]);
  const [currentEditStore, setCurrentEditStore] = useState<IStoreResponse>();
  const [isEdit, setIsEdit] = useState(false);
  const [editStoreModalOpen, setEditStoreModalOpen] = useState(false);
  const [gardens, setGardens] = useState<IgarendsResponse[]>([]);

  const searchConfig: { label: string; name: keyof IQueryStoreParams; component: ReactNode }[] = [
    {
      label: '场库名称',
      name: 'storeName',
      component: <Input allowClear />,
    },
  ];

  const { SearchFormComponent } = useSearchFrom({
    getDataRequestFn: (values) => getPageData(values),
    onNewRecordFn: () => {
      setIsEdit(false);
      formRef.resetFields(); // 新增时清空表单
      setEditStoreModalOpen(true);
    },
    formItems: searchConfig,
    operateComponent: selectedRowKeys.length > 0 && (
      <>
        <Button
          danger
          style={{ marginRight: 8 }}
          onClick={() => handleBatchDelete()}
        >
          批量删除
        </Button>
        <Button
          type='primary'
          icon={<DownloadOutlined />}
          onClick={() => exportStoreRequest(selectedRowKeys)}
        >
          导出
        </Button>
      </>
    ),
    formName: 'storeSearchForm',
  });

  useEffect(() => {
    getgarendsRequest({ limit: 1000, offset: 0 }).then((res) => {
      setGardens(res.data.list || []);
    });
  }, []);

  const getPageData = (values?: IQueryStoreParams) => {
    setLoading(true);
    getStoreRequest({ limit, offset: (page - 1) * limit, ...values } as IQueryStoreParams)
      .then((res) => {
        setList(res.data.list);
        setTotal(res.data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 批量删除
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除选中的场库吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await deleteStoreRequest(selectedRowKeys);
        message.success('删除成功');
        setSelectedRowKeys([]);
        getPageData();
      },
    });
  };

  // 单条删除
  const handleSingleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该场库吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await deleteStoreRequest([id]);
        message.success('删除成功');
        getPageData();
      },
    });
  };

  const editStoreAction = async (row: IStoreResponse) => {
    setCurrentEditStore(row);
    setIsEdit(true);
    setEditStoreModalOpen(true);
    formRef.setFieldsValue(row);
  };

  const onFinish = () => {
    formRef.validateFields().then((values) => {
      if (isEdit && currentEditStore) {
        updateStoreRequest({
          ...values,
          storeId: currentEditStore.storeId,
        }).then(() => {
          setEditStoreModalOpen(false);
          getPageData();
        });
      } else {
        createStoreRequest(values).then(() => {
          setEditStoreModalOpen(false);
          getPageData();
        });
      }
    });
  };

  const columns: TableProps<IStoreResponse>['columns'] = [
    {
      title: '场库名称',
      dataIndex: 'storeName',
      key: 'storeName',
    },
    {
      title: '园区名称',
      dataIndex: 'gardenId',
      key: 'gardenName',
      render: (gardenId?: number) => {
        const garden = gardens.find((item) => item.gardenId === gardenId);
        return garden?.gardenName || '-';
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, row) => (
        <div className='gap-2 flex text-[#5bb4ef] items-center cursor-pointer justify-center'>
          <span onClick={() => editStoreAction(row)}>{'编辑'}</span>
          <span className='text-red-500' onClick={() => handleSingleDelete(row.storeId)}>{'删除'}</span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getPageData();
  }, [limit, page]);

  return {
    list,
    columns,
    SearchFormComponent,
    total,
    limit,
    loading,
    isEdit,
    formRef,
    editStoreModalOpen,
    setPage,
    setLimit,
    setSelectedRowKeys,
    selectedRowKeys,
    setEditStoreModalOpen,
    onFinish,
    gardens,
  };
};
