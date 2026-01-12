import { Button, Col, Form, Row } from 'antd';
import { ReactNode } from 'react';

interface SearchFormProps<T extends Record<string, any>> {
  getDataRequestFn: (values: any) => void;
  onNewRecordFn: () => void;
  formItems: { label: string; name: keyof T; component: ReactNode }[];
  operateComponent?: ReactNode;
  formName: string;
  showAddBtn?: boolean;
  actionSize?: 'small' | 'middle' | 'large';
  actionWrap?: boolean;
  actionWrapperClassName?: string;
  actionButtonClassName?: string;
  containerClassName?: string;
}

export const useSearchFrom = <T extends Record<string, any>>(props: SearchFormProps<T>) => {
  const {
    getDataRequestFn,
    onNewRecordFn,
    formItems,
    operateComponent,
    formName,
    showAddBtn = true,
    actionSize = 'middle',
    actionWrap = true,
    actionWrapperClassName = '',
    actionButtonClassName = '',
    containerClassName = 'p-4 pt-6 mb-4',
  } = props;
  const [searchFormRef] = Form.useForm();
  const onFinish = () => getDataRequestFn(searchFormRef.getFieldsValue() as T);
  const onReset = () => {
    searchFormRef?.resetFields();
    getDataRequestFn({});
  };

  const SearchFormComponent = (
    <div className={`app-card-flat ${containerClassName}`}>
      <Form form={searchFormRef} onReset={onReset} onFinish={onFinish} autoComplete='off' name={formName}>
        <Row gutter={[12, 12]}>
          {formItems.map((item) => {
            return (
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }} key={item.name as string}>
                <Form.Item name={item.name as any} label={item.label} style={{ marginBottom: 0 }}>
                  {item.component}
                </Form.Item>
              </Col>
            );
          })}
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }}>
            <div className={`flex ${actionWrap ? 'flex-wrap' : 'flex-nowrap'} gap-2 items-center h-full ${actionWrapperClassName}`}>
              <Button type='default' htmlType='reset' size={actionSize} className={actionButtonClassName}>
                重置
              </Button>
              <Button type='primary' htmlType='submit' size={actionSize} className={actionButtonClassName}>
                搜索
              </Button>
              {showAddBtn && (
                <Button type='primary' htmlType='button' onClick={() => onNewRecordFn()} size={actionSize} className={actionButtonClassName}>
                  新增
                </Button>
              )}
              {operateComponent}
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );

  return {
    SearchFormComponent,
  };
};
