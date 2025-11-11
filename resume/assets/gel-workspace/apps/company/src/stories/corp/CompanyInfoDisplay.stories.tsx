/**
 * Stories for the CompanyInfoDisplay component which shows detailed company information
 * in a table format. This component supports various display modes and data configurations.
 */

import { CorpBasicInfo } from '@/api/corp/info/basicInfo'
import { Meta, StoryObj } from '@storybook/react'
import axios from 'axios'
import React, { FC, useEffect, useState } from 'react'
import { mockCorpBasicInfoCO } from '../../__mocks__/corp/bussInfo/mockCO'
import { CompanyInfoDisplay, CompanyInfoDisplayProps } from '../../components/company/info/CompanyInfoDisplay'

const WFC_PATH = '/Wind.WFC.Enterprise.Web'

const wfcGelPath = `${WFC_PATH}/Enterprise/gel`

const axiosInstanceForStory = axios.create({
  baseURL: 'http://localhost:3001/api',
})

axiosInstanceForStory.interceptors.request.use((config) => {
  config.headers['wind.sessionid'] = 'd40c57b23b2d4081a1f289762d725549'
  return config
})

export const ComponentForStory: FC<Partial<CompanyInfoDisplayProps> & { corpCode: string }> = (props) => {
  const [baseInfo, setBaseInfo] = useState<CorpBasicInfo | null>(null)
  useEffect(() => {
    axiosInstanceForStory
      .get(`${wfcGelPath}/detail/company/getcorpbasicinfo_basic/${props.corpCode}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })
      .then((res) => {
        setBaseInfo(res.data.Data)
      })
  }, [props.corpCode])

  if (!baseInfo) {
    return <div>Loading...</div>
  }

  return <CompanyInfoDisplay {...props} baseInfo={baseInfo} />
}

const meta = {
  title: 'Corp/CompanyInfoDisplay',
  component: ComponentForStory,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ComponentForStory>

export default meta
type Story = StoryObj<typeof ComponentForStory>

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
    corpCode: '1173319566',
  },
}

export const FCP: Story = {
  args: {
    corpCode: '1063144164',
  },
}

export const FPC: Story = {
  args: {
    corpCode: '1002954109',
  },
}

export const SPE: Story = {
  args: {
    corpCode: '1004283596',
  },
}

export const GOV: Story = {
  args: {
    corpCode: '1179064448',
  },
}

export const IIP: Story = {
  args: {
    corpCode: '1102955966',
  },
}

export const LS: Story = {
  args: {
    corpCode: '1248823373',
  },
}

export const NGO: Story = {
  args: {
    corpCode: '1226065840',
  },
}

export const PE: Story = {
  args: {
    corpCode: '1038862373',
  },
}

export const SOE: Story = {
  args: {
    corpCode: '1355909797',
  },
}

export const OE: Story = {
  args: {
    corpCode: '1054443718',
  },
}

export const SH: Story = {
  args: {
    corpCode: '1225626853',
  },
}

export const HK: Story = {
  args: {
    corpCode: '1207343546',
  },
}

export const TW: Story = {
  args: {
    corpCode: '1250975407',
  },
}

export const CANADA: Story = {
  args: {
    corpCode: '1247070793',
  },
}

export const ENGLAND: Story = {
  args: {
    corpCode: '1213525159',
  },
}

export const FRANCE: Story = {
  args: {
    corpCode: '1337588182',
  },
}

export const GERMANY: Story = {
  args: {
    corpCode: '1265819509',
  },
}

export const INDIA: Story = {
  args: {
    corpCode: '1555171305',
  },
}

export const ITALY: Story = {
  args: {
    corpCode: '1284842480',
  },
}

export const JAPAN: Story = {
  args: {
    corpCode: '1224890572',
  },
}

export const KOREA: Story = {
  args: {
    corpCode: '1207772711',
  },
}

export const LUXEMBOURG: Story = {
  args: {
    corpCode: '1239158216',
  },
}

export const MALAYSIA: Story = {
  args: {
    corpCode: '1575116880',
  },
}

export const NEW_ZEALAND: Story = {
  args: {
    corpCode: '1354418508',
  },
}

export const RUSSIA: Story = {
  args: {
    corpCode: '1550341742',
  },
}

export const SINGAPORE: Story = {
  args: {
    corpCode: '1223920191',
  },
}

export const TAILAND: Story = {
  args: {
    corpCode: '1524110754',
  },
}

export const VIETNAM: Story = {
  args: {
    corpCode: '1273211271',
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
