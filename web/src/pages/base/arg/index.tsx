import React, { FC, memo } from 'react';
import { useArgsPageHooks } from './hooks.tsx'
import { Form, Input, Modal, Pagination, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { IUpdateArgsParams } from './index.ts';

const ArgsPage: FC = () => {
  const {
    list,
    roleColumns,
    SearchFormComponent,
    total,
    limit,
    loading,
    isEdit,
    formRef,
    editArgsModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditArgsModalOpen,
    onFinish,
  } = useArgsPageHooks();
  const { t } = useTranslation();
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
        rowKey='id'></Table>
      <Pagination
        total={total}
        className='flex justify-end mt-2'
        pageSize={limit}
        onChange={(e) => setPage(e)}
        showSizeChanger
        onShowSizeChange={(_, size) => setLimit(size)}></Pagination>
      <Modal open={editArgsModalOpen} title={isEdit ? t('edit') : t('add')} onOk={onFinish} onCancel={() => setEditArgsModalOpen(false)}>
        <Form form={formRef} autoComplete='off' labelAlign='left' id='editFormRef'>
          <Form.Item<IUpdateArgsParams> name='argKey' label='参数键' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item<IUpdateArgsParams> name='argName' label='参数名称' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item<IUpdateArgsParams> name='argValue' label='参数值' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(ArgsPage);
