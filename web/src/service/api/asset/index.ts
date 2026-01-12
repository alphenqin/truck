import request from '@/service/request';
import { AxiosResponse } from 'axios';

export interface IAssetStatusStatisticItem {
  status: number;
  count: number;
}

export interface IAssetStatusStatisticsResponse {
  list: IAssetStatusStatisticItem[];
}

export interface IInStorageDistributionItem {
  storeId: number;
  storeName: string;
  count: number;
}

export interface IInStorageDistributionResponse {
  list: IInStorageDistributionItem[];
}

export const getAssetStatusStatisticsRequest = () => {
  return request.get<AxiosResponse<IAssetStatusStatisticsResponse>>({
    url: '/asset/status',
  });
};

export const getInStorageDistributionRequest = () => {
  return request.get<AxiosResponse<IInStorageDistributionResponse>>({
    url: '/asset/in-storage/distribution',
  });
};
