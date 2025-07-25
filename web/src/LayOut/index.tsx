import { FC, memo, Suspense, useEffect, useRef, useState } from 'react';
import { useFullscreen } from 'ahooks';
import { useMainPage } from '@/LayOut/hooks.tsx'; // 自定义 hook：处理菜单、导航逻辑
import { useTheme } from '@/hooks/useTheme'; // 主题切换 hook
import { Outlet, useNavigate } from 'react-router-dom';
import { Image, Layout, Menu, Popover, Spin, Badge } from 'antd';
import { AppBreadcrumb, AppHeaderTab, AppUploads, ThemeBar } from '@/components';
// import { Translate } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store';
import { DownOutlined, ExpandOutlined, MenuFoldOutlined, MenuUnfoldOutlined, WarningOutlined } from '@ant-design/icons';
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
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

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

  // 模拟获取错误信息
  useEffect(() => {
    // 这里可以替换为实际的错误信息获取逻辑
    setErrorMessages([
      '系统检测到异常数据',
      '设备连接不稳定',
      '数据同步延迟'
    ]);
  }, []);

  return (
    <>
      <Layout className='h-screen overflow-hidden select-none'>
        {/* 左侧菜单栏 */}
        <Sider 
          width='260px' 
          theme={themeMode} 
          className='hidden md:block' 
          style={{ 
            height: '100vh',
            overflow: 'auto'
          }} 
          trigger={null} 
          collapsible 
          collapsed={isFold}
        >
          {/* Logo 区域 */}
          <div
            className='h-16 bg-gradient-to-r from-blue-600 to-blue-800 truncate overflow-hidden dark:from-blue-800 dark:to-blue-900 animate__animated animate__backInDown text-white flex items-center justify-center text-xl font-bold cursor-pointer'
            onClick={navigateHome}>
            <Image src={Logo} width={30} preview={false} />
            {!isFold && <span>工装车管理系统</span>}
          </div>
          {/* 左侧菜单内容 */}
          <Menu
            onSelect={onSelect}
            style={{ 
              width: isFold ? 80 : 260,
              whiteSpace: 'normal',
              wordBreak: 'break-word'
            }}
            mode='inline'
            theme={themeMode}
            items={menus}
            className='h-[calc(100vh-64px)] overflow-y-auto'
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
          <Header className='flex items-center justify-between bg-white dark:bg-gray-800 dark:text-white px-6 shadow-sm'>
            {/* 菜单折叠按钮 */}
            {isFold ? (
              <MenuUnfoldOutlined className='text-xl mr-2 text-blue-600 dark:text-blue-400' onClick={changeFoldAction} />
            ) : (
              <MenuFoldOutlined className='text-xl mr-2 text-blue-600 dark:text-blue-400' onClick={changeFoldAction} />
            )}
            {/* 面包屑 */}
            <div className='flex-1'>
              <AppBreadcrumb />
            </div>
            {/* 顶部右侧区域：全屏、主题、用户信息 */}
            <div className='flex items-center'>
              {/* 警示灯按钮 */}
              <Popover
                content={
                  <div className='max-h-[300px] overflow-y-auto'>
                    {errorMessages.length > 0 ? (
                      errorMessages.map((msg, index) => (
                        <div key={index} className='py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'>
                          <WarningOutlined className='text-yellow-500 mr-2' />
                          {msg}
                        </div>
                      ))
                    ) : (
                      <div className='py-2 px-4 text-gray-500'>暂无异常信息</div>
                    )}
                  </div>
                }
                trigger='click'
                placement='bottomRight'
              >
                <div className='flex items-center justify-center text-xl mr-4 cursor-pointer'>
                  <Badge count={errorMessages.length} size='small'>
                    <WarningOutlined className='text-yellow-500 hover:text-yellow-600' />
                  </Badge>
                </div>
              </Popover>
              <div className='flex items-center justify-center text-xl mr-4 cursor-pointer text-blue-600 dark:text-blue-400' onClick={toggleFullscreen}>
                <ExpandOutlined />
              </div>
              <ThemeBar />
              {/* 用户名 + 下拉 */}
              <div className='mx-2 cursor-pointer'>
                <Popover
                  content={
                    <div className='cursor-pointer hover:text-blue-600 dark:hover:text-blue-400' onClick={logOutAction}>
                      {t('logout')}
                    </div>
                  }
                  trigger='click'>
                  <span className='text-blue-600 dark:text-blue-400'>{userInfo?.nickname}</span>
                  <DownOutlined className='mx-2 text-blue-600 dark:text-blue-400' />
                </Popover>
              </div>
            </div>
          </Header>

          {/* 标签页导航 */}
          <AppHeaderTab />

          {/* 页面内容区域 */}
          <Content className='h-full flex-1 flex justify-center items-start bg-gray-50 dark:bg-gray-900 p-0'>
            <div
              ref={fullscreenRef as any}
              className={classNames('h-full w-full max-w-[1600px] mx-auto my-2 px-8 py-3 rounded-2xl shadow-lg bg-white dark:bg-gray-800 transition-all overflow-y-auto', {
                // 统一圆角、阴影、背景色
              })}>
              {/* 页面异步加载 Suspense 包裹 Outlet */}
              <Suspense
                fallback={
                  <Spin
                    spinning={true}
                    className='flex justify-center items-center h-full w-full bg-white dark:bg-gray-800'
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
