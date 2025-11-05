import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import styles from './mainLayout.module.less'
const { Content } = Layout

export const MainLayout = () => (
  <Layout className={styles.mainLayout}>
    <Content className={styles.content}>
      <Outlet />
    </Content>
  </Layout>
)

export default MainLayout
