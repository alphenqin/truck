import { Key, ReactNode, useEffect, useState } from 'react';
import { Button, Input, TableProps, Modal } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import {
  createNoticeRequest,
  deleteNoticeRequest,
  exportNoticeRequest,
  getNoticesRequest,
  IQueryNoticesParams,
  INoticeResponse,
  IUpdateNoticeParams,
  updateNoticeRequest,
} from './index.ts';
import { useSearchFrom } from '@/hooks/useSearchForm.tsx';
import { useForm } from 'antd/es/form/Form';

export const useNoticePageHooks = () => {
  const [formRef] = useForm();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Key[]>([]);
  const [list, setNotices] = useState<INoticeResponse[]>([]);
  const [currentEditNotice, setCurrentEditNotice] = useState<INoticeResponse>();
  const [isEdit, setIsEdit] = useState(false);
  const [editNoticeModalOpen, setEditNoticeModalOpen] = useState(false);
  const searchConfig: { label: string; name: keyof IQueryNoticesParams; component: ReactNode }[] = [
    {
      label: '规则名称',
      name: 'ruleName',
      component: <Input allowClear />,
    },
    {
      label: '规则键',
      name: 'ruleKey',
      component: <Input allowClear />,
    },
    {
      label: '规则值',
      name: 'ruleValue',
      component: <Input allowClear />,
    },
  ];
  const { SearchFormComponent } = useSearchFrom({
    getDataRequestFn: (values) => getPageData(values),
    onNewRecordFn: () => {
      formRef.resetFields();
      setIsEdit(false);
      setEditNoticeModalOpen(true);
    },
    formItems: searchConfig,
    operateComponent: !!selected.length && (
      <Button type='primary' icon={<DownloadOutlined />} onClick={() => exportNoticeRequest(selected.map(Number))}>
        导出
      </Button>
    ),
    formName: 'noticeSearchForm',
  });

  const getPageData = (values?: INoticeResponse) => {
    setLoading(true);
    getNoticesRequest({ limit, offset: (page - 1) * limit, ...values } as IQueryNoticesParams)
      .then((res) => {
        setNotices(res.data.list);
        setTotal(res.data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteNoticeAction = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该规则吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteNoticeRequest([id]).then(() => getPageData());
      },
    });
  };

  const editNoticeAction = async (row: INoticeResponse) => {
    setCurrentEditNotice(row);
    setIsEdit(true);
    setEditNoticeModalOpen(true);
  };

  const onFinish = () => {
    formRef.validateFields().then((values) => {
      if (isEdit && currentEditNotice) {
        const submitValues = { ...values, id: currentEditNotice.id };
        updateNoticeRequest(currentEditNotice.id, submitValues).then(() => {
          setEditNoticeModalOpen(false);
          getPageData();
        });
      } else {
        createNoticeRequest(values).then(() => {
          setEditNoticeModalOpen(false);
          getPageData();
        });
      }
    });
  };

  const noticeColumns: TableProps<INoticeResponse>['columns'] = [
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
    },
    {
      title: '规则键',
      dataIndex: 'ruleKey',
      key: 'ruleKey',
    },
    {
      title: '规则值',
      dataIndex: 'ruleValue',
      key: 'ruleValue',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, row) => {
        return (
          <div className='gap-2 flex text-[#5bb4ef] items-center cursor-pointer justify-center'>
            <span onClick={() => editNoticeAction(row)}>编辑</span>
            <span className='text-red-500' onClick={() => deleteNoticeAction(row.id)}>
              删除
            </span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (editNoticeModalOpen && isEdit) {
      formRef.setFieldsValue(currentEditNotice);
    }
  }, [editNoticeModalOpen]);

  useEffect(() => {
    getPageData();
  }, [limit, page]);

  return {
    list,
    noticeColumns,
    SearchFormComponent,
    total,
    limit,
    loading,
    isEdit,
    formRef,
    editNoticeModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditNoticeModalOpen,
    onFinish,
  };
};
