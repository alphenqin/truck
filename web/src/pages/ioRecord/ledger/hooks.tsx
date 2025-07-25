import { ReactNode, useEffect, useState } from 'react';
import { Input, Select, TableProps } from 'antd';
import {
  getIoRecordRequest,
  IQueryIoRecordParams,
  IIoRecordResponse,
  actionTypeMap,
} from '@/service/api/ioRecord';
import { useSearchFrom } from '@/hooks/useSearchForm.tsx';
import dayjs from 'dayjs';

export const useIoRecordPageHooks = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<IIoRecordResponse[]>([]);

  const searchConfig: { label: string; name: string; component: ReactNode }[] = [
    { label: '资产编码', name: 'assetCode', component: <Input allowClear /> },
    { label: '操作类型', name: 'actionType', component: <Select allowClear options={[
      { label: '入库', value: 1 },
      { label: '出库', value: 2 },
    ]} /> },
  ];

  const { SearchFormComponent } = useSearchFrom({
    getDataRequestFn: (values) => getPageData(values),
    onNewRecordFn: () => {},
    formItems: searchConfig,
    formName: 'ioRecordSearchForm',
    showAddBtn: false,
  });

  const getPageData = (values?: IQueryIoRecordParams) => {
    setLoading(true);
    getIoRecordRequest({ limit, offset: (page - 1) * limit, ...values } as IQueryIoRecordParams)
      .then((res: any) => {
        setList(res.data.list);
        setTotal(res.data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns: TableProps<IIoRecordResponse>['columns'] = [
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode' },
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
