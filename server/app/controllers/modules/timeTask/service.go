package timeTaskControllerModules

import (
	"errors"
	"github.com/Xi-Yuer/cms/domain/types"
	"github.com/Xi-Yuer/cms/support/utils"
	"strconv"
	"time"
)

// timeTask 定义每个定时任务的结构体
type timeTask struct {
	TaskID      int64     // 任务唯一 ID
	TaskName    string    // 任务名称
	Status      bool      // 当前是否启用
	Cron        string    // cron 表达式
	TaskFunc    func()    // 定时要执行的函数
	LastRunTime time.Time // 最后运行时间
	CanEdit     bool      // 是否可编辑
	RunTimes    int       // 已运行次数（当前未使用）
}

// 初始化任务列表（静态定义多个任务）
var tasks = []timeTask{
	//{
	//	TaskID:      utils.GenID(),
	//	TaskName:    "测试定时任务（每秒触发一次）",
	//	Cron:        "@every 1s",
	//	Status:      false,
	//	LastRunTime: time.Now(),
	//	CanEdit:     true,
	//	RunTimes:    0,
	//	TaskFunc: func() {
	//		fmt.Println("task executed")
	//	},
	//},
	//{
	//	TaskID:      utils.GenID(),
	//	TaskName:    "删除用户新增的页面(每天中午12点触发)",
	//	Cron:        "0 0 12 * * ?",
	//	Status:      true,
	//	LastRunTime: time.Now(),
	//	CanEdit:     false,
	//	TaskFunc:    repositories.PageRepositorysModules.DeleteRubbishPage,
	//},
	//{
	//	TaskID:      utils.GenID(),
	//	TaskName:    "删除24小时之前上传的文件(每天中午12点触发)",
	//	Cron:        "0 0 12 * * ?",
	//	Status:      true,
	//	LastRunTime: time.Now(),
	//	CanEdit:     false,
	//},
	//{
	//	TaskID:      utils.GenID(),
	//	TaskName:    "删除 7 天以前的请求日志(每天中午12点触发)",
	//	Cron:        "0 0 12 * * ?",
	//	Status:      true,
	//	LastRunTime: time.Now(),
	//	CanEdit:     false,
	//	TaskFunc:    repositories.LogsRepository.DeleteLogRecords,
	//},
}

// 在程序初始化时注册所有静态任务
func init() {
	for _, task := range tasks {
		err := utils.TimeTask.AddTask(strconv.FormatInt(task.TaskID, 10), task.Cron, task.TaskFunc, task.Status)
		if err != nil {
			utils.Log.Error(err)
		}
	}
}

// 创建定时任务服务实例，暴露方法供外部调用
var TimeTaskService = &timeTaskService{
	Task: tasks,
}

// timeTaskService 用于管理任务列表
type timeTaskService struct {
	Task []timeTask
}

// GetTimeTask 获取当前所有定时任务信息（用于前端展示）
func (t *timeTaskService) GetTimeTask() []types.TimeTaskResponse {
	var timeTaskResponse []types.TimeTaskResponse
	for _, task := range t.Task {
		// 获取当前时间
		now := time.Now()

		// 规范化最后运行时间用于差值计算
		target := time.Date(task.LastRunTime.Year(), task.LastRunTime.Month(), task.LastRunTime.Day(), task.LastRunTime.Hour(), task.LastRunTime.Minute(), task.LastRunTime.Second(), 0, task.LastRunTime.Location())

		var diff time.Duration
		if task.Status {
			diff = now.Sub(target)
		}

		// 构建响应对象
		timeTaskResponse = append(timeTaskResponse, types.TimeTaskResponse{
			TimeTaskID:  strconv.FormatInt(task.TaskID, 10),
			TaskName:    task.TaskName,
			Cron:        task.Cron,
			Status:      task.Status,
			LastRunTime: task.LastRunTime.Format("2006-01-02 03:04:05"),
			RunTimes:    diff.Seconds(),
		})
	}
	return timeTaskResponse
}

// UpdateTask 更新某个定时任务的配置
func (t *timeTaskService) UpdateTask(id string, params *types.UpdateTimeTask) error {
	// 校验 cron 表达式合法性
	if err := utils.TimeTask.ParseCron(params.Cron); err != nil {
		return err
	}

	var updated bool
	for i, task := range t.Task {
		if strconv.FormatInt(task.TaskID, 10) == id {
			// 更新任务配置
			t.Task[i].Cron = params.Cron
			t.Task[i].TaskName = params.TaskName

			// 移除旧任务，重新添加
			if err := utils.TimeTask.RemoveTask(id); err != nil {
				return err
			}
			if err := utils.TimeTask.AddTask(id, t.Task[i].Cron, t.Task[i].TaskFunc, t.Task[i].Status); err != nil {
				return err
			}

			updated = true

			// 启用或停止任务
			if *params.Status {
				return t.StartTimeTask(id)
			} else {
				return t.StopTimeTask(id)
			}
		}
	}

	if !updated {
		return errors.New("任务不存在")
	}
	return nil
}

// StartTimeTask 启动指定任务
func (t *timeTaskService) StartTimeTask(TimeTaskID string) error {
	var err error
	for i, task := range t.Task {
		if strconv.FormatInt(task.TaskID, 10) == TimeTaskID {
			t.Task[i].Status = true
			t.Task[i].LastRunTime = time.Now()
			err = utils.TimeTask.StartTask(TimeTaskID)
		}
	}
	return err
}

// StopTimeTask 停止指定任务
func (t *timeTaskService) StopTimeTask(TimeTaskID string) error {
	if err := utils.TimeTask.StopTask(TimeTaskID); err != nil {
		return err
	}
	for i, task := range t.Task {
		if strconv.FormatInt(task.TaskID, 10) == TimeTaskID {
			t.Task[i].Status = false
			break
		}
	}
	return nil
}

// RemoveTimeTask 从调度器中彻底移除指定任务
func (t *timeTaskService) RemoveTimeTask(TimeTaskID string) error {
	return utils.TimeTask.RemoveTask(TimeTaskID)
}
