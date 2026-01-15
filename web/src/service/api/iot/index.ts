import request from '@/service/request';
import { AxiosResponse } from 'axios';

export interface IOfflineGateway {
  id: number;
  gatewayName: string;
  gatewayCode: string;
  lastSeen?: string | null;
}

export interface IOfflineGatewayResponse {
  list: IOfflineGateway[];
  minutes: number;
}

export const getOfflineGatewaysRequest = (minutes = 10) => {
  return request.get<AxiosResponse<IOfflineGatewayResponse>>({
    url: '/iot/gateway/offline',
    params: { minutes },
  });
};
