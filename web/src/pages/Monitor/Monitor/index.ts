import request from '@/service/request';
import { AxiosResponse } from 'axios';

// 分页参数接口
export interface IPage {
  limit: number;
  offset: number;
}

// 查询轨迹参数接口
export interface IQueryTrackParams extends IPage {
  assetCode: string;   // 资产编码
  startTime: string;   // 开始时间
  endTime: string;     // 结束时间
}

// 查询实时位置参数接口
export interface IQueryLocationParams {
  assetCode: string;   // 资产编码
}

// 监控记录接口
export interface IMonitorRecord {
  monitorId: number;     // 监控记录ID
  assetId: number;       // 资产ID
  assetCode: string;     // 资产编码
  gatewayId: number;     // 网关ID
  gatewayName: string;   // 网关名称
  detectionTime: string; // 检测时间
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 获取资产轨迹
export const getAssetTrack = (params: IQueryTrackParams) => {
  return request.post<{
    code: number;
    msg: string;
    data: IHasTotalResponse<IMonitorRecord[]>;
  }>({
    url: '/monitor/track',
    data: params,
  });
};

// 获取资产实时位置
export const getAssetLocation = (params: IQueryLocationParams) => {
  return request.post<{
    code: number;
    msg: string;
    data: IMonitorRecord;
  }>({
    url: '/monitor/location',
    data: params,
  });
};
