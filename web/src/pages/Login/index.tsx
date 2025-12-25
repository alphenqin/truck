import { FC, memo, useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme.ts';
import { Footer, ThemeBar } from '@/components/index';
import { Button, Form, Image, Input, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined } from '@ant-design/icons';
import { getCaptchaRequest, getUserMenusRequest, LoginParamsType, loginRequest } from '@/service';
import { FieldType } from '@/pages/Login/type.ts';
import { changeAllInterfaceDic, changeMenus, changeToken, changeUserInfo } from '@/store/UserStore';
import { useAppDispatch } from '@/store';
import { getFirstMenu, sleep } from '@/utils';
import { changeTabHeader } from '@/store/UIStore';
import Logo from '@/assets/image/logo.svg';
import classNames from 'classnames';
import { constants } from '@/constant';
import { useNavigate } from 'react-router-dom';

const Login: FC = () => {
  const navigate = useNavigate(); // 用于页面跳转
  const [captcha, setCaptcha] = useState<string>(); // 验证码图片
  const [loading, setLoading] = useState(false); // 登录按钮加载状态
  const dispatch = useAppDispatch(); // Redux 派发器
  const [formRef] = Form.useForm(); // Ant Design 表单实例
  const { themeMode } = useTheme(); // 当前主题（暗/亮）

  // 页面加载时自动获取验证码
  useEffect(() => getCaptcha(), []);

  // 获取验证码图片（调用接口后转为 Blob 图片 URL）
  const getCaptcha = () => {
    getCaptchaRequest().then((res) => {
      const imageUrl = URL.createObjectURL(new Blob([res]));
      setCaptcha(imageUrl);
    });
  };

  useEffect(() => {
    return () => {
      if (captcha) {
        URL.revokeObjectURL(captcha);
      }
    };
  }, [captcha]);

  // 默认表单初始值（仅供测试，生产可删）
  const form: FieldType = {
    account: '',
    password: '',
    captcha: '',
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
          dispatch(changeTabHeader([getFirstMenu(result.data)]));
          navigate(constants.routePath.main);
        } else {
          message.error('暂无任何菜单，请联系管理员');
        }
      })
      .catch(() => {
        // 登录失败处理：重置验证码输入框和刷新验证码
        getCaptcha();
        formRef.resetFields(['captcha']);
      })
      .finally(() => {
        setLoading(false); // 重置加载状态
      });
  };

  return (
    <>
      <div className='h-screen flex flex-col select-none'>
        {/* 顶部导航栏，包含主题切换 */}
        <div
          className={classNames('w-screen flex justify-center items-center tran dark:text-[#fff] flex-1', {
            'bg-gradient-to-r from-blue-900 to-blue-700': themeMode === 'light',
            'bg-gradient-to-r from-gray-900 to-gray-800': themeMode === 'dark',
          })}>
          <div className='absolute top-0 left-0 right-0 flex justify-end p-4'>
            <ThemeBar />
          </div>

          {/* 登录卡片主区域 */}
          <div
            className={classNames('w-4/5 h-[600px] min-w-[800px] rounded-xl tran flex justify-between overflow-hidden shadow-2xl', {
              'bg-white/90 backdrop-blur-sm': themeMode === 'light',
              'bg-gray-800/90 backdrop-blur-sm': themeMode === 'dark',
            })}>
            
            {/* 左侧：系统名称（仅大屏展示） */}
            <div className='hidden md:flex flex-col flex-1 p-10 bg-gradient-to-br from-blue-600 to-blue-800 text-white items-center justify-center'>
              <p className='text-5xl font-bold text-center'>工装车管理系统</p>
            </div>

            {/* 右侧：登录表单 */}
            <div className='min-w-[400px] flex bg-white dark:bg-gray-800 tran'>
              <div className='flex flex-col items-center gap-6 flex-grow px-20 mt-20'>
                <div className='text-center'>
                  <p className='text-3xl font-bold text-blue-600 dark:text-blue-400'>欢迎登录</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>工装车管理系统</p>
                </div>

                {/* 登录表单 */}
                <Form onFinish={onFinish} initialValues={form} form={formRef} autoComplete='off' className='w-full'>
                  <Form.Item<FieldType> name='account' rules={[{ required: true, message: '请输入账号' }]}>
                    <Input 
                      suffix={<UserOutlined className='text-blue-400' />} 
                      size='large' 
                      placeholder='请输入账号'
                      className='rounded-lg hover:border-blue-400 focus:border-blue-400' 
                    />
                  </Form.Item>

                  <Form.Item<FieldType> name='password' rules={[{ required: true, message: '请输入密码' }]}>
                    <Input.Password
                      size='large'
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      placeholder='请输入密码'
                      className='rounded-lg hover:border-blue-400 focus:border-blue-400'
                    />
                  </Form.Item>

                  <Form.Item<FieldType> name='captcha' rules={[{ required: true, message: '请输入验证码' }]}>
                    <div className='flex items-center w-full gap-2'>
                      <Input 
                        size='large' 
                        className='flex-1 rounded-lg hover:border-blue-400 focus:border-blue-400' 
                        placeholder='请输入验证码' 
                      />
                      <Image 
                        preview={false} 
                        src={captcha} 
                        height={40} 
                        width={150} 
                        onClick={getCaptcha} 
                        className='bg-white cursor-pointer rounded-lg hover:opacity-80 transition-opacity' 
                      />
                    </div>
                  </Form.Item>

                  {/* 登录按钮 */}
                  <div className='w-full mt-6'>
                    <Button 
                      block 
                      htmlType='submit' 
                      type='primary' 
                      loading={loading}
                      className='h-12 text-lg rounded-lg bg-blue-600 hover:bg-blue-700 border-none'
                    >
                      登录
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>

        {/* 底部版权 footer */}
        <Footer />
      </div>
    </>
  );
};

export default memo(Login);
