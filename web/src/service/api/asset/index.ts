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

export interface ILostStatsItem {
  time: string;
  count: number;
}

export interface ILostStatsResponse {
  list: ILostStatsItem[];
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

export const getLostStatsRequest = (hours = 24) => {
  return request.get<AxiosResponse<ILostStatsResponse>>({
    url: '/asset/exception/lost/stats',
    params: { hours },
  });
};
