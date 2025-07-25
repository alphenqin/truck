import React, { useState } from 'react';
import { Card, Row, Col, Button, DatePicker } from 'antd';
import { Pie } from '@ant-design/plots';
import { useAssetCountData } from './hooks';

const { RangePicker } = DatePicker;

const AssetCountPanel: React.FC = () => {
  const [range, setRange] = useState<any>();
  const { data, loading, fetchAssetCount } = useAssetCountData();

  const handleSearch = () => {
    if (range && range.length === 2) {
      fetchAssetCount({
        startTime: range[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: range[1].format('YYYY-MM-DD HH:mm:ss'),
      });
    }
  };

  const pieConfig = {
    data,
    angleField: 'count',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {value}',
    },
    legend: { position: 'right' },
    loading,
  };

  return (
    <Card style={{ marginBottom: 24 }}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <RangePicker showTime onChange={setRange} />
        </Col>
        <Col>
          <Button type="primary" onClick={handleSearch}>查询</Button>
        </Col>
      </Row>
      <Pie {...pieConfig} />
    </Card>
  );
};

const AssetPage: React.FC = () => {
  return <AssetCountPanel />;
};

export default AssetPage;
