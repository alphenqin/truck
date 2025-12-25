// 引入类型和依赖
import { menuType } from '@/types/menus';
import * as React from 'react';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { MenuProps, TreeDataNode } from 'antd';
import { IAllPageInterfaceListResponse, IInterfaceResponse } from '@/service/api/interface';
import { FileTextOutlined, FolderOutlined } from '@ant-design/icons';

// 懒加载页面组件
const DashBoard = lazy(() => import('@/pages/Dashboard/'));
const SystemUser = lazy(() => import('@/pages/System/User'));
const SystemRole = lazy(() => import('@/pages/System/Role'));
const SystemDepartment = lazy(() => import('@/pages/System/Department'));
const SystemMenu = lazy(() => import('@/pages/System/Menu'));
const NotFond = lazy(() => import('@/pages/NotFond'));
const Iframe = lazy(() => import('@/components/Iframe'));
const Logs = lazy(() => import('@/pages/Monitor/Logs'));
const TimeTask = lazy(() => import('@/pages/Monitor/TimeTask'));
const CodeGenerator = lazy(() => import('@/pages/SystemUtils/CodeGenerate'));
const About = lazy(() => import('@/pages/About'));


// 我的
const Asset = lazy(() => import('@/pages/Asset/index.tsx'));
const Inventory = lazy(() => import('@/pages/Inventory/index.tsx')); // 资产管理
const Garden = lazy(() => import('@/pages/SiteLibrary/Garden/index.tsx'));
const Store = lazy(() => import('@/pages/SiteLibrary/Store/index.tsx'));
const IoRecordLedger = lazy(() => import('@/pages/ioRecord/ledger/index'));
const IoRecordBuzzer = lazy(() => import('@/pages/ioRecord/buzzer/index'));
const IoRecordPanel = lazy(() => import('@/pages/ioRecord/panel'));

const AnalysisAsset = lazy(() => import('@/pages/Analysis/asset/index.tsx'));
const AnalysisFlow = lazy(() => import('@/pages/Analysis/flow/index.tsx'));
const AnalysisStatus = lazy(() => import('@/pages/Analysis/status/index.tsx'));

const ExceptionLost = lazy(() => import('@/pages/Exception/Lost/index.tsx'));
const ExceptionFlow = lazy(() => import('@/pages/Exception/Flow/index.tsx'));

const MonitorMonitor = lazy(() => import('@/pages/Monitor/Monitor/index.tsx'));
const MonitorVehicle = lazy(() => import('@/pages/Monitor/Vehicle/index.tsx'));

// 基础管理
const BaseDepartment = lazy(() => import('@/pages/base/department/index.tsx'));
const BaseType = lazy(() => import('@/pages/base/type/index.tsx'));
const BaseLine = lazy(() => import('@/pages/base/line/index.tsx'));
const BaseArg = lazy(() => import('@/pages/base/arg/index.tsx'));
const BaseNotice = lazy(() => import('@/pages/base/notice/index.tsx'));

// iot
const IotGateway = lazy(() => import('@/pages/Iot/Gateway/index.tsx'));
const IotRfidTag = lazy(() => import('@/pages/Iot/RfidTag/index.tsx'));
const Panel = lazy(() => import('@/pages/Panel/index.tsx'));

// 页面路径与组件映射表
const pagesMap: Record<string, React.ReactNode | null> = {
  '/dashboard': <DashBoard />,
  '/system/user': <SystemUser />,
  '/system/role': <SystemRole />,
  '/system/department': <SystemDepartment />,
  '/system/menu': <SystemMenu />,
  '/monitor/logs': <Logs />,
  '/monitor/timeTask': <TimeTask />,
  '/utils/codeGenerator': <CodeGenerator />,
  '/about': <About />,

  '/asset': <Asset />,
  '/inventory': <Inventory />,
  '/site/garden': <Garden />,
  '/site/store': <Store />,
  '/io-record/ledger': <IoRecordLedger/>,
  '/io-record/buzzer': <IoRecordBuzzer/>,
  '/io-record/panel': <IoRecordPanel/>,
  '/analysis/asset': <AnalysisAsset/>,
  '/analysis/flow': <AnalysisFlow/>,
  '/analysis/status': <AnalysisStatus/>,

  '/exception/lost': <ExceptionLost/>,
  '/exception/flow': <ExceptionFlow/>,

  // 监控
  '/monitor/monitor': <MonitorMonitor/>,
  '/monitor/vehicle': <MonitorVehicle/>,

  // 基础管理
  '/base/department': <BaseDepartment/>,
  '/base/type': <BaseType/>,
  '/base/line': <BaseLine/>,
  '/base/arg': <BaseArg/>,
  '/base/notice': <BaseNotice/>,

  // iot
  '/iot/gateway': <IotGateway/>,
  '/iot/tag': <IotRfidTag/>,

  '/panel': <Panel/>,
};

