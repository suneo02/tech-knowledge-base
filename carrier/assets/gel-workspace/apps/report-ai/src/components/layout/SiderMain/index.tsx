import { FileTextO, HomeO } from '@wind/icons';
import { Menu } from '@wind/wind-ui';
import classNames from 'classnames';
import { LogoSection } from 'gel-ui';
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChatConversationReport } from '../../ChatCommon/Conversation';
import styles from './index.module.less';
import { t } from 'gel-util/intl';
import { MAIN_MENU_ITEMS } from '../../../constants/menu';

interface MenuItemType {
  key: string;
  Icon: React.FC<{ className: string }>;
  label: string;
  path: string;
}

interface LeftMenuProps {
  collapsed?: boolean;
}

/**
 * 左侧菜单组件，可控制展开/折叠状态
 */
export const SiderMain: React.FC<LeftMenuProps> = ({ collapsed = true }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // 图标映射
  const iconMap = useMemo(
    () => ({
      file: ({ className }: { className: string }) => (
        <FileTextO className={className} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
      ),
      home: ({ className }: { className: string }) => (
        <HomeO className={className} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
      ),
      company: ({ className }: { className: string }) => (
        <HomeO className={className} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
      ),
    }),
    []
  );

  // 菜单项配置 - 使用集中化的路由配置
  const menuItems: MenuItemType[] = useMemo(
    () => MAIN_MENU_ITEMS.map(item => ({
      key: item.key,
      Icon: iconMap[item.key as keyof typeof iconMap] || iconMap.file,
      label: item.label,
      path: item.path,
    })),
    [iconMap]
  );

  // 根据当前路径确定选中的菜单项
  const selectedKeys = useMemo(() => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find((item) => item.path === currentPath);
    return activeItem ? [activeItem.key] : [];
  }, [location.pathname, menuItems]);

  // 处理菜单点击事件
  const handleMenuClick = (key: string) => {
    const menuItem = menuItems.find((item) => item.key === key);
    if (menuItem) {
      navigate(menuItem.path);
    }
  };

  return (
    <div className={classNames(styles['sider'], collapsed ? styles.collapsed : styles.expanded)}>
      <LogoSection collapsed={collapsed} logoText={t('', '全球企业报告平台')} />

      {/* @ts-expect-error wind-ui 类型问题 */}
      <Menu
        mode={collapsed ? 'vertical' : 'inline'}
        selectedKeys={selectedKeys}
        className={classNames(styles['left-menu'], collapsed ? styles.collapsed : styles.expanded)}
        inlineCollapsed={collapsed}
        onClick={({ key }) => handleMenuClick(key)}
      >
        {menuItems.map((item) => (
          <Menu.Item key={item.key} title={item.label}>
            {collapsed ? (
              <item.Icon className={classNames(styles.menuIcon, collapsed ? styles.collapsed : styles.expanded)} />
            ) : (
              <div className={styles.menuItem}>
                <item.Icon className={styles.menuIcon} />
                <span className={styles.menuLabel}>{item.label}</span>
              </div>
            )}
          </Menu.Item>
        ))}
      </Menu>

      {/* conversations list */}
      <div className={styles.conversation}>
        <ChatConversationReport collapse={collapsed} />
      </div>
    </div>
  );
};
