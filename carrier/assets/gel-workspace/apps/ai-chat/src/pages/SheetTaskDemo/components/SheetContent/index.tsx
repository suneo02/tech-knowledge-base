import { Button, Card, Col, Collapse, Divider, List, Row, Space, Tag, Typography } from 'antd'
import { ClockCircleOutlined, FastForwardOutlined, PlusOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { TaskIdentifier, useSheetTask } from '@/contexts/SuperChat/SheetTaskContext'

const { Text, Paragraph } = Typography
const { Panel } = Collapse

interface SheetContentProps {
  sheetId: string
}

export const SheetContent = ({ sheetId }: SheetContentProps) => {
  const { getSheetState, updateTasks } = useSheetTask()
  const [sheetState, setSheetState] = useState(getSheetState(sheetId))

  useEffect(() => {
    const interval = setInterval(() => setSheetState(getSheetState(sheetId)), 500)
    return () => clearInterval(interval)
  }, [getSheetState, sheetId])

  const handleAddTask = () => {
    const newTask: TaskIdentifier = {
      sheetId,
      columnId: `col-${Math.floor(Math.random() * 5)}`,
      rowId: `row-${Math.floor(Math.random() * 100)}`,
      originalContent: '手动添加的任务',
    }
    updateTasks([newTask])
  }

  const taskList = sheetState?.taskList || []
  const pendingTasks = sheetState?.pendingTasks || []

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button onClick={handleAddTask} icon={<PlusOutlined />}>
        向工作表 {sheetId} 添加一个随机任务
      </Button>
      <Collapse defaultActiveKey={['1']} ghost>
        <Panel header={`工作表 ${sheetId} 状态详情`} key="1">
          <Row gutter={16}>
            <Col span={12}>
              <Card title={`运行中任务 (${taskList.length})`}>
                {taskList.length > 0 ? (
                  <List
                    size="small"
                    dataSource={taskList}
                    renderItem={(task) => (
                      <List.Item>
                        <Text code>
                          {task.rowId}/{task.columnId}
                        </Text>{' '}
                        - {task.status}
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text type="secondary">没有正在轮询的任务。</Text>
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card title={`等待队列 (${pendingTasks.length})`}>
                {pendingTasks.length > 0 ? (
                  <List
                    size="small"
                    dataSource={pendingTasks}
                    renderItem={(task) => (
                      <List.Item>
                        <Text code>
                          {task.rowId}/{task.columnId}
                        </Text>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text type="secondary">没有等待处理的任务。</Text>
                )}
              </Card>
            </Col>
          </Row>
          <Divider />
          <Paragraph>
            <Text strong>当前轮询状态: </Text>
            {sheetState?.isPolling ? (
              <Tag icon={<FastForwardOutlined spin />} color="success">
                运行中
              </Tag>
            ) : (
              <Tag icon={<ClockCircleOutlined />} color="default">
                已停止
              </Tag>
            )}
          </Paragraph>
        </Panel>
      </Collapse>
    </Space>
  )
}
