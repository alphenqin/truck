import { Key, ReactNode, useEffect, useState } from 'react';
import { Button, Input, TableProps, Modal, Select, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import moment from 'moment';
import {
  createRfidTagRequest,
  deleteRfidTagRequest,
  exportRfidTagRequest,
  getRfidTagsRequest,
  IQueryRfidTagsParams,
  IRfidTagResponse,
  IUpdateRfidTagParams,
  updateRfidTagRequest,
  IHasTotalResponse,
  IFormValues,
} from './index.ts';
import { useTranslation } from 'react-i18next';
import { useSearchFrom } from '@/hooks/useSearchForm.tsx';
import { useForm } from 'antd/es/form/Form';
import { AxiosResponse } from 'axios';

export const useRfidTagPageHooks = () => {
  const [formRef] = useForm();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Key[]>([]);
  const [list, setRfidTags] = useState<IRfidTagResponse[]>([]);
  const [currentEditRfidTag, setCurrentEditRfidTag] = useState<IRfidTagResponse>();
  const [isEdit, setIsEdit] = useState(false);
  const [editRfidTagModalOpen, setEditRfidTagModalOpen] = useState(false);
  const { t } = useTranslation();
  const searchConfig: { label: string; name: keyof IQueryRfidTagsParams; component: ReactNode }[] = [
    {
      label: '标签编码',
      name: 'tagCode',
      component: <Input allowClear />,
    },
  ];
  const { SearchFormComponent } = useSearchFrom({
    getDataRequestFn: (values) => {
      const processedValues: IQueryRfidTagsParams = { ...values };
      // Removed status, heartbeat, and reportTime processing from here
      getPageData(processedValues);
    },
    onNewRecordFn: () => {
      formRef.resetFields();
      setIsEdit(false);
      setEditRfidTagModalOpen(true);
    },
    formItems: searchConfig,
    operateComponent: !!selected.length && (
      <Button type='primary' icon={<DownloadOutlined />} onClick={() => exportRfidTagRequest(selected.map(String))}>
        {t('export')}
      </Button>
    ),
    formName: 'rfidTagSearchForm',
  });

  const getPageData = (searchValues?: IQueryRfidTagsParams) => {
    setLoading(true);

    const requestParams: IQueryRfidTagsParams = {
      limit,
      offset: (page - 1) * limit,
    };

    if (searchValues) {
      if (searchValues.tagCode) {
        requestParams.tagCode = searchValues.tagCode;
      }
      // Removed status, heartbeat, reportTime from here
    }

    getRfidTagsRequest(requestParams).then((res: AxiosResponse<IHasTotalResponse<IRfidTagResponse[]>>) => {
      const listWithId = res.data.list.map((item: any) => ({
        ...item,
        id: item.id,
        reportTime: item.reportTime ? item.reportTime : undefined, // 保持为字符串类型，后端返回 RFC3339 格式
      }));
      setRfidTags(listWithId);
      setTotal(res.data.total);
    }).finally(() => {
      setLoading(false);
    });
  };

  const deleteRfidTagAction = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该标签吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteRfidTagRequest([id]).then(() => getPageData());
      },
    });
  };

  const editRfidTagAction = async (row: IRfidTagResponse) => {
    setCurrentEditRfidTag(row);
    setIsEdit(true);
    setEditRfidTagModalOpen(true);
  };

  const onFinish = () => {
    formRef.validateFields().then((values: IFormValues) => {
      const requestBody: IUpdateRfidTagParams = {
        tagCode: values.tagCode,
        electricity: values.electricity,
      };

      // Status 处理：确保 status 是 number 且为 1 或 2，否则不发送
      if (typeof values.status === 'number' && (values.status === 1 || values.status === 2)) {
        requestBody.status = values.status;
      } else if (typeof values.status === 'string') {
        const parsedStatus = parseInt(values.status, 10);
        if (!isNaN(parsedStatus) && (parsedStatus === 1 || parsedStatus === 2)) {
          requestBody.status = parsedStatus;
        }
      }
      // If values.status is undefined/null/other, requestBody.status will remain undefined (not sent)

      // Heartbeat
      if (values.heartbeat) {
          requestBody.heartbeat = values.heartbeat;
      }

      // ReportTime 处理：确保最终发送到后端的是 YYYY-MM-DD HH:mm:ss 格式字符串
      let finalReportTime: string | undefined = undefined;
      if (values.reportTime && typeof values.reportTime === 'string') {
        // Parse the input string in "YYYY/MM/DD HH:mm:ss" format
        const parsedMoment = moment(values.reportTime, "YYYY/MM/DD HH:mm:ss", true); // `true` for strict parsing
        if (parsedMoment.isValid()) {
          // Format to "YYYY-MM-DD HH:mm:ss" for backend
          finalReportTime = parsedMoment.format("YYYY-MM-DD HH:mm:ss");
        }
      }
      requestBody.reportTime = finalReportTime; // Now implicitly string | undefined

      if (isEdit && currentEditRfidTag) {
        requestBody.id = currentEditRfidTag.id; // Ensure ID is included for update
        updateRfidTagRequest(currentEditRfidTag.id, requestBody).then(() => {
          setEditRfidTagModalOpen(false);
          getPageData();
        });
      } else {
        createRfidTagRequest(requestBody).then(() => {
          setEditRfidTagModalOpen(false);
          getPageData();
        });
      }
    });
  };

  const rfidTagColumns: TableProps<IRfidTagResponse>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '标签编码',
      dataIndex: 'tagCode',
      key: 'tagCode',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status === 1 ? '启用' : status === 2 ? '停止' : ''),
    },
    {
      title: '心跳',
      dataIndex: 'heartbeat',
      key: 'heartbeat',
    },
    {
      title: '上报时间',
      dataIndex: 'reportTime',
      key: 'reportTime',
      render: (text) => text ? moment(text).format("YYYY/MM/DD HH:mm:ss") : '-',
    },
    {
      title: t('operate'),
      key: 'action',
      align: 'center',
      render: (_, row) => {
        return (
          <div className='gap-2 flex text-[#5bb4ef] items-center cursor-pointer justify-center'>
            <span onClick={() => editRfidTagAction(row)}>{t('edit')}</span>
            <span className='text-red-500' onClick={() => deleteRfidTagAction(row.id)}>
              {t('delete')}
            </span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (editRfidTagModalOpen && isEdit) {
      const tempInitialValues: Partial<IUpdateRfidTagParams> = { ...currentEditRfidTag };

      // Status: No conversion needed here, it should remain a number for Select component
      // (currentEditRfidTag.status is number from IRfidTagResponse)
      // If tempInitialValues.status is already a number, it's fine.
      // If it's undefined/null, it will remain so.

      // Ensure reportTime is formatted for display in the Input component
      if (tempInitialValues.reportTime && typeof tempInitialValues.reportTime === 'string') {
        const parsedMoment = moment(tempInitialValues.reportTime); // Parse RFC3339 from backend
        if (parsedMoment.isValid()) {
          tempInitialValues.reportTime = parsedMoment.format("YYYY/MM/DD HH:mm:ss"); // Format for display in input
        } else {
          delete tempInitialValues.reportTime;
        }
      } else if (tempInitialValues.reportTime === null || tempInitialValues.reportTime === undefined) {
        delete tempInitialValues.reportTime;
      }

      formRef.setFieldsValue(tempInitialValues);
    }
  }, [editRfidTagModalOpen, isEdit, currentEditRfidTag]);

  useEffect(() => {
    getPageData();
  }, [limit, page]);

  return {
    list,
    rfidTagColumns,
    SearchFormComponent,
    total,
    limit,
    loading,
    isEdit,
    formRef,
    editRfidTagModalOpen,
    setPage,
    setLimit,
    setSelected,
    setEditRfidTagModalOpen,
    onFinish,
  };
};