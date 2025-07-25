import { Key, ReactNode, useEffect, useState } from 'react';
import { Button, Input, TableProps, Modal } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import {
  createDepartmentsRequest,
  deleteDepartmentsRequest,
  exportDepartmentsRequest,
  getDepartmentsRequest,
  IQueryDepartmentsParams,
  IDepartmentsResponse,
  IUpdateDepartmentsParams,
  updateDepartmentsRequest,
} from './index.ts';
import { useSearchFrom } from '@/hooks/useSearchForm.tsx';
import { useForm } from 'antd/es/form/Form';

export const useDepartmentsPageHooks = () => {
  const [formRef] = useForm();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Key[]>([]);
  const [list, setDepartments] = useState<IDepartmentsResponse[]>([]);
  const [currentEditDepartments, setCurrentEditDepartments] = useState<IDepartmentsResponse>();
  const [isEdit, setIsEdit] = useState(false);
  const [editDepartmentsModalOpen, setEditDepartmentsModalOpen] = useState(false);

  const searchConfig: { label: string; name: keyof IQueryDepartmentsParams; component: ReactNode }[] = [
    {
      label: '部门ID',
        name: 'departmentId',
      component: <Input allowClear type="number" min={0} />,
    },
    {
      label: '部门名称',
        name: 'departmentName',
        component: <Input allowClear />,
    },
    {
      label: '场库ID',
        name: 'storeId',
      component: <Input allowClear type="number" min={0} />,
    },
  ];

  const { SearchFormComponent } = useSearchFrom({
    getDataRequestFn: (values) => getPageData(values),
    onNewRecordFn: () => {
      setIsEdit(false);
      setCurrentEditDepartments(undefined);
      formRef.resetFields();
      setEditDepartmentsModalOpen(true);
    },
    formItems: searchConfig,
    operateComponent: !!selected.length && (
      <Button 
        type='primary' 
        icon={<DownloadOutlined />} 
        onClick={() => exportDepartmentsRequest(selected.map(id => Number(id)))}
      >
        导出
      </Button>
    ),
    formName: 'departmentSearchForm',
  });

  const getPageData = (values?: Partial<IQueryDepartmentsParams>) => {
    setLoading(true);
    const params = {
      ...values,
      departmentId: values?.departmentId ? Number(values.departmentId) : undefined,
      storeId: values?.storeId ? Number(values.storeId) : undefined,
    };
    getDepartmentsRequest({ limit, offset: (page - 1) * limit, ...params } as IQueryDepartmentsParams)
      .then((res) => {
        setDepartments(res.data.list);
        setTotal(res.data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteDepartmentsAction = (departmentId: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个部门吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteDepartmentsRequest([departmentId]).then(() => getPageData());
      }
    });
  };

  const editDepartmentsAction = async (row: IDepartmentsResponse) => {
    setCurrentEditDepartments(row);
    setIsEdit(true);
    formRef.resetFields();
    setEditDepartmentsModalOpen(true);
  };

  const onFinish = () => {
    formRef.validateFields().then((values) => {
      const params = {
        ...values,
        storeId: Number(values.storeId)
      };
      if (isEdit && currentEditDepartments) {
        updateDepartmentsRequest(currentEditDepartments.departmentId, params as IUpdateDepartmentsParams)
          .then(() => {
          setEditDepartmentsModalOpen(false);
            formRef.resetFields();
          getPageData();
        });
      } else {
        createDepartmentsRequest(params as IUpdateDepartmentsParams)
          .then(() => {
          setEditDepartmentsModalOpen(false);
            formRef.resetFields();
          getPageData();
        });
      }
    });
  };

  const roleColumns: TableProps<IDepartmentsResponse>['columns'] = [
    {
      title: '部门ID',
        dataIndex: 'departmentId',
        key: 'departmentId',
    },
    {
      title: '部门名称',
        dataIndex: 'departmentName',
        key: 'departmentName',
    },
    {
      title: '场库ID',
        dataIndex: 'storeId',
        key: 'storeId',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, row) => {
        return (
          <div className='gap-2 flex text-[#5bb4ef] items-center cursor-pointer justify-center'>
            <span onClick={() => editDepartmentsAction(row)}>编辑</span>
            <span className='text-red-500' onClick={() => deleteDepartmentsAction(row.departmentId)}>
              删除
            </span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (editDepartmentsModalOpen && isEdit && currentEditDepartments) {
      formRef.setFieldsValue(currentEditDepartments);
    }
  }, [editDepartmentsModalOpen, isEdit, currentEditDepartments]);

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
    editDepartmentsModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditDepartmentsModalOpen,
    onFinish,
  };
};
