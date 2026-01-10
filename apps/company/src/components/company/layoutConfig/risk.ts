import { CorpMenuModuleCfg } from '@/types/corpDetail'
import intl from '@/utils/intl'

export const corpDetailRiskMenu: CorpMenuModuleCfg = {
  title: intl('228331', '司法风险'),
  children: [
    {
      countKey: 'judgeinfo_num',
      showModule: 'getcourtdecision',
      showName: intl('138731', '裁判文书'),
    },
    {
      countKey: 'filing_info_num',
      showModule: 'getfilinginfo',
      showName: intl('205388', '立案信息'),
    },
    {
      countKey: 'trialnotice_num',
      showModule: 'getcourtopenannouncement',
      showName: intl('138657', '开庭公告'),
    },
    {
      countKey: 'delivery_anns_num',
      showModule: 'showDeliveryAnnouncement',
      showName: intl('204947', '送达公告'),
    },
    {
      countKey: 'coutnotice_num',
      showModule: 'getcourtannouncement',
      showName: intl('138226', '法院公告'),
    },
    {
      countKey: 'cur_debetor_num',
      showModule: 'getpersonenforced',
      showName: intl('138592', '被执行人'),
    },
    {
      countKey: 'breakpromise_num',
      showModule: 'getdishonesty',
      showName: intl('283600', '失信被执行人'),
    },
    {
      countKey: 'end_case_num',
      showModule: 'getendcase',
      showName: intl('216398', '终本案件'),
    },
    {
      countKey: 'corp_consumption_num',
      showModule: 'getcorpconsumption',
      showName: intl('209064', '限制高消费'),
    },
    {
      countKey: ['frozenShareHoldingsCount', 'frozenShareholderEquityCount'],
      showModule: 'equityfreeze',
      showName: intl('27496', '股权冻结'),
    },
    {
      countKey: 'judicialsaleinfoCount',
      showModule: 'getjudicialsale',
      showName: intl('138359', '司法拍卖'),
    },
    {
      countKey: 'bankruptcyeventCount',
      showModule: 'showBankruptcy',
      showName: intl('216410', '破产重整'),
    },
    {
      countKey: 'bountyAnnouncementCount',
      showModule: 'rewardnotice',
      showName: intl('475356', '悬赏公告'),
    },
    {
      countKey: 'travelRestrictionCount',
      showModule: 'exitrestriction',
      showName: intl('475355', '限制出境'),
    },
    {
      countKey: 'evaluationresultCount',
      showModule: 'getevaluation',
      showName: intl('216400', '询价评估'),
    },
  ],
}
