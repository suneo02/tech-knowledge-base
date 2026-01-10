import Links from '@/components/common/links/Links.tsx'
import { RightGotoLink } from '@/components/common/RightGotoLink'
import CompanyLink from '@/components/company/CompanyLink.tsx'
import { DetailLink } from '@/components/company/corpCompMisc.tsx'
import { LinksModule } from '@/handle/link'
import { CorpSubModuleCfg } from '@/types/corpDetail'
import { intlNoNO as intl } from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { TenderNoticeHold, TenderNoticeInvest } from 'gel-types'
import { TenderWinnerTag } from 'gel-ui'
import { t } from 'gel-util/intl'
import React from 'react'

export const corpDetailTiddingInfo: CorpSubModuleCfg = {
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
      skipTransFieldsInKeyMode: ['purchasing_unit'],
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
          // name: intl('417701', '本企业投标'),//默认值
          isCheckBox: true, //是否是复选框
          // isOnceCount:true,
          key: '',
          listSort: [{ key: intl('417659', '本企业中标'), doc_count_key: 'aggs_bid_win' }],
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
      skipTransFieldsInKeyMode: ['purchasing_unit'],
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
      skipTransFieldsInKeyMode: ['purchasing_unit'],
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
                <Links module={LinksModule.COMPANY} id={item.companyCode} title={item.companyName} />
                <TenderWinnerTag unit={item} projectStage={row.project_stage} intl={t} />
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
      skipTransFieldsInKeyMode: ['purchasing_unit'],
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
                <Links module={LinksModule.COMPANY} id={item.companyCode} title={item.companyName} />
                <TenderWinnerTag unit={item} projectStage={row.project_stage} intl={t} />
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
}
