/* eslint-disable @typescript-eslint/no-unused-vars */
import Links from '@/components/common/links/Links.tsx'
import { RightGotoLink } from '@/components/common/RightGotoLink/index.tsx'
import CompanyLink from '@/components/company/CompanyLink.tsx'
import { DetailLink, RimeDataLink } from '@/components/company/corpCompMisc.tsx'
import { LinkByRowCompatibleCorpPerson } from '@/components/company/link/CorpOrPersonLink.tsx'
import { ICorpPrimaryModuleCfg } from '@/components/company/type/index.ts'
import { InfoCircleButton } from '@/components/icons/InfoCircle/index.tsx'
import { vipDescDefault } from '@/handle/corpModuleCfg/common/vipDesc.ts'
import { BaiFenSites, LinksModule } from '@/handle/link'
import { formatCurrency } from '@/utils/common.ts'
import { getLocale, intlNoNO as intl } from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { Tooltip } from '@wind/wind-ui'
import React from 'react'
import { corpDetailBankCredit } from './bankCredit.ts'
import { corpDetailChattelMortgage } from './chattelMortgage.ts'

/**
 * 金融行为 需要 vip
 */
export const finance: ICorpPrimaryModuleCfg = {
  moduleTitle: {
    title: intl('261899', '金融行为'),
    moduleKey: 'financing', // 与左侧大菜单齐名
    noneData: intl('348935', '暂无金融行为'),
  },
  showShares: {
    title: intl('451226', '发行股票'),
    modelNum: 'sharedstock_num_new',
    notVipTitle: intl('451226', '发行股票'),
    notVipTips: '购买企业套餐，即可查看该企业发行股票信息',
    children: [
      {
        numHide: true,
        cmd: 'detail/company/getsharedstockinfoMrs',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        modelNum: undefined,
        thWidthRadio: ['5.2%', '10%', '10%', '16%', '10%', '20%', '10%', '10%', '10%'],
        thName: [
          intl('28846', '序号'),
          intl('451227', '股票简称'),
          intl('6440', '股票代码'),
          intl('451228', '交易所'),
          intl('451211', '上市板块'),
          intl('138712', '当前流通市值'),
          intl('138899', '收盘价'),
          intl('451229', '涨跌幅'),
          intl('273669', '更新日期'),
        ],
        align: [1, 0, 0, 0, 0, 2, 2, 2, 0, 0],
        fields: [
          'NO.',
          'name',
          'windCode',
          'tradeBoard',
          'listedBoard|formatCont',
          'tradeMarketValue|formatMoney',
          'closingPrice|formatMoney',
          'change',
          'updateTime|formatTime',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              return wftCommon.linkF5(txt, row, ['', 'windCode'])
            },
          },
          {
            render: (txt, row) => {
              return wftCommon.linkF5(txt, row, ['', 'windCode'])
            },
          },
          null,
          null,
          {
            title: (
              <span>
                {intl('138712', '当前流通市值')}
                {
                  <Tooltip
                    overlayClassName="corp-tooltip"
                    title={
                      <div>
                        {(window.en_access_config ? '1. ' : '1、') +
                          intl(
                            '437671',
                            `当前发行数量 = 证券发行总数，包含限售股，以及其他市场流通的DR对应的股份数量 `
                          )}
                        <br />
                        {(window.en_access_config ? '2. ' : '2、') +
                          intl('88048', '当前流通市值 = 当前发行数量 × 最新收盘价')}
                      </div>
                    }
                  >
                    <InfoCircleButton />
                  </Tooltip>
                }
              </span>
            ),
            render: (_txt, row) => {
              return wftCommon.formatMoneyComma(row.tradeMarketValue) + (row.marketValueCurrency || '')
            },
          },
          {
            render: (_txt, row) => {
              if (!row.closingPrice) return '--'
              return wftCommon.formatMoneyTemp(row.closingPrice, [2, ' '])
            },
          },
          {
            render: (txt) => {
              if (!txt) return '--'
              if (txt > 0) {
                return <span style={{ color: '#b30006' }}> {'+' + wftCommon.formatPercent(txt)} </span>
              } else if (txt < 0) {
                return <span style={{ color: '#00ab3f' }}> {wftCommon.formatPercent(txt)} </span>
              }
              return wftCommon.formatPercent(txt)
            },
          },
          null,
        ],
        dataCallback: (res) => {
          // 数据返回后是否要做单独的逻辑处理
          if (!res || !res.length) return []
          const newRes = []
          res.map((t) => {
            if (t.securityType !== '存托凭证') {
              newRes.push(t)
            }
          })
          return newRes
        },
      },
      {
        modelNum: undefined,
        cmd: '/detail/company/getsharedstockinfoMrs',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        thWidthRadio: ['5.2%', '10%', '10%', '16%', '10%', '20%', '10%', '10%', '10%'],
        thName: [
          intl('28846', '序号'),
          intl('451230', 'DR简称'),
          intl('73736', 'DR代码'),
          intl('451228', '交易所'),
          intl('451211', '上市板块'),
          intl('73741', 'DR市值'),
          intl('138899', '收盘价'),
          intl('451229', '涨跌幅'),
          intl('273669', '更新日期'),
        ],
        align: [1, 0, 0, 0, 0, 2, 2, 2, 0, 0],
        fields: [
          'NO.',
          'name',
          'windCode',
          'tradeBoard',
          'listedBoard|formatCont',
          'tradeMarketValue|formatMoney',
          'closingPrice|formatMoney',
          'change',
          'updateTime|formatTime',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              return wftCommon.linkF5(txt, row, ['', 'windCode'])
            },
          },
          {
            render: (txt, row) => {
              return wftCommon.linkF5(txt, row, ['', 'windCode'])
            },
          },
          null,
          null,
          {
            title: (
              <span>
                {intl('73741', 'DR市值')}
                {
                  <Tooltip
                    overlayClassName="corp-tooltip"
                    title={
                      <div>
                        {(window.en_access_config ? '1. ' : '1、') +
                          intl(
                            '437671',
                            `当前发行数量 = 证券发行总数，包含限售股，以及其他市场流通的DR对应的股份数量 `
                          )}
                        <br />
                        {(window.en_access_config ? '2. ' : '2、') + intl('88049', 'DR市值 = DR数量 × DR最新收市价')}
                      </div>
                    }
                  >
                    <InfoCircleButton />
                  </Tooltip>
                }
              </span>
            ),
            render: (_txt, row) => {
              return wftCommon.formatMoneyComma(row.tradeMarketValue) + (row.marketValueCurrency || '')
            },
          },
          {
            render: (_txt, row) => {
              if (!row.closingPrice) return '--'
              return wftCommon.formatMoneyTemp(row.closingPrice, [2, ' '])
            },
          },
          {
            render: (txt) => {
              if (!txt) return '--'
              if (txt > 0) {
                return <span style={{ color: '#b30006' }}> {'+' + wftCommon.formatPercent(txt)} </span>
              } else if (txt < 0) {
                return <span style={{ color: '#00ab3f' }}> {wftCommon.formatPercent(txt)} </span>
              }
              return wftCommon.formatPercent(txt)
            },
          },
          null,
        ],
        numHide: true,
        dataCallback: (res) => {
          // 数据返回后是否要做单独的逻辑处理
          if (!res || !res.length) return []
          const newRes = []
          res.map((t) => {
            if (t.securityType == '存托凭证') {
              newRes.push(t)
            }
          })
          return newRes
        },
      },
    ],
  },
  // 最新需求，针对运营主体or上市主体 发行股票
  showSharesOther: {
    title: intl('451226', '发行股票'),
    modelNum: 'listedSubjectSharesCount',
    notVipTitle: intl('451226', '发行股票'),
    notVipTips: '购买企业套餐，即可查看该企业发行股票信息',
    children: [
      {
        modelNum: undefined,
        numHide: true,
        cmd: 'detail/company/getListSubjectStockInfo',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        thWidthRadio: ['5.2%', '10%', '10%', '16%', '10%', '20%', '10%', '10%', '10%'],
        thName: [
          intl('28846', '序号'),
          intl('451227', '股票简称'),
          intl('6440', '股票代码'),
          intl('451228', '交易所'),
          intl('451211', '上市板块'),
          intl('138712', '当前流通市值'),
          intl('138899', '收盘价'),
          intl('451229', '涨跌幅'),
          intl('273669', '更新日期'),
        ],
        align: [1, 0, 0, 0, 0, 2, 2, 2, 0, 0],
        fields: [
          'NO.',
          'name',
          'windCode',
          'tradeBoard',
          'listedBoard|formatCont',
          'tradeMarketValue|formatMoney',
          'closingPrice|formatMoney',
          'change',
          'updateTime|formatTime',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              return wftCommon.linkF5(txt, row, ['', 'windCode'])
            },
          },
          {
            render: (txt, row) => {
              return wftCommon.linkF5(txt, row, ['', 'windCode'])
            },
          },
          null,
          null,
          {
            title: (
              <span>
                {intl('138712', '当前流通市值')}
                {
                  <Tooltip
                    overlayClassName="corp-tooltip"
                    title={
                      <div>
                        {(window.en_access_config ? '1. ' : '1、') +
                          intl(
                            '437671',
                            `当前发行数量 = 证券发行总数，包含限售股，以及其他市场流通的DR对应的股份数量 `
                          )}
                        <br />
                        {(window.en_access_config ? '2. ' : '2、') +
                          intl('437672', '当前流通市值 = 当前发行数量 × 最新收盘价')}
                      </div>
                    }
                  >
                    <InfoCircleButton />
                  </Tooltip>
                }
              </span>
            ),
            render: (_txt, row) => {
              return wftCommon.formatMoneyComma(row.tradeMarketValue) + (row.marketValueCurrency || '')
            },
          },
          {
            render: (_txt, row) => {
              if (!row.closingPrice) return '--'
              return wftCommon.formatMoneyTemp(row.closingPrice, [2, ' '])
            },
          },
          {
            render: (txt) => {
              if (!txt) return '--'
              if (txt > 0) {
                return <span style={{ color: '#b30006' }}> {'+' + wftCommon.formatPercent(txt)} </span>
              } else if (txt < 0) {
                return <span style={{ color: '#00ab3f' }}> {wftCommon.formatPercent(txt)} </span>
              }
              return wftCommon.formatPercent(txt)
            },
          },
          null,
        ],
        dataCallback: (res) => {
          // 数据返回后是否要做单独的逻辑处理
          if (!res || !res.length) return []
          const newRes = []
          res.map((t) => {
            if (t.securityType !== '存托凭证') {
              newRes.push(t)
            }
          })
          return newRes
        },
      },
      {
        modelNum: undefined,
        cmd: '/detail/company/getListSubjectStockInfo',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        thWidthRadio: ['5.2%', '10%', '10%', '16%', '10%', '20%', '10%', '10%', '10%'],
        thName: [
          intl('28846', '序号'),
          intl('451230', 'DR简称'),
          intl('73736', 'DR代码'),
          intl('451228', '交易所'),
          intl('451211', '上市板块'),
          intl('73741', 'DR市值'),
          intl('138899', '收盘价'),
          intl('451229', '涨跌幅'),
          intl('273669', '更新日期'),
        ],
        align: [1, 0, 0, 0, 0, 2, 2, 2, 0, 0],
        fields: [
          'NO.',
          'name',
          'windCode',
          'tradeBoard',
          'listedBoard|formatCont',
          'tradeMarketValue|formatMoney',
          'closingPrice|formatMoney',
          'change',
          'updateTime|formatTime',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              return wftCommon.linkF5(txt, row, ['', 'windCode'])
            },
          },
          {
            render: (txt, row) => {
              return wftCommon.linkF5(txt, row, ['', 'windCode'])
            },
          },
          null,
          null,
          {
            title: (
              <span>
                {intl('73741', 'DR市值')}
                {
                  <Tooltip
                    overlayClassName="corp-tooltip"
                    title={
                      <div>
                        {(window.en_access_config ? '1. ' : '1、') +
                          intl(
                            '437671',
                            `当前发行数量 = 证券发行总数，包含限售股，以及其他市场流通的DR对应的股份数量 `
                          )}
                        <br />
                        {(window.en_access_config ? '2. ' : '2、') + intl('88049', 'DR市值 = DR数量 × DR最新收市价')}
                      </div>
                    }
                  >
                    <InfoCircleButton />
                  </Tooltip>
                }
              </span>
            ),
            render: (_txt, row) => {
              return wftCommon.formatMoneyComma(row.tradeMarketValue) + (row.marketValueCurrency || '')
            },
          },
          {
            render: (_txt, row) => {
              if (!row.closingPrice) return '--'
              return wftCommon.formatMoneyTemp(row.closingPrice, [2, ' '])
            },
          },
          {
            render: (txt) => {
              if (!txt) return '--'
              if (txt > 0) {
                return <span style={{ color: '#b30006' }}> {'+' + wftCommon.formatPercent(txt)} </span>
              } else if (txt < 0) {
                return <span style={{ color: '#00ab3f' }}> {wftCommon.formatPercent(txt)} </span>
              }
              return wftCommon.formatPercent(txt)
            },
          },
          null,
        ],
        numHide: true,
        dataCallback: (res) => {
          // 数据返回后是否要做单独的逻辑处理
          if (!res || !res.length) return []
          const newRes = []
          res.map((t) => {
            if (t.securityType === '存托凭证') {
              newRes.push(t)
            }
          })
          return newRes
        },
      },
    ],
  },
  showDeclarcompany: {
    cmd: '/detail/company/getdeclarcompany',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('138590', '待上市信息'),
    moreLink: 'showDeclarcompany',
    modelNum: 'declarcompany_num',
    thWidthRadio: ['5.2%', '9%', '9%', '10%', '10%', '15%', '18%', '15%', '10%'],
    thName: [
      intl('28846', '序号'),
      intl('451211', '上市板块'),
      intl('138826', '申请事项'),
      intl('138611', '申请进度'),
      intl('19528', '时间'),
      intl('138827', '预计发行股数(万股)'),
      intl('138828', '预计发行后总股本(万股)'),
      intl('138612', '募投项目投资总额'),
      intl('138829', '保荐机构'),
    ],
    align: [1, 0, 0, 0, 0, 2, 2, 2, 0],
    fields: [
      'NO.',
      'sectorCode|formatCont',
      'applyCode',
      'code',
      'startDate|formatTime',
      'noOfIssueSharesEstimated|formatCont',
      'noOfIssueCapsEstimated|formatCont',
      'totalInvestment|formatCont',
      'recommendOrgan',
    ],
    notVipTitle: intl('138590', '待上市信息'),
    notVipTips: intl('224198', '购买VIP/SVIP套餐，即可不限次查看企业待上市信息'),
    rightLink: () => {
      const usedInClient = wftCommon.usedInClient()
      if (!usedInClient) return ''
      return (
        <RightGotoLink
          txt={intl('15560', '新股中心')}
          func={() => {
            window.location.href = '!CommandParam(21369,disableuppercase=1)'
          }}
        ></RightGotoLink>
      )
    },
  },
  showBond: {
    // cmd: "getsharedbondsinfo",
    cmd: 'detail/company/getsharedbondsinfo',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('138664', '发行债券'),
    modelNum: 'sharedbonds_num',
    notVipTitle: intl('39463', '债券信息'),
    notVipTips: intl('224199', '购买VIP/SVIP套餐，即可不限次查看企业债券信息'),
    thWidthRadio: ['5.2%', '18%', '15%', '13%', '10%', '15%', '10%', '15%'],
    thName: [
      intl('28846', '序号'),
      intl('138892', '债券简称'),
      intl('138605', '债项/主体评级'),
      intl('138894', '发行日期'),
      intl('138895', '到期日期'),
      intl('138815', '发行规模(亿元)'),
      intl('30690', '票面利率'),
      intl('138816', '当前余额(亿元)'),
    ],
    align: [1, 0, 0, 0, 0, 2, 2, 2],
    fields: [
      'NO.',
      'secName',
      'credit',
      'interestDate|formatTime',
      'dueDate|formatTime',
      'realPublishNumber',
      'interestRateForTicket',
      'currentBalance',
    ],
    columns: [
      null,
      {
        render: (txt, row, idx) => {
          if (idx == 0) {
            window.__GELWINDCODE__ = row.windCode
          }
          return wftCommon.linkF9(txt, row, ['', 'windCode'])
        },
      },
      {
        render: (txt, row, _idx) => {
          return txt + '/' + (row['issueCredit'] ? row['issueCredit'] : '--')
        },
      },
      null,
      null,
      {
        render: (txt) => {
          if (!txt) return '--'
          return wftCommon.formatMoneyTemp(txt, [2, ' '])
        },
      },
      {
        render: (txt) => {
          if (!txt) return '--'
          return wftCommon.formatMoneyTemp(txt, [2, ' '])
        },
      },

      {
        render: (txt) => {
          if (!txt) return '--'
          return wftCommon.formatMoneyTemp(txt, [2, ' '])
        },
      },
    ],
    rightLink: () => {
      const usedInClient = wftCommon.usedInClient()
      if (!usedInClient) return ''
      return (
        <RightGotoLink
          txt={intl('348180', '全球穿透发债主体检索')}
          func={() => {
            window.location.href =
              '!CommandParam(3233,"' + (window.__GELWINDCODE__ ? window.__GELWINDCODE__ : '') + '")'
          }}
        ></RightGotoLink>
      )
    },
  },
  showComBondRate: {
    cmd: 'detail/company/getratingreportinfo',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('348181', '发债主体评级'),
    modelNum: 'cbrcreditratingreport_num',
    notVipTitle: intl('348181', '发债主体评级'),
    notVipTips: intl('224199', '购买VIP/SVIP套餐，即可不限次查看企业债券信息'),
    moreLink: 'showBond',
    thWidthRadio: ['5.2%', '20%', '25%', '30%', '21%'],
    thName: [
      intl('28846', '序号'),
      intl('298320', '发债主体'),
      intl('31013', '信用评级'),
      intl('31987', '评级机构'),
      intl('149586', '日期'),
    ],
    align: [1, 0, 0, 0],
    fields: ['NO.', 'companyName', 'creditRating', 'ratingAgencyName', 'issueDate|formatTime'],
    columns: [
      null,
      { render: (txt) => wftCommon.formatCont(txt) },
      null,
      {
        render: (_txt, row) => (
          <LinkByRowCompatibleCorpPerson nameKey={'ratingAgencyName'} idKey={'ratingAgencyId'} row={row} />
        ),
      },
      null,
    ],
  },
  showInvestmentAgency: {
    cmd: 'detail/company/getinvestmentagency',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('451212', '投资机构'),
    modelNum: 'invest_orgs_num',
    thWidthRadio: ['5.2%', '26%', '10%', '60%'],
    thName: [intl('28846', '序号'), intl('451231', '投资机构'), intl('451213', '省份地区'), intl('451241', '简介')],
    align: [1, 0, 0, 0],
    fields: ['NO.', 'investmentName', 'headArea', 'introduce'],
    notVipTitle: intl('451212', '投资机构'),
    notVipTips: '购买企业套餐，即可查看该企业投资机构信息',
    columns: [
      null,
      {
        render: (txt, row, _idx) => {
          const detailid = row['investmentId']
          const url = `https://RIME/rime/frontend/web/profile?id=${detailid}&type=ORGANIZATION`
          return detailid && wftCommon.usedInClient() ? (
            <DetailLink
              url={url}
              txt={txt}
              openFunc={() => {
                url && window.open(url)
              }}
            />
          ) : (
            txt
          )
        },
      },
      null,
      null,
      null,
    ],
    prefixDownDoc: () => <RimeDataLink url={`//RIME/rime/frontend/web/database/realm/pevc.institution`} />,
  },
  showInvestmentEvent: {
    cmd: '/detail/company/getinvestmentevent',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('40559', '投资事件'),
    moreLink: 'showInvestmentEvent',
    modelNum: 'invest_events_num',
    thWidthRadio: ['5.2%', '25%', '10%', '12%', '10%', '10%', '25%'],
    thName: [
      intl('28846', '序号'),
      intl('451232', '投资对象'),
      intl('451234', '交易日期'),
      intl('451235', '交易类型'),
      intl('451236', '投资金额（万）'),
      intl('451233', '其他投资方'),
    ],
    align: [1, 0, 0, 0, 2, 0, 0],
    fields: ['NO.', 'objectName', 'date|formatTime', 'type', 'amount|formatMoney', 'investorList'],
    notVipTitle: intl('40559', '投资事件'),
    notVipTips: '购买企业套餐，即可查看该企业投资事件信息',
    columns: [
      null,
      {
        render: (txt, row) => {
          return <CompanyLink name={txt} id={row.objectID} />
        },
      },
      null,
      null,
      {
        render: (_txt, row) => {
          return formatCurrency(row.amount, row.amountCurrency)
        },
      },
      {
        render: (txt, _row) => {
          return txt && Array.isArray(txt) && txt.map((i) => <CompanyLink name={i.investorName} id={i.investorId} />)
        },
      },
    ],
    prefixDownDoc: ({ companyCode }) => {
      return (
        <RimeDataLink
          url={
            '//RIME/rime/frontend/web/database/realm/pevc.event?func_id=deal_ins_investor&instition_id=' + companyCode
          }
        ></RimeDataLink>
      )
    },
  },
  showPVEC: {
    cmd: '/detail/company/getpevc',
    title: intl('451237', 'PEVC融资'),
    moreLink: 'showPVEC',
    modelNum: 'pevc_num_new',
    downDocType: 'download/createtempfile/getpevc',
    thWidthRadio: ['5.2%', '20%', '20%', '40%', '16%'],
    thName: [
      intl('28846', '序号'),
      intl('59928', '融资轮次'),
      intl('451254', '融资日期'),
      intl('14391', '投资方'),
      intl('451238', '融资金额'),
    ],
    align: [1, 0, 0, 0, 2],
    fields: ['NO.', 'financeRound', 'openTime|formatTime', 'investmentCompany', 'financeAmount'],
    transFields: ['financeCurrency', 'financeRound', 'investmentCompany', 'Investor'],
    notVipTitle: intl('451237', '融资信息'),
    notVipTips: '购买企业套餐，即可查看该企业PEVC融资信息',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    prefixDownDoc: ({ companyCode }) => {
      return (
        <RimeDataLink
          url={
            '//RIME/rime/frontend/web/database/realm/pevc.event?func_id=deal_financing_company&enterprise_id=' +
            companyCode
          }
        ></RimeDataLink>
      )
    },
    columns: [
      null,
      null,
      null,
      {
        render: (_txt, row) => {
          if (!window.en_access_config) {
            const companys = row?.investment?.split(';')
            return companys?.map((i) => <CompanyLink name={i.split(',')[1]} id={i.split(',')[0]} />)
          } else {
            return row.investmentCompany || '--'
          }
        },
      },
      {
        render: (txt, row, _idx) => {
          if (txt) {
            const moneyText = wftCommon.formatMoney(txt, [4, '万'])
            const unitStr = row.financeCurrency ? row.financeCurrency : ''
            if (!row.financeScale || row.financeScale == '精确值') {
              if (row.financeCurrency) {
                return moneyText + unitStr
              } else {
                return moneyText
              }
            } else if (row.financeScale === '数百万') {
              return '数百万' + unitStr
            } else if (row.financeScale == '数') {
              const numStr = (txt + '').split('.')[0]
              switch (numStr.length) {
                case 7:
                  return '数百亿' + unitStr
                case 6:
                  return '数十亿' + unitStr
                case 5:
                  return '数亿' + unitStr
                case 4:
                  return '数千万' + unitStr
                case 3:
                  return '数百万' + unitStr
                case 2:
                  return '数十万' + unitStr
                case 1:
                  return '数万' + unitStr
                default:
                  return moneyText + unitStr
              }
            } else {
              return row.financeScale + moneyText + unitStr
            }
          } else {
            return '--'
          }
        },
      },
    ],
  },
  pvecOut: {
    cmd: 'detail/company/getpevcquits',
    downDocType: 'download/createtempfile/getpevcquits',
    title: intl('138436', 'PEVC退出信息'),
    moreLink: 'pvecOut',
    modelNum: 'pevcquit_num',
    thWidthRadio: ['5.2%', '40%', '26%', '30%'],
    thName: [intl('28846', '序号'), intl('138606', '退出机构'), intl('63486', '退出日期'), intl('138819', '退出方式')],
    align: [1, 0, 0, 0],
    fields: ['NO.', 'investorName', 'openTime|formatTime', 'financeRound'],
    columns: [
      null,
      {
        render: (txt, row, _idx) => {
          return <CompanyLink name={txt} id={row.investorId} />
        },
      },
    ],
    notVipTitle: intl('138436', 'PEVC退出信息'),
    notVipTips: '购买企业套餐，即可查看该企业PEVC退出信息',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    prefixDownDoc: () => <RimeDataLink />,
  },
  showMerge: {
    // cmd: 'getmergerinfo',
    cmd: 'detail/company/getMergerInfo_v2',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('138381', '并购信息'),
    moreLink: 'showMerge',
    // restfulApi:true,
    modelNum: 'merge_num',
    thWidthRadio: ['5.2%', '8%', '15%', '21%', '16%', '12%', '14%', '10%'],
    thName: [
      intl('28846', '序号'),
      intl('138382', '并购角色'),
      intl('138801', '交易价值(万元)'),
      intl('40645', '并购方式'),
      intl('138653', '支付金额(万元)'),
      intl('138707', '股权转让比例'),
      intl('138723', '首次披露日期'),
      intl('59999', '进展描述'),
    ],
    align: [1, 0, 2, 0, 2, 2, 0, 0],
    fields: [
      'NO.',
      'dealPartRoleCode|formatCont',
      'tradeMoney',
      'mergeTypeCode|formatCont',
      'purchaserPayment',
      'planPurchaseSharePercentage|formatPercent',
      'firstAfficheDate|formatTime',
      'tradeIntroduction',
    ],
    notVipTitle: intl('138381', '并购信息'),
    notVipTips: intl('224200', '购买VIP/SVIP套餐，即可不限次查看企业并购信息'),
    columns: [
      null,
      null,
      {
        render: (_txt, row) => {
          return formatCurrency(row.tradeMoney, row.moneyCode)
        },
      },
      null,
      {
        render: (_txt, row) => {
          return formatCurrency(row.purchaserPayment, row.moneyCode)
        },
      },
      null,
      null,
      {
        render: (_txt, _row, _idx) => {
          return ''
        },
      },
    ],
    dataCallback: (res, _num, pageno) => {
      res.map((t, idx) => {
        t.key = t.key ? t.key : idx + pageno * 10
      })
      return res
    },
    // expandDetail: [
    //   7,
    //   {
    //     cmd: 'getmergerinfo',
    //     extraParams: (record, data) => {
    //       return {
    //         detailId: record.referenceId,
    //         companycode: data.companycode,
    //       }
    //     },
    //   },
    //   (ex, re) => {
    //     // return <span className="wi-btn-color expand-icon-getmergerinfo">  <i></i>  </span>
    //   },
    // ],
    // notHorizontal:true
  },

  showGrantcredit: {
    cmd: 'detail/company/getgrantcredit',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('138684', '银行授信'),
    modelNum: corpDetailBankCredit.modelNum,
    thWidthRadio: ['5.2%', '21%', '25%', '25%', '25%'],
    thName: [
      intl('28846', '序号'),
      intl('24411', '截止日期'),
      intl('138822', '授信额度(亿元)'),
      intl('138823', '已使用(亿元)'),
      intl('138824', '未使用(亿元)'),
    ],
    align: [1, 0, 2, 2, 2, 2],
    fields: ['NO.', 'endDate', 'grantedCreditMoney', 'usedGrantedCreditMone', 'notUsedGrantedCreditMoney'],
    notVipTitle: intl('138684', '银行授信'),
    notVipTips: intl('224202', '购买VIP/SVIP套餐，即可不限次查看企业银行授信信息'),
    columns: [
      null,
      null,
      {
        render: (_txt, row, _idx) => {
          return formatCurrency(row.grantedCreditMoney, row.grantedCreditMoneyUnit)
        },
      },
      {
        render: (_txt, row, _idx) => {
          return formatCurrency(row.usedGrantedCreditMone, row.usedGrantedCreditMoneUnit)
        },
      },
      {
        render: (_txt, row, _idx) => {
          return formatCurrency(row.notUsedGrantedCreditMoney, row.notUsedGrantedCreditMoneyUnit)
        },
      },
    ],
    rightLink: (data) => {
      const { companyCode, companyId } = data
      return !window.en_access_config ? (
        <RightGotoLink
          style={{ marginLeft: 10, alignSelf: 'center' }}
          txt={intl('370031', '查看授信详情')}
          func={() => {
            wftCommon.jumpBaifen(`/govbusiness/?m=2#/corpInfo`, '__blank', {
              companyId: companyId,
              corpId: wftCommon.formatCompanyCode(companyCode),
            })
          }}
        ></RightGotoLink>
      ) : null
    },
  },
  absinfo: {
    cmd: 'detail/company/getcompanyabs',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('138122', 'ABS信息'),
    moreLink: 'absinfo',
    modelNum: 'companyabs_num',
    thWidthRadio: ['5.2%', '36%', '15%', '10%', '10%', '10%', '15%'],
    thName: [
      intl('28846', '序号'),
      intl('199999', '项目名称'),
      intl('138796', '发行总额(万元)'),
      intl('138655', '发行公告日'),
      intl('138701', '法定到期日'),
      intl('138621', '基础资产种类'),
    ],
    align: [1, 0, 2, 0, 0, 0, 0],
    fields: ['NO.', 'projectName', 'issuedAmount', 'announceDate', 'dueDate', 'basicAssetsType'],
    notVipTitle: intl('138122', 'ABS信息'),
    notVipTips: intl('224204', '购买VIP/SVIP套餐，即可不限次查看企业ABS信息'),
    rightLink: (_data) => {
      const usedInClient = wftCommon.usedInClient()
      if (!usedInClient) return ''
      return (
        <RightGotoLink
          txt={intl('208047', 'ABS项目大全')}
          func={() => {
            const url = `//fixedincomeserver/Wind.FixedIncome.Data.Web/static/ABSProjects/index.html`
            window.open(url)
          }}
        ></RightGotoLink>
      )
    },
    columns: [
      null,
      null,
      {
        render: (_, row) => {
          return formatCurrency(row.issuedAmount, row.currencyCode)
        },
      },
    ],
  },
  showChattleFinancing: {
    cmd: '/detail/company/getchattlefinancinglist_chattlefinancing',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return { ...param }
    },
    dataCallback: (res) => {
      return res.list && res.list.length ? res.list : []
    },
    title: intl('243422', '动产融资'),
    downDocType: 'download/createtempfile/getchattlefinancinglist_chattlefinancing',
    moreLink: 'showChattleFinancing',
    modelNum: 'chattle_financing_num',
    selName: ['chattleBusinessVal', 'chattleRegisterVal'],
    aggName: ['aggs_biz_type', 'aggs_reg_type'],
    thWidthRadio: ['5.2%', '16%', '16%', '16%', '24%', '10%', '10%'],
    thName: [
      intl('28846', '序号'),
      intl('87749', '登记日期'),
      intl('243424', '融资金额（万）'),
      intl('198469', '业务类型'),
      intl('243426', '交易方主体'),
      intl('243427', '交易方角色'),
      intl('243423', '登记类型'),
    ],
    align: [1, 0, 2, 0, 0, 0, 0, 0],
    fields: ['NO.', 'regDate|formatTime', 'financeAmount', 'bizType', 'subjectName', 'role', 'regType'],
    columns: [
      null,
      null,
      {
        render: (_txt, row) => {
          return formatCurrency(row.financeAmount, row.financeUnit)
        },
      },
      null,
      {
        render: (field, row) => <Links module={LinksModule.COMPANY} title={field} id={row.subjectId} />,
      },
    ],
    notVipTitle: intl('243422', '动产融资'),
    notVipTips: intl('224247', '购买VIP/SVIP套餐，即可不限次查看更多特色企业库数据'),
    rightFilters: [
      {
        key4sel: 'aggs_biz_type',
        key4ajax: 'bizType',
        name: intl('198469', '业务类型'),
        key: '',
        typeOf: 'string',
      },
      {
        key4sel: 'aggs_reg_type',
        key4ajax: 'regType',
        name: intl('243423', '登记类型'),
        key: '',
        typeOf: 'string',
      },
    ],

    rightLink: (data) => {
      const { companyCode, companyId, companyName } = data
      const usedInClient = wftCommon.usedInClient() || wftCommon.isDevDebugger()
      if (!usedInClient) return ''
      return getLocale() === 'zh-CN' ? (
        <RightGotoLink
          style={{ marginLeft: 10, alignSelf: 'center' }}
          txt={intl('370032', '查看融资详情')}
          func={() => {
            window.open(
              BaiFenSites().getFinancingDetails({
                companyId: companyId,
                corpId: wftCommon.formatCompanyCode(companyCode),
                title: companyName,
              })
            )
          }}
        ></RightGotoLink>
      ) : (
        <></>
      )
    },
  },
  showChattelmortgage: {
    title: intl('138207', '动产抵押'),
    modelNum: corpDetailChattelMortgage.modelNum,
    withTab: true,
    notVipTitle: intl('138207', '动产抵押'),
    notVipTips: intl('224247', '购买VIP/SVIP套餐，即可不限次查看更多特色企业库数据'),
    children: [
      {
        modelNum: undefined,
        cmd: '/detail/company/getchattelmortgagelist_chatteimortgage',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        title: intl('138392', '抵押人'),
        thWidthRadio: ['5.2%', '10%', '14%', '14%', '14%', '17%', '8%', '10%', '8%'],
        thName: [
          intl('28846', '序号'),
          intl('138769', '登记编号'),
          intl('138392', '抵押人'),
          intl('138391', '抵押权人'),
          intl('138618', '被担保债权种类'),
          intl('138830', '抵押债权数额（万元）'),
          intl('138416', '经营状态'),
          intl('87749', '登记日期'),
          intl('36348', '操作'),
        ],
        align: [1, 0, 0, 0, 0, 2, 0, 0, 0],
        fields: [
          'NO.',
          'cm_reg_no',
          'cm_mortgage_person_name1',
          'cm_mortgage_person_name',
          'cm_zq_type',
          'cm_zq_amount',
          'cm_reg_status',
          'cm_reg_date|formatTime',
          '',
        ],
        dataCallback: (res, _num, pageno) => {
          res.map((t, idx) => {
            t.key = t.key ? t.key : idx + pageno * 10
          })
          return res
        },
        columns: [
          null,
          null,
          {
            render: (txt, row) => {
              return <CompanyLink name={txt} id={row.cm_mortgage_person_id1} />
            },
          },
          {
            render: (txt, row) => {
              return <CompanyLink name={txt} id={row.cm_mortgage_person_id} />
            },
          },
        ],
      },
      {
        modelNum: undefined,
        cmd: '/detail/company/getchattelmortgagelist_chatteimortgaged',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        title: intl('138391', '抵押权人'),
        thWidthRadio: ['5.2%', '10%', '14%', '14%', '14%', '17%', '8%', '10%', '8%'],
        thName: [
          intl('28846', '序号'),
          intl('138769', '登记编号'),
          intl('138392', '抵押人'),
          intl('138391', '抵押权人'),
          intl('138618', '被担保债权种类'),
          intl('138830', '抵押债权数额（万元）'),
          intl('138416', '经营状态'),
          intl('87749', '登记日期'),
          intl('36348', '操作'),
        ],
        align: [1, 0, 0, 0, 0, 2, 0, 0, 0],
        fields: [
          'NO.',
          'cm_reg_no',
          'cm_mortgage_person_name1',
          'cm_mortgage_person_name',
          'cm_zq_type',
          'cm_zq_amount',
          'cm_reg_status',
          'cm_reg_date|formatTime',
          '',
        ],
        dataCallback: (res, _num, pageno) => {
          res.map((t, idx) => {
            t.key = t.key ? t.key : idx + pageno * 10
          })
          return res
        },
        columns: [
          null,
          null,
          {
            render: (txt, row) => {
              return <CompanyLink name={txt} id={row.cm_mortgage_person_id1} />
            },
          },
          {
            render: (txt, row) => {
              return <CompanyLink name={txt} id={row.cm_mortgage_person_id} />
            },
          },
        ],
      },
    ],
  },
  showInsurance: {
    title: intl('370002', '保险产品'),
    cmd: 'detail/company/getInsurance',
    notVipTitle: intl('370002', '保险产品'),
    notVipTips: vipDescDefault,
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return {
        ...param,
      }
    },
    dataCallback: (res) => {
      return res.list && res.list.length ? res.list : []
    },
    thName: [
      intl('28846', '序号'),
      intl('2485', '产品名称'),
      intl('370001', '销售状态'),
      intl('2483', '产品类型'),
      intl('370000', '承保方式'),
    ],
    fields: [
      'NO.',
      'productName',
      'isOnSale|formatCont',
      'productKind|formatCont',
      'productInsuranceMethod|formatCont',
    ],
    thWidthRadio: ['5.2%', '51%', '10%', '20%', '15%'],
    modelNum: 'insuranceNum',
    rightFilters: [
      {
        key4sel: 'aggs_sale',
        key4ajax: 'isOnSale',
        name: intl('370001', '全部销售状态'),
        key: '',
        typeOf: 'string',
        width: 130,
      },
      {
        key4sel: 'aggs_insurance_method',
        key4ajax: 'productInsuranceMethod',
        name: intl('370000', '全部承保方式'),
        key: '',
        typeOf: 'string',
      },
    ],
    rightLink: (_data) => {
      const usedInClient = wftCommon.usedInClient()
      return usedInClient ? (
        <RightGotoLink
          style={{ marginLeft: 10, alignSelf: 'center' }}
          txt={intl('370030', '保险索引')}
          func={() => {
            window.location.href = '!COMMANDPARAM[2932]'
          }}
        ></RightGotoLink>
      ) : (
        <></>
      )
    },
    columns: [
      null,
      {
        render: (txt, row, _idx) => {
          return wftCommon.linkINF(txt, row.productCode)
        },
      },
      null,
      null,
      null,
    ],
  },
}
