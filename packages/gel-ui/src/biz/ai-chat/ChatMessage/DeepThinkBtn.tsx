import { Deepthink, DeepthinkFilled } from '@/assets'
import { WuiAliceBtn } from '@/common'
import { t } from 'gel-util/intl'
import { FC } from 'react'

export const DeepThinkBtn: FC<{
  deepthink?: boolean
  onClick: () => void
}> = ({ deepthink, onClick }) => {
  return (
    <WuiAliceBtn active={deepthink} onClick={onClick} icon={deepthink ? <DeepthinkFilled /> : <Deepthink />}>
      <span>{t('421453', '深度思考(R1)')}</span>
    </WuiAliceBtn>
  )
}
