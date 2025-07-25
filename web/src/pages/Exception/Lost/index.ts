import request from '@/service/request';
import { AxiosResponse } from 'axios';

// 分页参数接口
export interface IPage {
  limit: number;
  offset: number;
}

// 查询参数接口
export interface IQueryLostAssetParams extends IPage {
  hours?: number;      // 往前推多少小时
}

// 操作类型映射
export const actionTypeMap: Record<number, string> = {
  1: '入库',
  2: '出库',
};

// 异常资产记录接口
export interface ILostAssetRecord {
  assetId: number;     // 资产ID
  actionType: number;  // 操作类型
  actionTime: string;  // 操作时间
  storeFrom: number;   // 起始场库
  storeTo: number;     // 目标场库
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
  total: number;
  list: T;
}

// 获取异常资产列表
export const getLostAssetList = (params: IQueryLostAssetParams) => {
  return request.post<{
    code: number;
    msg: string;
    data: IHasTotalResponse<ILostAssetRecord[]>;
  }>({
    url: '/asset/exception/lost',
    data: params,
  });
};
