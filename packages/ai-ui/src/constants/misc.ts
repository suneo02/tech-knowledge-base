import { WX_WIND_HOST } from 'gel-util/link'

export const AES_KEY = 'alice+#!6z]J3@6+'

export const ASSETS_HOST = 'https://wx.wind.com.cn/unitedweb/JWindSearch/static/alice/'
export const MOBLIE_ASSETS_HOST = 'https://appcdn.wind.com.cn/MobWindSearch/mobileweb/assets/imgs/alicewx/'
// export const WIND_3C_LIVE_HOST = 'https://peacalltest.wind.com.cn'; //测试站
export const WIND_3C_LIVE_HOST = 'https://3c.wind.com.cn' //主站

export const forbiddenMsg = '您暂无使用该功能的权限，请联系客服咨询。'
export const baseUrl = 'https://wx.wind.com.cn/Wind.WFC.Enterprise.Web/PC.Front/h5/mobile/'

// 旧版，新版稳定后废弃
// export const pathGel = 'ai/index.html#'
// export const pathBaifen = 'baifen/h5/index.html#'

export const pathGel = 'baifen/new/index.html#' // 新版融合中 未稳定
export const pathBaifen = 'baifen/new/index.html#' // 新版融合中 未稳定

export const H5_HOST = baseUrl + pathGel

export const useAliceApi = false

export const demoUserInfo = {
  userType: '5',

  accountID: 6352598,

  wsid: '5960e582caa94d70b49002a5b1a66e4a',
  openId: 'oIDdR5X4BglXmNyOgrcJ9htOPqcY',
  loginStatus: 0,
  message: 'Login Succeed',
  userId: 0,
  isSucceed: true,
}

const isTest = false //  切换测试环境

export const demoChatId = '99d3dc4b-05f2-463f-89a2-1f1e64b79583'
export const windSessionId = '81b632f9656b4fb09632fc9d0f1ef467'
export const IP = `https://${WX_WIND_HOST}`

export const testIp = 'https://test.wind.com.cn'

export const chartIp = `https://${WX_WIND_HOST}`

export const GelIp = isTest ? testIp : 'https://gel.wind.com.cn'

export const devIp = isTest ? testIp : IP

export const demoOpenId = 'onB370IMOHrzSeKGA-MZBVzD47i4' //
export const FirstAnswer = `Hi，我是您的商业数据查询智能助手，很高兴认识你！你可以向我提问，问题越详细，答案越准确！` //

export const mockData = [
  {
    title: '央企在贵州的子公司',
    content: '央企在贵州的子公司', // 新增的content属性，值与title相同
  },
  {
    title: '小米科技的团队结构',
    content: '小米科技的团队结构  ', // 新增的content属性，值与title相同
  },
  {
    title: '小米科技正在招聘的职位',
    content: '小米科技正在招聘的职位', // 新增的content属性，值与title相同
  },
  {
    title: '西安弗迪电池有限公司属于比亚迪系吗',
    content: '西安弗迪电池有限公司属于比亚迪系吗  ', // 新增的content属性，值与title相同
  },
  {
    title: '小米科技今年新增了哪些专利',
    content: '小米科技今年新增了哪些专利', // 新增的content属性，值与title相同
  },
]

export const agentType = {
  relation: '查关系', //查关系
  contact: '企业触达', //企业触达
  dueDiligenceReport: '尽职调查报告', //尽职调查
  scienceReport: '科创能力报告', //科创能力
  bankCreditReport: '银行授信报告', //银行授信
  equityPiercing: '股权穿透', //股权穿透
  relatedParty: '关联方认定', //关联方认定
}

export const ShareImageUrl = `${testIp}/Wind.WFC.Enterprise.Web/PC.Front/resource/static/minishare@2x.png`

export const APP_PLATFORM = {
  MINI: 'S72',
}
