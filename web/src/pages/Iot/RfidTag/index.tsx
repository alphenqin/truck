import React, { FC, memo } from 'react';
import { useRfidTagPageHooks } from './hooks.tsx';
import { Form, Input, Modal, Pagination, Table, Select, DatePicker } from 'antd';
import { useTranslation } from 'react-i18next';
import { IUpdateRfidTagParams } from './index.ts';
import moment from 'moment';

const RfidTagPage: FC = () => {
  const {
    list,
    rfidTagColumns,
    SearchFormComponent,
    total,
    limit,
    loading,
    isEdit,
    formRef,
    editRfidTagModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditRfidTagModalOpen,
    onFinish,
  } = useRfidTagPageHooks();
  const { t } = useTranslation();
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
        columns={rfidTagColumns}
        bordered={true}
        pagination={false}
        rowKey='id'
      ></Table>
      <Pagination
        total={total}
        className='flex justify-end mt-2'
        pageSize={limit}
        onChange={(e) => setPage(e)}
        showSizeChanger
        onShowSizeChange={(_, size) => setLimit(size)}
      ></Pagination>
      <Modal open={editRfidTagModalOpen} title={isEdit ? t('edit') : t('add')} onOk={onFinish} onCancel={() => setEditRfidTagModalOpen(false)}>
        <Form form={formRef} autoComplete='off' labelAlign='left' id='editFormRef'>
          <Form.Item<IUpdateRfidTagParams> name='tagCode' label='标签编码' rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item<IUpdateRfidTagParams> name='status' label='状态' rules={[{ required: true }]}> 
            <Select options={[
              { label: '启用', value: 1 },
              { label: '停止', value: 2 },
            ]} />
          </Form.Item>
          <Form.Item<IUpdateRfidTagParams> name='heartbeat' label='心跳'> 
            <Input />
          </Form.Item>
          <Form.Item<IUpdateRfidTagParams> name='reportTime' label='上报时间' rules={[{ 
            validator: (_, value) => {
              if (!value) {
                return Promise.resolve();
              }
              if (!moment(value, "YYYY/MM/DD HH:mm:ss", true).isValid()) {
                return Promise.reject(new Error('格式不正确，应为 YYYY/MM/DD HH:mm:ss'));
              }
              return Promise.resolve();
            },
          }]}> 
            <Input placeholder="YYYY/MM/DD HH:mm:ss" />
          </Form.Item>
          <Form.Item<IUpdateRfidTagParams> name='electricity' label='电量' rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(RfidTagPage);
