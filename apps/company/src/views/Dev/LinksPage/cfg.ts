import { LinksModule } from '@/handle/link'

export const LinksTableColumns = [
  { title: '公司', dataIndex: 'companyName', links: { idKey: 'companyCode', module: LinksModule.COMPANY } },
  { title: '集团', dataIndex: 'groupName', links: { idKey: 'groupId', module: LinksModule.GROUP } },
  { title: '产品', dataIndex: 'productName', links: { idKey: 'productId', module: LinksModule.PRODUCT } },
  {
    title: '企业数据浏览器',
    dataIndex: 'browserName',
    links: { typeKey: 'browserType', valueKey: 'browserValue', module: LinksModule.DATA_BROWSER },
  },
  {
    title: '风险详情',
    dataIndex: 'riskName',
    links: { idKey: 'riskId', typeKey: 'riskType', module: LinksModule.RISK },
  },
  {
    title: '知识产权',
    dataIndex: 'intellectualName',
    links: {
      idKey: 'intellectualId',
      typeKey: 'intellectualType',
      extraTypeKey: 'intellectualExtraType',
      module: LinksModule.INTELLECTUAL,
    },
  },
  { title: '榜单名录', dataIndex: 'feturedName', links: { idKey: 'feturedId', module: LinksModule.FEATURED } },
]
