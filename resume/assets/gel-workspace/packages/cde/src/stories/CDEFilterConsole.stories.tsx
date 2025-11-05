import { Meta, StoryObj } from '@storybook/react'

import { FC } from 'react'

import { CDEFilterCfgProvider, MeasuresProvider } from '@/ctx'
import { CDEFilterConsole, useCDEFilterConsole } from '@/FilterConsole'
import { CDEMeasureDefaultForSL } from '@/FilterRes'
import { CDEFilterItemUser } from '@/types'
import { Button } from '@wind/wind-ui'
import { ApiCodeForWfc, ApiResponseForWFC, CDESubscribeItem } from 'gel-api'
import { filterCfg } from './mock/filterCfg'
import { mockSubscriptionsWithFilters } from './mock/sub'

// Mock API response
const mockApiResponse: ApiResponseForWFC<never> = {
  Data: {} as never,
  ErrorCode: ApiCodeForWfc.SUCCESS,
  ErrorMessage: '',
  status: '200',
  Page: {
    CurrentPage: 1,
    PageSize: 10,
    Records: 0,
    TotalPage: 0,
  },
}

const CDEFilterConsoleWrapper: FC<{
  onFilterChange?: (filters: CDEFilterItemUser[]) => void
  subscriptions?: CDESubscribeItem[]
  filterCfgLoading?: boolean
  subscribeLoading?: boolean
  subEmail?: string
  handleSearch?: () => void
  searchLoading?: boolean
  defaultCurrent?: number
  useEmptyFilterCfg?: boolean
  rightExtraContent?: React.ReactNode
}> = (props) => {
  const ref = useCDEFilterConsole()
  const { useEmptyFilterCfg, rightExtraContent, ...restProps } = props

  return (
    <>
      <Button onClick={ref.resetFilters}>重置外部</Button>
      <CDEFilterConsole
        ref={ref.getCurrent()}
        style={{
          border: '1px solid #eee',
          borderRadius: '8px',
        }}
        subscriptions={props.subscriptions || mockSubscriptionsWithFilters.records}
        delSubFunc={async () => mockApiResponse}
        updateSubFunc={async () => mockApiResponse}
        fetchCDESubscriptions={() => {
          console.log('刷新订阅列表')
        }}
        handleSearch={() => {
          console.log('搜索点击')
          props.handleSearch?.()
        }}
        {...restProps}
      />
    </>
  )
}

// 创建两个不同的装饰器，一个用于正常filterCfg，一个用于空filterCfg
const withNormalFilterCfg = (Story: any) => (
  <CDEFilterCfgProvider filterCfgDefault={filterCfg}>
    <MeasuresProvider measuresDefault={CDEMeasureDefaultForSL}>
      <div style={{ width: '90vw', height: '90vh' }}>
        <Story />
      </div>
    </MeasuresProvider>
  </CDEFilterCfgProvider>
)

const withEmptyFilterCfg = (Story: any) => (
  <CDEFilterCfgProvider filterCfgDefault={[]}>
    <MeasuresProvider measuresDefault={CDEMeasureDefaultForSL}>
      <div style={{ width: '90vw', height: '90vh' }}>
        <Story />
      </div>
    </MeasuresProvider>
  </CDEFilterCfgProvider>
)

const meta: Meta<typeof CDEFilterConsoleWrapper> = {
  title: 'panel/CDEFilterConsole',
  component: CDEFilterConsoleWrapper,
  parameters: {
    layout: 'centered',
  },
  decorators: [withNormalFilterCfg],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CDEFilterConsoleWrapper>

/**
 * 默认展示筛选面板
 */
export const Default: Story = {
  args: {
    onFilterChange: (filters) => {
      console.log('Filters changed:', filters)
    },
    subEmail: 'test@example.com',
    defaultCurrent: 4,
  },
}

/**
 * 带自定义右侧内容
 */
export const WithRightExtraContent: Story = {
  args: {
    onFilterChange: (filters) => {
      console.log('Filters changed:', filters)
    },
    subEmail: 'test@example.com',
    defaultCurrent: 4,
    rightExtraContent: <span className="custom-extra-content">自定义内容</span>,
  },
}

/**
 * 筛选配置加载中
 */
export const FilterConfigLoading: Story = {
  args: {
    filterCfgLoading: true,
    subEmail: 'test@example.com',
  },
}

/**
 * 空筛选配置列表
 */
export const EmptyFilterConfig: Story = {
  args: {
    subEmail: 'test@example.com',
    filterCfgLoading: true,
  },
  decorators: [withEmptyFilterCfg],
}

/**
 * 订阅列表加载中
 */
export const SubscriptionLoading: Story = {
  args: {
    subscribeLoading: true,
    subEmail: 'test@example.com',
  },
}

/**
 * 订阅列表为空
 */
export const SubscribeEmpty: Story = {
  args: {
    subEmail: 'test@example.com',
    subscriptions: [],
  },
}

/**
 * 少量订阅项
 */
export const SubscribeFew: Story = {
  args: {
    subEmail: 'test@example.com',
    subscriptions: mockSubscriptionsWithFilters.records.slice(0, 2),
  },
}

/**
 * 搜索中状态
 */
export const SearchLoading: Story = {
  args: {
    searchLoading: true,
    handleSearch: () => {
      console.log('Search triggered')
    },
  },
}
