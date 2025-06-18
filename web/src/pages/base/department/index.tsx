import React, { FC, memo } from 'react';
import { useDepartmentsPageHooks } from './hooks.tsx'
import { Form, Input, Modal, Pagination, Table } from 'antd';
import { IUpdateDepartmentsParams } from './index.ts';

const DepartmentsPage: FC = () => {
  const {
    list,
    roleColumns,
    SearchFormComponent,
    total,
    limit,
    loading,
    isEdit,
    formRef,
    editDepartmentsModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditDepartmentsModalOpen,
    onFinish,
  } = useDepartmentsPageHooks();

  return (
    <>
      {SearchFormComponent}
      <Table
        dataSource={list}
        rowSelection={{
          onChange: (selectedRowKeys: React.Key[]) => {
            setSelected(selectedRowKeys);
          },
        }}
        loading={loading}
        columns={roleColumns}
        bordered={true}
        pagination={false}
        rowKey='departmentId'
      />
      <Pagination
        total={total}
        className='flex justify-end mt-2'
        pageSize={limit}
        onChange={(e) => setPage(e)}
        showSizeChanger
        onShowSizeChange={(_, size) => setLimit(size)}
      />
      <Modal 
        open={editDepartmentsModalOpen} 
        title={isEdit ? '编辑部门' : '新增部门'} 
        onOk={onFinish} 
        onCancel={() => setEditDepartmentsModalOpen(false)}
      >
        <Form form={formRef} autoComplete='off' labelAlign='left' id='editFormRef'>
          <Form.Item<IUpdateDepartmentsParams> 
            name='departmentName' 
            label='部门名称' 
            rules={[{ required: true, message: '请输入部门名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<IUpdateDepartmentsParams> 
            name='storeId' 
            label='场库ID' 
            rules={[{ required: true, message: '请输入场库ID' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(DepartmentsPage);