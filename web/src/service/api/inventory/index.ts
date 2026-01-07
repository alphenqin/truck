import request from '@/service/request';
import { AxiosResponse } from 'axios';

// 盘点详情查询参数接口
export interface IQueryInventoryDetailParams {
  assetCode?: string;
  limit: number;
  offset: number;
}

// 盘点详情响应数据接口
export interface IInventoryDetailResponse {
  assetId: number;
  assetCode: string;
  tagCode: string;
  actionType: number;
  actionTime: string; // ISO 字符串
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 分页参数接口
export interface IPage {
  limit: number;
  offset: number;
}

// 获取盘点详情记录列表
export const getInventoryDetailRequest = (params: IQueryInventoryDetailParams) => {
  return request.post<AxiosResponse<IHasTotalResponse<IInventoryDetailResponse[]>>>({
    url: '/iot/inventory-detail/query',
    data: params,
  });
};