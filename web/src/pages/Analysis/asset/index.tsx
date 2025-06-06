import React, { FC } from 'react';
import { Table, Card, Form, Input, Select, Button, Space, DatePicker } from 'antd';
import { useAssetPageHooks } from './hooks';
import { IAssetResponse, IQueryAssetParams, assetTypeMap, statusMap } from './index';
import { ColumnsType } from 'antd/es/table';
import { useSearchFrom } from '@/hooks/useSearchForm';
import dayjs from 'dayjs';

// Define asset type options based on assetTypeMap
const assetTypeOptions = Object.entries(assetTypeMap).map(([value, label]) => ({
  label,
  value: parseInt(value, 10),
}));

// Define status options based on statusMap
const statusOptions = Object.entries(statusMap).map(([value, label]) => ({
  label,
  value: parseInt(value, 10),
}));

// Define table columns
const columns: ColumnsType<IAssetResponse> = [
  { title: '资产ID', dataIndex: 'assetId', key: 'assetId' },
  { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode' },
  { title: '资产类型', dataIndex: 'assetType', key: 'assetType', render: (text) => assetTypeMap[text] || '-' },
  { title: '状态', dataIndex: 'status', key: 'status', render: (text) => statusMap[text] || '-' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-' },
  { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-' },
];

const AssetPage: FC = () => {
  const { loading, assetList, total, queryInfo, handlePageChange, handleSearch } = useAssetPageHooks();

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
    // {
    //   name: 'createdAt',
    //   label: '创建时间',
    //   component: <DatePicker showTime placeholder="请选择创建时间" />,
    // },
    // {
    //   name: 'updatedAt',
    //   label: '更新时间',
    //   component: <DatePicker showTime placeholder="请选择更新时间" />,
    // },
  ];

  // Use useSearchFrom for the query functionality
  const { SearchFormComponent } = useSearchFrom<IQueryAssetParams>({
    getDataRequestFn: (values: Partial<IQueryAssetParams>) => {
      // Convert DatePicker values to string format
      const formattedValues = {
        ...values,
        createdAt: values.createdAt ? dayjs(values.createdAt).format('YYYY-MM-DD HH:mm:ss') : undefined,
        updatedAt: values.updatedAt ? dayjs(values.updatedAt).format('YYYY-MM-DD HH:mm:ss') : undefined,
      };
      return handleSearch(formattedValues);
    },
    formItems: searchFormItems,
    formName: 'assetSearchForm',
    onNewRecordFn: () => {}, // Add empty function since we don't need new record functionality
  });

  return (
    <Card title="资产管理">
      {SearchFormComponent}
      
      <Table
        columns={columns}
        dataSource={assetList}
        rowKey="assetId"
        loading={loading}
        pagination={{
          current: (queryInfo.offset / queryInfo.limit) + 1,
          pageSize: queryInfo.limit,
          total: total,
          onChange: handlePageChange,
          showSizeChanger: true,
        }}
      />
    </Card>
  );
};

export default AssetPage;
