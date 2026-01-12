import React, { FC, memo } from 'react';
import { useAssetPageHooks } from './hooks'
import { Descriptions, DescriptionsProps, Form, Input, Modal, Pagination, Table, Select } from 'antd';
import { IUpdateAssetParams, statusMap } from './index.ts';
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
    repairModalOpen,
    setRepairModalOpen,
    repairReason,
    setRepairReason,
    submitRepair,
    updateLoading,
    detailModalOpen,
    detailAsset,
    storeMap,
    tagMap,
    assetTypeOptions,
    assetTypeLabelMap,
    repairRecords,
    repairRecordsLoading,
    setDetailModalOpen,
  } = useAssetPageHooks();

// 资产状态选项
const statusOptions = Object.entries(statusMap).map(([value, label]) => ({
  label,
  value: parseInt(value, 10),
}));

  // 标签选项
  const detailStore = storeMap.find((store) => store.storeId === detailAsset?.storeId);
  const detailTag = tagMap.find((tag) => Number(tag.id) === Number(detailAsset?.tagId));
  const latestRepair = repairRecords[0];
  const repairReasonText = repairRecordsLoading ? '加载中...' : latestRepair?.repairReason || '无';
  const detailItems: DescriptionsProps['items'] = detailAsset
    ? [
        { key: 'assetId', label: '资产ID', children: detailAsset.assetId },
        { key: 'assetCode', label: '资产编码', children: detailAsset.assetCode },
        { key: 'assetType', label: '资产类型', children: assetTypeLabelMap[detailAsset.assetType] || '-' },
        { key: 'status', label: '资产状态', children: statusMap[detailAsset.status] || '-' },
        { key: 'repairReason', label: '报修原因', children: repairReasonText },
        { key: 'quantity', label: '数量', children: detailAsset.quantity },
        { key: 'storeId', label: '场库ID', children: detailAsset.storeId },
        { key: 'storeName', label: '所在场库', children: detailStore?.storeName || '未设置' },
        { key: 'tagCode', label: '标签编码', children: detailTag?.tagCode || '未设置' },
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
        <div className="mb-3">
          <div className="mb-2 font-medium">历史报修记录</div>
          {repairRecordsLoading ? (
            <div className="text-gray-400">加载中...</div>
          ) : repairRecords.length === 0 ? (
            <div className="text-gray-400">暂无报修记录</div>
          ) : (
            <div className="max-h-40 overflow-auto space-y-2">
              {repairRecords.slice(0, 3).map((record) => (
                <div key={record.id} className="rounded border border-gray-200 p-2 text-sm">
                  <div className="text-gray-500">{dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                  <div className="mt-1 text-gray-700">{record.repairReason}</div>
                </div>
              ))}
            </div>
          )}
        </div>
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
