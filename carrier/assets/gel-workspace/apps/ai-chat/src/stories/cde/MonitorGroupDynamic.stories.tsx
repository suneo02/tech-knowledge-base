import { SuperListCdeMonitorProvider, useSuperListCdeMonitor } from '@/components/CDE/SuperChat/monitor/ctx'
import { MonitorGroupDynamic } from '@/components/CDE/SuperChat/monitor/MonitorGroupDynamic'
import type { Meta, StoryObj } from '@storybook/react'
import React, { useEffect } from 'react'
import { monitorListMock } from './subscribeListMock'

// 创建装饰器提供Context
const MonitorContextDecorator = (StoryFn: React.FC) => {
  return (
    <SuperListCdeMonitorProvider>
      <div style={{ backgroundColor: '#f5f5f5', minWidth: '800px' }}>
        <StoryFn />
      </div>
    </SuperListCdeMonitorProvider>
  )
}

// 创建装饰器提供数据
const WithMonitorDataDecorator = (StoryFn: React.FC) => {
  const { setMonitorList, setTotalCount } = useSuperListCdeMonitor()

  // 使用 useEffect 设置监控列表数据
  useEffect(() => {
    setMonitorList(monitorListMock)
    setTotalCount(monitorListMock.reduce((sum, item) => sum + item.count, 0))
  }, [setMonitorList, setTotalCount])

  return <StoryFn />
}

// 创建空数据装饰器
const WithEmptyDataDecorator = (StoryFn: React.FC) => {
  const { setMonitorList, setTotalCount } = useSuperListCdeMonitor()

  // 使用 useEffect 设置空列表数据
  useEffect(() => {
    setMonitorList([])
    setTotalCount(0)
  }, [setMonitorList, setTotalCount])

  return <StoryFn />
}

const meta: Meta<typeof MonitorGroupDynamic> = {
  title: 'CDE/MonitorGroupDynamic',
  component: MonitorGroupDynamic,
  parameters: {
    layout: 'centered',
  },
  decorators: [MonitorContextDecorator],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MonitorGroupDynamic>

// 默认状态 - 有监控数据
export const Default: Story = {
  decorators: [WithMonitorDataDecorator],
  args: {
    getCDEMonitorDesc: (monitor) => monitor.id,
    onRefresh: () => {
      console.log('onRefresh')
    },
  },
}

// 空状态 - 无监控数据
export const Empty: Story = {
  decorators: [WithEmptyDataDecorator],
  args: {
    getCDEMonitorDesc: (monitor) => monitor.id,
    onRefresh: () => {
      console.log('onRefresh')
    },
  },
}
