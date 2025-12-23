import { TaskHistoryLog, TaskStatusItem } from '@/components/ETable/context/ai-task/types'
import { useTableAITask } from '@/components/ETable/context/TableAITaskContext'
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { Badge, Button, Card, Popover, Progress, Space, Tag, Timeline, Tooltip, Typography } from 'antd'
import { ProgressStatusEnum } from 'gel-api'
import { useVisTableContext } from '../context/VisTableContext'

const { Text, Paragraph } = Typography

/**
 * AI任务状态面板组件
 * 用于展示当前所有AI生成任务的排队和完成情况
 */
export const AITaskStatusPanel: React.FC = () => {
  // 使用AI任务上下文
  const { taskList, taskLog, isPolling, resetTask, resetAllTasks } = useTableAITask()
  const { visTableRef } = useVisTableContext()

  // 使用AI任务操作Hook获取解析功能
  // const { parseTaskId } = useAITaskOperation({ multiTableRef: visTableRef })
  const parseTaskId = (taskId?: string) => {
    if (!taskId) return { columnId: '', rowId: '' }
    return {
      columnId: '',
      rowId: '',
    }
  }

  // 获取任务信息
  const getTaskInfo = (taskId: string) => {
    if (!visTableRef.current) return { columnName: '未知列', value: '未知值', columnId: '', rowId: '' }

    try {
      const { columnId, rowId } = parseTaskId(taskId)

      // 查找列索引
      const columns = visTableRef.current.columns || []
      const columnIndex = columns.findIndex((col) => col.field === columnId)

      // 获取列名称
      const columnName = columnIndex >= 0 ? (columns[columnIndex].title as string) || `列 ${columnIndex + 1}` : '未知列'

      // 获取单元格当前值
      const dataSource = visTableRef.current.dataSource.records || []
      const rowIndex = Array.isArray(dataSource)
        ? dataSource.findIndex((record) => record.rowId === rowId || record._rowId === rowId)
        : -1

      const value =
        rowIndex >= 0 && columnIndex >= 0 ? visTableRef.current.getCellValue(columnIndex, rowIndex + 1) : '未知值'

      return { columnName, value, columnIndex, rowIndex: rowIndex + 1, columnId, rowId }
    } catch (error) {
      console.error('获取任务信息失败:', error)
      return { columnName: '未知列', value: '未知值', columnId: '', rowId: '' }
    }
  }

  // 创建TaskIdentifier对象
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createTaskIdentifier = (columnId: string, rowId: string): any => {
    return { columnId, rowId }
  }

  // 获取状态标签
  const getStatusTag = (status: ProgressStatusEnum) => {
    switch (status) {
      case ProgressStatusEnum.PENDING:
        return (
          <Tag icon={<ClockCircleOutlined />} color="default">
            等待中
          </Tag>
        )
      case ProgressStatusEnum.RUNNING:
        return (
          <Tag icon={<SyncOutlined spin />} color="processing">
            生成中
          </Tag>
        )
      case ProgressStatusEnum.SUCCESS:
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            已完成
          </Tag>
        )
      case ProgressStatusEnum.FAILED:
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            失败
          </Tag>
        )
      default:
        return <Tag color="default">{status}</Tag>
    }
  }

  // 计算任务进度
  const calculateProgress = () => {
    if (taskLog.length === 0) return 100

    const completed = taskLog.filter(
      (item) => item.latestStatus === ProgressStatusEnum.SUCCESS || item.latestStatus === ProgressStatusEnum.FAILED
    ).length

    return Math.floor((completed / taskLog.length) * 100)
  }

  // 获取任务状态对应的图标
  const getStatusIcon = (status: ProgressStatusEnum) => {
    switch (status) {
      case ProgressStatusEnum.PENDING:
        return <ClockCircleOutlined style={{ color: '#faad14' }} />
      case ProgressStatusEnum.RUNNING:
        return <SyncOutlined spin style={{ color: '#1890ff' }} />
      case ProgressStatusEnum.SUCCESS:
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />
      case ProgressStatusEnum.FAILED:
        return <CloseCircleOutlined style={{ color: '#f5222d' }} />
      default:
        return null
    }
  }

  // 格式化时间
  const formatTime = (timestamp?: number) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  // 获取状态文本描述
  const getStatusDescription = (status: ProgressStatusEnum) => {
    switch (status) {
      case ProgressStatusEnum.PENDING:
        return '任务开始'
      case ProgressStatusEnum.RUNNING:
        return '开始生成内容'
      case ProgressStatusEnum.SUCCESS:
        return '生成成功'
      case ProgressStatusEnum.FAILED:
        return '生成失败'
      default:
        return '未知状态'
    }
  }

  // 获取状态颜色
  const getStatusColor = (status: ProgressStatusEnum) => {
    switch (status) {
      case ProgressStatusEnum.SUCCESS:
        return 'green'
      case ProgressStatusEnum.FAILED:
        return 'red'
      case ProgressStatusEnum.RUNNING:
        return 'blue'
      default:
        return 'gray'
    }
  }

  // 获取活动任务的状态
  const getActiveTaskStatus = (columnId: string, rowId: string): ProgressStatusEnum | undefined => {
    const task = taskList.find((task) => task.columnId === columnId && task.rowId === rowId)
    return task?.status
  }

  // 获取任务类型颜色
  const getTaskTypeColor = (log: TaskHistoryLog) => {
    // 如果是活动任务，使用活动状态的颜色
    const activeStatus = getActiveTaskStatus(log.columnId, log.rowId)
    if (activeStatus) {
      switch (activeStatus) {
        case ProgressStatusEnum.PENDING:
          return 'default'
        case ProgressStatusEnum.RUNNING:
          return 'processing'
        case ProgressStatusEnum.SUCCESS:
          return 'success'
        case ProgressStatusEnum.FAILED:
          return 'error'
        default:
          return 'default'
      }
    }

    // 否则使用最新状态的颜色
    switch (log.latestStatus) {
      case ProgressStatusEnum.PENDING:
        return 'default'
      case ProgressStatusEnum.RUNNING:
        return 'processing'
      case ProgressStatusEnum.SUCCESS:
        return 'success'
      case ProgressStatusEnum.FAILED:
        return 'error'
      default:
        return 'default'
    }
  }

  // 任务统计
  const pending = taskList.filter((item) => item.status === ProgressStatusEnum.PENDING).length
  const running = taskList.filter((item) => item.status === ProgressStatusEnum.RUNNING).length
  const completed = taskLog.filter((item) => item.latestStatus === ProgressStatusEnum.SUCCESS).length
  const failed = taskLog.filter((item) => item.latestStatus === ProgressStatusEnum.FAILED).length

  // 进度
  const progress = calculateProgress()

  // 清除所有任务
  const handleClearAllTasks = () => {
    resetAllTasks()
  }

  // 清除已完成任务
  const handleClearCompletedTasks = () => {
    taskLog.forEach((task) => {
      if (task.latestStatus === ProgressStatusEnum.SUCCESS || task.latestStatus === ProgressStatusEnum.FAILED) {
        resetTask(createTaskIdentifier(task.columnId, task.rowId))
      }
    })
  }

  // 获取最新内容
  const getLatestContent = (historyItem: TaskStatusItem) => {
    return historyItem.content
  }

  // 生成任务详情内容 - 用于悬停显示
  const renderTaskDetail = (log: TaskHistoryLog) => {
    const taskInfo = getTaskInfo(`${log.columnId},${log.rowId}`)
    const activeStatus = getActiveTaskStatus(log.columnId, log.rowId)

    return (
      <div style={{ maxWidth: 400 }}>
        <div style={{ marginBottom: 8 }}>
          <Space>
            {activeStatus ? getStatusTag(activeStatus) : getStatusTag(log.latestStatus)}
            <Text strong>{taskInfo.columnName}</Text>
            <Text type="secondary">行 {log.rowId}</Text>
          </Space>
        </div>

        <Timeline
          style={{ marginBottom: 8 }}
          items={log.history.map((historyItem: TaskStatusItem, index: number) => ({
            color: getStatusColor(historyItem.status),
            dot: getStatusIcon(historyItem.status),
            children: (
              <div>
                <Space>
                  <Text type="secondary">{formatTime(historyItem.timestamp)}</Text>
                  <Text
                    type={
                      historyItem.status === ProgressStatusEnum.SUCCESS
                        ? 'success'
                        : historyItem.status === ProgressStatusEnum.FAILED
                          ? 'danger'
                          : undefined
                    }
                  >
                    {getStatusDescription(historyItem.status)}
                  </Text>
                </Space>

                {/* 显示原始内容 - 只在第一个状态时显示 */}
                {index === 0 && log.originalContent && (
                  <div style={{ marginTop: 4 }}>
                    <Text type="secondary">原始内容: </Text>
                    <Text code>{log.originalContent}</Text>
                  </div>
                )}

                {/* 显示生成内容 - 仅在SUCCESS且有内容时显示 */}
                {historyItem.status === ProgressStatusEnum.SUCCESS && historyItem.content && (
                  <div style={{ marginTop: 4 }}>
                    <Text type="secondary">生成内容: </Text>
                    <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '展开' }}>
                      <Text code>{getLatestContent(historyItem)}</Text>
                    </Paragraph>
                  </div>
                )}
              </div>
            ),
          }))}
        />

        <div style={{ textAlign: 'right' }}>
          <Button
            size="small"
            danger
            onClick={(e) => {
              e.stopPropagation()
              resetTask(createTaskIdentifier(log.columnId, log.rowId))
            }}
          >
            移除任务
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card
      title={
        <Space>
          <Text strong>AI生成任务状态</Text>
          {isPolling && <Badge status="processing" text="正在轮询" />}
          {taskList.length > 0 && (
            <Badge
              count={taskList.length}
              style={{ backgroundColor: '#52c41a' }}
              title={`总计 ${taskList.length} 个任务`}
            />
          )}
        </Space>
      }
      extra={
        <Space>
          <Progress
            percent={progress}
            size="small"
            status={progress === 100 ? 'success' : 'active'}
            style={{ width: 120 }}
          />
          {(completed > 0 || failed > 0) && (
            <Button size="small" onClick={handleClearCompletedTasks}>
              清除已完成
            </Button>
          )}
          {taskLog.length > 0 && (
            <Button size="small" danger onClick={handleClearAllTasks}>
              清除全部
            </Button>
          )}
        </Space>
      }
      size="small"
      style={{ marginBottom: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
    >
      <Space style={{ marginBottom: 16 }} wrap>
        <Tag color="#108ee9">总计: {taskLog.length}</Tag>
        <Tag color="#2db7f5">等待: {pending}</Tag>
        <Tag color="#1890ff">执行: {running}</Tag>
        <Tag color="#52c41a">完成: {completed}</Tag>
        <Tag color="#f5222d">失败: {failed}</Tag>
      </Space>

      {taskLog.length === 0 ? (
        <Text type="secondary">当前没有AI生成任务</Text>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {taskLog.map((log) => {
            const taskInfo = getTaskInfo(`${log.columnId},${log.rowId}`)
            const activeStatus = getActiveTaskStatus(log.columnId, log.rowId)
            const status = activeStatus || log.latestStatus

            return (
              <Popover
                key={`${log.columnId}-${log.rowId}`}
                content={renderTaskDetail(log)}
                title="任务详情"
                trigger="hover"
                placement="top"
                arrow={{ pointAtCenter: true }}
              >
                <Tooltip title={`${taskInfo.columnName} (行${log.rowId})`}>
                  <Tag
                    color={getTaskTypeColor(log)}
                    icon={getStatusIcon(status)}
                    style={{ cursor: 'pointer', margin: '2px' }}
                    closable={status === ProgressStatusEnum.SUCCESS || status === ProgressStatusEnum.FAILED}
                    onClose={(e) => {
                      e.preventDefault()
                      resetTask(createTaskIdentifier(log.columnId, log.rowId))
                    }}
                  >
                    {`${taskInfo.columnName.substring(0, 4)}${taskInfo.columnName.length > 4 ? '..' : ''}`}
                  </Tag>
                </Tooltip>
              </Popover>
            )
          })}
        </div>
      )}
    </Card>
  )
}
