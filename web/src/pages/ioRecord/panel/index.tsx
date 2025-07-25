import { FC } from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
// import { Column } from '@ant-design/charts'; // Remove @ant-design/charts Column import
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
// } from 'recharts'; // Remove Recharts imports

// Import Chart.js and react-chartjs-2 components
// import { Bar } from 'react-chartjs-2'; // Remove Chart.js import
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js'; // Remove Chart.js import

// Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// ); // Remove Chart.js registration

import { Column } from '@ant-design/plots';

import {
  // getIoRecordPanelStatsRequest, // 导入获取面板统计数据的请求函数 - Moved to hook
  // IPanelStatsResponse, // 导入面板统计响应接口 - Used in hook
  // IHourlyInterval, // 导入小时统计区间接口 - Used in hook
} from '@/service/api/ioRecord/index';
import dayjs from 'dayjs'; // 导入 dayjs 库用于日期时间处理
import 'dayjs/locale/zh-cn'; // 导入中文语言包

dayjs.locale('zh-cn'); // 设置 dayjs 语言为中文

// 导入自定义 Hook
import { useIoRecordPanelData } from './hooks';

// 定义 IoRecordPanel 函数式组件
const IoRecordPanel: FC = () => {
  // 使用自定义 Hook获取数据和状态
  const { lastHourInbound, lastHourOutbound, chartData, loading } = useIoRecordPanelData();

  // 适配@ant-design/plots的Column数据结构
  const plotData = chartData.map(item => ({
    hour: item.hour,
    type: item.type,
    value: item.count,
  }));

  const config = {
    data: plotData,
    isGroup: true,
    xField: 'hour',
    yField: 'value',
    seriesField: 'type',
    group: { padding: 0 },
    color: ({ type }: { type: string }) => (type === '入库' ? '#5B8FF9' : '#5AD8A6'),
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
        formatter: (text: string) => (typeof text === 'string' ? text.slice(11, 13) : text),
      },
    },
    tooltip: false,
    label: {
      position: 'top',
      style: {
        fill: '#333',
        fontWeight: 500,
      },
      formatter: (datum: any) => (typeof datum.value === 'number' && datum.value !== 0 ? datum.value : ''),
    },
    legend: { position: 'top' },
    height: 300,
  };

  // Component render JSX
  return (
    <Card style={{ width: '100%' }}>
      <Spin spinning={loading}>
        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <Statistic title="最近1小时入库数量" value={lastHourInbound} />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic title="最近1小时出库数量" value={lastHourOutbound} />
            </Card>
          </Col>
        </Row>
        <div style={{ marginTop: 20 }}>
          <h3>最近24小时出入库数量（小时统计）</h3>
          {plotData.length > 0 ? (
            <div style={{ height: '320px' }}>
              <Column {...config} />
            </div>
          ) : (
            <p>暂无数据</p>
          )}
        </div>
      </Spin>
    </Card>
  );
};

export default IoRecordPanel;
  
  