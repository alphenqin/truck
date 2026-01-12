import { Suspense, memo, useEffect } from 'react';
import { useAppSelector } from '@/store';
import { ConfigProvider, Image, Spin, message } from 'antd';
import { constants } from '@/constant';
import { useAppRouter } from '@/hooks/useAppRoutes.tsx';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import { useTheme } from '@/theme';
import { MESSAGE_EVENT_NAME } from '@/utils';
import { MessageInstance } from 'antd/es/message/interface';
import LoadingGIF from '@/assets/image/loading.gif';

dayjs.locale('zh-cn');

const APP = () => {
  const [theme] = useTheme();
  const [api, contextHolder] = message.useMessage();
  const { langMode } = useAppSelector((state) => state.UIStore);
  const { element } = useAppRouter();

  useEffect(() => {
    const bindEvent = (e: CustomEvent | any) => {
      const func: keyof MessageInstance = e?.detail?.type || 'info';
      const { content, duration, onClose } = e.detail?.params;
      api[func](content, duration, onClose);
    };

    window.addEventListener(MESSAGE_EVENT_NAME, bindEvent);

    return () => {
      window.removeEventListener(MESSAGE_EVENT_NAME, bindEvent);
    };
  }, [api]);

  return (
    <>
      {contextHolder}
      <ConfigProvider locale={constants.langMap[langMode]} theme={theme}>
        <Suspense
          fallback={
            <Spin
              spinning={true}
              fullscreen={true}
              indicator={<Image src={LoadingGIF} preview={false} />}
              style={{ width: '100px', height: '100px' }}
            />
          }>
          {element}
        </Suspense>
      </ConfigProvider>
    </>
  );
};

export default memo(APP);
