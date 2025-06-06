import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
// import { useTranslation } from 'react-i18next'; // Assuming i18n might be removed later
import {
  getAssetRequest,
//   createassetRequest, // Remove
//   deleteassetRequest, // Remove
//   updateassetRequest, // Remove
  IQueryAssetParams,
  IAssetResponse,
//   IUpdateassetParams, // Remove
  IHasTotalResponse,
} from './index'; // Correct API import path

// Assuming assetTypeMap is needed for display, keep it if not removed from index.ts
// import { assetTypeMap } from '@/service/api/ioRecord/index'; // Correct import path if needed

export const useAssetPageHooks = () => {
  // const { t } = useTranslation(); // Assuming i18n might be removed later
  const [loading, setLoading] = useState(false);
  const [assetList, setAssetList] = useState<IAssetResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [queryInfo, setQueryInfo] = useState<IQueryAssetParams>({
    limit: 10,
    offset: 0,
  });

  const fetchAssetList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAssetRequest(queryInfo);
      if (res.data) {
        setAssetList(res.data.list);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error('Error fetching asset list:', error);
      message.error('Failed to fetch asset list');
    } finally {
      setLoading(false);
    }
  }, [queryInfo]);

  useEffect(() => {
    fetchAssetList();
  }, [fetchAssetList]);

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryInfo({
      ...queryInfo,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
  };

  const handleSearch = (values: Partial<IQueryAssetParams>) => {
    setQueryInfo({
      ...queryInfo,
      ...values,
      offset: 0, // Reset to first page on new search
    });
  };

  return {
    loading,
    assetList,
    total,
    queryInfo,
    fetchAssetList,
    handlePageChange,
    handleSearch,
  };
};
