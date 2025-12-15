import { Button } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useDevContext } from '../context/DevProvider'
import DefaultPanel from './DefaultPanel'
import DebugPanel from './DebugPanel'
import styles from './DebugContainer.module.less'

const DebugContainer = () => {
  const { isDevMode, showDebugPanel, setShowDebugPanel } = useDevContext()

  // 如果不是开发模式，显示默认面板
  if (!isDevMode) {
    return <DefaultPanel />
  }

  // 如果是开发模式但没有显示调试面板，显示默认面板
  if (!showDebugPanel) {
    return <DefaultPanel />
  }

  // 显示调试面板
  return (
    <div className={styles.debugContainer}>
      <div className={styles.header}>
        <h3>🛠️ 开发者调试面板</h3>
        <Button
          className={styles.closeButton}
          icon={<CloseOutlined />}
          onClick={() => setShowDebugPanel(false)}
          title="关闭调试面板"
          type="text"
          size="small"
        />
      </div>
      <div className={styles.content}>
        <DebugPanel />
      </div>
    </div>
  )
}

export default DebugContainer
