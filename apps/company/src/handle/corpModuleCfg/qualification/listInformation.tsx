import { CorpSubModuleCfgVipNonCustom } from '@/types/corpDetail'
import { intlNoNO as intl } from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import React from 'react'
import { DetailLink } from '../components'

export const corpListInformation: CorpSubModuleCfgVipNonCustom = {
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
}
