/**
 * 历史最终受益人 - History Beneficiaries - 370004
 * Created by Calvin
 *
 * @format
 */

import { intlNoIndex } from '../../../../utils/intl'
import { wftCommon } from '../../../../utils/utils'
import React from 'react'

const title = intlNoIndex('439434', '历史最终受益人')

export const historyBeneficiaries = {
  title,
  cmd: 'detail/company/gethistoricalbeneficiary/1210689251',
  thName: [
    intlNoIndex('138741', '序号'),
    intlNoIndex('138180', '最终受益人'),
    intlNoIndex('261873', '最终受益股份'),
    intlNoIndex('451201', '变更日期'),
  ],
  fields: ['NO.', 'beneficiaryName', 'ratio', 'endDate'],
  align: [0, 0, 2, 0],
  thWidthRadio: ['4%', '70%', '16%', '20%'],
  modelNum: 'historicalbeneficiaryCount',
  columns: [
    null,
    null,
    {
      render: (txt, row) => {
        if (window.en_access_config) {
          return wftCommon.formatPercent(txt) // 临时处理
        }
        if (row.shareRoute && row.shareRoute.length > 0) {
          var shareRate = wftCommon.ultimateBeneficialShares(row.shareRoute)
          return (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: 140 }}>{shareRate ? (shareRate == 0 ? '--' : shareRate) : '--'}</div>
              <div className="share-route" onClick={() => wftCommon.showRoute(row.shareRoute)}></div>
            </div>
          )
        } else {
          return wftCommon.formatPercent(txt)
        }
      },
    },
    null,
  ],
}
