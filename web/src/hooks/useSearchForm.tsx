import { Button, Col, Form, Row } from 'antd';
import { ReactNode } from 'react';
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';

interface SearchFormProps<T extends Record<string, any>> {
  getDataRequestFn: (values: any) => void;
  onNewRecordFn: () => void;
  formItems: { label: string; name: keyof T; component: ReactNode }[];
  operateComponent?: ReactNode;
  formName: string;
  showAddBtn?: boolean;
}

export const useSearchFrom = <T extends Record<string, any>>(props: SearchFormProps<T>) => {
  const { getDataRequestFn, onNewRecordFn, formItems, operateComponent, formName, showAddBtn = true } = props;
  const [searchFormRef] = Form.useForm();
  const onFinish = () => getDataRequestFn(searchFormRef.getFieldsValue() as T);
  const onReset = () => {
    searchFormRef?.resetFields();
    getDataRequestFn({});
  };

  const SearchFormComponent = (
    <div className='app-card-flat p-4 pt-6 mb-4'>
      <Form form={searchFormRef} onReset={onReset} onFinish={onFinish} autoComplete='off' name={formName}>
        <Row gutter={[12, 12]}>
          {formItems.map((item) => {
            return (
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }} key={item.name as string}>
                <Form.Item name={item.name as any} label={item.label}>
                  {item.component}
                </Form.Item>
              </Col>
            );
          })}
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }}>
            <div className='flex flex-wrap gap-2'>
              <Button type='default' htmlType='reset' icon={<RedoOutlined />}>
                重置
              </Button>
              <Button type='primary' htmlType='submit' icon={<SearchOutlined />}>
                搜索
              </Button>
              {showAddBtn && (
                <Button type='primary' htmlType='button' icon={<PlusOutlined />} onClick={() => onNewRecordFn()}>
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
