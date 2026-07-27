import { Key, ReactNode, useEffect, useState } from 'react';
import { Button, Form, Input, Modal, TableProps, message } from 'antd';
import { useSearchFrom } from '@/hooks/useSearchForm';
import {
  createGroupInfoRequest,
  deleteGroupInfoRequest,
  getGroupInfoRequest,
  IGroupFormValues,
  IGroupInfo,
  IQueryGroupParams,
  updateGroupInfoRequest,
} from './index';

export const useGroupInfoPageHooks = () => {
  const [form] = Form.useForm<IGroupFormValues>();
  const [list, setList] = useState<IGroupInfo[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<IGroupInfo | null>(null);

  const getPageData = (values?: Partial<IQueryGroupParams>) => {
    setLoading(true);
    getGroupInfoRequest({
      limit,
      offset: (page - 1) * limit,
      ...values,
    })
      .then((res) => {
        setList(res.data.list || []);
        setTotal(Number(res.data.total || 0));
      })
      .finally(() => setLoading(false));
  };

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (row: IGroupInfo) => {
    setEditing(row);
    form.setFieldsValue({ groupName: row.groupName });
    setModalOpen(true);
  };

  const saveGroup = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (editing) {
        const response: any = await updateGroupInfoRequest(editing.groupId, values);
        if (Number(response?.code) > 201) throw new Error(response?.msg || '编辑班组失败');
        message.success('班组编辑成功');
      } else {
        const response: any = await createGroupInfoRequest(values);
        if (Number(response?.code) > 201) throw new Error(response?.msg || '新增班组失败');
        message.success('班组新增成功');
      }
      setModalOpen(false);
      getPageData();
    } finally {
      setSaving(false);
    }
  };

  const deleteGroups = (ids: number[]) => {
    if (!ids.length) {
      message.warning('请选择要删除的班组');
      return;
    }
    Modal.confirm({
      title: '确认删除',
      content: ids.length > 1 ? `确定删除选中的 ${ids.length} 个班组吗？` : '确定删除该班组吗？',
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        const response: any = await deleteGroupInfoRequest(ids);
        if (Number(response?.code) > 201) throw new Error(response?.msg || '删除班组失败');
        message.success('班组删除成功');
        setSelectedRowKeys([]);
        if (page !== 1) setPage(1);
        else getPageData();
      },
    });
  };

  const searchConfig: { label: string; name: keyof IQueryGroupParams; component: ReactNode }[] = [
    { label: '班组名称', name: 'groupName', component: <Input allowClear placeholder='请输入班组名称' /> },
  ];

  const { SearchFormComponent } = useSearchFrom<IQueryGroupParams>({
    getDataRequestFn: (values) => getPageData(values),
    onNewRecordFn: openCreate,
    formItems: searchConfig,
    formName: 'groupInfoSearchForm',
    operateComponent: (
      <Button danger disabled={!selectedRowKeys.length} onClick={() => deleteGroups(selectedRowKeys.map(Number))}>
        批量删除
      </Button>
    ),
  });

  const columns: TableProps<IGroupInfo>['columns'] = [
    { title: '班组ID', dataIndex: 'groupId', key: 'groupId', width: 160 },
    { title: '班组名称', dataIndex: 'groupName', key: 'groupName' },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 160,
      render: (_, row) => (
        <div className='flex justify-center gap-3'>
          <span className='text-[#5bb4ef] cursor-pointer' onClick={() => openEdit(row)}>编辑</span>
          <span className='text-red-500 cursor-pointer' onClick={() => deleteGroups([row.groupId])}>删除</span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getPageData();
  }, [page, limit]);

  return {
    form,
    list,
    columns,
    SearchFormComponent,
    selectedRowKeys,
    setSelectedRowKeys,
    page,
    setPage,
    limit,
    setLimit,
    total,
    loading,
    modalOpen,
    setModalOpen,
    saving,
    editing,
    saveGroup,
  };
};
