import { FC, memo, useEffect, useState } from 'react';
import { getTimeTaskListRequest, ITimeTaskResponse, startTimeTaskRequest, stopTimeTaskRequest, updateTimeTaskRequest } from '@/service/api/timeTask';
import { Form, Image, Input, Modal, Switch, Table, TableColumnProps } from 'antd';
import Start from '@/assets/svg/start.svg';
import Stop from '@/assets/svg/stop.svg';
import { formatTimer } from '@/utils/format';
import { useForm } from 'antd/es/form/Form';

const TimeTask: FC = () => {
  const [formRef] = useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<ITimeTaskResponse>();
  const [taskList, setTaskList] = useState<ITimeTaskResponse[]>([]);

  const getPageDataAction = async () => {
    const result = await getTimeTaskListRequest();
    setTaskList(result.data);
  };

  const startTaskAction = async (id: string) => {
    await startTimeTaskRequest(id);
    getPageDataAction().then();
  };

  const stopTaskAction = async (id: string) => {
    await stopTimeTaskRequest(id);
    getPageDataAction().then();
  };

  const columns: TableColumnProps<ITimeTaskResponse>[] = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: '运行时间',
      dataIndex: 'runTimes',
      key: 'runTimes',
      align: 'center',
      width: 200,
      render: (text: number) => {
        return <span>{formatTimer(text)}</span>;
      },
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (text: boolean, { timeTaskID }) => {
        return text ? (
          <Image src={Start} preview={false} className='animate-spin cursor-pointer' onClick={() => stopTaskAction(timeTaskID)}></Image>
        ) : (
          <Image src={Stop} className='cursor-pointer' preview={false} onClick={() => startTaskAction(timeTaskID)}></Image>
        );
      },
    },
    {
      title: 'Cron表达式',
      dataIndex: 'cron',
      key: 'cron',
      align: 'center',
    },
    {
      title: '最后运行时间',
      dataIndex: 'lastRunTime',
      key: 'lastRunTime',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      width: 120,
      render: (_, row) => {
        return (
          <div
            className='flex justify-center items-center text-[#00b0f0] cursor-pointer'
            onClick={() => {
              setModalOpen(true);
              setCurrentTask(row);
              formRef.setFieldsValue(row);
            }}>
            编辑
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getPageDataAction().then();
  }, []);
  return (
    <>
      <div className='mb-2 flex justify-between items-center bg-white p-4 rounded dark:bg-[#001620]'>
        <span className='font-bold'>定时任务</span>
      </div>
      <Table dataSource={taskList} rowKey='timeTaskID' columns={columns}></Table>
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title='编辑'
        onOk={() => {
          formRef.validateFields().then(async (values) => {
            try {
              if (!currentTask?.timeTaskID) return;
              await updateTimeTaskRequest(currentTask?.timeTaskID, values);
            } finally {
              setModalOpen(false);
              await getPageDataAction();
            }
          });
        }}>
        <Form form={formRef} autoComplete='off' labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} labelAlign='left'>
          <Form.Item label='任务名称' name='taskName' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Cron表达式' name='cron' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label='任务状态' name='status' rules={[{ required: true }]}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default memo(TimeTask);
