import { useEffect, useState } from 'react';
import {
  getIoRecordPanelStatsRequest, // 导入获取面板统计数据的请求函数
  IPanelStatsResponse, // 导入面板统计响应接口
  IHourlyInterval, // 导入小时统计区间接口
} from '@/service/api/ioRecord/index';

// 定义 IoRecordPanel 的自定义 Hook
export const useIoRecordPanelData = () => {
  // 定义状态变量
  const [panelStats, setPanelStats] = useState<IPanelStatsResponse | null>(null); // 存储面板统计数据
  // 更新 chartData 状态类型以匹配使用时间字符串
  const [chartData, setChartData] = useState<Array<{ time: string; count: number; type: string }>>([]); // 存储用于图表的数据，time 为时间字符串
  const [loading, setLoading] = useState(true); // 存储加载状态

  // 副作用钩子，在组件挂载后执行，用于获取数据
  useEffect(() => {
    setLoading(true); // 设置加载状态为 true
    // 调用 API 获取面板统计数据
    getIoRecordPanelStatsRequest()
      .then(res => {
        // console.log("res", res) // 移除 console.log
        // 数据获取成功
        if (res.data) {
          setPanelStats(res.data); // 更新面板统计数据状态
          // 将后端返回的 intervals 数据转换为图表所需格式
          const transformedData = res.data.intervals.flatMap(item => [
            { time: item.startTime, count: item.inboundCount ?? 0, type: '入库' }, // 入库数据，time 为时间字符串
            { time: item.startTime, count: item.outboundCount ?? 0, type: '出库' }, // 出库数据，time 为时间字符串
          ]);
          // 按时间字符串对数据进行排序
          transformedData.sort((a, b) => a.time.localeCompare(b.time)); // 直接比较时间字符串排序
        //   console.log('Data sent to chart:', transformedData); // 移除 console.log
          setChartData(transformedData); // 更新图表数据状态
        }
      })
      .catch(error => {
        // 数据获取失败
        console.error('Error fetching panel stats:', error); // 打印错误信息
        setPanelStats(null); // 重置面板统计数据状态
        setChartData([]); // 重置图表数据状态
      })
      .finally(() => {
        setLoading(false); // 设置加载状态为 false
      });
  }, []); // 依赖项为空数组，表示只在组件挂载时执行一次

  // 返回状态和数据
  return { panelStats, chartData, loading };
};
