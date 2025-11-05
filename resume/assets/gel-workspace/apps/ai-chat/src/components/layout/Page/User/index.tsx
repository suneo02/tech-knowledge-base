import { CoinsIcon } from '@/assets/icon'
import avatar from '@/assets/image/user-avatar-default.png'
import { selectPointsCount, selectPointsLoading, useAppSelector } from '@/store'
import { LoadingO } from '@wind/icons'
import styles from './index.module.less'

const User = ({ showCoins = false }: { showCoins?: boolean }) => {
  const credits = useAppSelector(selectPointsCount)
  const loading = useAppSelector(selectPointsLoading)

  return (
    <div
      className={styles['user-container']}
      onClick={() => window.open(`#/credits?temp=${new Date().getTime()}`, 'credits-home-page')}
    >
      {showCoins && (
        <div className={styles['user-container-item']}>
          <CoinsIcon />
          {loading ? (
            <LoadingO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          ) : (
            <span>{credits ?? 0}</span>
          )}
        </div>
      )}
      {/* <img src={avatar} alt={'userName'} width={30} height={30} /> */}
    </div>
  )
}

export default User