// 规范化路径，去除末尾斜杠并尝试小写匹配
function resolvePageComponent(rawPath: string): React.ReactNode | null | undefined {
  const normalized = (rawPath || '').trim();
  const exact = pagesMap[normalized];
  if (exact) return exact;

  const trimmed = normalized.replace(/\/$/, '');
  if (trimmed && pagesMap[trimmed]) return pagesMap[trimmed];

  const lower = normalized.toLowerCase();
  if (pagesMap[lower]) return pagesMap[lower];

  const lowerTrimmed = lower.replace(/\/$/, '');
  return pagesMap[lowerTrimmed];
}

// 构建 Layout 主路由的子路由数组
export const builderMenuRoutes = (menus: menuType[]) => {
  const mainChildrenRoutes: RouteObject[] = [];

  function recursionMenu(menus: menuType[]) {
    menus?.forEach((item) => {
      if (item.children?.length) {
        recursionMenu(item.children);
      } else {
        // 如果是外链页面则渲染 Iframe
        if (item.isOutSite) {
          mainChildrenRoutes.push({
            path: item.pagePath,
            element: <Iframe src={item.outSiteLink}></Iframe>,
          });
        } else {
          mainChildrenRoutes.push({
            path: item.pagePath,
            element: resolvePageComponent(item.pagePath) ?? <NotFond />,
          });
        }
      }
    });
  }

  recursionMenu(menus);
  return mainChildrenRoutes;
};

// 获取当前路径的所有父路径（用于面包屑或路径回显）
export const getTheCurrentRoutePathAllMenuPath: (path: string, menus: menuType[]) => string[] = (path: string, menus: menuType[]) => {
  const paths: string[] = [];

  function traverse(node: menuType): any {
    paths.push(node.pagePath);
    if (node.pagePath === path) {
      return paths;
    }
    if (node.children) {
      for (const child of node.children) {
        const result = traverse(child);
        if (result) {
          return result;
        }
      }
    }
    paths.pop();
    return null;
  }

  for (const page of menus) {
    const result = traverse(page);
    if (result) {
      return result;
    }
  }
  return [];
};

// 获取当前路径的所有父菜单对象
export const getTheCurrentRoutePathAllMenuEntity: (path: string, menus: menuType[]) => menuType[] = (path: string, menus: menuType[]) => {
  const entity: menuType[] = [];

  function traverse(node: menuType): any {
    entity.push(node);
    if (node.pagePath === path) {
      return entity;
    }
    if (node.children) {
      for (const child of node.children) {
        const result = traverse(child);
        if (result) {
          return result;
        }
      }
    }
    entity.pop();
    return null;
  }

  for (const page of menus) {
    const result = traverse(page);
    if (result) {
      return result;
    }
  }
  return [];
};

// 通过路径查找菜单项
export const getMenuByPath: (path: string, menus: menuType[]) => menuType | undefined = (path: string, menus: menuType[]) => {
  for (const item of menus) {
    if (item.pagePath === path) {
      return item;
    }
    if (item.children?.length) {
      const menu = getMenuByPath(path, item.children);
      if (menu) {
        return menu;
      }
    }
  }
  return undefined;
};

// 获取菜单树的第一个叶子菜单（常用于默认跳转）
export const getFirstMenu: (menus: menuType[]) => menuType = (menus: menuType[]) => {
  if (menus && menus.length) {
    if (!menus[0].children?.length) {
      return menus[0];
    }
    if (menus[0].children?.length) {
      return getFirstMenu(menus[0].children);
    }
  }
  return {} as menuType;
};

// 获取用户所有菜单中的第一个非 dashboard 菜单
export const getFirstMenuChildren: (menus: menuType[]) => menuType[] = (menus: menuType[]) => {
  const firstMenuChildren: menuType[] = [];

  function recursionMenu(menus: menuType[]) {
    menus?.forEach((item) => {
      if (item.children?.length) {
        recursionMenu(item.children);
      } else {
        if (item.pagePath !== '/dashboard') {
          firstMenuChildren.push(item);
        }
      }
    });
  }

  recursionMenu(menus);
  return firstMenuChildren;
};

// 构建 Ant Design Tree 使用的菜单结构
export const buildMenuToAntdTree: (menus: menuType[]) => TreeDataNode[] = (menus: menuType[]) => {
  function recursionMenu(menus: menuType[]): TreeDataNode[] {
    const treeData: TreeDataNode[] = [];
    menus?.forEach((item) => {
      treeData.push({
        title: item.pageName,
        key: item.pageID,
        children: recursionMenu(item.children),
      });
    });
    return treeData;
  }

  return recursionMenu(menus);
};

