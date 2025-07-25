import { FC, memo } from 'react';
import { useBuzzersPageHooks } from '@/pages/ioRecord/buzzer/hooks'
import { Form, Input, Modal, Pagination, Table, InputNumber } from 'antd';

const BuzzerPage: FC = () => {
  const {
    list,
    roleColumns,
    SearchFormComponent,
    total,
    limit,
    loading,
    isEdit,
    formRef,
    editBuzzersModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditBuzzersModalOpen,
    onFinish,
  } = useBuzzersPageHooks();

  return (
    <>
      {SearchFormComponent}
      <Table
        dataSource={list}
        loading={loading}
        columns={roleColumns}
        bordered={true}
        pagination={false}
        rowKey='buzzerId'
        rowSelection={{
          onChange: (selectedRowKeys) => setSelected(selectedRowKeys as number[]),
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
      <Modal open={editBuzzersModalOpen} title={isEdit ? '编辑' : '新增'} onOk={onFinish} onCancel={() => setEditBuzzersModalOpen(false)}>
        <Form form={formRef} autoComplete='off' labelAlign='left' id='editFormRef'>
          {isEdit && (
            <Form.Item name='buzzerId' label={'蜂鸣器 ID'} rules={[{ required: true, message: '请输入蜂鸣器 ID' }]}>
              <InputNumber style={{ width: '100%' }} disabled={isEdit} />
            </Form.Item>
          )}
          <Form.Item name='buzzerRule' label={'蜂鸣器规则'} rules={[{ required: true, message: '请输入蜂鸣器规则' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(BuzzerPage);
