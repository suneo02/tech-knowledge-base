// @ts-nocheck
import { Layout, Menu, ThemeProvider } from "@wind/wind-ui";
import React from "react";
import styles from "./CompanySider.module.less";
import { AliceIcon } from "./index";
const { Sider } = Layout;

/**
 * CompanySider component - A vertical sidebar for company detail navigation
 * @returns {JSX.Element} A vertical sidebar with navigation menu and user avatar
 */
const CompanySider: React.FC = ({ selectedKeys, setSelectedKeys, items }) => {
  return (
    <ThemeProvider pattern="gray">
      <Sider width={72}>
        <Menu
          mode="vertical"
          style={{ flex: 1 }}
          selectedKeys={selectedKeys}
          onSelect={({ key }) => setSelectedKeys([key])}
          className={styles.companySider}
        >
          {items.map((item) => (
            <Menu.Item key={item.key} className={styles.companySider__menuItem}>
              {item.icon}
              <div className={styles.companySider__menuItemLabel}>
                {item.label}
              </div>
            </Menu.Item>
          ))}
        </Menu>
        <div className={styles.companySider__userSection}>
          <AliceIcon />
        </div>
      </Sider>
    </ThemeProvider>
  );
};

export default CompanySider;
