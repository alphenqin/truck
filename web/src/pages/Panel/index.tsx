import React, { useState } from 'react';
import { Row, Col, Card, Modal, Button, Input } from 'antd';
import { FullscreenOutlined, SearchOutlined } from '@ant-design/icons';
import { Column, Pie, Bar, Line } from '@ant-design/plots';

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
  // 存储当前放大卡片的内容（这里用字符串占位，实际可传组件）
  const [modalContentPlaceholder, setModalContentPlaceholder] = useState('');
  const [modalChartConfig, setModalChartConfig] = useState<any>(null); // 存储模态框中要显示的图表配置
  const [modalChartType, setModalChartType] = useState(''); // 存储模态框中要显示的图表类型

  // 新增状态：当前选择的资产编号
  const [selectedAssetForStay, setSelectedAssetForStay] = useState<string>('工装车-A001'); // 默认选择

  // 搜索框状态
  const [searchTermAssetStay, setSearchTermAssetStay] = useState('');
  const [searchTermCirculation, setSearchTermCirculation] = useState('');

  // 配置 Card 和 Chart 的通用样式
  const cardStyle = {
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    minHeight: 300, // 调整最小高度以适应更多卡片
    marginBottom: 4, // 调整卡片间距
  };

  const chartTitleContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  };

  const chartTitleTextStyle = {
    fontSize: 16,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

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
    xAxis: {
      title: { text: '状态类型' }, // X轴标题
      label: { autoRotate: true }, // 标签自动旋转
    },
    yAxis: {
      title: { text: '数量' }, // Y轴标题
      min: 0,
    },
    label: {
      position: 'top', // 数值标签位置
      style: {
        fill: '#000', // 调整标签颜色
        opacity: 0.8,
        fontSize: 10,
        fontWeight: 500,
      },
    },
    tooltip: false,
    legend: { position: 'top-left' }, // 图例位置
    height: 220, // 调整高度以适应卡片
  };

  // "资产在库分布" Column 图表配置
  const assetInStorageColumnConfig = {
    data: assetInStorageData,
    xField: 'warehouse', // 场库号
    yField: 'count', // 资产数量
    label: {
      text: (d: any) => `${d.count}`, // 直接显示数量
      textBaseline: 'bottom',
      style: { fontSize: 10, fontWeight: 500, fill: '#000' },
    },
    axis: {
      x: {
        title: { text: '场库号' },
        label: { autoRotate: true },
      },
      y: {
        title: { text: '资产数量' },
        labelFormatter: (value: number) => value.toFixed(0), // 格式化为整数
        min: 0,
      },
    },
    style: {
      radiusTopLeft: 10,
      radiusTopRight: 10,
    },
    tooltip: false, // 禁用 tooltip
    height: 220, // 调整高度以适应卡片
    color: '#1890ff', // 单一颜色
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
      title: { text: '停留地点' }, // X轴标题
      label: { autoRotate: true },
    },
    yAxis: {
      title: { text: '时间 (小时)' }, // Y轴标题
      label: { autoRotate: true },
      min: 0,
      max: 24, // 假设时间范围是0-24小时
    },
    label: {
      position: 'right', // 标签位置
      text: (d: any) => `${d.startTime.toFixed(1)}h-${d.endTime.toFixed(1)}h`, // 显示时间段
      style: {
        fill: '#000',
        opacity: 0.8,
        fontSize: 10,
        fontWeight: 500,
      },
    },
    tooltip: false, // 禁用 tooltip
    legend: { position: 'top-left' },
    height: 220,
  };

  // "疑似丢失统计" Column 图表配置
  const lostStatsColumnConfig = {
    data: lostStatsColumnData,
    xField: 'time', // X轴为时间间隔
    yField: 'count', // Y轴为数量
    label: {
      text: (d: any) => `${d.count}`, // 显示数量
      textBaseline: 'bottom',
      style: { fontSize: 10, fontWeight: 500, fill: '#000' },
    },
    axis: {
      x: {
        title: { text: '时间间隔' },
        label: { autoRotate: false }, // 不自动旋转，保持水平
      },
      y: {
        title: { text: '数量' },
        labelFormatter: (value: number) => value.toFixed(0),
        min: 0,
      },
    },
    style: {
      radiusTopLeft: 10,
      radiusTopRight: 10,
    },
    tooltip: false, // 禁用 tooltip
    height: 220,
    color: '#f5222d', // 设置颜色
  };

  // "资产状态趋势" Line 图表配置
  const assetStatusTrendConfig = {
    data: assetStatusTrendData,
    xField: 'time',
    yField: 'value',
    seriesField: 'statusType', // 根据状态类型区分不同的线
    color: ({ statusType }: { statusType: string }) => { // <--- 明确的颜色映射函数
      if (statusType === '维修数量') {
        return '#faad14'; // 黄色系
      }
      return '#f5222d'; // 红色系
    },
    point: {
      shapeField: 'square', // 方形点
      sizeField: 4, // 点大小
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
      title: { text: '时间' },
      label: { autoRotate: true },
    },
    yAxis: {
      title: { text: '数量' },
      min: 0,
    },
    label: { // 线条上的标签
      content: (d: any) => `${d.value}`, // 显示数值
      position: 'right', // 标签位置
      style: {
        fontSize: 10,
        fontWeight: 500,
        fill: '#000',
        opacity: 0.8,
      },
    },
    legend: { // 图例配置
      position: 'top-left', // 图例位置
      itemMarker: 'square', // 图例标记为方形
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
      title: { text: '' },
      label: { autoRotate: false },
    },
    yAxis: {
      title: { text: '数量' },
      labelFormatter: (value: number) => value.toFixed(0),
      min: 0,
    },
    label: {
      text: (d: any) => `${d.count}`,
      position: 'top',
      style: {
        fill: '#000',
        opacity: 0.8,
        fontSize: 10,
        fontWeight: 500,
      },
    },
    tooltip: false,
    legend: { position: 'top-left', itemMarker: 'square' },
    height: 220,
    color: ['#1890ff', '#f5222d'],
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
    setModalContentPlaceholder('');
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
    <Card style={cardStyle} styles={{ body: { padding: 16 } }}>
      <div style={chartTitleContainerStyle}>
        <div style={chartTitleTextStyle}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {showSearch === 'assetStay' && (
            <Input.Search
              placeholder="搜索资产编号"
              onSearch={handleSearchAssetStay}
              onChange={(e) => setSearchTermAssetStay(e.target.value)}
              style={{ width: 150 }}
              allowClear
            />
          )}
          {showSearch === 'circulation' && (
            <Input.Search
              placeholder="搜索网关"
              onSearch={handleSearchCirculation}
              onChange={(e) => setSearchTermCirculation(e.target.value)}
              style={{ width: 150 }}
              allowClear
            />
          )}
          <Button
            type="text"
            icon={<FullscreenOutlined />}
            onClick={() => handleMaximize(title, config, type)}
            style={{ cursor: 'pointer' }}
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
    <div style={{ background: '#f6f8fa', minHeight: '100vh', padding: 16 }}>
      <Row gutter={[8, 8]}> {/* 调整 gutter 保持紧凑 */}
        {/* 第一行 */}
        <Col span={8}>
          {renderChartCard('资产状态', assetStatusColumnConfig, 'Column')}
        </Col>
        <Col span={8}>
          {renderChartCard('资产在库分布', assetInStorageColumnConfig, 'Column')} {/* 使用 Column 组件 */}
        </Col>
        <Col span={8}>
          {renderChartCard('资产停留分布', assetStayBarConfig, 'Bar', 'assetStay')} {/* 为此卡片添加搜索框 */}
        </Col>
      </Row>
      <Row gutter={[8, 8]}> {/* 第二行 */}
        <Col span={8}>
          {renderChartCard('疑似丢失统计', lostStatsColumnConfig, 'Column')} {/* 使用 Column 组件 */}
        </Col>
        <Col span={8}>
          {renderChartCard('资产状态趋势', assetStatusTrendConfig, 'Line')} {/* 使用 Line 组件 */}
        </Col>
        <Col span={8}>
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