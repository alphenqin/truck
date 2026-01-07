import { FC, memo } from 'react';
import { useInventoryDetailPageHooks } from './hooks';
import { Pagination, Table } from 'antd';

const InventoryDetailPage: FC = () => {
  const {
    list,
    columns,
    SearchFormComponent,
    total,
    limit,
    loading,
    setPage,
    setLimit,
  } = useInventoryDetailPageHooks();

  return (
    <>
      {SearchFormComponent}
      <Table
        dataSource={list}
        loading={loading}
        columns={columns}
        bordered={true}
        pagination={false}
        rowKey='recordId'
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

export default memo(InventoryDetailPage);