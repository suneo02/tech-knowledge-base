/** @format */
import { CorpPrimaryModuleCfg } from '@/types/corpDetail'
import { intlNoNO as intl } from 'src/utils/intl'
import { wftCommon } from '../../utils/utils'

export const PublishFundData: CorpPrimaryModuleCfg = {
  moduleTitle: {
    title: intl('39902', '基金数据'),
    moduleKey: 'PublishFundData', //  与左侧大菜单齐名
    noneData: intl('348954', '暂无基金数据'),
  },
  showFundSize: {
    title: intl('37109', '基金规模'),
    modelNum: undefined,
  },
  showItsFunds: {
    title: intl('11546', '旗下基金'),
    cmd: '/detail/company/getallpublicchildfunds',
    modelNum: undefined,
    extraParams: (param) => {
      return {
        ...param,
        __primaryKey: param.companycode,
      }
    },
    thWidthRadio: ['5.2%', '10%', '21%', '18%', '15%', '16%', '16%'],
    thName: [
      intl('28846', '序号'),
      intl('20591', '基金代码'),
      intl('7996', '基金名称'),
      intl('33222', '基金类型'),
      intl('2823', '成立日期'),
      intl('19316', '最新资产净值(亿元)'),
      intl('25629', '近一年收益率'),
    ],
    align: [1, 0, 0, 0, 0, 2, 2],
    fields: ['NO.', 'windCode', 'secName', 'investType', 'fundDate', 'fundScale', 'incRateOfYear1'],
    columns: [
      null,
      {
        render: (txt, row) => {
          if (txt && row.windCode) {
            return wftCommon.linkF9(txt, row, ['', 'windCode'])
          }
        },
      },
      {
        render: (txt, row) => {
          if (txt && row.windCode) {
            return wftCommon.linkF9(txt, row, ['', 'windCode'])
          }
        },
      },
      null,
      null,
      {
        render: (txt, _row) => {
          return txt ? wftCommon.formatMoney(txt, [4, ' ']) : '--'
        },
      },
      {
        render: (txt, _row) => {
          if (!txt) return '--'
          if (txt > 0) {
            return <span style={{ color: '#b30006' }}> {'+' + wftCommon.formatPercent(txt)} </span>
          } else if (txt < 0) {
            return <span style={{ color: '#00ab3f' }}> {wftCommon.formatPercent(txt)} </span>
          }
          return wftCommon.formatPercent(txt)
        },
      },
    ],
  },
}
