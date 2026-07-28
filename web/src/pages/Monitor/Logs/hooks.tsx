import { ReactNode, useEffect, useState } from 'react';
import { Input, Select, TableProps, DatePicker } from 'antd';
import {
  getOperationLogsRequest,
  IQueryOperationLogsParams,
  IOperationLogResponse,
} from '@/service/api/operationLog';
import { useSearchFrom } from '@/hooks/useSearchForm.tsx';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export const useOperationLogPageHooks = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<IOperationLogResponse[]>([]);

  const searchConfig: { label: string; name: string; component: ReactNode }[] = [
    { label: '账号', name: 'account', component: <Input allowClear /> },
    { label: '请求方法', name: 'method', component: (
      <Select allowClear options={[
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PATCH', value: 'PATCH' },
        { label: 'DELETE', value: 'DELETE' },
      ]} />
    ) },
    { label: '请求路径', name: 'path', component: <Input allowClear /> },
    { label: '时间范围', name: 'timeRange', component: <RangePicker showTime format='YYYY-MM-DD HH:mm:ss' /> },
  ];

  const { SearchFormComponent } = useSearchFrom({
    getDataRequestFn: (values) => getPageData(values),
    onNewRecordFn: () => {},
    formItems: searchConfig,
    formName: 'operationLogSearchForm',
    showAddBtn: false,
  });

  const getPageData = (values?: any) => {
    setLoading(true);
    const params: IQueryOperationLogsParams = {
      limit,
      offset: (page - 1) * limit,
      account: values?.account || undefined,
      method: values?.method || undefined,
      path: values?.path || undefined,
      startTime: undefined,
      endTime: undefined,
    };
    // 处理时间范围
    if (values?.timeRange && values.timeRange.length === 2) {
      params.startTime = dayjs(values.timeRange[0]).format('YYYY-MM-DD HH:mm:ss');
      params.endTime = dayjs(values.timeRange[1]).format('YYYY-MM-DD HH:mm:ss');
    }
    getOperationLogsRequest(params)
      .then((res: any) => {
        setList(res.data.list);
        setTotal(res.data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns: TableProps<IOperationLogResponse>['columns'] = [
    { title: '账号', dataIndex: 'account', key: 'account', width: 140 },
    { title: '请求方法', dataIndex: 'method', key: 'method', width: 90 },
    { title: '请求路径', dataIndex: 'path', key: 'path', ellipsis: true },
    { title: 'IP', dataIndex: 'ip', key: 'ip', width: 140 },
    { title: '状态码', dataIndex: 'statusCode', key: 'statusCode', width: 90 },
    { title: '操作时间', dataIndex: 'createdAt', key: 'createdAt', width: 180, render: (value: string) => value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-' },
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
