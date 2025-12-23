import { Button, Layout, Space, Tabs, Typography } from 'antd'
import { ClusterOutlined, PlusOutlined } from '@ant-design/icons'
import { useEffect } from 'react'
import { TaskIdentifier, useSheetTask } from '@/contexts/SuperChat/SheetTaskContext'
import { GlobalTaskMonitor } from '../GlobalTaskMonitor'
import { SheetContent } from '../SheetContent'

const { Title } = Typography
const { TabPane } = Tabs
const { Header, Content, Sider } = Layout

export const SheetTaskDemo = () => {
  const { activeSheetId, setActiveSheet, updateTasks } = useSheetTask()

  useEffect(() => {
    setActiveSheet(activeSheetId)
  }, [activeSheetId, setActiveSheet])

  const addTasksToAllSheets = () => {
    const allNewTasks: TaskIdentifier[] = []
    for (let i = 1; i <= 10; i++) {
      for (let j = 0; j < 10; j++) {
        allNewTasks.push({
          sheetId: String(i),
          columnId: `col-${Math.floor(Math.random() * 5)}`,
          rowId: `row-${Math.floor(Math.random() * 100)}`,
          originalContent: 'batch content',
        })
      }
    }
    updateTasks(allNewTasks)
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        width={450}
        theme="light"
        style={{ padding: '16px', borderRight: '1px solid #f0f0f0', height: '100%', overflow: 'auto' }}
      >
        <GlobalTaskMonitor />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={3} style={{ margin: '16px 0' }}>
            <ClusterOutlined /> 单元格任务并发轮询演示
          </Title>
        </Header>
        <Content style={{ padding: '24px', overflow: 'auto' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={addTasksToAllSheets}>
              为每个工作表批量添加10个任务
            </Button>
            <Tabs activeKey={activeSheetId || '1'} onChange={setActiveSheet} type="card">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((sheetId) => (
                <TabPane tab={`工作表 ${sheetId}`} key={String(sheetId)}>
                  <SheetContent sheetId={String(sheetId)} />
                </TabPane>
              ))}
            </Tabs>
          </Space>
        </Content>
      </Layout>
    </Layout>
  )
}
