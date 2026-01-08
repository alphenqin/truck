import request from '@/service/request';
import { AxiosResponse } from 'axios';

// 分页参数接口
export interface IPage {
  limit: number;
  offset: number;
}

// 查询参数接口
export interface IQueryAssetTypesParams extends IPage {
  typeId?: number;
  typeName?: string;
}

// 资产类型响应数据接口 - 对应 Go 的 AssetType 结构体
export interface IAssetTypesResponse {
  typeId: number; // 自增主键
  typeName: string;
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 创建/更新资产类型参数接口
export interface IUpdateAssetTypesParams {
  typeId?: number;
  typeName: string;
}

// 获取资产类型列表
export const getAssetTypesRequest = (params: IQueryAssetTypesParams) => {
  return request.post<AxiosResponse<IHasTotalResponse<IAssetTypesResponse[]>>>({
    url: '/base/type/query',
    data: params,
  });
};

// 创建资产类型
export const createAssetTypesRequest = (params: IUpdateAssetTypesParams) => {
  return request.post<AxiosResponse<null>>({
    url: '/base/type',
    data: params,
  });
};

// 更新资产类型
export const updateAssetTypesRequest = (typeId: number, params: IUpdateAssetTypesParams) => {
  return request.patch<AxiosResponse<null>>({
    url: '/base/type/update',
    data: { ...params, typeId },
  });
};

// 批量删除资产类型
export const deleteAssetTypesRequest = (ids: number[]) => {
  return request.delete({
    url: '/base/type/batch-delete',
    data: ids,
  });
};

// 导出资产类型
export const exportAssetTypesRequest = (selectedIds: number[]) => {
  return request.post({
    url: '/base/type/export',
    data: { ids: selectedIds },
    responseType: 'blob',
  });
};
