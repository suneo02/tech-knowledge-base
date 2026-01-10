import { ShareRateWithRoute } from '@/components/common/shareHolder'
import { CorpTableCfg } from '@/types/corpDetail'
import { formatShareRate } from '@/utils/format'
import { intlNoNO as intl } from '@/utils/intl'
import { hashParams } from '@/utils/links'
import { wftCommon } from '@/utils/utils'
import { HistoricalActualController } from 'gel-types'
import React from 'react'
import { vipDescDefault } from '../common/vipDesc'

const { getParamValue } = hashParams()

export const corpHistoryUltimatecontroller: CorpTableCfg<HistoricalActualController> = {
  title: intl('439454', '历史实际控制人'),
  cmd: 'detail/company/gethistoricalcontroller',
  notVipTitle: intl('439454', '历史实际控制人'),
  notVipTips: vipDescDefault,
  extraParams: (param) => {
    param.__primaryKey = param.companycode
    return {
      ...param,
    }
  },
  thName: [
    intl('28846', '序号'),
    intl('439435', '实控人名称'),
    intl('138412', '实际持股比例'),
    intl('451201', '变更日期'),
  ],
  fields: ['NO.', 'controllerName', 'showShareRate', 'endDate'],
  align: [0, 0, 2, 0],
  thWidthRadio: ['5.2%', '70%', '16%', '20%'],
  modelNum: 'historicalcontrollerCount',
  columns: [
    null,
    null,
    {
      render: (txt, row) => {
        return (
          <ShareRateWithRoute
            value={formatShareRate(txt)}
            hasRoute={row.isShareRoute}
            valueStyle={{ width: 140 }}
            onRouteClick={() =>
              wftCommon.renderShareRouteModal(
                undefined,
                { left: '历史实控人', right: intl('138412', '实际持股比例') },
                {
                  api: `detail/company/getcorpactcontrolshareroute/${getParamValue('companycode')}`,
                  params: { detailId: row.detailId },
                }
              )
            }
          />
        )
      },
    },
  ],
}
