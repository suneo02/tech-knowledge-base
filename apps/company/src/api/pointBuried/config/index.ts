import { IBuryPointConfig } from '@/api/pointBuried/config/type.ts'
import { PageModuleEnum } from '@/api/pointBuried/module.ts'
import { filter, flatten, groupBy } from 'lodash'
import { characterTracker } from './character'
import { companyTracker, CorpBuryIdMap } from './company'
import { corpDetailBuryList, corpOverseaBuryList, corpReportBuryList } from './corp'
import { dataExportReviewBuryList } from './DATA_EXPORT_REVIEW/index.ts'
import { featuredTracker } from './featured'
import { frontAndSearchBuryList } from './FrontAndSearch'
import { groupInfoTracker } from './group'
import { KGBuryConfigList } from './KG.ts'
import { qualificationTracker } from './qualification'
import { rankingBuryConfigList } from './ranking'
import { specialTracker } from './special'
import { userBuryConfigList } from './user'
import { vipTracker } from './vip'

/**
 * 埋点的配置
 */
export const BuryCfgList = {
  company: [
    { moduleId: 922602100967, describe: '企业详情实际控制人', currentPage: 'company', opActive: 'click' },
    {
      moduleId: CorpBuryIdMap.OverseaCorp,
      describe: '进入海外企业详情首页',
      currentPage: 'company',
      opActive: 'enter',
    },
  ],
  group: [
    {
      moduleId: 922602100782,
      describe: '进入集团系首页',
      currentPage: 'group',
      opActive: 'enter',
    },
    {
      moduleId: 922602100782,
      describe: '左侧菜单树的操作',
      currentPage: 'group',
      opActive: 'nav',
    },
    {
      moduleId: 922602100782,
      describe: '标签页的操作',
      currentPage: 'group',
      opActive: 'tabs',
    },
  ],
  character: [
    {
      moduleId: 922602100330,
      describe: '进入人物详情首页',
      opActive: 'enter',
    },
    {
      moduleId: 922602100294,
      describe: '左侧菜单树的操作',
      opActive: 'nav',
    },
  ],
}

/**
 * !请勿修改 可以新增
 * 通用埋点列表
 * @author Calvin <yxlu.calvin@wind.com.cn>
 * @param moduleId：一个唯一标识符
 * @param pageId：页面的唯一标识符
 * @param pageName：页面的名称
 * @param describe：对该页面模块的描述
 */
