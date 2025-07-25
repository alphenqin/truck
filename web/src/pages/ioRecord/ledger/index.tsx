import { FC, memo } from 'react';
import { useIoRecordPageHooks } from '@/pages/ioRecord/ledger/hooks';
import { Pagination, Table } from 'antd';

const IoRecordPage: FC = () => {
  const {
    list,
    columns,
    SearchFormComponent,
    total,
    limit,
    loading,
    setPage,
    setLimit,
  } = useIoRecordPageHooks();

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

export default memo(IoRecordPage);
