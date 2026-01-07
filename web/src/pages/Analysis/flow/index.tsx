import React, { useState } from 'react';
import { Card, Row, Col, DatePicker, Table, Input, Button, Spin } from 'antd';
import { IAssetOperationRecordRes, getAssetOperationRecords, operationTypeMap, IGetAssetOperationRecordsParams } from './index';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { SearchOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const AssetStatistics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs()
  ]);
  const [assetCode, setAssetCode] = useState<string>('');
  const [operationRecords, setOperationRecords] = useState<IAssetOperationRecordRes[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleSearch = async () => {
    if (!assetCode) {
      setOperationRecords([]);
      setTotalRecords(0);
      return;
    }
    setLoading(true);
    try {
      const [start, end] = timeRange;
      const params: IGetAssetOperationRecordsParams = {
        assetCode,
        startTime: start.format('YYYY-MM-DD HH:mm:ss'),
        endTime: end.format('YYYY-MM-DD HH:mm:ss'),
        limit: pageSize, // Use pageSize as limit
        offset: (currentPage - 1) * pageSize, // Calculate offset
      };
      const records = await getAssetOperationRecords(params);
      console.log("records", records)
      setOperationRecords(records.data.list);
      setTotalRecords(records.data.total);
    } catch (error) {
      console.error('获取工装车记录失败:', error);
      setOperationRecords([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination change
  const handlePaginationChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  const columns = [
    {
      title: '资产编码',
      dataIndex: 'assetCode',
      key: 'assetCode',
      width: 100,
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
      dataIndex: 'storeFrom',
      key: 'storeFrom',
      width: 150,
    },
    {
      title: '目标场库',
      dataIndex: 'storeTo',
      key: 'storeTo',
      width: 150,
    },
  ];

  return (
    <div className="p-6">
      <>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Input
              placeholder="请输入资产编码"
              value={assetCode}
              onChange={(e) => setAssetCode(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={12}>
            <RangePicker
              value={timeRange}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setTimeRange([dates[0], dates[1]]);
                }
              }}
              allowClear={false}
            />
          </Col>
          <Col>
            <Button 
              type="primary" 
              onClick={handleSearch} 
              loading={loading}
              icon={<SearchOutlined />}
            >
              查询
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={operationRecords}
          rowKey="assetId"
          loading={loading}
          className="mt-4"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalRecords,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, pageSize) => handlePaginationChange(page, pageSize),
          }}
        />
      </>
    </div>
  );
};

export default AssetStatistics;
