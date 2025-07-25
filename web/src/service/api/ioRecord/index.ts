import request from '@/service/request';
import { AxiosResponse } from 'axios';

// 台账部分
// 查询参数接口
export interface IQueryIoRecordParams {
  assetCode?: string;
  actionType?: number;
  limit: number;
  offset: number;
}

// 出入库记录响应数据接口
export interface IIoRecordResponse {
  assetCode: string;
  actionType: number;
  actionTime: string; // ISO 字符串
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 分页参数接口
export interface IPage {
  limit: number;
  offset: number;
}

// 获取出入库记录列表
export const getIoRecordRequest = (params: IQueryIoRecordParams) => {
  return request.post<AxiosResponse<IHasTotalResponse<IIoRecordResponse[]>>>({
    url: '/io-record/query',
    data: params,
  });
};
// 操作类型映射
export const actionTypeMap: Record<number, string> = {
  1: '入库',
  2: '出库',
};

// 面板统计部分

// 小时统计区间数据接口 (与后端 Interval 结构对应)
export interface IHourlyInterval {
  startTime: string; // YYYY-MM-DD HH:mm
  endTime: string; // YYYY-MM-DD HH:mm
  inboundCount: number;
  outboundCount: number;
}

// 过去24小时统计面板响应接口 (与后端 GetPanel 响应对应)
export interface IPanelStatsResponse {
  startTime: string; // YYYY-MM-DD HH:mm
  endTime: string; // YYYY-MM-DD HH:mm
  intervals: IHourlyInterval[];
}

// 获取过去24小时出入库面板统计
export const getIoRecordPanelStatsRequest = () => {
  return request.get<AxiosResponse<IPanelStatsResponse>>({
    url: '/io-record/panel', // Assuming this is the endpoint for GetPanel
  });
};

// 新增：最近1小时和24小时每小时统计接口类型
export interface IPanelStatsV2Response {
  lastHour: {
    inbound: number;
    outbound: number;
  };
  intervals: Array<{
    hour: string;
    inbound: number;
    outbound: number;
  }>;
}

export const getIoRecordPanelStatsV2Request = () => {
  return request.get<AxiosResponse<IPanelStatsV2Response>>({
    url: '/io-record/panel-v2',
  });
};

// 蜂鸣器部分

// 查询参数接口
export interface IQueryBuzzersParams extends IPage {
  buzzerId?: number;
  buzzerRule?: string;
}

// 蜂鸣器响应数据接口
export interface IBuzzersResponse {
  buzzerId: number;
  buzzerRule: string;
}

// 更新参数接口
export interface IUpdateBuzzersParams {
  buzzerId: number;
  buzzerRule: string;
}

// 创建蜂鸣器
export const createBuzzersRequest = (params: Omit<IBuzzersResponse, 'buzzerId'>) => {
  return request.post<AxiosResponse<null>>({
    url: '/io-record/buzzer',
    data: params,
  });
};

// 批量删除蜂鸣器
export const deleteBuzzersRequest = (ids: number[]) => {
  return request.delete<AxiosResponse<null>>({
    url: '/io-record/buzzer/batch-delete',
    data: ids,
  });
};

// 导出蜂鸣器
export const exportBuzzersRequest = (ids: number[]) => {
  return request.post<AxiosResponse<any>>({
    url: '/io-record/buzzer/export',
    data: { ids },
    responseType: 'blob',
  });
};

// 获取蜂鸣器列表
export const getBuzzersRequest = (params: IQueryBuzzersParams) => {
  return request.post<AxiosResponse<IHasTotalResponse<IBuzzersResponse[]>>>({
    url: '/io-record/buzzer/query',
    data: params,
  });
};

// 更新蜂鸣器
export const updateBuzzersRequest = (params: IUpdateBuzzersParams) => {
  return request.patch<AxiosResponse<null>>({
    url: `/io-record/buzzer/update`,
    data: params,
  });
};
