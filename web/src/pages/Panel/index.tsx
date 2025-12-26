import React, { useMemo, useState } from 'react';
import { Row, Col, Card, Modal, Button, Input } from 'antd';
import { FullscreenOutlined, SearchOutlined } from '@ant-design/icons';
import { Column, Bar, Line } from '@ant-design/plots';
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

// 资产在库分布 mock 数据
const assetInStorageData = [
  { warehouse: '12号库', count: 25 },
  { warehouse: '14号库', count: 18 },
  { warehouse: '01号库', count: 10 },
  { warehouse: '03号库', count: 5 },
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

// 疑似丢失统计 mock 数据
const lostStatsColumnData = [
  { time: '1h', count: 2 },
  { time: '2h', count: 3 },
  { time: '3h', count: 1 },
  { time: '4h', count: 0 },
  { time: '5h', count: 1 },
  { time: '6h', count: 2 },
  { time: '7h', count: 0 },
  { time: '8h', count: 1 },
];

// 资产状态趋势 mock 数据
const assetStatusTrendData = [
  { time: '08:00', statusType: '维修数量', value: 2 },
  { time: '08:00', statusType: '报废数量', value: 0 },
  { time: '09:00', statusType: '维修数量', value: 3 },
  { time: '09:00', statusType: '报废数量', value: 1 },
  { time: '10:00', statusType: '维修数量', value: 5 },
  { time: '10:00', statusType: '报废数量', value: 2 },
  { time: '11:00', statusType: '维修数量', value: 4 },
  { time: '11:00', statusType: '报废数量', value: 1 },
  { time: '12:00', statusType: '维修数量', value: 6 },
  { time: '12:00', statusType: '报废数量', value: 3 },
];

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

  // 配置 Card 和 Chart 的通用样式
  const kpiStats = useMemo(() => {
    const totalAssets = assetStatusColumnData.reduce((sum, item) => sum + item.count, 0);
    const inStorage = assetStatusColumnData
      .filter((item) => item.status.includes('在库'))
      .reduce((sum, item) => sum + item.count, 0);
    const lostTotal = lostStatsColumnData.reduce((sum, item) => sum + item.count, 0);
    return { totalAssets, inStorage, lostTotal };
  }, []);

  // "资产状态" Column 图表配置
  const assetStatusColumnConfig = {
    data: assetStatusColumnData,
    xField: 'status',
    yField: 'count',
    colorField: 'type', // 根据资产类型进行颜色区分
    group: true, // 启用分组
    isStack: false, // 不堆叠，而是并排显示
    style: {
      inset: 5,
    },
    color: ['#2563eb', '#22c55e'],
    xAxis: {
      title: null,
      label: { autoRotate: false },
    },
    yAxis: {
      title: null,
      min: 0,
    },
    label: false,
    tooltip: { shared: true },
    legend: { position: 'top-right' },
    height: 220,
  };

  // "资产在库分布" Column 图表配置
  const assetInStorageColumnConfig = {
    data: assetInStorageData,
    xField: 'warehouse', // 场库号
    yField: 'count', // 资产数量
    axis: {
      x: { title: null, label: { autoRotate: false } },
      y: { title: null, labelFormatter: (value: number) => value.toFixed(0), min: 0 },
    },
    style: {
      radiusTopLeft: 10,
      radiusTopRight: 10,
    },
    tooltip: { shared: true },
    height: 220,
    color: '#6366f1',
  };

  // 过滤后的资产停留分布数据
  const filteredAssetStayData = assetStayBarData.filter(
    (item) => item.asset.includes(searchTermAssetStay)
  );

  // "资产停留分布" Bar 图表配置
  const assetStayBarConfig = {
    data: filteredAssetStayData, // 使用过滤后的数据
    xField: 'location', // x轴是停留地点
    yField: ['endTime', 'startTime'], // y轴是时间段
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
    tooltip: { shared: true },
    legend: false,
    height: 220,
  };

  // "疑似丢失统计" Column 图表配置
  const lostStatsColumnConfig = {
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
    tooltip: { shared: true },
    height: 220,
    color: '#ef4444',
  };

  // "资产状态趋势" Line 图表配置
  const assetStatusTrendConfig = {
    data: assetStatusTrendData,
    xField: 'time',
    yField: 'value',
    seriesField: 'statusType', // 根据状态类型区分不同的线
    color: ({ statusType }: { statusType: string }) => {
      if (statusType === '维修数量') {
        return '#f59e0b';
      }
      return '#ef4444';
    },
    point: {
      shapeField: 'circle',
      sizeField: 4,
    },
    interaction: { // 交互配置
      tooltip: {
        marker: false, // tooltip 不显示 marker
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
  };

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
  const aggregatedCirculationData = getAggregatedCirculationData(circulationAnalysisData);

  // "流转分析" Column 图表配置
  const circulationAnalysisConfig = {
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
    tooltip: { shared: true },
    legend: false,
    height: 220,
    color: ['#22c55e', '#ef4444'],
  };

  // 处理放大按钮点击事件
  const handleMaximize = (title: string, chartConfig: any, chartType: string) => {
    setModalTitle(title);
    const maximizedConfig = { ...chartConfig, height: 500, tooltip: false };
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

  // 处理搜索框内容变化
  const handleSearchAssetStay = (value: string) => {
    setSearchTermAssetStay(value);
  };

  const handleSearchCirculation = (value: string) => {
    setSearchTermCirculation(value);
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
              onSearch={handleSearchAssetStay}
              onChange={(e) => setSearchTermAssetStay(e.target.value)}
              className="panel-search"
              allowClear
            />
          )}
          {showSearch === 'circulation' && (
            <Input.Search
              placeholder="搜索网关"
              onSearch={handleSearchCirculation}
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
      {/* 根据类型渲染图表 */}
      {type === 'Column' && <Column {...config} />}
      {type === 'Bar' && <Bar {...config} />}
      {type === 'Line' && <Line {...config} />}
      {type === 'Placeholder' && (
        <div style={{ height: 'calc(100% - 40px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
          图表内容占位
        </div>
      )}
    </Card>
  );

  return (
    <div className="panel-page">
      <div className="panel-hero">
        <div>
          <div className="panel-title">资产看板</div>
          <div className="panel-subtitle">实时掌握资产分布与状态趋势</div>
        </div>
        <div className="panel-hero-actions">
          <Input
            placeholder="全局搜索资产编号"
            prefix={<SearchOutlined />}
            className="panel-hero-search"
            allowClear
          />
        </div>
      </div>

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
            <div className="panel-kpi-footnote">近 8 小时累计</div>
          </div>
        </Col>
      </Row>

      <Row gutter={[20, 20]} className="panel-chart-row">
        {/* 第一行 */}
        <Col xs={24} md={8}>
          {renderChartCard('资产状态', assetStatusColumnConfig, 'Column')}
        </Col>
        <Col xs={24} md={8}>
          {renderChartCard('资产在库分布', assetInStorageColumnConfig, 'Column')} {/* 使用 Column 组件 */}
        </Col>
        <Col xs={24} md={8}>
          {renderChartCard('资产停留分布', assetStayBarConfig, 'Bar', 'assetStay')} {/* 为此卡片添加搜索框 */}
        </Col>
      </Row>
      <Row gutter={[20, 20]} className="panel-chart-row">
        <Col xs={24} md={8}>
          {renderChartCard('疑似丢失统计', lostStatsColumnConfig, 'Column')} {/* 使用 Column 组件 */}
        </Col>
        <Col xs={24} md={8}>
          {renderChartCard('资产状态趋势', assetStatusTrendConfig, 'Line')} {/* 使用 Line 组件 */}
        </Col>
        <Col xs={24} md={8}>
          {renderChartCard('流转分析', circulationAnalysisConfig, 'Column', 'circulation')} {/* 使用 Column 组件和新的搜索框 */}
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
        bodyStyle={{ height: '75vh', overflowY: 'auto' }} // 移除 flex 布局属性
      >
        {modalChartType === 'Column' && modalChartConfig && <Column {...modalChartConfig} />}
        {modalChartType === 'Bar' && modalChartConfig && <Bar {...modalChartConfig} />}
        {modalChartType === 'Line' && modalChartConfig && <Line {...modalChartConfig} />}
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
