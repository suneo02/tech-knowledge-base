import { isDev } from '@/utils/env'
import { wftCommon } from '@/utils/utils'
import { Col, Row } from '@wind/wind-ui'
import { intl } from 'gel-util/intl'
import { BaiFenSites, LinkModule, generateUrlByModule } from 'gel-util/link'
import React from 'react'
import { VipMarketingEdition } from './VipMarketingEdition'

export interface GroupProps {
  vipPopupSel: 'vip' | 'svip' | 'ep'
  onSelect: (type: 'vip' | 'svip' | 'ep') => void
  isActivityUser?: boolean
}

export const EpOnlyGroup: React.FC<GroupProps> = ({ vipPopupSel, onSelect }) => {
  return (
    <Row gutter={12}>
      <Col span={24}>
        <VipMarketingEdition selected={vipPopupSel === 'ep'} onClick={() => onSelect('ep')} />
      </Col>
    </Row>
  )
}

export interface MoreInfoLinkProps {
  vipPopupSel: 'vip' | 'svip' | 'ep'
}

export const MoreInfoLink: React.FC<MoreInfoLinkProps> = ({ vipPopupSel }) => {
  return (
    <Row
      className="gel-vipR-more"
      // @ts-expect-error wind ui
      onClick={() => {
        const path =
          vipPopupSel === 'ep'
            ? BaiFenSites({ isBaiFenTerminal: wftCommon.isBaiFenTerminal() }).authDesc
            : generateUrlByModule({ module: LinkModule.VIP_CENTER, isDev })
        if (!path) {
          return
        }
        window.open(path)
      }}
    >
      <Col>{intl('353715', '查看全部权限和价格')}</Col>
    </Row>
  )
}
