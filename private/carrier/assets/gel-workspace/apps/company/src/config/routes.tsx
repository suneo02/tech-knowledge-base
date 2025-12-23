/** @format */

import { usedInClient } from 'gel-util/env'
import { isStaging } from '../utils/env'
import { ErrorPage, NotFound } from '../views/404'
import asyncComponent from './AsyncComponent'

const GameapprovalDetail = asyncComponent(() => import('../views/GameapprovalDetail'))
const Home = asyncComponent(() => import('../views/Home'))
const FilterRes = asyncComponent(() => import('../views/FilterRes'))
const QueryEnterpriseInOneSentence = asyncComponent(() => import('../views/QueryEnterpriseInOneSentence'))
const QueryDetailEnterpriseInOneSentence = asyncComponent(() => import('../views/QueryDetailEnterpriseInOneSentence'))
const FindCustomer = asyncComponent(() => import('../views/FindCustomer'))
const RankList = asyncComponent(() => import('../views/RankingList'))
const GroupSearchList = asyncComponent(() => import('../views/groupSearchList'))
const PersonSearchList = asyncComponent(() => import('../views/personSearchList'))
const IntelluctalSearch = asyncComponent(() => import('../views/IntellectualSearch/intelluctalSearch'))
const BidSearchList = asyncComponent(() => import('../views/BidSearch/bidSearchList'))
const RankingListTree = asyncComponent(() => import('../views/RankingListTree'))
const CompanyDetailEntry = asyncComponent(() => import('../views/CompanyDetailEntry'))
const CompanyDetail = asyncComponent(() => import('../views/CompanyDetail'))
const CompanyDetailAIRight = asyncComponent(() => import('../views/CompanyDetailAIRight'))
const CompanyHome = asyncComponent(() => import('../views/CompanyHome'))
const RankListDetail = asyncComponent(() => import('../views/RankingListDetail'))
const LawDetail = asyncComponent(() => import('../views/lawDetail'))
const SearchJob = asyncComponent(() => import('../views/SearchJob/SearchJob'))
const SearchBidNew = asyncComponent(() => import('../views/SearchBidNew/SearchBidNew'))
const PatentDetail = asyncComponent(() => import('../views/singleDetail/patentDetail/patentDetail'))
const QualificationsIndex = asyncComponent(() => import('../views/Qualifications/index'))
const QualificationsDetail = asyncComponent(() => import('../views/Qualifications/detail'))
const BankingWorkbench = asyncComponent(() => import('../views/BankingWorkbench'))
const EvaluationDetail = asyncComponent(() => import('../views/EvaluationDetail'))
const StandardInfoDetail = asyncComponent(() => import('../views/StandardInfoDetail'))
const AnnualReportDetail = asyncComponent(() => import('../views/AnnualReportDetail'))
const BiddingDetail = asyncComponent(() => import('../views/BiddingDetail'))
const LogoDetail = asyncComponent(() => import('../views/LogoDetail'))
const JobDetail = asyncComponent(() => import('../views/Job/jobDetail')) // 招聘详情
const ProductDetail = asyncComponent(() => import('../views/ProductDetail')) // 产品详情

const AtlasPlatform = asyncComponent(() => import('../views/AtlasPlatform')) // 图谱平台首页
const Company = asyncComponent(() => import('@/views/Company')) // 图谱平台首页
const SearchPlatform = asyncComponent(() => import('../views/SearchPlatform')) // 搜索平台
const SearchHome = asyncComponent(() => import('../views/HomeAI')) // 企业库首页
const HomeAI = asyncComponent(() => import('../views/HomeAI')) // 企业库首页
const GlobalSearch = asyncComponent(() => import('../views/GlobalSearch/index')) // 企业库首页
const feturedcompany = asyncComponent(() => import('../views/Fetured/feturedcompany')) // 榜单名录详情页
const feturedlist = asyncComponent(() => import('../views/Fetured/feturedlist')) // 榜单名录列表页
const CompanyDynamic = asyncComponent(() => import('../views/CompanyDynamic/CompanyDynamic')) // 企业动态&收藏
const SpecialAppList = asyncComponent(() => import('../views/SpecialAppList'))
const SingleCompanyDynamic = asyncComponent(() => import('../views/SingleCompanyDynamic')) // 单个企业动态
const VersionPriceDomestic = asyncComponent(() => import('../views/VersionPriceDomestic')) // VIP服务页
const VersionPriceOversea = asyncComponent(() => import('../views/VersionPriceOversea')) // VIP服务页

const RelatedLinks = asyncComponent(() => import('../views/RelatedLinks/index')) // 友情链接
const InnerLinks = asyncComponent(() => import('../views/RelatedLinks/index')) // 内链

const Customer = asyncComponent(() => import('../views/Customer')) // 用户中心
const GQCTChart = asyncComponent(() => import('../views/Charts/SingleGraph/singleShareInvest')) // 股权穿透图