// 获取所有子菜单的 ID（用于权限、删除等）
export const getAllChildrenMenusID: (menus: menuType[]) => string[] = (menus: menuType[]) => {
  const treeData: string[] = [];

  function recursionMenu(menus: menuType[]) {
    menus?.forEach((item) => {
      if (item.children && item.children.length > 0) {
        recursionMenu(item.children);
      } else {
        treeData.push(item.pageID);
      }
    });
  }

  recursionMenu(menus);

  return treeData;
};

// 将接口权限数据转为 Antd Tree 使用的结构
export const buildInterfaceToAntdTree: (interfaces: IAllPageInterfaceListResponse[]) => TreeDataNode[] = (interfaces: IAllPageInterfaceListResponse[]) => {
  const treeData: TreeDataNode[] = [];
  interfaces.forEach((item) => {
    treeData.push({
      title: item.key,
      key: item.key,
      selectable: false,
      children: mapInterface(item.children),
    });
  });

  return treeData;
};

// 映射接口列表为 Tree 节点
export function mapInterface(interfaces: IInterfaceResponse[]): TreeDataNode[] {
  return interfaces.map((item) => {
    return {
      title: item.interfaceName,
      key: item.id,
      children: [],
    };
  });
}

// 获取所有页面级接口分类 key（页面名）
export const getAllInterfaceKeys = (interfaces: IAllPageInterfaceListResponse[]): string[] => {
  const treeData: string[] = [];
  interfaces.forEach((item) => {
    treeData.push(item.key);
  });
  return treeData;
};

// 获取所有接口的字典标识（用于权限控制）
export const getAllInterfaceDic = (inter: IAllPageInterfaceListResponse[]): string[] => {
  const treeData: string[] = [];

  function _recursionInterface(interfaces: IAllPageInterfaceListResponse[]) {
    interfaces.forEach((item) => {
      item.children.forEach((child) => {
        treeData.push(child.interfaceDic);
      });
    });
  }

  _recursionInterface(inter);

  return treeData;
};

// 构建模拟文件结构菜单（用于代码生成器）
type MenuItem = Required<MenuProps>['items'][number];
export const GenerateFolderMenu = (TableName: string) => {
  const menus: MenuItem[] = [
    {
      key: 'Server',
      label: 'Server',
      icon: <FolderOutlined />,
      children: [
        {
          key: 'Controller',
          label: 'Controller',
          icon: <FolderOutlined />,
          children: [
            {
              key: 'controllerFile',
              label: `${TableName}Controller.go`,
              icon: <FileTextOutlined />,
            },
          ],
        },
        {
          key: 'Service',
          label: 'Service',
          icon: <FolderOutlined />,
          children: [
            {
              key: 'serviceFile',
              label: `${TableName}Service.go`,
              icon: <FileTextOutlined />,
            },
          ],
        },
        {
          key: 'Repository',
          label: 'Repository',
          icon: <FolderOutlined />,
          children: [
            {
              key: 'repositoryFile',
              label: `${TableName}Repository.go`,
              icon: <FileTextOutlined />,
            },
          ],
        },
        {
          key: 'Route',
          label: 'Route',
          icon: <FolderOutlined />,
          children: [
            {
              key: 'routeFile',
              label: `${TableName}RouteFile.go`,
              icon: <FileTextOutlined />,
            },
          ],
        },
        {
          key: 'DTO',
          label: 'DTO',
          icon: <FolderOutlined />,
          children: [
            {
              key: 'dtoFile',
              label: `${TableName}DTO.go`,
              icon: <FileTextOutlined />,
            },
          ],
        },
      ],
    },
    {
      key: 'Web',
      label: 'Web',
      icon: <FolderOutlined />,
      children: [
        {
          key: 'React',
          label: 'React',
          icon: <FolderOutlined />,
          children: [
            {
              key: 'Hook',
              label: 'Hook',
              icon: <FolderOutlined />,
              children: [
                {
                  key: 'searchForm',
                  label: `searchForm.tsx`,
                  icon: <FileTextOutlined />,
                },
                {
                  key: 'tableHook',
                  label: `${TableName}Hook.tsx`,
                  icon: <FileTextOutlined />,
                },
              ],
            },
            {
              key: 'Pages',
              label: 'Pages',
              icon: <FolderOutlined />,
              children: [
                {
                  key: 'table',
                  label: `${TableName}Page.tsx`,
                  icon: <FileTextOutlined />,
                },
              ],
            },
          ],
        },
        {
          key: 'Vue',
          label: 'Vue',
          icon: <FolderOutlined />,
        },
      ],
    },
  ];

  return menus;
};
