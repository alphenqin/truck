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

// 资产响应数据接口 - 对应 Go 的 Asset 结构体
export interface IAssetResponse {
  assetId: number; // 自增主键
  assetCode: string;
  assetType: number;
  status: number;
  storeId: number;
  departmentId: number;
  gardenId: number;
  createdAt: string; // 后端返回 time.Time，前端通常处理为字符串
  updatedAt: string; // 后端返回 time.Time，前端通常处理为字符串
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 创建/更新资产参数接口 - 根据 Go 结构体中可修改的字段定义
export interface ICreateUpdateAssetParams {
  assetCode: string;
  assetType: number;
  status: number;
  storeId: number;
  departmentId: number;
  gardenId: number;
}

// 获取资产列表
export const getAssetRequest = (params: IQueryAssetParams) => {
  return request.post<AxiosResponse<IHasTotalResponse<IAssetResponse[]>>>({
    url: '/asset/query',
    data: params,
  });
};

// 创建资产
export const createAssetRequest = (params: ICreateUpdateAssetParams) => {
  return request.post<AxiosResponse<null>>({
    url: '/asset',
    data: params,
  });
};

// 更新资产
export const updateAssetRequest = (assetId: number, params: ICreateUpdateAssetParams) => {
  return request.patch<AxiosResponse<null>>({
    url: `/asset/${assetId}`,
    data: params,
  });
};

// 批量删除资产
export const deleteAssetRequest = (ids: number[]) => {
  return request.delete({
    url: '/asset/batch-delete',
    data: ids,
  });
};

// 导出资产
export const exportAssetRequest = (selectedIds: number[]) => {
  return request.post({
    url: '/asset/export',
    data: { ids: selectedIds },
    responseType: 'blob',
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