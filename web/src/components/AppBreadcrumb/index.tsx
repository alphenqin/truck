import { FC, memo, useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import { menuType } from '@/types/menus';
import { getTheCurrentRoutePathAllMenuEntity } from '@/utils';
import { useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const AppBreadcrumb: FC = () => {
  const { menus } = useAppSelector((state) => state.UserStore);
  const { pathname } = useLocation();
  const [breadCrumb, setBreadCrumb] = useState<menuType[]>([]);

  useEffect(() => {
    setBreadCrumb(getTheCurrentRoutePathAllMenuEntity(pathname, menus));
  }, [menus, pathname]);

  const items = [
    { title: <HomeOutlined className='text-[var(--app-muted)]' /> },
    ...breadCrumb.map((item, index) => ({ 
      title: (
        <span className={index === breadCrumb.length - 1 ? 'font-semibold text-[var(--app-text)]' : ''}>
          {item.pageName}
        </span>
      )
    }))
  ];

  return (
    <Breadcrumb 
      items={items} 
      className='select-none text-sm' 
    />
  );
};

export default memo(AppBreadcrumb);
