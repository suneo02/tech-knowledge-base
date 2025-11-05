import { requestWfcEntity } from '@/api/services/wfc'
import { ApiResponseForWFC } from '@/api/types/response'
import { configTableCreator } from '@/comp/table/ConfigTable/creator'
import { initLanguageControl } from '@/utils/lang/languageControl'
import { Meta, StoryObj } from '@storybook/html'
import { getCorpInfoConfigByInfo } from 'detail-page-config'
import { CorpBasicInfo, ReportDetailTableJson } from 'gel-types'

const requestCorpInfo = async (corpCode: string): Promise<ApiResponseForWFC<CorpBasicInfo>> => {
  return new Promise((resolve, reject) => {
    // 使用回调式API
    requestWfcEntity<ApiResponseForWFC<CorpBasicInfo>>('detail/company/getcorpbasicinfo_basic', corpCode, {
      data: {},
      success: (data) => {
        resolve(data)
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}

// 创建一个唯一的容器 ID
const generateUniqueId = (() => {
  let count = 0
  return () => `corp-info-container-${count++}`
})()

// 创建容器
const createContainer = (id: string): HTMLDivElement => {
  const container = document.createElement('div')
  container.id = id
  container.className = 'corp-info-table-container'
  container.style.padding = '20px'
  return container
}

// Common render function for all stories
const renderCorpInfo = (corpCode: string) => {
  const containerId = generateUniqueId()
  const container = createContainer(containerId)

  initLanguageControl({
    onSuccess: () => {
      requestCorpInfo(corpCode).then((data) => {
        const Data = data.Data
        const $container = $(container)
        const config = getCorpInfoConfigByInfo(Data) as ReportDetailTableJson

        const $table = configTableCreator(Data, config)
        $container.append($table)
      })
    },
  })

  return container
}

const meta: Meta = {
  title: 'Corp/BussInfo',
  tags: ['autodocs'],
  render: (args) => renderCorpInfo(args.corpCode),
  parameters: {
    docs: {
      description: {
        component: 'A configurable table component for displaying corporation business information.',
      },
    },
  },
}

export default meta
type Story = StoryObj

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
