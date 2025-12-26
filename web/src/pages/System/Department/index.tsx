import { FC, memo, useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Table, TableColumnsType } from 'antd';
import { addDepartmentRequest, deleteDepartmentRequest, getDepartmentRequest, IDepartmentResponse, updateDepartmentRequest } from '@/service';
import dayjs from 'dayjs';
import { useForm } from 'antd/es/form/Form';
import { PlusOutlined } from '@ant-design/icons';
import Auth from '@/components/Auth';
import { constants } from '@/constant';

const SystemDepartment: FC = () => {
  const [form] = useForm();
  const [departmentList, setDepartmentList] = useState<IDepartmentResponse[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editCurrentDepartment, setEditCurrentDepartment] = useState<IDepartmentResponse>();
  const getPageData = async () => {
    const result = await getDepartmentRequest();
    setDepartmentList(result.data);
  };

  const columns: TableColumnsType<IDepartmentResponse> = [
    {
      title: '部门名称',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: '排序',
      align: 'center',
      dataIndex: 'departmentOrder',
      key: 'departmentOrder',
    },
    {
      title: '部门描述',
      align: 'center',
      dataIndex: 'departmentDescription',
      key: 'departmentDescription',
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => {
        return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (text) => {
        return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      key: 'operation',
      render: (_, row) => {
        return (
          <div className='text-[#00b0f0] flex gap-2 items-center justify-center cursor-pointer'>
            <Auth permission={constants.permissionDicMap.UPDATE_DEPARTMENT}>
              <span
                onClick={() => {
                  setEditCurrentDepartment(row);
                  setIsEdit(true);
                  setModalOpen(true);
                  form.setFieldsValue(row);
                }}>
                编辑
              </span>
            </Auth>
            <Auth permission={constants.permissionDicMap.ADD_DEPARTMENT}>
              <span
                onClick={() => {
                  setEditCurrentDepartment(row);
                  setIsEdit(false);
                  setModalOpen(true);
                  form.resetFields();
                }}>
                新增部门
              </span>
            </Auth>
            <Auth permission={constants.permissionDicMap.DELETE_DEPARTMENT}>
              <span
                className='text-red-500'
                onClick={() => {
                  Modal.confirm({
                    title: '确认删除',
                    content: '确定要删除该部门吗？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: async () => {
                      await deleteDepartmentRequest(row.id);
                      await getPageData();
                    },
                  });
                }}>
                删除
              </span>
            </Auth>
          </div>
        );
      },
    },
  ];

  const onOk = () => {
    form.validateFields().then(async (values) => {
      if (isEdit) {
        if (!editCurrentDepartment?.id) return;
        await updateDepartmentRequest(editCurrentDepartment?.id, values);
      } else {
        await addDepartmentRequest({ ...values, parentDepartment: editCurrentDepartment?.id });
      }
      setModalOpen(false);
      getPageData().then();
    });
  };

  useEffect(() => {
    getPageData().then();
  }, []);
  return (
    <>
      <div className='mb-3 flex justify-between items-center app-card-flat p-4'>
        <span className='font-bold'>部门列表</span>
        <Auth permission={constants.permissionDicMap.ADD_DEPARTMENT}>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => {
              setEditCurrentDepartment(undefined);
              form.resetFields();
              setIsEdit(false);
              setModalOpen(true);
            }}>
            新增
          </Button>
        </Auth>
      </div>
      <Table columns={columns} dataSource={departmentList} bordered key='departmentTable' rowKey='id' />
      <Modal open={modalOpen} onCancel={() => setModalOpen(false)} title={isEdit ? '编辑' : '新增'} onOk={onOk}>
        <Form form={form} labelAlign='left' labelCol={{ span: 6 }} autoComplete='off'>
          <Form.Item name='departmentName' label='部门名称' rules={[{ required: true }]}>
            <Input placeholder='请输入' />
          </Form.Item>
          <Form.Item name='departmentDescription' label='部门描述' rules={[{ required: true }]}>
            <Input placeholder='请输入' />
          </Form.Item>
          <Form.Item name='departmentOrder' label='排序' rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} type='number' placeholder='请输入' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(SystemDepartment);
