import { t } from '../../intl'

export const SITE_TITLE_DEFAULT = t('406815', 'Wind全球企业库')

export const PageTitleMap = {
  // 企业API
  EAPIHome: `企业API-${SITE_TITLE_DEFAULT}`,
  // 企业API-全部列表
  EAPIList: `企业API-${SITE_TITLE_DEFAULT}`,
  // 我的API
  MyAPI: `企业API-${SITE_TITLE_DEFAULT}`,
  // 企业API-搜索结果
  EAPISearchResults: `企业API-${SITE_TITLE_DEFAULT}`,
  // 企业API-详情
  APIDetail: `{API名称}-企业API-${SITE_TITLE_DEFAULT}`,
  // 帮助文档
  HelpDocs: `企业API-${SITE_TITLE_DEFAULT}`,
  // 企业详情
  CompanyDetail: `{公司名}-${SITE_TITLE_DEFAULT}`,
  // 企业库首页
  CompanyHome: SITE_TITLE_DEFAULT,
  // 企业库主搜索
  CompanyMainSearch: SITE_TITLE_DEFAULT,
  // 集团系详情
  GroupDetail: `{集团系名称}-${SITE_TITLE_DEFAULT}`,
  // 榜单名录首页
  RankHome: `${t('259148', '企业榜单名录')}-${SITE_TITLE_DEFAULT}`,
  // 榜单名录列表
  RankList: `${t('259148', '企业榜单名录')}-${SITE_TITLE_DEFAULT}`,
  // 榜单名录详情
  RankListDetail: `{榜单名录名称}-${SITE_TITLE_DEFAULT}`,
  // 特色企业-上市企业
  FeaturedListed: `${t('142006', '上市企业')}-${SITE_TITLE_DEFAULT}`,
  // 特色企业-发债企业
  FeaturedBonds: `${t('220263', '发债企业')}-${SITE_TITLE_DEFAULT}`,
  // 特色企业-央企国企
  FeaturedStateOwned: `${t('252985', '央企国企')}-${SITE_TITLE_DEFAULT}`,
  // 特色企业-金融机构
  FeaturedFinance: `${t('314124', '金融机构')}-${SITE_TITLE_DEFAULT}`,
  // 特色企业-PEVC被投企业
  FeaturedPEVC: `${t('265623', 'PEVC被投企业')}-${SITE_TITLE_DEFAULT}`,
  // VIP服务
  VIPServices: `${t('222403', 'VIP服务')}-${SITE_TITLE_DEFAULT}`,
  // 招投标查询
  TenderSearch: `${t('303419', '查招投标')}-${SITE_TITLE_DEFAULT}`,
  // 招投标详情
  TenderDetail: `{招投标公告名称}-${SITE_TITLE_DEFAULT}`,
  // 专利查询
  PatentSearch: `${t('203989', '查专利')}-${SITE_TITLE_DEFAULT}`,
  // 专利详情
  PatentDetail: `{专利名称}-${SITE_TITLE_DEFAULT}`,
  // 商标查询
  TrademarkSearch: `${t('203988', '查商标')}-${SITE_TITLE_DEFAULT}`,
  // 商标详情
  TrademarkDetail: `{商标名称}-${SITE_TITLE_DEFAULT}`,
  // 资质大全首页
  QualificationsHome: `${t('364555', '资质大全')}-${SITE_TITLE_DEFAULT}`,
  // 资质大全详情
  QualificationsDetail: `${t('364555', '资质大全')}-${SITE_TITLE_DEFAULT}`,
  // 招聘查询
  JobSearch: `${t('379753', '查招聘')}-${SITE_TITLE_DEFAULT}`,
  // 招聘详情
  JobDetail: `{公司名}${t('138356', '招聘')}{职位名称}-${SITE_TITLE_DEFAULT}`,
  // 企业数据浏览器-结果列表
  DataBrowserList: `${t('259750', '企业数据浏览器')}-${SITE_TITLE_DEFAULT}`,
  // 企业数据浏览器首页
  DataBrowserHome: `尽调平台-${SITE_TITLE_DEFAULT}`, // 非本项目
  // 批量查询导出
  BulkQueryExport: `${t('208389', '批量查询导出')}-${SITE_TITLE_DEFAULT}`, // 非本项目
  // 企业动态
  CompanyNews: `${t('370254', '企业动态')}-${SITE_TITLE_DEFAULT}`,
  // 开庭公告详情
  CourtNoticeDetail: `{案号}{案由}-${SITE_TITLE_DEFAULT}`,
  // 限制高消费详情
  HighConsumptionRestrictions: `{案号}${t('209064', '限制高消费')}-${SITE_TITLE_DEFAULT}`,
  // 裁判文书详情
  JudgmentDetails: `{案件标题}-${SITE_TITLE_DEFAULT}`,
  // 法院公告详情
  CourtAnnouncementDetails: `{案号}{案由}-${SITE_TITLE_DEFAULT}`,
  // 送达公告详情
  DeliveryNoticeDetails: `{案号}{案由}-${SITE_TITLE_DEFAULT}`,
  // 用户中心-我的账号
  UserCenterAccount: `${t('210156', '用户中心')}-${SITE_TITLE_DEFAULT}`,
  // 用户中心-我的数据
  UserCenterData: `${t('141995', '我的数据')}-${SITE_TITLE_DEFAULT}`,
  // 用户中心-我的订单
  UserCenterOrders: `${t('153389', '我的订单')}-${SITE_TITLE_DEFAULT}`,
  // 用户中心-用户协议
  UserCenterAgreement: `${t('209659', '用户协议')}-${SITE_TITLE_DEFAULT}`,
  // 用户中心-隐私政策
  UserCenterPrivacy: `${t('242146', '隐私政策')}-${SITE_TITLE_DEFAULT}`,
  // 用户中心-免责声明
  UserCenterDisclaimer: `${t('23348', '免责声明')}-${SITE_TITLE_DEFAULT}`,
  UserCenterContact: `${t('26588', '联系我们')}-${SITE_TITLE_DEFAULT}`,
  // 企业详情-舆情
  PublicOpinionDetail: `{公司名}-${t('406816', '企业舆情')}-${SITE_TITLE_DEFAULT}`,
  // 企业详情-企业动态
  CompanyDynamicsDetail: `{公司名}-${t('370254', '企业动态')}-${SITE_TITLE_DEFAULT}`,
  // 企业详情-企业年报详情
  AnnualReportDetail: `{公司名}{年度报告名称}-${SITE_TITLE_DEFAULT}`,
  // 企业详情-APP产品详情
  AppProductDetails: `{APP产品名称}-${SITE_TITLE_DEFAULT}`,
  // 企业详情-标准信息详情
  StandardInfoDetails: `{标准信息名称}-${SITE_TITLE_DEFAULT}`,
  // 报告平台首页
  ReportHome: `报告平台-${SITE_TITLE_DEFAULT}`,
  // 尽职调查报告预览
  DDRPPreview: `${t('421605', '尽职调查报告')}-${SITE_TITLE_DEFAULT}`,
  // 深度信用报告预览 // TODO: 待修改为真实名称
  CreditRPPreview: `${t('421605', '尽职调查报告')}-${SITE_TITLE_DEFAULT}`,
}
export type PageLocation = keyof typeof PageTitleMap
