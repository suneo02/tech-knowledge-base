import { Links } from '@/components/common/links'
import { LinkByRowCompatibleCorpPerson } from '@/components/company/link/CorpOrPersonLink'
import { TechScoreHint } from '@/components/company/techScore/comp'
import { InfoCircleButton } from '@/components/icons/InfoCircle'
import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { getStandardEnumByLevel } from '@/handle/link/module/miscDetail/standard.ts'
import { CorpPrimaryModuleCfg } from '@/types/corpDetail'
import { intlNoNO as intl } from '@/utils/intl'
import { convertAntDColumns } from '@/utils/table'
import { wftCommon } from '@/utils/utils.tsx'
import { Tooltip } from '@wind/wind-ui'
import React from 'react'
import { DetailLink } from '../components'
import { corpDetailBrand } from './brand'
import { corpDetailPatent } from './patent'

/**
 * 确保 URL 包含协议前缀
 * @param url - 原始 URL
 * @returns 带协议的完整 URL
 */
const ensureUrlProtocol = (url: string): string => {
  if (!url) return url
  // 检查是否已包含协议（http:// 或 https://）
  if (/^https?:\/\//i.test(url)) {
    return url
  }
  return `http://${url}`
}

export const ip: CorpPrimaryModuleCfg = {
  moduleTitle: {
    title: intl('120665', '知识产权'),
    moduleKey: 'intellectual', // 与左侧大菜单齐名
    noneData: intl('348956', '暂无知识产权'),
  },
  gettechscore: {
    title: intl(451195, '科创分'),
    modelNum: 'technologicalInnovationCount',
    numHide: true,
    hint: <TechScoreHint />,
  },
  getbrand: corpDetailBrand,
  getpatent: corpDetailPatent,
  getIntegratedCircuitLayout: {
    ...convertAntDColumns([
      {
        title: intl('28846', '序号'),
        dataIndex: 'NO.',
        width: '5.2%',
        align: 'center',
      },
      {
        title: intl('452496', '布图设计名称'),
        dataIndex: 'name',
        width: '30%',
        render: (txt, row) => {
          return <Links module={LinksModule.IC_LAYOUT} id={row.exclusiveRightId} title={txt} />
        },
      },
      {
        title: intl('138482', '登记号'),
        dataIndex: 'registerNumber',
        width: '12%',
      },
      {
        title: intl('138660', '申请日期'),
        dataIndex: 'applicationDate',
        width: '10%',
        // render: (txt) => wftCommon.formatTime(txt),
      },
      {
        title: intl('257639', '公告日期'),
        dataIndex: 'announcementDate',
        width: '10%',
        // render: (txt) => wftCommon.formatTime(txt),
      },
      {
        title: intl('452507', '创作人'),
        dataIndex: 'creator',
        width: '30%',

        render: (arr) => (
          <div style={{ padding: '4px 0' }} data-alt="集成电路布图-创作人">
            {arr.map((t) => (
              <div key={t.windId}>
                <LinkByRowCompatibleCorpPerson idKey="windId" nameKey="name" row={t} useUnderline={false} />
              </div>
            ))}
          </div>
        ),
      },
    ]),
    //     new: true,
    cmd: 'detail/company/getIntegratedCircuitLayout',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('452482', '集成电路布图'),
    modelNum: 'ic_layout_num',
  },
  getproductioncopyright: {
    cmd: 'detail/company/getintellectual_production_corp',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('138756', '作品著作权'),
    downDocType: 'download/createtempfile/getintellectual_production_corp',
    moreLink: 'getproductioncopyright',
    modelNum: 'workcopyr_num',
    aggName: ['aggs_work_category'],
    thWidthRadio: ['5.2%', '30%', '10%', '21%', '10%', '10%', '10%'],
    thName: [
      intl('28846', '序号'),
      intl('138553', '作品名称'),
      intl('138195', '作品类别'),
      intl('138482', '登记号'),
      intl('138220', '创作完成日期'),
      intl('138243', '首次发表日期'),
      intl('87749', '登记日期'),
    ],
    align: [1, 0, 0, 0, 0, 0, 0, 0, 0],
    fields: [
      'NO.',
      'work_title',
      'work_category',
      'registration_number',
      'completion_date|formatTime',
      'initial_publication_date|formatTime',
      'registration_date|formatTime',
    ],
    notVipPageTurning: true,
    notVipPageTitle: intl('138756', '作品著作权'),
    notVipPagedesc: '购买VIP/SVIP套餐，即可不限次查看企业作品著作权信息',
    dataCallback: (res) => {
      return res.list && res.list.length ? res.list : []
    },
    rightFilters: [
      {
        key4sel: 'work_category',
        key4ajax: 'category',
        name: intl('138195', '作品类别'),
        key: '',
        typeOf: 'string',
      },
    ],
  },
  getsoftwarecopyright: {
    cmd: 'detail/company/getsoftwarecopyright',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('138788', '软件著作权'),
    downDocType: 'download/createtempfile/getsoftwarecopyright',
    moreLink: 'getsoftwarecopyright',
    modelNum: 'softwarecopyright_num',
    thWidthRadio: ['5.2%', '30%', '15%', '8%', '13%', '10%', '10%', '10%'],
    thName: [
      intl('28846', '序号'),
      intl('29979', '名称'),
      intl('138936', '简称'),
      intl('138573', '版本号'),
      intl('138482', '登记号'),
      intl('138209', '分类号'),
      intl('138243', '首次发表日期'),
      intl('138158', '登记批准日期'),
    ],
    align: [1, 0, 0, 0, 0, 0, 0],
    fields: [
      'NO.',
      'software_name|formatCont',
      'software_abbreviation|formatCont',
      'version_number|formatCont',
      'register_number|formatCont',
      'classified_number|formatCont',
      'first_publish_date|formatTime',
      'register_date|formatTime',
    ],
    notVipPageTurning: true,
    notVipPageTitle: intl('138788', '软件著作权'),
    notVipPagedesc: '购买VIP/SVIP套餐，即可不限次查看企业软件著作权信息',
  },

  getStandardPlan: {
    // cmd: "getstandardinfo",
    cmd: 'detail/company/getstandardinfo',
    title: intl('326113', '标准信息'),
    hint: intl(
      '365158',
      '标准信息是指企业参与制定国家、行业、企业、团体、地方的标准。参与标准制定的意义在于提高企业在同行业和市场的知名度，引导同行业的发展方向，提高本企业产品的市场认可度。'
    ),
    downDocType: 'download/createtempfile/getstandardinfo',
    moreLink: 'getStandardPlan',
    modelNum: 'standardInfo',
    selName: ['standardTypeVal', 'standardStateVal'],
    aggName: ['aggs_category', 'aggs_status'],
    thWidthRadio: ['5.2%', '29%', '15%', '14%', '12%', '13%', '13%'],
    thName: [
      intl('28846', '序号'),
      intl('326133', '标准名称'),
      intl('326134', '标准号'),
      intl('326135', '标准级别'),
      intl('326114', '标准状态'),
      intl('326115', '标准性质'),
      intl('138908', '发布日期'),
    ],
    align: [1, 0, 0, 0, 0, 0, 0],
    fields: [
      'NO.',
      'standardName',
      'standardNo',
      'standardLevel',
      'standardStatus',
      'standardNature',
      'releaseDate|formatTime',
    ],
    dataCallback: (res) => {
      return res.list && res.list.length ? res.list : []
    },
    rightFilters: [
      {
        key4sel: 'aggs_category',
        key4ajax: 'category',
        name: intl('326135', '标准级别'),
        key: '',
      },
      {
        key4sel: 'aggs_status',
        key4ajax: 'status',
        name: intl('326114', '标准状态'),
        key: '',
      },
    ],
    extraParams: (param) => {
      return {
        ...param,
        __primaryKey: param.companycode,
        category: '',
        status: '',
      }
    },
    columns: [
      null,
      {
        render: (txt, row) => {
          const entityNumber = row['entityNumber']
          const standardLevelCode = row['standardLevelCode']
          const standardLevel = row['standardLevel']
          const type = getStandardEnumByLevel(standardLevel)
          const url = getUrlByLinkModule(LinksModule.STANDARD_DETAIL, {
            type,
            standardLevelCode,
            id: entityNumber,
          })
          return entityNumber ? <DetailLink url={url} txt={txt} /> : txt
        },
      },
      null,
      null,
      null,
      null,
      {
        title: (
          <span>
            {intl('138908', '发布日期')}

            {
              <Tooltip
                overlayClassName="corp-tooltip"
                title={<div>当标准级别为国家标准计划时，发布日期指下达日期</div>}
              >
                <InfoCircleButton />
              </Tooltip>
            }
          </span>
        ),
        render: (_txt, row) => {
          const date = row.releaseDate
          return wftCommon.formatTime(date)
        },
      },
    ],
  },
  getdomainname: {
    cmd: 'detail/company/getdomain',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('348773', '网站备案'),
    moreLink: 'getdomainname',
    modelNum: 'domain_num',
    thWidthRadio: ['5.2%', '21%', '20%', '16%', '18%', '10%', '9%'],
    thName: [
      intl('28846', '序号'),
      intl('303753', 'ICP备案名称'),
      intl('138805', '网址'),
      intl('138266', '域名'),
      intl('348793', '网站备案/许可证号'),
      intl('348177', '审核通过日期'),
      intl('348170', '网站信息'),
    ],
    align: [1, 0, 0, 0, 0, 0, 0],
    fields: [
      'NO.',
      'web_name|formatCont',
      'web_home_page',
      'domain_name|formatCont',
      'web_number|formatCont',
      'audit_transit_time|formatTime',
      'detailId-1',
    ],
    notVipPageTurning: true,
    notVipPageTitle: intl('348773', '网站备案'),
    notVipPagedesc: '购买VIP/SVIP套餐，即可不限次查看企业网站备案信息',
    columns: [
      null,
      null,
      {
        render: (txt, row) => {
          const url = row['web_home_page']
          return (
            <DetailLink
              url={url}
              txt={txt}
              openFunc={() => {
                if (url) window.open(ensureUrlProtocol(url), '_blank')
              }}
            />
          )
        },
      },
    ],
    dataCallback: (res, _num, pageno) => {
      res.map((t, idx) => {
        t.key = t.key ? t.key : idx + pageno * 10
      })
      return res
    },
    rowSet: (row, _idx) => {
      if (row.has_detail == '0' || !row.has_detail) {
        return {
          className: 'table-tr-detail-hide',
        }
      }
      // return tableDetailHide(row, idx, 'detailId');
    },
  },
  getweixin: {
    cmd: 'detail/company/getwebchat',
    title: intl('138581', '微信公众号'),
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    moreLink: 'getweixin',
    modelNum: 'webchat_public_num',
    thWidthRadio: ['5.2%', '10%', '20%', '17%', '10%', '39%'],
    thName: [
      intl('28846', '序号'),
      intl('138171', '头像'),
      intl('138581', '微信公众号'),
      intl('138582', '微信号'),
      intl('112319', '二维码'),
      intl('451241', '简介'),
    ],
    align: [1, 0, 0, 0, 0],
    fields: ['NO.', 'image_id', 'name|formatCont', 'account', 'qr_code', 'profile'],
    notVipPageTurning: true,
    notVipPageTitle: intl('138581', '微信公众号'),
    notVipPagedesc: '购买VIP/SVIP套餐，即可不限次查看企业微信公众号信息',
    columns: [
      null,
      {
        render: (_txt, row, _idx) => {
          return wftCommon.imageBase(null, row['image_id'], null, true)
        },
      },
      null,
      null,
      {
        render: (_txt, row, _idx) => {
          return wftCommon.imageBase(null, row['qr_code'], null, true)
        },
      },
    ],
  },
  getweibo: {
    cmd: 'detail/company/getmicroblogbywindcode',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('138579', '微博账号'),
    moreLink: 'getweibo',
    modelNum: 'micro_blog_num',
    thWidthRadio: ['5.2%', '10%', '21%', '21%', '44%'],
    thName: [
      intl('28846', '序号'),
      intl('138171', '头像'),
      intl('138398', '昵称'),
      intl('31801', '行业'),
      intl('451241', '简介'),
    ],
    align: [1, 0, 0, 0, 0],
    fields: ['NO.', 'headPicId', 'accountName', 'industry', 'introduction'],
    notVipPageTurning: true,
    notVipPageTitle: intl('138579', '微博账号'),
    notVipPagedesc: '购买VIP/SVIP套餐，即可不限次查看企业微博账号信息',
    columns: [
      null,
      {
        render: (_txt, row, _idx) => {
          return wftCommon.imageBase(null, row['headPicId'], null, true)
        },
      },
      {
        render: (txt, row) => {
          const url = row.accountUrl
          return (
            <DetailLink
              url={url}
              txt={txt}
              openFunc={() => {
                if (url) window.open(ensureUrlProtocol(url), '_blank')
              }}
            />
          )
        },
      },
    ],
  },
  gettoutiao: {
    cmd: 'detail/company/getheadline',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('138559', '今日头条'),
    moreLink: 'gettoutiao',
    modelNum: 'today_headline_num',
    thWidthRadio: ['5.2%', '10%', '21%', '21%', '44%'],
    thName: [
      intl('28846', '序号'),
      intl('138171', '头像'),
      intl('29979', '名称'),
      intl('138559', '头条号'),
      intl('451241', '简介'),
    ],
    align: [1, 0, 0, 0, 0],
    fields: ['NO.', 'image_id', 'name', 'account', 'profile'],
    notVipPageTurning: true,
    notVipPageTitle: intl('138559', '今日头条'),
    notVipPagedesc: '购买VIP/SVIP套餐，即可不限次查看企业头条号信息',
    columns: [
      null,
      {
        render: (_txt, row, _idx) => {
          return wftCommon.imageBase(null, row['image_id'], null, true)
        },
      },
      {
        render: (txt, row) => {
          const url = row.account_url
          return (
            <DetailLink
              url={url}
              txt={txt}
              openFunc={() => {
                if (url) window.open(ensureUrlProtocol(url), '_blank')
              }}
            />
          )
        },
      },
    ],
  },
}
