import CompanyLink from '@/components/company/CompanyLink'
import { ICorpSubModuleCfg } from '@/components/company/type'
import { intlNoNO as intl } from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import React from 'react'
import { DetailLink } from '../components'

export const corpDetailBrand: ICorpSubModuleCfg = {
  title: intl('138799', '商标'),
  withTab: true,
  statisticalChart: 'brand',
  statisticalChartNum: 'trademark_num_self',
  modelNum: undefined,
  children: [
    {
      cmd: 'detail/company/getintellectual_trademark_theCompany',
      title: intl('74323', '本公司'),
      moreLink: 'getbrand',
      modelNum: 'trademark_num_self',
      selName: ['brandSelVal', 'brandCompanyType'],
      aggName: ['aggs_trademark_status', 'aggs_company_type'],
      thWidthRadio: ['5.2%', '10%', '20%', '10%', '12%', '13%', '10%', '20%'],
      thName: [
        intl('28846', '序号'),
        intl('138799', '商标'),
        intl('138798', '商标名称'),
        intl('138476', '注册号'),
        intl('138348', '国际分类'),
        intl('32098', '状态'),
        intl('138156', '申请时间'),
        intl('58656', '申请人'),
      ],
      align: [1, 0, 0, 0, 0, 0],
      fields: [
        'NO.',
        'trademarkImage',
        'trademarkName',
        'applicationNumber',
        'internationalClassification',
        'trademarkStatus',
        'applicationDate|formatTime',
        'corpName',
      ],
      notVipPageTurning: true,
      notVipPageTitle: intl('138799', '商标'),
      notVipPagedesc: intl('224213', '购买VIP/SVIP套餐，即可不限次查看企业更多商标信息'),
      columns: [
        null,
        {
          render: (_txt, row, _idx) => {
            return wftCommon.imageBaseBrand(6710, row['trademarkImage'], '', true)
          },
        },
        {
          render: (txt, row) => {
            const detailid = row['detailId']
            const url = `index.html?type=brand&detailid=${detailid}#/logoDetail`
            return <DetailLink url={url} txt={txt} />
          },
        },
        null,
        null,
        null,
        null,
        {
          render: (_txt, row, _idx) => {
            return <CompanyLink name={row.corpName} id={row.corpId}></CompanyLink>
          },
        },
        null,
      ],
      dataCallback: (res) => {
        return res.list && res.list.length ? res.list : []
      },
      rightFilters: [
        {
          key4sel: 'aggs_trademark_status',
          key4ajax: 'status',
          name: intl('332013', '全部商标状态'),
          typeOf: 'brand',
          key: '',
        },
      ],
      downDocType: 'download/createtempfile/getintellectual_trademark_theCompany',
      extraParams: (param) => {
        return {
          ...param,
          // typee: 'trademark_theCompany',
          __primaryKey: param.companycode,
          status: '',
        }
      },
    },
    {
      cmd: 'detail/company/getintellectual_trademark_branch',
      title: intl('204320', '分支机构'),
      moreLink: 'getbrand',
      modelNum: 'trademark_num_fzjg',
      selName: ['brandSelVal', 'brandCompanyType'],
      aggName: ['aggs_trademark_status', 'aggs_company_type'],
      thWidthRadio: ['5.2%', '10%', '17%', '9%', '10%', '10%', '10%', '19%', '10%'],
      thName: [
        intl('28846', '序号'),
        intl('138799', '商标'),
        intl('138560', '商标名'),
        intl('138476', '注册号'),
        intl('138348', '国际分类'),
        intl('32098', '状态'),
        intl('138156', '申请时间'),
        intl('58656', '申请人'),
        intl('332353', '关联关系类型'),
      ],
      align: [1, 0, 0, 0, 0, 0, 0],
      fields: [
        'NO.',
        'trademarkImage',
        'trademarkName',
        'applicationNumber',
        'internationalClassification',
        'trademarkStatus',
        'applicationDate|formatTime',
        'corpName',
        'relativeType|relativeType',
      ],
      notVipPageTurning: true,
      notVipPageTitle: intl('138799', '商标'),
      notVipPagedesc: intl('224213', '购买VIP/SVIP套餐，即可不限次查看企业更多商标信息'),
      columns: [
        null,
        {
          render: (_txt, row, _idx) => {
            return wftCommon.imageBaseBrand(6710, row['trademarkImage'], '', true)
          },
        },
        {
          render: (txt, row) => {
            const detailid = row['detailId']
            const url = `index.html?type=brand&detailid=${detailid}#/logoDetail`
            return detailid ? <DetailLink url={url} txt={txt}></DetailLink> : txt
          },
        },
        null,
        null,
        null,
        null,
        {
          render: (_txt, row, _idx) => {
            return <CompanyLink name={row.corpName} id={row.corpId}></CompanyLink>
          },
        },
        null,
      ],
      dataCallback: (res) => {
        return res.list && res.list.length ? res.list : []
      },
      rightFilters: [
        {
          key4sel: 'aggs_trademark_status',
          key4ajax: 'status',
          name: intl('332013', '全部商标状态'),
          typeOf: 'brand',
          key: '',
        },
      ],
      downDocType: 'download/createtempfile/getintellectual_trademark_branch',
      extraParams: (param) => {
        return {
          ...param,
          // typee: 'trademark_branch',
          __primaryKey: param.companycode,
          status: '',
        }
      },
    },
    {
      cmd: 'detail/company/getintellectual_trademark_holdCompany',
      title: intl('451208', '控股企业'),
      moreLink: 'getbrand',
      modelNum: 'trademark_num_kgqy',
      selName: ['brandSelVal', 'brandCompanyType'],
      aggName: ['aggs_trademark_status', 'aggs_company_type'],
      thWidthRadio: ['5.2%', '10%', '17%', '9%', '10%', '10%', '10%', '19%', '10%'],
      thName: [
        intl('28846', '序号'),
        intl('138799', '商标'),
        intl('138560', '商标名'),
        intl('138476', '注册号'),
        intl('138348', '国际分类'),
        intl('32098', '状态'),
        intl('138156', '申请时间'),
        intl('58656', '申请人'),
        intl('332353', '关联关系类型'),
      ],
      align: [1, 0, 0, 0, 0, 0, 0],
      fields: [
        'NO.',
        'trademarkImage',
        'trademarkName',
        'applicationNumber',
        'internationalClassification',
        'trademarkStatus',
        'applicationDate|formatTime',
        'corpName',
        'relativeType|relativeType',
      ],
      notVipPageTurning: true,
      notVipPageTitle: intl('138799', '商标'),
      notVipPagedesc: intl('224213', '购买VIP/SVIP套餐，即可不限次查看企业更多商标信息'),
      columns: [
        null,
        {
          render: (_txt, row, _idx) => {
            return wftCommon.imageBaseBrand(6710, row['trademarkImage'], '', true)
          },
        },
        {
          render: (txt, row) => {
            const detailid = row['detailId']
            const url = `index.html?type=brand&detailid=${detailid}#/logoDetail`
            return detailid ? <DetailLink url={url} txt={txt}></DetailLink> : txt
          },
        },
        null,
        null,
        null,
        null,
        {
          render: (_txt, row, _idx) => {
            return <CompanyLink name={row.corpName} id={row.corpId}></CompanyLink>
          },
        },
        null,
      ],
      dataCallback: (res) => {
        return res.list && res.list.length ? res.list : []
      },
      rightFilters: [
        {
          key4sel: 'aggs_trademark_status',
          key4ajax: 'status',
          name: intl('332013', '全部商标状态'),
          typeOf: 'brand',
          key: '',
        },
      ],
      downDocType: 'download/createtempfile/getintellectual_trademark_holdCompany',
      extraParams: (param) => {
        return {
          ...param,
          // typee: 'trademark_holdCompany',
          __primaryKey: param.companycode,
          status: '',
        }
      },
    },
    {
      cmd: 'detail/company/getintellectual_trademark_overseasInvestment',
      title: intl('138724', '对外投资'),
      moreLink: 'getbrand',
      modelNum: 'trademark_num_dwtz',
      selName: ['brandSelVal', 'brandCompanyType'],
      aggName: ['aggs_trademark_status', 'aggs_company_type'],
      thWidthRadio: ['5.2%', '10%', '17%', '9%', '10%', '10%', '10%', '19%', '10%'],
      thName: [
        intl('28846', '序号'),
        intl('138799', '商标'),
        intl('138560', '商标名'),
        intl('138476', '注册号'),
        intl('138348', '国际分类'),
        intl('32098', '状态'),
        intl('138156', '申请时间'),
        intl('58656', '申请人'),
        intl('332353', '关联关系类型'),
      ],
      align: [1, 0, 0, 0, 0, 0, 0],
      fields: [
        'NO.',
        'trademarkImage',
        'trademarkName',
        'applicationNumber',
        'internationalClassification',
        'trademarkStatus',
        'applicationDate|formatTime',
        'corpName',
        'relativeType|relativeType',
      ],
      notVipPageTurning: true,
      notVipPageTitle: intl('138799', '商标'),
      notVipPagedesc: intl('224213', '购买VIP/SVIP套餐，即可不限次查看企业更多商标信息'),
      columns: [
        null,
        {
          render: (_txt, row, _idx) => {
            return wftCommon.imageBaseBrand(6710, row['trademarkImage'], '', true)
          },
        },
        {
          render: (txt, row) => {
            const detailid = row['detailId']
            const url = `index.html?type=brand&detailid=${detailid}#/logoDetail`
            return detailid ? <DetailLink url={url} txt={txt}></DetailLink> : txt
          },
        },
        null,
        null,
        null,
        null,
        {
          render: (_txt, row, _idx) => {
            return <CompanyLink name={row.corpName} id={row.corpId}></CompanyLink>
          },
        },
        null,
      ],
      dataCallback: (res) => {
        return res.list && res.list.length ? res.list : []
      },
      rightFilters: [
        {
          key4sel: 'aggs_trademark_status',
          key4ajax: 'status',
          typeOf: 'brand',
          name: intl('332013', '全部商标状态'),
          key: '',
        },
      ],
      downDocType: 'download/createtempfile/getintellectual_trademark_overseasInvestment',
      extraParams: (param) => {
        return {
          ...param,
          // typee: 'trademark_overseasInvestment',
          __primaryKey: param.companycode,
          status: '',
        }
      },
    },
  ],
}
