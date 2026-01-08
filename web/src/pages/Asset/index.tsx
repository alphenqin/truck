import React, { FC, memo } from 'react';
import { useAssetPageHooks } from './hooks'
import { Descriptions, DescriptionsProps, Form, Input, Modal, Pagination, Table, Select } from 'antd';
import { IUpdateAssetParams, assetTypeMap, statusMap } from './index.ts';
import dayjs from 'dayjs';

const AssetPage: FC = () => {
  const {
    list,
    roleColumns,
    SearchFormComponent,
    total,
    limit,
    loading,
    isEdit,
    formRef,
    editAssetModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditAssetModalOpen,
    onFinish,
    tagMap,
    repairModalOpen,
    setRepairModalOpen,
    repairReason,
    setRepairReason,
    submitRepair,
    updateLoading,
    detailModalOpen,
    detailAsset,
    storeMap,
    repairRecords,
    repairRecordsLoading,
    setDetailModalOpen,
  } = useAssetPageHooks();

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

  // 标签选项
  const tagOptions = tagMap.map((tag) => ({
    label: tag.tagCode,
    value: tag.id,
  }));

  const detailStore = storeMap.find((store) => store.storeId === detailAsset?.storeId);
  const detailTag = tagMap.find((tag) => Number(tag.id) === detailAsset?.tagId);
  const latestRepair = repairRecords[0];
  const repairReasonText = repairRecordsLoading ? '加载中...' : latestRepair?.repairReason || '无';
  const detailItems: DescriptionsProps['items'] = detailAsset
    ? [
        { key: 'assetId', label: '资产ID', children: detailAsset.assetId },
        { key: 'assetCode', label: '资产编码', children: detailAsset.assetCode },
        { key: 'assetType', label: '资产类型', children: assetTypeMap[detailAsset.assetType] || '-' },
        { key: 'status', label: '资产状态', children: statusMap[detailAsset.status] || '-' },
        { key: 'repairReason', label: '报修原因', children: repairReasonText },
        { key: 'quantity', label: '数量', children: detailAsset.quantity },
        { key: 'tagId', label: '标签ID', children: detailAsset.tagId },
        { key: 'tagCode', label: '标签编码', children: detailTag?.tagCode || '未设置' },
        { key: 'storeId', label: '场库ID', children: detailAsset.storeId },
        { key: 'storeName', label: '场库名称', children: detailStore?.storeName || '未设置' },
        { key: 'createdAt', label: '创建时间', children: dayjs(detailAsset.createdAt).format('YYYY-MM-DD HH:mm:ss') },
        { key: 'updatedAt', label: '更新时间', children: dayjs(detailAsset.updatedAt).format('YYYY-MM-DD HH:mm:ss') },
      ]
    : [];

  return (
    <>
      {SearchFormComponent}
      <Table
        dataSource={list}
        rowSelection={
        {
          onChange: (selectedRowKeys: React.Key[]) => {
            setSelected(selectedRowKeys);
          },
        }
        }
        loading={loading}
        columns={roleColumns}
        bordered={true}
        pagination={false}
        rowKey='assetId'></Table>
      <Pagination
        total={total}
        className='flex justify-end mt-2'
        pageSize={limit}
        onChange={(e) => setPage(e)}
        showSizeChanger
        onShowSizeChange={(_, size) => setLimit(size)}></Pagination>
      <Modal open={editAssetModalOpen} title={isEdit ? '编辑' : '新增'} onOk={onFinish} onCancel={() => setEditAssetModalOpen(false)}>
        <Form form={formRef} autoComplete='off' labelAlign='left' id='editFormRef'>
          <Form.Item<IUpdateAssetParams> name='assetCode' label='资产编码' rules={[{ required: true, message: '请输入资产编码' }]}>
            <Input placeholder="请输入资产编码" />
          </Form.Item>
          <Form.Item<IUpdateAssetParams> name='assetType' label='资产类型' rules={[{ required: true, message: '请选择资产类型' }]}>
            <Select placeholder="请选择资产类型" options={assetTypeOptions} />
          </Form.Item>
          <Form.Item<IUpdateAssetParams> name='status' label='资产状态' rules={[{ required: true, message: '请选择资产状态' }]}>
            <Select placeholder="请选择资产状态" options={statusOptions} />
          </Form.Item>
          <Form.Item<IUpdateAssetParams> name='quantity' label='数量' rules={[{ required: true, message: '请输入数量' }]}>
            <Input type="number" placeholder="请输入数量" />
          </Form.Item>
          <Form.Item<IUpdateAssetParams> name='tagId' label='标签' rules={[{ required: true, message: '请选择标签' }]}>
            <Select placeholder="请选择标签" options={tagOptions} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={repairModalOpen}
        title="报修原因"
        onOk={submitRepair}
        onCancel={() => setRepairModalOpen(false)}
        okText="提交"
        cancelText="取消"
        confirmLoading={updateLoading}
      >
        <Input.TextArea
          placeholder="请输入报修原因"
          value={repairReason}
          onChange={(e) => setRepairReason(e.target.value)}
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Modal>
      <Modal
        open={detailModalOpen}
        title="资产详情"
        footer={null}
        onCancel={() => setDetailModalOpen(false)}
        width={720}
      >
        <Descriptions bordered column={2} items={detailItems} />
      </Modal>
    </>
  );
};

export default memo(AssetPage);
