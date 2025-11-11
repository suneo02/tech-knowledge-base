import { useState } from 'react'
import { Button, InputNumber, Progress, Space, Typography, Card, Tag, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
// @ts-expect-error ttt
import { useIdleTaskProcessor } from '@/hooks/useIdleTaskProcessor'

const { Title, Text, Paragraph } = Typography

// A more visually appealing card for a single user
const UserCard = ({ user }: { user: any }) => {
  if (!user) return null // Don't render if user data is somehow null/undefined
  const isAdmin = user.profile?.attributes?.isAdmin
  return (
    <Card style={{ margin: '8px', width: '300px', backgroundColor: user.metadata ? '#e6f7ff' : '#fafafa' }} hoverable>
      <Card.Meta
        avatar={<Avatar icon={<UserOutlined />} />}
        title={
          <Space>
            {user.profile?.name || 'N/A'} {isAdmin && <Tag color="red">Admin</Tag>}
          </Space>
        }
        description={user.profile?.email || 'no-email@example.com'}
      />
      <Paragraph style={{ marginTop: '12px' }}>
        Status: <Tag color={user.status === 'processed_successfully' ? 'green' : 'orange'}>{user.status}</Tag>
      </Paragraph>
      {user.metadata?.profileHash && (
        <Paragraph copyable={{ text: user.metadata.profileHash }} style={{ fontSize: '12px', color: '#888' }}>
          Hash: {user.metadata.profileHash}
        </Paragraph>
      )}
    </Card>
  )
}

const TestIdle = () => {
  const [itemCount, setItemCount] = useState(20000)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Idle')
  const [timeTaken, setTimeTaken] = useState(0)
  const [processedData, setProcessedData] = useState<any[]>([])

  const { addTask, cancelTask, isTaskRunning } = useIdleTaskProcessor()

  const handleStart = () => {
    setProgress(0)
    setStatus('Generating data...')
    setProcessedData([])
    setTimeTaken(0)

    setTimeout(() => {
      setStatus('Processing...')
      const startTime = performance.now()

      const items = Array.from({ length: itemCount }, (_, i) => ({
        id: `user-${i}-${Math.random().toString(36).substring(2, 9)}`,
        username: `user_${i}`,
        profile: {
          name: `User Name ${i}`,
          email: `user${i}@example.com`,
          registeredAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          attributes: {
            isAdmin: Math.random() > 0.95,
            loginCount: Math.floor(Math.random() * 1000),
          },
        },
        status: 'pending_processing',
        metadata: null,
      }))

      const itemProcessor = (item: (typeof items)[0]) => {
        let hash = 0
        const dataString = JSON.stringify(item.profile)
        for (let i = 0; i < dataString.length; i++) {
          const char = dataString.charCodeAt(i)
          hash = (hash << 5) - hash + char
          hash |= 0
        }
        return {
          ...item,
          processedAt: new Date().toISOString(),
          status: 'processed_successfully',
          profile: { ...item.profile, name: item.profile.name.toUpperCase() },
          metadata: { profileHash: `hash_${hash}`, processingVersion: '1.0.0' },
        }
      }

      const onDone = (results: any[]) => {
        const endTime = performance.now()
        setTimeTaken(endTime - startTime)
        setStatus(`Completed ${results.length} items.`)
      }

      const onProgress = (p: number, partialResults: any[]) => {
        setProgress(p)
        setProcessedData(partialResults)
      }

      const onCancel = () => {
        setStatus('Task Cancelled!')
      }

      addTask(items, itemProcessor, onDone, onProgress, onCancel)
    }, 100)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '100%', margin: 'auto' }}>
      <Title level={2}>Idle Task Processor Stress Test</Title>
      <Card style={{ marginBottom: '1rem' }}>
        <Space>
          <Text>Number of items to process:</Text>
          <InputNumber
            value={itemCount}
            onChange={(value) => setItemCount(value || 0)}
            min={1}
            max={5000000}
            step={10000}
            disabled={isTaskRunning}
          />
          <Button type="primary" onClick={handleStart} loading={isTaskRunning && status !== 'Idle'}>
            Start Processing
          </Button>
          <Button danger onClick={cancelTask} disabled={!isTaskRunning}>
            Cancel Task
          </Button>
        </Space>
        <div style={{ marginTop: '1rem' }}>
          <Text strong>Status:</Text> <Text>{status}</Text>
        </div>
        <div>
          <Text strong>Progress:</Text>
          <Progress percent={progress} />
        </div>
        {timeTaken > 0 && (
          <div>
            <Text strong>Time Taken:</Text> <Text>{timeTaken.toFixed(2)} ms</Text>
          </div>
        )}
      </Card>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          border: '1px solid #eee',
          padding: '1rem',
          marginTop: '1rem',
          height: '60vh',
          overflowY: 'scroll',
          backgroundColor: '#f0f2f5',
        }}
      >
        {processedData.map((user, index) => (
          <UserCard user={user} key={user.id || index} />
        ))}
      </div>
    </div>
  )
}

export default TestIdle
