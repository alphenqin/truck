import request from '@/service/request';
import { AxiosResponse } from 'axios';

// 分页参数接口
export interface IPage {
  limit: number;
  offset: number;
}

// 时间范围类型
export interface TimeRange {
  startTime: string;
  endTime: string;
}

// 查询参数接口
export interface IQueryAssetParams extends IPage {
  assetId?: number;
  assetCode?: string;
  storeId?: number;
}

// 资产响应数据接口 - 对应 Go 的 Asset 结构体
export interface IAssetResponse {
  assetId: number; // 自增主键
  assetCode: string;
  assetType: number;
  status: number;
  storeId: number;
  quantity: number;
  tagId: number;
  createdAt: string; 
  updatedAt: string; 
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 创建/更新资产参数接口 - 根据 Go 结构体中可修改的字段定义
export interface IUpdateAssetParams {
  assetId: number;
  assetCode: string;
  assetType: number;
  status: number;
  quantity: number;
  tagId: number;
}

// 修改资产状态请求参数
export interface IUpdateAssetStatusParams {
  assetId: number;
  status: number;
  repairReason?: string;
}

// 资产报修记录
export interface IAssetRepairRecord {
  id: number;
  assetId: number;
  repairReason: string;
  createTime: string;
}

// 获取资产列表
export const getAssetRequest = (params: IQueryAssetParams) => {
  return request.post<AxiosResponse<IHasTotalResponse<IAssetResponse[]>>>({
    url: '/asset/query',
    data: params,
  });
};

// 创建资产
export const createAssetRequest = (params: IUpdateAssetParams) => {
  return request.post<AxiosResponse<null>>({
    url: '/asset',
    data: params,
  });
};

// 更新资产
export const updateAssetRequest = (assetId: number, params: IUpdateAssetParams) => {
  return request.patch<AxiosResponse<null>>({
    url: `/asset/update/${assetId}`,
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

// 修改资产状态
export const updateAssetStatus = (params: IUpdateAssetStatusParams) => {
  return request.post({
    url: '/asset/update/type',
    data: params,
  });
};

// 获取资产报修记录
export const getAssetRepairRecordsRequest = (assetId: number) => {
  return request.get<AxiosResponse<{ list: IAssetRepairRecord[] }>>({
    url: `/asset/repairs/${assetId}`,
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

// 场库映射接口
export interface StoreMap {
  storeId: number
  storeName: string
}
// 获取场库映射
export const getStoreMapRequest = () => {
  return request.get<AxiosResponse<StoreMap[]>>({
    url: '/sl/store/map',
  });
};


export interface TagMap {
  id: number
  tagCode: string
}
export const getTagMapRequest = () => {
  return request.get<AxiosResponse<TagMap[]>>({
    url: '/iot/tag/map',
  });
};
