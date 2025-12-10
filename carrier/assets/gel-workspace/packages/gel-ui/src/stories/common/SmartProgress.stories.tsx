import { SmartProgress, SmartProgressStatus } from '@/common'
import { Meta, StoryObj } from '@storybook/react'
import { Button, Radio, Space, Tag } from 'antd'
import { useState } from 'react'

const meta: Meta<typeof SmartProgress> = {
  title: 'common/SmartProgress',
  component: SmartProgress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SmartProgress>

/**
 * 基础示例 - 展示所有状态
 */
export const Basic: Story = {
  render: () => {
    return (
      <div style={{ width: 400 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <h4>PENDING 状态</h4>
            <SmartProgress status={SmartProgressStatus.PENDING} />
          </div>
          <div>
            <h4>RUNNING 状态</h4>
            <SmartProgress status={SmartProgressStatus.RUNNING} />
          </div>
          <div>
            <h4>SUCCESS 状态</h4>
            <SmartProgress status={SmartProgressStatus.SUCCESS} />
          </div>
          <div>
            <h4>FAILED 状态</h4>
            <SmartProgress status={SmartProgressStatus.FAILED} />
          </div>
        </Space>
      </div>
    )
  },
}

/**
 * 交互式示例 - 可以通过按钮切换状态
 */
export const Interactive: Story = {
  render: () => {
    const StatusDemo = () => {
      const [status, setStatus] = useState<SmartProgressStatus>(SmartProgressStatus.PENDING)

      return (
        <div style={{ width: 400 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Radio.Group value={status} onChange={(e) => setStatus(e.target.value)} buttonStyle="solid">
                <Radio.Button value={SmartProgressStatus.PENDING}>等待中</Radio.Button>
                <Radio.Button value={SmartProgressStatus.RUNNING}>进行中</Radio.Button>
                <Radio.Button value={SmartProgressStatus.SUCCESS}>成功</Radio.Button>
                <Radio.Button value={SmartProgressStatus.FAILED}>失败</Radio.Button>
              </Radio.Group>
            </div>
            <div style={{ marginTop: 20 }}>
              <SmartProgress status={status} />
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: '#666' }}>
              提示：从等待中(PENDING)到进行中(RUNNING)状态时，进度条保持原样不变
            </div>
          </Space>
        </div>
      )
    }

    return <StatusDemo />
  },
}

/**
 * 自动状态转换示例
 */
export const AutomaticStatusTransition: Story = {
  render: () => {
    const StatusTransitionDemo = () => {
      const [status, setStatus] = useState<SmartProgressStatus>(SmartProgressStatus.PENDING)
      const [currentStatusText, setCurrentStatusText] = useState('等待中')

      const startProcess = () => {
        // 重置为等待状态
        setStatus(SmartProgressStatus.PENDING)
        setCurrentStatusText('等待中')

        // 1秒后变为进行中
        setTimeout(() => {
          setStatus(SmartProgressStatus.RUNNING)
          setCurrentStatusText('进行中')

          // 再过3秒后随机成功或失败
          setTimeout(() => {
            // 随机决定是成功还是失败
            const isSuccess = Math.random() > 0.3
            setStatus(isSuccess ? SmartProgressStatus.SUCCESS : SmartProgressStatus.FAILED)
            setCurrentStatusText(isSuccess ? '生成成功' : '生成失败')
          }, 3000)
        }, 1000)
      }

      // 也可以直接从等待中切换到成功/失败，跳过进行中状态
      const skipToResult = (result: 'success' | 'failed') => {
        setStatus(result === 'success' ? SmartProgressStatus.SUCCESS : SmartProgressStatus.FAILED)
        setCurrentStatusText(result === 'success' ? '生成成功' : '生成失败')
      }

      return (
        <div style={{ width: 400 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Button type="primary" onClick={startProcess}>
                开始处理
              </Button>
              <Button onClick={() => skipToResult('success')}>直接成功</Button>
              <Button danger onClick={() => skipToResult('failed')}>
                直接失败
              </Button>
            </Space>
            <div style={{ marginTop: 10 }}>
              <Tag
                color={
                  status === SmartProgressStatus.PENDING
                    ? 'blue'
                    : status === SmartProgressStatus.RUNNING
                      ? 'orange'
                      : status === SmartProgressStatus.SUCCESS
                        ? 'green'
                        : 'red'
                }
              >
                当前状态: {currentStatusText}
              </Tag>
            </div>
            <div style={{ marginTop: 20 }}>
              <SmartProgress status={status} />
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: '#666' }}>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                <li>从等待中到进行中状态时，进度条继续以相同方式增长</li>
                <li>从等待中/进行中到成功状态时，进度条会在300ms内完成到100%</li>
                <li>从等待中/进行中到失败状态时，立即显示失败</li>
              </ul>
            </div>
          </Space>
        </div>
      )
    }

    return <StatusTransitionDemo />
  },
}
