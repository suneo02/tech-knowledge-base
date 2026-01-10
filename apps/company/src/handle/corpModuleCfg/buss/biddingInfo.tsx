import { RightGotoLink } from '@/components/common/RightGotoLink'
import CompanyLink from '@/components/company/CompanyLink.tsx'
import { DetailLink } from '@/components/company/corpCompMisc.tsx'
import { CorpSubModuleCfg } from '@/types/corpDetail'
import { intlNoNO as intl } from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import React from 'react'

export const corpDetailBiddingInfo: CorpSubModuleCfg = {
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
}
