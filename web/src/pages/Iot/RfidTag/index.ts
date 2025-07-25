import request from '@/service/request';
import { AxiosResponse } from 'axios';
import moment from 'moment';

// 分页参数接口
export interface IPage {
  limit: number;
  offset: number;
}

// 查询参数接口
export interface IQueryRfidTagsParams extends IPage {
  tagCode?: string;
  status?: number;
  heartbeat?: string;
  reportTime?: string;
  electricity?: string;
}

// RfidTag 响应数据接口
export interface IRfidTagResponse {
  id: string;
  tagCode: string;
  status: number;
  heartbeat: string;
  reportTime: string;
  electricity: string;
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 创建/更新参数接口
export interface IUpdateRfidTagParams {
  id?: string;
  tagCode: string;
  status?: number;
  heartbeat?: string;
  reportTime?: string;
  electricity: string;
}

// 表单提交值接口 (对应 DatePicker 和 Select 的实际返回值类型)
export interface IFormValues {
  tagCode: string;
  status?: number | string; // DatePicker 可能返回 moment，Select 可能返回 string或number
  heartbeat?: string;
  reportTime?: string;
  electricity: string;
}

// 获取RfidTag列表
export const getRfidTagsRequest = (params: IQueryRfidTagsParams) => {
  return request.post<AxiosResponse<IHasTotalResponse<IRfidTagResponse[]>>>({
    url: '/iot/tag/query',
    data: params,
  });
};

// 创建RfidTag
export const createRfidTagRequest = (params: IUpdateRfidTagParams) => {
  return request.post<AxiosResponse<null>>({
    url: '/iot/tag',
    data: params,
  });
};

// 更新RfidTag
export const updateRfidTagRequest = (id: string, params: IUpdateRfidTagParams) => {
  return request.patch<AxiosResponse<null>>({
    url: `/iot/tag/update/${id}`,
    data: params,
  });
};

// 批量删除RfidTag
export const deleteRfidTagRequest = (ids: string[]) => {
  return request.delete({
    url: '/iot/tag/batch-delete',
    data: ids,
  });
};

// 导出RfidTag
export const exportRfidTagRequest = (selectedIds: string[]) => {
  return request.post({
    url: '/iot/tag/export',
    data: { ids: selectedIds },
    responseType: 'blob',
  });
};
