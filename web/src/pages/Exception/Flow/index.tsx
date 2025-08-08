import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Table, Select, DatePicker, Space, Modal, message, Row, Col } from 'antd';
import { SearchOutlined, CheckCircleOutlined, ExportOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  getExceptionList,
  getExceptionStats,
  handleException,
  batchHandleException,
  exportExceptionList,
  exceptionTypeMap,
  statusMap,
  IExceptionRecord,
  IQueryExceptionParams,
} from './index.ts';

const { RangePicker } = DatePicker;

const ExceptionFlowPage: React.FC = () => {
  const [form] = Form.useForm();
  const [records, setRecords] = useState<IExceptionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [exporting, setExporting] = useState(false);

  // 查询
  const fetchData = async () => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const params: IQueryExceptionParams = {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        startTime: values.timeRange?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.timeRange?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
        exceptionType: values.exceptionType,
        status: values.status,
        assetId: values.assetId,
      };
      const res = await getExceptionList(params);
      if (res.code === 200) {
        setRecords(res.data.list);
        setTotal(res.data.total);
      }
    } catch (e) {
      message.error('查询失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [currentPage, pageSize]);

  // 单条处理
  const handleSingle = (record: IExceptionRecord) => {
    Modal.confirm({
      title: '处理异常',
      content: (
        <Form layout="vertical" id="handleForm">
          <Form.Item name="handleNote" label="处理备注">
            <Input.TextArea />
          </Form.Item>
        </Form>
      ),
      onOk: async () => {
        const note = (document.getElementById('handleForm') as any)?.handleNote?.value || '';
        await handleException({ id: record.id, status: 1, handleNote: note });
        message.success('处理成功');
        fetchData();
      },
    });
  };

  // 批量处理
  const handleBatch = () => {
    Modal.confirm({
      title: '批量处理异常',
      content: (
        <Form layout="vertical" id="batchHandleForm">
          <Form.Item name="handleNote" label="处理备注">
            <Input.TextArea />
          </Form.Item>
        </Form>
      ),
      onOk: async () => {
        const note = (document.getElementById('batchHandleForm') as any)?.handleNote?.value || '';
        await batchHandleException({ ids: selectedRowKeys as string[], status: 1, handleNote: note });
        message.success('批量处理成功');
        setSelectedRowKeys([]);
        fetchData();
      },
    });
  };

  // 导出
  const handleExport = async () => {
    setExporting(true);
    try {
      const values = form.getFieldsValue();
      const params: IQueryExceptionParams = {
        limit: 10000,
        offset: 0,
        startTime: values.timeRange?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.timeRange?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
        exceptionType: values.exceptionType,
        status: values.status,
        assetId: values.assetId,
      };
      const res = await exportExceptionList(params);
      if (res.code === 200 && res.data) {
        window.open(res.data, '_blank');
      }
    } catch {
      message.error('导出失败');
    } finally {
      setExporting(false);
    }
  };

  const columns = [
    { title: '异常类型', dataIndex: 'exceptionType', render: (v: number) => exceptionTypeMap[v] },
    { title: '资产ID', dataIndex: 'assetId' },
    { title: '检测时间', dataIndex: 'detectionTime', render: (t: string) => t ? dayjs(t).format('YYYY-MM-DD HH:mm:ss') : '-' },
    { title: '状态', dataIndex: 'status', render: (v: number) => statusMap[v] },
    { title: '异常内容', dataIndex: 'exceptionNote', render: (v?: string) => v || '-' },
    { title: '备注', dataIndex: 'remark', render: (v?: string) => v || '-' },
    {
      title: '操作',
      dataIndex: 'action',
      render: (_: any, record: IExceptionRecord) =>
        record.status === 0 ? (
          <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handleSingle(record)}>
            处理
          </Button>
        ) : (
          <span style={{ color: '#aaa' }}>已处理</span>
        ),
    },
  ];

  return (
    <div className="p-6">
      <Card>
        <Form form={form} layout="vertical" onFinish={fetchData}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="timeRange" label="时间范围">
                <RangePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="exceptionType" label="异常类型">
                <Select allowClear placeholder="请选择异常类型">
                  {Object.entries(exceptionTypeMap).map(([k, v]) => (
                    <Select.Option key={k} value={Number(k)}>
                      {v}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="status" label="处理状态">
                <Select allowClear placeholder="请选择处理状态">
                  {Object.entries(statusMap).map(([k, v]) => (
                    <Select.Option key={k} value={Number(k)}>
                      {v}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item name="assetId" label="资产ID">
                <Input allowClear placeholder="请输入资产ID" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item>
                <Space size="middle">
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                    查询
                  </Button>
                  <Button icon={<ExportOutlined />} onClick={handleExport} loading={exporting}>
                    导出
                  </Button>
                  <Button
                    type="default"
                    disabled={selectedRowKeys.length === 0}
                    onClick={handleBatch}
                    icon={<CheckCircleOutlined />}
                  >
                    批量处理
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          className="mt-6"
          columns={columns}
          dataSource={records}
          rowKey="id"
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            getCheckboxProps: (record: IExceptionRecord) => ({
              disabled: record.status === 1,
            }),
          }}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t) => `共 ${t} 条记录`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            },
          }}
        />
      </Card>
    </div>
  );
};

export default ExceptionFlowPage;
