import { ICorpSubModuleCfg } from '@/components/company/type'
import { ECorpDetailTable } from 'gel-types'
import { intlNoNO as intl } from 'src/utils/intl'

export const corpDetailFinancial: ICorpSubModuleCfg = {
  modelNum: ['assetSheetCount', 'profitSheetCount', 'cashFlowSheetCount'],
}

export const corpDetailFinancialData: ICorpSubModuleCfg = {
  title: intl('2295', '财务报表'),
  numHide: true,
  modelNum: corpDetailFinancial.modelNum,
  children: [
    {
      enumKey: ECorpDetailTable.BalanceSheet,
      modelNum: undefined,
      title: intl('27166', '资产负债表'),
      cmd: 'detail/company/getbalancesheet',
      extraParams: (param) => {
        param.__primaryKey = param.companycode
        return {
          ...param,
        }
      },
      rightFilters: [
        {
          key4sel: 'showControllerCompany_sort',
          isStatic: true,
          key4ajax: 'dataType',
          name: intl('437711', '合并报表'),
          key: '',
          listSort: [
            { key: intl('437711', '合并报表'), value: 1 },
            { key: intl('437712', '合并报表（调整）'), value: 3 },
            { key: intl('437713', '母公司报表'), value: 2 },
            { key: intl('437683', '母公司报表（调整）'), value: 4 },
          ],
        },
      ],
      rightFilterHideWhenEmpty: true,
    },
    {
      enumKey: ECorpDetailTable.ProfitSheet,
      modelNum: undefined,
      title: intl('27167', '利润表'),
      cmd: 'detail/company/getprofit',
      extraParams: (param) => {
        param.__primaryKey = param.companycode
        return {
          ...param,
        }
      },
      rightFilters: [
        {
          key4sel: 'showControllerCompany_sort',
          isStatic: true,
          key4ajax: 'dataType',
          name: intl('437711', '合并报表'),
          key: '',
          listSort: [
            { key: intl('437711', '合并报表'), value: 1 },
            { key: intl('437712', '合并报表（调整）'), value: 3 },
            { key: intl('437713', '母公司报表'), value: 2 },
            { key: intl('437683', '母公司报表（调整）'), value: 4 },
          ],
        },
      ],
      rightFilterHideWhenEmpty: true,
    },
    {
      enumKey: ECorpDetailTable.CashFlowSheet,
      modelNum: undefined,
      title: intl('27168', '现金流表'),
      cmd: 'detail/company/getcashflowsheet',
      extraParams: (param) => {
        param.__primaryKey = param.companycode
        return {
          ...param,
        }
      },
      rightFilters: [
        {
          key4sel: 'showControllerCompany_sort',
          isStatic: true,
          key4ajax: 'dataType',
          name: intl('437711', '合并报表'),
          key: '',
          listSort: [
            { key: intl('437711', '合并报表'), value: 1 },
            { key: intl('437712', '合并报表（调整）'), value: 3 },
            { key: intl('437713', '母公司报表'), value: 2 },
            { key: intl('437683', '母公司报表（调整）'), value: 4 },
          ],
        },
      ],
      rightFilterHideWhenEmpty: true,
    },
  ],
}
