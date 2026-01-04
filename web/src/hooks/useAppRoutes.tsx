import { RouteObject, useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { builderMenuRoutes, getFirstMenu } from '@/utils';
import { lazy, useEffect, useState } from 'react';
import routes from '@/router';
const NotFond = lazy(() => import('@/pages/NotFond'));
import { constants } from '@/constant';

export const useAppRouter = () => {
  const navigate = useNavigate(); // 用于路由跳转
  const { menus, token } = useAppSelector((state) => state.UserStore); // 从全局状态中获取菜单和 token
  const { pathname } = useLocation(); // 当前路由路径
  const [routesWithMenus, setRoutesWithMenus] = useState<RouteObject[]>([]); // 动态路由表（含菜单）
  const [isLoading, setIsLoading] = useState(true); // 添加加载状态

  // 如果没有 token，强制跳转到登录页
  useEffect(() => {
    if (!token) {
      navigate(constants.routePath.login, { replace: true });
    }
  }, [token, navigate]);

  // 当菜单或当前路径变化时，重新构建动态路由
  useEffect(() => {
    const menuRoutes = builderMenuRoutes(menus);
    const routesWithDynamicMenus: RouteObject[] = routes.map<RouteObject>((route) => {
      if ('index' in route && route.index) {
        return route;
      }
      if (route.path === constants.routePath.main) {
        return {
          ...route,
          children: menuRoutes.length
            ? [...menuRoutes, { path: '*', element: <NotFond /> }]
            : [{ path: '*', element: <NotFond /> }],
        };
      }
      return route;
    });

    // 设置新的路由表（包含菜单）
    setRoutesWithMenus(routesWithDynamicMenus);

    // 如果当前路径是主路径（例如 "/main"），并且菜单已加载完毕，则跳转到第一个菜单页面
    if (pathname === constants.routePath.main) {
      if (!menus.length) return; // 菜单为空不跳转
      const firstMenuPath = getFirstMenu(menus)?.pagePath || constants.routePath.login;
      navigate(firstMenuPath); // 跳转到第一个菜单项对应的路径
    }

    // 设置加载完成
    setIsLoading(false);
  }, [menus, pathname, navigate]);

  // 如果正在加载且不是登录页，显示加载状态
  if (isLoading && pathname !== constants.routePath.login) {
    return {
      element: (
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg">加载中...</div>
        </div>
      ),
    };
  }

  return {
    // 根据当前动态路由生成可用的路由元素（用于渲染）
    element: useRoutes(routesWithMenus),
  };
};
