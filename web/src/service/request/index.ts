import Request from '@/service/request/lib';
import { IResponse } from '@/service/request/lib/type.ts';
import { cache, message } from '@/utils';
import { constants } from '@/constant';

const request = new Request<IResponse>(import.meta.env.VITE_APP_BASE_URL, 1000 * 60, {
  requestInterceptor: {
    onFulfilled(config) {
      const token = cache.get(constants.localStorage.token);
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    onRejected(error) {
      return error;
    },
  },
  responseInterceptor: {
    onFulfilled: (value) => {
      if (value.data.code > 201) {
        message.error(value.data.msg);
      }
      if (value.data.code == 401) {
        cache.clear();
        window.location.replace(constants.routePath.login);
        message.error('登录过期，请重新登录');
        return;
      }
      return value.data;
    },
    onRejected(error) {
      const responseData = error?.response?.data;
      if (responseData?.msg) {
        message.error(responseData.msg);
      } else {
        message.error('请求失败，请稍后重试');
      }
      if (responseData?.code == 401) {
        cache.clear();
        window.location.replace(constants.routePath.login);
        message.error('登录过期，请重新登录');
        return;
      }
      return error;
    },
  },
});

export default request;
