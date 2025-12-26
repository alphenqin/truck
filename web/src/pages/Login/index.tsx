import { FC, memo, useState } from 'react';
import { useTheme } from '@/hooks/useTheme.ts';
import { Footer, ThemeBar } from '@/components/index';
import { Button, Form, Input, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined } from '@ant-design/icons';
import { getUserMenusRequest, LoginParamsType, loginRequest } from '@/service';
import { FieldType } from '@/pages/Login/type.ts';
import { changeAllInterfaceDic, changeMenus, changeToken, changeUserInfo } from '@/store/UserStore';
import { useAppDispatch } from '@/store';
import { sleep } from '@/utils';
import Logo from '@/assets/image/logo.svg';
import classNames from 'classnames';
import { constants } from '@/constant';
import { useNavigate } from 'react-router-dom';

const Login: FC = () => {
  const navigate = useNavigate(); // 用于页面跳转
  const [loading, setLoading] = useState(false); // 登录按钮加载状态
  const dispatch = useAppDispatch(); // Redux 派发器
  const [formRef] = Form.useForm(); // Ant Design 表单实例
  const { themeMode } = useTheme(); // 当前主题（暗/亮）

  // 默认表单初始值（仅供测试，生产可删）
  const form: FieldType = {
    account: '',
    password: '',
  };

  // 登录提交逻辑
  const onFinish = (values: FieldType) => {
    setLoading(true); // 启用加载状态
    loginRequest(values as LoginParamsType)
      .then(async (r) => {
        // 登录成功后处理：保存用户信息和 token
        const { token, user } = r.data;
        dispatch(changeUserInfo(user));
        dispatch(changeToken(token));
        await sleep(1000); // 延迟一段时间

        // 获取用户菜单和权限字典
        const result = await getUserMenusRequest();
        dispatch(changeAllInterfaceDic(user.interfaceDic));
        dispatch(changeMenus(result.data));

        // 跳转到系统首页或提示无权限
        if (result.data?.length) {
          navigate(constants.routePath.main);
        } else {
          message.error('暂无任何菜单，请联系管理员');
        }
      })
      .catch(() => {
        // 登录失败处理：重置密码输入框
        formRef.resetFields(['password']);
      })
      .finally(() => {
        setLoading(false); // 重置加载状态
      });
  };

  return (
    <div className='min-h-screen flex flex-col select-none'>
      {/* 主登录区域 */}
      <div
        className={classNames(
          'relative w-full flex flex-1 items-center justify-center overflow-hidden tran',
          {
            'bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100': themeMode === 'light',
            'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950': themeMode === 'dark',
          },
        )}
      >
        {/* 顶部主题切换 */}
        <div className='absolute top-0 left-0 right-0 z-10 flex justify-end p-6'>
          <ThemeBar />
        </div>

        {/* 背景装饰 - 优化后的渐变球 */}
        <div className='pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-blue-400/20 blur-[100px]' />
        <div className='pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-indigo-400/15 blur-[120px]' />
        <div className='pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-blue-500/5 to-teal-500/5 blur-[80px]' />

        {/* 登录卡片 */}
        <div
          className={classNames(
            'relative z-10 w-full max-w-[1000px] mx-6 overflow-hidden rounded-3xl border shadow-2xl',
            {
              'bg-white/95 border-slate-200/80 backdrop-blur-xl shadow-slate-200/50': themeMode === 'light',
              'bg-slate-900/95 border-slate-700/50 backdrop-blur-xl shadow-black/40': themeMode === 'dark',
            },
          )}
        >
          <div className='grid grid-cols-1 md:grid-cols-2'>
            {/* 左侧品牌区 - 使用主题色 */}
            <div
              className={classNames(
                'hidden md:flex flex-col justify-between p-12 relative overflow-hidden',
                {
                  'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white': themeMode === 'light',
                  'bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 text-white': themeMode === 'dark',
                }
              )}
            >
              {/* 装饰元素 */}
              <div className='absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl' />
              <div className='absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl' />
              
              <div className='relative flex items-center gap-3'>
                <div className='h-11 w-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center'>
                  <img src={Logo} alt='logo' className='h-7 w-7' />
                </div>
                <span className='text-lg font-bold tracking-wide'>工装车管理系统</span>
              </div>
              
              <div className='relative space-y-4'>
                <p className='text-4xl font-bold leading-tight tracking-tight'>
                  轻量、清晰、<br/>可控
                </p>
                <p className='text-base text-white/75 leading-relaxed max-w-[280px]'>
                  统一车辆、资产与权限管理，打造简洁一致的操作体验
                </p>
              </div>
              
              <div className='relative text-sm text-white/50 font-medium'>
                Version 1.0 · Web 管理端
              </div>
            </div>

            {/* 右侧：登录表单 */}
            <div className='flex items-center justify-center px-8 py-14 md:px-14 md:py-16'>
              <div className='w-full max-w-[360px] space-y-8'>
                <div className='space-y-2'>
                  <h1 className='text-3xl font-bold text-[var(--app-text)]'>欢迎回来</h1>
                  <p className='text-[var(--app-muted)]'>请使用账号密码登录系统</p>
                </div>

                {/* 登录表单 */}
                <Form onFinish={onFinish} initialValues={form} form={formRef} autoComplete='off' className='space-y-1'>
                  <Form.Item<FieldType> name='account' rules={[{ required: true, message: '请输入账号' }]}>
                    <Input
                      suffix={<UserOutlined className='text-[var(--app-muted)]' />}
                      size='large'
                      placeholder='请输入账号'
                    />
                  </Form.Item>

                  <Form.Item<FieldType> name='password' rules={[{ required: true, message: '请输入密码' }]}>
                    <Input.Password
                      size='large'
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      placeholder='请输入密码'
                    />
                  </Form.Item>

                  {/* 登录按钮 */}
                  <div className='pt-4'>
                    <Button
                      block
                      htmlType='submit'
                      type='primary'
                      loading={loading}
                      size='large'
                      className='h-12 rounded-xl font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 tran'
                    >
                      登录
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部版权 footer */}
      <Footer />
    </div>
  );
};

export default memo(Login);
