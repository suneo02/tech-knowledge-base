import Links from '@/components/common/links/Links.tsx'
import { RightGotoLink } from '@/components/common/RightGotoLink'
import CompanyLink from '@/components/company/CompanyLink.tsx'
import { DetailLink } from '@/components/company/corpCompMisc.tsx'
import { LinkByRowCompatibleCorpPerson } from '@/components/company/link/CorpOrPersonLink.tsx'
import { ICorpPrimaryModuleCfg } from '@/components/company/type'
import {
  corpDetailBussResearchReportConfig,
  corpDetailCommonCorpBus,
  corpDetailCorpBusBrand,
  corpDetailCorpBusBrandJoin,
  corpDetailCorpBusECommerce,
  corpDetailCorpBusProject,
  corpDetailCustomer,
  corpDetailCustomerSup,
  corpDetailLandInfo,
  corpDetailLandPub,
  corpDetailLandPurchase,
  corpDetailLandTrans,
  corpDetailSupplier,
} from '@/handle/corpModuleCfg'
import { corpDetailFinancialData } from '@/handle/corpModuleCfg/buss/finnancial.tsx'
import { LinksModule } from '@/handle/link'
import { formatCurrency } from '@/utils/common.ts'
import { intlNoNO as intl } from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { TenderNoticeHold, TenderNoticeInvest } from 'gel-types'
import { TenderWinnerTag } from 'gel-ui'
import React from 'react'
import { corpDetailFinancialAnalysis } from './finnancialAnalysis'

