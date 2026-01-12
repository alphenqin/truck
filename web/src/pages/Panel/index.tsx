import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Card, Modal, Button, Input } from 'antd';
import { FullscreenOutlined } from '@ant-design/icons';
import { Column, Bar, Line, Pie } from '@ant-design/plots';
import dayjs from 'dayjs';
import { getInventoryStatusTrend24hRequest, IInventoryStatusTrendItem } from '@/service/api/inventory';
import { getAssetStatusStatisticsRequest, getInStorageDistributionRequest } from '@/service/api/asset';
import './index.css';

// 资产状态图表 mock 数据
const assetStatusColumnData = [
  { status: '正常在库', type: '工装车', count: 8 },
  { status: '正常在库', type: '牵引车', count: 5 },
  { status: '正常出库', type: '工装车', count: 3 },
  { status: '正常出库', type: '牵引车', count: 2 },
  { status: '异常待修', type: '工装车', count: 1 },
  { status: '异常待修', type: '牵引车', count: 1 },
  { status: '维修中', type: '工装车', count: 2 },
  { status: '维修中', type: '牵引车', count: 1 },
  { status: '报废', type: '工装车', count: 1 },
  { status: '报废', type: '牵引车', count: 0 },
  { status: '呆滞', type: '工装车', count: 1 },
  { status: '呆滞', type: '牵引车', count: 0 },
  { status: '疑似丢失', type: '工装车', count: 0 },
  { status: '疑似丢失', type: '牵引车', count: 1 },
];

// 资产停留分布 Bar 图 mock 数据
// 模拟单个工装车/牵引车在特定地点停留的时间段
const assetStayBarData = [
  { asset: '工装车-A001', location: '12号库', type: '工装车', startTime: 8, endTime: 12 },
  { asset: '工装车-A001', location: '大门A', type: '工装车', startTime: 13, endTime: 13.5 },
  { asset: '牵引车-B002', location: '14号库', type: '牵引车', startTime: 9, endTime: 11 },
  { asset: '牵引车-B002', location: '大门B', type: '牵引车', startTime: 11.5, endTime: 12 },
  { asset: '工装车-A003', location: '12号库', type: '工装车', startTime: 10, endTime: 14 },
  { asset: '牵引车-B004', location: '维修车间', type: '牵引车', startTime: 14, endTime: 16 },
];

// 疑似丢失统计 mock 数据（近 24 小时）
const lostStatsColumnData = [
  { time: '1h', count: 2 },
  { time: '2h', count: 3 },
  { time: '3h', count: 1 },
  { time: '4h', count: 0 },
  { time: '5h', count: 1 },
  { time: '6h', count: 2 },
  { time: '7h', count: 0 },
  { time: '8h', count: 1 },
  { time: '9h', count: 2 },
  { time: '10h', count: 1 },
  { time: '11h', count: 0 },
  { time: '12h', count: 2 },
  { time: '13h', count: 1 },
  { time: '14h', count: 3 },
  { time: '15h', count: 2 },
  { time: '16h', count: 1 },
  { time: '17h', count: 0 },
  { time: '18h', count: 2 },
  { time: '19h', count: 1 },
  { time: '20h', count: 0 },
  { time: '21h', count: 1 },
  { time: '22h', count: 2 },
  { time: '23h', count: 1 },
  { time: '24h', count: 0 },
];

const inventoryStatusMap: Record<number, string> = {
  1: '正常在库',
  2: '正常出库',
  3: '异常待修',
  4: '维修中',
  5: '报废',
  6: '呆滞',
  7: '疑似丢失',
};

const statusColorMap: Record<string, string> = {
  正常在库: '#2563eb',
  正常出库: '#22c55e',
  异常待修: '#f59e0b',
  维修中: '#f97316',
  报废: '#ef4444',
  呆滞: '#64748b',
  疑似丢失: '#0ea5e9',
};
const statusColorDomain = Object.keys(statusColorMap);
const statusColorRange = statusColorDomain.map((key) => statusColorMap[key]);


// 流转分析 mock 数据
const circulationAnalysisData = [
  { type: '入库', count: 10, gateway: 'GW001' },
  { type: '出库', count: 5, gateway: 'GW001' },
  { type: '入库', count: 8, gateway: 'GW002' },
  { type: '出库', count: 7, gateway: 'GW002' },
  { type: '入库', count: 12, gateway: 'GW003' },
  { type: '出库', count: 6, gateway: 'GW003' },
];

