// @ts-nocheck
import { Layout, ThemeProvider } from '@wind/wind-ui'
import React, { CSSProperties, useMemo } from 'react'
import classNames from 'classnames'
import { MenuItemProps, SideMenuLayoutProps } from '@/components/layout/SideMenuLayout/types'
import { wftCommon } from '@/utils/utils'
import { MenuContext } from '@/components/layout/SideMenuLayout/context'
import '@/components/layout/SideMenuLayout/index.less'
import IframeComponent from '@/components/IframeComponent'
import MenuComponent from '@/components/MenuComponent'
import { useMenu } from './hooks/useMenu'
import { Tabs } from 'antd'

const { Header, Content, Sider } = Layout
const PREFIX = 'side-menu-layout'
const DEFAULT_HEIGHT_STYLE: CSSProperties = wftCommon.isNoToolbar()
  ? { height: '100vh' }
  : { height: 'calc(100vh - 36px)' }

const SideMenuLayout: React.FC<SideMenuLayoutProps> = ({
  // children,
  className,
  collapsedContent,
  collapsible = true,
  contentStyle,
  defaultExpandAll = true,
  defaultExpandedKeys,
  defaultActiveKey,
  globalParams,
  menu: _menu,
  menuStyle,
  menuTitle,
  multiple = false,
  showDivider = true,
  sideWidth = 336,
  style,
  module,
  // templateMenu,
  // contentRender,
  menuItemRender,
  onMenuExpand,
  onMenuSelect,
}) => {
  // 查找第一个有效的菜单项
  const findFirstValidMenuItem = (items: MenuItemProps[]): MenuItemProps | null => {
    for (const item of items) {
      if (item.content || item.iframeUrl) {
        return item
      }
      if (item.children) {
        const found = findFirstValidMenuItem(item.children)
        if (found) return found
      }
    }
    return null
  }

  // 使用统一的菜单 hook
  const {
    menuCache,
    updateMenuCache,
    activeItem,
    contextParams,
    menu,
    handleMenuSelect,
    handleMessageChange,
    updateGlobalParams,
    handleDeleteTemplateData,
  } = useMenu({
    initialMenu: _menu,
    globalParams,
    onMenuSelect,
    defaultActiveKey: defaultActiveKey || findFirstValidMenuItem(_menu)?.key,
  })

  // Tab 内容渲染
  const renderTabContent = useMemo(
    () => {
      const tabContentRenderer: React.FC<MenuItemProps> = (props) => {
        if (props.render) {
          return props.render(props)
        }
        if (props?.iframeUrl) {
          return (
            <IframeComponent
              module={module}
              baseUrl={props.iframeUrl}
              className={`${PREFIX}-content-iframe`}
              style={DEFAULT_HEIGHT_STYLE}
              id={props.key}
              messageOnChange={handleMessageChange}
            />
          )
        }
        return props?.content || null
      }

      // 设置 display name
      tabContentRenderer.displayName = 'TabContentRenderer'

      return tabContentRenderer
    },
    // 设置 display name

    [handleMessageChange]
  )

  // Tab 列表处理
  const tabItems = useMemo(() => {
    return menu
      .flatMap((res) => res.children || [])
      .filter((res) => res.iframeUrl || res.content)
      .map((res) => ({
        ...res,
        children: renderTabContent(res),
      }))
  }, [menu, renderTabContent])

  return (
    <MenuContext.Provider
      value={{
        activeItem,
        globalParams: contextParams,
        menuCache: menuCache.current,
        updateGlobalParams,
        updateMenuCache,
      }}
    >
      <div className={classNames(PREFIX, className)} style={style}>
        <Layout className={`${PREFIX}-container`}>
          <Layout style={DEFAULT_HEIGHT_STYLE}>
            <ThemeProvider pattern="gray">
              <Sider
                width={sideWidth}
                collapsible={collapsible}
                collapsedContent={
                  collapsedContent || (
                    <>
                      {menu?.map((item, index) => (
                        <Header key={index} className="f-wm-vr f-bg-none">
                          {item.title}
                        </Header>
                      ))}
                    </>
                  )
                }
              >
                {activeItem?.key ? (
                  <MenuComponent
                    menu={menu}
                    menuStyle={menuStyle}
                    menuTitle={menuTitle}
                    showDivider={showDivider}
                    defaultExpandAll={defaultExpandAll}
                    defaultExpandedKeys={defaultExpandedKeys}
                    defaultSelectedKeys={[activeItem.key]}
                    multiple={multiple}
                    menuItemRender={menuItemRender}
                    onMenuSelect={handleMenuSelect}
                    onMenuExpand={onMenuExpand}
                    deleteItem={handleDeleteTemplateData}
                    data-uc-id="FPgoiuhpUG"
                    data-uc-ct="menucomponent"
                  />
                ) : null}
              </Sider>
            </ThemeProvider>
            <Layout>
              <Content
                className={classNames(`${PREFIX}-content`, {
                  [`${PREFIX}-content-no-scroll`]: activeItem.iframeUrl,
                })}
                style={contentStyle}
              >
                <Tabs activeKey={activeItem.key} type="card" size="small" style={{ height: '100%' }} items={tabItems} />
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    </MenuContext.Provider>
  )
}

export default React.memo(SideMenuLayout)
