import React, { FC, memo, useState } from 'react';
import { useAssetPageHooks } from './hooks'; // Custom Hook
import { Form, Input, Modal, Pagination, Select, Table, Button, Space } from 'antd'; // Include Space and Modal
import { useTranslation } from 'react-i18next';
import { ICreateUpdateAssetParams, IAssetResponse, IQueryAssetParams, assetTypeMap, statusMap } from './index'; // Import IAssetResponse, ICreateUpdateAssetParams, maps
import { ColumnsType } from 'antd/es/table'; // Import ColumnsType
import { useSearchFrom } from '@/hooks/useSearchForm'; // Import useSearchFrom
import dayjs from 'dayjs';
import { DownloadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card } from 'antd';

// 资产类型选项
const assetTypeOptions = Object.entries(assetTypeMap).map(([value, label]) => ({
  label,
  value: parseInt(value, 10),
}));

// 资产状态选项
const statusOptions = Object.entries(statusMap).map(([value, label]) => ({
  label,
  value: parseInt(value, 10),
}));

// 资产页面组件
const AssetPage: FC = () => { // Change component name to follow convention
  // 使用自定义 Hook 获取页面所需的状态和方法
  const {
    list,
    loading,
    total,
    limit,
    queryInfo,
    formRef,
    editAssetModalOpen,
    isEdit,
    selectedRowKeys,
    setPage,
    setLimit,
    setSelectedRowKeys,
    setEditAssetModalOpen,
    onFinish,
    batchDeleteAssets,
    handleSearch,
    handleExport,
  } = useAssetPageHooks();

  const { t } = useTranslation();

  // Define table columns
  const columns: ColumnsType<IAssetResponse> = [
    { title: '资产ID', dataIndex: 'assetId', key: 'assetId' },
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode' },
    { title: '资产类型', dataIndex: 'assetType', key: 'assetType', render: (text: number) => assetTypeMap[text] || '-' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (text: number) => statusMap[text] || '-' },
    { title: '仓库ID', dataIndex: 'storeId', key: 'storeId' },
    { title: '部门ID', dataIndex: 'departmentId', key: 'departmentId' },
    { title: '园区ID', dataIndex: 'gardenId', key: 'gardenId' },
    { 
      title: '创建时间', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    { 
      title: '更新时间', 
      dataIndex: 'updatedAt', 
      key: 'updatedAt',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
           <Button type="link" danger onClick={() => batchDeleteAssets([record.assetId])}>
             删除
           </Button>
        </Space>
      ),
    },
  ];

  // Batch delete modal (Keep this as it was in the previous version)
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除选中的资产吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => batchDeleteAssets(selectedRowKeys as number[]),
    });
  };

  // Define search form items
  const searchFormItems: { label: string; name: keyof IQueryAssetParams; component: React.ReactNode }[] = [
    {
      name: 'assetId',
      label: '资产ID',
      component: <Input placeholder="请输入资产ID" allowClear />,
    },
    {
      name: 'assetCode',
      label: '资产编码',
      component: <Input placeholder="请输入资产编码" allowClear />,
    },
    {
      name: 'assetType',
      label: '资产类型',
      component: <Select placeholder="请选择资产类型" allowClear options={assetTypeOptions} />,
    },
    {
      name: 'status',
      label: '状态',
      component: <Select placeholder="请选择状态" allowClear options={statusOptions} />,
    },
    {
      name: 'storeId',
      label: '仓库ID',
      component: <Input placeholder="请输入仓库ID" allowClear />,
    },
    {
      name: 'departmentId',
      label: '部门ID',
      component: <Input placeholder="请输入部门ID" allowClear />,
    },
    {
      name: 'gardenId',
      label: '园区ID',
      component: <Input placeholder="请输入园区ID" allowClear />,
    },
  ];

  // Use useSearchFrom for the query functionality
  const { SearchFormComponent } = useSearchFrom<IQueryAssetParams>({
    getDataRequestFn: handleSearch,
    formItems: searchFormItems,
    formName: 'assetSearchForm',
    onNewRecordFn: () => {
      formRef.resetFields();
      setEditAssetModalOpen(true);
    },
    operateComponent: (
      <Space>
         <Button
           type='primary'
           icon={<DownloadOutlined />}
           onClick={handleExport}
           disabled={selectedRowKeys.length === 0}
         >
           导出
         </Button>
          {selectedRowKeys.length > 0 && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleBatchDelete}
            >
              批量删除
            </Button>
          )}
         <Button
           type='primary'
           icon={<PlusOutlined />}
           onClick={() => {
             formRef.resetFields();
             setEditAssetModalOpen(true);
           }}
         >
           新增
         </Button>
      </Space>
    ),
    showAddBtn: false,
  });

  const handleEdit = (record: IAssetResponse) => {
    formRef.setFieldsValue({
      assetCode: record.assetCode,
      assetType: record.assetType,
      status: record.status,
      storeId: record.storeId,
      departmentId: record.departmentId,
      gardenId: record.gardenId,
    });
    setEditAssetModalOpen(true);
  };

  return (
    <Card title="资产管理">
      {SearchFormComponent}

      {/* Table component */}
      <Table
        dataSource={list}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        loading={loading}
        columns={columns}
        bordered={true}
        pagination={false}
        rowKey='assetId'
      />

      {/* Pagination component */}
      <Pagination
        total={total}
        className='flex justify-end mt-2'
        pageSize={limit}
        current={(queryInfo.offset / queryInfo.limit) + 1}
        onChange={(page, pageSize) => {
          setPage(page);
          setLimit(pageSize);
        }}
        showSizeChanger
        onShowSizeChange={(_, size) => setLimit(size)}
      />

      {/* Edit/Add Modal */}
      <Modal
        open={editAssetModalOpen}
        title={isEdit ? '编辑资产' : '新增资产'}
        onOk={onFinish}
        onCancel={() => setEditAssetModalOpen(false)}
        destroyOnClose
      >
        <Form
          form={formRef}
          autoComplete='off'
          labelAlign='left'
          labelCol={{ span: 6 }}
        >
          <Form.Item<ICreateUpdateAssetParams>
            name='assetCode'
            label='资产编码'
            rules={[{ required: true, message: '请输入资产编码' }]}
          >
            <Input placeholder='请输入资产编码' />
          </Form.Item>

          <Form.Item<ICreateUpdateAssetParams>
            name='assetType'
            label='资产类型'
            rules={[{ required: true, message: '请选择资产类型' }]}
          >
            <Select
              placeholder='请选择资产类型'
              options={assetTypeOptions}
            />
          </Form.Item>

          <Form.Item<ICreateUpdateAssetParams>
            name='status'
            label='状态'
            rules={[{ required: true, message: '请选择资产状态' }]}
          >
            <Select
              placeholder='请选择状态'
              options={statusOptions}
            />
          </Form.Item>

          <Form.Item<ICreateUpdateAssetParams>
            name='storeId'
            label='仓库ID'
            rules={[
              { required: true, message: '请输入仓库ID' },
              { pattern: /^[0-9]*$/, message: '只能输入数字' },
            ]}
          >
            <Input placeholder='请输入仓库ID' />
          </Form.Item>

          <Form.Item<ICreateUpdateAssetParams>
            name='departmentId'
            label='部门ID'
            rules={[
              { required: true, message: '请输入部门ID' },
              { pattern: /^[0-9]*$/, message: '只能输入数字' },
            ]}
          >
            <Input placeholder='请输入部门ID' />
          </Form.Item>

          <Form.Item<ICreateUpdateAssetParams>
            name='gardenId'
            label='园区ID'
            rules={[
              { required: true, message: '请输入园区ID' },
              { pattern: /^[0-9]*$/, message: '只能输入数字' },
            ]}
          >
            <Input placeholder='请输入园区ID' />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

// Use memo for performance
export default memo(AssetPage);
