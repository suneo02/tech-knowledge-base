import { pointBuriedByModule } from '@/api/pointBuried/bury'
import { intl } from 'gel-util/intl'
import React, { FC } from 'react'

export const CorpShowMoreTags: FC<{
  onClick?: () => void
}> = ({ onClick }) => {
  return (
    <span
      onClick={() => {
        pointBuriedByModule(922602100313)
        onClick?.()
      }}
      className="more-tags-company"
      data-uc-id="apmTYmwbYqv"
      data-uc-ct="span"
    >
      {intl('138737', '查看更多')}
    </span>
  )
}
