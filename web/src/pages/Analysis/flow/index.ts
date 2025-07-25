import request from '@/service/request';
import { AxiosResponse } from 'axios';

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

// 操作类型映射
export const operationTypeMap: Record<number, string> = {
  1: '入库',
  2: '出库',
};

// 工装车出入库记录接口
export interface IAssetOperationRecordRes {
  assetId: number;
  assetCode: string;
  actionType: number;
  actionTime: string;
  storeTo: number; // 目标仓库
  storeFrom: number; // 起始仓库
}

// 分页参数接口
export interface IPage {
     limit: number;
     offset: number;
}

// 带总数的响应数据接口
export interface IHasTotalResponse<T> {
     total: number;
     list: T;
   }
   
// 查询参数接口
export interface IGetAssetOperationRecordsParams extends IPage {
     assetCode: string;
     startTime: string;
     endTime: string;
}

// 获取工装车出入库记录
export const getAssetOperationRecords = (params: IGetAssetOperationRecordsParams) => {
     return request.post<AxiosResponse<IHasTotalResponse<IAssetOperationRecordRes[]>>>({
       url: '/io-record/flow',
       data: params,
     });
   };

