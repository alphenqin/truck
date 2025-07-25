import request from '@/service/request';

export interface AssetCountParams {
  startTime: string;
  endTime: string;
}

export interface AssetCountItem {
  type: string;
  count: number;
}

export function getAssetCount(params: AssetCountParams) {
  return request.post<{ list: AssetCountItem[] }>({
    url: '/analysis/asset/count',
    data: params,
  });
}