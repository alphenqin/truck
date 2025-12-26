import { Key, ReactNode, useEffect, useState } from 'react';
import { Button, Input, Modal, TableProps, InputNumber } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import {
  createBuzzersRequest,
  deleteBuzzersRequest,
  exportBuzzersRequest,
  getBuzzersRequest,
  IQueryBuzzersParams,
  IBuzzersResponse,
  IUpdateBuzzersParams,
  updateBuzzersRequest,
  IHasTotalResponse,
} from '@/service/api/ioRecord/index';
import { useSearchFrom } from '@/hooks/useSearchForm.tsx';
import { useForm } from 'antd/es/form/Form';
import { AxiosResponse } from 'axios';

export const useBuzzersPageHooks = () => {
  const [formRef] = useForm();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [list, setBuzzers] = useState<IBuzzersResponse[]>([]);
  const [currentEditBuzzers, setCurrentEditBuzzers] = useState<IBuzzersResponse>();
  const [isEdit, setIsEdit] = useState(false);
  const [editBuzzersModalOpen, setEditBuzzersModalOpen] = useState(false);

  const searchConfig: { label: string; name: keyof IQueryBuzzersParams; component: ReactNode }[] = [
    {
        label: '蜂鸣器规则',
        name: 'buzzerRule',
        component: <Input allowClear />,
    },
  ];

  const { SearchFormComponent } = useSearchFrom({
    getDataRequestFn: (values) => getPageData(values),
    onNewRecordFn: () => {
      setIsEdit(false);
      setEditBuzzersModalOpen(true);
      formRef.resetFields();
    },
    formItems: searchConfig,
    operateComponent: !!selected.length && (
      <Button type='primary' icon={<DownloadOutlined />} onClick={() => exportBuzzersRequest(selected)}>
        导出
      </Button>
    ),
    formName: 'buzzerSearchForm',
  });

  const getPageData = (values?: IQueryBuzzersParams) => {
    setLoading(true);
    getBuzzersRequest({ limit, offset: (page - 1) * limit, ...values })
      .then((res: AxiosResponse<IHasTotalResponse<IBuzzersResponse[]>>) => {
        setBuzzers(res.data.list);
        setTotal(res.data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteBuzzersAction = (ids: number[]) => {
    Modal.confirm({
      title: '确认删除',
      content: ids.length > 1 ? '确定要删除选中的规则吗？' : '确定要删除该规则吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        deleteBuzzersRequest(ids).then(() => getPageData());
      },
    });
  };

  const editBuzzersAction = async (row: IBuzzersResponse) => {
    setCurrentEditBuzzers(row);
    setIsEdit(true);
    setEditBuzzersModalOpen(true);
    formRef.setFieldsValue(row);
  };

  const onFinish = () => {
    formRef.validateFields().then((values: IBuzzersResponse) => {
      if (isEdit && currentEditBuzzers) {
        const updateParams: IUpdateBuzzersParams = { buzzerId: currentEditBuzzers.buzzerId, buzzerRule: values.buzzerRule };
        updateBuzzersRequest(updateParams).then(() => {
          setEditBuzzersModalOpen(false);
          getPageData();
        });
      } else {
        const createParams: Omit<IBuzzersResponse, 'buzzerId'> = { buzzerRule: values.buzzerRule };
        createBuzzersRequest(createParams).then(() => {
          setEditBuzzersModalOpen(false);
          getPageData();
        });
      }
    });
  };

  const roleColumns: TableProps<IBuzzersResponse>['columns'] = [
    {
        title: '蜂鸣器ID',
        dataIndex: 'buzzerId',
        key: 'buzzerId',
    },
    {
        title: '蜂鸣器规则',
        dataIndex: 'buzzerRule',
        key: 'buzzerRule',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, row) => {
        return (
          <div className='gap-2 flex text-[#5bb4ef] items-center cursor-pointer justify-center'>
            <span onClick={() => editBuzzersAction(row)}>编辑</span>
            <span className='text-red-500' onClick={() => deleteBuzzersAction([row.buzzerId])}>
              删除
            </span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    // No need for this effect anymore as formRef.setFieldsValue is called in editBuzzersAction
  }, [editBuzzersModalOpen]);

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
    editBuzzersModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditBuzzersModalOpen,
    onFinish,
  };
};
