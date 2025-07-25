import { useEffect } from 'react';
import { Layout, MenuProps } from 'antd';
import { menuType } from '@/types/menus';
import { Icon } from '@/components';
import { useAppSelector } from '@/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFirstMenu, getMenuByPath, getTheCurrentRoutePathAllMenuPath } from '@/utils';
import { useDispatch } from 'react-redux';
import { addTabHeader, changeDefaultOpenKeys, changeDefaultSelectedKeys } from '@/store/UIStore';
import { constants } from '@/constant';

export const useMainPage = () => {
  const { Header, Sider, Content } = Layout; // Antd 布局组件结构
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { menus } = useAppSelector((state) => state.UserStore); // 获取菜单列表
  const { pathname } = useLocation();

  // ✅ 每次路由变化时，更新菜单高亮 & 展开项
  useEffect(() => {
    dispatch(changeDefaultSelectedKeys([pathname])); // 设置选中项
    dispatch(changeDefaultOpenKeys(getTheCurrentRoutePathAllMenuPath(pathname, menus))); // 设置展开项
  }, [pathname, menus]);

  // ✅ 如果访问的是根路径 / ，自动跳转到第一个菜单页面
  useEffect(() => {
    if (menus.length && pathname === constants.routePath.main) {
      navigateHome();
    }
  }, []);

  // ✅ 跳转到第一个菜单页面
  const navigateHome = () => {
    if (menus && menus.length) {
      const firstMenu = getFirstMenu(menus); // 获取第一个叶子菜单
      dispatch(changeDefaultSelectedKeys([firstMenu.pagePath] || []));
      dispatch(changeDefaultOpenKeys(getTheCurrentRoutePathAllMenuPath(firstMenu.pagePath, menus)));
      dispatch(addTabHeader(getMenuByPath(firstMenu.pagePath, menus) || ({} as menuType)));
      navigate(firstMenu.pagePath);
    }
  };

  // ✅ 菜单项点击事件处理
  const onSelect: MenuProps['onSelect'] = (e) => {
    dispatch(changeDefaultSelectedKeys(e.selectedKeys)); // 设置选中菜单
    dispatch(changeDefaultOpenKeys(e.keyPath)); // 设置展开路径
    dispatch(addTabHeader(getMenuByPath(e.key, menus) || ({} as menuType))); // 加入标签页
    navigate(e.key); // 路由跳转
  };

  // ✅ 菜单展开/折叠事件
  const onOpenChange = (e: string[]) => {
    dispatch(changeDefaultOpenKeys(e));
  };

  return {
    menus: getItem(menus), // 转换后的菜单结构，适配 Ant Design Menu 使用
    Header,
    Sider,
    Content,
    onSelect,
    onOpenChange,
    navigateHome,
  };
};

type returnType = {
  key: string;
  icon: any;
  label: string;
  children?: returnType[];
};

// ✅ 递归将 menuType[] 转为 Ant Design Menu 所需结构
function getItem(menu: menuType[]): returnType[] {
  return menu?.map((item) => {
    return {
      key: item.pagePath,
      icon: <Icon name={item.pageIcon as any} />,
      label: item.pageName,
      children: item.children && getItem(item.children),
    };
  });
}
