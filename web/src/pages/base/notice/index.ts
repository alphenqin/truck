import request from '@/service/request';
import { AxiosResponse } from 'axios';

// 分页参数接口
export interface IPage {
  limit: number;
  offset: number;
}

// 查询参数接口
export interface IQueryNoticesParams extends IPage {
  ruleName?: string;
  ruleKey?: string;
  ruleValue?: string;
}

// Notice 响应数据接口
export interface INoticeResponse {
  id: number;
  ruleName: string;
  ruleKey: string;
  ruleValue: string;
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 创建/更新参数接口
export interface IUpdateNoticeParams {
  id?: number;
  ruleName: string;
  ruleKey: string;
  ruleValue: string;
}

// 获取通知/规则列表
export const getNoticesRequest = (params: IQueryNoticesParams) => {
  return request.post<AxiosResponse<IHasTotalResponse<INoticeResponse[]>>>({
    url: '/base/notice/query',
    data: params,
  });
};

// 创建通知/规则
export const createNoticeRequest = (params: IUpdateNoticeParams) => {
  return request.post<AxiosResponse<null>>({
    url: '/base/notice',
    data: params,
  });
};

// 更新通知/规则
export const updateNoticeRequest = (id: number, params: IUpdateNoticeParams) => {
  return request.patch<AxiosResponse<null>>({
    url: `/base/notice/update/${id}`,
    data: params,
  });
};

// 批量删除通知/规则
export const deleteNoticeRequest = (ids: number[]) => {
  return request.delete({
    url: '/base/notice/batch-delete',
    data: ids,
  });
};

// 导出通知/规则
export const exportNoticeRequest = (selectedIds: number[]) => {
  return request.post({
    url: '/base/notice/export',
    data: { ids: selectedIds },
    responseType: 'blob',
  });
};