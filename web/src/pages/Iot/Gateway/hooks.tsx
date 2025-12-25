import { Key, ReactNode, useEffect, useState } from 'react';
import { Button, Input, TableProps, Modal, Select, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import {
  createGatewayRequest,
  deleteGatewayRequest,
  exportGatewayRequest,
  getGatewaysRequest,
  IQueryGatewaysParams,
  IGatewayResponse,
  IUpdateGatewayParams,
  updateGatewayRequest,
} from './index.ts';
import { useSearchFrom } from '@/hooks/useSearchForm.tsx';
import { useForm } from 'antd/es/form/Form';

export const useGatewayPageHooks = () => {
  const [formRef] = useForm();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Key[]>([]);
  const [list, setGateways] = useState<IGatewayResponse[]>([]);
  const [currentEditGateway, setCurrentEditGateway] = useState<IGatewayResponse>();
  const [isEdit, setIsEdit] = useState(false);
  const [editGatewayModalOpen, setEditGatewayModalOpen] = useState(false);
  const searchConfig: { label: string; name: keyof IQueryGatewaysParams; component: ReactNode }[] = [
    {
      label: '网关名称',
      name: 'gatewayName',
      component: <Input allowClear />,
    },
    {
      label: '网关编号',
      name: 'gatewayCode',
      component: <Input allowClear />,
    },
    {
      label: '网关类型',
      name: 'gatewayType',
      component: <Input allowClear />,
    },
    {
      label: '状态',
      name: 'status',
      component: <Select allowClear options={[
        { label: '启用', value: 1 },
        { label: '停止', value: 2 },
      ]} />,
    },
  ];
  const { SearchFormComponent } = useSearchFrom({
    getDataRequestFn: (values) => {
      const processedValues: IQueryGatewaysParams = { ...values };
      getPageData(processedValues);
    },
    onNewRecordFn: () => {
      formRef.resetFields();
      setIsEdit(false);
      setEditGatewayModalOpen(true);
    },
    formItems: searchConfig,
    operateComponent: !!selected.length && (
      <Button type='primary' icon={<DownloadOutlined />} onClick={() => exportGatewayRequest(selected.map(String))}>
        导出
      </Button>
    ),
    formName: 'gatewaySearchForm',
  });

  const getPageData = (searchValues?: IQueryGatewaysParams) => {
    setLoading(true);

    const requestParams: IQueryGatewaysParams = {
      limit,
      offset: (page - 1) * limit,
    };

    if (searchValues) {
      if (searchValues.id) {
        requestParams.id = searchValues.id;
      }
      if (searchValues.gatewayName) {
        requestParams.gatewayName = searchValues.gatewayName;
      }
      if (searchValues.gatewayCode) {
        requestParams.gatewayCode = searchValues.gatewayCode;
      }
      if (searchValues.gatewayType) {
        requestParams.gatewayType = searchValues.gatewayType;
      }
      // status 字段已经在 getDataRequestFn 中处理，这里直接赋值即可
      if (searchValues.status !== undefined) {
        requestParams.status = searchValues.status;
      }
    }

    getGatewaysRequest(requestParams).then((res) => {
      // 兼容后端返回 id 字段为 string
      const listWithId = res.data.list.map((item: any) => ({
        ...item,
        id: item.id ?? item.gatewayId,
      }));
      setGateways(listWithId);
        setTotal(res.data.total);
    }).finally(() => {
        setLoading(false);
      });
  };

  const deleteGatewayAction = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该网关吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteGatewayRequest([id]).then(() => getPageData());
      },
    });
  };

  const editGatewayAction = async (row: IGatewayResponse) => {
    setCurrentEditGateway(row);
    setIsEdit(true);
    setEditGatewayModalOpen(true);
  };

  const onFinish = () => {
    formRef.validateFields().then((values) => {
      const submitValues: IUpdateGatewayParams = { ...values };

      if (isEdit && currentEditGateway) {
        submitValues.id = currentEditGateway.id;
        updateGatewayRequest(currentEditGateway.id, submitValues).then(() => {
          setEditGatewayModalOpen(false);
          getPageData();
        });
      } else {
        createGatewayRequest(submitValues).then(() => {
          setEditGatewayModalOpen(false);
          getPageData();
        });
      }
    });
  };

  const gatewayColumns: TableProps<IGatewayResponse>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '网关名称',
      dataIndex: 'gatewayName',
      key: 'gatewayName',
    },
    {
      title: '网关编号',
      dataIndex: 'gatewayCode',
      key: 'gatewayCode',
    },
    {
      title: '网关类型',
      dataIndex: 'gatewayType',
      key: 'gatewayType',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status === 1 ? '启用' : status === 2 ? '停止' : ''),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, row) => {
        return (
          <div className='gap-2 flex text-[#5bb4ef] items-center cursor-pointer justify-center'>
            <span onClick={() => editGatewayAction(row)}>编辑</span>
            <span className='text-red-500' onClick={() => deleteGatewayAction(row.id)}>
              删除
            </span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (editGatewayModalOpen && isEdit) {
      formRef.setFieldsValue(currentEditGateway);
    }
  }, [editGatewayModalOpen]);

  useEffect(() => {
    getPageData();
  }, [limit, page]);

  return {
    list,
    gatewayColumns,
    SearchFormComponent,
    total,
    limit,
    loading,
    isEdit,
    formRef,
    editGatewayModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditGatewayModalOpen,
    onFinish,
  };
};
