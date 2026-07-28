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
  id: number;
  assetId: number;
  assetCode: string;
  tagCode: string;
  batteryLevel?: string;
  inventoryStatus: number;
  inventoryTime: string; // ISO 字符串
}

export interface IInventoryStatusTrendItem {
  time: string;
  inventoryStatus: number;
  assetType: number;
  count: number;
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

// 批量删除盘点记录
export const batchDeleteInventoryDetailRequest = (ids: number[]) => {
  return request.delete<AxiosResponse<{ deleted: number }>>({
    url: '/iot/inventory-detail/batch-delete',
    data: ids,
  });
};

// 获取近24小时资产状态趋势；不传场库时统计全部场库。
export const getInventoryStatusTrend24hRequest = (storeId?: number) => {
  return request.get<AxiosResponse<{ list: IInventoryStatusTrendItem[] }>>({
    url: '/iot/inventory-records/status-trend',
    params: storeId ? { storeId } : undefined,
  });
};
