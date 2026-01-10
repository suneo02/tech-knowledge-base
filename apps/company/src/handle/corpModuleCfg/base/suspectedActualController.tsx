import { pointBuriedByModule } from '@/api/pointBuried/bury'
import Links from '@/components/common/links/Links.tsx'
import { ShareRateWithRoute } from '@/components/common/shareHolder'
import { LinksModule } from '@/handle/link'
import { CorpTableCfg } from '@/types/corpDetail'
import { formatShareRate } from '@/utils/format'
import { intlNoNO as intl } from '@/utils/intl'
import { hashParams } from '@/utils/links'
import { wftCommon } from '@/utils/utils'
import { SuspectedActualController } from 'gel-types'
import React from 'react'

const { getParamValue } = hashParams()

export const corpSuspectedActualController: CorpTableCfg<SuspectedActualController> = {
  title: intl('261456', '疑似实控人'),
  hint:
    '<i><div><span>' +
    intl(
      '372191',
      '全球企业库依据股权穿透计算后得出疑似实际控制人，企业在公司章程或股东协议中或许有其他安排，在使用该数据前建议跟企业做进一步核实。数据仅供用户参考，不代表全球企业库的任何明示、暗示之观点或保证。'
    ) +
    '</span></div></i>',
  cmd: '/detail/company/getcorpactcontrol_calc',
  thWidthRadio: ['5.2%', '76', '20%'],
  modelNum: 'actualcontrollerCalcCount',
  thName: [intl('28846', '序号'), intl('298298', '疑似实控人名称'), intl('451217', '持股比例(%)')],
  align: [1, 0, 2],
  fields: ['NO.', 'ActControName', 'showShareRate'],
  extraParams: (param) => {
    return {
      ...param,
      __primaryKey: param.companycode,
    }
  },
  columns: [
    null,
    {
      render: (txt, row) => {
        let module
        if (row.typeName === 'company') {
          module = LinksModule.COMPANY
        }
        if (row.typeName === 'person') {
          module = LinksModule.CHARACTER
        }
        return <Links title={txt} id={row.ActControId} module={module} />
      },
    },
    {
      render: (txt, row) => {
        return (
          <ShareRateWithRoute
            value={formatShareRate(txt)}
            hasRoute={row.isShareRoute}
            valueStyle={{ width: 140 }}
            onRouteClick={() => {
              pointBuriedByModule(922602100967, { opEntity: `-${intl('261456', '疑似实控人')}` })
              wftCommon.renderShareRouteModal(
                undefined,
                {
                  left: intl('261456', '疑似实控人'),
                  right: intl('138412', '实际持股比例'),
                },
                {
                  api: `detail/company/getcorpactcontrolshareroute/${getParamValue('companycode')}`,
                  params: { detailId: row.detailId },
                }
              )
            }}
          />
        )
      },
    },
  ],
}
