import { initRandomRoomId, useChatRoomContext, useFavorites, useHistory } from '@/context'
import { ClockO, RightO } from '@wind/icons'
import { ButtonProps } from '@wind/wind-ui/lib/button/button'
import { AxiosInstance } from 'axios'
import classNames from 'classnames'
import { postPointBuriedWithAxios } from 'gel-api'
import { t } from 'gel-util/intl'
import { FC } from 'react'
import styles from './index.module.less'
import { message } from '@wind/wind-ui'

export const HistoryBtn: FC<
  ButtonProps & {
    axiosInstanceEntWeb: AxiosInstance
    loading?: boolean
  }
> = ({ axiosInstanceEntWeb, loading, ...props }) => {
  const { updateRoomId } = useChatRoomContext()
  const { showHistory, setShowHistory } = useHistory()
  const { setShowFavorites } = useFavorites()

  return (
    <div
      className={classNames(styles.historyBtn, { [styles['historyBtn--active']]: showHistory })}
      {...props}
      onClick={() => {
        if (loading) return message.error(t('421523', '请等待当前对话结束'))
        postPointBuriedWithAxios(axiosInstanceEntWeb, '922610370023')
        updateRoomId(initRandomRoomId())
        setShowHistory(!showHistory)
        setShowFavorites(false)
      }}
    >
      {/* @ts-expect-error windui */}
      <ClockO style={{ fontSize: 16 }} />
      <span className={styles.text}>{t('', '历史对话')}</span>
      {/* @ts-expect-error windui */}
      <RightO style={{ fontSize: 16 }} />
    </div>
  )
}
