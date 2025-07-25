import React, { useState } from 'react';
import { Card, Form, Input, Button, Table, DatePicker, Space, message, App, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getAssetTrack, getAssetLocation, IMonitorRecord, IQueryTrackParams } from './index';

const { RangePicker } = DatePicker;

const MonitorPage: React.FC = () => {
  const [form] = Form.useForm();
  const [locationForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [records, setRecords] = useState<IMonitorRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentLocation, setCurrentLocation] = useState<IMonitorRecord | null>(null);

  // 轨迹回放
  const handleTrackSearch = async () => {
    const values = form.getFieldsValue();
    if (!values.assetId) {
      messageApi.error('请输入资产ID');
      return;
    }
    if (!values.timeRange) {
      messageApi.error('请选择时间范围');
      return;
    }

    setLoading(true);
    try {
      const params: IQueryTrackParams = {
        assetId: parseInt(values.assetId, 10),
        startTime: values.timeRange[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.timeRange[1].format('YYYY-MM-DD HH:mm:ss'),
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      };

      const response = await getAssetTrack(params);
      if (response?.code === 200) {
        setRecords(response.data.list);
        setTotal(response.data.total);
      } else {
        messageApi.error('获取资产轨迹失败');
      }
    } catch (error) {
      console.error('查询失败:', error);
      messageApi.error('查询失败');
    } finally {
      setLoading(false);
    }
  };

  // 实时定位
  const handleLocationSearch = async () => {
    const values = locationForm.getFieldsValue();
    if (!values.assetId) {
      messageApi.error('请输入资产ID');
      return;
    }

    setLocationLoading(true);
    try {
      const response = await getAssetLocation({ assetId: parseInt(values.assetId, 10) });
      if (response?.code === 200) {
        setCurrentLocation(response.data);
      } else {
        messageApi.error('获取资产位置失败');
      }
    } catch (error) {
      console.error('查询失败:', error);
      messageApi.error('查询失败');
    } finally {
      setLocationLoading(false);
    }
  };

  const trackColumns = [
    { title: '监控记录ID', dataIndex: 'monitorId', key: 'monitorId' },
    { title: '资产ID', dataIndex: 'assetId', key: 'assetId' },
    { title: '网关ID', dataIndex: 'gatewayId', key: 'gatewayId' },
    {
      title: '检测时间',
      dataIndex: 'detectionTime',
      key: 'detectionTime',
      render: (text: string) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-'
    }
  ];

  const items = [
    {
      key: '1',
      label: '轨迹回放',
      children: (
        <>
          <Form form={form} onFinish={handleTrackSearch} layout="inline">
            <Form.Item 
              name="assetId" 
              label="资产ID" 
              rules={[
                { required: true, message: '请输入资产ID' },
                { 
                  pattern: /^[1-9]\d*$/, 
                  message: '资产ID必须为正整数' 
                }
              ]}
            >
              <Input placeholder="请输入资产ID" />
            </Form.Item>
            <Form.Item name="timeRange" label="时间范围" rules={[{ required: true }]}> 
              <RangePicker showTime />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SearchOutlined />}>
                查询
              </Button>
            </Form.Item>
          </Form>

          <Table
            columns={trackColumns}
            dataSource={records}
            rowKey="monitorId"
            loading={loading}
            className="mt-4"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size || 10);
              },
            }}
          />
        </>
      ),
    },
    {
      key: '2',
      label: '实时定位',
      children: (
        <>
          <Form form={locationForm} onFinish={handleLocationSearch} layout="inline">
            <Form.Item 
              name="assetId" 
              label="资产ID" 
              rules={[
                { required: true, message: '请输入资产ID' },
                { 
                  pattern: /^[1-9]\d*$/, 
                  message: '资产ID必须为正整数' 
                }
              ]}
            >
              <Input placeholder="请输入资产ID" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={locationLoading} icon={<SearchOutlined />}>
                查询
              </Button>
            </Form.Item>
          </Form>

          {currentLocation && (
            <div className="mt-4">
              <h3>当前位置信息</h3>
              <p>资产ID: {currentLocation.assetId}</p>
              <p>网关ID: {currentLocation.gatewayId}</p>
              <p>最后检测时间: {dayjs(currentLocation.detectionTime).format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      {contextHolder}
      <Tabs items={items} />
    </div>
  );
};

export default MonitorPage;
