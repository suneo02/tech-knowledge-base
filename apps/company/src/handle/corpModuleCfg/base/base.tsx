import { pointBuriedNew } from '@/api/configApi.ts'
import { getApiPathsUrl } from '@/api/paths'
import { commonBuryList } from '@/api/pointBuried'
import Links from '@/components/common/links/Links.tsx'
import { RightGotoLink } from '@/components/common/RightGotoLink'
import CompanyLink from '@/components/company/CompanyLink.tsx'
import { addChangeTag, benfitRender, DetailLink, downLoadExcel, showChain } from '@/components/company/corpCompMisc.tsx'
import { CHART_HASH } from '@/components/company/intro/charts'
import { CorpOrPersonLinkWithTag, LinkByRowCompatibleCorpPerson } from '@/components/company/link/CorpOrPersonLink.tsx'
import { ICorpPrimaryModuleCfg } from '@/components/company/type'
import LongTxtLabel from '@/components/LongTxtLabel.tsx'
import { ECorpDetailTable } from '@/handle/corp/detail/module/type.ts'
import {
  CompanyDetailShareholderAnnouncementReportCfg,
  CompanyDetailShareholderAnnouncementUnRegularCfg,
  corpDetailBaseActualCtrl,
  corpDetailComapnyNotice,
  corpDetailFinalBeneficiary,
  corpDetailFinalBeneficiaryInstitution,
  corpDetailFinalBeneficiaryOwner,
  corpDetailFinalBeneficiaryPerson,
  corpDetailGroup,
} from '@/handle/corpModuleCfg'
import { corpDetailDirectInvest } from '@/handle/corpModuleCfg/base/directIntest.tsx'
import {
  corpDetailIndustrialRegist,
  corpDetailLastNotice,
  corpDetailMainMember,
} from '@/handle/corpModuleCfg/base/mainMember.ts'
import { CorpDetailNoColumn } from '@/handle/corpModuleCfg/common/columns.ts'
import { CompanyDetailMajorShareholderCfg } from '@/handle/corpModuleCfg/Shareholder/major'
import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { formatCurrency } from '@/utils/common.ts'
import { isDev } from '@/utils/env'
import { intlNoNO as intl } from '@/utils/intl'
import { hashParams } from '@/utils/links'
import { TooltipMap } from '@/utils/TooltipUtil.ts'
import { wftCommon } from '@/utils/utils.tsx'
import { wftCommonType } from '@/utils/WFTCommonWithType'
import { ArrowDownO, ArrowUpO, DownloadO } from '@wind/icons'
import { Button, Tag } from '@wind/wind-ui'
import React from 'react'
import { CompanyDetailBJEEShareholderCfg } from '../Shareholder/bjee'
import { getIndustryColumns } from './baseIndustry/renderIndustry'
import { ShowShareSearchLayerByMergeSharePath } from './ShowShareSearch/CombinedStatistics'
import { ShowShareSearchLayerByLayerSharePath } from './ShowShareSearch/showShareSearch'

const { getParamValue } = hashParams()

const STRINGS = {
  DESCRIBE: intl(
    '449722',
    '战略性新兴产业、高技术产业（服务业）、农业及相关产业、数字核心产业、养老产业、绿色低碳转型产业的分类具有置信度等级'
  ),
  HIGH: intl('449775', '1：基于官方文件直接分类，具有高关联性'),
  MEDIUM: intl('449723', '2：结合企业主营特征等公开数据分类，具有较高关联性'),
  LOW: intl('449774', '3：结合企业主营特征等公开数据分类，具有较低关联性'),
}

