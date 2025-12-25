import { Key, ReactNode, useEffect, useState } from 'react';
import { Button, Input, TableProps, Modal } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import {
  createLinesRequest,
  deleteLinesRequest,
  exportLinesRequest,
  getLinesRequest,
  IQueryLinesParams,
  ILinesResponse,
  IUpdateLinesParams,
  updateLinesRequest,
} from './index';
import { useSearchFrom } from '@/hooks/useSearchForm.tsx';
import { useForm } from 'antd/es/form/Form';

export const useLinesPageHooks = () => {
  const [formRef] = useForm();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Key[]>([]);
  const [list, setLines] = useState<ILinesResponse[]>([]);
  const [currentEditLine, setCurrentEditLine] = useState<ILinesResponse>();
  const [isEdit, setIsEdit] = useState(false);
  const [editLinesModalOpen, setEditLinesModalOpen] = useState(false);
  const searchConfig: { label: string; name: keyof IQueryLinesParams; component: ReactNode }[] = [
    {
      label: '线路ID',
      name: 'lineId',
      component: <Input type="number" allowClear min={1} />,
    },
    {
      label: '线路名称',
      name: 'lineName',
        component: <Input allowClear />,
    },
  ];
  const { SearchFormComponent } = useSearchFrom({
    getDataRequestFn: (values) => {
      // Handle lineId
      if (values.lineId === '' || values.lineId === undefined || values.lineId === null) {
        delete values.lineId;
      } else {
        values.lineId = Number(values.lineId);
      }
      getPageData(values as IQueryLinesParams);
    },
    onNewRecordFn: () => {
      setIsEdit(false);
      setEditLinesModalOpen(true);
      formRef.resetFields();
    },
    formItems: searchConfig,
    operateComponent: !!selected.length && (
      <Button type='primary' icon={<DownloadOutlined />} onClick={() => exportLinesRequest(selected.map(key => Number(key)))}>
        导出
      </Button>
    ),
    formName: 'lineSearchForm',
  });

  const getPageData = (values?: IQueryLinesParams) => {
    setLoading(true);
    const params = {
      limit,
      offset: (page - 1) * limit,
      ...values,
    } as IQueryLinesParams;
    
    // Convert lineId to number if it exists
    if (params.lineId) {
      params.lineId = Number(params.lineId);
    }
    
    getLinesRequest(params)
      .then((res) => {
        setLines(res.data.list);
        setTotal(res.data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteLineAction = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条线路吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteLinesRequest([id]).then(() => getPageData());
      },
    });
  };

  const editLineAction = async (row: ILinesResponse) => {
    setCurrentEditLine(row);
    setIsEdit(true);
    setEditLinesModalOpen(true);
  };

  const onFinish = () => {
    formRef.validateFields().then((values) => {
      // 编辑
      if (isEdit) {
        updateLinesRequest(currentEditLine!.lineId, values as IUpdateLinesParams).then(() => {
          setEditLinesModalOpen(false);
          getPageData();
        });
      } else {
        // 新增
        createLinesRequest(values as IUpdateLinesParams).then(() => {
          setEditLinesModalOpen(false);
          getPageData();
        });
      }
    });
  };

  const roleColumns: TableProps<ILinesResponse>['columns'] = [
    {
      title: '线路ID',
      dataIndex: 'lineId',
      key: 'lineId',
    },
    {
      title: '线路名称',
      dataIndex: 'lineName',
      key: 'lineName',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, row) => {
        return (
          <div className='gap-2 flex text-[#5bb4ef] items-center cursor-pointer justify-center'>
            <span onClick={() => editLineAction(row)}>编辑</span>
            <span className='text-red-500' onClick={() => deleteLineAction(row.lineId)}>
              删除
            </span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (editLinesModalOpen && isEdit) {
      formRef.setFieldsValue(currentEditLine);
    }
  }, [editLinesModalOpen]);

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
    editLinesModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditLinesModalOpen,
    onFinish,
  };
};
