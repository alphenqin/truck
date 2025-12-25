// 引入 react-router-dom 提供的类型
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

// 引入常量定义（如路径常量）
import { constants } from '@/constant';

// 懒加载页面组件
const Login = lazy(() => import('@/pages/Login'));
const Main = lazy(() => import('@/LayOut'));

// 定义静态路由表
export const routes: RouteObject[] = [
  {
    // 登录页面路由
    path: constants.routePath.login, // 如：'/login'
    element: <Login />,
  },
  {
    // 主布局路由，通常作为子页面的容器
    path: constants.routePath.main, // 如：'/'
    element: <Main />,
    children: [], // 子路由占位，可由 useRoutes 或动态添加
  },
];

// 默认导出
export default routes;
