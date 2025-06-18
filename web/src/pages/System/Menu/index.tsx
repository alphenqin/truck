import { FC, memo, useEffect, useState } from 'react';
import { Button, Drawer, Form, Input, InputNumber, Modal, Select, Space, Switch, Table, TableColumnsType, Tag } from 'antd';
import { createMenuRequest, deleteMenuRequest, getAllMenusRequest, updateMenuRequest } from '@/service';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useForm } from 'antd/es/form/Form';
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { menuType } from '@/types';
import { Icon, IconSelect } from '@/components';
import {
  addInterfaceRequest,
  deleteInterfaceRequest,
  getInterfaceListByPageIDRequest,
  IInterfaceResponse,
  updateInterfaceRequest,
} from '@/service/api/interface';
import Auth from '@/components/Auth';
import { constants } from '@/constant';

const SystemMenu: FC = () => {
  const { t } = useTranslation(); // 国际化
  const [form] = useForm();
  const [resourceFormRef] = useForm();
  const [menuList, setMenuList] = useState<menuType[]>([]); // 菜单列表
  const [modalOpen, setModalOpen] = useState(false); // 控制菜单弹窗是否打开
  const [resourceModalOpen, setResourceModalOpen] = useState(false); // 控制资源弹窗是否打开
  const [editResourceOpen, setEditResourceOpen] = useState(false); // 控制资源 Drawer 是否打开
  const [isEdit, setIsEdit] = useState(false); // 是否是编辑菜单
  const [editCurrentMenu, setEditCurrentMenu] = useState<menuType>(); // 当前正在编辑的菜单
  const [editCurrentResource, setEditCurrentResource] = useState<IInterfaceResponse>(); // 当前正在编辑的资源
  const [isEditResource, setIsEditResource] = useState(false); // 是否是编辑资源
  const [resourceList, setResourceList] = useState<IInterfaceResponse[]>([]); // 资源列表

  // 获取所有菜单数据
  const getPageData = async () => {
    const result = await getAllMenusRequest();
    setMenuList(result.data);
  };

  // 获取指定菜单的接口资源
  const getPageInterfaceAction = async (id: string) => {
    if (!id) return;
    const result = await getInterfaceListByPageIDRequest(id);
    setResourceList(result.data);
  };

  // 请求方法颜色映射
  const methodColorMap: Record<string, string> = {
    GET: 'green',
    POST: 'blue',
    PUT: 'orange',
    DELETE: 'red',
    PATCH: 'purple',
    OPTIONS: 'cyan',
  };

  // 菜单表格列配置
  const columns: TableColumnsType<menuType> = [
    {
      title: t('menuName'),
      dataIndex: 'pageName',
      align: 'center',
      key: 'pageName',
    },
    {
      title: t('menuIcon'),
      dataIndex: 'pageIcon',
      align: 'center',
      key: 'pageIcon',
      render: (text) => {
        return <Icon name={text}></Icon>;
      },
    },
    {
      title: t('menuPath'),
      dataIndex: 'pagePath',
      align: 'center',
      key: 'pagePath',
    },
    {
      title: t('menuComponent'),
      dataIndex: 'pageComponent',
      align: 'center',
      key: 'pageComponent',
    },
    {
      title: t('order'),
      dataIndex: 'pageOrder',
      align: 'center',
      key: 'pageOrder',
    },
    {
      title: t('menuType'),
      dataIndex: 'isOutSite',
      align: 'center',
      key: 'isOutSite',
      render: (text) => {
        return text ? <Tag color='warning'>{t('routeExternalType')}</Tag> : <Tag color='green'>{t('routeInnerType')}</Tag>;
      },
    },
    {
      title: t('createTime'),
      align: 'center',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => {
        return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: t('updateTime'),
      align: 'center',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (text) => {
        return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: t('operate'),
      dataIndex: 'operation',
      align: 'center',
      key: 'operation',
      render: (_, row) => {
        return (
          <div className='text-[#00b0f0] flex gap-2 items-center justify-center cursor-pointer'>
            {/* 编辑菜单 */}
            <Auth permission={constants.permissionDicMap.UPDATE_MENU}>
              <span
                onClick={() => {
                  setEditCurrentMenu(row);
                  setIsEdit(true);
                  setModalOpen(true);
                  form.setFieldsValue(row);
                }}>
                {t('edit')}
              </span>
            </Auth>
            {/* 添加子菜单 */}
            <Auth permission={constants.permissionDicMap.ADD_MENU}>
              <span
                onClick={() => {
                  setEditCurrentMenu(row);
                  setIsEdit(false);
                  setModalOpen(true);
                  form.resetFields();
                }}>
                {t('addMenu')}
              </span>
            </Auth>
            {/* 编辑资源 */}
            {!row?.children?.length && (
              <Auth permission={constants.permissionDicMap.GET_PAGE_INTERFACE}>
                <span
                  onClick={async () => {
                    setEditCurrentMenu(row);
                    await getPageInterfaceAction(row.pageID);
                    setEditResourceOpen(true);
                  }}>
                  {t('resource')}
                </span>
              </Auth>
            )}
            {/* 删除菜单 */}
            <Auth permission={constants.permissionDicMap.UPDATE_MENU}>
              <span
                className='text-red-500'
                onClick={async () => {
                  await deleteMenuRequest(row.pageID);
                  await getPageData();
                }}>
                {t('delete')}
              </span>
            </Auth>
          </div>
        );
      },
    },
  ];

  // 资源表格列配置
  const resourceColumns: TableColumnsType<IInterfaceResponse> = [
    {
      title: t('interfaceName'),
      dataIndex: 'interfaceName',
      align: 'center',
      key: 'interfaceName',
    },
    {
      title: t('interfacePath'),
      dataIndex: 'interfacePath',
      align: 'center',
      key: 'interfacePath',
    },
    {
      title: t('interfaceDic'),
      dataIndex: 'interfaceDic',
      align: 'center',
      key: 'interfaceDic',
    },
    {
      title: t('interfaceMethod'),
      dataIndex: 'interfaceMethod',
      align: 'center',
      key: 'interfaceMethod',
      render: (text) => {
        return <Tag color={methodColorMap[text]}>{text}</Tag>;
      },
    },
    {
      title: t('interfaceDesc'),
      dataIndex: 'interfaceDesc',
      align: 'center',
      key: 'interfaceDesc',
    },
    {
      title: t('createTime'),
      dataIndex: 'createTime',
      align: 'center',
      key: 'createTime',
      render: (text) => {
        return <span>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: t('updateTime'),
      dataIndex: 'updateTime',
      align: 'center',
      key: 'updateTime',
      render: (text) => {
        return <span>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: t('operate'),
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (_, row) => {
        return (
          <div className='text-[#00b0f0] flex gap-2 items-center justify-center cursor-pointer'>
            {/* 编辑资源 */}
            <Auth permission={constants.permissionDicMap.UPDATE_PAGE_INTERFACE}>
              <span
                onClick={() => {
                  setIsEditResource(true);
                  setEditCurrentResource(row);
                  setResourceModalOpen(true);
                  resourceFormRef.setFieldsValue(row);
                }}>
                {t('edit')}
              </span>
            </Auth>
            {/* 删除资源 */}
            <Auth permission={constants.permissionDicMap.DELETE_PAGE_INTERFACE}>
              <span
                className='text-red-500'
                onClick={async () => {
                  await deleteInterfaceRequest(row.id);
                  await getPageInterfaceAction(row.interfacePageID);
                }}>
                {t('delete')}
              </span>
            </Auth>
          </div>
        );
      },
    },
  ];

  // 菜单确认添加或编辑
  const onOk = () => {
    form.validateFields().then(async (values) => {
      if (isEdit) {
        editCurrentMenu?.pageID && (await updateMenuRequest(editCurrentMenu.pageID, values));
      } else {
        await createMenuRequest({ ...values, ParentPage: editCurrentMenu?.pageID });
      }
      setModalOpen(false);
      getPageData().then();
    });
  };

  // 添加资源按钮点击
  const addResource = () => {
    setIsEditResource(false);
    setResourceModalOpen(true);
    resourceFormRef.resetFields();
  };

  // 添加或编辑资源
  const resourceEditOrAdd = () => {
    resourceFormRef.validateFields().then(async (values) => {
      if (isEditResource) {
        editCurrentResource?.id && (await updateInterfaceRequest({ ...editCurrentResource, ...values }));
      } else {
        await addInterfaceRequest({ ...values, interfacePageID: editCurrentMenu?.pageID });
      }
      setResourceModalOpen(false);
      await getPageInterfaceAction(editCurrentMenu!.pageID);
    });
  };

  useEffect(() => {
    getPageData().then();
  }, []);

  return (
    <>
      {/* 菜单顶部操作栏 */}
      <div className='mb-2 flex justify-between items-center bg-white p-4 rounded dark:bg-[#001620]'>
        <span className='font-bold'>{t('menuList')}</span>
        <Auth permission={constants.permissionDicMap.ADD_MENU}>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => {
              setEditCurrentMenu(undefined);
              form.resetFields();
              setIsEdit(false);
              setModalOpen(true);
            }}>
            {t('add')}
          </Button>
        </Auth>
      </div>

      {/* 菜单表格 */}
      <Table columns={columns} dataSource={menuList} bordered key='menuTable' rowKey='pageID' />

      {/* 菜单添加/编辑弹窗 */}
      <Modal open={modalOpen} onCancel={() => setModalOpen(false)} title={isEdit ? t('edit') : t('add')} onOk={onOk}>
        <Form form={form} labelAlign='left' labelCol={{ span: 6 }} autoComplete='off'>
          <Form.Item label={t('menuName')} name='pageName' rules={[{ required: true }]}>
            <Input placeholder={t('pleaseEnter')} />
          </Form.Item>
          <Form.Item label={t('menuPath')} name='pagePath' rules={[{ required: true }]}>
            <Input allowClear placeholder={t('pleaseEnter')}></Input>
          </Form.Item>
          <Form.Item label={t('menuIcon')} name='pageIcon' rules={[{ required: true }]}>
            <IconSelect></IconSelect>
          </Form.Item>
          {/* 是否外链判断，如果不是外链才显示组件路径 */}
          <Form.Item noStyle shouldUpdate rules={[{ required: true }]}>
            {({ getFieldValue }) => {
              return (
                (!getFieldValue('isOutSite') && (
                  <Form.Item label={t('menuComponent')} name='pageComponent' rules={[{ required: true }]}>
                    <Input allowClear placeholder={t('pleaseEnter')}></Input>
                  </Form.Item>
                )) ||
                null
              );
            }}
          </Form.Item>
          <Form.Item label={t('order')} name='pageOrder' rules={[{ required: true }]}>
            <InputNumber type='number' style={{ width: '100%' }} placeholder={t('pleaseEnter')} />
          </Form.Item>
          <Form.Item label={t('isOutSite')} name='isOutSite' rules={[{ required: true }]} initialValue={false}>
            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
          </Form.Item>
          {/* 外链链接输入 */}
          <Form.Item rules={[{ required: true }]} noStyle shouldUpdate>
            {({ getFieldValue }) => {
              return (
                (getFieldValue('isOutSite') && (
                  <Form.Item label={t('outSiteLink')} name='outSiteLink' rules={[{ required: true, type: 'url' }]}>
                    <Input allowClear placeholder={t('pleaseEnter')}></Input>
                  </Form.Item>
                )) ||
                null
              );
            }}
          </Form.Item>
        </Form>
      </Modal>

      {/* 资源抽屉 */}
      <Drawer
        open={editResourceOpen}
        title={t('resource')}
        width='70%'
        onClose={() => setEditResourceOpen(false)}
        extra={
          <Space>
            <Button onClick={() => setEditResourceOpen(false)}>{t('cancel')}</Button>
            <Auth permission={constants.permissionDicMap.ADD_PAGE_INTERFACE}>
              <Button type='primary' onClick={addResource} icon={<PlusOutlined />}>
                {t('add')}
              </Button>
            </Auth>
          </Space>
        }>
        <Table dataSource={resourceList} bordered columns={resourceColumns} rowKey='id'></Table>
      </Drawer>

      {/* 资源编辑弹窗 */}
      <Modal
        open={resourceModalOpen}
        onCancel={() => setResourceModalOpen(false)}
        onOk={resourceEditOrAdd}
        title={isEditResource ? t('edit') : t('add')}
        mask={false}>
        <Form form={resourceFormRef} labelCol={{ span: 6 }} autoComplete='off'>
          <Form.Item label={t('interfaceName')} name='interfaceName' rules={[{ required: true }]}>
            <Input placeholder={t('pleaseEnter')} />
          </Form.Item>
          <Form.Item label={t('interfacePath')} name='interfacePath' rules={[{ required: true }]}>
            <Input placeholder={t('pleaseEnter')} />
          </Form.Item>
          <Form.Item label={t('interfaceMethod')} name='interfaceMethod' rules={[{ required: true }]}>
            <Select placeholder={t('pleaseEnter')}>
              <Select.Option value='GET'>GET</Select.Option>
              <Select.Option value='POST'>POST</Select.Option>
              <Select.Option value='PATCH'>PATCH</Select.Option>
              <Select.Option value='DELETE'>DELETE</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label={t('interfaceDic')} name='interfaceDic' rules={[{ required: true }]}>
            <Input placeholder={t('pleaseEnter')} />
          </Form.Item>
          <Form.Item label={t('interfaceDesc')} name='interfaceDesc' rules={[{ required: true }]}>
            <Input placeholder={t('pleaseEnter')} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(SystemMenu);
