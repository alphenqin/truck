import { Key, ReactNode, useEffect, useState } from 'react';
import { Button, Input, TableProps, Modal, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import {
  creategarendsRequest,
  deletegarendsRequest,
  exportgarendsRequest,
  getgarendsRequest,
  IQuerygarendsParams,
  IgarendsResponse,
  IUpdategarendsParams,
  updategarendsRequest,
} from './index.ts';
import { useSearchFrom } from '@/hooks/useSearchForm.tsx';
import { useForm } from 'antd/es/form/Form';

export const usegarendsPageHooks = () => {
  const [formRef] = useForm();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Key[]>([]);
  const [list, setgarends] = useState<IgarendsResponse[]>([]);
  const [currentEditgarends, setCurrentEditgarends] = useState<IgarendsResponse>();
  const [isEdit, setIsEdit] = useState(false);
  const [editgarendsModalOpen, setEditgarendsModalOpen] = useState(false);
  const searchConfig: { label: string; name: keyof IQuerygarendsParams; component: ReactNode }[] = [
    {
        label: '园区名称',
        name: 'gardenName',
        component: <Input allowClear />,
    },
  ];
  const { SearchFormComponent } = useSearchFrom({
    getDataRequestFn: (values) => getPageData(values),
    onNewRecordFn: () => {
      setIsEdit(false);
      formRef.resetFields();
      setEditgarendsModalOpen(true);
    },
    formItems: searchConfig,
    operateComponent: !!selected.length && (
      <Button type='primary' icon={<DownloadOutlined />} onClick={() => exportgarendsRequest(selected as number[])}>
        {'导出'}
      </Button>
    ),
    formName: 'roleSearchUserForm',
  });

  const getPageData = (values?: IgarendsResponse) => {
    setLoading(true);
    getgarendsRequest({ limit, offset: (page - 1) * limit, ...values } as IQuerygarendsParams)
      .then((res) => {
        console.log(res);
        setgarends(res.data.list);
        setTotal(res.data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deletegarendsAction = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该园区吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        deletegarendsRequest([id]).then(() => {
          message.success('删除成功');
          getPageData();
        });
      },
    });
  };

  const editgarendsAction = async (row: IgarendsResponse) => {
    setCurrentEditgarends(row);
    setIsEdit(true);
    setEditgarendsModalOpen(true);
  };

  const onFinish = () => {
    formRef.validateFields().then((values) => {
      // 编辑
      if (isEdit) {
        updategarendsRequest({ ...currentEditgarends, ...values } as IUpdategarendsParams).then(() => {
          setEditgarendsModalOpen(false);
          getPageData();
        });
      } else {
        // 新增
        creategarendsRequest(values).then(() => {
          setEditgarendsModalOpen(false);
          getPageData();
        });
      }
    });
  };

  const roleColumns: TableProps<IgarendsResponse>['columns'] = [
    {
      title: '园区ID',
      dataIndex: 'gardenId',
      key: 'gardenId',
      align: 'center',
    },
    
    {
        title: '园区名称',
        dataIndex: 'gardenName',
        key: 'gardenName',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, row) => {
        return (
          <div className='gap-2 flex text-[#5bb4ef] items-center cursor-pointer justify-center'>
            <span onClick={() => editgarendsAction(row)}>{'编辑'}</span>
            <span className='text-red-500' onClick={() => deletegarendsAction(row.gardenId)}>
              {'删除'}
            </span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (editgarendsModalOpen && isEdit) {
      formRef.setFieldsValue(currentEditgarends);
    }
  }, [editgarendsModalOpen]);

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
    editgarendsModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditgarendsModalOpen,
    onFinish,
  };
};
