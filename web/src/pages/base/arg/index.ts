import request from '@/service/request';
import { AxiosResponse } from 'axios';

// 分页参数接口
export interface IPage {
  limit: number;
  offset: number;
}

// 查询参数接口
export interface IQueryArgsParams extends IPage {
  id?: number;
  argKey?: string;
  argName?: string;
  argValue?: string;
}

// Arg 响应数据接口 - 对应 Go 的 Arg 结构体
export interface IArgsResponse {
  id: number; // 自增主键
  argKey: string;
  argName: string;
  argValue: string;
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 创建/更新参数接口
export interface IUpdateArgsParams {
  id?: number;
  argKey: string;
  argName: string;
  argValue: string;
}

// 内置参数键：固定不可删、键名/名称不可改，仅允许修改参数值
export const BUILTIN_ARG_KEYS = ['lost_timeout', 'idle_timeout'];

// 判断是否为内置参数行
export const isBuiltinArg = (argKey: string) => BUILTIN_ARG_KEYS.includes(argKey);

// 获取参数列表
export const getArgsRequest = (params: IQueryArgsParams) => {
  return request.post<AxiosResponse<IHasTotalResponse<IArgsResponse[]>>>({
    url: '/base/arg/query',
    data: params,
  });
};

// 创建参数
export const createArgsRequest = (params: IUpdateArgsParams) => {
  return request.post<AxiosResponse<null>>({
    url: '/base/arg',
    data: params,
  });
};

// 更新参数
export const updateArgsRequest = (id: number, params: IUpdateArgsParams) => {
  return request.patch<AxiosResponse<null>>({
    url: `/base/arg/update/${id}`,
    data: params,
  });
};

// 批量删除参数
export const deleteArgsRequest = (ids: number[]) => {
  return request.delete({
    url: '/base/arg/batch-delete',
    data: ids,
  });
};

// 导出参数
export const exportArgsRequest = (selectedIds: number[]) => {
  return request.post({
    url: '/base/arg/export',
    data: { ids: selectedIds },
    responseType: 'blob',
  });
};