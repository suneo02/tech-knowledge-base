import { TIntl } from '@/types'
import { TCorpDetailSubModule } from 'gel-types'

/**
 * @param t
 * @returns
 */
export const getRiskTagCfg = (t: TIntl) => {
  const map: Record<string, { name: string; jumpType?: TCorpDetailSubModule }> = {
    BANKRUPTCY_REORGANIZATION: {
      name: t('216410', '破产重整'),
      jumpType: 'showBankruptcy',
    },
    DISHONEST_PERSON: {
      name: t('283600', '失信被执行人'),
      jumpType: 'getdishonesty',
    },
    HIGH_CONSUMPTION_RESTRICTION: {
      name: t('209064', '限制高消费'),
      jumpType: 'getcorpconsumption',
    },
    END_CASE: {
      name: t('216398', '终本案件'),
      jumpType: 'getendcase',
    },
    SERIOUS_VIOLATION: {
      name: t('138335', '严重违法'),
      jumpType: 'getillegal',
    },
    TAX_ARREARS: {
      name: t('138424', '欠税信息'),
      jumpType: 'getowingtax',
    },
    TAX_VIOLATION: {
      name: t('138533', '税收违法'),
      jumpType: 'gettaxillegal',
    },
    ABNORMAL_OPERATION: {
      name: t('138568', '经营异常'),
      jumpType: 'getoperationexception',
    },
    VIOLATION_PUNISH: {
      name: t('118780', '诚信信息'),
      jumpType: 'showViolationsPenalties',
    },
    SUSPECTED_SHELL_COMPANY: {
      name: t('413153', '疑似空壳企业'),
      // jumpType: 'showViolationsPenalties',// TODO: 浏览器没有加筛选项，所以先不跳
    },
    SUSPECTED_SHELL_GROUP: {
      name: t('413173', '疑似空壳团伙'),
      // jumpType: 'showViolationsPenalties',// TODO: 浏览器没有加筛选项，所以先不跳
    },
  }
  return map
}
