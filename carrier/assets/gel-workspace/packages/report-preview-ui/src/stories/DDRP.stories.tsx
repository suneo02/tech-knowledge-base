import type { Meta, StoryObj } from '@storybook/react'
import axios from 'axios'
import { UserPackageInfo } from 'gel-types'
import { DDRPPreviewComp } from '../rpViews/DDRPPreview'

// Mock data
const mockPackageInfo: UserPackageInfo = {
  accountName: 'GE6****096673',
  packageName: 'EQ_APL_GEL_FORSTAFF',
  packageNameList: ['EQ_APL_GEL_FORSTAFF', 'EQ_APL_GEL_BS'],
  expireDate: '29991231',
  phone: '188****7732',
  email: '223**********o@wind.com.cn',
  terminalType: '312',
  isBuy: false,
  isForeign: false,
  isAgree: false,
  isTrailed: false,
  isSafe: true,
  region: 0,
  hasCompGeAcc: true,
}

const mockAxiosInstance = axios.create({
  baseURL: 'https://10.100.244.57:3030/api/xsh',
  headers: {
    'wind.sessionid': 'b34ae8e7978748238d2b64a6a15330de',
    'Content-Type': 'application/json',
  },
})

const CompForStory = ({ corpCode }: { corpCode: string }) => {
  return (
    <DDRPPreviewComp
      corpCode={corpCode}
      axiosInstance={mockAxiosInstance}
      packageInfo={mockPackageInfo}
      isPackageInfoFetched={true}
      isDev={false}
      getWsid={() => 'b34ae8e7978748238d2b64a6a15330de'}
      apiTranslate={(data) => Promise.resolve(data)}
    />
  )
}

const meta: Meta<typeof CompForStory> = {
  title: 'RPViews/DDRP',
  component: CompForStory,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof CompForStory>

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
