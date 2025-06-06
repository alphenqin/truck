import { Button, Col, Form, Row } from 'antd';
import { ReactNode } from 'react';
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

// 定义传入 useSearchFrom 的参数类型
interface SearchFormProps<T extends Record<string, any>> {
  // 查询请求函数，提交表单时触发
  getDataRequestFn: (values: any) => void;
  // 新增按钮点击回调
  onNewRecordFn: () => void;
  // 搜索表单项配置：每项包含 label、字段名 name 和对应的组件
  formItems: { label: string; name: keyof T; component: ReactNode }[];
  // 额外操作组件，例如导出按钮（可选）
  operateComponent?: ReactNode;
  // 表单唯一名称
  formName: string;
  // 是否显示新增按钮（默认显示）
  showAddBtn?: boolean;
}

// useSearchFrom Hook：用于生成标准搜索表单组件
export const useSearchFrom = <T extends Record<string, any>>(props: SearchFormProps<T>) => {
  const {
    getDataRequestFn,  // 请求数据函数
    onNewRecordFn,      // 新增回调函数
    formItems,          // 表单项配置
    operateComponent,   // 操作区组件
    formName,           // 表单名称
    showAddBtn = true,  // 控制是否显示新增按钮（默认 true）
  } = props;

  const [searchFormRef] = Form.useForm(); // 创建 Ant Design 表单引用
  const { t } = useTranslation(); // 国际化 Hook

  // 表单提交时的处理函数，执行查询
  const onFinish = () => getDataRequestFn(searchFormRef.getFieldsValue() as T);

  // 重置按钮处理函数，清空表单并重新请求所有数据
  const onReset = () => {
    searchFormRef?.resetFields();
    getDataRequestFn({});
  };

  // 搜索表单组件 UI，返回给页面使用
  const SearchFormComponent = (
    <div className='bg-white p-4 pt-10 mb-4 rounded dark:bg-[#001620]'>
      <Form
        form={searchFormRef}
        onReset={onReset}
        onFinish={onFinish}
        autoComplete='off'
        name={formName}
      >
        <Row gutter={[10, 10]}>
          {/* 遍历表单项配置生成搜索项 */}
          {formItems.map((item) => {
            return (
              <Col key={item.name as string}>
                <Form.Item name={item.name as any} label={item.label}>
                  {item.component}
                </Form.Item>
              </Col>
            );
          })}

          {/* 操作按钮区：重置、搜索、新增、自定义操作组件 */}
          <Col span={24}>
            <div className='flex flex-wrap items-center justify-end'>
              {/* 重置按钮 */}
              <Button
                type='primary'
                className='mx-2'
                htmlType='reset'
                icon={<RedoOutlined />}
              >
                {t('reset')}
              </Button>

              {/* 查询按钮 */}
              <Button
                type='primary'
                className='mx-2'
                htmlType='submit'
                icon={<SearchOutlined />}
              >
                {t('search')}
              </Button>

              {/* 新增按钮（可控制是否显示） */}
              {showAddBtn && (
                <Button
                  type='primary'
                  className='mx-2'
                  htmlType='button'
                  icon={<PlusOutlined />}
                  onClick={() => onNewRecordFn()}
                >
                  {t('add')}
                </Button>
              )}

              {/* 批量删除按钮（operateComponent，放在导出按钮左边） */}
              {operateComponent && Array.isArray(operateComponent) ? (
                <>
                  {operateComponent.map((item, idx) =>
                    idx === 0 ? <span key={idx} className='mx-2'>{item}</span> : null
                  )}
                </>
              ) : operateComponent ? (
                <span className='mx-2'>{operateComponent}</span>
              ) : null}

              {/* 导出按钮（operateComponent，放在最右边） */}
              {operateComponent && Array.isArray(operateComponent) ? (
                <>
                  {operateComponent.map((item, idx) =>
                    idx === 1 ? <span key={idx} className='mx-2'>{item}</span> : null
                  )}
                </>
              ) : null}
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );

  // 返回封装好的表单组件
  return {
    SearchFormComponent,
  };
};
