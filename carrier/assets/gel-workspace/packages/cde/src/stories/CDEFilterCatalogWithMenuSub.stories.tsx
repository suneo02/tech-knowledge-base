import { Meta, StoryObj } from '@storybook/react'

import { FC } from 'react'

import { CDEFilterCfgProvider, MeasuresProvider } from '@/ctx'
import { CDEFilterCatalogWithMenuSub, useCDEFilterCatalogWithMenuSub } from '@/FilterCatalog'
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

const CDEFilterCatalogLocalWrapper: FC<{
  defaultCurrent?: number
  onFilterChange?: (filters: CDEFilterItemUser[]) => void
  subscriptions?: CDESubscribeItem[]
  filterCfgLoading: boolean
  subscribeLoading: boolean
  subEmail: string | undefined
  handleSearch: () => void
  searchLoading: boolean
}> = (props) => {
  const ref = useCDEFilterCatalogWithMenuSub()

  return (
    <>
      <Button onClick={ref.resetFilters}>reset</Button>
      <CDEFilterCatalogWithMenuSub
        ref={ref.getCurrent()}
        style={{
          border: '1px solid red',
        }}
        subscriptions={mockSubscriptionsWithFilters.records}
        delSubFunc={async () => mockApiResponse}
        updateSubFunc={async () => mockApiResponse}
        fetchCDESubscriptions={() => {
          console.log('刷新订阅列表')
        }}
        {...props}
      />
    </>
  )
}

const meta: Meta<typeof CDEFilterCatalogLocalWrapper> = {
  title: 'panel/CDEFilterCatalogWithMenuSub',
  component: CDEFilterCatalogLocalWrapper,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <CDEFilterCfgProvider filterCfgDefault={filterCfg}>
        <MeasuresProvider measuresDefault={CDEMeasureDefaultForSL}>
          <div style={{ width: '90vw', height: '90vh' }}>
            <Story />
          </div>
        </MeasuresProvider>
      </CDEFilterCfgProvider>
    ),
  ],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CDEFilterCatalogLocalWrapper>

/**
 * Default story showing the filter catalog with basic setup
 */
export const Default: Story = {
  args: {
    onFilterChange: (filters) => {
      console.log('Filters changed:', filters)
    },
    subEmail: 'test@example.com',
    filterCfgLoading: false,
    subscribeLoading: false,
    defaultCurrent: 4,
  },
}

/**
 * Loading state while fetching filter configurations
 */
export const FilterConfigLoading: Story = {
  args: {
    filterCfgLoading: true,
    subEmail: 'test@example.com',
    subscribeLoading: false,
  },
}

/**
 * Loading state while fetching subscriptions
 */
export const SubscriptionLoading: Story = {
  args: {
    subscribeLoading: true,
    subEmail: 'test@example.com',
    filterCfgLoading: false,
  },
}

/**
 * subscribe empty
 */
export const SubscribeEmpty: Story = {
  args: {
    subEmail: 'test@example.com',
    filterCfgLoading: false,
    subscribeLoading: false,
    subscriptions: [],
  },
}

/**
 * Subscribe few
 */
export const SubscribeFew: Story = {
  args: {
    subEmail: 'test@example.com',
    filterCfgLoading: false,
    subscribeLoading: false,
    subscriptions: mockSubscriptionsWithFilters.records.slice(0, 2),
  },
}

/**
 * With all subscription actions
 */
export const WithSubscriptionActions: Story = {
  args: {
    subEmail: 'test@example.com',
    filterCfgLoading: false,
    subscribeLoading: false,
  },
}

export const SearchLoading: Story = {
  args: {
    searchLoading: true,
  },
}
