import { useState } from 'react';
import { getAssetCount, AssetCountParams, AssetCountItem } from './index';

export function useAssetCountData() {
  const [data, setData] = useState<AssetCountItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAssetCount = async (params: AssetCountParams) => {
    setLoading(true);
    try {
      const res = await getAssetCount(params);
      setData(res.list);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, fetchAssetCount };
}
