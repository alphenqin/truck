import request from '@/service/request';
import { AxiosResponse } from 'axios';

export interface IGroupInfo {
  groupId: number;
  groupName: string;
}

export interface IQueryGroupParams {
  groupId?: number;
  groupName?: string;
  limit: number;
  offset: number;
}

export interface IGroupFormValues {
  groupId?: number;
  groupName: string;
}

export const getGroupInfoRequest = (params: IQueryGroupParams) => {
  return request.post<AxiosResponse<{ list: IGroupInfo[]; total: number }>>({
    url: '/base/group/query',
    data: params,
  });
};

export const createGroupInfoRequest = (params: IGroupFormValues) => {
  return request.post<AxiosResponse<null>>({
    url: '/base/group',
    data: params,
  });
};

export const updateGroupInfoRequest = (groupId: number, params: IGroupFormValues) => {
  return request.patch<AxiosResponse<null>>({
    url: '/base/group/update',
    data: { ...params, groupId },
  });
};

export const deleteGroupInfoRequest = (ids: number[]) => {
  return request.delete<AxiosResponse<null>>({
    url: '/base/group/batch-delete',
    data: ids,
  });
};
