import { LinksModule } from '@/handle/link'

/**
 * @typedef LinksData
 * @property {string} title - 链接的标题
 * @property {string} id - 模块 id
 * @property {LinksModule} module - 链接所属的模块
 */
export const LinksOtherData = [
  {
    title: '企业数据浏览器-搜索筛选',
    type: '产品',
    module: LinksModule.DATA_BROWSER,
  },
  {
    title: '万寻地图',
  },
  {
    title: '企业年报',
    params: {
      companyCode: 1035946278,
      year: 2020,
    },
    module: LinksModule.ANNUAL_REPORT,
  },
  {
    title: '企业动态',
    module: LinksModule.COMPANY_DYNAMIC,
    params: {
      companycode: 1047934153,
      companyname: '小米科技有限责任公司',
    },
  },
]