const RelateChart = asyncComponent(() => import('../views/Charts/RelateChart')) // 关联方图谱
const ActCtrlChart = asyncComponent(() => import('../views/Charts/ActCtrlChart')) // 实控人图谱
const BeneficialChart = asyncComponent(() => import('../views/Charts/BeneficialChart')) // 受益人图谱

const CompanyMap = asyncComponent(() => import('../views/Charts/CompanyMap/index')) // 企业图谱

const Group = asyncComponent(() => import('../views/Group/Group'))
const Character = asyncComponent(() => import('../views/Character'))
const CompanyNews = asyncComponent(() => import('../components/company/CompanyNews')) // 新闻舆情

const LinksPageTest = asyncComponent(() => import('../views/Dev/LinksPage'))
const TagsPageTest = asyncComponent(() => import('../views/Dev/TagsPage'))

const Report = asyncComponent(() => import('../views/Report'))
const ReportInfo = asyncComponent(() => import('../views/Report/ReportInfo'))

const AuthCheck = asyncComponent(() => import('../views/AuthCheck')) // 南京政务平台身份校验
const Charts = asyncComponent(() => import('../views/Charts')) // 图谱平台

const IcLayout = asyncComponent(() => import('../views/IcLayout')) // 集成电路布图
const AiCharts = asyncComponent(() => import('../views/AICharts')) // AI图谱平台

const UserNoteTextCN = asyncComponent(() => import('../views/Customer/UserNote/cn')) // 用户协议cn，抽离出单独路由可直接用于windzx/app等其他场景进行展示
const UserNoteTextEN = asyncComponent(() => import('../views/Customer/UserNote/en')) // 用户协议en，抽离出单独路由可直接用于windzx/app等其他场景进行展示

export const routes = [
  {
    path: '/annualReportDetail',
    component: AnnualReportDetail,
  },
  {
    path: '/agreementCN',
    component: UserNoteTextCN,
  },
  {
    path: '/agreementEN',
    component: UserNoteTextEN,
  },
  {
    path: '/reportInfo',
    component: ReportInfo,
  },
  // 非终端模式
  ...(usedInClient()
    ? []
    : [
        {
          path: '/authCheck',
          component: AuthCheck,
        },
      ]),
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/',
        component: CompanyDetailEntry,
        exact: true,
      },

      {
        path: '/companyDetailAIRight',
        component: CompanyDetailAIRight,
      },
      {
        // new 全球企业搜索
        path: '/globalSearch',
        component: GlobalSearch,
        exact: true,
      },
      {
        // new reports
        path: '/report',
        component: Report,
        exact: true,
      },
      {
        path: '/companyHome',
        component: CompanyHome,
        exact: true,
      },
      {
        path: '/home',
        component: FindCustomer,
      },
      {
        path: '/findCustomer',
        component: FindCustomer,
      },

      {
        path: '/qualifications',
        component: QualificationsIndex,
      },
      {
        path: '/companyDynamic',
        component: CompanyDynamic,
      },
      {
        path: '/singleCompanyDynamic',
        component: SingleCompanyDynamic,
      },
      {
        path: '/qualificationsDetail',
        component: QualificationsDetail,
      },
      {
        path: '/feturedcompany',
        component: feturedcompany,
      },
      {
        // 这个才是正确的，之前的feturedcompany是错的 add by Calvin
        path: '/featuredcompany',
        component: feturedcompany,
      },
      {
        path: '/feturedlist',
        component: feturedlist,
      },
      {
        // 这个才是正确的，之前的feturedlist是错的 add by Calvin
        path: '/featuredlist',
        component: feturedlist,
      },
      {
        path: '/rankList',
        component: RankList,
      },
      {
        path: '/rankingListTree',
        component: RankingListTree,
      },
      {
        path: '/rankListDetail',
        component: RankListDetail,
      },
      {
        path: '/filterRes',
        component: FilterRes,
      },
      {
        path: '/queryEnterpriseInOneSentence',
        component: QueryEnterpriseInOneSentence,
      },
      {
        path: '/queryDetailEnterpriseInOneSentence',
        component: QueryDetailEnterpriseInOneSentence,
      },
      {
        path: '/searchList',
        component: GlobalSearch,
      },
      {
        path: '/personSearchList',
        component: PersonSearchList,
      },
      {
        path: '/groupSearchList',
        component: GroupSearchList,
      },
      {
        path: '/intelluctalSearch',
        component: IntelluctalSearch,
      },
      {
        path: '/bidSearchList',
        component: BidSearchList,
      },
      {
        path: '/outCompanySearch',
        component: GlobalSearch,
      },
      {
        path: '/companyDetail',
        component: CompanyDetailEntry,
      },
      {
        path: '/biddingInfo',
        component: CompanyDetail,
      },
      {
        path: '/lawdetail',
        component: LawDetail,
      },
      {
        path: '/biddingdetail',
        component: BiddingDetail,
      },
      {
        path: '/searchJob',
        component: SearchJob,
      },
      {
        path: '/searchBidNew',
        component: SearchBidNew,
      },
      {
        path: '/gameapproval',
        component: GameapprovalDetail,
      },
      {
        path: '/patentDetail',
        component: PatentDetail,
      },
      {
        path: '/evaluationDetail',
        component: EvaluationDetail,
      },
      {
        path: '/logoDetail',
        component: LogoDetail,
      },
      {
        path: '/jobDetail',
        component: JobDetail,
      },
      {
        path: '/productDetail',
        component: ProductDetail,
      },
      {
        path: '/newGroup',
        component: Group,
      },
      {
        path: '/character',
        component: Character,
      },
      {
        path: '/newCompany',
        component: Company,
      },
      {
        path: '/linksPageTest',
        component: LinksPageTest,
      },
      {
        path: '/tagsPageTest',
        component: TagsPageTest,
      },

      {
        path: '/standardInfoDetail',
        component: StandardInfoDetail,
      },
      {
        path: '/bgroup',
        component: Group,
      },
      {
        path: '/atlasplatform',
        component: AtlasPlatform,
      },
      {
        path: '/searchPlatform/:id',
        component: SearchPlatform,
      },
      {
        path: '/homeAI',
        component: HomeAI,
      },
      {
        path: '/searchHome',
        component: SearchHome,
      },
      {
        path: '/bankingWorkbench',
        component: BankingWorkbench, // bank
      },
      {
        path: '/specialAppList',
        component: SpecialAppList,
      },
      {
        path: '/versionPrice',
        component: VersionPriceDomestic, // bank
      },
      {
        path: '/versionPriceOversea',
        component: VersionPriceOversea, // bank
      },
      {
        path: '/relatedlinks',
        component: RelatedLinks, // 友链
      },
      {
        path: '/innerLinks',
        component: InnerLinks, // 内链
      },
      {
        path: '/CompanyNews',
        component: CompanyNews, // 新闻舆情
      },
      {
        path: '/customer',
        component: Customer, // 友链
      },
      {
        path: '/gqctChart',
        component: GQCTChart,
      },
      {
        path: '/glgxChart',
        component: RelateChart,
      },
      {
        path: '/actCtrlChart',
        component: ActCtrlChart,
      },
      {
        path: '/beneficialChart',
        component: BeneficialChart,
      },
      {
        path: '/companyMap',
        component: CompanyMap,
      },
      {
        path: '/graph',
        component: Charts,
      },
      {
        path: '/icLayout',
        component: IcLayout,
      },
      {
        path: '/aiGraph',
        component: AiCharts,
      },
      {
        path: '*',
        component: NotFound,
      },
    ],
  },
]

