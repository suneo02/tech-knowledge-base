import { InfoCircleButton } from '@/components/icons/InfoCircle'
import { Popover } from '@wind/wind-ui'
import React, { FC } from 'react'
import styled from 'styled-components'
import vipLogo from '../../../../assets/imgs/svip.png'

const ConditionTitle: FC<{
  filter?: boolean
  itemName: string
  isVip?: boolean
  hoverHint?: string
}> = ({ filter, itemName, isVip, hoverHint }) => {
  return (
    <Box className={`subTitle ${filter ? 'hasVal' : ''}`}>
      {itemName}
      {isVip ? <img className="vip-logo" src={vipLogo} /> : null}
      {hoverHint ? (
        <Popover content={hoverHint} style={{ width: 400 }} data-uc-id="cwTVcPJWNG" data-uc-ct="popover">
          <InfoCircleButton />
        </Popover>
      ) : null}
    </Box>
  )
}

const Box = styled.p`
  &.subTitle {
    color: #000;
    line-height: 28px;
    font-size: 14px;
  }
  .vip-logo {
    width: 25px;
    vertical-align: top;
    margin-left: 2px;
    margin-top: 2px;
  }
`
export default ConditionTitle
