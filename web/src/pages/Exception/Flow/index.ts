import request from '@/service/request';
import { AxiosResponse } from 'axios';

// 分页参数接口
export interface IPage {
  limit: number;
  offset: number;
}

// 查询参数接口
export interface IQueryExceptionParams extends IPage {
  startTime?: string;      // 开始时间
  endTime?: string;        // 结束时间
  exceptionType?: number;  // 异常类型
  status?: number;         // 处理状态
  assetCode?: string;      // 资产编码
}

// 异常类型映射
export const exceptionTypeMap: Record<number, string> = {
  0: '未知异常',
  1: '工装车厂房不匹配',
  2: '牵引车厂房不匹配',
};

// 处理状态映射
export const statusMap: Record<number, string> = {
  0: '未处理',
  1: '已处理',
};

// 异常记录接口
export interface IExceptionRecord {
  id: number;                 // 异常记录ID (后端返回的是 number)
  exceptionType: number;      // 异常类型
  assetId: number;            // 相关的资产id
  assetCode: string;          // 资产编码
  detectionTime: string;      // 检测时间
  status: number;             // 处理状态
  exceptionNote?: string;     // 异常内容
  remark?: string;            // 备注
  createTime: string;         // 创建时间
  updateTime: string;         // 更新时间
}

// 异常统计接口
export interface IExceptionStats {
  totalCount: number;            // 总异常数
  unhandledCount: number;        // 未处理数
  handledCount: number;          // 已处理数
  tractorExceptionCount: number; // 牵引车异常数
  assetExceptionCount: number;   // 工装车异常数
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 获取异常记录列表
export const getExceptionList = (params: IQueryExceptionParams) => {
  return request.post<{
    code: number;
    msg: string;
    data: IHasTotalResponse<IExceptionRecord[]>;
  }>({
    url: '/asset/exception/flow/list',
    data: params,
  });
};

// 获取异常统计信息
export const getExceptionStats = (params: { startTime?: string; endTime?: string }) => {
  return request.get<{
    code: number;
    msg: string;
    data: IExceptionStats;
  }>({
    url: '/exception/stats',
    params,
  });
};

// 处理异常记录
export const handleException = (params: {
  id: string;
  status: number;
  handleNote?: string;
}) => {
  return request.post<{
    code: number;
    msg: string;
    data: null;
  }>({
    url: '/asset/exception/handle',
    data: params,
  });
};

// 批量处理异常记录
export const batchHandleException = (params: {
  ids: string[];
  status: number;
  handleNote?: string;
}) => {
  return request.post<{
    code: number;
    msg: string;
    data: null;
  }>({
    url: '/asset/exception/batchHandle',
    data: params,
  });
};

// 导出异常记录
export const exportExceptionList = (params: IQueryExceptionParams) => {
  return request.post<{
    code: number;
    msg: string;
    data: string; // 文件下载链接
  }>({
    url: '/asset/exception/export',
    data: params,
  });
};
