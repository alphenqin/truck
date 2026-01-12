import { FC, memo } from 'react';
import { Form, Input, Modal, Pagination, Table } from 'antd';
import { useAssetBindPageHooks } from './hooks';

const AssetBindPage: FC = () => {
  const {
    list,
    columns,
    SearchFormComponent,
    total,
    limit,
    loading,
    setPage,
    setLimit,
    createOpen,
    setCreateOpen,
    handleCreate,
    createLoading,
    formRef,
    editOpen,
    setEditOpen,
    handleEdit,
    editLoading,
    editFormRef,
    selectedRowKeys,
    setSelectedRowKeys,
  } = useAssetBindPageHooks();

  return (
    <>
      {SearchFormComponent}
      <Table
        dataSource={list}
        loading={loading}
        columns={columns}
        bordered
        pagination={false}
        rowKey='id'
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
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
        open={createOpen}
        title='新增资产绑定'
        onOk={handleCreate}
        onCancel={() => setCreateOpen(false)}
        confirmLoading={createLoading}
      >
        <Form form={formRef} layout='vertical'>
          <Form.Item name='assetCode' label='资产编码' rules={[{ required: true, message: '请输入资产编码' }]}>
            <Input placeholder='请输入资产编码' />
          </Form.Item>
          <Form.Item name='tagCode' label='标签编码' rules={[{ required: true, message: '请输入标签编码' }]}>
            <Input placeholder='请输入标签编码' />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={editOpen}
        title='编辑资产绑定'
        onOk={handleEdit}
        onCancel={() => setEditOpen(false)}
        confirmLoading={editLoading}
      >
        <Form form={editFormRef} layout='vertical'>
          <Form.Item name='assetCode' label='资产编码' rules={[{ required: true, message: '请输入资产编码' }]}>
            <Input placeholder='请输入资产编码' />
          </Form.Item>
          <Form.Item name='tagCode' label='标签编码' rules={[{ required: true, message: '请输入标签编码' }]}>
            <Input placeholder='请输入标签编码' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(AssetBindPage);
