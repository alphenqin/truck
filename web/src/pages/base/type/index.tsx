import React, { FC, memo } from 'react';
import { useAssetTypesPageHooks } from './hooks.tsx'
import { Form, Input, Modal, Pagination, Table } from 'antd';
import { IUpdateAssetTypesParams } from './index.ts';

const AssetTypesPage: FC = () => {
  const {
    list,
    roleColumns,
    SearchFormComponent,
    total,
    limit,
    loading,
    isEdit,
    formRef,
    editAssetTypesModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditAssetTypesModalOpen,
    onFinish,
  } = useAssetTypesPageHooks();
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
        rowKey='typeId'></Table>
      <Pagination
        total={total}
        className='flex justify-end mt-2'
        pageSize={limit}
        onChange={(e) => setPage(e)}
        showSizeChanger
        onShowSizeChange={(_, size) => setLimit(size)}></Pagination>
      <Modal open={editAssetTypesModalOpen} title={isEdit ? '编辑' : '新增'} onOk={onFinish} onCancel={() => setEditAssetTypesModalOpen(false)}>
        <Form form={formRef} autoComplete='off' labelAlign='left' id='editFormRef'>
          <Form.Item<IUpdateAssetTypesParams> name='typeName' label='类型名称' rules={[{ required: true, message: '请输入类型名称' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(AssetTypesPage);
