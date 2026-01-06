import React, { FC, memo } from 'react';
import { useGatewayPageHooks } from './hooks.tsx';
import { Form, Input, Modal, Pagination, Table, Select, InputNumber } from 'antd';
import { IUpdateGatewayParams } from './index.ts';

const GatewayPage: FC = () => {
  const {
    list,
    gatewayColumns,
    SearchFormComponent,
    total,
    limit,
    loading,
    isEdit,
    formRef,
    editGatewayModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditGatewayModalOpen,
    onFinish,
  } = useGatewayPageHooks();
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
        columns={gatewayColumns}
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
      <Modal open={editGatewayModalOpen} title={isEdit ? '编辑' : '新增'} onOk={onFinish} onCancel={() => setEditGatewayModalOpen(false)}>
        <Form form={formRef} autoComplete='off' labelAlign='left' id='editFormRef'>
          <Form.Item<IUpdateGatewayParams> name='gatewayName' label='网关名称' rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item<IUpdateGatewayParams> name='gatewayCode' label='网关编号' rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item<IUpdateGatewayParams> name='gatewayType' label='网关类型' rules={[{ required: true }]}> 
            <Select options={[
              { label: '入库', value: 1 },
              { label: '出库', value: 2 },
              { label: '盘点', value: 3 },
            ]} />
          </Form.Item>
          <Form.Item<IUpdateGatewayParams> name='ipAddress' label='IP地址' rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item<IUpdateGatewayParams> name='port' label='端口' rules={[{ required: true }]}> 
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item<IUpdateGatewayParams> name='status' label='状态' rules={[{ required: true }]}> 
            <Select options={[
              { label: '启用', value: 1 },
              { label: '停止', value: 2 },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(GatewayPage);
