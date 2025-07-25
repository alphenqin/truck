import request from '@/service/request';
import { AxiosResponse } from 'axios';

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

// 资产状态统计项接口
export interface IAssetAssetStatusStatistic {
  status: number; // 资产状态ID
  count: number; // 资产数量
}

// 资产状态统计接口响应
export interface IAssetStatusStatisticsResponse {
  list: IAssetAssetStatusStatistic[];
}

// 获取资产状态统计 (实际接口)
export const getAssetStatusStatistics = () => {
  return request.get<AxiosResponse<IAssetStatusStatisticsResponse>>({
    url: '/asset/status', // 请替换为实际的后端接口地址
  });
};