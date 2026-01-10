/**
 * 变体配置：定义境内/境外企业的指标集合、特性与表格默认配置。
 * @author yxlu.calvin
 * @example
 * const label = financialVariants.domestic.label
 * const metrics = financialVariants.domestic.metricSets.profit
 */
import {
  listedBondIssuerProfitStatement,
  listedBondIssuerBalanceSheet,
  listedBondIssuerCashFlowStatement,
  overseasCompanyProfitStatement,
  overseasCompanyBalanceSheet,
  overseasCompanyCashFlowStatement,
} from './validatedMetrics'
import { t } from 'gel-util/intl'

const STRINGS = {
  DOMESTIC: t('472874', '境内财报'),
  OVERSEAS: t('472878', '境外财报'),
} as const

export const financialVariants = {
  domestic: {
    id: 'domestic',
    label: STRINGS.DOMESTIC,
    metrics: [],
    metricSets: {
      balance: listedBondIssuerBalanceSheet,
      profit: listedBondIssuerProfitStatement,
      cash: listedBondIssuerCashFlowStatement,
    },
    features: ['scenario-switching', 'unit-scaling'],
    table: {
      defaultUnit: 'TEN_THOUSAND',
      groupHeaders: true,
    },
  },
  overseas: {
    id: 'overseas',
    label: STRINGS.OVERSEAS,
    metrics: [],
    metricSets: {
      balance: overseasCompanyBalanceSheet,
      profit: overseasCompanyProfitStatement,
      cash: overseasCompanyCashFlowStatement,
    },
    features: ['unit-scaling'],
    table: {
      defaultUnit: 'TEN_THOUSAND',
      groupHeaders: true,
    },
  },
} as const
