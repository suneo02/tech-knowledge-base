import { InfoCircleButton } from '@/components/icons/InfoCircle'
import intl from '@/utils/intl'
import { Tooltip } from '@wind/wind-ui'
import React, { FC } from 'react'

export const PatentLawStatusTitle: FC = () => {
  return (
    <span>
      {intl('138372', '法律状态')}
      <Tooltip
        title={
          <div>
            {intl(
              '285417',
              '专利的法律状态一般有五个阶段：受理、初审、公布、实质审查与授权。</br>初审通过后可以公布，后进入实际审查阶段，即实质审查生效，在该阶段对专利申请是否具有新颖性、创造性、实用性及专利法规定的其他实质性条件进行全面审查，审查通过则授予专利权，不符合则驳回。'
            )}
          </div>
        }
      >
        <InfoCircleButton />
      </Tooltip>
    </span>
  )
}
