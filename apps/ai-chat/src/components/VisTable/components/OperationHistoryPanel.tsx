import React from 'react'
import { Timeline, Card, Tag, Typography, Empty } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SyncOutlined,
  UndoOutlined,
  RedoOutlined,
  PlayCircleOutlined,
  MinusOutlined,
  HolderOutlined,
} from '@ant-design/icons'
import { useTableOperationsHistory } from '../hooks/useTableOperationsHistoryHook'
import { VisTableOperationType, SyncStatus } from '../types/operationTypes'

const { Text } = Typography

/**
 * 操作历史面板属性接口
 */
interface OperationHistoryPanelProps {
  /** 表格ID */
  tableId: string
  /** 最大高度 */
  maxHeight?: number | string
}

/**
 * 操作图标组件
 */
const OperationIcon = ({ type, syncStatus }: { type: string; syncStatus: SyncStatus }) => {
  // 根据同步状态返回不同颜色
  if (syncStatus === 'FAILED') {
    return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
  }

  if (syncStatus === 'PENDING') {
    return <ClockCircleOutlined style={{ color: '#faad14' }} />
  }

  // 根据操作类型返回不同图标
  switch (type) {
    case VisTableOperationType.SET_CELL_VALUE:
      return <EditOutlined style={{ color: '#1890ff' }} />
    case VisTableOperationType.COLUMN_ADD:
      return <PlusOutlined style={{ color: '#52c41a' }} />
    case VisTableOperationType.COLUMN_DELETE:
      return <MinusOutlined style={{ color: '#ff4d4f' }} />
    case VisTableOperationType.COLUMN_MOVE:
      return <HolderOutlined style={{ color: '#eb2f96' }} />
    case VisTableOperationType.DELETE_RECORDS:
      return <DeleteOutlined style={{ color: '#ff4d4f' }} />
    case VisTableOperationType.RECORD_ADD:
      return <PlusOutlined style={{ color: '#1677ff' }} />
    case VisTableOperationType.SET_RECORDS:
      return <SyncOutlined style={{ color: '#722ed1' }} />
    case VisTableOperationType.UNDO:
      return <UndoOutlined style={{ color: '#faad14' }} />
    case VisTableOperationType.REDO:
      return <RedoOutlined style={{ color: '#faad14' }} />
    case VisTableOperationType.CELL_RUN:
      return <PlayCircleOutlined style={{ color: 'orange' }} />
    case VisTableOperationType.COLUMN_RENAME:
      return <EditOutlined style={{ color: '#13c2c2' }} />
    default:
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />
  }
}

/**
 * 操作标签组件
 */
const OperationTag = ({ type }: { type: string }) => {
  switch (type) {
    case VisTableOperationType.SET_CELL_VALUE:
      return <Tag color="blue">编辑</Tag>
    case VisTableOperationType.COLUMN_ADD:
      return <Tag color="green">添加列</Tag>
    case VisTableOperationType.COLUMN_DELETE:
      return <Tag color="red">删除列</Tag>
    case VisTableOperationType.COLUMN_MOVE:
      return <Tag color="pink">移动列</Tag>
    case VisTableOperationType.DELETE_RECORDS:
      return <Tag color="red">删除行</Tag>
    case VisTableOperationType.RECORD_ADD:
      return <Tag color="blue">添加行</Tag>
    case VisTableOperationType.SET_RECORDS:
      return <Tag color="purple">设置数据</Tag>
    case VisTableOperationType.UNDO:
      return <Tag color="orange">撤销</Tag>
    case VisTableOperationType.REDO:
      return <Tag color="orange">重做</Tag>
    case VisTableOperationType.CELL_RUN:
      return <Tag color="orange">运行</Tag>
    case VisTableOperationType.COLUMN_RENAME:
      return <Tag color="cyan">重命名列</Tag>
    default:
      return <Tag color="default">{type}</Tag>
  }
}

/**
 * 操作历史面板组件
 */
export const OperationHistoryPanel: React.FC<OperationHistoryPanelProps> = ({ tableId, maxHeight = 170 }) => {
  // 获取操作历史
  const { operationLogs, canUndo, canRedo } = useTableOperationsHistory(tableId)

  // 倒序排列日志，最新的显示在上面
  const sortedLogs = [...operationLogs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <Card
      title="操作历史"
      size="small"
      extra={
        <div>
          <Text type="secondary" style={{ marginRight: 8 }}>
            可撤销: {canUndo ? '是' : '否'} | 可重做: {canRedo ? '是' : '否'}
          </Text>
        </div>
      }
      style={{ width: '100%' }}
      bodyStyle={{ padding: '8px 12px', maxHeight, overflowY: 'auto' }}
    >
      {sortedLogs.length === 0 ? (
        <Empty description="暂无操作记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Timeline>
          {sortedLogs.map((log) => (
            <Timeline.Item key={log.id} dot={<OperationIcon type={log.type} syncStatus={log.syncStatus} />}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <OperationTag type={log.type} />
                  <Text style={{ fontSize: '13px', marginLeft: 4 }}>{log.description}</Text>
                  {log.error && (
                    <div>
                      <Text type="danger" style={{ fontSize: '12px' }}>
                        {log.error}
                      </Text>
                    </div>
                  )}
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </Text>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      )}
    </Card>
  )
}
