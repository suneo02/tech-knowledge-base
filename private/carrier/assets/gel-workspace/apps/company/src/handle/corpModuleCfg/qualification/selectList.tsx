import { vipDescDefault } from '@/handle/corpModuleCfg/common/vipDesc.ts'
import { CorpSubModuleCfgVipNonCustom } from '@/types/corpDetail'
import { intlNoNO as intl } from '@/utils/intl'
import React from 'react'
import { DetailLink } from '../components'

export const corpSelectList: CorpSubModuleCfgVipNonCustom = {
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
}
