import { FC, memo, Suspense, useEffect, useRef } from 'react';
import { useFullscreen } from 'ahooks';
import { useMainPage } from '@/LayOut/hooks.tsx'; // 自定义 hook：处理菜单、导航逻辑
import { useTheme } from '@/hooks/useTheme'; // 主题切换 hook
import { Outlet, useNavigate } from 'react-router-dom';
import { Image, Layout, Menu, Popover, Spin } from 'antd';
import { AppBreadcrumb, AppHeaderTab, AppUploads, ThemeBar, Translate } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store';
import { DownOutlined, ExpandOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { changeFold } from '@/store/UIStore'; // Redux: 控制菜单折叠
import { cache } from '@/utils'; // 封装的缓存工具（清除用户信息等）
import Logo from '@/assets/svg/logo.svg';
import classNames from 'classnames';
import { addListenerUploadFile, removeListenerUploadFile } from '@/utils/event';
import { RcFile } from 'antd/es/upload';
import { AppUploadsRefProps } from '@/components/AppUploads';
import { constants } from '@/constant';
import { useTranslation } from 'react-i18next';
import LoadingGIF from '@/assets/image/loading.gif';

const Main: FC = () => {
  const { t } = useTranslation();
  const appUploadsRef = useRef<AppUploadsRefProps>(null); // 上传组件的 ref
  const dispatch = useAppDispatch();
  const fullscreenRef = useRef(); // 用于 ahooks 全屏挂载的 DOM 容器

  const { Sider, Header, Content, menus, onSelect, onOpenChange, navigateHome } = useMainPage(); // 菜单逻辑
  const { defaultSelectedKeys, defaultOpenKeys, isFold } = useAppSelector((state) => state.UIStore); // 菜单状态
  const { themeMode } = useTheme(); // 当前主题
  const navigate = useNavigate();
  const { userInfo } = useAppSelector((state) => state.UserStore); // 用户信息
  const [_, { toggleFullscreen }] = useFullscreen(fullscreenRef); // 全屏控制

  // 切换菜单折叠
  const changeFoldAction = () => {
    dispatch(changeFold(!isFold));
  };

  // 退出登录
  const logOutAction = () => {
    cache.clear(); // 清空缓存（用户信息等）
    navigate(constants.routePath.login); // 跳转登录页
  };

  // 上传文件事件监听回调
  const uploadFileHandler = (file: RcFile) => {
    appUploadsRef.current?.addUploadFile(file);
  };

  // 组件挂载时注册上传监听，卸载时移除
  useEffect(() => {
    addListenerUploadFile(uploadFileHandler);
    return () => {
      removeListenerUploadFile(uploadFileHandler);
    };
  }, []);

  return (
    <>
      <Layout className='h-screen overflow-hidden select-none'>
        {/* 左侧菜单栏 */}
        <Sider width='250px' theme={themeMode} className='hidden md:block flex flex-col' style={{ height: '100vh' }} trigger={null} collapsible collapsed={isFold}>
          {/* Logo 区域 */}
          <div
            className='h-16 bg-white truncate overflow-hidden dark:bg-[#001624] animate__animated animate__backInDown dark:text-white flex items-center justify-center text-xl font-bold cursor-pointer'
            onClick={navigateHome}>
            <Image src={Logo} width={30} preview={false} />
            {!isFold && <span>包装管理平台</span>}
          </div>
          {/* 左侧菜单内容 */}
          <Menu
            onSelect={onSelect}
            style={{ width: isFold ? 80 : 260 }}
            mode='inline'
            theme={themeMode}
            items={menus}
            className='flex-grow select-none overflow-y-auto overflow-x-hidden flex-basis-0'
            onOpenChange={onOpenChange}
            selectedKeys={defaultSelectedKeys}
            openKeys={defaultOpenKeys}
            defaultSelectedKeys={defaultSelectedKeys}
            defaultOpenKeys={defaultOpenKeys}
          />
        </Sider>

        {/* 右侧主区域 */}
        <Layout>
          {/* 顶部导航栏 */}
          <Header className='flex items-center justify-between bg-white dark:bg-[#001624] dark:text-white px-6'>
            {/* 菜单折叠按钮 */}
            {isFold ? (
              <MenuUnfoldOutlined className='text-xl mr-2' onClick={changeFoldAction} />
            ) : (
              <MenuFoldOutlined className='text-xl mr-2' onClick={changeFoldAction} />
            )}
            {/* 面包屑 */}
            <div className='flex-1'>
              <AppBreadcrumb />
            </div>
            {/* 顶部右侧区域：全屏、主题、语言、用户信息 */}
            <div className='flex items-center'>
              <div className='flex items-center justify-center text-xl mr-4 cursor-pointer' onClick={toggleFullscreen}>
                <ExpandOutlined />
              </div>
              <ThemeBar />
              <div className='mt-3 mx-2'>
                <Translate />
              </div>
              {/* 用户名 + 下拉 */}
              <div className='mx-2 cursor-pointer'>
                <Popover
                  content={
                    <div className='cursor-pointer hover:text-[#00b0f0]' onClick={logOutAction}>
                      {t('logout')}
                    </div>
                  }
                  trigger='click'>
                  <span>{userInfo?.nickname}</span>
                  <DownOutlined className='mx-2 text-gray-500 dark:text-gray-50' />
                </Popover>
              </div>
            </div>
          </Header>

          {/* 标签页导航 */}
          <AppHeaderTab />

          {/* 页面内容区域 */}
          <Content className='py-4 px-8 pl-6 flex justify-center items-center'>
            <div
              ref={fullscreenRef as any}
              className={classNames('w-full h-full min-h-[600px] overflow-y-scroll no-scrollbar p-4', {
                physicLightCard: themeMode === 'light',
                physicDarkCard: themeMode === 'dark',
              })}>
              {/* 页面异步加载 Suspense 包裹 Outlet */}
              <Suspense
                fallback={
                  <Spin
                    spinning={true}
                    className='flex justify-center items-center h-full w-full bg-white dark:bg-[#001624]'
                    indicator={
                      <Image
                        src={LoadingGIF}
                        style={{
                          width: '100px',
                          height: '100px',
                        }}
                      />
                    }></Spin>
                }>
                <Outlet />
              </Suspense>
            </div>
          </Content>

          {/* 文件上传面板（挂载但默认不展示） */}
          <AppUploads ref={appUploadsRef} />
        </Layout>
      </Layout>
    </>
  );
};

export default memo(Main);
