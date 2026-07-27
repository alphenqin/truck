import { FC, memo } from 'react';
import { Form, Input, Modal, Pagination, Table } from 'antd';
import { useGroupInfoPageHooks } from './hooks';

const GroupInfoPage: FC = () => {
  const {
    form, list, columns, SearchFormComponent,
    selectedRowKeys, setSelectedRowKeys,
    page, setPage, limit, setLimit, total, loading,
    modalOpen, setModalOpen, saving, editing, saveGroup,
  } = useGroupInfoPageHooks();

  return (
    <>
      {SearchFormComponent}
      <Table
        dataSource={list}
        columns={columns}
        loading={loading}
        bordered
        pagination={false}
        rowKey='groupId'
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
      />
      <Pagination
        current={page}
        total={total}
        pageSize={limit}
        className='flex justify-end mt-2'
        showSizeChanger
        onChange={(nextPage) => setPage(nextPage)}
        onShowSizeChange={(_, size) => {
          setPage(1);
          setLimit(size);
        }}
      />
      <Modal
        open={modalOpen}
        title={editing ? '编辑班组' : '新增班组'}
        confirmLoading={saving}
        onOk={saveGroup}
        onCancel={() => setModalOpen(false)}
        okText='确定'
        cancelText='取消'
      >
        <Form form={form} layout='vertical' autoComplete='off'>
          <Form.Item
            name='groupName'
            label='班组名称'
            rules={[
              { required: true, message: '请输入班组名称' },
              { max: 100, message: '班组名称不能超过100个字符' },
            ]}
          >
            <Input allowClear placeholder='请输入班组名称' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(GroupInfoPage);
