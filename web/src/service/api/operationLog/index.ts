import request from '@/service/request';
import { AxiosResponse } from 'axios';

// 操作日志响应数据接口
export interface IOperationLogResponse {
  id: number;
  userId: string;
  account: string;
  method: string;
  path: string;
  ip: string;
  statusCode: number;
  createdAt: string;
}

// 查询操作日志参数接口
export interface IQueryOperationLogsParams {
  account?: string;
  method?: string;
  path?: string;
  startTime?: string;
  endTime?: string;
  limit: number;
  offset: number;
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 获取操作日志列表
export const getOperationLogsRequest = (params: IQueryOperationLogsParams) => {
  return request.post<AxiosResponse<IHasTotalResponse<IOperationLogResponse[]>>>({
    url: '/monitor/logs/query',
    data: params,
  });
};