export const base: ICorpPrimaryModuleCfg = {
  HKCorpInfo: {
    custom: true,
    modelNum: 'hkUnlisted',
  },
  showIndustry: {
    cmd: '/detail/company/getcorpindustry',
    title: intl('449235', '所属行业/产业'), // TODO 国际化
    modelNum: 'industryCount',
    tooltips: (
      <>
        {STRINGS.DESCRIBE}
        <br />
        {STRINGS.HIGH}
        <br />
        {STRINGS.MEDIUM}
        <br />
        {STRINGS.LOW}
      </>
    ),
    columns: getIndustryColumns(),
    numHide: true,
    extraParams: (param) => ({
      ...param,
      __primaryKey: param.companycode,
    }),
    pageSize: 3,
    horizontalTable: true,
    hideRowIfEmpty: true,
  },
  showActualController: {
    title: intl('13270', '实际控制人'),
    modelNum: corpDetailBaseActualCtrl.modelNum,
    numHide: true,
    hint:
      '<i><div><span>' +
      intl('372165', '实际控制人指通过投资关系、协议或者其他安排，能够实际支配公司行为的自然人、法人或者其他组织。') +
      '</span></div></i>',
    children: [
      {
        title: intl('312174', '公告披露'),
        hint: '<i><div><span>' + intl('372190', '企业年报、公告披露的实际控制人。') + '</span></div></i>',
        cmd: '/detail/company/getcorpactcontrol_publish',
        thWidthRadio: ['5.2%', '76', '20%'],
        modelNum: 'actualcontrollerPublishCount',
        thName: [intl('28846', '序号'), intl('37962', '实际控制人名称'), intl('451217', '持股比例(%)')],
        align: [1, 0, 2],
        fields: ['NO.', 'ActControName', 'ActInvestRate'],
        extraParams: (param) => {
          return {
            ...param,
            __primaryKey: param.companycode,
          }
        },
        columns: [
          null,
          {
            render: (txt, row) => {
              let module
              if (row.typeName === 'company') {
                module = LinksModule.COMPANY
              }
              if (row.typeName === 'person') {
                module = LinksModule.CHARACTER
              }
              return (
                <>
                  <Links module={module} id={row.ActControId} title={txt} />
                  {row.actor?.length
                    ? row.actor.map((num) => (
                        // @ts-expect-error ttt
                        <Tag
                          size="mini"
                          key={num}
                          color="color-1"
                          type="primary"
                          style={{ margin: 0, marginInlineStart: 6 }}
                        >
                          一致行动人{num}
                        </Tag>
                      ))
                    : null}
                </>
              )
            },
          },
          {
            render: (rate, row) => {
              return showChain(
                rate,
                row,
                {
                  left: intl('13270', '实际控制人'),
                  right: intl('138412', '实际持股比例'),
                },
                {
                  api: `detail/company/getcorpactcontrolshareroute/${getParamValue('companycode')}`,
                  params: { detailId: row.detailId },
                },
                {
                  moduleId: 922602100967,
                  entity: intl('13270', '实际控制人'),
                }
              )
            },
          },
        ],
      },
      {
        title: intl('261456', '疑似实控人'),
        hint:
          '<i><div><span>' +
          intl(
            '372191',
            '全球企业库依据股权穿透计算后得出疑似实际控制人，企业在公司章程或股东协议中或许有其他安排，在使用该数据前建议跟企业做进一步核实。数据仅供用户参考，不代表全球企业库的任何明示、暗示之观点或保证。'
          ) +
          '</span></div></i>',
        cmd: '/detail/company/getcorpactcontrol_calc',
        thWidthRadio: ['5.2%', '76', '20%'],
        modelNum: 'actualcontrollerCalcCount',
        thName: [intl('28846', '序号'), intl('298298', '疑似实控人名称'), intl('451217', '持股比例(%)')],
        align: [1, 0, 2],
        fields: ['NO.', 'ActControName', 'ActInvestRate'],
        extraParams: (param) => {
          return {
            ...param,
            __primaryKey: param.companycode,
          }
        },
        columns: [
          null,
          {
            render: (txt, row) => {
              let module
              if (row.typeName === 'company') {
                module = LinksModule.COMPANY
              }
              if (row.typeName === 'person') {
                module = LinksModule.CHARACTER
              }
              return <Links title={txt} id={row.ActControId} module={module} />
            },
          },
          {
            render: (rate, row) => {
              return showChain(
                rate,
                row,
                {
                  left: intl('261456', '疑似实控人'),
                  right: intl('138412', '实际持股比例'),
                },
                {
                  api: `detail/company/getcorpactcontrolshareroute/${getParamValue('companycode')}`,
                  params: { detailId: row.detailId },
                },
                {
                  moduleId: 922602100967,
                  entity: intl('261456', '疑似实控人'),
                }
              )
            },
          },
        ],
      },
    ],
    rightLink: (data) => {
      return (
        <span className={'benefitLink'}>
          <RightGotoLink
            txt={intl('356113', '实控人图谱')}
            func={() => {
              const url = `index.html?isSeparate=1&nosearch=1&companycode=${data.companyCode}&companyname=${data.companyName}&activeKey=chart_yskzr#/${CHART_HASH}`
              wftCommon.jumpJqueryPage(url)
            }}
          ></RightGotoLink>
          <Button
            onClick={() => {
              downLoadExcel(
                'download/createtempfile/getcorpactcontrol',
                intl('13270', '实际控制人'),
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
  },
  /* 股东信息 */
  showShareholder: {
    title: intl('138506', '股东信息'),
    modelNum: undefined,
    children: [
      CompanyDetailShareholderAnnouncementUnRegularCfg,
      CompanyDetailShareholderAnnouncementReportCfg,
      CompanyDetailMajorShareholderCfg,
      CompanyDetailBJEEShareholderCfg,
      {
        enumKey: ECorpDetailTable.ShareholderBusinessRegistration,
        title: intl('312175', '工商登记'),

        hint: `<i><div><span>${intl(
          TooltipMap.CompanyDetailShareholderInfoBusinessRegistration.intlId,
          TooltipMap.CompanyDetailShareholderInfoBusinessRegistration.default
        )}</span></div></i>`,

        downDocType: 'download/createtempfile/getshareholderinfomation',
        modelNum: 'businessregisterCount',
        thName: [
          '',
          intl('144304', '发起人'),
          intl('451217', '持股比例'),
          intl('451204', '认缴出资（万元）'),
          intl('222784', '实缴出资（万元）'),
          intl('389433', '认缴日期'),
        ],
        align: [1, 0, 2, 2, 2, 2],
        fields: [
          'NO.',
          'shareholder',
          'percentage',
          'promiseMoneyAmount',
          'realMoneyAmount',
          'subscriptionDate|formatTime',
        ],
        columns: [
          {
            width: CorpDetailNoColumn.width,
          },
          {
            width: '24%',
            render: (_txt, row, _idx) => (
              <CorpOrPersonLinkWithTag
                nameKey={'shareholder'}
                idKey={'shareholderId'}
                row={row}
                isBeneficiary={row.benifciary}
                isChangeName={row.nameChanged}
                isActCtrl={row.actContrl}
              />
            ),
          },
          {
            width: '22%',
            render: (txt) => wftCommonType.displayPercent(txt),
          },
          {
            render: (txt, row) => {
              if (txt == 0 || !txt) {
                return '--'
              } else {
                return wftCommon.formatMoney(txt, [4, ' ']) + (row.promiseMoneyCurrency ? row.promiseMoneyCurrency : '')
              }
            },
          },
          {
            render: (txt, row) => {
              if (txt == 0 || !txt) {
                return '--'
              } else {
                return wftCommon.formatMoney(txt, [4, ' ']) + (row.realMoneyCurrency ? row.realMoneyCurrency : '')
              }
            },
          },
        ],
        cmd: '/detail/company/getshareholderinfomation',
        extraParams: (param) => {
          return {
            ...param,
            expoVer: 1,
            __primaryKey: param.companycode,
          }
        },
      },
    ],
  },
  showVietnamIndustry: {
    cmd: '/detail/company/getvietnamcorpindustry',
    title: intl('24413', '所属行业'),
    modelNum: 'vietnamCorpIndustryNum',
    thWidthRadio: ['4%', '76', '20%'],
    thName: [intl('28846', '序号'), intl('257653', '行业'), '是否主营行业'],
    align: [1, 0, 0],
    fields: ['NO.', 'industryName', 'isMain'],
    dataComment: `${intl('342096', '数据来源')} ：越南商业登记管理局`,
    extraParams: (param) => {
      return {
        ...param,
        __primaryKey: param.companycode,
      }
    },
  },
  /* 股东穿透 */
  showShareSearch: {
    cmd: '/detail/company/getshareholdertrace',
    modelNum: undefined,
    needNoneTable: true,
    title: intl('228894', '股东穿透'),
    selName: ['shareSearchLev', 'shareSearchRadio'],
    thWidthRadio: ['5.2%', '24%', '11%', '11%', '50%'],
    thName: [
      intl('28846', '序号'),
      intl('138783', '股东名称'),
      intl('451200', '层级'),
      intl('451217', '持股比例(%)'),
      intl('231780', '持股路径'),
    ],
    align: [1, 0, 1, 2, 0],
    fields: ['NO.', 'shareholderName', 'level', 'breakThroughPercent', 'path-x'],
    extraParams: (param) => {
      return {
        ...param,
        __primaryKey: param.companycode,
        type: 1,
        percent: '',
        level: '6',
      }
    },
    columns: [
      null,
      {
        render: (_txt, row) => {
          /**
           * 1：有企业编码的企业，则第三位是企业编码
           * 2：无企业编码的企业，则第三位是企业名
           * 3：有个人编码的个人，则第三位是个人编码
           * 4：无个人编码的个人，则第三位是个人名
           * 5：有基金编码的基金，则第三位是基金编码
           */
          return (
            <LinkByRowCompatibleCorpPerson
              nameKey={'shareholderName'}
              idKey={'shareholderId'}
              typeKey={'typeName'}
              row={row}
            />
          )
        },
      },
      null,

      {
        render: (txt) => wftCommonType.displayPercent(txt),
      },
      {
        render: (_txt, row) => {
          return <ShowShareSearchLayerByLayerSharePath row={row} />
        },
      },
    ],
    typeMergence: {
      thWidthRadio: ['5.2%', '24%', '11%', '61%'],
      thName: [
        intl('28846', '序号'),
        intl('138783', '股东名称'),
        intl('349496', '合计持股比例'),
        intl('231780', '持股路径'),
      ],
      align: [1, 0, 2, 0],
      fields: ['NO.', 'shareholderName', 'breakThroughPercent', 'path-x'],
      columns: [
        null,
        {
          render: (_txt, row) => {
            return (
              <LinkByRowCompatibleCorpPerson
                nameKey={'shareholderName'}
                idKey={'shareholderId'}
                typeKey={'typeName'}
                row={row}
              />
            )
          },
        },

        {
          render: (txt) => wftCommonType.displayPercent(txt),
        },
        {
          render: (_txt, row, _idx) => {
            return <ShowShareSearchLayerByMergeSharePath row={row} />
          },
        },
      ],
    },
    extension: {
      tabs: [
        {
          name: intl('369953', '逐层展示'),
          value: 1,
        },
        {
          name: intl('369973', '合并统计'),
          value: 2,
        },
      ],
    },
  },
  /* 股权穿透图 */
  getShareAndInvest: {
    title: intl('138279', '股权穿透图'),
    modelNum: true,
    notVipTitle: intl('138279', '股权穿透图'),
  },
  /* 股东变更 */
  showshareholderchange: {
    // cmd: 'getshareholderchange',
    cmd: '/detail/company/getshareholderchange',
    hint: intl(
      '437438',
      '上市/挂牌（主板、科创板、创业板、北交所、新三板、新四板）、发债企业等股东数据来源包含公司年报、公告，公告和年报中主要披露十大股东数据。此处上市/挂牌、发债企业股东变更类型中的新增和退出代表新进入十大股东和退出十大股东。'
    ),
    title: intl('451218', '股东变更'),
    moreLink: 'showshareholderchange',
    modelNum: 'shareholder_change_num',
    selName: ['shareholderchangeSelVal'],
    aggName: ['aggs_change_type'],
    thWidthRadio: ['5.2%', '26%', '8%', '10%', '13%', '10%', '10%', '10%'],
    thName: [
      intl('28846', '序号'),
      intl('138783', '股东名称'),
      intl('451219', '变更类型'),
      intl('451201', '变更日期'),
      intl('313153', '变更前认缴金额'),
      intl('175428', '变更前持股比例'),
    ],
    align: [1, 0, 0, 0, 2, 2, 2, 2],
    bordered: 'dotted',
    fields: [
      'NO.',
      'shareholder_name',
      'change_type',
      'change_date|formatTime',
      'before_change_amount|formatMoneyComma',
      'before_change_rate|formatPercent',
    ],
    dataCallback: (res) => {
      return res.list && res.list.length ? res.list : []
    },
    columns: [
      null,
      {
        render: (txt, row) => {
          let module
          if (row.shareholder_type === '1') {
            module = LinksModule.CHARACTER
          }
          if (row.shareholder_type === '2') {
            module = LinksModule.COMPANY
          }
          return <Links title={txt} id={row.shareholder_id} module={module} />
        },
      },
      null,
      null,
      {
        title: intl('451202', '变更前'),
        align: 'center',
        children: [
          {
            title: intl('451204', '认缴出资（万元）'),
            dataIndex: 'before_change_amount',
            align: 'right',
            render: (txt, row) => {
              return formatCurrency(txt, row.currency)
            },
          },
          {
            title: intl('451217', '持股比例'),
            dataIndex: 'before_change_rate',
            align: 'right',
            render: (txt, _row) => {
              return wftCommon.formatPercent(txt)
            },
          },
        ],
      },
      {
        title: intl('451203', '变更后'),
        align: 'center',
        children: [
          {
            title: intl('451204', '认缴出资（万元）'),
            dataIndex: 'after_change_amount',
            align: 'right',
            render: (txt, row) => {
              return formatCurrency(txt, row.currency)
            },
          },
          {
            title: intl('451217', '持股比例'),
            dataIndex: 'after_change_rate',
            align: 'right',
            render: (txt, _row) => {
              return wftCommon.formatPercent(txt)
            },
          },
        ],
      },
    ],
    rightFilters: [
      {
        key4sel: 'aggs_change_type',
        key4ajax: 'changeType',
        name: intl('261192', '全部变更类型'),
        key: '',
        typeOf: 'string',
      },
    ],
    extraParams: (param) => {
      return {
        ...param,
        __primaryKey: param.companycode,
        changeType: '',
      }
    },
  },
  /* 分支机构 */
  showCompanyBranchInfo: {
    cmd: '/detail/company/getnewcompanybranchinfo_branch',
    moreLink: 'showCompanyBranchInfo',
    downDocType: 'download/createtempfile/getbranch',
    title: intl('138183', '分支机构'),
    modelNum: 'new_branch_num',
    thWidthRadio: ['5.2%', '38%', '30%', '14%', '14%'],
    thName: [
      intl('28846', '序号'),
      intl('138677', '企业名称'),
      intl('451206', '法定代表人'),
      intl('138416', '经营状态'),
      intl('451207', '注册日期'),
    ],
    align: [1, 0, 0, 0, 0],
    fields: ['NO.', 'branch_name', 'branch_person', 'branch_state', 'branch_date|formatTime'],
    columns: [
      null,
      {
        render: (txt, row, _idx) => {
          return <CompanyLink name={txt} id={row.branch_id} />
        },
      },
      null,
      {
        render: (txt, row) => {
          if (wftCommon.unNormalStatus.indexOf(row.branch_state) > -1) {
            return <span style={{ color: '#e50113' }}> {txt} </span>
          }
          return txt
        },
      },
    ],
    extraParams: (param) => {
      return {
        ...param,
        __primaryKey: param.companycode,
      }
    },
  },

  /* 控股企业 */
  showControllerCompany: {
    cmd: '/detail/company/getcontrolledcorplistnew',
    title: intl('451208', '控股企业'),
    hint: `<i><div><span>${intl(TooltipMap.CompanyDetailHoldingCompanies.intlId, TooltipMap.CompanyDetailHoldingCompanies.default)}</span></div></i>`,
    needNoneTable: true,
    downDocType: 'download/createtempfile/getcontrolledcorplistnew',
    modelNum: 'e_holdingEnterprise_count',
    numHide: true,
    selName: ['controlStatusVal', 'sortControlList'],
    aggName: ['aggs_reg_state', ''],
    thWidthRadio: ['5.2%', '24%', '10%', '15%', '10%', '32%'],
    thName: [
      intl('28846', '序号'),
      intl('138677', '企业名称'),
      intl('138416', '经营状态'),
      intl('451220', '注册资本（万）'),
      intl('451217', '持股比例'),
      intl('451209', '股权链'),
    ],
    align: [1, 0, 0, 2, 2],
    fields: [
      'NO.',
      'invest_name',
      'invest_reg_status',
      'invest_reg_capital',
      'rate|formatPercent',
      'realStockPathList',
    ],
    notVipTitle: intl('451208', '控股企业'),
    notVipTips: intl('208265', '购买企业套餐，即可挖掘公司直接或间接拥有其疑似实际控制权的企业'),
    dataCallback: (res) => {
      return res.list && res.list.length ? res.list : []
    },
    noTranslate: true,
    rightFilters: [
      {
        key4sel: 'aggs_reg_state',
        key4ajax: 'status',
        name: intl('258419', '全部登记状态'),
        key: '',
      },
      {
        key4sel: 'showControllerCompany_sort',
        isStatic: true,
        key4ajax: 'sort',
        name: intl('451221', '持股比例降序'),
        key: '',
        listSort: [
          { key: intl('451221', '持股比例降序'), value: 'rate,desc' },
          { key: intl('451222', '持股比例升序'), value: 'rate,asc' },
          { key: intl('260151', '注册资本降序'), value: 'capital,desc' },
          { key: intl('451224', '注册资本升序'), value: 'capital,asc' },
        ],
      },
    ],
    rightFilterCallback: (param) => {
      return param
    },
    extraParams: (param) => {
      return {
        ...param,
        __primaryKey: param.companycode,
      }
    },
    columns: [
      null,
      {
        render: (_txt, row) => {
          let name = row.invest_name ? row.invest_name : row.name
          name = name ? name : '--'
          return <CompanyLink name={name} id={row.invest_id} />
        },
      },
      null,
      {
        render: (_, row) => {
          return formatCurrency(row.invest_reg_capital, row.invest_reg_capitalUnit)
        },
      },
      null,
      {
        render: (realStockPathList) => {
          const renderPath = (path) => {
            if (path) {
              const f = []
              const pathArr = path.split(';')
              f.push(
                <span
                  className="td-span-route-left underline wi-secondary-color wi-link-color"
                  data-name={window.__GELCOMPANYNAME__}
                  data-code={window.__GELCOMPANYCODE__}
                >
                  {window.en_access_config ? window.__GELCOMPANYNAMEEN__ : window.__GELCOMPANYNAME__}
                </span>
              )
              // str += '<span class="td-span-route-left underline wi-secondary-color wi-link-color" data-name="' + window.__GELCOMPANYNAME__ + '" data-code="' + window.__GELCOMPANYCODE__ + '">' + window.__GELCOMPANYNAME__ + '</span>';
              let pingParam = '' //bury
              for (let i = 0; i < pathArr.length; i++) {
                const item = pathArr[i].split(',')
                const nameR = item[1] ? item[1] : '--'
                const ratio = item[2] ? wftCommon.formatPercent(item[2]) : '--'
                const type = item[0] && item[0].length > 13 ? 'person' : 'company'
                const code = item[0] ? item[0] : ''
                pingParam += '&opId=' + code
                f.push(
                  <span className="td-span-route-right">
                    <b>{ratio}</b>
                    <i></i>
                  </span>
                )
                f.push(<br />)
                f.push(
                  <span
                    className="wi-secondary-color underline ctrlcompanyright wi-link-color"
                    data-name={nameR}
                    data-type={type}
                    data-code={code}
                    data-pingParam={pingParam}
                    onClick={(_e) => {
                      code && wftCommon.linkCompany('Bu3', code)
                    }}
                  >
                    {nameR}
                  </span>
                )
              }
              return <span>{f}</span>
            } else {
              return '--'
            }
          }
          if (realStockPathList?.length) {
            return realStockPathList.map((path) => <div className="stock-path-box">{renderPath(path)}</div>)
          } else {
            return null
          }
        },
      },
    ],
  },

  /* 对外投资 */
  showDirectInvestment: corpDetailDirectInvest,
  /* 结构性主体 */
  structuralEntities: {
    hint:
      '<i><div><span>' +
      intl(
        '410274',
        '结构性主体是一种为了特定目的而设立的独立法律实体，具有资产隔离、有限业务活动和风险隔离等特点，常用于金融交易、资产证券化、风险管理等活动。'
      ) +
      '</span></div></i>',
    title: intl('410253', '结构性主体'),
    modelNum: 'structuralEntityCount',
    cmd: getApiPathsUrl('detail/company/getstructuralsubject'),
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    thWidthRadio: ['5.2%', '30%', '20%', '20%', '30%'],
    thName: [
      intl('28846', '序号'),
      intl('138677', '企业名称'),
      intl('138416', '经营状态'),
      intl('451220', '注册资本（万）'),
      intl('410273', '参股比例（%）'),
    ],
    align: [1, 0, 0, 2, 2],
    fields: ['NO.', 'controlledCompanyName', 'state', 'controlledCompanyRegCapital', 'votePercent|formatPercent'],
    columns: [
      null,
      {
        render: (txt, row) => {
          return <CompanyLink name={txt} id={row.controlledCompanyCode} />
        },
      },
      null,
      {
        render: (_txt, row) => {
          return formatCurrency(row.controlledCompanyRegCapital, row.controlledCompanyRegCapitalUnit)
        },
      },
    ],
  },

  /* 最终受益人 */
  showFinalBeneficiary: {
    title: intl('138180', '最终受益人'),
    notVipTitle: intl('138180', '最终受益人'),
    notVipTips: intl('208263', '购买企业套餐，即可挖掘直接或间接拥有疑似超过25%公司股权的自然人或企业'),
    hint:
      '<i><div><span>' +
      intl('353933', '依据银发【2017】235号文件') +
      '</span><br/><br/><span>' +
      intl(
        '353953',
        '受益所有人为依据相关政策文件识别标准，层层深入并最终明确为掌握控制权或者获取收益的一个或多个自然人。'
      ) +
      '</span><br/><span>' +
      intl(
        '353934',
        '受益自然人为拥有25%（含）以上股权或疑似拥有合伙权益或收益权的自然人及对法人或非法人组织进行实际控制的多个自然人。'
      ) +
      '</span><br/><span>' +
      intl(
        '353954',
        '受益机构为拥有25%（含）以上股权或疑似拥有合伙权益或收益权的法人及对法人或非法人组织进行实际控制的多个法人。'
      ) +
      '</span><br/><br/><span style="color:#666666">' +
      intl('353935', '该结果仅供用户参考，并不代表万得的任何观点或保证。') +
      '</span></div></i>',
    modelNum: corpDetailFinalBeneficiary.modelNum,
    numHide: true,
    children: [
      {
        cmd: 'detail/company/getbeneficiary_owner',
        title: intl('326056', '受益所有人'),
        modelNum: corpDetailFinalBeneficiaryOwner.modelNum,
        thWidthRadio: ['5.2%', '20%', '15%', '25%', '36%'],
        thName: [
          intl('28846', '序号'),
          intl('326055', '受益所有人名称'),
          intl('261486', '最终受益股份'),
          intl('326073', '受益类型'),
          intl('326074', '判定理由'),
        ],
        align: [1, 0, 2, 0],
        fields: ['NO.', 'name', 'shareRate', 'beneficType', 'judgeReason'],
        columns: [
          null,
          {
            render: (_txt, row) => {
              return (
                <>
                  <LinkByRowCompatibleCorpPerson nameKey={'name'} idKey={'beneficiaryId'} row={row} />
                  {row.actor?.length
                    ? row.actor.map((num) => (
                        // @ts-expect-error ttt
                        <Tag
                          size="mini"
                          key={num}
                          color="color-1"
                          type="primary"
                          style={{ margin: 0, marginInlineStart: 6 }}
                        >
                          一致行动人{num}
                        </Tag>
                      ))
                    : null}
                </>
              )
            },
          },
          {
            render: (txt, row, _idx) => {
              if (window.en_access_config) {
                return wftCommonType.displayPercent(txt) // FIXME 临时处理
              }
              if (row.shareRoute && row.shareRoute.length > 0) {
                const shareRate = wftCommonType.displayPercent(txt)
                return (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {/*// @ts-expect-error ttt*/}
                    <div style={{ width: 140 }}>{shareRate ? (shareRate == 0 ? '--' : shareRate) : '--'}</div>
                    <div
                      className="share-route"
                      onClick={() => {
                        const { moduleId, opActive, describe } = commonBuryList.find(
                          (res) => res.moduleId === 922602100968
                        )
                        pointBuriedNew(moduleId, { opActive, opEntity: describe })
                        wftCommon.showRoute(row.shareRoute)
                      }}
                    ></div>
                  </div>
                )
              } else {
                return wftCommonType.displayPercent(txt)
              }
            },
          },
          null,
          null,
        ],
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
      },
      {
        cmd: 'detail/company/getbeneficiary_naturalpersion',
        title: intl('326053', '受益自然人'),
        modelNum: corpDetailFinalBeneficiaryPerson.modelNum,
        thWidthRadio: ['5.2%', '20%', '15%', '25%', '36%'],
        thName: [
          intl('28846', '序号'),
          intl('326054', '受益自然人名称'),
          intl('261486', '最终受益股份'),
          intl('326073', '受益类型'),
          intl('326093', '任职类型'),
        ],
        align: [1, 0, 2, 0, 0],
        fields: ['NO.', 'name', 'shareRate', 'beneficType', 'jobType'],
        columns: [
          null,
          {
            render: (_txt, row) => {
              return (
                <>
                  <LinkByRowCompatibleCorpPerson nameKey={'name'} idKey={'beneficiaryId'} row={row} />
                  {row.actor?.length
                    ? row.actor.map((num) => (
                        // @ts-expect-error ttt
                        <Tag
                          size="mini"
                          key={num}
                          color="color-1"
                          type="primary"
                          style={{ margin: 0, marginInlineStart: 6 }}
                        >
                          一致行动人{num}
                        </Tag>
                      ))
                    : null}
                </>
              )
            },
          },
          {
            render: (txt, row, _idx) => {
              if (window.en_access_config) {
                return wftCommonType.displayPercent(txt) // 临时处理
              }
              if (row.shareRoute && row.shareRoute.length > 0) {
                const shareRate = wftCommonType.displayPercent(txt)
                return (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {/*// @ts-expect-error ttt*/}
                    <div style={{ width: 140 }}>{shareRate ? (shareRate == 0 ? '--' : shareRate) : '--'}</div>
                    <div className="share-route" onClick={() => wftCommon.showRoute(row.shareRoute)}></div>
                  </div>
                )
              } else {
                return wftCommonType.displayPercent(txt)
              }
            },
          },
          null,
          null,
        ],
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
      },
      {
        cmd: 'detail/company/getbeneficiary_org',
        title: intl('326075', '受益机构'),
        modelNum: corpDetailFinalBeneficiaryInstitution.modelNum,
        thWidthRadio: ['5.2%', '35%', '15%', '46%'],
        thName: [
          intl('28846', '序号'),
          intl('326076', '受益机构名称'),
          intl('261486', '最终受益股份'),
          intl('326073', '受益类型'),
        ],
        align: [1, 0, 2, 0],
        fields: ['NO.', 'name', 'shareRate|formatPercent', 'beneficType'],
        columns: [
          null,
          {
            render: (txt, row) => {
              return (
                <>
                  {txt}
                  {row.actor?.length
                    ? row.actor.map((num) => (
                        // @ts-expect-error ttt
                        <Tag
                          size="mini"
                          key={num}
                          color="color-1"
                          type="primary"
                          style={{ margin: 0, marginInlineStart: 6 }}
                        >
                          一致行动人{num}
                        </Tag>
                      ))
                    : null}
                </>
              )
            },
          },
          null,
          null,
        ],
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
      },
    ],
    rightLink: (data) => {
      return benfitRender(data)
    },
  },
  /* 主要人员 */
  showMainMemberInfo: {
    title: intl('138503', '主要人员'),
    modelNum: corpDetailMainMember.modelNum,
    numHide: true,
    children: [
      {
        enumKey: ECorpDetailTable.MainMemberLatestDisclosure,
        cmd: 'detail/company/getprimarymembers',
        title: intl('342094', '最新公示'),
        modelNum: corpDetailLastNotice.modelNum,
        downDocType: 'download/createtempfile/getprimarymembers',
        thWidthRadio: ['5.2%', '40%', '36%', '20%'],
        thName: [intl('28846', '序号'), intl('34979', '姓名'), intl('210032', '职务'), intl('138691', '任职日期')],
        columns: [
          null,
          {
            render: (txt, row) => <Links title={txt} id={row.personId} module={LinksModule.CHARACTER} />,
          },
        ],
        align: [1, 0, 0],
        fields: ['NO.', 'personName', 'personTitle', 'startDate'],
        extraParams: (param) => {
          param.source = 1
          param.__primaryKey = param.companycode
          return param
        },
      },
      {
        enumKey: ECorpDetailTable.MainMemberRegistration,
        cmd: 'detail/company/getprimarymembers',
        title: intl('312175', '工商登记'),
        modelNum: corpDetailIndustrialRegist.modelNum,
        thWidthRadio: ['5.2%', '46%', '50%'],
        thName: [intl('28846', '序号'), intl('34979', '姓名'), intl('210032', '职务')],
        columns: [
          null,
          {
            render: (txt, row) => <Links title={txt} id={row.personId} module={LinksModule.CHARACTER} />,
          },
        ],
        align: [1, 0, 0],
        fields: ['NO.', 'personName', 'personTitle'],
        extraParams: (param) => {
          param.source = 2
          param.__primaryKey = param.companycode
          return param
        },
      },
    ],
  },
  /* 核心团队 */
  showCoreTeam: {
    cmd: '/detail/company/getcoreteam',
    title: intl('204943', '核心团队'),
    moreLink: 'showCoreTeam',
    modelNum: 'coreteam_num',
    thWidthRadio: ['5.2%', '20%', '20%', '56%'],
    thName: [intl('28846', '序号'), intl('34979', '姓名'), intl('313175', '职位'), intl('451241', '简介')],
    align: [1, 0, 0],
    fields: ['NO.', 'personName', 'jobTitle', 'remark'],
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    columns: [
      null,
      {
        render: (txt, row) => <Links title={txt} id={row.personId} module={LinksModule.CHARACTER} />,
      },
      null,
      {
        render: (txt, _row) => {
          if (!txt) return '--'
          if (txt.length < 50) return txt
          return <LongTxtLabel txt={txt} />
        },
      },
    ],
  },
  /* 集团系 */
  showGroupSystem: {
    title: intl('148622', '集团系'),
    moreLink: 'showGroupSystem',
    modelNum: corpDetailGroup.modelNum,
    rightLink: () => {
      return (
        <span className="rightContainer">
          <RightGotoLink
            txt={intl('224508', '集团系查询')}
            func={() => {
              wftCommon.jumpJqueryPage('index.html#/searchPlatform/SearchGroupDepartment?nosearch=1')
            }}
          ></RightGotoLink>
        </span>
      )
    },
    children: [
      {
        modelNum: undefined,
        numHide: true,
        cmd: 'detail/company/getmaincorp',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        thWidthRadio: ['5.2%', '56%', '40%'],
        thName: [intl('28846', '序号'), intl('149312', '集团系名称'), intl('216386', '主体公司级别')],
        align: [1, 0, 0],
        fields: ['NO.', 'groupSystemName', 'mainCompanyLevel'],
        columns: [
          null,
          {
            render: (txt, row) => {
              const url = getUrlByLinkModule(LinksModule.GROUP, {
                id: row.groupSystemId,
              })
              return <DetailLink url={url} txt={txt} />
            },
          },
        ],
        dataCallback: (data, basicNum) => {
          if (basicNum['group_main_num'] == 0) return []
          return data
        },
      },
      {
        numHide: true,
        cmd: 'detail/company/getmembercorp',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        moreLink: 'showGroupSystem',
        modelNum: 'group_membercorp_num',
        thWidthRadio: ['5.2%', '24%', '16%', '20%', '17%', '10%', '9%'],
        thName: [
          intl('28846', '序号'),
          intl('216389', '归属集团系'),
          intl('216388', '成员公司级别'),
          intl('216390', '归属主体公司'),
          intl('138412', '实际持股比例'),
          intl('216391', '控制类型'),
          intl('2949', '持股类型'),
        ],
        align: [1, 0, 0, 0, 2, 0, 0],
        fields: [
          'NO.',
          'groupSystemName',
          'memberCompanyLevelName',
          'mainCompanyName',
          'shareholdingRatio|formatPercent',
          'controlTypeName',
          'shareholdingTypeName',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              const url = getUrlByLinkModule(LinksModule.GROUP, {
                id: row.groupSystemId,
              })
              return <DetailLink url={url} txt={txt} />
            },
          },
          null,
          {
            render: (txt, row) => {
              return <CompanyLink name={txt} id={row.mainCompanyWindCode} />
            },
          },
        ],
        dataCallback: (data, basicNum) => {
          if (basicNum['group_main_num'] - 0 > 0) return []
          return data
        },
      },
    ],
  },
  /* 总公司 */
  showHeadOffice: {
    cmd: 'detail/company/headerQuarter',
    extraParams: (param) => {
      return {
        ...param,
        __primaryKey: param.companycode,
      }
    },
    title: intl('204942', '总公司'),
    moreLink: 'showHeadOffice',
    modelNum: 'headerquarters_num',
    thWidthRadio: ['5.2%', '24%', '24%', '20%', '15%', '13%'],
    thName: [
      intl('28846', '序号'),
      intl('391793', '所属总公司名称'),
      intl('451206', '法定代表人'),
      // FIXME 待后端接口更新后，万元->万
      intl('18688', '注册资本(万元)'),
      intl('138416', '经营状态'),
      intl('2823', '成立日期'),
    ],
    // FIXME 待后端接口更新后，万元->万
    // columns: [
    //   null,
    //   null,
    //   null,
    //   {
    //     render: (txt, row, idx) => {
    //       return formatCurrency(row.reg_capital, row.reg_capitalUnit)
    //     },
    //   },
    //   null,
    //   null,
    // ],
    align: [1, 0, 0, 2, 0, 0],
    fields: ['NO.', 'corp_name', 'legal_name', 'reg_capital|formatMoneyComma', 'reg_status', 'reg_date|formatTime'],
  },
  /* 竞争对手 */
  getcomparable: {
    cmd: '/detail/company/getcompetitor2',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    modelNum: 'competitor',
    title: intl('138219', '竞争对手'),
    hint: `<i><div><span>${intl(TooltipMap.CompanyDetailCompetitor.intlId, TooltipMap.CompanyDetailCompetitor.default)}</span></div></i>`,
    moreLink: 'getcompetitor2',
    thWidthRadio: ['5.2%', '40%', '13%', '20%', '18%'],
    align: [1, 0, 0, 0, 2],
    thName: [
      intl('28846', '序号'),
      intl('138677', '企业名称'),
      intl('2823', '成立日期'),
      intl('451206', '法定代表人'),
      intl('451220', '注册资本（万）'),
    ],
    fields: ['NO.', 'company_name', 'reg_date|formatTime', 'legal_person_name', 'reg_capital'],
    notVipTitle: intl('138219', '竞争对手'),
    notVipTips: intl('224197', '购买VIP/SVIP套餐，即可不限次查看企业竞争对手信息'),
    columns: [
      null,
      {
        render: (txt, row, _idx) => {
          return <CompanyLink name={txt} id={row.company_code} />
        },
      },
      null,
      {
        render: (_txt, row) => (
          <LinkByRowCompatibleCorpPerson nameKey="legal_person_name" idKey="legal_person_id" row={row} />
        ),
      },
      {
        render: (_txt, row, _idx) => {
          return formatCurrency(row.reg_capital, row.reg_capitalUnit)
        },
      },
    ],
    rightLink: (data) => {
      const usedInClient = wftCommon.usedInClient()
      if (!usedInClient && !isDev) return ''
      return (
        <RightGotoLink
          txt={intl('265528', '查看竞争对手图谱')}
          func={() => {
            const url = `http://windkgserver/windkg/index.html#/competitors?id=${window.__GELCORPID__}&companyName=${data.companyName}`
            window.open(url)
          }}
        ></RightGotoLink>
      )
    },
  },
  /* 工商变更 */
  showCompanyChange: {
    cmd: '/detail/company/getCorpChangeInfoNew',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    moreLink: 'showCompanyChange',
    downDocType: 'download/createtempfile/getindustrialchange',
    title: intl('451225', '工商变更'),
    hint: `<i><div><span>${intl(TooltipMap.CompanyDetailIndustryAndCommercialChange.intlId, TooltipMap.CompanyDetailIndustryAndCommercialChange.default)}</span></div></i>`,

    modelNum: 'change_record_num',
    selName: ['companyChangeType', 'companyChangeSel'],
    aggName: ['aggs_type_2', 'aggs_type'],
    thWidthRadio: ['5.2%', '10%', '10%', '16%', '30%', '30%'],
    thName: [
      intl('28846', '序号'),
      intl('451201', '变更日期'),
      intl('451219', '变更类型'),
      intl('138204', '变更事项'),
      intl('451202', '变更前'),
      intl('451203', '变更后'),
    ],
    align: [1, 0, 0, 0, 0, 0],
    fields: ['NO.', 'changeTime|formatTime', 'changeType', 'changeItem', 'beforeChange', 'afterChange'],
    dataCallback: (res) => {
      return res.list && res.list.length ? res.list : []
    },
    columns: [
      null,
      null,
      null,
      null,
      {
        render: (_txt, row, _idx) => {
          let data = row['beforeChange']
          data = wftCommon.replaceScript(data)
          if (row.change_type == '主要人员变更') {
            if (data.indexOf(',') > -1 || data.indexOf('，') > -1) {
              data = addChangeTag(data, row.after_change)
            }
          } else {
            if (data && data.indexOf('text-insert') > -1) {
              data = data.replace(/text-insert/g, 'text-insert ')
            }
            if (data && data.indexOf('text-delete') > -1) {
              data = data.replace(/text-delete/g, 'text-delete ')
            }
            if (data && data.indexOf('tag-red') > -1) {
              data = data.replace(/tag-red/g, 'tag-red ')
            }
          }
          return (
            <span
              dangerouslySetInnerHTML={{
                __html: data,
              }}
            ></span>
          )
        },
      },
      {
        render: (_txt, row, _idx) => {
          let data = row['afterChange']
          data = wftCommon.replaceScript(data)
          if (row.change_type == '主要人员变更') {
            if (data.indexOf(',') > -1 || data.indexOf('，') > -1) {
              data = addChangeTag(data, row.before_change)
            }
          } else {
            if (data && data.indexOf('text-insert') > -1) {
              data = data.replace(/text-insert/g, 'text-insert ')
            }
            if (data && data.indexOf('text-delete') > -1) {
              data = data.replace(/text-delete/g, 'text-delete ')
            }
            if (data && data.indexOf('tag-red') > -1) {
              data = data.replace(/tag-red/g, 'tag-red ')
            }
          }
          return (
            <span
              dangerouslySetInnerHTML={{
                __html: data,
              }}
            ></span>
          )
        },
      },
    ],
    rightFilters: [
      {
        key4sel: 'aggs_type_2',
        key4ajax: 'changeType',
        name: intl('261192', '全部变更类型'),
        key: '',
      },
      {
        key4sel: 'aggs_type',
        key4ajax: 'changeItem',
        name: intl('451210', '全部变更事项'),
        key: '',
      },
    ],
    rightFilterCallback: (param) => {
      let changes = param.changes1
      if (!param.changes1 && !param.changes2) {
        param.changes = ''
        return ''
      }
      if (param.changes2) {
        changes = changes ? changes + '|' + param.changes2 : '|' + param.changes2
      } else {
        changes = changes + '|'
      }
      param.changes = changes
      return param
    },
  },

  // 纳税人信息
  gettaxpayer: {
    // fn: 'detail/company/gettaxpayer',
    cmd: '/detail/company/gettaxpayer',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('222479', '纳税人信息'),
    moreLink: 'gettaxpayer',
    modelNum: 'tax_payer_num',
    thWidthRadio: ['5.2%', '19%', '18%', '18%', '15%', '26%'],
    thName: [
      intl('28846', '序号'),
      intl('138539', '纳税人识别号'),
      intl('222794', '纳税人资格类型'),
      intl('87749', '登记日期'),
      intl('21235', '有效期'),
      intl('138218', '主管税务机关'),
    ],
    align: [1, 0, 0, 0, 0, 0],
    fields: ['NO.', 'taxIdNo', 'taxQualiType', 'taxRegisterDate|formatTime', 'startDate|formatTime', 'taxAuthority'],
  },
  //企业公示
  showCompanyNotice: {
    title: intl('222474', '企业公示'),
    modelNum: corpDetailComapnyNotice.modelNum,
    hint:
      '<i><div><span>' +
      intl('437440', '该信息由该企业提供，企业对其报送信息的真实性、合法性负责。') +
      '</span></div></i>',
    children: [
      {
        cmd: '/detail/company/getshareholdercontribution',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        title: intl('138508', '股东及出资信息'),
        tabChange: {
          type: [intl('138508', '股东及出资信息'), intl('142482', '股权变更信息')],
          typeCnName: ['股东及出资信息', '股权变更信息'],
          typeName: 'type',
          typeBasicNum: ['shareholder_contribution_num', 'share_change_num'],
        },
        modelNum: 'shareholder_contribution_num',
        moreLink: 'showCompanyNotice',
        thWidthRadio: ['5.2%', '50%', '16%', '16%', '14%'],
        thName: [
          intl('28846', '序号'),
          intl('138783', '股东名称'),
          intl('222770', '认缴额（万元）'),
          intl('222769', '实缴额（万元）'),
          intl('222775', '出资明细'),
        ],
        align: [1, 0, 2, 2, 0],
        fields: ['NO.', 'shareholder_name', 'promise_money_amount', 'real_money_amount', 'relate_code'],
        dataCallback: (res, _num, pageno) => {
          res.map((t, idx) => {
            t.key = t.key ? t.key : idx + pageno * 10
          })
          return res
        },
        columns: [
          null,
          {
            render: (_txt, row) => (
              <LinkByRowCompatibleCorpPerson nameKey={'shareholder_name'} idKey={'shareholder_id'} row={row} />
            ),
          },
          {
            render: (_txt, row) => {
              return formatCurrency(row.promise_money_amount, row.promise_money_amountUnit)
            },
          },
          {
            render: (_txt, row) => {
              return formatCurrency(row.real_money_amount, row.real_money_amountUnit)
            },
          },
          {
            render: () => {
              return ''
            },
          },
        ],
      },
      {
        cmd: '/detail/company/getsharechange',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        title: intl('142482', '股权变更信息'),
        tabChange: {
          type: [intl('138508', '股东及出资信息'), intl('142482', '股权变更信息')],
          typeCnName: ['股东及出资信息', '股权变更信息'],
          typeName: 'type',
          typeBasicNum: ['shareholder_contribution_num', 'share_change_num'],
        },
        modelNum: 'share_change_num',
        moreLink: 'showCompanyNotice',
        thWidthRadio: ['5.2%', '34%', '15%', '15%', '15%', '15%'],
        thName: [
          intl('28846', '序号'),
          intl('138783', '股东名称'),
          intl('142479', '变更前股权比例'),
          intl('142480', '变更后股权比例'),
          intl('142481', '股权变更日期'),
          intl('138143', '公示日期'),
        ],
        align: [1, 0, 2, 2, 0, 0, 0],
        fields: [
          'NO.',
          'shareholdingName',
          'equityRatioBefore',
          'equityRatioAfter',
          'equityChangeDate|formatTime',
          'publicDate|formatTime',
        ],

        columns: [
          null,
          {
            render: (_res, row) => (
              <LinkByRowCompatibleCorpPerson nameKey={'shareholdingName'} idKey={'shareholdingId'} row={row} />
            ),
          },
          {
            render: (res) => {
              return wftCommon.formatPercent(res)
            },
          },
          {
            render: (res, row) => {
              const diff = Number(row.equityRatioAfter || 0) - Number(row.equityRatioBefore || 0)
              const ICON =
                diff > 0 ? (
                  <ArrowUpO
                    style={{ color: '#c91818', marginInlineStart: 4 }}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                ) : diff < 0 ? (
                  <ArrowDownO
                    style={{ color: '#107f3a', marginInlineStart: 4 }}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                ) : null
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  {wftCommon.formatPercent(res)}
                  {ICON}
                </div>
              )
            },
          },
        ],
      },
    ],
  },
  /* 企业年报 */
  showYearReport: {
    cmd: 'detail/company/getannualinfo',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    moreLink: 'showYearReport',
    title: intl('138149', '企业年报'),
    modelNum: 'annual_num',
    numHide: true,
    thWidthRadio: ['5.2%', '48%', '48%'],
    thName: [intl('28846', '序号'), intl('138585', '报送年度'), intl('138143', '公示日期')],
    align: [1, 0, 0],
    fields: ['NO.', 'annual_year', 'release_time|formatTime'],
    columns: [
      null,
      {
        render: (txt, _row) => {
          const url = `index.html?companyCode=${window.__GELCOMPANYCODE__}&year=${txt}#/annualReportDetail`
          // const url = 'yearReport.html?companyCode=' + window.__GELCOMPANYCODE__ + '&year=' + txt
          return <DetailLink url={url} txt={txt + intl('138658', '年度报告')} />
        },
      },
    ],
  },
}
