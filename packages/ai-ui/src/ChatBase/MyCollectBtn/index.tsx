import { initRandomRoomId, useChatRoomContext, useFavorites, useHistory } from '@/context'
import { AchievementO, RightO } from '@wind/icons'
import { ButtonProps } from '@wind/wind-ui/lib/button/button'
import { AxiosInstance } from 'axios'
import classNames from 'classnames'
import { postPointBuriedWithAxios } from 'gel-api'
import { t } from 'gel-util/intl'
import { FC } from 'react'
import styles from './index.module.less'
import { message } from '@wind/wind-ui'

export const MyCollectBtn: FC<
  ButtonProps & {
    axiosInstanceEntWeb: AxiosInstance
    loading?: boolean
  }
> = ({ axiosInstanceEntWeb, loading }) => {
  const { showFavorites, setShowFavorites } = useFavorites()
  const { updateRoomId } = useChatRoomContext()
  const { setShowHistory } = useHistory()

  return (
    <div
      className={classNames(styles.myCollectBtn, { [styles['myCollectBtn--active']]: showFavorites })}
      onClick={() => {
        if (loading) return message.error(t('421523', '请等待当前对话结束'))
        postPointBuriedWithAxios(axiosInstanceEntWeb, '922610370022')
        updateRoomId(initRandomRoomId())
        setShowFavorites(!showFavorites)
        setShowHistory(false)
      }}
    >
      {/* @ts-expect-error windui */}
      <AchievementO style={{ fontSize: 16 }} />
      <span className={styles.text}>{t('248022', '我的收藏')}</span>
      {/* @ts-expect-error windui */}
      <RightO style={{ fontSize: 16 }} />
    </div>
  )
}
