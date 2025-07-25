import React, { FC, memo } from 'react';
import { usegarendsPageHooks } from './hooks.tsx'
import { Form, Input, Modal, Pagination, Table } from 'antd';
import { IUpdategarendsParams } from './index.ts';

const garendsPage: FC = () => {
  const {
    list,
    roleColumns,
    SearchFormComponent,
    total,
    limit,
    loading,
    isEdit,
    formRef,
    editgarendsModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditgarendsModalOpen,
    onFinish,
  } = usegarendsPageHooks();
  return (
    <>
      {/* SearchFormComponent 本身就是 JSX 元素，直接渲染即可 */}
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
        rowKey='gardenId'></Table>
      <Pagination
        total={total}
        className='flex justify-end mt-2'
        pageSize={limit}
        onChange={(e) => setPage(e)}
        showSizeChanger
        onShowSizeChange={(_, size) => setLimit(size)}></Pagination>
      <Modal open={editgarendsModalOpen} title={isEdit ? '编辑' : '新增'} onOk={onFinish} onCancel={() => setEditgarendsModalOpen(false)}>
        <Form form={formRef} autoComplete='off' labelAlign='left' id='editFormRef'>
          <Form.Item<IUpdategarendsParams> name='gardenName' label='园区名称' rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(garendsPage);