// 加载出错页面
export const errorRoute = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/',
        component: ErrorPage,
      },
    ],
  },
]

// 招投标查询
export const searchBidRoutes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/',
        component: SearchBidNew,
        exact: true,
      },
      {
        path: '/searchBidNew',
        component: SearchBidNew,
      },
      {
        path: '*',
        component: NotFound,
      },
    ],
  },
]

// 企业详情
export const companyRoutes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/',
        component: Company,
        exact: true,
      },
      {
        path: '/companyDetail',
        component: Company,
      },
      {
        path: '/biddingInfo',
        component: Company,
      },
      {
        path: '*',
        component: NotFound,
      },
    ],
  },
]

// 搜索
export const searchHomeRoutes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/',
        component: GlobalSearch,
        exact: true,
      },
      {
        path: '/searchList',
        component: GlobalSearch,
      },
      {
        path: '/personSearchList',
        component: PersonSearchList,
      },
      {
        path: '/groupSearchList',
        component: GroupSearchList,
      },
      {
        path: '/intelluctalSearch',
        component: IntelluctalSearch,
      },
      {
        path: '/bidSearchList',
        component: BidSearchList,
      },
      {
        path: '/outCompanySearch',
        component: GlobalSearch,
      },
      {
        path: '*',
        component: NotFound,
      },
    ],
  },
]

// 数据浏览器
export const browserRoutes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/',
        component: FindCustomer,
        exact: true,
      },
      {
        path: '/findCustomer',
        component: FindCustomer,
      },
      {
        path: '/filterRes',
        component: FilterRes,
      },
      {
        path: '*',
        component: NotFound,
      },
    ],
  },
]

// 投行工作台
export const bankWorkBenchRoutes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/',
        component: BankingWorkbench, // bank
        exact: true,
      },
      {
        path: '/searchList',
        component: GlobalSearch,
      },
      {
        path: '/companyDetail',
        component: Company,
      },
      {
        path: '/filterRes',
        component: FilterRes,
      },
      {
        path: '/findCustomer',
        component: FindCustomer,
      },
      {
        path: '*',
        component: NotFound,
      },
    ],
  },
]

// 投行工作台
export const groupRoutes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/',
        component: Group, // bank
        exact: true,
      },
      {
        path: '/group',
        component: Group,
      },
      {
        path: '*',
        component: NotFound,
      },
    ],
  },
]

// 首页
export const homeTempRoutes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/',
        component: SearchHome,
        exact: true,
      },
      {
        path: '/searchList',
        component: GlobalSearch,
      },
      {
        path: '/companyDetail',
        component: Company,
      },
      {
        path: '*',
        component: NotFound,
      },
    ],
  },
]
