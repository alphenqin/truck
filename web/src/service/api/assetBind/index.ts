import request from '@/service/request';
import { AxiosResponse } from 'axios';

export interface IQueryAssetBindParams {
  assetCode?: string;
  tagCode?: string;
  limit: number;
  offset: number;
}

export interface IAssetBindResponse {
  id: number;
  assetId: number;
  assetCode: string;
  tagId: number;
  tagCode: string;
}

export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

export interface ICreateAssetBindParams {
  assetCode: string;
  tagCode: string;
}

export interface IUpdateAssetBindParams {
  assetCode: string;
  tagCode: string;
}

export const getAssetBindRequest = (params: IQueryAssetBindParams) => {
  return request.post<AxiosResponse<IHasTotalResponse<IAssetBindResponse[]>>>({
    url: '/asset/bind/query',
    data: params,
  });
};

export const createAssetBindRequest = (params: ICreateAssetBindParams) => {
  return request.post<AxiosResponse<null>>({
    url: '/asset/bind',
    data: params,
  });
};

export const deleteAssetBindRequest = (id: number) => {
  return request.delete({
    url: `/asset/bind/${id}`,
  });
};

export const updateAssetBindRequest = (id: number, params: IUpdateAssetBindParams) => {
  return request.patch<AxiosResponse<null>>({
    url: `/asset/bind/${id}`,
    data: params,
  });
};

export const batchDeleteAssetBindRequest = (ids: number[]) => {
  return request.delete({
    url: '/asset/bind/batch-delete',
    data: ids,
  });
};

export interface IAssetBindImportFail {
  row: number;
  assetCode: string;
  tagCode: string;
  storeName: string;
  reason: string;
}

export interface IAssetBindImportResult {
  total: number;
  success: number;
  failed: number;
  failures: IAssetBindImportFail[];
}

export const importAssetBindRequest = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return request.post<AxiosResponse<IAssetBindImportResult>>({
    url: '/asset/bind/import',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
