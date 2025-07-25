import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Table, InputNumber, Space, message, App } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getLostAssetList, ILostAssetRecord, IQueryLostAssetParams, actionTypeMap } from './index';

const LostAssetPage: React.FC = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<ILostAssetRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSearch = async () => {
    const values = form.getFieldsValue();
    setLoading(true);
    try {
      const params: IQueryLostAssetParams = {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        ...(values.hours && { hours: values.hours }),
      };

      const response = await getLostAssetList(params);
      if (response?.code === 200) {
          console.log(response.data)
        setRecords(response.data.list);
        setTotal(response.data.total);
      } else {
        messageApi.error('获取异常资产列表失败');
      }
    } catch (error) {
      console.error('查询失败:', error);
      messageApi.error('查询失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '资产ID', dataIndex: 'assetId', key: 'assetId' },
    { 
      title: '操作类型', 
      dataIndex: 'actionType', 
      key: 'actionType',
      render: (type: number) => actionTypeMap[type] || type
    },
    {
      title: '起始场库',
      dataIndex: 'storeFrom',
      key: 'storeFrom'
    },
    {
      title: '目标场库',
      dataIndex: 'storeTo',
      key: 'storeTo'
    },
    {
      title: '操作时间',
      dataIndex: 'actionTime',
      key: 'actionTime',
      render: (text: string) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-'
    }
  ];

  useEffect(() => {
    // 设置默认值
    form.setFieldsValue({
      hours: 24
    });
    handleSearch();
  }, [currentPage, pageSize]);

  return (
    <div className="p-6">
      {contextHolder}
      <Form form={form} onFinish={handleSearch} layout="inline">
        <Form.Item name="hours" label="往前推多少小时" initialValue={24}>
          <InputNumber min={1} precision={0} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} icon={<SearchOutlined />}>
            查询
          </Button>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={records}
        rowKey="assetId"
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
    </div>
  );
};

export default LostAssetPage;
