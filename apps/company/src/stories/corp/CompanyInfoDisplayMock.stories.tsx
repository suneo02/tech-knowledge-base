/**
 * Stories for the CompanyInfoDisplay component which shows detailed company information
 * in a table format. This component supports various display modes and data configurations.
 */

import { Meta, StoryObj } from '@storybook/react'
import { CompanyInfoDisplay } from '../../components/company/info/CompanyInfoDisplay'
import { mockCorpBasicInfoCO } from './mockCO'
import { mockCorpBasicInfoFCP } from './mockFCP'
import { mockCorpBasicInfoFPC } from './mockFPC'
import { mockCorpBasicInfoGOV } from './mockGOV'
import { mockCorpBasicInfoHK } from './mockHK'
import { mockCorpBasicInfoIIP } from './mockIIP'
import { mockCorpBasicInfoLS } from './mockLS'
import { mockCorpBasicInfoNGO } from './mockNGO'
import { mockCorpBasicInfoOE } from './mockOE'
import { mockCorpBasicInfoPE } from './mockPE'
import { mockCorpBasicInfoSH } from './mockSH'
import { mockCorpBasicInfoSOE } from './mockSOE'
import { mockCorpBasicInfoSPE } from './mockSPE'

const meta = {
  title: 'Corp/CompanyInfoDisplayMock',
  component: CompanyInfoDisplay,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CompanyInfoDisplay>

export default meta
type Story = StoryObj<typeof CompanyInfoDisplay>

/**
 * Default story showing basic company information display
 * Includes company name, registration number, legal representative, and other basic details
 */
export const Default: Story = {
  args: {
    baseInfo: mockCorpBasicInfoCO,
    corpHeaderInfo: {
      corp_update_time: '2024-03-20',
    },
    isLoading: false,
  },
}

export const CO: Story = {
  args: {
    ...Default.args,
    baseInfo: mockCorpBasicInfoCO,
  },
}

export const FCP: Story = {
  args: {
    ...Default.args,
    baseInfo: mockCorpBasicInfoFCP,
  },
}

export const FPC: Story = {
  args: {
    ...Default.args,
    baseInfo: mockCorpBasicInfoFPC,
  },
}

export const SPE: Story = {
  args: {
    ...Default.args,
    baseInfo: mockCorpBasicInfoSPE,
  },
}

export const GOV: Story = {
  args: {
    ...Default.args,
    baseInfo: mockCorpBasicInfoGOV,
  },
}

export const IIP: Story = {
  args: {
    ...Default.args,
    baseInfo: mockCorpBasicInfoIIP,
  },
}

export const LS: Story = {
  args: {
    ...Default.args,
    baseInfo: mockCorpBasicInfoLS,
  },
}

export const NGO: Story = {
  args: {
    ...Default.args,
    baseInfo: mockCorpBasicInfoNGO,
  },
}

export const PE: Story = {
  args: {
    ...Default.args,
    baseInfo: mockCorpBasicInfoPE,
  },
}

export const SOE: Story = {
  args: {
    ...Default.args,
    baseInfo: mockCorpBasicInfoSOE,
  },
}

export const OE: Story = {
  args: {
    ...Default.args,
    baseInfo: mockCorpBasicInfoOE,
  },
}

export const SH: Story = {
  args: {
    ...Default.args,
    baseInfo: mockCorpBasicInfoSH,
  },
}

export const HK: Story = {
  args: {
    ...Default.args,
    baseInfo: mockCorpBasicInfoHK,
  },
}
/**
 * Loading state demonstration of the component
 */
export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
}