export const commonBuryList: Partial<IBuryPointConfig>[] = [
  ...dataExportReviewBuryList,
  ...rankingBuryConfigList,
  { moduleId: 922602101138, describe: '南京政务平台入口' },
  {
    moduleId: 922602100923,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-银行办理即期结售汇业务',
  },
  {
    moduleId: 922602100924,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-代理国家金库业务',
  },
  {
    moduleId: 922602100925,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-非税收入收缴业务及代理银行资格',
  },
  {
    moduleId: 922602100926,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-进出口企业名录登记',
  },
  {
    moduleId: 922602100927,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-公募基金注册',
  },
  {
    moduleId: 922602100928,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-合格境内机构投资者资格的批复',
  },
  {
    moduleId: 922602100929,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-合格境外机构投资者托管人资格的批复',
  },
  {
    moduleId: 922602100930,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-合格境外投资者批复',
  },
  {
    moduleId: 922602100931,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-基金监管特定客户资产管理业务资格',
  },
  {
    moduleId: 922602100932,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-证券投资咨询业务资格',
  },
  {
    moduleId: 922602100933,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-证券自营业务许可',
  },
  {
    moduleId: 922602100934,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-证券经纪业务许可',
  },
  {
    moduleId: 922602100935,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-证券承销与保荐业务许可',
  },
  {
    moduleId: 922602100936,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-证券资产管理业务许可',
  },
  {
    moduleId: 922602100937,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-证券外资股业务许可',
  },
  {
    moduleId: 922602100938,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-期货监管业务资格',
  },
  {
    moduleId: 922602100939,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-基金销售业务资格许可',
  },
  {
    moduleId: 922602100940,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-基金托管业务资格许可',
  },
  {
    moduleId: 922602100941,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-证券登记结算机构批复',
  },
  {
    moduleId: 922602100942,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-建筑业企业资质',
  },
  {
    moduleId: 922602100943,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-勘查资质',
  },
  {
    moduleId: 922602100944,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-监理资质',
  },
  {
    moduleId: 922602100945,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-设计与施工一体化资质',
  },
  {
    moduleId: 922602100946,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-造价咨询资质',
  },
  {
    moduleId: 922602100947,
    pageId: PageModuleEnum.QUALIFICATION_GUIDE,
    pageName: 'PC-资质大全',
    describe: '资质详情页-设计资质',
  },
  {
    moduleId: 922602100783,
    pageId: PageModuleEnum.VIP_SERVICE,
    pageName: 'VIP服务',
    describe: '进入企业库准备申请试用',
  },
  { moduleId: 922602100784, pageId: PageModuleEnum.VIP_SERVICE, pageName: 'VIP服务', describe: '点击申请按钮申请试用' },
  { moduleId: 922602100785, pageId: PageModuleEnum.VIP_SERVICE, pageName: 'VIP服务', describe: '确认开通试用' },
  {
    moduleId: 922602100786,
    pageId: PageModuleEnum.VIP_SERVICE,
    pageName: 'VIP服务',
    describe: '试用期间点击顶部banner进行付费',
  },
  {
    moduleId: 922602100787,
    pageId: PageModuleEnum.VIP_SERVICE,
    pageName: 'VIP服务',
    describe: '试用期间点击顶部banner完成付费',
  },
  {
    moduleId: 922602100294,
    pageId: PageModuleEnum.CHARACTER_INFO,
    pageName: '公司人物详情',
    describe: '人物详情页-菜单-点击任意菜单进行定位',
  },
  {
    moduleId: 922602100330,
    pageId: PageModuleEnum.CHARACTER_INFO,
    pageName: '公司人物详情',
    describe: '人物详情页-首页',
  },
  {
    moduleId: 922602100836,
    pageId: PageModuleEnum.INVESTIGATION_PLATFORM,
    pageName: '尽调平台',
    describe: '新版企业数据浏览器-首页点击返回旧版',
  },
  {
    moduleId: 922602100837,
    pageId: PageModuleEnum.INVESTIGATION_PLATFORM,
    pageName: '尽调平台',
    describe: '新版企业数据浏览器-首页点击立即搜索',
  },
  {
    moduleId: 922602100838,
    pageId: PageModuleEnum.INVESTIGATION_PLATFORM,
    pageName: '尽调平台',
    describe: '新版企业数据浏览器-结果页点击添加筛选条件',
  },
  {
    moduleId: 922602100839,
    pageId: PageModuleEnum.INVESTIGATION_PLATFORM,
    pageName: '尽调平台',
    describe: '新版企业数据浏览器-结果页点击导出数据',
  },
  {
    moduleId: 922602100840,
    pageId: PageModuleEnum.INVESTIGATION_PLATFORM,
    pageName: '尽调平台',
    describe: '新版企业数据浏览器-结果页点击新增列指标',
  },
  {
    moduleId: 922602100841,
    pageId: PageModuleEnum.INVESTIGATION_PLATFORM,
    pageName: '尽调平台',
    describe: '新版企业数据浏览器-结果页点击企业名称',
  },
  {
    moduleId: 922602100842,
    pageId: PageModuleEnum.INVESTIGATION_PLATFORM,
    pageName: '尽调平台',
    describe: '新版企业数据浏览器-停留时间',
  },
  {
    moduleId: 922602100843,
    pageId: PageModuleEnum.INVESTIGATION_PLATFORM,
    pageName: '尽调平台',
    describe: '新版企业数据浏览器-使用频率',
  },
  {
    moduleId: 922602100875,
    pageId: PageModuleEnum.INVESTIGATION_PLATFORM,
    pageName: '尽调平台',
    describe: '新版企业数据浏览器首页',
  },
  {
    moduleId: 922602100861,
    pageId: PageModuleEnum.COMPANY_ANNUAL_REPORT,
    pageName: '企业年报详情',
    describe: '广告位-企业详情Banner',
  },
  {
    moduleId: 922602100895,
    pageId: PageModuleEnum.COMPANY_ANNUAL_REPORT,
    pageName: '企业年报详情',
    describe: '广告位-企业详情Banner曝光',
  },

  /**
   * @deprecated
   {
   moduleId: 922602100633,
   pageId: PageModuleEnum.COMPANY_DETAILS,
   pageName: '企业详情',
   describe: '终端加载-企业详情-test',
   },
   {
   moduleId: 922602100717,
   pageId: PageModuleEnum.COMPANY_DETAILS,
   pageName: '企业详情',
   describe: '企业详情页-加载医药数据',
   },
   {
   moduleId: 922602100757,
   pageId: PageModuleEnum.COMPANY_DETAILS,
   pageName: '企业详情',
   describe: '企业详情-高管投资-修改持股比例阈值',
   },
   */

  { moduleId: 922602100668, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '搜索-预搜索点击' },
  { moduleId: 922602100669, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '搜索-预搜索' },
  { moduleId: 922602100670, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '搜索-搜索结果点击' },
  { moduleId: 922602100671, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '搜索-热门搜索点击' },
  { moduleId: 922602100672, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '搜索-历史搜索点击' },
  { moduleId: 922602100673, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '搜索-点击搜索' },
  { moduleId: 922602100698, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '关系探查-企业' },
  { moduleId: 922602100699, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '关系探查-人物' },
  { moduleId: 922602100700, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '关系探查-企业-人物' },
  { moduleId: 922602100701, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '关系探查-企业-企业' },
  { moduleId: 922602100702, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '关系探查-人物-人物' },
  { moduleId: 922602100704, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '企业详情页加载' },
  { moduleId: 922602100705, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '0人物详情页加载' },
  { moduleId: 922602100706, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '企业库移动端首页' },
  { moduleId: 922602100719, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '风险查询-裁判文书' },
  { moduleId: 922602100720, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '专利' },
  { moduleId: 922602100722, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '企业详情页-加载医药数据' },
  { moduleId: 922602100723, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '企业详情页-加载股权穿透图' },
  { moduleId: 922602100724, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '企业详情页-加载疑似关系图' },
  { moduleId: 922602100725, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '企业详情页-加载股权结构图' },
  {
    moduleId: 922602100726,
    pageId: PageModuleEnum.MOBILE,
    pageName: '移动端',
    describe: '企业详情页-加载企业受益人图',
  },
  { moduleId: 922602100950, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '万寻地图首页' },
  { moduleId: 922602100951, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '榜单名录首页' },
  { moduleId: 922602100952, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '新增企业首页' },
  { moduleId: 922602100964, pageId: PageModuleEnum.MOBILE, pageName: '移动端', describe: '促销活动-APP首页弹窗点击' },
  {
    moduleId: 922602100965,
    pageId: PageModuleEnum.MOBILE,
    pageName: '移动端',
    describe: '促销活动-APP任一支付页面点击查看活动规则',
  },
  {
    moduleId: 922602100966,
    pageId: PageModuleEnum.MOBILE,
    pageName: '移动端',
    describe: '促销活动-APP任一支付页面点击去支付按钮',
  },
  { moduleId: 922602100357, describe: 'CEL-基础-菜单-点击图谱平台' },
  { moduleId: 922602100634, describe: 'GE-搜索-预搜索点击' },
  { moduleId: 922602100639, describe: 'GE-列表查询-普通列表查询' },
  { moduleId: 922602100640, describe: 'GE-列表查询-高级搜索查询' },
  { moduleId: 922602100641, describe: 'GE-列表查询-批量导出查询' },
  { moduleId: 922602100642, describe: 'GE-列表过滤-状态（结果）' },
  { moduleId: 922602100643, describe: 'GE-列表过滤-类别（案由）' },
  { moduleId: 922602100644, describe: 'GE-列表过滤-比例' },
  { moduleId: 922602100645, describe: 'GE-列表过滤-单位' },
  { moduleId: 922602100646, describe: 'GE-列表过滤-角色' },
  { moduleId: 922602100647, describe: 'GE-列表过滤-报告期' },
  { moduleId: 922602100648, describe: 'GE-列表过滤-图谱过滤' },
  { moduleId: 922602100649, describe: 'GE-详情-明细查看' },
  { moduleId: 922602100650, describe: 'GE-导出-单项导出' },
  { moduleId: 922602100653, describe: 'GE-导出-报告下载(各项)' },
  { moduleId: 922602100654, describe: 'GE-导出-图片保存' },
  { moduleId: 922602100655, describe: 'GE-导出-高级搜索导出' },
  { moduleId: 922602100658, describe: 'GE-删除-收藏' },
  { moduleId: 922602100659, describe: 'GE-删除-监控' },
  { moduleId: 922602100660, describe: 'GE-添加-收藏' },
  { moduleId: 922602100661, describe: 'GE-添加-监控' },
  { moduleId: 922602100667, describe: 'GE-其他-功能相关' },
  { moduleId: 922602100674, describe: 'GEAPP-列表查询-普通列表查询' },
  { moduleId: 922602100675, describe: 'GEAPP-列表查询-高级搜索查询' },
  { moduleId: 922602100676, describe: 'GEAPP-列表查询-批量导出查询' },
  { moduleId: 922602100677, describe: 'GEAPP-列表过滤-状态（结果）' },
  { moduleId: 922602100678, describe: 'GEAPP-列表过滤-类别（案由）' },
  { moduleId: 922602100679, describe: 'GEAPP-列表过滤-比例' },
  { moduleId: 922602100680, describe: 'GEAPP-列表过滤-单位' },
  { moduleId: 922602100681, describe: 'GEAPP-列表过滤-角色' },
  { moduleId: 922602100682, describe: 'GEAPP-列表过滤-报告期' },
  { moduleId: 922602100683, describe: 'GEAPP-列表过滤-图谱过滤' },
  { moduleId: 922602100684, describe: 'GEAPP-列表过滤-过滤' },
  { moduleId: 922602100685, describe: 'GEAPP-详情-明细查看' },
  { moduleId: 922602100686, describe: 'GEAPP-导出-单项导出' },
  { moduleId: 922602100687, describe: 'GEAPP-导出-批量导出' },
  { moduleId: 922602100688, describe: 'GEAPP-导出-批量查询' },
  { moduleId: 922602100689, describe: 'GEAPP-导出-报告下载(各项)' },
  { moduleId: 922602100690, describe: 'GEAPP-导出-图片保存' },
  { moduleId: 922602100691, describe: 'GEAPP-导出-高级搜索导出' },
  { moduleId: 922602100692, describe: 'GEAPP-删除-历史搜索' },
  { moduleId: 922602100693, describe: 'GEAPP-删除-历史浏览' },
  { moduleId: 922602100694, describe: 'GEAPP-删除-收藏' },
  { moduleId: 922602100695, describe: 'GEAPP-删除-监控' },
  { moduleId: 922602100696, describe: 'GEAPP-添加-收藏' },
  { moduleId: 922602100697, describe: 'GEAPP-添加-监控' },
  { moduleId: 922602100703, describe: 'GEAPP-其他-功能相关' },
  { moduleId: 922602100707, describe: 'GE-其他-新闻点击' },
  { moduleId: 922602100708, describe: 'GEAPP-其他-新闻点击' },
  { moduleId: 922602100718, describe: 'GEAPP-基础查询-集团系' },
  { moduleId: 922602100727, describe: 'GE-企业库角色策略' },
  { moduleId: 922602100752, describe: 'GE-链接跳转' },
  { moduleId: 922602100753, describe: 'GE-条件过滤' },
  { moduleId: 922602100754, describe: 'GE-订阅及删除' },
  { moduleId: 922602100756, describe: 'GE-更多条件' },
  { moduleId: 922602100953, describe: '进入全球企业库' },
  ...companyTracker,
  ...corpReportBuryList,
  ...characterTracker,
  ...groupInfoTracker,
  ...vipTracker,
  ...qualificationTracker,
  ...featuredTracker,
  ...specialTracker,
  ...userBuryConfigList,
  ...KGBuryConfigList,
  ...frontAndSearchBuryList,
  ...corpOverseaBuryList,
  ...corpDetailBuryList,
]

/**
 * @author SUNEO
 * 判断是否写重复了 moduleId
 */
const checkCommonBuryList = () => {
  const grouped = groupBy(commonBuryList, 'moduleId')
  const duplicates = filter(grouped, (group) => group.length > 1)
  const flattened = flatten(duplicates)
  if (flattened.length > 0) {
    console.error('~ bury list duplicates', flattened)
  }
  return flattened
}

checkCommonBuryList()
