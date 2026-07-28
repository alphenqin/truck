import { FC, memo } from 'react';
import { useOperationLogPageHooks } from '@/pages/Monitor/Logs/hooks';
import { Pagination, Table } from 'antd';

const LogsPage: FC = () => {
  const {
    list,
    columns,
    SearchFormComponent,
    total,
    limit,
    loading,
    setPage,
    setLimit,
  } = useOperationLogPageHooks();

  return (
    <>
      {SearchFormComponent}
      <Table
        dataSource={list}
        loading={loading}
        columns={columns}
        bordered={true}
        pagination={false}
        rowKey='id'
      />
      <Pagination
        total={total}
        className='flex justify-end mt-2'
        pageSize={limit}
        onChange={(page) => setPage(page)}
        showSizeChanger
        onShowSizeChange={(_, size) => setLimit(size)}
      />
    </>
  );
};

export default memo(LogsPage);
