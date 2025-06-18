import { FC, memo, useEffect, useRef, useState } from 'react';
// 导入相关接口和API方法
import { code, createTemplateRequest, downloadTemplateRequest, ICreateTemplateParams, reactType, server } from '@/service/api/template';
// 导入Ant Design图标
import { EyeOutlined, FileZipOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
// 导入Ant Design组件
import { Button, ConfigProvider, Drawer, Empty, Form, Input, Layout, Menu, MenuProps, Select } from 'antd';
// 导入生成菜单的工具函数
import { GenerateFolderMenu } from '@/utils';
// 导入Redux自定义Hook
import { useAppSelector } from '@/store';
// 导入AntD表单Hook
import { useForm } from 'antd/es/form/Form';
// 国际化Hook
import { useTranslation } from 'react-i18next';
// 导入代码编辑器组件及其Ref类型
import CodeEdit, { ICodeEditRefProps } from '@/components/CodeEdit';
// 文件下载工具
import { saveAs } from 'file-saver';
// Antd布局组件
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
// 权限组件
import Auth from '@/components/Auth';
// 常量
import { constants } from '@/constant';

// 组件定义
const CodeGenerate: FC = () => {
  // 表单实例
  const [form] = useForm();
  // 国际化
  const { t } = useTranslation();
  // 代码编辑器Ref
  const CodeEditRef = useRef<ICodeEditRefProps>(null);
  // 是否允许下载
  const [canDownLoad, setCanDownLoad] = useState(false);
  // Redux中主题模式
  const { themeMode } = useAppSelector((state) => state.UIStore);
  // 当前选中的菜单项
  const [currentSelected, setCurrentSelected] = useState<keyof server | keyof reactType>('controllerFile');
  // 是否显示代码编辑器
  const [showEditor, setShowEditor] = useState(false);

  // 代码片段的状态
  const [controllerCode, setControllerCode] = useState<code>();
  const [serviceCode, setServiceCode] = useState<code>();
  const [repositoryCode, setRepositoryCode] = useState<code>();
  const [routeFileCode, setRouteFileCode] = useState<code>();
  const [dtoCode, setDtoCode] = useState<code>();
  const [reactSearchFormCode, setReactSearchFormCode] = useState<code>();
  const [reactTableCode, setReactTableCode] = useState<code>();
  const [reactTableHookCode, setReactTableHookCode] = useState<code>();

  // 所有代码模块的集合，包含代码内容和setState方法
  const [codeModules, setCodeModules] = useState({
    controllerFile: {
      code: controllerCode,
      setState: setControllerCode,
    },
    serviceFile: {
      code: serviceCode,
      setState: setServiceCode,
    },
    repositoryFile: {
      code: repositoryCode,
      setState: setRepositoryCode,
    },
    routeFile: {
      code: routeFileCode,
      setState: setRouteFileCode,
    },
    dtoFile: {
      code: dtoCode,
      setState: setDtoCode,
    },
    searchForm: {
      code: reactSearchFormCode,
      setState: setReactSearchFormCode,
    },
    table: {
      code: reactTableCode,
      setState: setReactTableCode,
    },
    tableHook: {
      code: reactTableHookCode,
      setState: setReactTableHookCode,
    },
  });

  // 创建模板的方法，调用接口并设置各个代码片段的状态
  const createTemplateAction = async (value: ICreateTemplateParams) => {
    const result = await createTemplateRequest(value);
    setControllerCode(result.data.server.controllerFile);
    setServiceCode(result.data.server.serviceFile);
    setRepositoryCode(result.data.server.repositoryFile);
    setRouteFileCode(result.data.server.routeFile);
    setDtoCode(result.data.server.dtoFile);
    setReactTableCode(result.data.web.react.table);
    setReactTableHookCode(result.data.web.react.tableHook);
    setReactSearchFormCode(result.data.web.react.searchForm);
    // 更新codeModules
    setCodeModules({
      controllerFile: {
        code: result.data.server.controllerFile,
        setState: setControllerCode,
      },
      serviceFile: {
        code: result.data.server.serviceFile,
        setState: setServiceCode,
      },
      repositoryFile: {
        code: result.data.server.repositoryFile,
        setState: setRepositoryCode,
      },
      routeFile: {
        code: result.data.server.routeFile,
        setState: setRouteFileCode,
      },
      dtoFile: {
        code: result.data.server.dtoFile,
        setState: setDtoCode,
      },
      searchForm: {
        code: result.data.web.react.searchForm,
        setState: setReactSearchFormCode,
      },
      tableHook: {
        code: result.data.web.react.tableHook,
        setState: setReactTableHookCode,
      },
      table: {
        code: result.data.web.react.table,
        setState: setReactTableCode,
      },
    });
    setShowEditor(true); // 显示代码编辑器
  };

  // 菜单的默认选中项和展开项
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>(['controllerFile']);
  const [defaultOpenKeys, setDefaultOpenKeys] = useState<string[]>(['Server', 'Controller', 'controllerFile']);

  // 菜单选择事件
  const onSelect: MenuProps['onSelect'] = (e) => {
    setDefaultSelectedKeys(e.selectedKeys); // 选中的key
    setDefaultOpenKeys(e.keyPath); // 展开的keyPath
    setCurrentSelected(e.selectedKeys[0] as keyof server | keyof reactType); // 当前选中项
  };

  // 监听各代码片段的变化，及时同步到codeModules
  useEffect(() => {
    setCodeModules({
      controllerFile: {
        code: controllerCode,
        setState: setControllerCode,
      },
      serviceFile: {
        code: serviceCode,
        setState: setServiceCode,
      },
      repositoryFile: {
        code: repositoryCode,
        setState: setRepositoryCode,
      },
      routeFile: {
        code: routeFileCode,
        setState: setRouteFileCode,
      },
      dtoFile: {
        code: dtoCode,
        setState: setDtoCode,
      },
      searchForm: {
        code: reactSearchFormCode,
        setState: setReactSearchFormCode,
      },
      tableHook: {
        code: reactTableHookCode,
        setState: setReactTableHookCode,
      },
      table: {
        code: reactTableCode,
        setState: setReactTableCode,
      },
    });
  }, [controllerCode, serviceCode, repositoryCode, routeFileCode, dtoCode, reactSearchFormCode, reactTableHookCode, reactTableCode]);

  // 菜单项类型
  type MenuItem = Required<MenuProps>['items'][number];
  // 动态生成菜单
  const menus: MenuItem[] = GenerateFolderMenu('UserTable');

  // 控制Drawer显示
  const [open, setOpen] = useState(false);

  // 表单提交事件
  const onFinish = (values: any) => {
    createTemplateAction(values).then(() => {
      setOpen(true); // 打开Drawer
      setCanDownLoad(true); // 允许下载
    });
  };

  // 下载模板事件
  const downLoadAction = () => {
    downloadTemplateRequest({
      tableName: 'UserTable',
      controller: controllerCode?.code,
      service: serviceCode?.code,
      repository: repositoryCode?.code,
      route: routeFileCode?.code,
      dto: dtoCode?.code,
      searchForm: reactSearchFormCode?.code,
      tableHook: reactTableHookCode?.code,
      table: reactTableCode?.code,
    }).then((res) => {
      saveAs(res, 'UserTableTemplate.zip'); // 保存为zip文件
    });
  };

  return (
    <div className='h-full flex flex-col relative bg-[#ffffff] dark:bg-[#041527] rounded-md'>
      {/* 表单区域 */}
      <div className='mb-4 rounded p-4 overflow-auto relative no-scrollbar'>
        <Form name='form' form={form} onFinish={onFinish} style={{ maxWidth: 600 }} autoComplete='off'>
          {/* 包名输入项 */}
          <Form.Item label='包名（package）' name='package' rules={[{ required: true }]} initialValue='cms'>
            <Input></Input>
          </Form.Item>
          {/* 表名称输入项 */}
          <Form.Item label='表名称' name='tableName' rules={[{ required: true }]} initialValue='Users'>
            <Input></Input>
          </Form.Item>
          {/* 字段列表动态表单 */}
          <Form.List
            name='fields'
            initialValue={[
              { name: 'Name', type: 'string', default: '' },
              { name: 'Age', type: 'int', default: '0' },
            ]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className='w-[1000px]'>
                    <div className='flex items-center justify-between gap-4'>
                      {/* 字段名称 */}
                      <Form.Item {...restField} name={[name, 'name']} className='flex-1' label='字段名称' rules={[{ required: true, type: 'string' }]}>
                        <Input placeholder={t('pleaseEnter')} />
                      </Form.Item>
                      {/* 字段类型 */}
                      <Form.Item {...restField} name={[name, 'type']} label='字段类型' rules={[{ required: true }]}>
                        <Select
                          style={{ width: '200px' }}
                          placeholder={t('pleaseSelect')}
                          options={[
                            { label: 'int', value: 'int' },
                            { label: 'string', value: 'string' },
                            { label: 'float', value: 'float' },
                            { label: 'boolean', value: 'boolean' },
                            { label: 'date', value: 'date' },
                            { label: 'datetime', value: 'datetime' },
                            { label: 'time', value: 'time' },
                          ]}
                        />
                      </Form.Item>
                      {/* 默认值 */}
                      <Form.Item {...restField} name={[name, 'default']} label='默认值'>
                        <Input placeholder={t('pleaseEnter')} />
                      </Form.Item>
                      {/* 添加字段按钮 */}
                      <Form.Item>
                        <PlusCircleOutlined onClick={() => add()} />
                      </Form.Item>
                      {/* 删除字段按钮 */}
                      <Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Form.Item>
                    </div>
                  </div>
                ))}
              </>
            )}
          </Form.List>
          {/* 预览按钮，带权限判断 */}

            <Button type='primary' htmlType='submit' icon={<EyeOutlined />} className='absolute top-0 left-[650px] mt-4 mr-4'>
              {t('preview')}
            </Button>

        </Form>
      </div>
      {/* 代码预览Drawer */}
      <Drawer
        title=''
        width='100%'
        height='100%'
        placement='left'
        closable={true}
        onClose={() => setOpen(false)}
        open={open}
        getContainer={false}
        extra={
          // 下载按钮，带权限判断
            <Button type='primary' icon={<FileZipOutlined />} onClick={downLoadAction} disabled={!canDownLoad}>
              {t('downloadZip')}
            </Button>
        }>
        {showEditor ? (
          // 代码编辑器布局
          <Layout className='flex-1 overflow-hidden rounded-md h-full'>
            {/* 左侧菜单 */}
            <Sider width={280} collapsible={false}>
              <div className='h-full bg-white dark:bg-[#1c1d2c]'>
                <ConfigProvider
                  theme={{
                    components: {
                      Menu: {
                        subMenuItemBg: themeMode === 'dark' ? '#1e1f32' : '#fff',
                        itemHoverBg: themeMode === 'dark' ? '#1e1f32' : '#f6f6f6',
                        itemSelectedBg: themeMode === 'dark' ? '#2f3245' : '#f6f6f6',
                        fontSize: 12,
                        iconMarginInlineEnd: 5,
                      },
                    },
                  }}>
                  <Menu
                    mode='inline'
                    items={menus}
                    onSelect={onSelect}
                    onOpenChange={(openKeys) => setDefaultOpenKeys(openKeys)}
                    selectedKeys={defaultSelectedKeys}
                    openKeys={defaultOpenKeys}
                    defaultSelectedKeys={defaultSelectedKeys}
                    defaultOpenKeys={defaultOpenKeys}
                    className='h-full rounded dark:bg-[#1e1f32]'></Menu>
                </ConfigProvider>
              </div>
            </Sider>
            {/* 右侧代码编辑器 */}
            <Content className='flex-1'>
              {codeModules[currentSelected]?.code?.code && codeModules[currentSelected]?.code?.lang && (
                <CodeEdit
                  defaultCode={codeModules[currentSelected]?.code?.code}
                  defaultLang={codeModules[currentSelected]?.code?.lang}
                  editCode={codeModules[currentSelected].setState}
                  ref={CodeEditRef}
                />
              )}
            </Content>
          </Layout>
        ) : (
          // 没有代码时展示空态
          <div className='w-full h-full justify-center items-center flex-1 overflow-hidden rounded-md bg-[#ffffff] dark:bg-[#1a1b26]'>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className='mt-40' />
          </div>
        )}
      </Drawer>
    </div>
  );
};

// 使用memo优化，防止不必要的重渲染
export default memo(CodeGenerate);
