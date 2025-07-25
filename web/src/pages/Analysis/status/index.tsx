import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAssetStatusStatistics, IAssetAssetStatusStatistic, statusMap } from './index';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const AssetStatusStatistics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<IAssetAssetStatusStatistic[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAssetStatusStatistics();
        // Assuming the API returns data in response.data.list
        if (response && response.data && Array.isArray(response.data.list)) {
           setStatistics(response.data.list);
        } else {
           setStatistics([]);
           console.error('获取资产状态统计数据格式不正确:', response);
        }
      } catch (error) {
        console.error('获取资产状态统计失败:', error);
        setStatistics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <Card title="资产状态统计" className="h-full">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        ) : (statistics.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={statistics}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label={({ status, percent }) => `${statusMap[status] || status}: ${(percent * 100).toFixed(1)}%`}
              >
                {statistics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string, props: any) => [`${value}个`, statusMap[props.payload.status] || name]} />
              <Legend formatter={(value: string) => statusMap[parseInt(value)] || value} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-full">暂无数据</div>
        ))}
      </Card>
    </div>
  );
};

export default AssetStatusStatistics;
