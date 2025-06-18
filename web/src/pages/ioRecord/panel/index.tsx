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

import { Column } from '@ant-design/charts'; // Re-import @ant-design/charts Column

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
  const { chartData, loading } = useIoRecordPanelData();

  // Chart config for @ant-design/charts
  const chartConfig = {
    data: chartData, // 图表数据来源
    isGroup: true, // 设置为分组柱状图
    xField: 'time', // X 轴对应的字段 (时间字符串)
    yField: 'count', // Y 轴对应的字段
    seriesField: 'type', // 用于分组的字段 (入库/出库)
    groupOuterPadding: 0,
    tooltip: {
      // tooltip (鼠标悬停提示) 配置
      fields: ['time', 'type', 'count'],
      formatter: (data: { time: string; count: number; type: string }) => { // tooltip 格式化函数
        // console.log('Tooltip Data:', data); // Keep for debugging tooltip trigger
        const time = data?.time;
        const type = data?.type ?? '未知类型';
        const count = data?.count ?? 0;

        // Use dayjs to format the time string
        const formattedTime = time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '无效时间';
        return `<div>${formattedTime}</div><div>${type}: ${count}</div>`;
      }
    },
     xAxis: {
        label: {
            formatter: (text: string) => {
                 // Use dayjs to format the time string as HH:mm
                 return text ? dayjs(text).format('HH:mm') : text; // Show original text if invalid
            },
             rotate: -45,
             autoRotate: false,
        },
        type: 'time', // Set X axis type back to time for time-series data
        // Add tickCount or tickInterval if needed for better time axis rendering
        // tickCount: 24, // Attempt to show 24 ticks (for each hour)
        // tickInterval: 3600 * 1000, // Attempt to set interval to 1 hour in milliseconds (requires numeric time)
    },
    interactions: [{
      type: 'active-region',
      enable: false,
    }],
    // Add bottom padding to prevent X axis labels from being cut off
    appendPadding: [10, 0, 0, 0],
  };

  // Component render JSX
  return (
    <Card title="出入库统计面板" style={{ width: '100%' }}>
      <Spin spinning={loading}>
        <Row gutter={16}>
          <Col span={12}>
            <Card>
              {/* Calculate total inbound count from chartData */}
              <Statistic title="过去24小时总入库" value={chartData.filter(item => item.type === '入库').reduce((sum, item) => sum + (item.count ?? 0), 0)} />
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              {/* Calculate total outbound count from chartData */}
              <Statistic title="过去24小时总出库" value={chartData.filter(item => item.type === '出库').reduce((sum, item) => sum + (item.count ?? 0), 0)} />
            </Card>
          </Col>
        </Row>
        <div style={{ marginTop: 20 }}>
          <h3>过去24小时出入库数量（小时统计）</h3>
          {chartData.length > 0 ? (
             <div style={{ height: '300px' }}> {/* Add a container with height */}
                 <Column {...chartConfig} /> {/* Use @ant-design/charts Column */}
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
  