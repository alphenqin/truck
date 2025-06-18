import { Key, ReactNode, useEffect, useState } from 'react';
import { Button, Input, TableProps, Modal } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import {
  createArgsRequest,
  deleteArgsRequest,
  exportArgsRequest,
  getArgsRequest,
  IQueryArgsParams,
  IArgsResponse,
  IUpdateArgsParams,
  updateArgsRequest,
} from './index.ts';
import { useTranslation } from 'react-i18next';
import { useSearchFrom } from '@/hooks/useSearchForm.tsx';
import { useForm } from 'antd/es/form/Form';

export const useArgsPageHooks = () => {
  const [formRef] = useForm();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Key[]>([]);
  const [list, setArgs] = useState<IArgsResponse[]>([]);
  const [currentEditArgs, setCurrentEditArgs] = useState<IArgsResponse>();
  const [isEdit, setIsEdit] = useState(false);
  const [editArgsModalOpen, setEditArgsModalOpen] = useState(false);
  const { t } = useTranslation();
  const searchConfig: { label: string; name: keyof IQueryArgsParams; component: ReactNode }[] = [
    {
      label: '参数键',
      name: 'argKey',
      component: <Input allowClear />,
    },
    {
      label: '参数名称',
      name: 'argName',
        component: <Input allowClear />,
    },
    {
      label: '参数值',
      name: 'argValue',
        component: <Input allowClear />,
    },
  ];
  const { SearchFormComponent } = useSearchFrom({
    getDataRequestFn: (values) => getPageData(values),
    onNewRecordFn: () => {
      formRef.resetFields();
      setIsEdit(false);
      setEditArgsModalOpen(true);
    },
    formItems: searchConfig,
    operateComponent: !!selected.length && (
      <Button type='primary' icon={<DownloadOutlined />} onClick={() => exportArgsRequest(selected.map(Number))}>
        {t('export')}
      </Button>
    ),
    formName: 'roleSearchUserForm',
  });

  const getPageData = (values?: IArgsResponse) => {
    setLoading(true);
    getArgsRequest({ limit, offset: (page - 1) * limit, ...values } as IQueryArgsParams)
      .then((res) => {
        const listWithId = res.data.list.map((item: any) => ({
          ...item,
          id: item.id ?? item.argId,
        }));
        setArgs(listWithId);
        setTotal(res.data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteArgsAction = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该参数吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteArgsRequest([id]).then(() => getPageData());
      },
    });
  };

  const editArgsAction = async (row: IArgsResponse) => {
    setCurrentEditArgs(row);
    setIsEdit(true);
    setEditArgsModalOpen(true);
  };

  const onFinish = () => {
    formRef.validateFields().then((values) => {
      if (isEdit && currentEditArgs) {
        const submitValues = { ...values, id: currentEditArgs.id };
        updateArgsRequest(currentEditArgs.id, submitValues).then(() => {
          setEditArgsModalOpen(false);
          getPageData();
        });
      } else {
        createArgsRequest(values).then(() => {
          setEditArgsModalOpen(false);
          getPageData();
        });
      }
    });
  };

  const roleColumns: TableProps<IArgsResponse>['columns'] = [
    {
      title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
      title: '参数键',
      dataIndex: 'argKey',
      key: 'argKey',
    },
    {
      title: '参数名称',
      dataIndex: 'argName',
      key: 'argName',
    },
    {
      title: '参数值',
      dataIndex: 'argValue',
      key: 'argValue',
    },
    {
      title: t('operate'),
      key: 'action',
      align: 'center',
      render: (_, row) => {
        return (
          <div className='gap-2 flex text-[#5bb4ef] items-center cursor-pointer justify-center'>
            <span onClick={() => editArgsAction(row)}>{t('edit')}</span>
            <span className='text-red-500' onClick={() => deleteArgsAction(row.id)}>
              {t('delete')}
            </span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (editArgsModalOpen && isEdit) {
      formRef.setFieldsValue(currentEditArgs);
    }
  }, [editArgsModalOpen]);

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
    editArgsModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditArgsModalOpen,
    onFinish,
  };
};
