import { CorpCaseInfoTooltip } from '@/components/company/commonComp/caseInfoTooltip.tsx'
import CompanyLink from '@/components/company/CompanyLink.tsx'
import { DetailLink, downLoadExcel } from '@/components/company/corpCompMisc.tsx'
import { ICorpPrimaryModuleCfg } from '@/components/company/type'
import { corpDetailEvaluation } from '@/handle/corpModuleCfg'
import { intlNoNO as intl } from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { DownloadO } from '@wind/icons'
import { Button } from '@wind/wind-ui'
import React from 'react'

export const risk: ICorpPrimaryModuleCfg = {
  moduleTitle: {
    title: intl('228331', '司法风险'),
    moduleKey: 'risk', // 与左侧大菜单齐名
    noneData: intl('363853', '暂无司法风险'),
  },
  getcourtdecision: {
    cmd: 'detail/company/get_judgement',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('138731', '裁判文书'),
    hint:
      '<i><div><span>' +
      intl(
        '365953',
        '裁判文书是记载人民法院审理过程和结果，它是诉讼活动结果的载体，也是人民法院确定和分配当事人实体权利义务的唯一凭证。一份结构完整、要素齐全、逻辑严谨的裁判文书，既是当事人享有权利和负担义务的凭证，也是上级人民法院监督下级人民法院民事审判活动的重要依据。'
      ) +
      '</span></div></i>',
    downDocType: 'download/createtempfile/get_judgement',
    moreLink: 'getcourtdecision',
    modelNum: 'judgeinfo_num',
    bordered: 'dotted',
    thWidthRadio: ['5.2%', '12%', '10%', '10%', '15%', '13%', '23%', '8%', '10%'],
    thName: [
      intl('28846', '序号'),
      intl('138190', '案号'),
      intl('138908', '发布日期'),
      intl('11061', '判决日期'),
      intl('138191', '案件标题'),
      intl('138196', '案由'),
      intl('138427', '当事人'),
      intl('145344', '判决结果'),
      intl('437427', '案件金额') + '(' + intl('23334', '元') + ')',
    ],
    align: [1, 0, 0, 0, 0, 0, 0, 0, 2],
    fields: [
      'NO.',
      'caseNo',
      'time|formatTime',
      'judgeTime|formatTime',
      'caseTitle',
      'caseReason',
      'entityName',
      'judgeResultType|formatCont',
      'caseAmount|formatMoneyComma',
    ],
    columns: [
      null,
      {
        render: (txt, row) => {
          if (!txt) return '--'
          const url = `index.html#/lawdetail?reportName=Judgment&id=${row.seqId}`
          return row.seqId ? <DetailLink url={url} txt={txt} /> : txt
        },
      },
      null,
      null,
      null,
      {
        render: (txt, row) =>
          txt ? (
            <span>
              {txt}
              <CorpCaseInfoTooltip caseId={row.caseReasonInfoId} defaultValue={txt} />
            </span>
          ) : (
            '--'
          ),
      },
      {
        render: (_txt, row) => {
          if (row.judgeRoles && row.judgeRoles.length) {
            return wftCommon.splitParties(row.judgeRoles, 'entityName', 'entityCode')
          }
          return '--'
        },
      },
    ],
  },
  getfilinginfo: {
    cmd: 'detail/company/get_legalEvents',
    hint: `<i ><div><span>${intl('365973', '立案是指进入司法程序,由侦查机关将案件进入正式的程序。立案信息证明案件已经在法院进行立案。')}</span></div></i>`,
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('205388', '立案信息'),
    downDocType: 'download/createtempfile/get_legalEvents',
    moreLink: 'getfilinginfo',
    modelNum: 'filing_info_num',
    thWidthRadio: ['5.2%', '20%', '10%', '17%', '34%', '15%'],
    thName: [
      intl('28846', '序号'),
      intl('138190', '案号'),
      intl('32903', '公告日期'),
      intl('138196', '案由'),
      intl('138427', '当事人'),
      intl('216403', '法院'),
    ],
    align: [1, 0, 0, 0, 0, 0],
    fields: ['NO.', 'caseId', 'noticeDate', 'caseReason', 'parties', 'courtName'],
    columns: [
      null,
      {
        render: (txt, row, _idx) => {
          if (!txt) return '--'
          return row.caseId
        },
      },
      {
        render: (_txt, row, _idx) => {
          return wftCommon.formatTime(row.noticeDate)
        },
      },
      {
        render: (txt, row, _idx) => {
          return txt ? (
            <span>
              {txt}
              <CorpCaseInfoTooltip caseId={row.caseReasonInfoId} defaultValue={txt} />
            </span>
          ) : (
            '--'
          )
        },
      },
      {
        render: (_txt, row, _idx) => {
          if (row.judgeRoles && row.judgeRoles.length) {
            return wftCommon.splitParties(row.judgeRoles)
          }
          return '--'
        },
      },
      {
        render: (_txt, row, _idx) => {
          return wftCommon.formatCont(row.courtName)
        },
      },
    ],
    dataCallback: (res) => {
      res.map((t, _idx) => {
        t.judgeRoles = t.content.parties
        delete t.content
      })
      return res
    },
  },
  getcourtopenannouncement: {
    cmd: 'detail/company/get_courtSession',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    hint: `<i ><div><span>${intl('365954', '开庭公告指的是法院在审理民事案件的时候，公开审理的，需要公告当事人姓名、案由和开庭的时间、地点。')}</span></div></i>`,
    moreLink: 'getcourtopenannouncement',
    title: intl('138657', '开庭公告'),
    downDocType: 'download/createtempfile/get_courtSession',
    modelNum: 'trialnotice_num',
    thWidthRadio: ['5.2%', '19%', '10%', '18%', '28%', '19%'],
    thName: [
      intl('28846', '序号'),
      intl('138190', '案号'),
      intl('283743', '开庭日期'),
      intl('138196', '案由'),
      intl('138427', '当事人'),
      intl('216403', '法院'),
    ],
    align: [1, 0, 0, 0, 0],
    fields: ['NO.', 'caseId', 'courtDate|formatTime', 'caseReason', 'content', 'courtName|formatCont'],
    columns: [
      null,
      {
        render: (txt, row) => {
          if (!txt) return '--'
          const url = `index.html#/lawdetail?reportName=CourtSession&id=${row.seqId}`
          return row.seqId ? <DetailLink url={url} txt={txt} /> : txt
        },
      },
      null,
      {
        render: (txt, row, _idx) => {
          return txt ? (
            <span>
              {txt} <CorpCaseInfoTooltip caseId={row.caseReasonInfoId} defaultValue={txt} />
            </span>
          ) : (
            '--'
          )
        },
      },
      {
        render: (_txt, row, _idx) => {
          if (row.judgeRoles && row.judgeRoles.length) {
            return wftCommon.splitParties(row.judgeRoles)
          }
          return '--'
        },
      },
      null,
    ],
    dataCallback: (res) => {
      res.map((t, _idx) => {
        t.judgeRoles = t.content.parties
        delete t.content
      })
      return res
    },
  },
  showDeliveryAnnouncement: {
    cmd: 'detail/company/get_ReachingAnnouncement',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    hint: `<i ><div><span>${intl(
      '365974',
      '送达公告是在受送达人下落不明或者用其他方式无法送达的情况下,人民法院通抄过公告将诉讼文书有关内容告知受送达人的一种特殊的送达方式。'
    )}</span></div></i>`,
    title: intl('204947', '送达公告'),
    downDocType: 'download/createtempfile/get_ReachingAnnouncement',
    moreLink: 'showDeliveryAnnouncement',
    modelNum: 'delivery_anns_num',
    thWidthRadio: ['5.2%', '24%', '10%', '14%', '29%', '19%'],
    thName: [
      intl('28846', '序号'),
      intl('138190', '案号'),
      intl('32903', '公告日期'),
      intl('138196', '案由'),
      intl('138427', '当事人'),
      intl('216403', '法院'),
    ],
    align: [1, 0, 0, 0, 0, 0],
    fields: ['NO.', 'caseId', 'publishDate|formatTime', 'caseReason', 'roles', 'courtName'],
    columns: [
      null,
      {
        render: (txt, row) => {
          if (!txt) return '--'
          const url = `index.html#/lawdetail?reportName=ReachingAnnouncement&id=${row.seqId}`
          return row.seqId ? <DetailLink url={url} txt={txt} /> : txt
        },
      },
      null,
      null,
      {
        render: (_txt, row, _idx) => {
          if (row.roles && row.roles.length > 0) {
            return wftCommon.splitParties(row.roles)
          } else {
            return '--'
          }
        },
      },
    ],
  },
  getcourtannouncement: {
    moreLink: 'getcourtannouncement',
    cmd: 'detail/company/get_courtAnnouncement',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('138226', '法院公告'),
    hint: `<i ><div><span>${intl('365955', '法院公告是由独立行使审判权的国家机关向社会公众公布的法律文书。')}</span></div></i>`,
    downDocType: 'download/createtempfile/get_courtAnnouncement',
    modelNum: 'coutnotice_num',
    thWidthRadio: ['5.2%', '20%', '10%', '12%', '25%', '15%', '14%'],
    thName: [
      intl('28846', '序号'),
      intl('138190', '案号'),
      intl('32903', '公告日期'),
      intl('138196', '案由'),
      intl('138427', '当事人'),
      intl('216403', '法院'),
      intl('6196', '公告类型'),
    ],
    align: [1, 0, 0, 0, 0, 0],
    fields: [
      'NO.',
      'caseId',
      'time|formatTime',
      'caseReason',
      'content',
      'courtName|formatCont',
      'noticeType|formatCont',
    ],
    columns: [
      null,
      {
        render: (txt, row) => {
          if (!txt) return '--'
          const url = `index.html#/lawdetail?reportName=CourtAnnouncement&id=${row.seqId}`
          return row.seqId ? <DetailLink url={url} txt={txt} /> : txt
        },
      },
      null,
      null,
      {
        render: (_txt, row, _idx) => {
          if (row.judgeRoles && row.judgeRoles.length) {
            return wftCommon.splitParties(row.judgeRoles)
          }
          return '--'
        },
      },
    ],
    dataCallback: (res) => {
      res.map((t, _idx) => {
        t.judgeRoles = t.content.parties
        delete t.content
      })
      return res
    },
  },
  getpersonenforced: {
    cmd: 'detail/company/get_executed_person',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    hint: `<i ><div><span>${intl('365956', '被执行人是指在法定的上诉期满后，或终审判决作出后，未履行法院判决或仲裁裁决，并进入执行程序的当事人。')}</span></div></i>`,
    moreLink: 'getpersonenforced',
    title: intl('138592', '被执行人'),
    downDocType: 'download/createtempfile/get_executed_person',
    modelNum: 'cur_debetor_num',
    thWidthRadio: ['5.2%', '27%', '10%', '20%', '29%', '10%'],
    thName: [
      intl('28846', '序号'),
      intl('138190', '案号'),
      intl('205387', '立案日期'),
      intl('216397', '执行标的(元)'),
      intl('143393', '审理法院'),
      intl('205382', '执行状态'),
    ],
    align: [1, 0, 0, 2, 0],
    fields: ['NO.', 'caseNo', 'time|formatTime', 'amount|formatMoneyComma', 'court', 'statusType'],
    columns: [
      null,
      {
        render: (txt, row) => {
          if (!txt) return '--'
          const url = `index.html#/lawdetail?reportName=ExecutedPerson_V1&id=${row.seqId}`
          return row.seqId ? <DetailLink url={url} txt={txt} /> : txt
        },
      },
    ],
  },
  getdishonesty: {
    cmd: 'detail/company/get_discredit',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    hint: `<i><div><span>${intl(
      '365957',
      '失信被执行人是指未履行生效法律文书确定的义务并具有“有履行能力而不履行”、“抗拒执行”等法定情形，从而被人民法院依法纳入失信被执行人名单的人。'
    )}</span></div></i>`,
    title: intl('283600', '失信被执行人'),
    downDocType: 'download/createtempfile/get_discredit',
    moreLink: 'getdishonesty',
    modelNum: 'breakpromise_num',
    thWidthRadio: ['5.2%', '21%', '10%', '10%', '22%', '20%', '13%'],
    thName: [
      intl('28846', '序号'),
      intl('138190', '案号'),
      intl('138908', '发布日期'),
      intl('205387', '立案日期'),
      intl('273812', '失信行为'),
      intl('138228', '执行法院'),
      intl('138435', '被执行人的履行情况'),
    ],
    align: [1, 0, 0, 0, 0, 0, 0],
    fields: [
      'NO.',
      'referenceNumber',
      'publishDate|formatTime',
      'time|formatTime',
      'specificCircumstances|formatCont',
      'courtOfExecution|formatCont',
      'executionStatus|formatCont',
    ],
    columns: [
      null,
      {
        render: (txt, row) => {
          if (!txt) return '--'
          const url = `index.html#/lawdetail?reportName=Discredit_V1&id=${row.seqId}`
          return row.seqId ? <DetailLink url={url} txt={txt} /> : txt
        },
      },
    ],
  },

  getendcase: {
    // apiSource: 'risk',
    cmd: 'detail/company/get_finalCase',
    hint: `<i ><div><span>${intl(
      '365975',
      '终本案件，是指法院的执行案件，由于被执行人没有可供执行的财产，而裁定终止本次执行程序。终本不撤回执行申请，也不是已经执行完毕，而是暂时中止执行。'
    )}</span></div></i>`,
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('216398', '终本案件'),
    downDocType: 'download/createtempfile/get_finalCase',
    moreLink: 'getendcase',
    modelNum: 'end_case_num',
    thWidthRadio: ['5.2%', '23%', '10%', '10%', '23%', '15%', '15%'],
    thName: [
      intl('28846', '序号'),
      intl('138190', '案号'),
      intl('205387', '立案日期'),
      intl('216399', '终本日期'),
      intl('138228', '执行法院'),
      intl('216397', '执行标的(元)'),
      intl('216401', '未履行金额(元)'),
    ],
    align: [1, 0, 0, 0, 0, 2, 2],
    fields: [
      'NO.',
      'caseNo',
      'caseDate|formatTime',
      'finalCaseDate|formatTime',
      'court',
      'amount|formatMoneyComma',
      'outstandingAmount|formatMoneyComma',
    ],
  },

  getcorpconsumption: {
    title: intl('209064', '限制高消费'),
    downDocType: 'download/createtempfile/get_restrictHighConsume',
    hint: `<i ><div><span>${intl(
      '365958',
      '限制高消费是指被执行人未按执行通知书指定的期间履行生效法律文书确定的给付义务的，人民法院可以采取限制消费措施，限制其高消费及非生活或者经营必需的有关消费。'
    )}</span></div></i>`,
    cmd: 'detail/company/get_restrictHighConsume',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    moreLink: 'getcorpconsumption',
    modelNum: 'corp_consumption_num',
    thWidthRadio: ['5.2%', '23%', '10%', '10%', '15%', '26%', '12%'],
    thName: [
      intl('28846', '序号'),
      intl('138190', '案号'),
      intl('138908', '发布日期'),
      intl('205387', '立案日期'),
      intl('283727', '被限制高消费人员'),
      intl('138228', '执行法院'),
      intl('205382', '执行状态'),
    ],
    align: [1, 0, 0, 0, 0, 0],
    fields: [
      'NO.',
      'judicialId',
      'firstAnnouncementDate|formatTime',
      'judicialTime|formatTime',
      'personName',
      'courtName',
      'statusType',
    ],
    columns: [
      null,
      {
        render: (txt, row) => {
          if (!txt) return '--'
          const url = `index.html#/lawdetail?reportName=RestrictHighConsume_V1&id=${row.seqId}`
          return row.seqId ? <DetailLink url={url} txt={txt} /> : txt
        },
      },
    ],
  },

  // getjudicialhelp:{
  //     cmd: "judicailassist",
  //         title: intl("138358","司法协助"),
  //         moreLink: "judicailassist",
  //         modelNum: "judicail_assist_num",
  //         thWidthRadio: ["5%", "20%", "20%", "25%", "15%", "15%"],
  //         thName: [intl('28846',"序号"), intl('138592',"被执行人"), intl("138278","股权数额"), intl("138523","执行通知书文号"), intl("138228","执行法院"), intl("30034","类型")],
  //         align: [1, 0, 0, 0, 0, 0],
  //         fields: ["NO.", "executed_person", "stock_share", "exe_notice_no", "exe_court|formatCont", "status"],
  // },

  getjudicialsale: {
    cmd: 'detail/company/get_judicialSale_info',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return {
        ...param,
        underlyingTypeCode: '',
        auctionRoundCode: '',
      }
    },
    downDocType: 'download/createtempfile/get_judicialSale_info',
    moreLink: 'getjudicialsale',
    title: intl('138359', '司法拍卖'),
    hint: intl(
      '365159',
      '司法拍卖，即人民法院在民事案件强制执行程序中，按程序自行进行或委托拍卖公司公开处理债务人的财产，以清偿债权人债权。法院拍卖前应当通知当事人。'
    ),
    modelNum: 'judicialsaleinfoCount',
    selName: ['judicialsaleSelVal'],
    aggName: ['aggs_status'],
    thWidthRadio: ['5.2%', '19%', '10%', '10%', '20%', '15%', '10%', '12%'],
    thName: [
      intl('28846', '序号'),
      intl('19535', '标题'),
      intl('348573', '起拍价（元）'),
      intl('348553', '评估价（元）'),
      intl('311033', '拍卖时间'),
      intl('311060', '处置单位'),
      intl('311053', '拍品类型'),
      intl('138517', '拍卖状态'),
    ],
    align: [1, 0, 0, 0, 0, 0, 0, 0],
    fields: [
      'NO.',
      'title|formatCont',
      'startingPrice',
      'valuationPrice',
      'auctionStartDate',
      'disposalUnit|formatCont',
      'underlyingType|formatCont',
      'auctionStatus|formatCont',
    ],
    columns: [
      null,
      null,
      {
        render: (txt) => {
          return txt ? wftCommon.formatMoney(txt, [4, ' ']) : '--'
        },
      },
      {
        render: (txt) => {
          return txt ? wftCommon.formatMoney(txt, [4, ' ']) : '--'
        },
      },
      {
        render: (_txt, row) => {
          return (
            wftCommon.formatTimeChinese(row['auctionStartDate']) +
            wftCommon.formatCont(row['auctionStartTime']) +
            '时-' +
            wftCommon.formatTimeChinese(row['auctionEndDate']) +
            wftCommon.formatCont(row['auctionEndTime']) +
            '时'
          )
        },
      },
    ],
  },
  showBankruptcy: {
    cmd: 'detail/company/get_bankruptcy',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return {
        ...param,
      }
    },
    title: intl('216410', '破产重整'),
    downDocType: 'bankruptcy',
    modelNum: 'bankruptcyeventCount',
    moreLink: 'showBankruptcy',
    thWidthRadio: ['5.2%', '25%', '22%', '25%', '24%'],
    thName: [
      intl('28846', '序号'),
      intl('138190', '案号'),
      intl('149335', '公开日期'),
      intl('216409', '被申请人'),
      intl('58656', '申请人'),
    ],
    align: [1, 0, 0, 0, 0],
    fields: ['NO.', 'caseNumber', 'time|formatTime', 'respondent', 'applicant'],
    columns: [
      null,
      {
        render: (txt, row) => {
          const detailid = row['bankruptcyReformId']
          const url = `showItemDetail.html?type=bankruptcy&detailid=${detailid}`
          return detailid ? <DetailLink url={url} txt={txt} /> : txt
        },
      },
      null,
      {
        render: (_txt, row) => {
          if (row.respondent && row.respondent.length) {
            return row.respondent.map((t) => {
              return <CompanyLink name={t.windName} id={t.windId} />
            })
            // return txt2;
          }
          return '--'
        },
      },
      {
        render: (_txt, row) => {
          if (row.applicant && row.applicant.length) {
            return row.applicant.map((t) => {
              return <CompanyLink name={t.windName} />
            })
            // return txt2;
          }
          return '--'
        },
      },
    ],
  },
  getevaluation: {
    title: intl('216400', '询价评估'),
    hint: intl('365160', '询价评估的意思是法院对被执行人的资产进行询价并且请专人来评估。'),
    moreLink: 'getevaluation',
    modelNum: corpDetailEvaluation.modelNum,
    rightLink: (data) => {
      return (
        <span className="benefitLink">
          <Button
            onClick={() => {
              downLoadExcel(
                'download/createtempfile/get_evaluation',
                intl('216400', '询价评估'),
                data.companyName,
                data.companyCode
              )
            }}
            icon={<DownloadO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
          >
            {intl('4698', '导出数据')}
          </Button>
        </span>
      )
    },
    children: [
      {
        modelNum: undefined,
        cmd: 'detail/company/get_evaluation',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return {
            ...param,
            dataType: '1',
          }
        },
        title: intl('348574'),
        thWidthRadio: ['5.2%', '24%', '10%', '20%', '14%', '22%', '6%'],
        thName: [
          intl('28846', '序号'),
          intl('138190', '案号'),
          intl('138143', '公示日期'),
          intl('38785', '标的物'),
          intl('348574', '评估结果'),
          intl('216403', '法院'),
          intl('36348', '操作'),
        ],
        align: [1, 0, 0, 0, 2, 0],
        fields: [
          'NO.',
          'caseNo|formatCont',
          'date|formatTime',
          'subjectName|formatCont',
          'evalAmountMax|formatMoneyComma',
          'courtName|formatCont',
          '',
        ],
        columns: [
          null,
          null,
          null,
          null,
          null,
          null,
          {
            render: (_txt, row) => {
              const url = `index.html?reportName=Evaluation&dataType=1&id=${row.id + '|' + row.bdId}#/evaluationDetail`
              return (
                <DetailLink url={url} txt={intl('203754', '详情')} style={{ color: '#0596b3', borderBottom: 'none' }} />
              )
            },
          },
        ],
      },
      {
        modelNum: undefined,
        cmd: 'detail/company/get_evaluation',
        title: intl('439854', '选定评估机构'),
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return {
            ...param,
            dataType: '2',
          }
        },
        thWidthRadio: ['5.2%', '10%', '20%', '18%', '20%', '22%', '6%'],
        thName: [
          intl('28846', '序号'),
          intl('138143', '公示日期'),
          intl('38785', '标的物'),
          intl('138190', '案号'),
          intl('216403', '法院'),
          intl('439854', '选定评估机构'),
          intl('36348', '操作'),
        ],
        align: [1, 0, 0, 0, 0, 0],
        fields: [
          'NO.',
          'date|formatTime',
          'subjectName|formatCont',
          'caseNo|formatCont',
          'courtName|formatCont',
          'evalAmountMax|formatMoneyComma',
          '',
        ],
        columns: [
          null,
          null,
          null,
          null,
          null,
          {
            render: (_txt, row) => {
              const { orgs } = row
              return orgs.map((i) => (
                <p
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {i.companyName}
                </p>
              ))
            },
          },
          {
            render: (_txt, row) => {
              const url = `index.html?reportName=Evaluation&dataType=2&id=${row.id + '|' + row.bdId}#/evaluationDetail`
              return (
                <DetailLink url={url} txt={intl('203754', '详情')} style={{ color: '#0596b3', borderBottom: 'none' }} />
              )
            },
          },
        ],
      },
    ],
  },
}
