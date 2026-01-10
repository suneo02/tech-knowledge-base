import { ShareRateWithRoute } from '@/components/common/shareHolder'
import { CorpTableCfg } from '@/types/corpDetail'
import { formatShareRate } from '@/utils/format'
import { intlNoNO as intl } from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { HistoricalBeneficiary } from 'gel-types'
import React from 'react'
import { vipDescDefault } from '../common/vipDesc'

export const corpHistoryBeneficiary: CorpTableCfg<HistoricalBeneficiary> = {
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
  fields: ['NO.', 'beneficiaryName', 'showShareRate', 'endDate'],
  align: [0, 0, 2, 0],
  thWidthRadio: ['5.2%', '70%', '16%', '20%'],
  modelNum: 'historicalbeneficiaryCount',
  columns: [
    null,
    null,
    {
      render: (txt, row, _idx) => {
        return (
          <ShareRateWithRoute
            value={formatShareRate(txt)}
            hasRoute={row.shareRoute && row.shareRoute.length > 0}
            onRouteClick={() => wftCommon.renderShareRouteModal(row.shareRoute)}
          />
        )
      },
    },
    null,
  ],
}
