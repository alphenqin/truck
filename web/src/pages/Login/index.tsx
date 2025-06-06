import { FC, memo, useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme.ts';
import { Footer, ThemeBar, Translate } from '@/components/index';
import { Button, Form, Image, Input, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined } from '@ant-design/icons';
import { getCaptchaRequest, getUserMenusRequest, LoginParamsType, loginRequest } from '@/service';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation(); // 国际化 hook

  // 页面加载时自动获取验证码
  useEffect(() => getCaptcha(), []);

  // 获取验证码图片（调用接口后转为 Blob 图片 URL）
  const getCaptcha = () => {
    getCaptchaRequest().then((res) => {
      const imageUrl = URL.createObjectURL(new Blob([res]));
      setCaptcha(imageUrl);
    });
  };

  // 默认表单初始值（仅供测试，生产可删）
  const form: FieldType = {
    account: 'admin',
    password: '123',
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
        {/* 顶部导航栏，包含主题切换 & 国际化 */}
        <div
          className={classNames('w-screen flex justify-center items-center tran dark:text-[#fff] flex-1', {
            'bg-[#ededed]': themeMode === 'light',
            'bg-[#2e2e2e]': themeMode === 'dark',
          })}>
          <div className='absolute top-0 left-0 right-0 flex justify-end p-4'>
            <ThemeBar />
            <Translate />
          </div>

          {/* 登录卡片主区域 */}
          <div
            className={classNames('w-3/5 h-[500px] min-w-[400px] rounded-xl tran loginBg flex justify-between overflow-hidden', {
              physicLight: themeMode === 'light',
              physicDark: themeMode === 'dark',
            })}>
            
            {/* 左侧：介绍 + logo（仅大屏展示） */}
            <div className='hidden md:flex flex-col flex-1 p-10 pt-20 '>
              <p className='text-2xl font-bold'>{t('welcome')}</p>
              <div className='mt-10 ml-[-40px] hidden xl:flex'>
                <Image src={Logo} preview={false} className='animate__animated animate__backInUp' />
                <div className='w-full mt-10'>
                  <p className='text-xl font-bold hidden lg:block'>{t('slogan')}</p>
                  <p className='mt-2 text-sm text-[#6c727f] dark:text-[#fff] tran'>{t('description')}</p>
                </div>
              </div>
            </div>

            {/* 右侧：登录表单 */}
            <div className='min-w-[400px] flex bg-gray-100 dark:bg-[#041527] tran'>
              <div className='flex flex-col items-center gap-4 flex-grow px-20 mt-20'>
                <p className='text-2xl font-bold'>{t('title')}</p>
                <p className='text-sm text-[#6c727f] dark:text-[#fff] tran'>A management platform using Golang and React</p>

                {/* 登录表单 */}
                <Form onFinish={onFinish} initialValues={form} form={formRef} autoComplete='off'>
                  <Form.Item<FieldType> name='account' rules={[{ required: true, message: t('accountRequired') }]}>
                    <Input suffix={<UserOutlined />} size='large' placeholder={t('completeAccount')} />
                  </Form.Item>

                  <Form.Item<FieldType> name='password' rules={[{ required: true, message: t('passwordRequired') }]}>
                    <Input.Password
                      size='large'
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      placeholder={t('completePassword')}
                    />
                  </Form.Item>

                  <Form.Item<FieldType> name='captcha' rules={[{ required: true, message: t('captchaRequired') }]}>
                    <div className='flex items-center w-full gap-1'>
                      <Input size='large' className='flex-1' placeholder={t('completeCaptcha')} />
                      <Image preview={false} src={captcha} height={36} width={150} onClick={getCaptcha} className='bg-white cursor-pointer tran rounded-s' />
                    </div>
                  </Form.Item>

                  {/* 登录按钮 */}
                  <div className='w-full'>
                    <Button block htmlType='submit' type='primary' loading={loading}>
                      {t('login')}
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
