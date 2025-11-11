import { Layout } from '@wind/wind-ui';
import { Outlet } from 'react-router-dom';
import { SiderMain } from '../../components';
import { selectSidebarCollapsed, useAppSelector } from '../../store';
import styles from './mainLayout.module.less';

const { Content, Sider } = Layout;

/**
 * 主布局组件
 *
 * @description 提供应用的主要布局结构，包含侧边栏和内容区域
 * 侧边栏状态由各个页面组件通过 usePageSidebar Hook 控制
 * @since 1.0.0
 */
export const MainLayout: React.FC = () => {
  const collapsed = useAppSelector(selectSidebarCollapsed);

  return (
    // @ts-expect-error windui
    <Layout className={styles.mainLayout}>
      {/* @ts-expect-error windui */}
      <Sider className={styles.sider} width={'auto'} trigger={null}>
        <SiderMain collapsed={collapsed} />
      </Sider>
      {/* @ts-expect-error windui */}
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  );
};
