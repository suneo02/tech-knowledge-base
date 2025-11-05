import classNames from 'classnames'
import styles from './style/header.module.less'
import User from '@/components/layout/Page/User'

interface HeaderProps {
  className?: string
}
export const HomeHeader: React.FC<HeaderProps> = ({ className }) => {
  return (
    <div className={classNames(styles['header-container'], className)}>
      <span className={styles['header-title']}></span>
      <User showCoins={true} />
    </div>
  )
}
