import { Links } from '@/components/common/links'
import CompanyLink from '@/components/company/CompanyLink.tsx'
import { ICorpPrimaryModuleCfg } from '@/components/company/type'
import { InfoCircleButton } from '@/components/icons/InfoCircle'
import {
  corpDetailEquityPledge,
  corpDetailEquityPledgePawnee,
  corpDetailEquityPledgePCorp,
  corpDetailEquityPledgor,
  corpDetailStockPledge,
  corpDetailStockPledgePawnee,
  corpDetailStockPledgePCorp,
  corpDetailStockPledgor,
} from '@/handle/corpModuleCfg'
import { LinksModule } from '@/handle/link'
import { CommonAggParam } from '@/handle/table/aggregation/config.ts'
import { intlNoNO as intl } from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { Link, Tooltip } from '@wind/wind-ui'
import React from 'react'
import { vipDescDefault } from '../common/vipDesc'

export const bussRisk: ICorpPrimaryModuleCfg = {
  moduleTitle: {
    title: intl('138415', '经营风险'),
    moduleKey: 'businessRisk', // 与左侧大菜单齐名
    noneData: intl('348938', '暂无经营风险'),
  },
  showViolationsPenalties: {
    cmd: 'detail/company/get_penalty_for_violate',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('118780', '诚信信息'),
    hint: intl('365134', '该数据从公示结果解析得出，仅供参考，不代表万得征信任何明示、暗示之观点或保证。'),
    downDocType: 'integrityinfo',
    moreLink: 'get_penalty_for_violate',
    modelNum: 'violationPunish',
    thWidthRadio: ['5.2%', '10%', '29%', '14%', '16%', '11%', '8%', '8%'],
    thName: [
      intl('28846', '序号'),
      intl('138143', '公示日期'),
      intl('222774', '处罚标题'),
      intl('138462', '处罚类别'),
      intl('250442', '处罚原因'),
      intl('63636', '处罚金额'),
      intl('310750', '处罚状态'),
      intl('36348', '操作'),
    ],
    align: [1, 0, 0, 0, 0, 2, 0, 0],
    fields: [
      'NO.',
      'announceDate|formatTime',
      'punishTitle',
      'categoryNames',
      'reasonName',
      'punishAmount|formatMoneyComma',
      'currentStatus',
      'punishOriginal',
    ],
    columns: [
      null,
      null,
      null,
      null,
      null,
      null,
      {
        render: (data) => {
          if (data && data == 0) {
            return window.en_access_config ? 'Cancelled' : '已撤销'
          } else {
            return window.en_access_config ? 'Uncancelled' : '未撤销'
          }
        },
      },
      {
        render: (data) => {
          if (!data) return '--'
          return (
            <Link
              href={data}
              // @ts-expect-error ttt
              target="_blank"
              dangerouslySetInnerHTML={{
                __html: window.en_access_config ? intl('40513') : '查看原文',
              }}
            ></Link>
          )
        },
      },
    ],
    notVipTitle: intl('118780', '诚信信息'),
    notVipTips: '购买VIP/SVIP套餐，即可不限次查看企业诚信信息',
  },
  getoperationexception: {
    cmd: '/detail/company/get_AbnormalOperation',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return {
        ...param,
      }
    },
    notVipTitle: intl('138568', '经营异常'),
    notVipTips: vipDescDefault,
    downDocType: 'download/createtempfile/get_AbnormalOperation',
    title: intl('138568', '经营异常'),
    moreLink: 'getoperationexception',
    modelNum: 'manageabnormalCount',
    thWidthRadio: ['5.2%', '10%', '10%', '25%', '10%', '12%', '24%'],
    thName: [
      intl('28846', '序号'),
      intl('138241', '列入日期'),
      intl('348188', '作出决定机关'),
      intl('138470', '列入经营异常名录原因'),
      intl('138246', '移出日期'),
      intl('138420', '移出决定机关'),
      intl('138471', '移出经营异常名录原因'),
    ],
    align: [1, 0, 0, 0, 0, 0, 0],
    fields: [
      'NO.',
      'time|formatTime',
      'inDterOrgan|formatCont',
      'inReason|formatCont',
      'outDate|formatTime',
      'outDterOrgan|formatCont',
      'outReason|formatCont',
    ],
  },
  getcancelfiling: {
    cmd: 'detail/company/getcancelrecord',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return {
        ...param,
      }
    },
    notVipTitle: intl('229150', '注销备案'),
    notVipTips: vipDescDefault,
    title: intl('229150', '注销备案'),
    modelNum: 'cancelrecord_num',
    thWidthRadio: ['5.2%', '32%', '32%', '32%'],
    thName: [intl('28846', '序号'), intl('232844', '清算组备案日期'), intl('232845', '债权人公告日期')],
    align: [1, 0, 0, 0],
    fields: ['NO.', 'recordDate|formatTime', 'startDate|formatTime'],
  },
  getclearinfo: {
    cmd: 'detail/company/getliquidation',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    notVipTitle: intl('145873', '清算信息'),
    notVipTips: vipDescDefault,
    title: intl('145873', '清算信息'),
    moreLink: 'getclearinfo',
    modelNum: 'liquidation_num',
    thWidthRadio: ['5.2%', '26%', '69%'],
    thName: [intl('28846', '序号'), intl('145874', '清算组负责人'), intl('145875', '清算组成员')],
    align: [1, 0, 0],
    fields: ['NO.', 'director', 'member'],
  },
  getowingtax: {
    cmd: '/detail/company/get_UnpaidTax',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return {
        ...param,
      }
    },
    notVipTitle: intl('138424', '欠税信息'),
    notVipTips: vipDescDefault,
    downDocType: 'unpaidtax',
    title: intl('138424', '欠税信息'),
    moreLink: 'getowingtax',
    modelNum: 'taxdebtsCount',
    selName: ['owingtaxSelVal'],
    aggName: ['aggs_type'],
    thWidthRadio: ['5.2%', '15%', '14%', '14%', '15%', '39%'],
    thName: [
      intl('28846', '序号'),
      intl('138143', '公示日期'),
      intl('138194', '欠税税种'),
      intl('138566', '欠税类型'),
      intl('364153', '欠款余额(元)'),
      intl('138218', '主管税务机关'),
    ],
    align: [1, 0, 0, 0, 2, 0, 0],
    fields: [
      'NO.',
      'time|formatTime',
      'owingTaxType',
      'owingTaxKind',
      'owingTaxBalance|formatMoneyComma',
      'taxAuthority',
    ],
  },
  gettaxillegal: {
    cmd: '/detail/company/get_IllegalTax',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return {
        ...param,
      }
    },
    notVipTitle: intl('138533', '税收违法'),
    notVipTips: vipDescDefault,
    title: intl('138533', '税收违法'),
    downDocType: 'illegaltax',
    moreLink: 'gettaxillegal',
    modelNum: 'taxillegalCount',
    thWidthRadio: ['5.2%', '10%', '19%', '20%', '20%', '27%'],
    thName: [
      intl('28846', '序号'),
      intl('138908', '发布日期'),
      intl('138189', '案件性质'),
      intl('138178', '违法事实开始日期'),
      intl('138234', '违法事实截止日期'),
      intl('138346', '实施检查单位'),
    ],
    align: [1, 0, 0, 0, 0, 0, 0],
    fields: ['NO.', 'time|formatTime', 'caseNature', 'startDate|formatTime', 'endDate|formatTime', 'inspectionOrgans'],
    dataCallback: (res, _num, pageno) => {
      res.map((t, idx) => {
        t.key = t.key ? t.key : idx + pageno * 10
      })
      return res
    },
  },
  getillegal: {
    //严重违法
    cmd: '/detail/company/get_IllegalAct',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return {
        ...param,
      }
    },
    notVipTitle: intl('138335', '严重违法'),
    notVipTips: vipDescDefault,
    downDocType: 'illegalact',
    title: intl('138335', '严重违法'),
    moreLink: 'getillegal',
    modelNum: 'illegal_num',
    thWidthRadio: ['5.2%', '10%', '10%', '25%', '10%', '12%', '24%'],
    thName: [
      intl('28846', '序号'),
      intl('138241', '列入日期'),
      intl('348188', '作出决定机关'),
      intl('348193', '列入严重违法失信企业名单原因'),
      intl('138246', '移出日期'),
      intl('138420', '移出决定机关'),
      intl('348189', '移出严重违法失信企业名单原因'),
    ],
    align: [1, 0, 0, 0, 0, 0, 0],
    fields: [
      'NO.',
      'time|formatTime',
      'inDterOrgan|formatCont',
      'inReason|formatCont',
      'outDate|formatTime',
      'outDterOrgan|formatCont',
      'outReason|formatCont',
    ],
  },
  // 非标违约
  getnostandard: {
    cmd: 'detail/company/get_NoStandard',
    title: intl('440354', '非标违约'),
    moreLink: 'getnostandard',
    modelNum: 'defaultonnonstandardassetsNum',
    downDocType: 'download/createtempfile/get_NoStandard',
    thWidthRadio: ['5.2%', '10%', '30%', '15%', '12%', '28%', '10%'],
    thName: [
      intl('28846', '序号'),
      intl('32903', '公告日期'),
      intl('369981', '非标资产名称'),
      intl('369982', '风险类型'),
      intl('369983', '非标资产类型'),
      intl('369984', '关联主体'),
      intl('40513', '详情'),
    ],
    align: [1, 0, 0, 0, 0, 0],
    fields: [
      'NO.',
      'announceDate|formatTime',
      'defaultAssetName',
      'defaultType',
      'defaultName',
      'parties',
      'OB_OBJECT_ID',
    ],
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    notVipTitle: intl('440354', '非标违约'),
    notVipTips: intl('369985', '购买VIP/SVIP套餐，即可不限次查看企业非标违约'),
    dataCallback: (res, _num, pageno) => {
      res.map((t, idx) => {
        t.key = t.key ? t.key : idx + pageno * 10
      })
      return res
    },
    columns: [
      null,
      null,
      null,
      {
        render: (txt) => {
          if (txt === '358002001') {
            return intl('283633', '非标资产风险提示')
          }

          if (txt === '358001001') {
            return intl('283632', '非标资产违约')
          }
        },
      },
      null,
      {
        render: (txt, _row) => {
          if (!txt) return ''
          const partiesArr = []
          let showAllpartiesHtml = ''
          Object.keys(txt).map((item) => {
            if (txt[item]) {
              return txt[item].map((itemChid) => {
                partiesArr.push(itemChid)
                showAllpartiesHtml += `<p>${itemChid.roleName}:${itemChid.companyName}</p>`
              })
            }
          })
          return (
            <Tooltip placement="top" title={<div dangerouslySetInnerHTML={{ __html: showAllpartiesHtml }}></div>}>
              <span className="parties-tooltip">{`${intl('4600', '担保人')}: ${partiesArr[0].companyName}`}</span>
            </Tooltip>
          )
        },
      },
      null,
    ],
  },
  getinspection: {
    cmd: 'detail/company/getinspection',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('138467', '抽查检查'),
    moreLink: 'getinspection',
    modelNum: 'inspection_num',
    thWidthRadio: ['5.2%', '15%', '15%', '40%', '26%'],
    thName: [
      intl('28846', '序号'),
      intl('138244', '检查日期'),
      intl('138564', '检查类型'),
      intl('138492', '检查结果'),
      intl('138345', '检查实施机关'),
    ],
    align: [1, 0, 0, 0, 0],
    fields: [
      'NO.',
      'inspection_time|formatTime',
      'inspection_name|formatCont',
      'inspection_result|formatCont',
      'inspection_uthority',
    ],
    notVipTitle: intl('138467', '抽查检查'),
    notVipTips: '购买企业套餐，即可查看该企业抽查检查信息',
  },
  getdoublerandom: {
    cmd: 'detail/company/getspotcheck',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('145855', '双随机抽查'),
    moreLink: 'getdoublerandom',
    modelNum: 'spot_check_num',
    thWidthRadio: ['5.2%', '13%', '13%', '14%', '13%', '11%', '11%', '11%', '10%'],
    thName: [
      intl('28846', '序号'),
      intl('145856', '抽查计划编号'),
      intl('145857', '抽查计划名称'),
      intl('145858', '抽查任务编号'),
      intl('145859', '抽查任务名称'),
      intl('145860', '抽查类型'),
      intl('145861', '抽查机关'),
      intl('145862', '抽查完成日期'),
      intl('145863', '抽查结果'),
    ],
    align: [1, 0, 0, 0, 0, 0, 0, 0],
    fields: [
      'NO.',
      'check_plan_no',
      'check_plan_name',
      'check_task_no',
      'check_task_name',
      'check_type',
      'check_organs',
      'check_completion_date|formatTime',
      'OB_OBJECT_ID',
    ],
    notVipTitle: intl('145855', '双随机抽查'),
    notVipTips: '购买企业套餐，即可查看该企业双随机抽查信息',
    dataCallback: (res, _num, pageno) => {
      res.map((t, idx) => {
        t.key = t.key ? t.key : idx + pageno * 10
      })
      return res
    },
  },
  getprodrecall: {
    cmd: 'detail/company/getprodrecall',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    notVipTitle: intl('120790', '产品召回'),
    notVipTips: vipDescDefault,
    title: intl('120790', '产品召回'),
    moreLink: 'getprodrecall',
    modelNum: 'prodrecall_num',
    thWidthRadio: ['5.2%', '29%', '15%', '15%', '20%', '17%'],
    thName: [
      intl('28846', '序号'),
      intl('90845', '公告标题'),
      intl('232862', '召回产品'),
      intl('2483', '产品类型'),
      intl('232863', '召回企业'),
      intl('138908', '发布日期'),
    ],
    align: [1, 0, 0, 0, 0, 0],
    fields: ['NO.', 'title', 'product', 'productType', 'corps', 'announceDate|formatTime'],
    columns: [
      null,
      null,
      null,
      null,
      {
        render: (_txt, row) => {
          if (row.corps && row.corps.length) {
            return row.corps[0].corpName
          }
          return '--'
        },
      },
    ],
  },
  // 担保信息
  showguarantee: {
    cmd: 'detail/company/getguarantee/',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return {
        ...param,
      }
    },
    title: intl('138320', '担保信息'),
    moreLink: 'showguarantee',
    modelNum: 'guaranteedetailCount',
    downDocType: 'download/createtempfile/getguarantee',
    thWidthRadio: ['5.2%', '32%', '24%', '20%', '20%'],
    thName: [
      intl('28846', '序号'),
      intl('1927', '被担保方'),
      intl('4596', '担保金额(万元)'),
      intl('24411', '截止日期'),
      intl('32903', '公告日期'),
    ],
    align: [1, 0, 2, 0, 0],
    fields: ['NO.', 'guaranteedParty', 'guaranteeAmount', 'deadlineDate|formatTime', 'announcementDate|formatTime'],
    notVipTitle: intl('138320', '担保信息'),
    notVipTips: intl('224201', '购买VIP/SVIP套餐，即可不限次查看企业担保信息'),
    columns: [
      null,
      {
        render: (txt, row, _idx) => {
          if (row.guaranteedPartyCode) {
            return <CompanyLink name={txt} id={row.guaranteedPartyCode}></CompanyLink>
          } else {
            return wftCommon.formatCont(txt)
          }
        },
      },
      {
        render: (_txt, row) => {
          return row.guaranteeAmount ? wftCommon.formatMoneyTemp(row.guaranteeAmount, [2, ' ']) : '--'
        },
      },
      null,
      null,
    ],
    // 担保信息: 非上市发债
    showguaranteeNotMarket: {
      cmd: 'detail/company/getguarantee/',
      title: intl('138320', '担保信息'),
      moreLink: 'showguaranteeNotMarket',
      modelNum: 'guaranteedetailCount',
      downDocType: 'download/createtempfile/getguarantee',
      thWidthRadio: ['5.2%', '25%', '12%', '11%', '10%', '12%', '10%', '10%', '10%'],
      thName: [
        intl('28846', '序号'),
        intl('1927', '被担保方'),
        intl('4596', '担保金额(万元)'),
        intl('196625', '担保额度(万元)'),
        intl('4598', '担保期限(年)'),
        intl('196624', '投保方式'),
        intl('451234', '交易日期'),
        intl('24411', '截止日期'),
        intl('40513', '详情'),
      ],
      align: [1, 0, 2, 2, 2, 0, 0, 0, 0],
      fields: [
        'NO.',
        'guaranteedParty',
        'guaranteeAmount',
        'guaranteeLimit',
        'guaranteeTerm|formatMoneyComma',
        'guaranteeMethod',
        'transactionDate|formatTime',
        'deadlineDate|formatTime',
        '',
      ],
      extraParams: (param) => {
        param.__primaryKey = param.companycode
        return param
      },
      notVipTitle: intl('440354', '非标违约'),
      notVipTips: intl('369985', '购买VIP/SVIP套餐，即可不限次查看企业非标违约'),
      dataCallback: (res, _num, pageno) => {
        res.map((t, idx) => {
          t.key = t.key ? t.key : idx + pageno * 10
        })
        return res
      },
      columns: [
        null,
        {
          render: (txt, row, _idx) => {
            if (row.guaranteedPartyCode) {
              return <CompanyLink name={txt} id={row.guaranteedPartyCode}></CompanyLink>
            } else {
              return wftCommon.formatCont(txt)
            }
          },
        },
        {
          render: (_txt, row) => {
            return row.guaranteeAmount ? wftCommon.formatMoneyTemp(row.guaranteeAmount, [2, ' ']) : '--'
          },
        },
        {
          render: (_txt, row) => {
            return row.guaranteeLimit ? wftCommon.formatMoneyTemp(row.guaranteeLimit, [2, ' ']) : '--'
          },
        },
        null,
        null,
        null,
        null,
      ],
    },
  },
  showStockMortgage: {
    title: intl('132933', '股票质押'),
    modelNum: corpDetailStockPledge.modelNum,
    notVipTitle: intl('132933', '股票质押'),
    notVipTips: '购买VIP/SVIP套餐，即可不限次查看企业股票质押',
    withTab: true,
    children: [
      {
        cmd: 'detail/company/getstockpledge',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return {
            ...param,
            dataType: '1', //查出质人传1，查质权人传2，查出质标的传3
          }
        },
        title: intl('138447', '出质人'),
        modelNum: corpDetailStockPledgor.modelNum,
        thWidthRadio: ['5.2%', '15%', '15%', '15%', '10%', '10%', '10%'],
        thName: [
          intl('28846', '序号'),
          intl('138447', '出质人'),
          intl('138446', '质权人'),
          intl('354213', '出质股权标的的企业'),
          intl('205511', '质押股数(万股)'),
          intl('313196', '是否解押'),
          intl('36348', '操作'),
        ],
        align: [1, 0, 0, 0, 2, 0, 0],
        fields: ['NO.', 'pledger_name', 'pledgee_name', 'plex_name', 'amount', 'isRelease', ''],
        expandDetail: [
          6,
          {
            cmd: '',
            extraParams: (record, data) => {
              return {
                detailId: record.detailId,
                companycode: data.companycode,
              }
            },
          },
          (_ex, _re) => {
            return (
              <span className="wi-btn-color expand-icon-getimpexp">
                {' '}
                <i></i>{' '}
              </span>
            )
          },
        ],
        columns: [
          null,
          {
            render: (txt, row, _idx) => {
              if (row.pledger_id && row.pledger_type === 1 && row.pledger_id.length < 16) {
                return <CompanyLink name={txt} id={row.pledger_id}></CompanyLink>
              } else {
                return wftCommon.formatCont(txt)
              }
            },
          },
          {
            render: (txt, row, _idx) => {
              if (row.pledgee_id && row.pledgee_id.length < 16) {
                return <CompanyLink name={txt} id={row.pledgee_id}></CompanyLink>
              } else {
                return wftCommon.formatCont(txt)
              }
            },
          },
          {
            render: (txt, row, _idx) => {
              if (row.plex_id && row.plex_id.length < 16) {
                return <CompanyLink name={txt} id={row.plex_id}></CompanyLink>
              } else {
                return wftCommon.formatCont(txt)
              }
            },
          },
          {
            render: (txt) => {
              return wftCommon.formatMoney(txt, [4, ' '])
            },
          },
          null,
        ],
        dataCallback: (res, _num, pageno) => {
          res.map((t, idx) => {
            t.key = t.key ? t.key : idx + pageno * 10
          })
          return res
        },
      },
      {
        cmd: 'detail/company/getstockpledge',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return {
            ...param,
            dataType: '2', //查出质人传1，查质权人传2，查出质标的传3
          }
        },
        title: intl('138446', '质权人'),
        modelNum: corpDetailStockPledgePawnee.modelNum,
        thWidthRadio: ['5.2%', '15%', '15%', '15%', '10%', '10%', '10%'],
        thName: [
          intl('28846', '序号'),
          intl('138447', '出质人'),
          intl('138446', '质权人'),
          intl('354213', '出质股权标的的企业'),
          intl('205511', '质押股数(万股)'),
          intl('313196', '是否解押'),
          intl('36348', '操作'),
        ],
        align: [1, 0, 0, 0, 2, 0, 0],
        fields: ['NO.', 'pledger_name', 'pledgee_name', 'plex_name', 'amount', 'isRelease', ''],
        expandDetail: [
          6,
          {
            cmd: '',
            extraParams: (record, data) => {
              return {
                detailId: record.detailId,
                companycode: data.companycode,
              }
            },
          },
          (_ex, _re) => {
            return (
              <span className="wi-btn-color expand-icon-getimpexp">
                {' '}
                <i></i>{' '}
              </span>
            )
          },
        ],
        columns: [
          null,
          {
            render: (txt, row, _idx) => {
              if (row.pledger_id && row.pledger_type === 1 && row.pledger_id.length < 16) {
                return <CompanyLink name={txt} id={row.pledger_id}></CompanyLink>
              } else {
                return wftCommon.formatCont(txt)
              }
            },
          },
          {
            render: (txt, row, _idx) => {
              if (row.pledgee_id && row.pledgee_id.length < 16) {
                return <CompanyLink name={txt} id={row.pledgee_id}></CompanyLink>
              } else {
                return wftCommon.formatCont(txt)
              }
            },
          },
          {
            render: (txt, row, _idx) => {
              if (row.plex_id && row.plex_id.length < 16) {
                return <CompanyLink name={txt} id={row.plex_id}></CompanyLink>
              } else {
                return wftCommon.formatCont(txt)
              }
            },
          },
          {
            render: (txt) => {
              return wftCommon.formatMoney(txt, [4, ' '])
            },
          },
          null,
          null,
        ],
        dataCallback: (res) => {
          res.map((t, idx) => {
            t.key = idx
          })
          return res
        },
      },
      {
        cmd: 'detail/company/getstockpledge',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return {
            ...param,
            dataType: '3', //查出质人传1，查质权人传2，查出质标的传3
          }
        },
        title: intl('138527', '出质标的'),
        modelNum: corpDetailStockPledgePCorp.modelNum,
        thWidthRadio: ['5.2%', '15%', '15%', '15%', '10%', '10%', '10%'],
        thName: [
          intl('28846', '序号'),
          intl('138447', '出质人'),
          intl('138446', '质权人'),
          intl('354213', '出质股权标的的企业'),
          intl('205511', '质押股数(万股)'),
          intl('313196', '是否解押'),
          intl('36348', '操作'),
        ],
        align: [1, 0, 0, 0, 2, 0, 0],
        fields: ['NO.', 'pledger_name', 'pledgee_name', 'plex_name', 'amount', 'isRelease', ''],
        expandDetail: [
          6,
          {
            cmd: '',
            extraParams: (record, data) => {
              return {
                detailId: record.detailId,
                companycode: data.companycode,
              }
            },
          },
          (_ex, _re) => {
            return (
              <span className="wi-btn-color expand-icon-getimpexp">
                {' '}
                <i></i>{' '}
              </span>
            )
          },
        ],
        columns: [
          null,
          {
            render: (txt, row, _idx) => {
              if (row.pledger_id && row.pledger_type === 1 && row.pledger_id.length < 16) {
                return <CompanyLink name={txt} id={row.pledger_id}></CompanyLink>
              } else {
                return wftCommon.formatCont(txt)
              }
            },
          },
          {
            render: (txt, row, _idx) => {
              if (row.pledgee_id && row.pledgee_id.length < 16) {
                return <CompanyLink name={txt} id={row.pledgee_id}></CompanyLink>
              } else {
                return wftCommon.formatCont(txt)
              }
            },
          },
          {
            render: (txt, row, _idx) => {
              if (row.plex_id && row.plex_id.length < 16) {
                return <CompanyLink name={txt} id={row.plex_id}></CompanyLink>
              } else {
                return wftCommon.formatCont(txt)
              }
            },
          },
          {
            render: (txt, _row) => {
              return wftCommon.formatMoney(txt, [4, ' '])
            },
          },
          null,
          null,
        ],
        dataCallback: (res, _num, pageno) => {
          res.map((t, idx) => {
            t.key = t.key ? t.key : idx + pageno * 10
          })
          return res
        },
      },
    ],
  },
  showPledgedstock: {
    title: intl('138281', '股权出质'),
    modelNum: corpDetailEquityPledge.modelNum,
    notVipTitle: intl('138281', '股权出质'),
    notVipTips: '购买VIP/SVIP套餐，即可不限次查看企业股权出质',
    withTab: true,
    downDocType: 'download/createtempfile/get_equityPledged',
    children: [
      {
        cmd: '/detail/company/get_equityPledged',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return {
            ...param,
            dataType: '1',
          }
        },
        bury: { id: 922602100288 },
        downDocType: 'download/createtempfile/get_equityPledged',
        title: intl('138447', '出质人'),
        modelNum: corpDetailEquityPledgor.modelNum,
        thWidthRadio: ['5.2%', '10%', '22%', '22%', '22%', '16%', '8%'],
        thName: [
          intl('28846', '序号'),
          intl('87749', '登记日期'),
          intl('138447', '出质人'),
          intl('138446', '质权人'),
          intl('138528', '出质股权标的企业'),
          intl('143251', '出质股权数额（万股）'),
          intl('32098', '状态'),
        ],
        align: [1, 0, 0, 0, 0, 2, 0, 0, 0],
        fields: [
          'NO.',
          'regDate|formatTime',
          'pledgorName',
          'pledgeeName',
          'pledgorTargetName',
          'pledgeAmount|formatMoneyComma',
          'regStatus',
        ],
        columns: [
          null,
          null,
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.pledgorCode}></CompanyLink>
            },
          },
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.pledgeeCode}></CompanyLink>
            },
          },
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.pledgorTargetCode}></CompanyLink>
            },
          },
          null,
          {
            title: (
              <span>
                {intl('32098', '状态')}

                {
                  <Tooltip
                    overlayClassName="corp-tooltip"
                    title={
                      <div>
                        {intl('348178', '股权出质状态无效是指历史发生过股权出质的情况，现已经解除。')} <br />{' '}
                        {intl('348179', '股权出质状态有效是指历史发生过股权出质的情况，现未解除。')}
                      </div>
                    }
                  >
                    <InfoCircleButton />
                  </Tooltip>
                }

                {/* { <span className="table-hint" dangerouslySetInnerHTML={{__html : '<i style="right:0;padding:5px;">  <div>股权出质状态无效是指历史发生过股权出质的情况，现已经解除。</br>股权出质状态有效是指历史发生过股权出质的情况，现未解除。</div> </i>'}}></span> } */}
              </span>
            ),
            render: (txt, _row, _idx) => {
              if (txt) {
                return txt
              } else {
                return '--'
              }
            },
          },
        ],
      },
      {
        cmd: '/detail/company/get_equityPledged',
        bury: { id: 922602100289 },
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return {
            ...param,
            dataType: '2',
          }
        },
        downDocType: 'download/createtempfile/get_equityPledged',
        title: intl('138446', '质权人'),
        modelNum: corpDetailEquityPledgePawnee.modelNum,
        thWidthRadio: ['5.2%', '10%', '22%', '22%', '22%', '16%', '8%'],
        thName: [
          intl('28846', '序号'),
          intl('87749', '登记日期'),
          intl('138447', '出质人'),
          intl('138446', '质权人'),
          intl('138528', '出质股权标的企业'),
          intl('143251', '出质股权数额（万股）'),
          intl('32098', '状态'),
        ],
        align: [1, 0, 0, 0, 0, 2, 0, 0, 0],
        fields: [
          'NO.',
          'regDate|formatTime',
          'pledgorName',
          'pledgeeName',
          'pledgorTargetName',
          'pledgeAmount|formatMoneyComma',
          'regStatus',
        ],
        columns: [
          null,
          null,
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.pledgorCode}></CompanyLink>
            },
          },
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.pledgeeCode}></CompanyLink>
            },
          },
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.pledgorTargetCode}></CompanyLink>
            },
          },
          null,
          {
            title: (
              <span>
                {intl('32098', '状态')}

                {
                  <Tooltip
                    overlayClassName="corp-tooltip"
                    title={
                      <div>
                        {'股权出质状态无效是指历史发生过股权出质的情况，现已经解除。'} <br />{' '}
                        {'股权出质状态有效是指历史发生过股权出质的情况，现未解除。'}
                      </div>
                    }
                  >
                    <InfoCircleButton />
                  </Tooltip>
                }
                {/* { <span className="table-hint" dangerouslySetInnerHTML={{__html : '<i style="right:0;padding:5px;">  <div>股权出质状态无效是指历史发生过股权出质的情况，现已经解除。</br>股权出质状态有效是指历史发生过股权出质的情况，现未解除。</div> </i>'}}></span> } */}
              </span>
            ),
            render: (txt, _row, _idx) => {
              if (txt) {
                // if (txt == "有效") {
                //     return <span style={{color : '#169d60'}}>有效</span>
                // } else if (txt == "无效") {
                //     return <span style={{color : '#E50113'}}>无效</span>
                // } else {
                //     return txt;
                // }
                return txt
              } else {
                return '--'
              }
            },
          },
        ],
      },
      {
        cmd: '/detail/company/get_equityPledged',
        bury: { id: 922602100290 },
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return {
            ...param,
            dataType: '3',
          }
        },
        downDocType: 'download/createtempfile/get_equityPledged',
        title: intl('138527', '出质标的'),
        modelNum: corpDetailEquityPledgePCorp.modelNum,
        thWidthRadio: ['5.2%', '10%', '22%', '22%', '22%', '16%', '8%'],
        thName: [
          intl('28846', '序号'),
          intl('87749', '登记日期'),
          intl('138447', '出质人'),
          intl('138446', '质权人'),
          intl('138528', '出质股权标的企业'),
          intl('143251', '出质股权数额（万股）'),
          intl('32098', '状态'),
        ],
        align: [1, 0, 0, 0, 0, 2, 0, 0, 0],
        fields: [
          'NO.',
          'regDate|formatTime',
          'pledgorName',
          'pledgeeName',
          'pledgorTargetName',
          'pledgeAmount|formatMoneyComma',
          'regStatus',
        ],
        columns: [
          null,
          null,
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.pledgorCode}></CompanyLink>
            },
          },
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.pledgeeCode}></CompanyLink>
            },
          },
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.pledgorTargetCode}></CompanyLink>
            },
          },
          null,
          {
            title: (
              <span>
                {intl('32098', '状态')}

                {
                  <Tooltip
                    overlayClassName="corp-tooltip"
                    title={
                      <div>
                        {'股权出质状态无效是指历史发生过股权出质的情况，现已经解除。'} <br />{' '}
                        {'股权出质状态有效是指历史发生过股权出质的情况，现未解除。'}
                      </div>
                    }
                  >
                    <InfoCircleButton />
                  </Tooltip>
                }

                {/* { <span className="table-hint" dangerouslySetInnerHTML={{__html : '<i style="right:0;padding:5px;">  <div>股权出质状态无效是指历史发生过股权出质的情况，现已经解除。</br>股权出质状态有效是指历史发生过股权出质的情况，现未解除。</div> </i>'}}></span> } */}
              </span>
            ),
            render: (txt, _row, _idx) => {
              if (txt) {
                // if (txt == "有效") {
                //     return <span style={{color : '#169d60'}}>有效</span>
                // } else if (txt == "无效") {
                //     return <span style={{color : '#E50113'}}>无效</span>
                // } else {
                //     return txt;
                // }
                return txt
              } else {
                return '--'
              }
            },
          },
        ],
      },
    ],
  },
  // 债券违约
  getdefaultbond: {
    cmd: 'detail/company/getdefaultbond/',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return {
        ...param,
      }
    },
    title: intl('440355', '债券违约'),
    moreLink: 'getdefaultbond',
    modelNum: 'default_num',
    thWidthRadio: ['5.2%', '12%', '12%', '14%', '10%', '9%', '9%', '9%', '10%'],
    thName: [
      intl('28846', '序号'),
      intl('196623', '证券代码'),
      intl('203857', '证券简称'),
      intl('369976', '当前状态'),
      intl('369977', '首次违约日'),
      intl('369978', '当前债券余额（亿元）'),
      intl('369979', '当前逾期本金（亿元）'),
      intl('372192', '当前逾期利息（万元）'),
      intl('138934', '到期日'),
    ],
    align: [1, 0, 0, 0, 0, 2, 2, 2, 0],
    fields: [
      'NO.',
      'secCode',
      'secName',
      'currentState',
      'firstDefaultDate|formatTime',
      'currentBondBalance',
      'currentOverduePrincipal',
      'currentOverdueInterest',
      'dueDate|formatTime',
    ],
    notVipTitle: intl('440355', '债券违约'),
    notVipTips: intl('369986', '购买VIP/SVIP套餐，即可不限次查看企业债券违约'),
    columns: [
      null,
      null,
      null,
      null,
      null,
      {
        render: (_txt, row) => {
          return row.currentBondBalance ? wftCommon.formatMoneyTemp(row.currentBondBalance, [2, ' ']) : '0.00'
        },
      },
      {
        render: (_txt, row) => {
          return row.currentOverduePrincipal ? wftCommon.formatMoneyTemp(row.currentOverduePrincipal, [2, ' ']) : '0.00'
        },
      },
      {
        render: (_txt, row) => {
          return row.currentOverdueInterest ? wftCommon.formatMoneyTemp(row.currentOverdueInterest, [2, ' ']) : '0.00'
        },
      },
      null,
    ],
  },
  showIntellectualPropertyRights: {
    title: intl('204944', '知识产权出质'),
    modelNum: ['intellectual_pledgeds_num', 'ipPledgeCount'],
    notVipTitle: intl('204944', '知识产权出质'),
    notVipTips: vipDescDefault,
    children: [
      {
        searchOptionApi: 'detail/company/getIntellectualPropertyPledgeAgg',
        searchOptions: [
          {
            default: '全部公告日',
            defaultId: '409405',
            key: 'year',
            type: 'select',
            aggsKey: 'year',
            aggsParams: CommonAggParam,
          },
        ],
        searchOptionDataType: 'aggList',
        title: intl('409425', '知识产权质押（国家知识产权局）'),
        cmd: 'detail/company/getIntellectualPropertyPledge',
        downDocType: 'download/createtempfile/getIntellectualPropertyPledge',
        modelNum: 'ipPledgeCount',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        notVipTitle: intl('409425', '知识产权质押（国家知识产权局）'),
        notVipTips: vipDescDefault,
        thWidthRadio: ['5.2%', '15%', '14%', '14%', '14%', '14%', '13%', '12%'],
        thName: [
          intl('28846', '序号'),
          intl('29979', '名称'),
          intl('138482', '登记号'),
          intl('138447', '出质人'),
          intl('138446', '质权人'),
          intl('87749', '登记日期'),
          intl('138186', '注销日期'),
          intl('409427', '事务数据公告日'),
        ],
        align: [1, 0, 0, 0, 0, 0, 0, 0],
        fields: [
          'NO.',
          'patentName',
          'registrationNo',
          'pledgerName',
          'pledgeeName',
          'startDate|formatTime',
          'endDate|formatTime',
          'announcementDate|formatTime',
        ],
        columns: [
          null,
          {
            render: (_txt, row, _idx) => {
              // if (row.pledgerId && row.pledgerId.length < 16) {
              //   return <CompanyLink name={txt} id={row.pledgerId}></CompanyLink>
              // } else {
              //   return wftCommon.formatCont(txt)
              // }
              return <Links module={LinksModule.PATENT} id={row.patentId} title={row.patentName}></Links>
            },
          },
          null,
          {
            render: (txt, row, _idx) => {
              if (row.pledgerId && row.pledgerId.length < 16) {
                return <CompanyLink name={txt} id={row.pledgerId}></CompanyLink>
              } else {
                return wftCommon.formatCont(txt)
              }
            },
          },
          {
            render: (txt, row, _idx) => {
              if (row.pledgeeId && row.pledgeeId.length < 16) {
                return <CompanyLink name={txt} id={row.pledgeeId}></CompanyLink>
              } else {
                return wftCommon.formatCont(txt)
              }
            },
          },
        ],
      },
      {
        title: intl('409426', '知识产权质押（工商局）'),
        cmd: 'detail/company/getintellectualpledgeds',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        notVipTitle: intl('409426', '知识产权质押（工商局）'),
        notVipTips: vipDescDefault,
        modelNum: 'intellectual_pledgeds_num',
        thWidthRadio: ['5.2%', '15%', '14%', '8%', '14%', '14%', '13%', '12%', '6%'],
        thName: [
          intl('28846', '序号'),
          intl('204945', '知识产权登记证号'),
          intl('29979', '名称'),
          intl('246842', '知识产权种类'),
          intl('138447', '出质人'),
          intl('138446', '质权人'),
          intl('204946', '质权登记期限'),
          intl('138143', '公示日期'),
          intl('32098', '状态'),
        ],
        align: [1, 0, 0, 0, 0, 0, 0, 0, 0],
        fields: [
          'NO.',
          'regNo',
          'intel_name',
          'intel_category',
          'pledger',
          'pledgee',
          'regLimit',
          'regDate|formatTime',
          'status',
        ],
        columns: [
          null,
          null,
          null,
          null,
          {
            render: (txt, row, _idx) => {
              if (row.pledgerId && row.pledgerId.length < 16) {
                return <CompanyLink name={txt} id={row.pledgerId}></CompanyLink>
              } else {
                return wftCommon.formatCont(txt)
              }
            },
          },
          {
            render: (txt, row, _idx) => {
              if (row.pledgeeId && row.pledgeeId.length < 16) {
                return <CompanyLink name={txt} id={row.pledgeeId}></CompanyLink>
              } else {
                return wftCommon.formatCont(txt)
              }
            },
          },
          {
            render: (txt, _row, _idx) => {
              if (txt) {
                const start = txt.split('-')[0] ? wftCommon.formatTime(txt.split('-')[0]) : '--'
                const end = txt.split('-')[1] ? wftCommon.formatTime(txt.split('-')[1]) : '--'
                return start + intl('271245', ' 至 ') + end
              } else {
                return '--'
              }
            },
          },
          null,
          null,
        ],
      },
    ],
  },
}
