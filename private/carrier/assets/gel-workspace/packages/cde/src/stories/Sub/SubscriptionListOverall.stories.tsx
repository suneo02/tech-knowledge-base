import { Meta, StoryObj } from '@storybook/react'

import { ApiCodeForWfc, ApiResponseForWFC, CDESubscribeItem } from 'gel-api'
import { CDESubscriptionListOverall } from '../../subscribe/SubscriptionListOverall'

const mockSubscriptions: CDESubscribeItem[] = [
  {
    id: '1',
    subName: '高科技公司筛选',
    subPush: false,
    superQueryLogic: JSON.stringify({
      filters: [{ itemId: 'industry', value: '高科技', logic: 'eq' }],
    }),
  },
  {
    id: '2',
    subName: '大型企业筛选',
    subPush: true,
    superQueryLogic: JSON.stringify({
      filters: [{ itemId: 'scale', value: '大型', logic: 'eq' }],
    }),
  },
]

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

const meta: Meta<typeof CDESubscriptionListOverall> = {
  title: 'sub/SubscriptionListOverall',
  component: CDESubscriptionListOverall,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '800px', padding: '24px', border: '1px solid #eee' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CDESubscriptionListOverall>

/**
 * 默认展示，包含多个订阅项
 */
export const Default: Story = {
  args: {
    subscribeList: mockSubscriptions,
    subEmail: 'test@example.com',
    getCDESubscribeText: (item) => `筛选条件: ${JSON.parse(item.superQueryLogic).filters[0].value}`,
    onClickApply: (item) => {
      console.log('Apply subscription:', item)
    },
    delSubFunc: async (item) => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('Delete subscription', item)
      return mockApiResponse
    },
    updateSubFunc: async (item) => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('Update subscription', item)
      return mockApiResponse
    },
  },
}

/**
 * 空列表状态
 */
export const EmptyList: Story = {
  args: {
    subscribeList: [],
    subEmail: 'test@example.com',
    getCDESubscribeText: () => '',
    onClickApply: () => {},
    delSubFunc: async () => mockApiResponse,
    updateSubFunc: async () => mockApiResponse,
  },
}

/**
 * 加载中状态
 */
export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
}

/**
 * 长文本内容
 */
export const WithLongContent: Story = {
  args: {
    ...Default.args,
    subscribeList: [
      {
        id: '60887519824228862',
        subName: 'tttttt',
        subPush: false,
        superQueryLogic:
          '{"filters":[{"title":"企业名称","itemId":1,"logic":"any","field":"corp_name","value":["xiaomi"]}]}',
      },
      {
        id: '60886927369348162',
        subName: 'tttt',
        subPush: false,
        superQueryLogic:
          '{"filters":[{"field":"data_from","itemId":78,"logic":"any","title":"机构规模","value":["298010000,298020000,298040000"]},{"field":"govlevel","itemId":77,"logic":"any","title":"营业状态","value":["存续"]},{"itemId":90,"logic":"prefix","value":["7411"],"title":"行业","field":"industry_code","labels4see":[["7411"]]}]}',
      },
      {
        id: '60259428644987943',
        subName: '小米',
        subPush: true,
        superQueryLogic:
          '{"filters":[{"itemId":1,"logic":"any","value":["小米"],"title":"企业名称","field":"corp_name"}],"geoFilter":[],"measures":[{"field":"corp_id","title":"企业id"},{"field":"corp_name","title":"企业名称"},{"title":"统一社会信用代码","field":"credit_code"},{"title":"经营状态","field":"govlevel"},{"title":"成立日期","field":"established_time"},{"title":"营业期限","field":"oper_period_end"},{"title":"注册资本(万)","field":"register_capital"},{"title":"法定代表人","field":"artificial_person"},{"title":"省份地区","field":"region"},{"title":"注册地址","field":"register_address"},{"title":"国标行业-门类","field":"industry_gb_1"},{"title":"国标行业-大类","field":"industry_gb_2"},{"title":"国标行业-中类","field":"industry_gb"},{"title":"联系电话","field":"tel"}]}',
      },
      {
        id: '60257626635674661',
        subName: 'rank2',
        subPush: true,
        superQueryLogic:
          '{"filters":[{"title":"科技型企业名录","itemId":138,"logic":"any","itemField":"corpListDetailQueryLogic","value":[{"label":"科技小巨人企业","value":"2010202479|108020113","objectName":"科技小巨人企业","objectId":"2010202479|108020113","certYear":1,"id":"2010202479|108020113","name":"科技小巨人企业","validDate":0,"selfDefine":0,"itemOption":[]},{"label":"高新技术企业","value":"2010202098|108020101","objectName":"高新技术企业","objectId":"2010202098|108020101","certYear":0,"id":"2010202098|108020101","name":"高新技术企业","validDate":1,"objectDate":"20250305-20250418"},{"label":"初创科技型企业","value":"2010202482|108020118","objectName":"初创科技型企业","objectId":"2010202482|108020118","certYear":1,"id":"2010202482|108020118","name":"初创科技型企业","validDate":0,"selfDefine":0,"itemOption":[]}]}]}',
      },
      {
        id: '60256023028480888',
        subName: 'fasdf',
        subPush: false,
        superQueryLogic:
          '{"filters":[{"title":"经营范围","itemId":3,"logic":"any","itemField":"biz_scope","value":["fasdf"]},{"title":"产品","itemId":107,"logic":"any","itemField":"wkg_tags","value":["发送到"]},{"title":"股东-自然人","itemId":5,"logic":"any","itemField":"stockholder_people","value":["fasdf"]}]}',
      },
      {
        id: '60196565806005106',
        subName: 'fasdfasdf',
        subPush: false,
        superQueryLogic:
          '{"filters":[{"field":"data_from","itemId":78,"logic":"any","title":"机构规模","value":["298010000,298020000,298040000"]},{"field":"govlevel","itemId":77,"logic":"any","title":"营业状态","value":["存续"]},{"itemId":3,"logic":"any","value":["汽车"],"title":"经营范围","field":"biz_scope"}]}',
      },
      {
        id: '60196242454526833',
        subName: 'test 2',
        subPush: false,
        superQueryLogic:
          '{"filters":[{"field":"data_from","itemId":78,"logic":"any","title":"机构规模","value":["298010000,298020000,298040000"]},{"field":"govlevel","itemId":77,"logic":"any","title":"营业状态","value":["存续"]},{"itemId":1,"logic":"any","value":["小米"],"title":"企业名称","field":"corp_name"}]}',
      },
      {
        id: '60192741494143855',
        subName: 'test',
        subPush: true,
        superQueryLogic:
          '{"filters":[{"field":"data_from","itemId":78,"logic":"any","title":"机构规模","value":["298010000,298020000,298040000"]},{"field":"govlevel","itemId":77,"logic":"any","title":"营业状态","value":["存续"]},{"itemId":4,"logic":"any","value":["雷军"],"title":"法人姓名","field":"artificial_person"}]}',
      },
    ],
    getCDESubscribeText: (item) => {
      const filters = JSON.parse(item.superQueryLogic).filters
      return `筛选条件: ${filters.map((f: any) => f.value).join(' + ')} | 这是一段很长的描述文本，用来测试组件在长文本情况下的展示效果。可能会出现换行或者省略号等情况。`
    },
  },
}
