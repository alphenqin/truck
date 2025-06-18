import request from '@/service/request';
import { AxiosResponse } from 'axios';

// 分页参数接口
export interface IPage {
  limit: number;
  offset: number;
}

// 查询参数接口
export interface IQueryGatewaysParams extends IPage {
  id?: string;
  gatewayName?: string;
  gatewayCode?: string;
  gatewayType?: string;
  status?: number;
}

// Gateway 响应数据接口
export interface IGatewayResponse {
  id: string;
  gatewayName: string;
  gatewayCode: string;
  gatewayType: string;
  status: number;
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 创建/更新参数接口
export interface IUpdateGatewayParams {
  id?: string;
  gatewayName: string;
  gatewayCode: string;
  gatewayType: string;
  status?: number;
}

// 获取网关列表
export const getGatewaysRequest = (params: IQueryGatewaysParams) => {
  return request.post<AxiosResponse<IHasTotalResponse<IGatewayResponse[]>>>({
    url: '/iot/gateway/query',
    data: params,
  });
};

// 创建网关
export const createGatewayRequest = (params: IUpdateGatewayParams) => {
  return request.post<AxiosResponse<null>>({
    url: '/iot/gateway',
    data: params,
  });
};

// 更新网关
export const updateGatewayRequest = (id: string, params: IUpdateGatewayParams) => {
  return request.patch<AxiosResponse<null>>({
    url: `/iot/gateway/update/${id}`,
    data: params,
  });
};

// 批量删除网关
export const deleteGatewayRequest = (ids: string[]) => {
  return request.delete({
    url: '/iot/gateway/batch-delete',
    data: ids,
  });
};

// 导出网关
export const exportGatewayRequest = (selectedIds: string[]) => {
  return request.post({
    url: '/iot/gateway/export',
    data: { ids: selectedIds },
    responseType: 'blob',
  });
};