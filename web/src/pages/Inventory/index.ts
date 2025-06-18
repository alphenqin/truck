import request from '@/service/request';
import { AxiosResponse } from 'axios';

export const statusMap: Record<number, string> = {
     1: '正常在库',
     2: '正常出库',
     3: '异常待修',
     4: '维修中',
     5: '报废',
     6: '呆滞',
     7: '疑似丢失',
   };

// 资产类型映射
export const assetTypeMap: Record<number, string> = {
     1: '工装车',
     2: '牵引车',
   };

// 分页参数接口
export interface IPage {
     limit: number;
     offset: number;
   }
   
   // 查询参数接口
   export interface IQueryAssetParams extends IPage {
     assetCode?: string;
   }
   
   // 资产响应数据接口 - 对应 Go 的 Asset 结构体
   export interface IAssetResponse {
     assetId: number; // 自增主键
     assetCode: string;
     assetType: number;
     status: number;
     createdAt: string;
     updatedAt: string;
   }
   
   // 带总数的响应数据接口
   export interface IHasTotalResponse<T> {
     total: number;
     list: T;
   }

   // 获取资产列表
export const getAssetRequest = (params: IQueryAssetParams) => {
     return request.post<AxiosResponse<IHasTotalResponse<IAssetResponse[]>>>({
       url: '/asset/query',
       data: params,
     });
   };


// 修改资产状态请求参数
export interface IUpdateAssetStatusParams {
  assetId: number; // 资产ID
  status: number; // 新状态 (3: 报修, 5: 报废)
}
// 修改资产状态响应数据
export interface IUpdateAssetStatusResponse {
  code: number; // 响应码 (200: 成功, other: 失败)
  msg: string; // 响应消息
  data: any; // 根据后端返回，这里可以是null或其他类型
}

// 修改资产状态
export const updateAssetStatus = (params: IUpdateAssetStatusParams) => {
  return request.post<IUpdateAssetStatusResponse>({
    url: '/asset/update/type',
    data: params,
  });
};