const PanelPage: React.FC = () => {
  // 控制模态框的显示与隐藏
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 存储当前放大卡片的标题
  const [modalTitle, setModalTitle] = useState('');
  const [modalChartConfig, setModalChartConfig] = useState<any>(null); // 存储模态框中要显示的图表配置
  const [modalChartType, setModalChartType] = useState(''); // 存储模态框中要显示的图表类型

  // 搜索框状态
  const [searchTermAssetStay, setSearchTermAssetStay] = useState('');
  const [searchTermCirculation, setSearchTermCirculation] = useState('');
  const [assetStatusTrendData, setAssetStatusTrendData] = useState<{ time: string; statusType: string; value: number }[]>([]);
  const [assetStatusTrendLoading, setAssetStatusTrendLoading] = useState(false);
  const [assetStatusData, setAssetStatusData] = useState<{ status: string; count: number }[]>([]);
  const [assetStatusLoading, setAssetStatusLoading] = useState(false);
  const [inStorageData, setInStorageData] = useState<{ store: string; count: number }[]>([]);
  const [inStorageLoading, setInStorageLoading] = useState(false);

  useEffect(() => {
    const fetchTrend = async () => {
      setAssetStatusTrendLoading(true);
      try {
        const res: any = await getInventoryStatusTrend24hRequest();
        const list = (res?.data?.list || []) as IInventoryStatusTrendItem[];
        const now = dayjs();
        const timeKeys: string[] = [];
        const timeLabelMap = new Map<string, string>();
        for (let i = 11; i >= 0; i -= 1) {
          const key = now.subtract(i, 'hour').format('YYYY-MM-DD HH:00');
          const label = `${i + 1}h`;
          timeKeys.push(key);
          timeLabelMap.set(key, label);
        }
        const countMap = new Map<string, number>();
        list.forEach((item) => {
          const key = `${item.time}|${item.inventoryStatus}`;
          countMap.set(key, (countMap.get(key) || 0) + Number(item.count || 0));
        });
        const statusKeys = Object.keys(inventoryStatusMap).map(Number);
        const data = timeKeys.flatMap((time) =>
          statusKeys.map((status) => ({
            time: timeLabelMap.get(time) || time,
            statusType: inventoryStatusMap[status],
            value: countMap.get(`${time}|${status}`) || 0,
          }))
        );
        setAssetStatusTrendData(data);
      } finally {
        setAssetStatusTrendLoading(false);
      }
    };
    fetchTrend();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      setAssetStatusLoading(true);
      try {
        const res: any = await getAssetStatusStatisticsRequest();
        const list = res?.data?.list || res?.data?.data?.list || [];
        const data = list.map((item: { status: number; count: number }) => ({
          status: inventoryStatusMap[item.status] || String(item.status),
          count: Number(item.count || 0),
        }));
        setAssetStatusData(data);
      } finally {
        setAssetStatusLoading(false);
      }
    };

    const fetchInStorage = async () => {
      setInStorageLoading(true);
      try {
        const res: any = await getInStorageDistributionRequest();
        const list = res?.data?.list || res?.data?.data?.list || [];
        const data = list.map((item: { storeName: string; count: number }) => ({
          store: item.storeName || '未分配',
          count: Number(item.count || 0),
        }));
        setInStorageData(data);
      } finally {
        setInStorageLoading(false);
      }
    };

    fetchStatus();
    fetchInStorage();
  }, []);

  // KPI 统计
  const kpiStats = useMemo(() => {
    const totalAssets = assetStatusColumnData.reduce((sum, item) => sum + item.count, 0);
    const inStorage = assetStatusColumnData
      .filter((item) => item.status.includes('在库'))
      .reduce((sum, item) => sum + item.count, 0);
    const lostTotal = lostStatsColumnData.reduce((sum, item) => sum + item.count, 0);
    return { totalAssets, inStorage, lostTotal };
  }, []);

  // "资产状态" Column 图表配置
  const assetStatusColumnConfig = useMemo(() => ({
    data: assetStatusData,
    xField: 'status',
    yField: 'count',
    style: {
      inset: 5,
    },
    color: '#2563eb',
    xAxis: {
      title: null,
      label: { autoRotate: false },
    },
    yAxis: {
      title: null,
      min: 0,
    },
    label: false,
    tooltip: true,
    interaction: {
      tooltip: {
        shared: true,
      },
    },
    legend: { position: 'top-right' },
    height: 220,
  }), [assetStatusData]);

  // "资产在库分布" Pie 图表配置
  const assetInStoragePieConfig = useMemo(() => ({
    data: inStorageData,
    angleField: 'count',
    colorField: 'store',
    radius: 0.9,
    innerRadius: 0.55,
    label: false,
    tooltip: true,
    interaction: {
      tooltip: {},
    },
    legend: { position: 'bottom' },
    height: 220,
  }), [inStorageData]);

  // 过滤后的资产停留分布数据
  const filteredAssetStayData = useMemo(() => (
    assetStayBarData.filter((item) => item.asset.includes(searchTermAssetStay))
  ), [searchTermAssetStay]);

  // "资产停留分布" Bar 图表配置
  const assetStayBarConfig = useMemo(() => ({
    data: filteredAssetStayData, // 使用过滤后的数据
    xField: 'location', // x轴是停留地点
    yField: ['startTime', 'endTime'], // y轴是时间段
    colorField: 'location', // 根据停留地点区分颜色
    style: {
      inset: 5,
    },
    xAxis: {
      title: null,
      label: { autoRotate: false },
    },
    yAxis: {
      title: null,
      label: { autoRotate: true },
      min: 0,
      max: 24, // 假设时间范围是0-24小时
    },
    label: false,
    tooltip: true,
    interaction: {
      tooltip: {
        shared: true,
      },
    },
    legend: false,
    height: 220,
  }), [filteredAssetStayData]);

  // "疑似丢失统计" Column 图表配置
  const lostStatsColumnConfig = useMemo(() => ({
    data: lostStatsColumnData,
    xField: 'time', // X轴为时间间隔
    yField: 'count', // Y轴为数量
    axis: {
      x: {
        title: null,
        label: { autoRotate: false }, // 不自动旋转，保持水平
      },
      y: {
        title: null,
        labelFormatter: (value: number) => value.toFixed(0),
        min: 0,
      },
    },
    style: {
      radiusTopLeft: 10,
      radiusTopRight: 10,
    },
    tooltip: true,
    interaction: {
      tooltip: {
        shared: true,
      },
    },
    height: 220,
    color: '#ef4444',
  }), []);

  // "资产状态趋势" Line 图表配置
  const assetStatusTrendConfig = useMemo(() => ({
    data: assetStatusTrendData,
    xField: 'time',
    yField: 'value',
    seriesField: 'statusType', // 根据状态类型区分不同的线
    colorField: 'statusType',
    scale: {
      color: {
        domain: statusColorDomain,
        range: statusColorRange,
      },
    },
    point: {
      shapeField: 'circle',
      sizeField: 4,
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 2, // 线宽
    },
    xAxis: {
      title: null,
      label: { autoRotate: false },
    },
    yAxis: {
      title: null,
      min: 0,
    },
    label: false,
    legend: {
      position: 'top-right',
      itemMarker: 'circle',
    },
    height: 220,
  }), [assetStatusTrendData]);

  // 聚合流转分析数据
  const getAggregatedCirculationData = (data: typeof circulationAnalysisData) => {
    const filteredData = data.filter(item => item.gateway.includes(searchTermCirculation));
    const aggregated: { [key: string]: number } = { '入库': 0, '出库': 0 };
    filteredData.forEach(item => {
      aggregated[item.type] += item.count;
    });
    return Object.keys(aggregated).map(type => ({
      type,
      count: aggregated[type],
    }));
  };
  const aggregatedCirculationData = useMemo(
    () => getAggregatedCirculationData(circulationAnalysisData),
    [searchTermCirculation]
  );

  // "流转分析" Column 图表配置
  const circulationAnalysisConfig = useMemo(() => ({
    data: aggregatedCirculationData,
    xField: 'type',
    yField: 'count',
    colorField: 'type',
    style: {
      radiusTopLeft: 10,
      radiusTopRight: 10,
      inset: 5,
    },
    xAxis: {
      title: null,
      label: { autoRotate: false },
    },
    yAxis: {
      title: null,
      labelFormatter: (value: number) => value.toFixed(0),
      min: 0,
    },
    label: false,
    tooltip: true,
    interaction: {
      tooltip: {
        shared: true,
      },
    },
    legend: false,
    height: 220,
    color: ['#22c55e', '#ef4444'],
  }), [aggregatedCirculationData]);

  // 处理放大按钮点击事件
  const handleMaximize = (title: string, chartConfig: any, chartType: string) => {
    setModalTitle(title);
    const maximizedConfig = { ...chartConfig, height: 520 };
    setModalChartConfig(maximizedConfig);
    setModalChartType(chartType);
    setIsModalVisible(true);
  };

  // 处理模态框关闭事件
  const handleCancel = () => {
    setIsModalVisible(false);
    setModalTitle('');
    setModalChartConfig(null);
    setModalChartType('');
  };

  const renderEmpty = (height?: number) => (
    <div className="panel-empty" style={{ height: height || 220 }}>
      暂无数据
    </div>
  );

  const renderChartContent = (type: string, config: any) => {
    const data = config?.data as unknown[] | undefined;
    const height = config?.height as number | undefined;
    if (!data || data.length === 0) {
      return renderEmpty(height);
    }
    if (type === 'Column') return <Column {...config} />;
    if (type === 'Bar') return <Bar {...config} />;
    if (type === 'Line') return <Line {...config} />;
    if (type === 'Pie') return <Pie {...config} />;
    return null;
  };

  // 渲染每个图表卡片的辅助函数
  const renderChartCard = (title: string, config: any, type: string, showSearch: 'assetStay' | 'circulation' | false = false) => (
    <Card className="panel-card" styles={{ body: { padding: 16 } }}>
      <div className="panel-card-header">
        <div className="panel-card-title">{title}</div>
        <div className="panel-card-actions">
          {showSearch === 'assetStay' && (
            <Input.Search
              placeholder="搜索资产编号"
              onChange={(e) => setSearchTermAssetStay(e.target.value)}
              className="panel-search"
              allowClear
            />
          )}
          {showSearch === 'circulation' && (
            <Input.Search
              placeholder="搜索网关"
              onChange={(e) => setSearchTermCirculation(e.target.value)}
              className="panel-search"
              allowClear
            />
          )}
          <Button
            type="text"
            icon={<FullscreenOutlined />}
            onClick={() => handleMaximize(title, config, type)}
            className="panel-icon-btn"
          />
        </div>
      </div>
      {renderChartContent(type, config)}
      {type === 'Placeholder' && (
        <div style={{ height: 'calc(100% - 40px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
          图表内容占位
        </div>
      )}
    </Card>
  );

  return (
    <div className="panel-page">
      <Row gutter={[12, 12]} className="panel-kpi-row">
        <Col xs={24} md={8}>
          <div className="panel-kpi-card">
            <div className="panel-kpi-label">资产总量</div>
            <div className="panel-kpi-value">{kpiStats.totalAssets}</div>
            <div className="panel-kpi-footnote">包含工装车与牵引车</div>
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="panel-kpi-card">
            <div className="panel-kpi-label">在库资产</div>
            <div className="panel-kpi-value">{kpiStats.inStorage}</div>
            <div className="panel-kpi-footnote">正常在库 + 维修在库</div>
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="panel-kpi-card panel-kpi-alert">
            <div className="panel-kpi-label">疑似丢失</div>
            <div className="panel-kpi-value">{kpiStats.lostTotal}</div>
            <div className="panel-kpi-footnote">近 24 小时累计</div>
          </div>
        </Col>
      </Row>

      <Row gutter={[20, 20]} className="panel-chart-row">
        <Col xs={24} md={16}>
          {renderChartCard(
            `资产状态趋势${assetStatusTrendLoading ? '（加载中）' : ''}`,
            assetStatusTrendConfig,
            'Line'
          )}
        </Col>
        <Col xs={24} md={8}>
          {renderChartCard('疑似丢失统计', lostStatsColumnConfig, 'Column')}
        </Col>
      </Row>
      <Row gutter={[20, 20]} className="panel-chart-row">
        <Col xs={24} md={16}>
          {renderChartCard(
            `资产状态${assetStatusLoading ? '（加载中）' : ''}`,
            assetStatusColumnConfig,
            'Column'
          )}
        </Col>
        <Col xs={24} md={8}>
          {renderChartCard('流转分析', circulationAnalysisConfig, 'Column', 'circulation')}
        </Col>
      </Row>
      <Row gutter={[20, 20]} className="panel-chart-row">
        <Col xs={24} md={8}>
          {renderChartCard(
            `资产在库分布${inStorageLoading ? '（加载中）' : ''}`,
            assetInStoragePieConfig,
            'Pie'
          )}
        </Col>
        <Col xs={24} md={16}>
          {renderChartCard('资产停留分布', assetStayBarConfig, 'Bar', 'assetStay')}
        </Col>
      </Row>

      {/* 放大内容的模态框 */}
      <Modal
        title={modalTitle}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="80vw"
        centered
        maskClosable={true}
        style={{ top: 20 }}
        styles={{ body: { height: '75vh', overflowY: 'auto' } }} // 移除 flex 布局属性
      >
        {modalChartConfig && renderChartContent(modalChartType, modalChartConfig)}
        {modalChartType === 'Placeholder' && (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 'bold' }}>
            图表内容占位
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PanelPage;
