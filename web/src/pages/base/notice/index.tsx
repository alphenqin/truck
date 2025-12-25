import React, { FC, memo } from 'react';
import { useNoticePageHooks } from './hooks.tsx'
import { Form, Input, Modal, Pagination, Table } from 'antd';
import { IUpdateNoticeParams } from './index.ts';

const NoticePage: FC = () => {
  const {
    list,
    noticeColumns,
    SearchFormComponent,
    total,
    limit,
    loading,
    isEdit,
    formRef,
    editNoticeModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditNoticeModalOpen,
    onFinish,
  } = useNoticePageHooks();
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
        columns={noticeColumns}
        bordered={true}
        pagination={false}
        rowKey='id'></Table>
      <Pagination
        total={total}
        className='flex justify-end mt-2'
        pageSize={limit}
        onChange={(e) => setPage(e)}
        showSizeChanger
        onShowSizeChange={(_, size) => setLimit(size)}></Pagination>
      <Modal open={editNoticeModalOpen} title={isEdit ? '编辑' : '新增'} onOk={onFinish} onCancel={() => setEditNoticeModalOpen(false)}>
        <Form form={formRef} autoComplete='off' labelAlign='left' id='editFormRef'>
          <Form.Item<IUpdateNoticeParams> name='ruleName' label='规则名称' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item<IUpdateNoticeParams> name='ruleKey' label='规则键' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item<IUpdateNoticeParams> name='ruleValue' label='规则值' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(NoticePage);
