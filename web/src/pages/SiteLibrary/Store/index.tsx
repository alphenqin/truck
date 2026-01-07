import React, { FC, memo } from 'react';
import { useStorePageHooks } from './hooks.tsx';
import { Form, Input, Modal, Pagination, Table, Select } from 'antd';
import { IUpdateStoreParams } from './index.ts';

const StorePage: FC = () => {
  const {
    list,
    columns,
    SearchFormComponent,
    total,
    limit,
    loading,
    isEdit,
    formRef,
    editStoreModalOpen,
    setPage,
    setLimit,
    setSelectedRowKeys,
    selectedRowKeys,
    setEditStoreModalOpen,
    onFinish,
    gardens,
  } = useStorePageHooks();

  const gardenOptions = gardens.map((garden) => ({
    label: garden.gardenName,
    value: garden.gardenId,
  }));

  return (
    <>
      {SearchFormComponent}
      <Table
        dataSource={list}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys as number[]),
        }}
        loading={loading}
        columns={columns}
        bordered={true}
        pagination={false}
        rowKey='storeId'
      />
      <Pagination
        total={total}
        className='flex justify-end mt-2'
        pageSize={limit}
        onChange={(page) => setPage(page)}
        showSizeChanger
        onShowSizeChange={(_, size) => setLimit(size)}
      />
      <Modal
        open={editStoreModalOpen}
        title={isEdit ? '编辑' : '新增'}
        onOk={onFinish}
        onCancel={() => setEditStoreModalOpen(false)}
      >
        <Form
          form={formRef}
          autoComplete='off'
          labelAlign='left'
          id='editFormRef'
        >
          <Form.Item<IUpdateStoreParams> name='storeName' label='场库名称' rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item<IUpdateStoreParams> name='gardenId' label='园区名称' rules={[{ required: true, message: '请选择园区' }]}> 
            <Select options={gardenOptions} placeholder="请选择园区" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(StorePage);
