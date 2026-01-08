import { ReactNode, useEffect, useState } from 'react';
import { Input, Select, TableProps } from 'antd';
import {
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

  const searchConfig: { label: string; name: string; component: ReactNode }[] = [
    { label: '资产编码', name: 'assetCode', component: <Input allowClear /> },
  ];

  const { SearchFormComponent } = useSearchFrom({
    getDataRequestFn: (values) => getPageData(values),
    onNewRecordFn: () => {},
    formItems: searchConfig,
    formName: 'inventoryDetailSearchForm',
    showAddBtn: false,
  });

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

  const columns: TableProps<IInventoryDetailResponse>['columns'] = [
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode' },
    { title: '标签码', dataIndex: 'tagCode', key: 'tagCode' },
    { title: '操作类型', dataIndex: 'actionType', key: 'actionType', render: (value: number) => actionTypeMap[value] || value },
    { title: '操作时间', dataIndex: 'actionTime', key: 'actionTime', render: (value: string) => value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-' },
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
    setPage,
    setLimit,
  };
};

// 盘点操作类型映射
export const actionTypeMap: Record<number, string> = {
  1: '入库',
  2: '出库',
  3: '盘点',
};
