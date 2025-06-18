import request from '@/service/request';
import { AxiosResponse } from 'axios';

// 分页参数接口
export interface IPage {
  limit: number;
  offset: number;
}

// 查询参数接口
export interface IQueryDepartmentsParams extends IPage {
  departmentId?: number;
  departmentName?: string;
  storeId?: number;
}

// 部门响应数据接口 - 对应 Go 的 Department 结构体
export interface IDepartmentsResponse {
  departmentId: number; // 自增主键
  departmentName: string;
  storeId: number;
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 创建/更新部门参数接口
export interface IUpdateDepartmentsParams {
  departmentName: string;
  storeId: number;
}

// 获取部门列表
export const getDepartmentsRequest = (params: IQueryDepartmentsParams) => {
  return request.post<AxiosResponse<IHasTotalResponse<IDepartmentsResponse[]>>>({
    url: '/base/department/query',
    data: params,
  });
};

// 创建部门
export const createDepartmentsRequest = (params: IUpdateDepartmentsParams) => {
  return request.post<AxiosResponse<null>>({
    url: '/base/department',
    data: params,
  });
};

// 更新部门
export const updateDepartmentsRequest = (departmentId: number, params: IUpdateDepartmentsParams) => {
  return request.patch<AxiosResponse<null>>({
    url: '/base/department/update',
    data: { ...params, departmentId },
  });
};

// 批量删除部门
export const deleteDepartmentsRequest = (ids: number[]) => {
  return request.delete({
    url: '/base/department/batch-delete',
    data: ids,
  });
};

// 导出部门
export const exportDepartmentsRequest = (selectedIds: number[]) => {
  return request.post({
    url: '/base/department/export',
    data: { ids: selectedIds },
    responseType: 'blob',
  });
};

// 资产类型映射
export const assetTypeMap: Record<number, string> = {
  1: '工装车',
  2: '牵引车',
};

// 资产状态映射
export const statusMap: Record<number, string> = {
  1: '正常在库',
  2: '正常出库',
  3: '异常待修',
  4: '维修中',
  5: '报废',
  6: '呆滞',
  7: '疑似丢失',
};
