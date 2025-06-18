import request from '@/service/request';
import { AxiosResponse } from 'axios';

// 分页参数接口
export interface IPage {
  limit: number;
  offset: number;
}

// 查询参数接口
export interface IQueryLinesParams extends IPage {
  lineId?: number;
  lineName?: string;
}

// 线路响应数据接口 - 对应 Go 的 Line 结构体
export interface ILinesResponse {
  lineId: number;   // 自增主键
  lineName: string; // 线路名称
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 创建/更新线路参数接口
export interface IUpdateLinesParams {
  lineId?: number;  // 可选，新增时不需要
  lineName: string;
}

// 获取线路列表
export const getLinesRequest = (params: IQueryLinesParams) => {
  return request.post<AxiosResponse<IHasTotalResponse<ILinesResponse[]>>>({
    url: '/base/line/query',
    data: params,
  });
};

// 创建线路
export const createLinesRequest = (params: IUpdateLinesParams) => {
  return request.post<AxiosResponse<null>>({
    url: '/base/line',
    data: params,
  });
};

// 更新线路
export const updateLinesRequest = (lineId: number, params: IUpdateLinesParams) => {
  return request.patch<AxiosResponse<null>>({
    url: '/base/line/update',
    data: { ...params, lineId },
  });
};

// 批量删除线路
export const deleteLinesRequest = (ids: number[]) => {
  return request.delete({
    url: '/base/line/batch-delete',
    data: ids,
  });
};

// 导出线路
export const exportLinesRequest = (selectedIds: number[]) => {
  return request.post({
    url: '/base/line/export',
    data: { ids: selectedIds },
    responseType: 'blob',
  });
};
