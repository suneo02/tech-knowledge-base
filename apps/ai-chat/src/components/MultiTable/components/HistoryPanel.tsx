import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  HistoryOutlined,
  LoadingOutlined,
  PlusOutlined,
  RedoOutlined,
  UndoOutlined,
} from '@ant-design/icons'
import { Card, Space, Tag, Timeline, Typography } from 'antd'
import dayjs from 'dayjs'
import { primaryColor } from 'gel-ui'
import React from 'react'
import { OperationLog, SyncStatus, TableOperation, TableOperationType } from '../types'

const { Text } = Typography

interface HistoryPanelProps {
  history: OperationLog[] | TableOperation[]
  onRestoreHistory?: (timestamp: number) => void
  currentTimestamp?: number
  title?: string
}

const OperationIcon = ({
  type,
  syncStatus,
  disabled,
}: {
  type: TableOperationType
  syncStatus: SyncStatus
  disabled?: boolean
}) => {
  const opacity = disabled ? 0.3 : 1
  // 如果是同步中状态，显示加载图标
  if (syncStatus === SyncStatus.PENDING) {
    return <LoadingOutlined style={{ color: '#1890ff', opacity }} />
  }

  // 如果同步失败，显示红色图标
  if (syncStatus === SyncStatus.FAILED) {
    return <CloseCircleOutlined style={{ color: '#ff4d4f', opacity }} />
  }

  // 如果同步成功，显示绿色的对应图标

  switch (type) {
    case TableOperationType.CELL_EDIT:
      return <EditOutlined style={{ color: primaryColor, opacity }} />
    case TableOperationType.COLUMN_MOVE:
      return <HistoryOutlined style={{ color: '#722ed1', opacity }} />
    case TableOperationType.COLUMN_ADD:
      return <PlusOutlined style={{ color: '#52c41a', opacity }} />
    case TableOperationType.COLUMN_DELETE:
      return <DeleteOutlined style={{ color: '#ff4d4f', opacity }} />
    case TableOperationType.COLUMN_RENAME:
      return <EditOutlined style={{ color: '#faad14', opacity }} />
    case TableOperationType.CELL_FILL:
      return <EditOutlined style={{ color: '#13c2c2', opacity }} />
    case TableOperationType.CELL_CLEAR:
      return <DeleteOutlined style={{ color: '#eb2f96', opacity }} />
    case TableOperationType.UNDO:
      return <UndoOutlined style={{ color: '#d9d9d9', opacity }} />
    case TableOperationType.REDO:
      return <RedoOutlined style={{ color: '#d9d9d9', opacity }} />
    default:
      return <HistoryOutlined style={{ color: '#d9d9d9', opacity }} />
  }
}

const OperationTag = ({ type }: { type: TableOperationType }) => {
  const config = {
    [TableOperationType.CELL_EDIT]: { color: 'processing', text: '编辑单元格' },
    [TableOperationType.COLUMN_MOVE]: { color: 'purple', text: '移动列' },
    [TableOperationType.COLUMN_INSERT]: { color: 'purple', text: '插入列' },
    [TableOperationType.COLUMN_ADD]: { color: 'purple', text: '新增列' },
    [TableOperationType.COLUMN_DELETE]: { color: 'purple', text: '删除列' },
    [TableOperationType.COLUMN_RENAME]: { color: 'purple', text: '重命名列' },
    // [TableOperationType.CELL_FILL]: { color: 'purple', text: 'AI生成列' },
    // [TableOperationType.CELL_CLEAR]: { color: '', text: '清除内容' },
    [TableOperationType.UNDO]: { color: 'default', text: '撤销' },
    [TableOperationType.REDO]: { color: 'default', text: '重做' },
    [TableOperationType.ROW_DELETE]: { color: 'pink', text: '删除行' },
  }[type] || { color: 'default', text: '未知操作' }

  return <Tag color={config.color}>{config.text}</Tag>
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, currentTimestamp, title = '操作历史' }) => {
  console.log(history)
  const timelineItems = history.map((record) => ({
    key: record.id,
    dot: <OperationIcon type={record.type} syncStatus={record.syncStatus} disabled={record?.disabled} />,
    color: record.timestamp === currentTimestamp ? '#1890ff' : undefined,
    children: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          opacity: record.disabled ? 0.3 : 1,
        }}
      >
        <Space direction="vertical">
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(record.timestamp).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
          <OperationTag type={record.type} />
          <Text>{record.description}</Text>
          {record?.error && (
            <Text type="danger" style={{ fontSize: 10 }}>
              {record.error}
            </Text>
          )}
        </Space>
      </div>
    ),
  }))

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HistoryOutlined />
          <span>{title}</span>
          <Text type="secondary" style={{ fontSize: 12 }}>
            ({history.length} 条记录)
          </Text>
        </div>
      }
      style={{ width: '100%', maxHeight: '80vh', overflowY: 'auto' }}
      size="small"
    >
      <Timeline mode="left" items={timelineItems} />
    </Card>
  )
}

export default HistoryPanel