export const buss: ICorpPrimaryModuleCfg = {
  moduleTitle: {
    title: intl('451255', '经营状况'),
    moduleKey: 'bussiness', // 与左侧大菜单齐名
    noneData: intl('348955', '暂无经营信息'),
  },
  // 财务报表
  FinancialData: corpDetailFinancialData,
  // 财务指标
  Financeanalysis: corpDetailFinancialAnalysis,
  // 主营构成
  businessScope: {
    title: intl('138753', '主营构成'),
    pageSize: 100, // 每页条数
    noPagination: true, // 不用翻页
    cmd: 'detail/company/getmainbusinessstruct',
    modelNum: 'mainbusinessstruct_num',
    thWidthRadio: ['5.2%', '50%', '46%'],
    thName: [intl('28846', '序号'), intl('451260', '产品类别'), intl('348554', '业务收入占比')],
    align: [1, 0, 2],
    fields: ['NO.', 'businessItemAfterCorrecting', 'incomeProportion|formatPercent'],
    extraParams: (param) => {
      return { ...param, __primaryKey: param.companycode, itemType: '产品' }
    },
    dataCallback: (res) => {
      let sum = 0
      const len = res.length || 0
      res.map((t, idx) => {
        t['NO.'] = idx + 1
        if (t.incomeProportion) {
          sum += t.incomeProportion - 0
        }
      })
      // @ts-expect-error ttt
      sum = sum.toFixed(2)
      if (sum > 100) {
        sum = 100
      }
      if (window.en_access_config) {
        res.push({
          'NO.': '',
          businessItemAfterCorrecting: '合计',
          incomeProportion: sum,
        })
      } else {
        // 自定义合计
        res.push({
          'NO.': <span style={{ display: 'none' }}> {len + 1} </span>,
          businessItemAfterCorrecting: <span style={{ fontWeight: 'bold' }}> {intl('298334', '合计')} </span>,
          incomeProportion: sum,
        })
      }
      return res
    },
  },
  // 企业业务
  showComBuInfo: {
    title: intl('451256', '企业业务'),
    modelNum: corpDetailCommonCorpBus.modelNum,
    children: [
      {
        cmd: '/detail/company/projectInfo',
        extraParams: (param) => {
          return {
            ...param,
            __primaryKey: param.companycode,
          }
        },
        title: intl('205502', '项目信息'),
        tabChange: {
          type: [
            intl('205502', '项目信息'),
            intl('205501', '品牌信息'),
            intl('451257', '品牌加盟'),
            intl('222477', '电商店铺'),
          ],
          typeCnName: ['项目信息', '品牌信息', '品牌加盟', '电商店铺'],
          typeName: 'type',
          typeBasicNum: ['project_info_num', 'tradelbl_num', 'brand_combining_num', 'ecommerce_store_num'],
        },
        modelNum: corpDetailCorpBusProject.modelNum,
        moreLink: 'showComBuInfo',
        thWidthRadio: ['5.2%', '24%', '15%', '51%'],
        thName: [intl('28846', '序号'), intl('199999', '项目名称'), intl('451240', '所属领域'), intl('451241', '简介')],
        align: [1, 0, 0, 0],
        fields: ['NO.', 'projName', 'domain', 'projBrief'],
        notVipPageTurning: true,
        notVipPageTitle: intl('205502', '项目信息'),
        notVipPagedesc: intl('224207', '购买VIP/SVIP套餐，即可不限次查看企业更多项目信息'),
        dataCallback: (res, _num, pageno) => {
          res.map((t, idx) => {
            t.key = t.key ? t.key : idx + pageno * 10
          })
          return res
        },
      },
      {
        cmd: 'detail/company/getbrandnamelist',
        extraParams: (param) => {
          return {
            ...param,
            __primaryKey: param.companycode,
          }
        },
        title: intl('205501', '品牌信息'),
        modelNum: corpDetailCorpBusBrand.modelNum,
        moreLink: 'showComBuInfo',
        thWidthRadio: ['5.2%', '25%', '69%'],
        thName: [intl('28846', '序号'), intl('138665', '品牌名称'), intl('451241', '简介')],
        align: [1, 0, 0, 0, 0],
        fields: ['NO.', 'brand_name', 'introduction'],
        notVipPageTurning: true,
        notVipPageTitle: intl('205501', '品牌信息'),
        notVipPagedesc: intl('224208', '购买VIP/SVIP套餐，即可不限次查看企业更多品牌信息'),
        dataCallback: (res) => {
          return res.list && res.list.length ? res.list : []
        },
      },
      {
        cmd: 'detail/company/brandCombining',
        extraParams: (param) => {
          return {
            ...param,
            __primaryKey: param.companycode,
          }
        },
        title: intl('451257', '品牌加盟'),
        modelNum: corpDetailCorpBusBrandJoin.modelNum,
        moreLink: 'showComBuInfo',
        thWidthRadio: ['5.2%', '30%', '15%', '20%', '15%', '16%'],
        thName: [
          intl('28846', '序号'),
          intl('138665', '品牌名称'),
          intl('451242', '行业'),
          intl('222798', '加盟模式'),
          intl('451243', '基本投资'),
          intl('451244', '加盟费用'),
        ],
        align: [1, 0, 0, 0, 0, 0],
        fields: ['NO.', 'brandName', 'industry', 'joinModel', 'basicInvestment', 'joiningFree'],
      },
      {
        cmd: 'detail/company/ecommerceStore',
        extraParams: (param) => {
          return {
            ...param,
            __primaryKey: param.companycode,
          }
        },
        title: intl('222477', '电商店铺'),
        modelNum: corpDetailCorpBusECommerce.modelNum,
        moreLink: 'showComBuInfo',
        thWidthRadio: ['5.2%', '40%', '20%', '20%', '16%'],
        thName: [
          intl('28846', '序号'),
          intl('222801', '店铺名称'),
          intl('222802', '店铺类型'),
          intl('222804', '所属平台'),
          intl('222803', '经营模式'),
        ],
        align: [1, 0, 0, 0, 0],
        fields: ['NO.', 'shopName', 'shopType', 'platform', 'businessModel'],
      },
    ],
  },
  // APP产品
  showApp: {
    cmd: 'detail/company/getproductlist',
    extraParams: (param) => {
      return {
        ...param,
        __primaryKey: param.companycode,
      }
    },
    title: intl('451258', 'APP产品'),
    moreLink: 'showApp',
    modelNum: 'product_num',
    thWidthRadio: ['5.2%', '25%', '16%', '55%'],
    thName: [intl('28846', '序号'), intl('451259', '产品简称'), intl('451260', '产品类别'), intl('451261', '产品简述')],
    align: [1, 0, 0, 0, 0, 0, 0],
    fields: ['NO.', 'appAbbr', 'appCat', 'appBrief'],
    notVipPageTurning: true,
    notVipPageTitle: intl('138757', '产品信息'),
    notVipPagedesc: intl('224209', '购买VIP/SVIP套餐，即可不限次查看企业更多产品信息'),
    columns: [
      null,
      {
        render: (txt, row) => {
          const detailid = row['appId']
          const url = `index.html#productDetail?type=product&detailid=${detailid}`
          const txtStr = detailid ? <DetailLink url={url} txt={txt} /> : txt
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {wftCommon.imageBase(6730, row['appRowkey'])}
              <span style={{ marginLeft: '8px' }}>{txtStr}</span>
            </div>
          )
        },
      },
    ],
  },
  // 旗下酒店
  showHotels: {
    // cmd: 'gethotels',
    cmd: 'detail/company/hotels',
    extraParams: (param) => {
      return {
        ...param,
        __primaryKey: param.companycode,
      }
    },
    title: intl('222478', '旗下酒店'),
    modelNum: 'hotel_num',
    moreLink: 'showHotels',
    thWidthRadio: ['5.2%', '20%', '10%', '10%', '56%'],
    thName: [
      intl('28846', '序号'),
      intl('222805', '酒店名称'),
      intl('222808', '酒店星级'),
      intl('222807', '开业日期'),
      intl('222809', '酒店简介'),
    ],
    align: [1, 0, 0, 0, 0],
    fields: ['NO.', 'hotelName', 'hotelStar', 'openDate', 'introduction'],
    columns: [
      null,
      {
        render: (txt, row, _idx) => {
          const detailid = row['hotelId']
          const url = `showItemDetail.html?type=hotels&detailid=${detailid}`
          return detailid ? <DetailLink style={{ marginLeft: '8px' }} url={url} txt={txt} /> : txt
        },
      },
    ],
  },
  // 公司研报
  researchReport01: {
    ...corpDetailBussResearchReportConfig,
    cmd: 'detail/company/getreportinfo',
    extraParams: (param) => {
      return {
        ...param,
        __primaryKey: param.companycode,
      }
    },
    title: intl('138775', '公司研报'),

    thWidthRadio: ['5.2%', '71%', '15%', '10%'],
    thName: [intl('28846', '序号'), intl('1786', '报告标题'), intl('9754', '来源'), intl('138908', '发布日期')],
    align: [1, 0, 0, 0],
    fields: ['NO.', 'title', 'broker', 'date|formatTime'],
    columns: [
      null,
      {
        render: (_txt, row) => {
          const id = row.id
          const title = row.title
          if (id) {
            return (
              <DetailLink
                txt={title}
                url="1"
                openFunc={() => {
                  if (window.external && window.external.ClientFunc) {
                    window.external.ClientFunc(
                      JSON.stringify({
                        func: 'command',
                        isGlobal: 1,
                        cmdid: '1902',
                        id: id,
                        title: title || '',
                        disableuppercase: 1,
                      })
                    )
                  } else {
                    // layer.msg("该功能需登录Wind金融终端。");
                  }
                }}
              />
            )
          }
          return title
        },
      },
      null,
      null,
    ],
  },
  // 政府重大项目
  majorGovProject: {
    cmd: 'detail/company/getgovhugeproject',
    title: intl('314693', '政府重大项目'),
    moreLink: 'majorGovProject',
    modelNum: 'gov_major_project_num',
    thWidthRadio: ['5.2%', '33%', '13%', '13%', '10%', '9%', '16%'],
    thName: [
      intl('28846', '序号'),
      intl('199999', '项目名称'),
      intl('314694', '项目所在地'),
      intl('15433', '项目类型'),
      intl('314714', '项目建设状态'),
      intl('314695', '项目年度'),
      intl('314696', '项目总投资金额(万)'),
    ],
    align: [1, 0, 0, 0, 0, 0, 2],
    fields: [
      'NO.',
      'project_name',
      'project_area',
      'project_type',
      'project_status',
      'project_year',
      'project_amount|formatMoneyComma',
    ],
    extraParams: (param) => {
      return {
        ...param,
        __primaryKey: param.companycode,
      }
    },
  },
  // 招标公告
  biddingInfo: {
    title: intl('257704', '招标公告'),
    withTab: true,
    modelNum: undefined,
    children: [
      {
        cmd: 'detail/company/bidSearchCompany',
        extraParams: (param) => ({
          ...param,
          __primaryKey: param.companycode,
        }),
        title: intl('74323', '本公司'),
        downDocType: 'download/createtempfile/bidSearchCompany',
        moreLink: 'biddingInfo1',
        needNoneTable: true,
        modelNum: 'bid_num_bgs',
        selName: ['biddingVal1'],
        aggName: ['aggs_bid_type'],
        thWidthRadio: ['5.2%', '34%', '12%', '12%', '20%', '20%', '12%'],
        thName: [
          intl('28846', '序号'),
          intl('90845', '公告标题'),
          intl('257654', '公告日期'),
          intl('6196', '公告类型'),
          intl('391573', '项目最新状态'),
          intl('327495', '招标产品'),
          intl('261808', '预算金额'),
        ],
        align: [1, 0, 0, 0, 0, 0, 2],
        fields: [
          'NO.',
          'title',
          'latest_announcement_time|formatTime',
          'bidding_type_name',
          'latest_project_stage',
          'product_name',
          'project_budget_money',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              const detailid = row['detail_id']
              const url = `index.html?type=bid&detailid=${detailid}#/biddingDetail`
              return detailid ? (
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
          {
            render: (txt, _row, _idx) => {
              if (txt) {
                const arr = (txt || '')?.split(',')
                return arr.map((item) => <CompanyLink name={item.split('|')[0]} id={item.split('|')[1]} />)
              } else {
                return '--'
              }
            },
          },
          {
            render: (txt, _row, _idx) =>
              Array.isArray(txt) && txt.length ? txt.map((item) => <span>#{item} </span>) : '--',
          },
          {
            render: (txt, _row, _idx) => wftCommon.formatMoney(txt, [4, '元']),
          },
        ],
        notVipPageTurning: true,
        notVipPageTitle: intl('271633', '招投标'),
        notVipPagedesc: intl('224206', '购买VIP/SVIP套餐，即可不限次查看企业更多招投标信息'),
        dataCallback: (res) => {
          return res.list && res.list.length ? res.list : []
        },

        rightFilters: [
          {
            key4sel: 'aggs_bid_type',
            key4ajax: 'type',
            name: intl('260080', '全部公告类型'),
            key: '',
            typeOf: 'string',
          },
          {
            key4sel: 'aggs_product_name',
            key4ajax: 'productName',
            type: 'tag',
            noNeedAll: true,
          },
        ],
      },
      {
        cmd: 'detail/company/bidSearchBranch',
        extraParams: (param) => ({
          ...param,
          __primaryKey: param.companycode,
        }),
        title: intl('204320', '分支机构'),
        downDocType: 'download/createtempfile/bidSearchBranch',
        moreLink: 'biddingInfo1',
        needNoneTable: true,
        modelNum: 'bid_num_fzjg',
        selName: ['biddingVal1'],
        aggName: ['aggs_bid_type'],
        thWidthRadio: ['5.2%', '24%', '12%', '12%', '18%', '18%', '18%', '12%'],
        thName: [
          intl('28846', '序号'),
          intl('90845', '公告标题'),
          intl('257654', '公告日期'),
          intl('6196', '公告类型'),
          intl('142476', '采购单位'),
          intl('391573', '项目最新状态'),
          intl('327495', '招标产品'),
          intl('261808', '预算金额'),
        ],
        align: [1, 0, 0, 0, 0, 0, 0, 2],
        fields: [
          'NO.',
          'title',
          'latest_announcement_time|formatTime',
          'bidding_type_name',
          'purchasing_unit',
          'latest_project_stage',
          'product_name',
          'project_budget_money',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              const detailid = row['detail_id']
              const url = `index.html?type=bid&detailid=${detailid}#/biddingDetail`
              return detailid ? (
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
          {
            render: (txt, _row, _idx) => {
              if (txt && typeof txt === 'string') {
                const arr = txt.split(',')
                return arr.map((item) => <CompanyLink name={item.split('|')[0]} id={item.split('|')[1]} />)
              } else {
                return '--'
              }
            },
          },
          {
            render: (txt, _row, _idx) => {
              if (txt && typeof txt === 'string') {
                const arr = txt.split(',')
                return arr.map((item) => <CompanyLink name={item.split('|')[0]} id={item.split('|')[1]} />)
              } else {
                return '--'
              }
            },
          },
          {
            render: (txt, _row, _idx) => {
              return Array.isArray(txt) && txt.length ? txt.map((item) => <span>#{item} </span>) : '--'
            },
          },
          {
            render: (txt, _row, _idx) => {
              return wftCommon.formatMoney(txt, [4, '元'])
            },
          },
        ],
        notVipPageTurning: true,
        notVipPageTitle: intl('271633', '招投标'),
        notVipPagedesc: intl('224206', '购买VIP/SVIP套餐，即可不限次查看企业更多招投标信息'),
        dataCallback: (res) => {
          return res.list && res.list.length ? res.list : []
        },
        rightFilters: [
          {
            key4sel: 'aggs_bid_type',
            key4ajax: 'type',
            name: intl('260080', '全部公告类型'),
            key: '',
            typeOf: 'string',
          },
          {
            key4sel: 'aggs_product_name',
            key4ajax: 'productName',
            type: 'tag',
            noNeedAll: true,
          },
        ],
      },
      {
        cmd: 'detail/company/bidSearchHold',
        extraParams: (param) => ({
          ...param,
          __primaryKey: param.companycode,
        }),
        title: intl('451208', '控股企业'),
        downDocType: 'download/createtempfile/bidSearchHold',
        moreLink: 'biddingInfo1',
        needNoneTable: true,
        modelNum: 'bid_num_kgqy',
        selName: ['biddingVal1'],
        aggName: ['aggs_bid_type'],
        thWidthRadio: ['5.2%', '24%', '12%', '12%', '18%', '18%', '18%', '12%'],
        thName: [
          intl('28846', '序号'),
          intl('90845', '公告标题'),
          intl('257654', '公告日期'),
          intl('6196', '公告类型'),
          intl('142476', '采购单位'),
          intl('391573', '项目最新状态'),
          intl('327495', '招标产品'),
          intl('261808', '预算金额'),
        ],
        align: [1, 0, 0, 0, 0, 0, 0, 2],
        fields: [
          'NO.',
          'title',
          'latest_announcement_time|formatTime',
          'bidding_type_name',
          'purchasing_unit',
          'latest_project_stage',
          'product_name',
          'project_budget_money',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              const detailid = row['detail_id']
              // const url = `index.html?nosearch=1#/biddingDetail?detailid=${detailid}`
              const url = `index.html?type=bid&detailid=${detailid}#/biddingDetail`
              return detailid ? (
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
          {
            render: (txt, _row, _idx) => {
              if (txt && typeof txt === 'string') {
                const arr = txt.split(',')
                return arr.map((item) => <CompanyLink name={item.split('|')[0]} id={item.split('|')[1]} />)
              } else {
                return '--'
              }
            },
          },
          {
            render: (txt, _row, _idx) => {
              if (txt && typeof txt === 'string') {
                const arr = txt.split(',')
                return arr.map((item) => <CompanyLink name={item.split('|')[0]} id={item.split('|')[1]} />)
              } else {
                return '--'
              }
            },
          },
          {
            render: (txt, _row, _idx) => {
              return Array.isArray(txt) && txt.length ? txt.map((item) => <span>#{item} </span>) : '--'
            },
          },
          {
            render: (txt, _row, _idx) => {
              return wftCommon.formatMoney(txt, [4, '元'])
            },
          },
        ],
        notVipPageTurning: true,
        notVipPageTitle: intl('271633', '招投标'),
        notVipPagedesc: intl('224206', '购买VIP/SVIP套餐，即可不限次查看企业更多招投标信息'),
        dataCallback: (res) => {
          return res.list && res.list.length ? res.list : []
        },
        rightFilters: [
          {
            key4sel: 'aggs_bid_type',
            key4ajax: 'type',
            name: intl('260080', '全部公告类型'),
            key: '',
            typeOf: 'string',
          },
          {
            key4sel: 'aggs_product_name',
            key4ajax: 'productName',
            type: 'tag',
            noNeedAll: true,
          },
        ],
      },
      {
        cmd: 'detail/company/bidSearchInvest',
        extraParams: (param) => ({
          ...param,
          __primaryKey: param.companycode,
        }),
        title: intl('138724', '对外投资'),
        downDocType: 'download/createtempfile/bidSearchInvest',
        moreLink: 'biddingInfo1',
        needNoneTable: true,
        modelNum: 'bid_num_dwtz',
        selName: ['biddingVal1'],
        aggName: ['aggs_bid_type'],
        thWidthRadio: ['5.2%', '24%', '12%', '12%', '18%', '18%', '18%', '12%'],
        thName: [
          intl('28846', '序号'),
          intl('90845', '公告标题'),
          intl('257654', '公告日期'),
          intl('6196', '公告类型'),
          intl('142476', '采购单位'),
          intl('391573', '项目最新状态'),
          intl('327495', '招标产品'),
          intl('261808', '预算金额'),
        ],
        align: [1, 0, 0, 0, 0, 0, 0, 2],
        fields: [
          'NO.',
          'title',
          'latest_announcement_time|formatTime',
          'bidding_type_name',
          'purchasing_unit',
          'latest_project_stage',
          'product_name',
          'project_budget_money',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              const detailid = row['detail_id']
              // const url = `index.html?nosearch=1#/biddingDetail?detailid=${detailid}`
              const url = `index.html?type=bid&detailid=${detailid}#/biddingDetail`
              return detailid ? (
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
          {
            render: (txt, _row, _idx) => {
              if (txt && typeof txt === 'string') {
                const arr = txt.split(',')
                return arr.map((item) => <CompanyLink name={item.split('|')[0]} id={item.split('|')[1]} />)
              } else {
                return '--'
              }
            },
          },
          {
            render: (txt, _row, _idx) => {
              if (txt && typeof txt === 'string') {
                const arr = txt.split(',')
                return arr.map((item) => <CompanyLink name={item.split('|')[0]} id={item.split('|')[1]} />)
              } else {
                return '--'
              }
            },
          },
          {
            render: (txt, _row, _idx) => {
              return Array.isArray(txt) && txt.length ? txt.map((item) => <span>#{item} </span>) : '--'
            },
          },
          {
            render: (txt, _row, _idx) => {
              return wftCommon.formatMoney(txt, [4, '元'])
            },
          },
        ],
        notVipPageTurning: true,
        notVipPageTitle: intl('271633', '招投标'),
        notVipPagedesc: intl('224206', '购买VIP/SVIP套餐，即可不限次查看企业更多招投标信息'),
        dataCallback: (res) => {
          return res.list && res.list.length ? res.list : []
        },
        rightFilters: [
          {
            key4sel: 'aggs_bid_type',
            key4ajax: 'type',
            name: intl('260080', '全部公告类型'),
            key: '',
            typeOf: 'string',
          },
          {
            key4sel: 'aggs_product_name',
            key4ajax: 'productName',
            type: 'tag',
            noNeedAll: true,
          },
        ],
      },
    ],
    rightLink: (_data) => {
      return (
        <span className="rightContainer">
          <RightGotoLink
            txt={intl('228333', '招投标查询')}
            func={() => {
              const url = `index.html#/searchBidNew?nosearch=1`
              // if (data) {
              //   for (let key in data) {
              //     url += `&${key}=${data[key]}`
              //   }
              // }
              wftCommon.jumpJqueryPage(url)
            }}
          ></RightGotoLink>
        </span>
      )
    },
  },
  // 投标公告
  tiddingInfo: {
    title: intl('324714', '投标公告'),
    needNoneTable: true,
    withTab: true,
    modelNum: undefined,
    children: [
      {
        cmd: 'detail/company/tenderSearchCompany',
        extraParams: (param) => ({
          ...param,
          __primaryKey: param.companycode,
        }),
        title: intl('74323', '本公司'),
        moreLink: 'biddingInfo3',
        needNoneTable: true,
        downDocType: 'download/createtempfile/tenderSearchCompany',
        modelNum: 'tid_num_bgs',
        selName: ['biddingVal3'],
        aggName: ['aggs_bid_type'],
        thWidthRadio: ['5.2%', '34%', '12%', '12%', '20%', '20%', '12%'],
        thName: [
          intl('28846', '序号'),
          intl('90845', '公告标题'),
          intl('257654', '公告日期'),
          intl('6196', '公告类型'),
          intl('142476', '采购单位'),
          intl('391653', '投标产品'),
          intl('257701', '中标金额'),
        ],
        align: [1, 0, 0, 0, 0, 0, 2],
        fields: [
          'NO.',
          'title',
          'latest_announcement_time|formatTime',
          'bidding_type_name',
          'purchasing_unit',
          'product_name',
          'bid_winning_money',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              const detailid = row['detail_id']
              const url = `index.html?type=bid&detailid=${detailid}#/biddingDetail`
              return detailid ? (
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
          {
            render: (txt, _row, _idx) => {
              if (txt && typeof txt === 'string') {
                const arr = txt.split(',')
                return arr.map((item) => <CompanyLink name={item.split('|')[0]} id={item.split('|')[1]} />)
              } else {
                return '--'
              }
            },
          },
          {
            render: (txt, _row, _idx) => {
              return Array.isArray(txt) && txt.length ? txt.map((item) => <span>#{item} </span>) : '--'
            },
          },
          {
            render: (txt, _row, _idx) => {
              return wftCommon.formatMoney(txt, [4, '元'])
            },
          },
        ],
        notVipPageTurning: true,
        notVipPageTitle: intl('271633', '招投标'),
        notVipPagedesc: intl('224206', '购买VIP/SVIP套餐，即可不限次查看企业更多招投标信息'),
        dataCallback: (res) => {
          return res.list && res.list.length ? res.list : []
        },

        rightFilters: [
          {
            key4sel: 'aggs_bid_win',
            key4ajax: 'isBidWinner',
            // isStatic:true,// 是否是静态固定筛选项
            // needStaticCount:true,// 静态固定筛选项是否需要计数
            // name: intl('', '本企业投标'),//默认值
            isCheckBox: true, //是否是复选框
            // isOnceCount:true,
            key: '',
            listSort: [{ key: intl('', '本企业中标'), doc_count_key: 'aggs_bid_win' }],
          },
          {
            key4sel: 'aggs_bid_type',
            key4ajax: 'type',
            name: intl('260080', '全部公告类型'),
            key: '',
            typeOf: 'string',
          },
          {
            key4sel: 'aggs_product_name',
            key4ajax: 'productName',
            type: 'tag',
            noNeedAll: true,
          },
        ],
      },
      {
        cmd: 'detail/company/tenderSearchBranch',
        extraParams: (param) => ({
          ...param,
          __primaryKey: param.companycode,
        }),
        title: intl('204320', '分支机构'),
        moreLink: 'biddingInfo3',
        needNoneTable: true,
        downDocType: 'download/createtempfile/tenderSearchBranch',
        modelNum: 'tid_num_fzjg',
        selName: ['biddingVal3'],
        aggName: ['aggs_bid_type'],
        thWidthRadio: ['5.2%', '24%', '12%', '12%', '18%', '18%', '18%', '12%'],
        thName: [
          intl('28846', '序号'),
          intl('90845', '公告标题'),
          intl('257654', '公告日期'),
          intl('6196', '公告类型'),
          intl('257824', '投标单位'),
          intl('142476', '采购单位'),
          intl('391653', '投标产品'),
          intl('257701', '中标金额'),
        ],
        align: [1, 0, 0, 0, 0, 0, 0, 2],
        fields: [
          'NO.',
          'title',
          'latest_announcement_time|formatTime',
          'bidding_type_name',
          'bid_winner',
          'purchasing_unit',
          'product_name',
          'bid_winning_money',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              const detailid = row['detail_id']
              // const url = `index.html?nosearch=1#/biddingDetail?detailid=${detailid}`
              const url = `index.html?type=bid&detailid=${detailid}#/biddingDetail`
              return detailid ? (
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
          {
            render: (txt, _row, _idx) => {
              if (txt && typeof txt === 'string') {
                const arr = txt.split(',')
                return arr.map((item) => <CompanyLink name={item.split('|')[0]} id={item.split('|')[1]} />)
              } else {
                return '--'
              }
            },
          },
          {
            render: (txt, _row, _idx) => {
              if (txt) {
                const arr = txt.split(',')
                return arr.map((item) => <CompanyLink name={item.split('|')[0]} id={item.split('|')[1]} />)
              } else {
                return '--'
              }
            },
          },
          {
            render: (txt, _row, _idx) => {
              return Array.isArray(txt) && txt.length ? txt.map((item) => <span>#{item} </span>) : '--'
            },
          },
          {
            render: (txt, _row, _idx) => {
              return wftCommon.formatMoney(txt, [4, '元'])
            },
          },
        ],
        notVipPageTurning: true,
        notVipPageTitle: intl('271633', '招投标'),
        notVipPagedesc: intl('224206', '购买VIP/SVIP套餐，即可不限次查看企业更多招投标信息'),
        dataCallback: (res) => {
          return res.list && res.list.length ? res.list : []
        },

        rightFilters: [
          {
            key4sel: 'aggs_bid_type',
            key4ajax: 'type',
            name: intl('260080', '全部公告类型'),
            key: '',
            typeOf: 'string',
          },
          {
            key4sel: 'aggs_product_name',
            key4ajax: 'productName',
            type: 'tag',
            noNeedAll: true,
          },
        ],
      },
      {
        // cmd: 'getbidsearchnew',
        // extraParams: (param) => {
        //   // param.role = '拟定供应商|投标单位|中标候选人|中标人/供应商';
        //   param.role = 1
        //   param.corpType = 1
        //   return param
        // },
        cmd: 'detail/company/tenderSearchHold',
        extraParams: (param) => ({
          ...param,
          __primaryKey: param.companycode,
          // role: 1,
          // corpType: 1,
        }),
        // title: intl('324714', '投标公告'),
        title: intl('451208', '控股企业'),
        moreLink: 'biddingInfo3',
        needNoneTable: true,
        downDocType: 'download/createtempfile/tenderSearchHold',
        // modelNum: "bid_new_num",
        modelNum: 'tid_num_kgqy',
        selName: ['biddingVal3'],
        aggName: ['aggs_bid_type'],
        thWidthRadio: ['5.2%', '24%', '12%', '12%', '18%', '18%', '18%', '12%'],
        thName: [
          intl('28846', '序号'),
          intl('90845', '公告标题'),
          intl('257654', '公告日期'),
          intl('6196', '公告类型'),
          intl('257824', '投标单位'),
          intl('142476', '采购单位'),
          intl('391653', '投标产品'),
          intl('257701', '中标金额'),
        ],
        align: [1, 0, 0, 0, 0, 0, 0, 2],
        fields: [
          'NO.',
          'title',
          'latest_announcement_time|formatTime',
          'bidding_type_name',
          'tenderUnits',
          'purchasing_unit',
          'product_name',
          'bid_winning_money',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              const detailid = row['detail_id']
              // const url = `index.html?nosearch=1#/biddingDetail?detailid=${detailid}`
              const url = `index.html?type=bid&detailid=${detailid}#/biddingDetail`
              return detailid ? (
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
          {
            render: (value: TenderNoticeHold['tenderUnits'], row: TenderNoticeHold, _idx) => {
              if (!value || !row || value.length === 0) {
                return '--'
              }
              return value.map((item) => (
                <>
                  <CompanyLink name={item.companyName} id={item.companyCode} />
                  <TenderWinnerTag unit={item} projectStage={row.project_stage} />
                </>
              ))
            },
          },
          {
            render: (txt, _row, _idx) => {
              if (txt) {
                const arr = txt.split(',')
                return arr.map((item) => <CompanyLink name={item.split('|')[0]} id={item.split('|')[1]} />)
              } else {
                return '--'
              }
            },
          },
          {
            render: (txt, _row, _idx) => {
              return Array.isArray(txt) && txt.length ? txt.map((item) => <span>#{item} </span>) : '--'
            },
          },
          {
            render: (txt, _row, _idx) => {
              return wftCommon.formatMoney(txt, [4, '元'])
            },
          },
        ],
        notVipPageTurning: true,
        notVipPageTitle: intl('271633', '招投标'),
        notVipPagedesc: intl('224206', '购买VIP/SVIP套餐，即可不限次查看企业更多招投标信息'),
        dataCallback: (res) => {
          return res.list && res.list.length ? res.list : []
        },

        rightFilters: [
          {
            key4sel: 'aggs_bid_type',
            key4ajax: 'type',
            name: intl('260080', '全部公告类型'),
            key: '',
            typeOf: 'string',
          },
          {
            key4sel: 'aggs_product_name',
            key4ajax: 'productName',
            type: 'tag',
            noNeedAll: true,
          },
        ],
      },
      {
        cmd: 'detail/company/tenderSearchInvest',
        extraParams: (param) => ({
          ...param,
          __primaryKey: param.companycode,
          // role: 1,
          // corpType: 2,
        }),
        // title: intl('324714', '投标公告'),
        title: intl('138724', '对外投资'),
        moreLink: 'biddingInfo3',
        needNoneTable: true,
        downDocType: 'download/createtempfile/tenderSearchInvest',
        // modelNum: "bid_new_num",
        modelNum: 'tid_num_dwtz',
        selName: ['biddingVal3'],
        aggName: ['aggs_bid_type'],
        thWidthRadio: ['5.2%', '24%', '12%', '12%', '18%', '18%', '18%', '12%'],
        thName: [
          intl('28846', '序号'),
          intl('90845', '公告标题'),
          intl('257654', '公告日期'),
          intl('6196', '公告类型'),
          intl('257824', '投标单位'),
          intl('142476', '采购单位'),
          intl('391653', '投标产品'),
          intl('257701', '中标金额'),
        ],
        align: [1, 0, 0, 0, 0, 0, 0, 2],
        fields: [
          'NO.',
          'title',
          'latest_announcement_time|formatTime',
          'bidding_type_name',
          'tenderUnits',
          'purchasing_unit',
          'product_name',
          'bid_winning_money',
        ],
        columns: [
          null,
          {
            render: (txt, row) => {
              const detailid = row['detail_id']
              // const url = `index.html?nosearch=1#/biddingDetail?detailid=${detailid}`
              const url = `index.html?type=bid&detailid=${detailid}#/biddingDetail`
              return detailid ? (
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
          {
            render: (value: TenderNoticeInvest['tenderUnits'], row: TenderNoticeInvest, _idx) => {
              if (!value || !row || value.length === 0) {
                return '--'
              }
              return value.map((item) => (
                <>
                  <CompanyLink name={item.companyName} id={item.companyCode} />
                  <TenderWinnerTag unit={item} projectStage={row.project_stage} />
                </>
              ))
            },
          },
          {
            render: (txt, _row, _idx) => {
              if (txt) {
                const arr = txt.split(',')
                return arr.map((item) => <CompanyLink name={item.split('|')[0]} id={item.split('|')[1]} />)
              } else {
                return '--'
              }
            },
          },
          {
            render: (txt, _row, _idx) => {
              return Array.isArray(txt) && txt.length ? txt.map((item) => <span>#{item} </span>) : '--'
            },
          },
          {
            render: (txt, _row, _idx) => {
              return wftCommon.formatMoney(txt, [4, '元'])
            },
          },
        ],
        notVipPageTurning: true,
        notVipPageTitle: intl('271633', '招投标'),
        notVipPagedesc: intl('224206', '购买VIP/SVIP套餐，即可不限次查看企业更多招投标信息'),
        dataCallback: (res) => {
          return res.list && res.list.length ? res.list : []
        },

        rightFilters: [
          {
            key4sel: 'aggs_bid_type',
            key4ajax: 'type',
            name: intl('260080', '全部公告类型'),
            key: '',
            typeOf: 'string',
          },
          {
            key4sel: 'aggs_product_name',
            key4ajax: 'productName',
            type: 'tag',
            noNeedAll: true,
          },
        ],
      },
    ],
    rightLink: (_data) => {
      return (
        <span className="rightContainer">
          <RightGotoLink
            txt={intl('228333', '招投标查询')}
            func={() => {
              const url = 'index.html#/searchBidNew?nosearch=1'
              wftCommon.jumpJqueryPage(url)
            }}
          ></RightGotoLink>
        </span>
      )
    },
  },
  // 招聘
  jobs: {
    cmd: 'detail/company/getrecuritV2',
    title: intl('138356', '招聘'),
    moreLink: 'jobs',
    modelNum: 'recruitt_num',
    thWidthRadio: ['5.2%', '10%', '30%', '17%', '11%', '11%', '17%'],
    thName: [
      intl('28846', '序号'),
      intl('138908', '发布日期'),
      intl('35650', '职位'),
      intl('138498', '薪资'),
      intl('15972', '学历'),
      intl('138289', '经验'),
      intl('2901', '城市'),
    ],
    align: [1, 0, 0, 0, 0, 0, 0],
    fields: ['NO.', 'releaseTime|formatTime', 'job', 'pay', 'education', 'experience', 'city'],
    columns: [
      null,
      null,
      {
        render: (txt, row, _idx) => {
          const detailid = row['referenceId']
          return detailid ? (
            <Links module={LinksModule.JOB} id={detailid} title={txt} extraId={window.__GELCOMPANYCODE__}></Links>
          ) : (
            txt
          )
        },
      },
      {
        render: (txt, row) => {
          if (txt) {
            let txtStr = txt
            if (row.payFrequency) {
              if (row.payFrequency.indexOf('日') > -1) {
                txtStr = txtStr + ' / 日'
              } else if (row.payFrequency.indexOf('周') > -1) {
                txtStr = txtStr + ' / 周'
              } else if (row.payFrequency.indexOf('年') > -1) {
                txtStr = txtStr + ' / 年'
              } else if (row.payFrequency.indexOf('件') > -1) {
                txtStr = txtStr + ' / 件'
              } else if (row.payFrequency.indexOf('时') > -1) {
                txtStr = txtStr + ' / 时'
              } else if (row.payFrequency.indexOf('月') > -1) {
                const minPay = row.minPayMonth
                const maxPay = row.maxPayMonth
                if (minPay && maxPay) {
                  txtStr = txtStr + ' · ' + minPay + '-' + maxPay + '薪'
                } else if (minPay) {
                  txtStr = txtStr + ' · ' + minPay + '薪'
                } else if (maxPay) {
                  txtStr = txtStr + ' · ' + maxPay + '薪'
                }
              }
            }
            return txtStr
          }
          return '--'
        },
      },
      null,
      null,
      null,
    ],
    notVipPageTurning: true,
    notVipPageTitle: intl('138356', '招聘'),
    notVipPagedesc: '购买VIP/SVIP套餐，即可不限次查看企业招聘信息',
    dataCallback: (res, _num, pageno) => {
      res.map((t, idx) => {
        t.key = t.key ? t.key : idx + pageno * 10
      })
      return res
    },
    downDocType: 'download/createtempfile/getrecurit',
    extraParams: (param) => {
      delete param.companyid
      return {
        ...param,
        __primaryKey: param.companycode,
      }
    },
  },

  // 土地信息
  showLandInfo: {
    title: intl('114647', '土地信息'),
    modelNum: corpDetailLandInfo.modelNum,
    children: [
      {
        fn: 'showLandInfo',
        cmd: '/detail/company/getlandanns',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        title: intl('205431', '地块公示'),
        tabChange: {
          type: [intl('205431', '地块公示'), intl('205432', '购地信息'), intl('205433', '土地转让')],
          typeCnName: ['地块公示', '购地信息', '土地转让'],
          typeName: 'type',
          typeBasicNum: ['landanns_num', 'landpurchase_num', 'landtrans_num'],
        },
        modelNum: corpDetailLandPub.modelNum,
        moreLink: 'showLandInfo',
        thWidthRadio: ['5.2%', '40%', '20%', '20%', '10%', '6%'],
        thName: [
          intl('28846', '序号'),
          intl('205434', '地块位置'),
          intl('205383', '行政区'),
          intl('205435', '发布机关'),
          intl('138908', '发布日期'),
          intl('36348', '操作'),
        ],
        align: [1, 0, 0, 0, 0, 0, 0],
        fields: ['NO.', 'landLoc', 'regionCode', 'relAgency', 'relDate|formatTime', 'decs'],
        dataCallback: (res, _num, pageno) => {
          res.map((t, idx) => {
            t.key = t.key ? t.key : idx + pageno * 10
          })
          return res
        },
      },
      {
        fn: 'showLandInfo',
        cmd: '/detail/company/getlandpurchase',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        title: intl('348190', '拿地信息'),
        modelNum: corpDetailLandPurchase.modelNum,
        moreLink: 'showLandInfo',
        thWidthRadio: ['5.2%', '17%', '18%', '15%', '15%', '15%', '10%', '6%'],
        thName: [
          intl('28846', '序号'),
          intl('205434', '地块位置'),
          intl('100868', '土地用途'),
          intl('205389', '土地面积(公顷)'),
          intl('205386', '成交价格(万元)'),
          intl('205383', '行政区'),
          intl('205436', '合同签订日期'),
          intl('36348', '操作'),
        ],
        align: [1, 0, 0, 2, 2, 0, 0, 0],
        fields: [
          'NO.',
          'projPos',
          'landUsage',
          'landHa',
          'dealPrice|formatMoneyComma',
          'regionCode',
          'contractDate|formatTime',
          'decs',
        ],
        dataCallback: (res, _num, pageno) => {
          res.map((t, idx) => {
            t.key = t.key ? t.key : idx + pageno * 10
          })
          return res
        },
      },
      {
        fn: 'showLandInfo',
        cmd: '/detail/company/getlandtrans',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        title: intl('205433', '土地转让'),
        modelNum: corpDetailLandTrans.modelNum,
        moreLink: 'showLandInfo',
        thWidthRadio: ['5.2%', '17%', '18%', '15%', '15%', '15%', '10%', '6%'],
        thName: [
          intl('28846', '序号'),
          intl('205434', '地块位置'),
          intl('205439', '原土地使用权人'),
          intl('205438', '现土地使用权人'),
          intl('205389', '土地面积(公顷)'),
          intl('205396', '转让价格(万元)'),
          intl('2811', '成交日期'),
          intl('36348', '操作'),
        ],
        align: [1, 0, 0, 0, 0, 0, 0],
        fields: ['NO.', 'landPos', 'oldUser', 'curUser', 'landHa', 'transPrice', 'dealTime|formatTime', 'decs'],
        dataCallback: (res, _num, pageno) => {
          res.map((t, idx) => {
            t.key = t.key ? t.key : idx + pageno * 10
          })
          return res
        },
      },
    ],
  },

  // 私募基金
  getfundpe: {
    cmd: 'detail/company/getfundpe',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('119142', '私募基金'),
    moreLink: 'getfundpe',
    modelNum: 'fundpe_num',
    thWidthRadio: ['5.2%', '26%', '25%', '15%', '10%', '10%', '10%'],
    thName: [
      intl('28846', '序号'),
      intl('205392', '私募基金管理人名称'),
      intl('118609', '法定代表人/执行事务合伙人'),
      intl('145812', '机构类型'),
      intl('138769', '登记编号'),
      intl('2823', '成立日期'),
      intl('36348', '操作'),
    ],
    align: [1, 0, 0, 0, 0, 0, 0],
    fields: ['NO.', 'orgName', 'legalPerson', 'orgType', 'regCode', 'establishDate|formatTime', 'referenceId'],
    columns: [
      null,
      {
        render: (txt, row, _idx) => {
          return <CompanyLink name={txt} id={row.windId}></CompanyLink>
        },
      },
      null,
      null,
      null,
      null,
    ],
  },

  // 客户和供应商
  showCustomersSup: {
    title: intl('205516', '客户和供应商'),
    modelNum: corpDetailCustomerSup.modelNum,
    children: [
      {
        fn: 'showCustomersSup',
        cmd: 'detail/company/getcorpcustomer',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        title: intl('28717', '客户'),
        selName: ['customerSupVal'],
        aggName: ['aggs_period'],
        tabChange: {
          type: [intl('28717', '客户'), intl('108764', '供应商')],
          typeCnName: ['客户', '供应商'],
          typeName: 'type',
          typeBasicNum: ['customer_num', 'supplier_num'],
        },
        modelNum: corpDetailCustomer.modelNum,
        moreLink: 'showCustomersSup',
        thWidthRadio: ['5.2%', '30%', '25%', '16%', '15%', '16%'],
        thName: [
          intl('28846', '序号'),
          intl('205519', '客户名称'),
          intl('205518', '销售金额(元)'),
          intl('298342', '销售占比'),
          intl('1794', '报告期'),
          intl('255527', '与本公司关系'),
        ],
        align: [1, 0, 2, 2, 0, 0, 0],
        fields: ['NO.', 'company_name', 'money', 'proportion|formatPercent', 'period|formatTime', 'relationship'],
        notVipPageTurning: true,
        notVipPageTitle: intl('28717', '客户'),
        notVipPagedesc: intl('224210', '购买VIP/SVIP套餐，即可不限次查看企业更多客户信息'),
        rightFilters: [
          {
            key4sel: 'aggs_period',
            key4ajax: 'period',
            name: intl('240288', '全部报告期'),
            key: '',
            keyRender: function (data) {
              return wftCommon.formatTime(data)
            },
          },
        ],
        columns: [
          null,
          {
            render: (_txt, row) => <LinkByRowCompatibleCorpPerson nameKey={'company_name'} row={row} />,
          },
          {
            render: (_, row) => {
              return formatCurrency(row.money, row.moneyUnit)
            },
          },
          null,
          null,
          null,
          null,
        ],
        dataCallback: (res) => {
          return res.list && res.list.length ? res.list : []
        },
      },
      {
        fn: 'showCustomersSup',
        cmd: 'detail/company/getcorpsupplier',
        extraParams: (param) => {
          param.__primaryKey = param.companycode
          return param
        },
        title: intl('108764', '供应商'),
        selName: ['supplierVal'],
        aggName: ['aggs_period'],
        modelNum: corpDetailSupplier.modelNum,
        moreLink: 'showCustomersSup',
        thWidthRadio: ['5.2%', '30%', '25%', '14%', '18%', '17%'],
        thName: [
          intl('28846', '序号'),
          intl('205522', '供应商名称'),
          intl('205521', '采购金额(元)'),
          intl('1794', '报告期'),
          intl('255527', '与本公司关系'),
        ],
        align: [1, 0, 2, 0, 0, 0],
        fields: ['NO.', 'company_name', 'money', 'period|formatTime', 'relationship'],
        columns: [
          null,
          {
            render: (_txt, row) => <LinkByRowCompatibleCorpPerson nameKey={'company_name'} row={row} />,
          },
          {
            render: (_, row) => {
              return formatCurrency(row.money, row.moneyUnit)
            },
          },
          null,
          null,
          null,
          null,
        ],
        notVipPageTurning: true,
        notVipPageTitle: intl('108764', '供应商'),
        notVipPagedesc: intl('224211', '购买VIP/SVIP套餐，即可不限次查看企业更多供应商信息'),
        rightFilters: [
          {
            key4sel: 'aggs_period',
            key4ajax: 'period',
            name: intl('240288', '全部报告期'),
            key: '',
            keyRender: function (data) {
              return wftCommon.formatTime(data)
            },
          },
        ],
        dataCallback: (res) => {
          return res.list && res.list.length ? res.list : []
        },
      },
    ],
  },
  // 业务关联方
  getrelatedparty: {
    cmd: 'detail/company/getrelatedparty',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('222763', '业务关联方'),
    moreLink: 'getrelatedparty',
    modelNum: 'relate_dparty_num',
    thName: [intl('28846', '序号'), intl('222781', '关联方类型'), intl('222782', '关联方名称')],
    thWidthRadio: ['5.2%', '42%', '54%'],
    align: [1, 0, 0],
    fields: ['NO.', 'relatedPartyType', 'relatedPartyName'],
    columns: [
      null,
      null,
      {
        render: (txt, row, _idx) => {
          return <CompanyLink name={txt} id={row.relatedPartyId}></CompanyLink>
        },
      },
    ],
  },
  // 政府补贴
  governmentSupport01: {
    cmd: 'detail/company/getgovernmentinfo',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    title: intl('138315', '政府补贴'),
    modelNum: 'governmentgrants_num',
    thWidthRadio: ['5.2%', '35%', '25%', '20%', '16%'],
    thName: [
      intl('28846', '序号'),
      intl('138613', '政府补贴项目名称'),
      intl('138614', '本期发生额(元)'),
      intl('138615', '上期发生额(元)'),
      intl('1794', '报告期'),
    ],
    align: [1, 0, 2, 2, 0],
    fields: ['NO.', 'item', 'amountOfCurrentPeriod', 'amountOfLastPeriod', 'date|formatTime'],
    columns: [
      null,
      null,
      {
        render: (txt, _row, _idx) => {
          return wftCommon.formatMoney(txt, '', null, true)
        },
      },
      {
        render: (txt, _row, _idx) => {
          return wftCommon.formatMoney(txt, '', null, true)
        },
      },
      null,
    ],
    notVipTitle: intl('138315', '政府补贴'),
    notVipTips: intl('224203', '购买VIP/SVIP套餐，即可不限次查看企业政府补贴信息'),
  },
  // 政府扶持
  getgovsupport: {
    cmd: 'detail/company/getgovsupport',
    extraParams: (param) => {
      param.__primaryKey = param.companycode
      return param
    },
    // cmd: 'getgovsupport',
    title: intl('222475', '政府扶持'),
    modelNum: 'gov_support_num',
    thWidthRadio: ['5.2%', '25%', '10%', '16%', '10%', '35%'],
    thName: [
      intl('28846', '序号'),
      intl('222776', '享受扶持政策依据'),
      intl('312514', '金额'),
      intl('222778', '实施部门'),
      intl('222779', '扶持日期'),
      intl('222780', '扶持内容'),
    ],
    align: [1, 0, 0, 0, 0, 0],
    fields: ['NO.', 'policy', 'amount|formatMoney', 'orgName', 'date|formatTime', 'content'],
  },
}
