import User from '@/components/layout/Page/User'
import classNames from 'classnames'
import styles from './index.module.less'

interface HeaderProps {
  className?: string
}

export const HomeHeader: React.FC<HeaderProps> = (props) => {
  const { className } = props || {}
  // const [modal, holder] = CModal.useModal(CMODALS.ADVICE)
  return (
    <div className={classNames(styles.container, className)}>
      {/* <div className={styles.backBtn} onClick={() => console.log(1)}>
        返回旧版(企业高级筛选)
      </div> */}
      {/* <Tooltip title="建议">
        <Button
          type="text"
          onClick={() => modal.open({ title: '建议' })}
          // @ts-expect-error wind-ui 类型错误
          icon={<NoteO />}
        ></Button>
      </Tooltip>
      <Divider type="vertical" /> */}
      <User showCoins={true} from="super-home" />
      {/* {holder} */}
    </div>
  )
}
