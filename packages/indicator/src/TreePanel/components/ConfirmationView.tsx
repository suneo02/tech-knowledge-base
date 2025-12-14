import { Button } from '@wind/wind-ui'
import { CoinsO } from '@/assets'
import styles from './confirmationView.module.less'
import classNames from 'classnames'
import { LoadingO } from '@wind/icons'

interface ConfirmationViewProps {
  totalPoints: number | null
  loading: boolean
  onGoBack: () => void
  onFinalConfirm: () => void
  confirmLoading?: boolean
  isExiting: boolean
}

export const ConfirmationView = ({
  totalPoints,
  loading,
  onGoBack,
  onFinalConfirm,
  confirmLoading,
  isExiting,
}: ConfirmationViewProps) => {
  return (
    <div
      className={classNames(styles.confirmationView, {
        [styles.fadeOut]: isExiting,
      })}
    >
      <div className={styles.confirmationInfo}>
        <div className={styles.infoText}>
          <p className={styles.infoTitle}>确认指标选择</p>
          <p className={styles.infoDesc}>
            将消耗
            {loading ? (
              // @ts-expect-error wind-icon
              <LoadingO />
            ) : (
              <>
                <CoinsO style={{ margin: '0 4px' }} />
                <span className={styles.points}>{totalPoints?.toLocaleString()}</span>
              </>
            )}
          </p>
        </div>
      </div>
      <div className={styles.confirmationActions}>
        <Button onClick={onGoBack} style={{ marginRight: '8px' }}>
          返回修改
        </Button>
        <Button type="primary" loading={confirmLoading} onClick={onFinalConfirm} disabled={loading}>
          确认提取
        </Button>
      </div>
    </div>
  )
}
