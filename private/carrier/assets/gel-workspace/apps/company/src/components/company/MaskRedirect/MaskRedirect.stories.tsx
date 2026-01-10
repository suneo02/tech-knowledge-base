import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { MaskRedirect } from './index'

const meta: Meta<typeof MaskRedirect> = {
  title: 'Company/MaskRedirect',
  component: MaskRedirect,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof MaskRedirect>

// 基础示例
export const Default: Story = {
  args: {
    title: '股权冻结',
    basicNum: {
      equityfreeze: 5,
    } as any,
    maskRedirect: {
      url: (companyCode: string) =>
        `//riskwebserver/wind.risk.platform/index.html#/check/enterprise/${companyCode}/1/ShareLockUpNew`,
    },
    companyCode: '123456',
    moduleKey: 'equityfreeze',
  },
}

// 多个示例
export const Multiple: Story = {
  render: () => {
    const modules = [
      {
        title: '股权冻结',
        modelNum: 'frozenShareHoldingsCount' as const,
        basicNum: { frozenShareHoldingsCount: 5 } as any,
        maskRedirect: {
          url: (code: string) =>
            `//riskwebserver/wind.risk.platform/index.html#/check/enterprise/${code}/1/ShareLockUpNew`,
        },
        companyCode: '123456',
        moduleKey: 'equityfreeze' as const,
      },
      {
        title: '悬赏公告',
        modelNum: 'bountyAnnouncementCount' as const,
        basicNum: { bountyAnnouncementCount: 3 } as any,
        maskRedirect: {
          url: (code: string) =>
            `//riskwebserver/wind.risk.platform/index.html#/check/enterprise/${code}/1/RewardAnnouncement`,
        },
        companyCode: '123456',
        moduleKey: 'rewardnotice' as const,
      },
      {
        title: '环保信用',
        modelNum: 'environmentalRatingCount' as const,
        basicNum: { environmentalRatingCount: 2 } as any,
        maskRedirect: {
          url: (code: string) =>
            `//riskwebserver/wind.risk.platform/index.html#/check/enterprise/${code}/1/EnvironmentalCredit`,
        },
        companyCode: '123456',
        moduleKey: 'environmentalcredit' as const,
      },
    ]

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '24px' }}>
        {modules.map((module) => (
          <MaskRedirect key={module.moduleKey} {...module} />
        ))}
      </div>
    )
  },
}
