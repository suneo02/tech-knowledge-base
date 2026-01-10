import { useUserInfoStore } from '@/store/userInfo'
import { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '@wind/wind-ui'
import { ColumnProps } from '@wind/wind-ui-table'
import { VipPurchaseTableWrapper } from './VipPurchaseTableWrapper'

const columnsSample: ColumnProps[] = [
  { title: '公司名称', dataIndex: 'companyName', width: '26%' },
  { title: '公司级别', dataIndex: 'companyLevel', width: '18%' },
  { title: '归属主体公司', dataIndex: 'attributableEntityCompany', width: '26%' },
  { title: '数量', dataIndex: 'businessNumber', width: '18%', align: 'right' },
]

const meta: Meta<typeof VipPurchaseTableWrapper> = {
  title: 'User/VIP/VipPurchaseTableWrapper',
  component: VipPurchaseTableWrapper,
  decorators: [
    (Story) => {
      useUserInfoStore.setState({ isActivityUser: false })
      return (
        <ThemeProvider>
          <Story />
        </ThemeProvider>
      )
    },
  ],
}

export default meta

type Story = StoryObj<typeof VipPurchaseTableWrapper>

export const WithColumns: Story = {
  args: {
    columns: columnsSample,
    title: '会员购买',
  },
}

export const NoColumnsShowsVipOnly: Story = {
  args: {
    title: '会员购买',
  },
}

export const OnlySvipDefault: Story = {
  args: {
    columns: columnsSample,
    onlySvip: true,
    title: '会员购买',
  },
}

export const EpOnlyMarketingEdition: Story = {
  args: {
    columns: columnsSample,
    onlyEp: true,
    title: '会员购买',
    vipPopupSel: 'ep',
  },
}
