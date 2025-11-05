import { initRandomRoomId, useChatRoomContext, useFavorites } from '@/context'
import { AchievementO, RightO } from '@wind/icons'
import { ButtonProps } from '@wind/wind-ui/lib/button/button'
import { AxiosInstance } from 'axios'
import classNames from 'classnames'
import { postPointBuriedWithAxios } from 'gel-api'
import { t } from 'gel-util/intl'
import { FC } from 'react'
import styles from './index.module.less'

export const MyCollectBtn: FC<
  ButtonProps & {
    axiosInstanceEntWeb: AxiosInstance
  }
> = ({ axiosInstanceEntWeb }) => {
  const { showFavorites, setShowFavorites } = useFavorites()
  const { updateRoomId } = useChatRoomContext()
  return (
    <div
      className={classNames(styles.myCollectBtn, { [styles['myCollectBtn--active']]: showFavorites })}
      onClick={() => {
        postPointBuriedWithAxios(axiosInstanceEntWeb, '922610370022')
        updateRoomId(initRandomRoomId())
        setShowFavorites(!showFavorites)
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
