import React, { useState } from 'react';
import { Card, Row, Col, DatePicker, Table, Input, Button, Space, message, Tag } from 'antd';
import {
  IAssetOperationRecordRes,
  getAssetOperationRecords,
  operationTypeMap,
  IGetAssetOperationRecordsParams,
} from './index';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const AssetStatistics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs()
  ]);
  // 查询条件：资产编码 / 标签码（至少填一个）
  const [assetCode, setAssetCode] = useState<string>('');
  const [tagCode, setTagCode] = useState<string>('');
  const [operationRecords, setOperationRecords] = useState<IAssetOperationRecordRes[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleSearch = async (page = currentPage, size = pageSize) => {
    if (!assetCode.trim() && !tagCode.trim()) {
      message.warning('请输入资产编码或标签码');
      return;
    }
    setLoading(true);
    try {
      const [start, end] = timeRange;
      const params: IGetAssetOperationRecordsParams = {
        assetCode: assetCode.trim(),
        tagCode: tagCode.trim(),
        startTime: start.format('YYYY-MM-DD HH:mm:ss'),
        endTime: end.format('YYYY-MM-DD HH:mm:ss'),
        limit: size,
        offset: (page - 1) * size,
      };
      const records = await getAssetOperationRecords(params);
      setOperationRecords(records.data.list || []);
      setTotalRecords(records.data.total);
    } catch (error) {
      console.error('获取流转记录失败:', error);
      setOperationRecords([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination change
  const handlePaginationChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
    handleSearch(page, size || pageSize);
  };

  const handleReset = () => {
    setAssetCode('');
    setTagCode('');
    setTimeRange([dayjs().subtract(30, 'days'), dayjs()]);
    setOperationRecords([]);
    setTotalRecords(0);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: '资产编码',
      dataIndex: 'assetCode',
      key: 'assetCode',
      width: 120,
      render: (text: string) => text || '-',
    },
    {
      title: '标签码',
      dataIndex: 'tagCode',
      key: 'tagCode',
      width: 120,
      render: (text: string) => text || '-',
    },
    {
      title: '操作时间',
      dataIndex: 'actionTime',
      key: 'actionTime',
      width: 180,
    },
    {
      title: '操作类型',
      dataIndex: 'actionType',
      key: 'actionType',
      width: 100,
      render: (type: number) => (
        <span style={{ color: type === 1 ? '#52c41a' : '#f5222d' }}>
          {operationTypeMap[type] || '-'}
        </span>
      ),
    },
    {
      title: '起始场库',
      dataIndex: 'storeFromName',
      key: 'storeFromName',
      width: 150,
      render: (text: string, record: IAssetOperationRecordRes) =>
        text || (record.storeFrom ? `场库-${record.storeFrom}` : '-'),
    },
    {
      title: '目标场库',
      dataIndex: 'storeToName',
      key: 'storeToName',
      width: 150,
      render: (text: string, record: IAssetOperationRecordRes) =>
        text || (record.storeTo ? `场库-${record.storeTo}` : '-'),
    },
  ];

  return (
    <div className="p-6">
      <Card styles={{ body: { padding: 16 } }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="资产编码"
              value={assetCode}
              onChange={(e) => setAssetCode(e.target.value)}
              onPressEnter={() => {
                setCurrentPage(1);
                handleSearch(1);
              }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="标签码"
              value={tagCode}
              onChange={(e) => setTagCode(e.target.value)}
              onPressEnter={() => {
                setCurrentPage(1);
                handleSearch(1);
              }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={24} md={8}>
            <RangePicker
              style={{ width: '100%' }}
              value={timeRange}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setTimeRange([dates[0], dates[1]]);
                }
              }}
              allowClear={false}
              showTime={{ format: 'HH:mm:ss' }}
            />
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  setCurrentPage(1);
                  handleSearch(1);
                }}
                loading={loading}
                icon={<SearchOutlined />}
              >
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
        <div style={{ marginTop: 8 }}>
          <Tag color="blue">资产编码 / 标签码 至少填写一项</Tag>
        </div>
      </Card>

      <Table
        columns={columns}
        dataSource={operationRecords}
        rowKey={(record) => `${record.assetId}-${record.actionTime}-${record.actionType}`}
        loading={loading}
        className="mt-4"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalRecords,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          onChange: (page, size) => handlePaginationChange(page, size),
        }}
      />
    </div>
  );
};

export default AssetStatistics;
