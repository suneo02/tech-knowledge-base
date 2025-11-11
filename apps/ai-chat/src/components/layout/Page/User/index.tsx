import { CoinsIcon } from '@/assets/icon'
import { fetchPoints, selectPointsCount, selectPointsInitialized, useAppDispatch, useAppSelector } from '@/store'
import { LoadingO } from '@wind/icons'
import { useEffect } from 'react'
import styles from './index.module.less'
import { postPointBuried } from '@/utils/common/bury'
import { generateUrlByModule, LinkModule } from 'gel-util/link'

const User = ({ showCoins = false, from }: { showCoins?: boolean; from?: string }) => {
  const credits = useAppSelector(selectPointsCount)
  const initialized = useAppSelector(selectPointsInitialized)
  const dispatch = useAppDispatch()
  // const navigate = useNavigateWithLangSource()

  const handleClick = () => {
    postPointBuried('922604570301', { source: from })
    const url = generateUrlByModule({ module: LinkModule.CREDIT })
    window.open(url, '_blank', 'noopener,noreferrer')
    // navigate('#/credits', { openWindow: true, windowOptions: { target: '_blank', features: 'noopener,noreferrer' } })
    // window.open('#/credits', '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    if (!initialized) {
      dispatch(fetchPoints())
    }
  }, [initialized, dispatch])

  return (
    <div className={styles['user-container']} onClick={() => handleClick()}>
      {showCoins && (
        <div className={styles['user-container-item']}>
          <CoinsIcon />
          {!initialized ? (
            <LoadingO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          ) : (
            <span>{credits?.toLocaleString() ?? 0}</span>
          )}
        </div>
      )}
    </div>
  )
}

export default User
