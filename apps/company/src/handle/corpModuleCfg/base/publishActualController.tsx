import { pointBuriedByModule } from '@/api/pointBuried/bury'
import Links from '@/components/common/links/Links.tsx'
import { ShareRateWithRoute } from '@/components/common/shareHolder'
import { LinksModule } from '@/handle/link'
import { CorpTableCfg } from '@/types/corpDetail'
import { formatShareRate } from '@/utils/format'
import { intlNoNO as intl } from '@/utils/intl'
import { hashParams } from '@/utils/links'
import { wftCommon } from '@/utils/utils'
import { DisclosedActualController } from 'gel-types'
import { ActualControllerGroupTag } from 'gel-ui'
import { t } from 'gel-util/intl'
import React from 'react'

const { getParamValue } = hashParams()

export const corpPublishActualController: CorpTableCfg<DisclosedActualController> = {
  title: intl('312174', '公告披露'),
  hint: '<i><div><span>' + intl('372190', '企业年报、公告披露的实际控制人。') + '</span></div></i>',
  cmd: '/detail/company/getcorpactcontrol_publish',
  thWidthRadio: ['5.2%', '76', '20%'],
  modelNum: 'actualcontrollerPublishCount',
  thName: [intl('28846', '序号'), intl('37962', '实际控制人名称'), intl('451217', '持股比例(%)')],
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
        return (
          <>
            <Links module={module} id={row.ActControId} title={txt} />
            {row.actor?.length
              ? row.actor.map((num) => <ActualControllerGroupTag num={num as unknown as number} intl={t} />)
              : null}
          </>
        )
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
              pointBuriedByModule(922602100967, {
                opEntity: `-${intl('13270', '实际控制人')}`,
              })
              wftCommon.renderShareRouteModal(
                undefined,
                {
                  left: intl('13270', '实际控制人'),
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
