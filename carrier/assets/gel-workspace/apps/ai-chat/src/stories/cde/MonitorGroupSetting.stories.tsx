import { MonitorGroupSettingContent } from '@/components/CDE/SuperChat/monitor/MonitorGroupSetting/content'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { monitorListMock } from './subscribeListMock'

const mockMonitorDesc =
  '企业名称：小米,企业名称：小米,企业名称：小米,企业名称：小米,企业名称：小米,企业名称：小米,企业名称：小米,企业名称：小米,企业名称：小米,企业名称：小米'
// 创建装饰器提供Context
const MonitorContextDecorator = (StoryFn: React.FC) => {
  return (
    <div style={{ backgroundColor: '#f5f5f5', padding: '20px', minWidth: '800px' }}>
      <StoryFn />
    </div>
  )
}

const meta: Meta<typeof MonitorGroupSettingContent> = {
  title: 'CDE/MonitorGroupSettingContent',
  component: MonitorGroupSettingContent,
  parameters: {
    layout: 'centered',
  },
  decorators: [MonitorContextDecorator],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MonitorGroupSettingContent>

// 默认状态 - 有监控数据
export const WithMonitors: Story = {
  args: {
    list: monitorListMock.slice(0, 6),
    subMail: 'example@example.com',
    getCDESubscribeText: () => mockMonitorDesc,
  },
}

// 少量数据状态
export const WithFewMonitors: Story = {
  args: {
    list: monitorListMock.slice(0, 2),
    subMail: 'example@example.com',
    getCDESubscribeText: () => mockMonitorDesc,
  },
}

// 空状态 - 无监控数据
export const Empty: Story = {
  args: {
    list: undefined,
    subMail: 'example@example.com',
    getCDESubscribeText: () => mockMonitorDesc,
  },
}

// 无邮件
export const NoMail: Story = {
  args: {
    list: monitorListMock.slice(0, 6),
    subMail: '',
    getCDESubscribeText: () => mockMonitorDesc,
  },
}
