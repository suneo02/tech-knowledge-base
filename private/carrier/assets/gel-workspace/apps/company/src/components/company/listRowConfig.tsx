/** @format */
import { ICorpPrimaryModuleCfg } from '@/components/company/type'
import {
  corpDetailIPOBusiness,
  corpDetailIPOSales,
  corpDetailIPOStock,
  corpDetailIPOYield,
} from '@/handle/corpModuleCfg'
import { base } from '@/handle/corpModuleCfg/base/base.tsx'
import { buss } from '@/handle/corpModuleCfg/buss/buss.tsx'
import { bussRisk } from '@/handle/corpModuleCfg/bussRisk/bussRisk.tsx'
import { finance } from '@/handle/corpModuleCfg/finance/finance.tsx'
import { history } from '@/handle/corpModuleCfg/history/history.tsx'
import { ip } from '@/handle/corpModuleCfg/ip/ip.tsx'
import { qualifications } from '@/handle/corpModuleCfg/qualification/qualifications.tsx'
import { risk } from '@/handle/corpModuleCfg/risk/risk.tsx'
import { ChartO } from '@wind/icons'
import React from 'react'
import { intlNoNO as intl } from 'src/utils/intl'
import { wftCommon } from '../../utils/utils'

export const IpoBusinessData: ICorpPrimaryModuleCfg = {
  moduleTitle: {
    title: intl('64824', '业务数据'),
    moduleKey: 'IpoBusinessData', //  与左侧大菜单齐名
    noneData: intl('348953', '暂无业务数据'),
  },
  showIpoYield: {
    title: intl('193921', '产量'),
    withTab: true,
    modelNum: corpDetailIPOYield.modelNum,
    children: [
      {
        modelNum: undefined,
        cmd: 'detail/company/getproductionbusinessdata',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          param.staticMethod = 1
          param.companyID = param.companyid
          return param
        },
        title: intl('9860', '累计值'),
        thWidthRadio: ['5.2%', '19.35%', '11.79%', '12.62%', '8.92%', '11.67%', '11.67%', '11.67%', '11.67%'],
        thName: [
          intl('28846', '序号'),
          intl('38956', '业务指标'),
          intl('31688', '频率'),
          intl('138868', '更新时间'),
          intl('38413', '最新值'),
          intl('228322', '上年同比变化'),
          intl('228222', '上年同比增速'),
          intl('228323', '上期环比变化'),
          intl('228324', '上期环比增速'),
        ],
        align: [1, 0, 0, 0, 2, 2, 2, 2, 2],
        fields: [
          'NO.',
          'businessIndex',
          'frequency',
          'latestDate|formatTime',
          'latestValue|formatMoneyComma',
          'yoYGrowth|formatMoneyComma',
          'yoYGrowthRatio|formatPercent',
          'moMGrowth|formatMoneyComma',
          'moMGrowthRatio|formatPercent',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              return (
                <span
                  onClick={(_e) => {
                    // type check
                    if (!('children' in IpoBusinessData['showIpoYield'])) {
                      console.error('children not found in IpoBusinessData[showIpoYield]')
                      return
                    }
                    IpoBusinessData['showIpoYield'].children[0].chartCallback(row)
                  }}
                  data-uc-id="Dh5dBsItvE"
                  data-uc-ct="span"
                >
                  {' '}
                  {txt}
                  {
                    <ChartO
                      className="wi-btn-color"
                      style={{
                        fontSize: '18px',
                        marginLeft: '4px',
                        cursor: 'pointer',
                        verticalAlign: 'text-bottom',
                      }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                      data-uc-id="HgdO08edf"
                      data-uc-ct="charto"
                    />
                  }
                </span>
              )
            },
          },
        ],
        chartParams: (params) => {
          params.__primaryKey = params.companycode
          params.businessType = 0
          params.frequency = params.frequency || '月'
          return {
            ...params,
          }
        },
        chartCmd: 'detail/company/getbusinessdatagraph',
        chartTitle: '累计产量',
      },
      {
        modelNum: undefined,
        cmd: 'detail/company/getproductionbusinessdata',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          param.staticMethod = 0
          param.companyID = param.companyid
          return param
        },
        title: intl('95229', '当期值'),
        thWidthRadio: ['5.2%', '19.35%', '11.79%', '12.62%', '8.92%', '11.67%', '11.67%', '11.67%', '11.67%'],
        thName: [
          intl('28846', '序号'),
          intl('38956', '业务指标'),
          intl('31688', '频率'),
          intl('138868', '更新时间'),
          intl('38413', '最新值'),
          intl('228322', '上年同比变化'),
          intl('228222', '上年同比增速'),
          intl('228323', '上期环比变化'),
          intl('228324', '上期环比增速'),
        ],
        align: [1, 0, 0, 0, 2, 2, 2, 2, 2],
        fields: [
          'NO.',
          'businessIndex',
          'frequency',
          'latestDate|formatTime',
          'latestValue|formatMoneyComma',
          'yoYGrowth|formatMoneyComma',
          'yoYGrowthRatio|formatPercent',
          'moMGrowth|formatMoneyComma',
          'moMGrowthRatio|formatPercent',
        ],

        columns: [
          null,
          {
            render: (txt, row) => {
              return (
                <span
                  onClick={(_e) => {
                    // type check
                    if (!('children' in IpoBusinessData['showIpoYield'])) {
                      console.error('children not found in IpoBusinessData[showIpoYield]')
                      return
                    }
                    IpoBusinessData['showIpoYield'].children[1].chartCallback(row)
                  }}
                  data-uc-id="cgBX0NQZ7e"
                  data-uc-ct="span"
                >
                  {' '}
                  {txt}
                  {
                    <ChartO
                      className="wi-btn-color"
                      style={{
                        fontSize: '18px',
                        marginLeft: '4px',
                        cursor: 'pointer',
                        verticalAlign: 'text-bottom',
                      }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                      data-uc-id="TIQibD5x8h"
                      data-uc-ct="charto"
                    />
                  }
                </span>
              )
            },
          },
        ],
        chartCmd: 'detail/company/getbusinessdatagraph', // 图表cmd
        chartTitle: '当期产量',
        chartParams: (params) => {
          params.__primaryKey = params.companycode
          params.businessType = 0
          params.frequency = params.frequency || '月'
          return {
            ...params,
          }
        },
      },
    ],
  },
  showIpoSales: {
    title: intl('46834', '销量'),
    withTab: true,
    modelNum: corpDetailIPOSales.modelNum,
    children: [
      {
        modelNum: undefined,
        cmd: 'detail/company/getsalebusinessdata',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          param.staticMethod = 1
          param.companyID = param.companyid
          return param
        },
        title: intl('9860', '累计值'),
        thWidthRadio: ['5.2%', '19.35%', '11.79%', '12.62%', '8.92%', '11.67%', '11.67%', '11.67%', '11.67%'],
        thName: [
          intl('28846', '序号'),
          intl('38956', '业务指标'),
          intl('31688', '频率'),
          intl('138868', '更新时间'),
          intl('38413', '最新值'),
          intl('228322', '上年同比变化'),
          intl('228222', '上年同比增速'),
          intl('228323', '上期环比变化'),
          intl('228324', '上期环比增速'),
        ],
        align: [1, 0, 0, 0, 2, 2, 2, 2, 2],
        fields: [
          'NO.',
          'businessIndex',
          'frequency',
          'latestDate|formatTime',
          'latestValue|formatMoneyComma',
          'yoYGrowth|formatMoneyComma',
          'yoYGrowthRatio|formatPercent',
          'moMGrowth|formatMoneyComma',
          'moMGrowthRatio|formatPercent',
        ],
        chartParams: (params) => {
          params.__primaryKey = params.companycode
          params.businessType = 1
          params.frequency = params.frequency || '月'
          return {
            ...params,
          }
        },
        columns: [
          null,
          {
            render: (txt, row) => {
              return (
                <span
                  onClick={(_e) => {
                    // type check
                    if (!('children' in IpoBusinessData['showIpoSales'])) {
                      console.error('children not found in IpoBusinessData[showIpoSales]')
                      return
                    }
                    IpoBusinessData['showIpoSales'].children[0].chartCallback(row)
                  }}
                  data-uc-id="9HfXuHQpnt"
                  data-uc-ct="span"
                >
                  {' '}
                  {txt}
                  {
                    <ChartO
                      className="wi-btn-color"
                      style={{
                        fontSize: '18px',
                        marginLeft: '4px',
                        cursor: 'pointer',
                        verticalAlign: 'text-bottom',
                      }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                      data-uc-id="QcwCUupFgg"
                      data-uc-ct="charto"
                    />
                  }
                </span>
              )
            },
          },
        ],
        chartCmd: 'detail/company/getbusinessdatagraph',
        chartTitle: '累计销量',
      },
      {
        modelNum: undefined,
        cmd: 'detail/company/getsalebusinessdata',
        title: intl('95229', '当期值'),
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          param.staticMethod = 0
          param.companyID = param.companyid
          return param
        },
        thWidthRadio: ['5.2%', '19.35%', '11.79%', '12.62%', '8.92%', '11.67%', '11.67%', '11.67%', '11.67%'],
        thName: [
          intl('28846', '序号'),
          intl('38956', '业务指标'),
          intl('31688', '频率'),
          intl('138868', '更新时间'),
          intl('38413', '最新值'),
          intl('228322', '上年同比变化'),
          intl('228222', '上年同比增速'),
          intl('228323', '上期环比变化'),
          intl('228324', '上期环比增速'),
        ],
        align: [1, 0, 0, 0, 2, 2, 2, 2, 2],
        fields: [
          'NO.',
          'businessIndex',
          'frequency',
          'latestDate|formatTime',
          'latestValue|formatMoneyComma',
          'yoYGrowth|formatMoneyComma',
          'yoYGrowthRatio|formatPercent',
          'moMGrowth|formatMoneyComma',
          'moMGrowthRatio|formatPercent',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              return (
                <span
                  onClick={(_e) => {
                    // type check
                    if (!('children' in IpoBusinessData['showIpoSales'])) {
                      console.error('children not found in IpoBusinessData[showIpoSales]')
                      return
                    }
                    IpoBusinessData['showIpoSales'].children[1].chartCallback(row)
                  }}
                  data-uc-id="X1AqBeAj3Q"
                  data-uc-ct="span"
                >
                  {' '}
                  {txt}
                  {
                    <ChartO
                      className="wi-btn-color"
                      style={{
                        fontSize: '18px',
                        marginLeft: '4px',
                        cursor: 'pointer',
                        verticalAlign: 'text-bottom',
                      }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                      data-uc-id="jJAClPqleu"
                      data-uc-ct="charto"
                    />
                  }
                </span>
              )
            },
          },
        ],
        chartCmd: 'detail/company/getbusinessdatagraph', // 图表cmd
        chartTitle: '当期销量',
        chartParams: (params) => {
          params.__primaryKey = params.companycode
          params.businessType = 1
          params.frequency = params.frequency || '月'
          return {
            ...params,
          }
        },
      },
    ],
  },
  showIpoBusiness: {
    title: intl('46883', '业务量'),
    withTab: true,
    modelNum: corpDetailIPOBusiness.modelNum,
    children: [
      {
        modelNum: undefined,
        cmd: 'detail/company/gettrafficbusinessdata',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          param.staticMethod = 1
          param.companyID = param.companyid
          return param
        },
        title: intl('9860', '累计值'),
        thWidthRadio: ['5.2%', '19.35%', '11.79%', '12.62%', '8.92%', '11.67%', '11.67%', '11.67%', '11.67%'],
        thName: [
          intl('28846', '序号'),
          intl('38956', '业务指标'),
          intl('31688', '频率'),
          intl('138868', '更新时间'),
          intl('38413', '最新值'),
          intl('228322', '上年同比变化'),
          intl('228222', '上年同比增速'),
          intl('228323', '上期环比变化'),
          intl('228324', '上期环比增速'),
        ],
        align: [1, 0, 0, 0, 2, 2, 2, 2, 2],
        fields: [
          'NO.',
          'businessIndex',
          'frequency',
          'latestDate|formatTime',
          'latestValue|formatMoneyComma',
          'yoYGrowth|formatMoneyComma',
          'yoYGrowthRatio|formatPercent',
          'moMGrowth|formatMoneyComma',
          'moMGrowthRatio|formatPercent',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              return (
                <span
                  onClick={(_e) => {
                    // type check
                    if (!('children' in IpoBusinessData['showIpoBusiness'])) {
                      console.error('children not found in IpoBusinessData[showIpoBusiness]')
                      return
                    }
                    IpoBusinessData['showIpoBusiness'].children[0].chartCallback(row)
                  }}
                  data-uc-id="mkViw_cUN8_"
                  data-uc-ct="span"
                >
                  {' '}
                  {txt}
                  {
                    <ChartO
                      className="wi-btn-color"
                      style={{
                        fontSize: '18px',
                        marginLeft: '4px',
                        cursor: 'pointer',
                        verticalAlign: 'text-bottom',
                      }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                      data-uc-id="F3bC82M3qj"
                      data-uc-ct="charto"
                    />
                  }
                </span>
              )
            },
          },
        ],
        chartCmd: 'detail/company/getbusinessdatagraph', // 图表cmd
        chartTitle: '累计业务量',
        chartParams: (params) => {
          params.businessType = 2
          params.__primaryKey = params.companycode
          params.frequency = params.frequency || '月'
          return {
            ...params,
          }
        },
      },
      {
        modelNum: undefined,
        cmd: 'detail/company/gettrafficbusinessdata',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          param.staticMethod = 0
          param.companyID = param.companyid
          return param
        },
        title: intl('95229', '当期值'),
        thWidthRadio: ['5.2%', '19.35%', '11.79%', '12.62%', '8.92%', '11.67%', '11.67%', '11.67%', '11.67%'],
        thName: [
          intl('28846', '序号'),
          intl('38956', '业务指标'),
          intl('31688', '频率'),
          intl('138868', '更新时间'),
          intl('38413', '最新值'),
          intl('228322', '上年同比变化'),
          intl('228222', '上年同比增速'),
          intl('228323', '上期环比变化'),
          intl('228324', '上期环比增速'),
        ],
        align: [1, 0, 0, 0, 2, 2, 2, 2, 2],
        fields: [
          'NO.',
          'businessIndex',
          'frequency',
          'latestDate|formatTime',
          'latestValue|formatMoneyComma',
          'yoYGrowth|formatMoneyComma',
          'yoYGrowthRatio|formatPercent',
          'moMGrowth|formatMoneyComma',
          'moMGrowthRatio|formatPercent',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              return (
                <span
                  onClick={(_e) => {
                    if (!('children' in IpoBusinessData['showIpoBusiness'])) {
                      console.error('children not found in IpoBusinessData[showIpoBusiness]')
                      return
                    }
                    IpoBusinessData['showIpoBusiness'].children[1].chartCallback(row)
                  }}
                  data-uc-id="fIeTp3VuwjU"
                  data-uc-ct="span"
                >
                  {' '}
                  {txt}
                  {
                    <ChartO
                      className="wi-btn-color"
                      style={{
                        fontSize: '18px',
                        marginLeft: '4px',
                        cursor: 'pointer',
                        verticalAlign: 'text-bottom',
                      }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                      data-uc-id="H64lu_gUIP"
                      data-uc-ct="charto"
                    />
                  }
                </span>
              )
            },
          },
        ],
        chartCmd: 'detail/company/getbusinessdatagraph', // 图表cmd
        chartTitle: '当期业务量',
        chartParams: (params) => {
          params.businessType = 2
          params.__primaryKey = params.companycode
          params.frequency = params.frequency || '月'
          return {
            ...params,
          }
        },
      },
    ],
  },
  showIpoStock: {
    title: intl('203661', '库存'),
    withTab: true,
    modelNum: corpDetailIPOStock.modelNum,
    children: [
      {
        modelNum: undefined,
        cmd: 'detail/company/getinventorybusinessdata',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          param.staticMethod = 1
          param.companyID = param.companyid
          return param
        },
        title: intl('9860', '累计值'),
        thWidthRadio: ['5.2%', '19.35%', '11.79%', '12.62%', '8.92%', '11.67%', '11.67%', '11.67%', '11.67%'],
        thName: [
          intl('28846', '序号'),
          intl('38956', '业务指标'),
          intl('31688', '频率'),
          intl('138868', '更新时间'),
          intl('38413', '最新值'),
          intl('228322', '上年同比变化'),
          intl('228222', '上年同比增速'),
          intl('228323', '上期环比变化'),
          intl('228324', '上期环比增速'),
        ],
        align: [1, 0, 0, 0, 2, 2, 2, 2, 2],
        fields: [
          'NO.',
          'businessIndex',
          'frequency',
          'latestDate|formatTime',
          'latestValue|formatMoneyComma',
          'yoYGrowth|formatMoneyComma',
          'yoYGrowthRatio|formatPercent',
          'moMGrowth|formatMoneyComma',
          'moMGrowthRatio|formatPercent',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              return (
                <span
                  onClick={(_e) => {
                    if (!('children' in IpoBusinessData['showIpoStock'])) {
                      console.error('children not found in IpoBusinessData[showIpoStock]')
                      return
                    }
                    IpoBusinessData['showIpoStock'].children[0].chartCallback(row)
                  }}
                  data-uc-id="-VSsrMAG3ip"
                  data-uc-ct="span"
                >
                  {' '}
                  {txt}
                  {
                    <ChartO
                      className="wi-btn-color"
                      style={{
                        fontSize: '18px',
                        marginLeft: '4px',
                        cursor: 'pointer',
                        verticalAlign: 'text-bottom',
                      }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                      data-uc-id="8osZhpiBmU"
                      data-uc-ct="charto"
                    />
                  }
                </span>
              )
            },
          },
        ],
        chartCmd: 'detail/company/getbusinessdatagraph',
        chartTitle: '累计库存',
        chartParams: (params) => {
          params.businessType = 3
          params.__primaryKey = params.companycode
          params.frequency = params.frequency || '月'
          return {
            ...params,
          }
        },
      },
      {
        modelNum: undefined,
        cmd: 'detail/company/getinventorybusinessdata',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          param.staticMethod = 0
          param.companyID = param.companyid
          return param
        },
        title: intl('95229', '当期值'),
        thWidthRadio: ['5.2%', '19.35%', '11.79%', '12.62%', '8.92%', '11.67%', '11.67%', '11.67%', '11.67%'],
        thName: [
          intl('28846', '序号'),
          intl('38956', '业务指标'),
          intl('31688', '频率'),
          intl('138868', '更新时间'),
          intl('38413', '最新值'),
          intl('228322', '上年同比变化'),
          intl('228222', '上年同比增速'),
          intl('228323', '上期环比变化'),
          intl('228324', '上期环比增速'),
        ],
        align: [1, 0, 0, 0, 2, 2, 2, 2, 2],
        fields: [
          'NO.',
          'businessIndex',
          'frequency',
          'latestDate|formatTime',
          'latestValue|formatMoneyComma',
          'yoYGrowth|formatMoneyComma',
          'yoYGrowthRatio|formatPercent',
          'moMGrowth|formatMoneyComma',
          'moMGrowthRatio|formatPercent',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              return (
                <span
                  onClick={(_e) => {
                    if (!('children' in IpoBusinessData['showIpoStock'])) {
                      console.error('children not found in IpoBusinessData[showIpoStock]')
                      return
                    }
                    IpoBusinessData['showIpoStock'].children[1].chartCallback(row)
                  }}
                  data-uc-id="Bl-xD8ejL7Z"
                  data-uc-ct="span"
                >
                  {' '}
                  {txt}
                  {
                    <ChartO
                      className="wi-btn-color"
                      style={{
                        fontSize: '18px',
                        marginLeft: '4px',
                        cursor: 'pointer',
                        verticalAlign: 'text-bottom',
                      }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                      data-uc-id="PQPjPXptTa"
                      data-uc-ct="charto"
                    />
                  }
                </span>
              )
            },
          },
        ],
        chartCmd: 'detail/company/getbusinessdatagraph', // 图表cmd
        chartTitle: '当期库存',
        chartParams: (params) => {
          params.businessType = 3
          params.__primaryKey = params.companycode
          params.frequency = params.frequency || '月'
          return {
            ...params,
          }
        },
      },
    ],
  },
}

export const PublishFundData: ICorpPrimaryModuleCfg = {
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
export const PrivateFundData: ICorpPrimaryModuleCfg = {
  moduleTitle: {
    title: intl('39902', '基金数据'),
    moduleKey: 'PrivateFundData', // 与左侧大菜单齐名
    noneData: intl('348954', '暂无基金数据'),
  },
  showPrivateFundInfo: {
    title: intl('205468', '基本信息'),
    modelNum: undefined,
  },
}

export const listRowConfig: ICorpPrimaryModuleCfg[] = [
  base,
  IpoBusinessData,
  PublishFundData,
  PrivateFundData,
  finance,
  buss,
  qualifications,
  ip,
  risk,
  bussRisk,
  history,
]

// 上海工商联 仅展示 以下模块 且不做vip控制
export const shficRowConfig: ICorpPrimaryModuleCfg[] = [
  { showShareholder: base.showShareholder },
  {
    selectList: {
      ...qualifications.selectList,
      notVipTitle: '',
      notVipTips: '',
    },
  },
  {
    listInformation: {
      ...qualifications.listInformation,
      notVipTitle: '',
      notVipTips: '',
    },
  },
]
