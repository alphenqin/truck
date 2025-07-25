import { useEffect, useState } from 'react';
import {
  getIoRecordPanelStatsV2Request,
  IPanelStatsV2Response,
} from '@/service/api/ioRecord/index';

// 定义 IoRecordPanel 的自定义 Hook
export const useIoRecordPanelData = () => {
  const [lastHourInbound, setLastHourInbound] = useState(0);
  const [lastHourOutbound, setLastHourOutbound] = useState(0);
  const [chartData, setChartData] = useState<Array<{ hour: string; count: number; type: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getIoRecordPanelStatsV2Request()
      .then(res => {
        if (res.data) {
          setLastHourInbound(res.data.lastHour.inbound || 0);
          setLastHourOutbound(res.data.lastHour.outbound || 0);
          // intervals为map，转为数组并按时间倒序排序
          const intervalsArr = Object.entries(res.data.intervals)
            .map(([hour, v]: [string, any]) => ({ hour, inbound: Number(v.inbound), outbound: Number(v.outbound) }))
            .sort((a, b) => b.hour.localeCompare(a.hour)); // 最新在前
          const data: Array<{ hour: string; count: number; type: string }> = [];
          intervalsArr.forEach(item => {
            data.push({ hour: item.hour, count: item.inbound, type: '入库' });
            data.push({ hour: item.hour, count: item.outbound, type: '出库' });
          });
          setChartData(data);
        }
      })
      .catch(() => {
        setLastHourInbound(0);
        setLastHourOutbound(0);
        setChartData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { lastHourInbound, lastHourOutbound, chartData, loading };
};
