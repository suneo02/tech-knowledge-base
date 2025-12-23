import { Button } from 'antd'
import { BugOutlined } from '@ant-design/icons'
import { useDevContext } from '../context/DevProvider'
import styles from './DefaultPanel.module.less'

const DefaultPanel = () => {
  const { setShowDebugPanel } = useDevContext()

  return (
    <div className={styles.defaultPanel}>
      <Button
        className={styles.bugButton}
        icon={<BugOutlined />}
        onClick={() => setShowDebugPanel(true)}
        title="打开调试面板"
        type="primary"
        size="small"
      />
      <div className={styles.content}>
        <h2>Welcome to ProgressGuard Demo</h2>
        <p>这是一个演示页面，展示了表格操作的功能。</p>
        <p>如果你是开发者，请点击右上角的 🐛 按钮打开调试面板。</p>
      </div>
    </div>
  )
}

export default DefaultPanel
