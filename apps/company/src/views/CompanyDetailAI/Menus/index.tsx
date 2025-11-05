import React, { FC } from 'react'
import styles from './Menus.module.less'

/**
 * 菜单组件的属性接口
 */
interface MenusProps {
  /** 树形菜单数据 */
  treeDatas: any[]
  /** 当前选中的节点key数组 */
  selectedKeys: string[]
  /** 节点选中时的回调函数 */
  onSelect: (menuData: any, e: any) => void
  setSelectedKeys: (selectedKeys: string[]) => void
}

// 定义事件类型接口
interface MenuClickEventData {
  key: string
  event: React.MouseEvent<HTMLDivElement>
}

// 定义事件总线
export const MenuEventBus = {
  listeners: {} as Record<string, Array<(data: any) => void>>,

  // 订阅事件
  on(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  },

  // 发布事件
  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data))
    }
  },

  // 取消订阅
  off(event: string, callback: (data: any) => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
    }
  },
}

/**
 * 企业详情菜单组件
 *
 * @component
 */
const Menus: FC<MenusProps> = ({ treeDatas, selectedKeys, setSelectedKeys }) => {
  /**
   * 处理菜单点击事件
   * @param key - 菜单项的key
   * @param e - 事件对象
   */
  const handleMenuClick = (key: string, e: React.MouseEvent<HTMLDivElement>) => {
    setSelectedKeys([key])
    // 发布菜单点击事件
    MenuEventBus.emit('menuClick', { key, event: e } as MenuClickEventData)
  }

  return (
    <div className={styles.menuContainer}>
      {treeDatas.map((menu) => (
        <div key={menu.key} className={styles.menuGroup}>
          <div className={styles.menuTitle}>{menu.title}</div>
          <div className={styles.subMenuContainer}>
            {menu.children &&
              menu.children.length > 0 &&
              menu.children.map((subMenu) => (
                <div
                  key={subMenu.key}
                  className={`${styles.subMenuItem} ${selectedKeys.includes(subMenu.key) ? styles.active : ''}`}
                  onClick={(e) => handleMenuClick(subMenu.key, e)}
                >
                  {subMenu.titleStr || subMenu.title}
                  {subMenu.titleNum && <span className={styles.menuNum}>{subMenu.titleNum}</span>}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Menus
