import React, { FC, memo } from 'react';
import { useLinesPageHooks } from './hooks.tsx'
import { Form, Input, Modal, Pagination, Table } from 'antd';
import { IUpdateLinesParams, ILinesResponse } from './index.ts';

const LinesPage: FC = () => {
  const {
    list,
    roleColumns,
    SearchFormComponent,
    total,
    limit,
    loading,
    isEdit,
    formRef,
    editLinesModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditLinesModalOpen,
    onFinish,
  } = useLinesPageHooks();
  return (
    <>
      {SearchFormComponent}
      <Table<ILinesResponse>
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
        rowKey='lineId'></Table>
      <Pagination
        total={total}
        className='flex justify-end mt-2'
        pageSize={limit}
        onChange={(e) => setPage(e)}
        showSizeChanger
        onShowSizeChange={(_, size) => setLimit(size)}></Pagination>
      <Modal open={editLinesModalOpen} title={isEdit ? '编辑' : '新增'} onOk={onFinish} onCancel={() => setEditLinesModalOpen(false)}>
        <Form form={formRef} autoComplete='off' labelAlign='left' id='editFormRef'>
          {isEdit && (
            <Form.Item<IUpdateLinesParams> name='lineId' label='线路ID' rules={[{ required: true, message: '请输入线路ID' }]}>
              <Input type="number" disabled={true} min={1} />
          </Form.Item>
          )}
          <Form.Item<IUpdateLinesParams> name='lineName' label='线路名称' rules={[{ required: true, message: '请输入线路名称' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(LinesPage);
