import React, { useState, useEffect } from 'react';
import { Select, Table, message, App, Space, Typography, Tabs } from 'antd';
import type { TablePaginationConfig } from 'antd';
import { 
  IStore, 
  IGroup, 
  IAsset, 
  IPage,
  IQueryParams,
  IGroupQuery,
  getStores, 
  getGroups, 
  getAssets, 
  updateAssetGroup, 
  updateGroupStore 
} from './index';

const { Option } = Select;

const VehiclePage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [activeTab, setActiveTab] = useState('1');

  // 资产-班组绑定相关状态
  const [assets, setAssets] = useState<IAsset[]>([]);
  const [assetsTotal, setAssetsTotal] = useState(0);
  const [assetsCurrentPage, setAssetsCurrentPage] = useState(1);
  const [assetsPageSize, setAssetsPageSize] = useState(10);

  // 班组-场库绑定相关状态
  const [stores, setStores] = useState<IStore[]>([]);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [groupsTotal, setGroupsTotal] = useState(0);
  const [groupsCurrentPage, setGroupsCurrentPage] = useState(1);
  const [groupsPageSize, setGroupsPageSize] = useState(10);

  // 加载状态
  const [loadingStores, setLoadingStores] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingAssets, setLoadingAssets] = useState(false);

  // 初始化数据
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingStores(true);
      setLoadingGroups(true);
      try {
        // 获取场库列表
        const storesResponse = await getStores();
        setStores(storesResponse.data);

        // 获取班组列表
        const groupsParams: IQueryParams<IGroupQuery> = {
          limit: groupsPageSize,
          offset: 0,
        };
        const groupsResponse = await getGroups(groupsParams);
        setGroups(groupsResponse.data.list);
        setGroupsTotal(groupsResponse.data.total);
      } catch (error) {
        console.error('初始化数据失败:', error);
        messageApi.error('初始化数据失败');
      } finally {
        setLoadingStores(false);
        setLoadingGroups(false);
      }
    };
    fetchInitialData();
  }, []);

  // 获取资产列表
  const fetchAssets = async (page: number, pageSize: number) => {
    setLoadingAssets(true);
    try {
      const params: IQueryParams<IAsset> = {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      };
      const response = await getAssets(params);
      setAssets(response.data.list);
      setAssetsTotal(response.data.total);
    } catch (error) {
      console.error('获取资产列表失败:', error);
      messageApi.error('获取资产列表失败');
    } finally {
      setLoadingAssets(false);
    }
  };

  // 获取班组列表
  const fetchGroups = async (page: number, pageSize: number) => {
    setLoadingGroups(true);
    try {
      const params: IQueryParams<IGroupQuery> = {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      };
      const response = await getGroups(params);
      setGroups(response.data.list);
      setGroupsTotal(response.data.total);
    } catch (error) {
      console.error('获取班组列表失败:', error);
      messageApi.error('获取班组列表失败');
    } finally {
      setLoadingGroups(false);
    }
  };

  // 监听分页变化
  useEffect(() => {
    if (activeTab === '1') {
      fetchAssets(assetsCurrentPage, assetsPageSize);
    } else {
      fetchGroups(groupsCurrentPage, groupsPageSize);
    }
  }, [activeTab, assetsCurrentPage, assetsPageSize, groupsCurrentPage, groupsPageSize]);

  // 处理资产分页变化
  const handleAssetsTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current && pagination.pageSize) {
      setAssetsCurrentPage(pagination.current);
      setAssetsPageSize(pagination.pageSize);
    }
  };

  // 处理班组分页变化
  const handleGroupsTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current && pagination.pageSize) {
      setGroupsCurrentPage(pagination.current);
      setGroupsPageSize(pagination.pageSize);
    }
  };

  // 处理资产班组变更
  const handleAssetGroupChange = async (assetId: number, groupId: number | null) => {
    try {
      await updateAssetGroup({
        assetId,
        groupId: groupId || 0, // 如果为null，传0表示取消分配
      });
      messageApi.success('更新成功');
      // 刷新资产列表
      fetchAssets(assetsCurrentPage, assetsPageSize);
    } catch (error) {
      console.error('更新失败:', error);
      messageApi.error('更新失败');
    }
  };

  // 处理班组场库变更
  const handleGroupStoreChange = async (groupId: number, storeId: number) => {
    try {
      await updateGroupStore({
        groupId,
        storeId,
      });
      messageApi.success('更新成功');
      // 刷新班组列表
      fetchGroups(groupsCurrentPage, groupsPageSize);
    } catch (error) {
      console.error('更新失败:', error);
      messageApi.error('更新失败');
    }
  };

  const assetColumns = [
    { title: '资产ID', dataIndex: 'assetId', key: 'assetId' },
    { title: '资产编码', dataIndex: 'assetCode', key: 'assetCode' },
    {
      title: '所属班组',
      key: 'groupId',
      render: (_: unknown, record: IAsset) => (
        <Select
          value={record.groupId}
          onChange={(value) => handleAssetGroupChange(record.assetId, value)}
          style={{ width: 200 }}
          placeholder="请选择班组"
        >
          <Option value={null}>未分配</Option>
          {groups.map(group => (
            <Option key={group.groupId} value={group.groupId}>{group.groupName}</Option>
          ))}
        </Select>
      ),
    },
  ];

  const groupColumns = [
    { title: '班组ID', dataIndex: 'groupId', key: 'groupId' },
    { title: '班组名称', dataIndex: 'groupName', key: 'groupName' },
    {
      title: '所属场库',
      key: 'storeId',
      render: (_: unknown, record: IGroup) => (
        <Select
          value={record.storeId || 0}
          onChange={(value) => handleGroupStoreChange(record.groupId, value)}
          style={{ width: 200 }}
          placeholder="请选择场库"
        >
          <Option value={0}>未分配</Option>
          {stores.map(store => (
            <Option key={store.StoreId} value={store.StoreId}>{store.StoreName}</Option>
          ))}
        </Select>
      ),
    },
  ];

  const AssetGroupBinding = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Table
        columns={assetColumns}
        dataSource={assets}
        rowKey="assetId"
        loading={loadingAssets}
        pagination={{
          current: assetsCurrentPage,
          pageSize: assetsPageSize,
          total: assetsTotal,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        onChange={handleAssetsTableChange}
      />
    </Space>
  );

  const GroupStoreBinding = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Table
        columns={groupColumns}
        dataSource={groups}
        rowKey="groupId"
        loading={loadingGroups}
        pagination={{
          current: groupsCurrentPage,
          pageSize: groupsPageSize,
          total: groupsTotal,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        onChange={handleGroupsTableChange}
      />
    </Space>
  );

  const items = [
    {
      key: '1',
      label: '资产-班组绑定',
      children: <AssetGroupBinding />,
    },
    {
      key: '2',
      label: '班组-场库绑定',
      children: <GroupStoreBinding />,
    },
  ];

  return (
    <App>
      {contextHolder}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
      />
    </App>
  );
};

export default VehiclePage; 