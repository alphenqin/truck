import { FC, memo } from 'react';
import { Form, Select } from 'antd';
import * as AllIcons from '@ant-design/icons';
import { Icon } from '@/components';

const IconSelect: FC = () => {
  const options = Object.keys(AllIcons)
    .slice(0, 300)
    .map((key: any) => {
      return {
        value: key,
        label: (
          <>
            <Icon name={key} props={{ className: 'mr-2' }}></Icon>
            {key}
          </>
        ),
      };
    });
  return (
    <Form.Item name='pageIcon' shouldUpdate noStyle>
      <Select placeholder='请输入' showSearch options={options}></Select>
    </Form.Item>
  );
};

export default memo(IconSelect);
