import { FC, memo, Suspense, useEffect, useRef, useState } from 'react';
import { useFullscreen } from 'ahooks';
import { useMainPage } from '@/LayOut/hooks.tsx';
import { useTheme } from '@/hooks/useTheme';
import { Outlet, useNavigate } from 'react-router-dom';
import { Image, Layout, Menu, Popover, Spin, Badge, Tooltip } from 'antd';
import { AppBreadcrumb, ThemeBar } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  FullscreenOutlined, 
  FullscreenExitOutlined,
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  BellOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { changeFold } from '@/store/UIStore';
import { cache } from '@/utils';
import Logo from '@/assets/svg/logo.svg';
import classNames from 'classnames';
import { constants } from '@/constant';
import LoadingGIF from '@/assets/image/loading.gif';

const Main: FC = () => {
  const dispatch = useAppDispatch();
  const fullscreenRef = useRef();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { Sider, Header, Content, menus, onSelect, onOpenChange, navigateHome } = useMainPage();
  const { defaultSelectedKeys, defaultOpenKeys, isFold } = useAppSelector((state) => state.UIStore);
  const { themeMode } = useTheme();
  const navigate = useNavigate();
  const { userInfo } = useAppSelector((state) => state.UserStore);
  const [_, { toggleFullscreen }] = useFullscreen(fullscreenRef);

  const changeFoldAction = () => {
    dispatch(changeFold(!isFold));
  };

  const handleFullscreen = () => {
    toggleFullscreen();
    setIsFullscreen(!isFullscreen);
  };

  const logOutAction = () => {
    cache.clear();
    navigate(constants.routePath.login);
  };

  useEffect(() => {
    setErrorMessages([
      '系统检测到异常数据',
      '设备连接不稳定',
      '数据同步延迟'
    ]);
  }, []);

  return (
    <Layout className='h-screen overflow-hidden select-none'>
      {/* 左侧菜单栏 */}
      <Sider 
        width={260}
        collapsedWidth={72}
        theme={themeMode} 
        className='hidden md:block app-sider' 
        style={{ 
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }} 
        trigger={null} 
        collapsible 
        collapsed={isFold}
      >
        {/* Logo 区域 */}
        <div
          className='app-sider-brand cursor-pointer press-scale flex-shrink-0'
          onClick={navigateHome}
        >
          <Image 
            src={Logo} 
            width={isFold ? 32 : 28} 
            preview={false}
            className='tran-fast'
          />
          {!isFold && <span className='brand-text'>工装车管理系统</span>}
        </div>

        {/* 左侧菜单内容 */}
        <div className='flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar'>
          <Menu
            onSelect={onSelect}
            mode='inline'
            theme={themeMode}
            items={menus}
            onOpenChange={onOpenChange}
            selectedKeys={defaultSelectedKeys}
            openKeys={isFold ? [] : defaultOpenKeys}
            inlineIndent={20}
          />
        </div>
      </Sider>

      {/* 右侧主区域 */}
      <Layout className='flex flex-col min-h-0'>
        {/* 顶部导航栏 */}
        <Header className='app-header flex items-center justify-between px-5 h-[60px] shrink-0'>
          {/* 左侧：折叠按钮 + 面包屑 */}
          <div className='flex items-center gap-4'>
            <Tooltip title={isFold ? '展开菜单' : '收起菜单'}>
              <div 
                className='app-header-action press-scale' 
                onClick={changeFoldAction}
              >
                {isFold ? (
                  <MenuUnfoldOutlined className='text-lg' />
                ) : (
                  <MenuFoldOutlined className='text-lg' />
                )}
              </div>
            </Tooltip>
            <AppBreadcrumb />
          </div>

          {/* 右侧：功能按钮区 */}
          <div className='flex items-center gap-2'>
            {/* 通知按钮 */}
            <Popover
              content={
                <div className='w-[280px] max-h-[320px] overflow-y-auto'>
                  <div className='px-3 py-2 border-b border-[var(--app-border)] font-semibold text-sm'>
                    系统通知
                  </div>
                  {errorMessages.length > 0 ? (
                    errorMessages.map((msg, index) => (
                      <div 
                        key={index} 
                        className='py-3 px-3 hover:bg-[var(--app-accent-soft)] cursor-pointer flex items-start gap-2 border-b border-[var(--app-border)] last:border-b-0 tran-fast'
                      >
                        <BellOutlined className='text-amber-500 mt-0.5' />
                        <span className='text-sm text-[var(--app-text-secondary)]'>{msg}</span>
                      </div>
                    ))
                  ) : (
                    <div className='py-6 text-center text-[var(--app-muted)] text-sm'>
                      暂无通知
                    </div>
                  )}
                </div>
              }
              trigger='click'
              placement='bottomRight'
              arrow={false}
            >
              <Tooltip title='通知'>
                <div className='app-header-action'>
                  <Badge count={errorMessages.length} size='small' offset={[-2, 2]}>
                    <BellOutlined className='text-lg text-[var(--app-muted)]' />
                  </Badge>
                </div>
              </Tooltip>
            </Popover>

            {/* 全屏按钮 */}
            <Tooltip title={isFullscreen ? '退出全屏' : '全屏'}>
              <div 
                className='app-header-action'
                onClick={handleFullscreen}
              >
                {isFullscreen ? (
                  <FullscreenExitOutlined className='text-lg' />
                ) : (
                  <FullscreenOutlined className='text-lg' />
                )}
              </div>
            </Tooltip>

            {/* 主题切换 */}
            <div className='px-2'>
              <ThemeBar />
            </div>

            {/* 用户信息 */}
            <Popover
              content={
                <div className='w-[160px]'>
                  <div className='px-3 py-2 border-b border-[var(--app-border)] text-sm font-medium'>
                    <UserOutlined className='mr-2' />
                    {userInfo?.nickname}
                  </div>
                  <div 
                    className='px-3 py-2 cursor-pointer hover:bg-[var(--app-accent-soft)] text-[var(--app-text-secondary)] hover:text-[var(--app-accent)] tran-fast flex items-center gap-2'
                    onClick={logOutAction}
                  >
                    <LogoutOutlined />
                    退出登录
                  </div>
                </div>
              }
              trigger='click'
              placement='bottomRight'
              arrow={false}
            >
              <div className='flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[var(--app-accent-soft)] tran-fast'>
                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-[var(--app-accent)] to-[var(--app-primary-dark)] flex items-center justify-center text-white text-sm font-medium'>
                  {userInfo?.nickname?.charAt(0) || 'U'}
                </div>
                <span className='text-sm font-medium text-[var(--app-text)] hidden lg:inline'>
                  {userInfo?.nickname}
                </span>
              </div>
            </Popover>
          </div>
        </Header>

        {/* 页面内容区域 */}
        <Content className='app-shell flex-1 overflow-hidden p-4'>
          <div
            ref={fullscreenRef as any}
            className={classNames(
              'app-main h-full w-full max-w-[1680px] mx-auto p-6 overflow-y-auto app-hide-scrollbar',
            )}
          >
            <Suspense
              fallback={
                <Spin
                  spinning={true}
                  className='flex justify-center items-center h-full w-full'
                  indicator={
                    <Image
                      src={LoadingGIF}
                      preview={false}
                      style={{ width: '80px', height: '80px' }}
                    />
                  }
                />
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default memo(Main);
