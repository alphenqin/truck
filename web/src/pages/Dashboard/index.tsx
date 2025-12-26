import { FC, memo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useDashBoard } from '@/pages/Dashboard/hooks.ts';
import { useAppSelector } from '@/store';
import { getFirstMenuChildren } from '@/utils';
import { Icon } from '@/components';
import { Col, Popover, Row, Spin, Timeline } from 'antd';
import { BugOutlined, SmileOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import dayjs from 'dayjs';

const Dashboard: FC = () => {
  const { menus } = useAppSelector((state) => state.UserStore);
  const { themeMode } = useAppSelector((state) => state.UIStore);
  const { loading, totalOption, cpuUsageOption, allMenUsageOption, gitCommits, commitCount, gitCommitFrequency, navigateToPage } = useDashBoard();

  const cardStyle = 'app-card p-5 no-scrollbar w-full';
  const quickAccessColors = [
    { bg: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' },
    { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981' },
    { bg: 'rgba(168, 85, 247, 0.12)', color: '#a855f7' },
    { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
  ];

  const statCards = [
    { chart: <ReactECharts option={totalOption} theme={themeMode} style={{ height: '120px', width: '100%' }} /> },
    { chart: <ReactECharts option={cpuUsageOption} theme={themeMode} style={{ height: '120px', width: '100%' }} /> },
    { chart: <ReactECharts option={allMenUsageOption} theme={themeMode} style={{ height: '120px', width: '100%' }} /> },
    {
      chart: (
        <div className='flex h-[120px] justify-center items-center gap-3'>
          <span className='text-5xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent'>
            {commitCount}
          </span>
          <span className='text-[var(--app-muted)] text-lg'>提交次数</span>
        </div>
      ),
    },
  ];

  const timelineItems: any[] = gitCommits.map((item) => ({
    color: 'var(--app-accent)',
    dot: <SmileOutlined className='text-[var(--app-accent)]' />,
    label: <span className='text-[var(--app-accent)] font-medium'>{item.date}</span>,
    children: item.children.map((commit) => (
      <div key={commit.commitID} className='cursor-pointer'>
        <Popover
          placement='bottom'
          arrow={false}
          content={
            <div className='text-sm space-y-1'>
              <p className='text-[var(--app-muted)]'>作者：{commit.author}</p>
              <p className='text-[var(--app-muted)]'>时间：{dayjs(commit.date).format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
          }
        >
          <p className='hover:text-[var(--app-accent)] tran-fast'>{commit.message}</p>
        </Popover>
      </div>
    )),
  }));

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]}>
        {/* 统计卡片区域 */}
        {statCards.map((item, index) => (
          <Col xs={24} sm={24} md={12} lg={12} xl={6} key={index}>
            <div className={classNames(cardStyle, 'h-full hover-lift')} style={{ animationDelay: `${index * 0.1}s` }}>
              {item.chart}
            </div>
          </Col>
        ))}

        {/* 快捷入口 + 贡献图 */}
        <Col xs={24} sm={24} md={24} lg={12}>
          <div className='flex flex-col gap-4'>
            <div className={classNames(cardStyle)}>
              <h3 className='app-section-title mb-4'>快捷入口</h3>
              <Row gutter={[12, 12]} className='min-h-[120px]'>
                {getFirstMenuChildren(menus)
                  ?.slice(0, 4)
                  ?.map((item, index) => (
                    <Col xs={12} sm={6} md={6} lg={12} xl={6} key={item.pageID}>
                      <div
                        onClick={() => navigateToPage(item)}
                        className='flex flex-col justify-center items-center h-24 rounded-xl cursor-pointer tran hover-lift press-scale'
                        style={{ background: quickAccessColors[index]?.bg }}
                      >
                        <Icon
                          name={item.pageIcon as any}
                          props={{
                            className: 'text-2xl mb-2',
                            style: { color: quickAccessColors[index]?.color },
                          }}
                        />
                        <span className='text-sm font-medium text-[var(--app-text)]'>{item.pageName}</span>
                      </div>
                    </Col>
                  ))}
              </Row>
            </div>
            <div className={classNames(cardStyle)}>
              <h3 className='app-section-title mb-2'>
                <span className='text-[var(--app-accent)] mr-2'>{commitCount}</span>
                最近一年贡献
              </h3>
              <ReactECharts option={gitCommitFrequency} theme={themeMode} style={{ width: '100%', height: '250px' }} />
            </div>
          </div>
        </Col>

        {/* 更新日志 */}
        <Col xs={24} sm={24} md={24} lg={12}>
          <div className={classNames(cardStyle, 'overflow-auto no-scrollbar h-[515px]')}>
            <h3 className='app-section-title mb-4'>更新日志</h3>
            <Timeline
              items={timelineItems}
              mode='alternate'
              pending={
                <div className='text-[var(--app-accent)] gap-2 flex items-center'>
                  <BugOutlined className='animate-pulse' />
                  <span>Coding...</span>
                </div>
              }
              reverse={true}
            />
          </div>
        </Col>
      </Row>
    </Spin>
  );
};

export default memo(Dashboard);
