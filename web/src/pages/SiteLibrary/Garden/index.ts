import request from '@/service/request';
import { AxiosResponse } from 'axios';

// 查询参数接口
export interface IQuerygarendsParams {
  gardenName?: string;
  limit: number;
  offset: number;
}

// 园区响应数据接口
export interface IgarendsResponse {
  gardenId: number;
  storeId: number;
  gardenName: string;
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 新增/更新园区参数接口
export interface IUpdategarendsParams {
  gardenId?: number;
  gardenName: string;
}

// 分页参数接口
export interface IPage {
  limit: number;
  offset: number;
}

// 获取园区列表
export const getgarendsRequest = (params: IQuerygarendsParams) => {
  return request.post<AxiosResponse<IHasTotalResponse<IgarendsResponse[]>>>({
    url: '/sl/garden/query',
    data: params,
  });
};

// 创建园区
export const creategarendsRequest = (params: IUpdategarendsParams) => {
  return request.post<AxiosResponse<null>>({
    url: '/sl/garden',
    data: params,
  });
};

// 批量删除园区
export const deletegarendsRequest = (ids: number[]) => {
  return request.delete({
    url: '/sl/garden/batch-delete',
    data: ids,
  });
};

// 更新园区
export const updategarendsRequest = (params: IUpdategarendsParams) => {
  return request.patch<AxiosResponse<null>>({
    url: `/sl/garden/update`,
    data: params,
  });
};

// 导出园区
export const exportgarendsRequest = (selectedIds: number[]) => {
  return request.post({
    url: '/sl/garden/export',
    data: { ids: selectedIds },
    responseType: 'blob',
  });
};
