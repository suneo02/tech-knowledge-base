import { LeftOutlined } from '@ant-design/icons'
import { PageTitleConfig } from '../types'
import { AIIcon } from '@/assets/icon'
import styles from './styles.module.less'

interface ModalHeaderProps {
  /**
   * 当前页面配置
   */
  currentPageConfig: PageTitleConfig
}

/**
 * 模态框头部组件
 */
export const ModalHeader = ({ currentPageConfig }: ModalHeaderProps) => {
  return (
    <div className={styles.modalHeaderContainer}>
      {currentPageConfig.showBack ? (
        <LeftOutlined
          onClick={currentPageConfig.onBack}
          style={{ marginInlineEnd: 8, cursor: 'pointer', fontSize: 12 }}
        />
      ) : (
        <AIIcon />
      )}
      <h3 style={{ margin: 0 }}>{currentPageConfig.title}</h3>
    </div>
  )
}
