import request from '@/service/request';
import { AxiosResponse } from 'axios';

// 查询参数接口
export interface IQueryStoreParams {
  storeName?: string;
  limit: number;
  offset: number;
}

// 场库响应数据接口
export interface IStoreResponse {
  storeId: number;
  storeName: string;
  gardenId?: number;
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 新增/更新场库参数接口
export interface IUpdateStoreParams {
  storeId?: number;
  gardenId: number;
  storeName: string;
}

// 分页参数接口
export interface IPage {
  limit: number;
  offset: number;
}

// 获取场库列表
export const getStoreRequest = (params: IQueryStoreParams) => {
  return request.post<AxiosResponse<IHasTotalResponse<IStoreResponse[]>>>({
    url: '/sl/store/query',
    data: params,
  });
};

// 创建场库
export const createStoreRequest = (params: IUpdateStoreParams) => {
  return request.post<AxiosResponse<null>>({
    url: '/sl/store',
    data: params,
  });
};

// 批量删除场库
export const deleteStoreRequest = (ids: number[]) => {
  return request.delete({
    url: '/sl/store/batch-delete',
    data: ids,
  });
};

// 更新场库
export const updateStoreRequest = (params: IUpdateStoreParams) => {
  return request.patch<AxiosResponse<null>>({
    url: `/sl/store/update`,
    data: params,
  });
};

// 导出场库
export const exportStoreRequest = (selectedIds: number[]) => {
  return request.post({
    url: '/sl/store/export',
    data: { ids: selectedIds },
    responseType: 'blob',
  });
};
