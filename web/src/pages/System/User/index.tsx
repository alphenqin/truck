import { IUserPageHooks, IUserPageRefProps, useUserPageHooks } from '@/pages/System/User/hooks.tsx';
import { IUpdateUserParams } from '@/service';
import { Button, Form, Input, Modal, Pagination, Select, Table, TreeSelect } from 'antd';
import { forwardRef, Key, memo } from 'react';
import { useSearchFrom } from '@/hooks/useSearchForm.tsx';
import { DownloadOutlined } from '@ant-design/icons';
import { constants } from '@/constant';
import Auth from '@/components/Auth';

const SystemUser = (props?: IUserPageHooks, ref?: any) => {
  const {
    userPageRef,
    total,
    columns,
    departments,
    users,
    editFormRef,
    editUserModalOpen,
    roles,
    isEdit,
    limit,
    searchConfig,
    selected,
    loading,
    exportUsersAction,
    setSelected,
    getPageData,
    setPage,
    setLimit,
    editUserConfirm,
    setEditUserModalOpen,
    editUserAction,
  } = useUserPageHooks(ref, props);
  const { SearchFormComponent } = useSearchFrom({
    getDataRequestFn: getPageData,
    onNewRecordFn: editUserAction,
    formItems: searchConfig,
    operateComponent: !!selected.length && (
      <Auth permission={constants.permissionDicMap.EXPORT_USER}>
        <Button type='primary' icon={<DownloadOutlined />} onClick={exportUsersAction}>
          导出
        </Button>
      </Auth>
    ),
    formName: 'userSearchForm',
    showAddBtn: props?.module !== constants.module.ROLE,
  });
  return (
    <div ref={userPageRef}>
      {SearchFormComponent}
      <Table
        dataSource={users}
        loading={loading}
        columns={columns}
        rowSelection={{
          onChange: (selectedRowKeys: Key[]) => {
            setSelected(selectedRowKeys);
          },
        }}
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
      <Modal destroyOnClose open={editUserModalOpen} title={isEdit ? '编辑' : '新增'} onOk={editUserConfirm} onCancel={() => setEditUserModalOpen(false)}>
        <Form form={editFormRef} autoComplete='off' labelAlign='left' labelCol={{ span: 6 }} id='editFormRef'>
          {!isEdit && (
            <Form.Item<IUpdateUserParams> name='account' label='账号' rules={[{ required: !isEdit }]}>
              <Input />
            </Form.Item>
          )}
          <Form.Item<IUpdateUserParams> name='nickname' label='昵称' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item<IUpdateUserParams> name='password' label='密码' rules={[{ required: !isEdit }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item<IUpdateUserParams> name='departmentID' label='部门' rules={[{ required: !isEdit }]}>
            <TreeSelect allowClear treeData={departments}></TreeSelect>
          </Form.Item>
          <Form.Item<IUpdateUserParams> name='rolesID' label='角色' rules={[{ required: !isEdit }]}>
            <Select allowClear mode='multiple'>
              {roles?.map((item) => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.roleName}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item<IUpdateUserParams> name='status' label='状态' rules={[{ required: !isEdit }]}>
            <Select>
              <Select.Option value='0'>禁用</Select.Option>
              <Select.Option value='1'>启用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default memo(forwardRef<IUserPageRefProps, IUserPageHooks>(SystemUser));
