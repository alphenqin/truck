import { ReactNode, useEffect, useState } from 'react';
import { Button, Input, Modal, TableProps, message } from 'antd';
import {
  batchDeleteInventoryDetailRequest,
  getInventoryDetailRequest,
  IQueryInventoryDetailParams,
  IInventoryDetailResponse,
} from '@/service/api/inventory';
import { useSearchFrom } from '@/hooks/useSearchForm.tsx';
import dayjs from 'dayjs';

export const useInventoryDetailPageHooks = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<IInventoryDetailResponse[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const searchConfig: { label: string; name: string; component: ReactNode }[] = [
    { label: '资产编码', name: 'assetCode', component: <Input allowClear /> },
  ];

  const getPageData = (values?: IQueryInventoryDetailParams) => {
    setLoading(true);
    getInventoryDetailRequest({ limit, offset: (page - 1) * limit, ...values } as IQueryInventoryDetailParams)
      .then((res: any) => {
        setList(res.data.list);
        setTotal(res.data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的盘点记录');
      return;
    }
    Modal.confirm({
      title: '确认删除',
      content: `确定删除选中的 ${selectedRowKeys.length} 条资产盘点记录吗？`,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        await batchDeleteInventoryDetailRequest(selectedRowKeys as number[]);
        message.success('删除成功');
        setSelectedRowKeys([]);
        if (page !== 1) {
          setPage(1);
        } else {
          getPageData();
        }
      },
    });
  };

  const columns: TableProps<IInventoryDetailResponse>['columns'] = [
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode', render: (value?: string) => value || '-' },
    { title: '标签码', dataIndex: 'tagCode', key: 'tagCode' },
    { title: '电量', dataIndex: 'batteryLevel', key: 'batteryLevel', render: (value?: string) => value || '-' },
    { title: '操作类型', key: 'actionType', render: () => '盘点' },
    { title: '操作时间', dataIndex: 'inventoryTime', key: 'inventoryTime', render: (value: string) => value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-' },
  ];

  const { SearchFormComponent } = useSearchFrom({
    getDataRequestFn: (values) => getPageData(values),
    onNewRecordFn: () => {},
    formItems: searchConfig,
    formName: 'inventoryDetailSearchForm',
    showAddBtn: false,
    operateComponent: (
      <Button danger onClick={handleBatchDelete}>
        批量删除
      </Button>
    ),
  });

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
    setPage,
    setLimit,
    selectedRowKeys,
    setSelectedRowKeys,
  };
};
