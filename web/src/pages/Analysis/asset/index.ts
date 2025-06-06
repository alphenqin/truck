import request from '@/service/request';
import { AxiosResponse } from 'axios';

// 分页参数接口
export interface IPage {
  limit: number;
  offset: number;
}

// 查询参数接口
export interface IQueryAssetParams extends IPage {
  assetId?: number;
  assetCode?: string;
  assetType?: number;
  status?: number;
  storeId?: number;
  departmentId?: number;
  gardenId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// 资产响应数据接口
export interface IAssetResponse {
  assetId: number;
  assetCode: string;
  assetType: number;
  status: number;
  storeId: number;
  departmentId: number;
  gardenId: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 获取资产列表
export const getAssetRequest = (params: IQueryAssetParams) => {
  return request.post<AxiosResponse<IHasTotalResponse<IAssetResponse[]>>>({
    url: '/asset/query',
    data: params,
  });
};

// 资产类型映射
export const assetTypeMap: Record<number, string> = {
  1: '工装车',
  2: '牵引车',
};

// 资产状态映射
export const statusMap: Record<number, string> = {
  1: '正常在库',
  2: '正常出库',
  3: '异常待修',
  4: '维修中',
  5: '报废',
  6: '呆滞',
  7: '疑似丢失',
};