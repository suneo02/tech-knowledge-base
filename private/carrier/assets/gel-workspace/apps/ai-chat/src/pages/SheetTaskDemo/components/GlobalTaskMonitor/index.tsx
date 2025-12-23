import { Collapse, List, Tag, Typography } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  FastForwardOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { MultiSheetTaskState, TaskStatusItem, useSheetTask } from '@/contexts/SuperChat/SheetTaskContext'
import { ProgressStatusEnum } from 'gel-api'
import { TestCaseRunner } from '../TestCaseRunner'

const { Text } = Typography
const { Panel } = Collapse

export const GlobalTaskMonitor = () => {
  const { getAllSheetStates, activeSheetId, getRecentlyCompleted } = useSheetTask()
  const [allStates, setAllStates] = useState<MultiSheetTaskState>(getAllSheetStates())
  const [completedTasks, setCompletedTasks] = useState<TaskStatusItem[]>(getRecentlyCompleted())

  useEffect(() => {
    const interval = setInterval(() => {
      setAllStates(getAllSheetStates())
      setCompletedTasks(getRecentlyCompleted())
    }, 500)
    return () => clearInterval(interval)
  }, [getAllSheetStates, getRecentlyCompleted])

  const allTasks = Object.values(allStates)
    .flatMap((sheetState) => {
      if (!sheetState) return []
      const isPaused = sheetState !== allStates[activeSheetId!]
      return [...sheetState.taskList, ...sheetState.pendingTasks].map((task) => ({ ...task, isPaused }))
    })
    .filter((task) => task.status === ProgressStatusEnum.PENDING || task.status === ProgressStatusEnum.RUNNING)

  const getStatusTag = (task: TaskStatusItem & { isPaused: boolean }) => {
    if (task.isPaused)
      return (
        <Tag icon={<ClockCircleOutlined />} color="orange">
          已暂停
        </Tag>
      )
    if (task.status === ProgressStatusEnum.PENDING)
      return (
        <Tag icon={<FastForwardOutlined spin />} color="blue">
          等待中
        </Tag>
      )
    return (
      <Tag icon={<FastForwardOutlined spin />} color="green">
        进行中
      </Tag>
    )
  }

  return (
    <Collapse defaultActiveKey={['monitor', 'completed']} ghost>
      <Panel
        header={
          <Text strong>
            <ExperimentOutlined /> 压力测试用例
          </Text>
        }
        key="tests"
      >
        <TestCaseRunner />
      </Panel>
      <Panel
        header={
          <Text strong>
            <DashboardOutlined /> 全局任务监控 ({allTasks.length})
          </Text>
        }
        key="monitor"
      >
        <List
          size="small"
          dataSource={allTasks}
          renderItem={(task) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Text>
                    工作表 {task.sheetId}: <Text code>{`${task.rowId}/${task.columnId}`}</Text>
                  </Text>
                }
                description={`添加时间: ${new Date(task.timestamp).toLocaleTimeString()}`}
              />
              {getStatusTag(task)}
            </List.Item>
          )}
          locale={{ emptyText: '暂无运行中的任务' }}
        />
      </Panel>
      <Panel
        header={
          <Text strong>
            <HistoryOutlined /> 最近完成的任务 ({completedTasks.length})
          </Text>
        }
        key="completed"
      >
        <List
          size="small"
          dataSource={completedTasks}
          renderItem={(task) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Text>
                    工作表 {task.sheetId}: <Text code>{`${task.rowId}/${task.columnId}`}</Text>
                  </Text>
                }
                description={`完成于: ${new Date(task.timestamp).toLocaleTimeString()}`}
              />
              <Tag icon={<CheckCircleOutlined />} color="purple">
                已完成
              </Tag>
            </List.Item>
          )}
          locale={{ emptyText: '暂无已完成的任务' }}
        />
      </Panel>
    </Collapse>
  )
}
