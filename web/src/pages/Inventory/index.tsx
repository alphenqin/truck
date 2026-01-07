import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Spin, Form, Descriptions, message, Table, Space, App } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { IAssetResponse, getAssetRequest, statusMap, IQueryAssetParams, IUpdateAssetStatusParams, updateAssetStatus, assetTypeMap } from './index';
import dayjs from 'dayjs';

const InventoryPage: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [assets, setAssets] = useState<IAssetResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleSearch = async () => {
    const values = form.getFieldsValue();
    setLoading(true);
    try {
      const params: IQueryAssetParams = {
        ...(values.assetCode && { assetCode: values.assetCode }),
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      };
      const response = await getAssetRequest(params);
      if (response && response.data && Array.isArray(response.data.list)) {
        setAssets(response.data.list);
        setTotalRecords(response.data.total);
      } else {
        setAssets([]);
        setTotalRecords(0);
        messageApi.info('未找到该资产或查询结果为空。');
      }
    } catch (error) {
      console.error('查询资产失败:', error);
      setAssets([]);
      setTotalRecords(0);
      messageApi.error('查询资产失败。');
    } finally {
      setLoading(false);
    }
  };

  const handlePaginationChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize !== undefined) {
      setPageSize(pageSize);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [currentPage, pageSize]);

  const handleUpdateStatus = async (assetId: number, status: number) => {
    setUpdateLoading(true);
    try {
      const params: IUpdateAssetStatusParams = {
        assetId: assetId,
        status: status,
      };
      const response = await updateAssetStatus(params);
      console.log('Update status response:', response);
      if (response?.code === 200) {
        messageApi.success('资产状态更新成功！');
        handleSearch();
      } else {
        messageApi.error(`资产状态更新失败: ${response?.msg || '未知错误'}`);
      }
    } catch (error) {
      messageApi.error('更新资产状态失败。');
    } finally {
      setUpdateLoading(false);
    }
  };

  const columns = [
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode' },
    { title: '资产类型', dataIndex: 'assetType', key: 'assetType', render: (type: number) => assetTypeMap[type] || type },
    { title: '当前状态', dataIndex: 'status', key: 'status', render: (status: number) => statusMap[status] || status },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '操作',
      key: 'actions',
      render: (text: any, record: IAssetResponse) => (
        <Space size="small">
          <Button type="link" danger onClick={() => handleUpdateStatus(record.assetId, 3)} loading={updateLoading}>报修</Button>
          <Button type="link" danger onClick={() => handleUpdateStatus(record.assetId, 5)} loading={updateLoading}>报废</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      {contextHolder}
      <Form form={form} onFinish={handleSearch} layout="inline">
        <Form.Item
          name="assetCode"
          rules={[{ required: false, message: '请输入资产编码' }]}
        >
          <Input placeholder="请输入资产编码" allowClear />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} icon={<SearchOutlined />}>
            查询
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={assets}
        rowKey="assetId"
        loading={loading || updateLoading}
        className="mt-4"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalRecords,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          onChange: handlePaginationChange,
        }}
      />
    </div>
  );
};

export default InventoryPage;
