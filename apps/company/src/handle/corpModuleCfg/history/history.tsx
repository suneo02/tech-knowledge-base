import { Links } from '@/components/common/links'
import CompanyLink from '@/components/company/CompanyLink.tsx'
import { DetailLink, showChain } from '@/components/company/corpCompMisc.tsx'
import { LinkByRowCompatibleCorpPerson } from '@/components/company/link/CorpOrPersonLink.tsx'
import { ICorpPrimaryModuleCfg } from '@/components/company/type'
import {
  CompanyHistoryPatentCfg,
  corpDetailHisEquityPledge,
  corpDetailHisEquityPledgePawnee,
  corpDetailHisEquityPledgePCorp,
  corpDetailHisEquityPledgor,
} from '@/handle/corpModuleCfg'
import { LinksModule } from '@/handle/link'
import { intlNoNO as intl } from '@/utils/intl'
import { hashParams } from '@/utils/links'
import { wftCommon } from '@/utils/utils.tsx'
import React from 'react'
import { vipDescDefault } from '../common/vipDesc'

const { getParamValue } = hashParams()

export const history: ICorpPrimaryModuleCfg = {
  moduleTitle: {
    title: intl('33638', '历史数据'),
    moduleKey: 'history', // 与左侧大菜单齐名
    noneData: intl('348939', '暂无历史数据'),
  },
  showHistoryChange: {
    title: window.en_access_config ? 'History Changes' : '变更历史',
    modelNum: 'changeHistoryCount',
    notVipTitle: window.en_access_config ? 'History Changes' : '变更历史',
    notVipTips: vipDescDefault,
  },
  historycompany: {
    cmd: 'detail/company/historyinfo',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('138603', '历史工商信息'),
    moreLink: 'historyinfo',
    modelNum: 'his_business_info_num',
    thWidthRadio: ['5.2%', '26%', '26%', '44%'],
    thName: [intl('203850', '类别'), intl('19528', '时间'), intl('31887', '信息')],
    align: [0, 0, 0],
    fields: ['type', 'date', 'info'],
    notVipTitle: intl('138603', '历史工商信息'),
    notVipTips: '购买企业套餐，即可查看该企业历史工商信息',
  },

  historyshareholder: {
    cmd: '/detail/company/gethisshareholder',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('348171', '历史股东信息'),
    downDocType: 'download/createtempfile/gethisshareholder',
    moreLink: 'historyshareholder',
    modelNum: 'his_shareholder_num',
    thWidthRadio: ['5.2%', '', '12%', '12%', '12%', '8%'],
    thName: [
      intl('28846', '序号'),
      intl('32959', '股东'),
      intl('417638', '首次参股日期'),
      intl('348185', '退出时持股比例'),
      intl('63486', '退出日期'),
      intl('36348', '操作'),
    ],
    align: [1, 0, 0, 2, 0, 0],
    fields: [
      'NO.',
      'sharehold_name',
      'start_date|formatTime',
      'shareholding_radio|formatPercent',
      'exit_date|formatTime',
      '',
    ],
    columns: [
      null,
      {
        render: (_txt, row) => {
          return (
            <LinkByRowCompatibleCorpPerson
              nameKey={'sharehold_name'}
              idKey={'sharehold_id'}
              typeKey={'sharehold_type'}
              row={row}
            />
          )
        },
      },
      null,
      null,
    ],
    notVipTitle: intl('138326', '历史股东'),
    notVipTips: '购买企业套餐，即可查看该企业历史股东信息',
    dataCallback: (res, _num, pageno) => {
      res.map((t, idx) => {
        t.key = t.key ? t.key : idx + pageno * 10
      })
      return res
    },
  },
  historylegalperson: {
    cmd: 'detail/company/gethismanager',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('208386', '历史法人和高管'),
    moreLink: 'historylegalperson',
    modelNum: 'his_manager_num',
    downDocType: 'download/createtempfile/gethismanager',
    thWidthRadio: ['5.2%', '24%', '24%', '24%', '24%'],
    thName: [
      intl('28846', '序号'),
      intl('34979', '姓名'),
      intl('138728', '职务'),
      intl('261229', '上任日期'),
      intl('259985', '离任日期'),
    ],
    columns: [
      null,
      {
        render: (txt, row) => <Links title={txt} id={row.person_id} module={LinksModule.CHARACTER} />,
      },
    ],
    align: [1, 0, 0, 0, 0],
    fields: ['NO.', 'person_name', 'person_position', 'employment_date|formatTime', 'departure_date|formatTime'],
    notVipTitle: intl('208386', '历史法人和高管'),
    notVipTips: '购买企业套餐，即可查看该企业历史法人和高管信息',
  },

  // 新接口，国际化还未完成，先不上
  historyinvest: {
    cmd: 'detail/company/gethisinvest',
    title: intl('142472', '历史对外投资'),
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    downDocType: 'hisinvest',
    moreLink: 'historyinvest',
    modelNum: 'his_invest_num',
    thWidthRadio: ['5.2%', '20%', '15%', '16%', '10%', '10%', '10%'],
    thName: [
      intl('28846', '序号'),
      intl('265558', '被投企业'),
      intl('261159', '被投企业法人'),
      intl('35779', '注册资本'),
      intl('356653', '退出前持股比例'),
      intl('101026', '投资日期'),
      intl('63486', '退出日期'),
    ],
    align: [1, 0, 0, 2, 2, 0, 0],
    fields: [
      'NO.',
      'investcompany_name',
      'legal_name',
      'registeredCapital',
      'invest_radio|formatPercent',
      'start_date|formatTime',
      'exit_date|formatTime',
    ],
    columns: [
      null,
      {
        render: (txt, row) => {
          return <CompanyLink name={txt} id={row.investcompany_id} />
        },
      },
      {
        render: (txt, row) => {
          return <CompanyLink name={txt} id={row.legal_id} />
        },
      },
      {
        render: (txt, row) => {
          if (txt == 0 || !txt) {
            return '--'
          } else {
            return wftCommon.formatMoney(txt) + ' ' + (row.regCurrency ? row.regCurrency : '--')
          }
        },
      },
      null,
    ],
    notVipTitle: intl('142472', '历史对外投资'),
    notVipTips: '购买企业套餐，即可查看该企业历史对外投资信息',
  },

  historydomainname: {
    cmd: 'detail/company/gethisdomain',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('205871', '历史网站备案'),
    moreLink: 'historydomainname',
    modelNum: 'his_domain_num',
    /* 后续更改 */
    thWidthRadio: ['5.2%', '20%', '24%', '15%', '20%', '17%'],
    thName: [
      intl('28846', '序号'),
      intl('138578', '网站名称'),
      intl('138805', '网址'),
      intl('138266', '域名'),
      intl('348793', '网站备案/许可证号'),
      intl('348177', '审核通过日期'),
    ],
    align: [1, 0, 0, 0, 0, 0],
    fields: [
      'NO.',
      'web_name|formatCont',
      'webHomePage',
      'domain_name|formatCont',
      'web_number|formatCont',
      'audit_transit_time|formatTime',
    ],
    columns: [
      null,
      null,
      {
        render: (txt, row) => {
          const url = row['webHomePage']
          return (
            <DetailLink
              url={url}
              txt={txt}
              openFunc={() => {
                url && window.open('http://' + url, '_blank')
              }}
            />
          )
        },
      },
    ],
    notVipTitle: intl('205871', '历史网站备案'),
    notVipTips: '购买企业套餐，即可查看该企业历史网站备案信息',
  },
  historyshowPledgedstock: {
    title: intl('205868', '历史股权出质'),
    modelNum: corpDetailHisEquityPledge.modelNum,
    notVipTitle: intl('205868', '历史股权出质'),
    notVipTips: '购买企业套餐，即可查看该企业历史股权出质信息',
    withTab: true,
    children: [
      {
        title: intl('138447', '出质人'),
        modelNum: corpDetailHisEquityPledgor.modelNum,
        cmd: 'detail/company/gethisequitypledgelist_pledgor',
        thWidthRadio: ['5.2%', '10%', '15%', '15%', '15%', '16%', '10%', '10%'],
        thName: [
          intl('28846', '序号'),
          intl('138769', '登记编号'),
          intl('138447', '出质人'),
          intl('138446', '质权人'),
          intl('138528', '出质股权标的企业'),
          intl('143251', '出质股权数额（万股）'),
          intl('87749', '登记日期'),
          intl('32098', '状态'),
        ],
        align: [1, 0, 0, 0, 0, 2, 0, 0, 0],
        fields: [
          'NO.',
          'ep_reg_no',
          'ep_pledgor_name',
          'ep_pawnee_name',
          'ep_plex',
          'ep_equity_amount|formatMoneyComma',
          'ep_reg_date|formatTime',
          'ep_reg_state',
        ],
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        columns: [
          null,
          null,
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.ep_pledgor_id}></CompanyLink>
            },
          },
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.ep_pawnee_id}></CompanyLink>
            },
          },
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.ep_plex_id}></CompanyLink>
            },
          },
          null,
          null,
          {
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
        title: intl('138446', '质权人'),
        modelNum: corpDetailHisEquityPledgePawnee.modelNum,
        cmd: 'detail/company/gethisequitypledgelist_pawnee',
        thWidthRadio: ['5.2%', '16%', '15%', '15%', '15%', '10%', '10%', '10%'],
        thName: [
          intl('28846', '序号'),
          intl('138769', '登记编号'),
          intl('138447', '出质人'),
          intl('138446', '质权人'),
          intl('138528', '出质股权标的企业'),
          intl('143251', '出质股权数额（万股）'),
          intl('87749', '登记日期'),
          intl('32098', '状态'),
        ],
        align: [1, 0, 0, 0, 0, 2, 0, 0, 0],
        fields: [
          'NO.',
          'ep_reg_no',
          'ep_pledgor_name',
          'ep_pawnee_name',
          'ep_plex',
          'ep_equity_amount|formatMoneyComma',
          'ep_reg_date|formatTime',
          'ep_reg_state',
        ],
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        columns: [
          null,
          null,
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.ep_pledgor_id}></CompanyLink>
            },
          },
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.ep_pawnee_id}></CompanyLink>
            },
          },
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.ep_plex_id}></CompanyLink>
            },
          },
          null,
          null,
          {
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
        title: intl('138527', '出质标的'),
        modelNum: corpDetailHisEquityPledgePCorp.modelNum,
        cmd: 'detail/company/gethisequitypledgelist',
        thWidthRadio: ['5.2%', '16%', '15%', '15%', '15%', '10%', '10%', '10%'],
        thName: [
          intl('28846', '序号'),
          intl('138769', '登记编号'),
          intl('138447', '出质人'),
          intl('138446', '质权人'),
          intl('138528', '出质股权标的企业'),
          intl('143251', '出质股权数额（万股）'),
          intl('87749', '登记日期'),
          intl('32098', '状态'),
        ],
        align: [1, 0, 0, 0, 0, 2, 0, 0, 0],
        fields: [
          'NO.',
          'ep_reg_no',
          'ep_pledgor_name',
          'ep_pawnee_name',
          'ep_plex',
          'ep_equity_amount|formatMoneyComma',
          'ep_reg_date|formatTime',
          'ep_reg_state',
        ],
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        columns: [
          null,
          null,
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.ep_pledgor_id}></CompanyLink>
            },
          },
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.ep_pawnee_id}></CompanyLink>
            },
          },
          {
            render: (txt, row, _idx) => {
              return <CompanyLink name={txt} id={row.ep_plex_id}></CompanyLink>
            },
          },
          null,
          null,
          {
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
    ],
  },

  getlandmortgage: {
    //历史土地抵押
    cmd: 'detail/company/getlandmortgage',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('332513', '历史土地抵押'),
    moreLink: 'getlandmortgage',
    modelNum: 'landmortgage_num',
    thWidthRadio: ['5.2%', '19%', '15%', '15%', '15%', '15%', '17%'],
    thName: [
      intl('28846', '序号'),
      intl('205434', '地块位置'),
      intl('138392', '抵押人'),
      intl('138391', '抵押权人'),
      intl('205408', '抵押面积(公顷)'),
      intl('205409', '抵押金额(万元)'),
      intl('205394', '起止日期'),
    ],
    align: [1, 0, 0, 0, 0, 0, 0],
    fields: ['NO.', 'landPos', 'landMger', 'landMgee', 'landHa', 'landMgAmt|formatMoneyComma', 'landMgStart'],
    notVipTitle: intl('332513', '历史土地抵押'),
    notVipTips: '购买企业套餐，即可查看该企业历史土地抵押信息',
  },
  getmultiplecertificate: {
    cmd: 'detail/company/getcompanycertificate_companyCertificate',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    notVipTitle: intl('145871', '“多证合一”信息公示'),
    notVipTips: vipDescDefault,
    title: intl('145871', '“多证合一”信息公示'),
    moreLink: 'getmultiplecertificate',
    modelNum: 'company_certificate_num',
    thWidthRadio: ['5.2%', '27%', '69%'],
    thName: [intl('28846', '序号'), intl('145872', '备案事项名称'), intl('203750', '备注')],
    align: [1, 0, 0],
    fields: ['NO.', 'item_name', 'remark'],
    rightLink: (_data) => {
      if (window.en_access_config) {
        return (
          <span
            style={{
              fontSize: '12px',
              fontWeight: 'normal',
              color: '#999',
              display: 'inline-block',
              width: '500px',
              marginTop: '-8px',
            }}
          >
            {intl('348186', '下列证照事项通过"多证合一"已整合至该企业营业执照')}
          </span>
        )
      }
      return (
        <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#999' }}>
          {intl('348186', '下列证照事项通过"多证合一"已整合至该企业营业执照')}
        </span>
      )
    },
  },
  getvoidagestatement: {
    cmd: 'detail/company/getlicenseabolish_licenseAbolish',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    notVipTitle: intl('145865', '营业执照作废声明'),
    notVipTips: vipDescDefault,
    title: intl('145865', '营业执照作废声明'),
    moreLink: 'getvoidagestatement',
    modelNum: 'license_abolish_num',
    thWidthRadio: ['5.2%', '15%', '15%', '25%', '17%', '24%'],
    thName: [
      intl('28846', '序号'),
      intl('145866', '声明日期'),
      intl('145867', '正副本'),
      intl('145868', '声明内容'),
      intl('145869', '副本编号'),
      intl('145870', '补领情况'),
    ],
    align: [1, 0, 0, 0, 0, 0],
    fields: [
      'NO.',
      'declaration_date|formatTime',
      'original_or_copy',
      'declaration_content',
      'duplicate_no',
      'replacement_status',
    ],
  },
  beneficiary: {
    title: intl('439434', '历史最终受益人'),
    cmd: 'detail/company/gethistoricalbeneficiary',
    notVipTitle: intl('439434', '历史最终受益人'),
    notVipTips: vipDescDefault,
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return {
        ...param,
      }
    },
    thName: [
      intl('28846', '序号'),
      intl('138180', '最终受益人'),
      intl('261486', '最终受益股份'),
      intl('451201', '变更日期'),
    ],
    fields: ['NO.', 'beneficiaryName', 'ratio', 'endDate'],
    align: [0, 0, 2, 0],
    thWidthRadio: ['5.2%', '70%', '16%', '20%'],
    modelNum: 'historicalbeneficiaryCount',
    columns: [
      null,
      null,
      {
        render: (txt, row, _idx) => {
          if (window.en_access_config) {
            return wftCommon.formatPercent(txt) // 临时处理
          }
          if (row.shareRoute && row.shareRoute.length > 0) {
            const shareRate = wftCommon.ultimateBeneficialShares(row.shareRoute)
            return (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: 140 }}>{shareRate ? (shareRate == 0 ? '--' : shareRate) : '--'}</div>
                <div
                  className="share-route"
                  onClick={() => wftCommon.showRoute(row.shareRoute)}
                  data-uc-id="oOEwLhnQj"
                  data-uc-ct="div"
                ></div>
              </div>
            )
          } else {
            return wftCommon.formatPercent(txt)
          }
        },
      },
      null,
    ],
  },
  ultimatecontroller: {
    title: intl('439454', '历史实际控制人'),
    cmd: 'detail/company/gethistoricalcontroller',
    notVipTitle: intl('439454', '历史实际控制人'),
    notVipTips: vipDescDefault,
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return {
        ...param,
      }
    },
    thName: [
      intl('28846', '序号'),
      intl('439435', '实控人名称'),
      intl('138412', '实际持股比例'),
      intl('451201', '变更日期'),
    ],
    fields: ['NO.', 'controllerName', 'ratio', 'endDate'],
    align: [0, 0, 2, 0],
    thWidthRadio: ['5.2%', '70%', '16%', '20%'],
    modelNum: 'historicalcontrollerCount',
    columns: [
      null,
      null,
      {
        render: (rate, row) => {
          return showChain(
            rate,
            row,
            { left: '历史实控人', right: intl('138412', '实际持股比例') },
            {
              api: `detail/company/getcorpactcontrolshareroute/${getParamValue('companycode')}`,
              params: { detailId: row.detailId },
            }
          )
        },
      },
    ],
  },
  historypatent: CompanyHistoryPatentCfg,
}
