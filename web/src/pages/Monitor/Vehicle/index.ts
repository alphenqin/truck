import request from '@/service/request';
import { AxiosResponse } from 'axios';

// 基础分页参数接口
export interface IPage {
  limit: number;
  offset: number;
}

// 基础查询参数接口
export interface IQueryParams<T> extends IPage {
  query?: T;
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 班组查询参数
export interface IGroupQuery {
  groupName?: string;
  storeId?: number;
}

// 场库接口
export interface IStore {
  StoreId: number;
  StoreName: string;
  GardenId: number;
}

// 班组接口
export interface IGroup {
  groupId: number;
  groupName: string;
  storeId: number;
}

// 资产查询参数接口
export interface IAssetQuery {
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

// 资产接口
export interface IAsset {
  assetId: number;
  assetCode: string;
  assetType: number;
  status: number;
  storeId: number;
  departmentId: number;
  gardenId: number;
  groupId: number | null;
  createdAt: string;
  updatedAt: string;
}

// 资产分配参数接口
export interface IUpdateAssetGroupParams {
  assetId: number;
  groupId: number;
}

// 班组分配参数接口
export interface IUpdateGroupStoreParams {
  groupId: number;
  storeId: number;
}

// 获取所有场库列表
export const getStores = (): Promise<AxiosResponse<IStore[]>> => {
  return request.get({
    url: '/monitor/store/list',
  });
};

// 获取班组列表
export const getGroups = (params: IQueryParams<IGroupQuery>): Promise<AxiosResponse<IHasTotalResponse<IGroup[]>>> => {
  return request.post({
    url: '/monitor/group/list',
    data: params,
  });
};

// 获取资产列表
export const getAssets = (params: IQueryParams<IAssetQuery>): Promise<AxiosResponse<IHasTotalResponse<IAsset[]>>> => {
  return request.post({
    url: '/monitor/asset/list',
    data: params,
  });
};

// 更新资产所属班组
export const updateAssetGroup = (params: IUpdateAssetGroupParams): Promise<AxiosResponse<null>> => {
  return request.post({
    url: '/monitor/ag/update',
    data: params,
  });
};

// 更新班组所属场库
export const updateGroupStore = (params: IUpdateGroupStoreParams): Promise<AxiosResponse<null>> => {
  return request.post({
    url: '/monitor/gs/update',
    data: params,
  });
}; 
