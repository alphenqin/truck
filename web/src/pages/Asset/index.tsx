import React, { FC, memo } from 'react';
import { useAssetPageHooks } from './hooks'
import { Form, Input, Modal, Pagination, Table, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { IUpdateAssetParams, assetTypeMap, statusMap } from './index.ts';

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
  } = useAssetPageHooks();
  const { t } = useTranslation();

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
      <Modal open={editAssetModalOpen} title={isEdit ? t('edit') : t('add')} onOk={onFinish} onCancel={() => setEditAssetModalOpen(false)}>
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
    </>
  );
};

export default memo(AssetPage);
