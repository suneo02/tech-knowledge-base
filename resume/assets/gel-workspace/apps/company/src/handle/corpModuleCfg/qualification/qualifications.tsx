import { hzpscxk } from '@/components/company/data/qualificationsHonors/hzpscxk.tsx'
import { LinkByRowCompatibleCorpPerson } from '@/components/company/link/CorpOrPersonLink.tsx'
import { ICorpPrimaryModuleVipCfg } from '@/components/company/type'
import {
  corpDetailFinancialInfo,
  corpDetailInvestigationFiling,
  corpDetailInvestigationFilingCorp,
  corpDetailInvestigationFilingPerson,
  CorpDetailQualificationGetGameApprovalCfg,
} from '@/handle/corpModuleCfg'
import { vipDescDefault } from '@/handle/corpModuleCfg/common/vipDesc.ts'
import { intlNoNO as intl } from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import React from 'react'
import { DetailLink } from '../components'
import { corpAdminLicenseBureau } from './adminLicenseBureau'
import { corpAdminLicenseChina } from './adminLicenseChina'

export const qualifications: ICorpPrimaryModuleVipCfg = {
  moduleTitle: {
    title: intl('284064', '资质荣誉'),
    moduleKey: 'qualifications', //  与左侧大菜单齐名
    noneData: intl('348936', '暂无资质荣誉'),
  },
  getpermission02: corpAdminLicenseChina,
  getpermission: corpAdminLicenseBureau,
  credit: {
    title: intl('99999693', '征信备案'),
    modelNum: corpDetailInvestigationFiling.modelNum,
    notVipTitle: intl('99999693', '征信备案'),
    notVipTips: vipDescDefault,
    children: [
      {
        cmd: 'detail/company/personCreditList',
        moreLink: 'credit',
        modelNum: corpDetailInvestigationFilingPerson.modelNum,

        notVipTitle: intl('99999692', '个人征信'),
        notVipTips: vipDescDefault,
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        title: intl('99999692', '个人征信'),
        thWidthRadio: ['4%'],
        thName: [
          intl('28846', '序号'),
          intl('', '许可证名称'),
          intl('', '发证机关'),
          intl('', '公示日期'),
          intl('36348', '操作'),
        ],
        align: [1, 0, 0, 0],
        fields: ['NO.', 'adminLicenseName', 'apprAuthority', 'publishDate|formatTime', ''],
        dataCallback: (res, _num, pageno) => {
          res.map((t, idx) => {
            t.key = t.key ? t.key : idx + pageno * 10
          })
          return res
        },
      },
      {
        cmd: 'detail/company/companyCreditList',
        modelNum: corpDetailInvestigationFilingCorp.modelNum,

        notVipTitle: intl('99999691', '企业征信'),
        notVipTips: vipDescDefault,
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        title: intl('99999691', '企业征信'),
        thWidthRadio: ['4%'],
        thName: [
          intl('28846', '序号'),
          intl('', '许可证名称'),
          intl('', '发证机关'),
          intl('', '公示日期'),
          intl('', '有效期开始日期'),
        ],
        align: [1, 0, 0, 0],
        fields: ['NO.', 'adminLicenseName', 'apprAuthority', 'publishDate|formatTime', 'startDate|formatTime'],
      },
    ],
  },
  jrxx: {
    title: intl('99999690', '金融信息服务备案'),
    modelNum: corpDetailFinancialInfo.modelNum,
    cmd: 'detail/company/financialRecordList',

    notVipTitle: intl('99999690', '金融信息服务备案'),
    notVipTips: vipDescDefault,
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    thWidthRadio: ['4%'],
    thName: [
      intl('28846', '序号'),
      intl('', '行政备案号'),
      intl('', '服务渠道'),
      intl('', '备案日期'),
      intl('', '服务内容'),
    ],
    align: [1, 0, 0, 0],
    fields: ['NO.', 'adminFilingNumber', 'serviceRange', 'filingDate|formatTime', 'serviceContent'],
  },
  showfranchise: {
    cmd: 'detail/company/commercialFranchiseList',

    notVipTitle: intl('216405', '商业特许经营'),
    notVipTips: vipDescDefault,
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('216405', '商业特许经营'),
    moreLink: 'showfranchise',
    modelNum: 'commercial_franchise_info_num',
    thWidthRadio: ['5.2%', '34%', '31%', '31%'],
    thName: [
      intl('28846', '序号'),
      intl('216408', '备案号'),
      intl('216406', '特许人名称'),
      intl('216407', '备案公告日期'),
    ],
    align: [1, 0, 0, 0],
    fields: ['NO.', 'recordNumber', 'franchisorName', 'filingAnnouncementDate|formatTime'],
    columns: [
      null,
      {
        render: (txt, row) => {
          const url = row.franchiseInformationId
            ? `showItemDetail.html?type=franchise&detailid=${row.franchiseInformationId}`
            : ''
          return <DetailLink url={url} txt={txt} />
        },
      },
    ],
  },
  getfinanciallicence: {
    cmd: 'detail/company/getfinanciallicence/',
    title: intl('222483', '金融许可'),
    moreLink: 'getfinanciallicence',
    modelNum: 'financial_licence_num',

    notVipTitle: intl('222483', '金融许可'),
    notVipTips: vipDescDefault,
    thName: [
      intl('28846', '序号'),
      intl('222783', '许可证名称'),
      intl('222773', '行政许可决定文书号'),
      intl('138245', '发证日期'),
      intl('216395', '发证机关'),
      intl('36348', '操作'),
    ],
    thWidthRadio: ['5.2%', '20%', '24%', '18%', '26%', '8%'],
    align: [1, 0, 0],
    fields: ['NO.', 'licenceName', 'docId', 'licenceDate|formatTime', 'orgName', ''],
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    dataCallback: (res, _num, pageno) => {
      res.map((t, idx) => {
        t.key = t.key ? t.key : idx + pageno * 10
      })
      return res
    },
    expandDetail: [
      5,
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
  },
  getteleLics: {
    cmd: 'detail/company/teleLicenseList',

    notVipTitle: intl('205397', '电信许可'),
    notVipTips: vipDescDefault,
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('205397', '电信许可'),
    moreLink: 'getteleLics',
    modelNum: 'telelic_num',
    thWidthRadio: ['5.2%', '25%', '39%', '16%', '16%'],
    thName: [
      intl('28846', '序号'),
      intl('205398', '许可证号'),
      intl('205399', '业务及其覆盖范围'),
      intl('364209', '年报年份'),
      intl('205400', '年报公示'),
    ],
    align: [1, 0, 0, 0, 0],
    fields: ['NO.', 'licNo', 'licCat', 'annualYear|formatTime', ''],
    dataCallback: (res, _num, pageno) => {
      res.map((t, idx) => {
        t.key = t.key ? t.key : idx + pageno * 10
      })
      return res
    },
    rowSet: (row, _idx) => {
      if (!row.referenceId || row.referenceId == 0) {
        return {
          className: 'table-tr-detail-hide',
        }
      }
      // return tableDetailHide(row, idx, 'detailId');
    },
  },
  getgameapproval: CorpDetailQualificationGetGameApprovalCfg,
  showBuildOrder: {
    fn: 'showBuildOrder',

    notVipTitle: intl('216392', '建筑资质 '),
    notVipTips: vipDescDefault,
    cmd: 'detail/company/getbuildqualificationslist',

    extraParams: (param) => {
      return {
        companycode: param.companycode,
        ...param,
        __primaryKey: param.companycode,
        classify: '',
      }
    },
    title: intl('216392', '建筑资质 '),
    moreLink: 'showBuildOrder',
    modelNum: 'build_qualification_num',
    thWidthRadio: ['5.2%', '14%', '17%', '25%', '12%', '14%', '14%'],
    thName: [
      intl('28846', '序号'),
      intl('216396', '资质分类'),
      intl('138197', '证书编号'),
      intl('216393', '资质名称'),
      intl('138245', '发证日期'),
      intl('390613', '有效期到期日期'),
      intl('216395', '发证机关 '),
    ],
    align: [1, 0, 0, 0, 0, 0, 0],
    fields: [
      'NO.',
      'qualificationClassify',
      'certificateNumber',
      'qualificationNameList',
      'issuseDate|formatTime',
      'certificateDueDate|formatTime',
      'issuingAuthority',
    ],
    columns: [
      null,
      {
        dataIndex: 'qualificationClassify',
        render: (txt, _row, _idx) => {
          if (txt && txt.length) {
            return <span className="em-blue" dangerouslySetInnerHTML={{ __html: txt }}></span>
          } else {
            return '--'
          }
        },
      },
      null,
      {
        dataIndex: 'qualificationNameList',
        render: (txt, _row, _idx) => {
          try {
            if (txt && txt.length) {
              if (!Array.isArray(txt)) {
                txt = JSON.parse(txt)
              }
              if (Array.isArray(txt)) {
                return <span className="em-blue" dangerouslySetInnerHTML={{ __html: txt.join(', ') }}></span>
              }
              return '--'
            } else {
              return '--'
            }
          } catch (error) {}
        },
      },
    ],
    // 级联筛选项
    rightCascader: [
      {
        key: 'aggregations',
      },
    ],
    dataCallback: (res) => {
      res.list &&
        res.list.map((t, idx) => {
          t.key = idx
        })
      return res.list
    },
  },
  enterpriseDevelopment: {
    cmd: 'detail/company/realtydevelopaptitudev2',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },

    notVipTitle: intl('348194', '房地产企业开发资质'),
    notVipTips: vipDescDefault,
    title: intl('348194', '房地产企业开发资质'),
    moreLink: 'enterpriseDevelopment',
    modelNum: 'realestateCertificate', //统计数字
    thWidthRadio: ['5.2%', '20%', '20%', '45%', '10%'],
    thName: [
      intl('28846', '序号'),
      intl('337893', '资质等级'),
      intl('337874', '资格状态'),
      intl('21235', '有效期'),
      intl('203754', '详情'),
    ],
    align: [1, 0, 0, 0, 0, 0], //单元格对齐情况
    fields: ['NO.', 'qualificationLevelName|formatCont', 'qualificationStatusName|formatCont', 'validDateStart', ''],

    columns: [
      null,
      null,
      {
        dataIndex: 'qualificationStatusName',
        render: (txt, _row, _idx) => {
          if (txt) {
            return txt
          } else {
            return intl('36518', '有效')
          }
        },
      },
      {
        render: (_txt, row, _idx) => {
          // if(row.validDateEnd==("9999/12/31"||"99991231")){
          //     return intl('40768','长期')
          // }
          if (row.validDateStart.length == 0 && row.validDateEnd.length == 0) {
            return '--'
          } else {
            return (
              wftCommon.formatTime(row.validDateStart) + intl('271245', ' 至 ') + wftCommon.formatTime(row.validDateEnd)
            )
          }
        },
      },
    ],
    dataCallback: (res, _num, pageno) => {
      res.map((t, idx) => {
        t.key = t.key ? t.key : idx + pageno * 10
      })
      return res
    },
    expandDetail: [
      4,
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
  },
  logisticsCreditRating: {
    cmd: 'detail/company/logisticscreditrating',

    notVipTitle: intl('315149', '物流信用评级'),
    notVipTips: vipDescDefault,
    title: window.en_access_config ? 'Logistics Credit Rating' : '物流信用评级',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    modelNum: 'logisticsCreditRate', //统计数字
    thWidthRadio: ['5.2%', '20%', '20%', '20%', '20%', '16%'],
    thName: [
      intl('28846', '序号'),
      intl('315149', '信用评价等级'),
      intl('138908', '发布日期'),
      intl('21235', '到期日期'),
      intl('11253', '评估机构'),
      intl('32098', '状态'),
    ],
    align: [1, 0, 0, 0, 0, 0], //单元格对齐情况
    fields: [
      'NO.',
      'creditRatingName|formatCont',
      'publishDate|formatTime',
      'expireDate|formatTime',
      'evaluationAgencyName',
      'ststus',
    ],
  },
  getimpexp: {
    cmd: 'detail/company/impexplist',

    notVipTitle: intl('205419', '进出口信用'),
    notVipTips: vipDescDefault,
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('205419', '进出口信用'),
    moreLink: 'getimpexp',
    modelNum: 'impexp_num',
    thWidthRadio: ['5.2%', '24%', '40%', '16%', '16%'],
    thName: [
      intl('28846', '序号'),
      intl('205420', '注册海关'),
      intl('205421', '经营类别'),
      intl('451207', '注册日期'),
      intl('138480', '注册信息'),
    ],
    align: [1, 0, 0, 0, 0],
    fields: ['NO.', 'regCust', 'bizCatName', 'regDate|formatTime', 'referenceId'],
    columns: [
      null,
      null,
      null,
      null,
      {
        render: () => {
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
  },

  getauthentication: {
    notVipTitle: intl('332373', '认证认可'),
    notVipTips: vipDescDefault,
    cmd: 'detail/company/getcertificationlist',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return {
        ...param,
        category: '',
        status: '',
      }
    },
    title: intl('332373', '认证认可'),
    moreLink: 'getauthentication',
    modelNum: 'certification_merge_num',
    selName: ['authenticationTypeSelVal', 'authenticationSelVal'],
    aggName: ['aggs_type', 'aggs_status'],
    thWidthRadio: ['5.2%', '30%', '25%', '20%', '10%', '10%'],
    thName: [
      intl('28846', '序号'),
      intl('138670', '证书类型'),
      intl('138197', '证书编号'),
      intl('138245', '发证日期'),
      intl('138895', '到期日期'),
      intl('138199', '证书状态'),
    ],
    align: [1, 0, 0, 0, 0, 0],
    fields: [
      'NO.',
      'certifType|formatCont',
      'certifNo',
      'certifDate|formatTime',
      'expireDate|formatTime',
      'certificateStatus',
    ],
    notVipPageTurning: true,
    notVipPageTitle: intl('138671', '资质认证'),
    notVipPagedesc: '购买VIP/SVIP套餐，即可不限次查看企业资质认证信息',
    rightFilters: [
      {
        key4sel: 'category',
        key4ajax: 'category',
        name: intl('12074', '全部类型'),
        typeOf: 'string',
        key: '',
      },
      {
        key4sel: 'status',
        key4ajax: 'status',
        name: intl('113998', '全部状态'),
        typeOf: 'string',
        key: '',
      },
    ],
    // extraParams: (param)=>{
    //     return {
    //         ...param,
    //         category: '',
    //         status: '',
    //     };
    // },
    dataCallback: (res) => {
      return res.list && res.list.length ? res.list : []
    },
    columns: [
      null,
      null,
      null,
      null,
      null,
      {
        render: (txt) => {
          if (!txt) return '--'
          if (txt === intl('36518', '有效')) return txt
          return <span>{txt}</span>
        },
      },
    ],
  },
  gettaxcredit1: {
    fn: 'gettaxcredit',
    cmd: 'detail/company/gettaxcreditlist',

    notVipTitle: intl('332374', 'A级纳税人'),
    notVipTips: vipDescDefault,
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('332374', 'A级纳税人'),
    moreLink: 'gettaxcredit1',
    modelNum: 'taxaCreditCount',
    thWidthRadio: ['5.2%', '24%', '24%', '24%', '10%', '14%'],
    thName: [
      intl('28846', '序号'),
      intl('138538', '纳税人名称'),
      intl('138469', '评级年度'),
      intl('138534', '纳税信用级别'),
      intl('203754', '详情'),
    ],
    align: [1, 0, 0, 0, 0, 0],
    fields: ['NO.', 'taxName', 'assessTime', 'creditLevel', ''],
    dataCallback: (res, _num, pageno) => {
      res.map((t, idx) => {
        t.key = t.key ? t.key : idx + pageno * 10
      })
      return res
    },
    columns: [
      null,
      {
        render: (_field, row) => <LinkByRowCompatibleCorpPerson nameKey={'taxName'} idKey={'taxId'} row={row} />,
      },
      null,
      null,

      null,
    ],
  },
  hzpscxk,
  selectList: {
    cmd: 'detail/company/getdirectorylist',
    title: intl('286256', '入选名录'),
    modelNum: 'listingTagsDataCount',

    notVipTitle: intl('286256', '入选名录'),
    notVipTips: vipDescDefault,
    thWidthRadio: ['5.2%', '26%', '60%', '10%'],
    thName: [intl('28846', '序号'), intl('344833', '名录信息'), intl('344834', '名录简介'), intl('36348', '操作')],
    align: [1, 0, 0, 0],
    fields: ['NO.', 'objectName', 'description', 'objectId1'],
    columns: [
      null,
      {
        render: (txt, row) => {
          const url = row.objectId ? `index.html#feturedcompany?id=${row.objectId}` : ''
          return <DetailLink url={url} txt={txt} />
        },
      },
      null,
    ],
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    rowSet: (row, _idx) => {
      if (!row.isShowDetail) {
        return {
          className: 'table-tr-detail-hide',
        }
      }
    },
    dataCallback: (res, _num, pageno) => {
      res.map((t, idx) => {
        t.key = t.key ? t.key : idx + pageno * 10
      })
      return res
    },
  },
  listInformation: {
    cmd: 'detail/company/getrankedcompanylistv2',
    title: intl('138468', '上榜信息'),
    moreLink: 'listInformation',
    modelNum: 'ranked_num',
    thWidthRadio: ['5.2%', '30%', '10%', '10%', '10%', '10%'],
    thName: [
      intl('28846', '序号'),
      intl('140374', '榜单'),
      intl('12634', '上榜日期'),
      intl('326735', '最新上榜名次'),
      intl('348169', '累计上榜次数'),
      intl('348176', '历史上榜详情'),
    ],
    align: [1, 0, 2, 2, 2, 1],
    fields: ['NO.', 'rankName|formatCont', 'rankTime', 'rankLevel', 'rankCount', 'rankCode1'],
    notVipTitle: intl('138468', '上榜信息'),
    notVipTips: intl('224205', '购买VIP/SVIP套餐，即可不限次查看企业上榜信息'),
    dataCallback: (res, _num, pageno) => {
      res.map((t, idx) => {
        t.key = t.key ? t.key : idx + pageno * 10
      })
      return res
    },
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return {
        ...param,
      }
    },
    columns: [
      null,
      {
        render: (_txt, row) => {
          const name = row.rankName || '--'
          const detailid = row.rankCode
          const url = `index.html#feturedcompany?id=${detailid}`
          return detailid ? <DetailLink url={url} txt={name} /> : name
        },
      },
      {
        render: (txt, _row) => {
          return wftCommon.formatTime(txt) || '--'
        },
      },
    ],
    rowSet: (row, _idx) => {
      if (!row.rankCount || row.rankCount < 2) {
        return {
          className: 'table-tr-detail-hide',
        }
      }
    },
  },
}
