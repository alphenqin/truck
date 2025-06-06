import { RouteObject, useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { builderMenuRoutes, getFirstMenu } from '@/utils';
import { useEffect, useState } from 'react';
import routes from '@/router';
import NotFond from '@/pages/NotFond';
import { constants } from '@/constant';

export const useAppRouter = () => {
  const navigate = useNavigate(); // 用于路由跳转
  const { menus, token } = useAppSelector((state) => state.UserStore); // 从全局状态中获取菜单和 token
  const { pathname } = useLocation(); // 当前路由路径
  const [routesWithMenus, setRoutesWithMenus] = useState<RouteObject[]>([]); // 动态路由表（含菜单）

  // const menus = staticMenus
  console.log(menus)

  // 如果没有 token，强制跳转到登录页
  useEffect(() => {
    if (!token) {
      navigate(constants.routePath.login, { replace: true });
    }
  }, [token, navigate]);

  // 当菜单或当前路径变化时，重新构建动态路由
  useEffect(() => {
    const routesWithDynamicMenus = [...routes]; // 拷贝基础路由（静态部分）

    // 为主框架路由（通常是 layout 或 main）添加菜单路由
    routesWithDynamicMenus[1].children = builderMenuRoutes(menus);

    // 添加 404 路由兜底
    routesWithDynamicMenus[1].children?.push({
      path: '*',
      element: <NotFond />,
    });

    // 设置新的路由表（包含菜单）
    setRoutesWithMenus(routesWithDynamicMenus);

    // 如果当前路径是主路径（例如 "/main"），并且菜单已加载完毕，则跳转到第一个菜单页面
    if (pathname === constants.routePath.main) {
      if (!menus.length) return; // 菜单为空不跳转
      const firstMenuPath = getFirstMenu(menus)?.pagePath || constants.routePath.login;
      navigate(firstMenuPath); // 跳转到第一个菜单项对应的路径
    }
  }, [menus, pathname, navigate]);

  return {
    // 根据当前动态路由生成可用的路由元素（用于渲染）
    element: useRoutes(routesWithMenus),
  };
};
