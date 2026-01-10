import { MenuItemProps } from '@/components/layout/SideMenuLayout/types'
import intl from '@/utils/intl'
import { AISubtitleO, CloseO } from '@wind/icons'
import { Divider, Layout, Modal, Tooltip, Tree } from '@wind/wind-ui'
import { Empty } from 'antd'
import classNames from 'classnames'
import React, { useCallback } from 'react'
import './index.less'

const PREFIX = 'menu-content'

interface MenuComponentProps {
  menu: any[]
  menuTitle?: React.ReactNode
  menuFooter?: React.ReactNode
  menuStyle?: React.CSSProperties
  showDivider?: boolean
  defaultExpandAll?: boolean
  defaultExpandedKeys?: string[]
  defaultSelectedKeys?: string[]
  multiple?: boolean
  menuItemRender?: (item: MenuItemProps) => React.ReactNode
  onMenuSelect?: (item: MenuItemProps, selected: boolean) => void
  onMenuExpand?: (expandedKeys: string[]) => void
  deleteItem?: (id: React.Key, activeKey: React.Key) => void
}

const MenuComponent: React.FC<MenuComponentProps> = ({
  menu,
  menuTitle,
  menuFooter,
  menuStyle,
  showDivider = true,
  defaultExpandAll = true,
  defaultExpandedKeys,
  defaultSelectedKeys,
  multiple = false,
  menuItemRender,
  onMenuSelect,
  onMenuExpand,
  deleteItem,
}) => {
  // 渲染菜单项
  const renderMenuItem = useCallback(
    (item: MenuItemProps) => {
      if (menuItemRender) {
        return menuItemRender(item)
      }

      return (
        <Tree.TreeNode
          {...item}
          className={classNames(`${PREFIX}-menu-item`, {
            [`${PREFIX}-menu-item-disabled`]: item.disabled,
          })}
          title={() => {
            return (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ cursor: 'pointer' }}>
                  {item.title}

                  {item.ai && (
                    <Tooltip title={intl('419883', '该报告由Alice Writer生成')} placement="top">
                      {/* @ts-expect-error icon */}
                      <AISubtitleO
                        style={{ marginInlineStart: 4, color: '#e22c2f', fontWeight: 500 }}
                        data-uc-id="m4BoLiBxHz"
                        data-uc-ct="aisubtitleo"
                      />
                    </Tooltip>
                  )}
                </div>
                {item.enableDelete && deleteItem ? (
                  /* @ts-expect-error icon */
                  <CloseO
                    style={{ paddingInlineEnd: 8 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      Modal.confirm({
                        title: intl('19853', '删除'),
                        content: intl('261956', '删除后无法找回，你确定要删除吗？'),
                        onOk: () => {
                          console.log(item)
                          deleteItem(item.key, item.type)
                        },
                      })
                    }}
                    data-uc-id="MQCxOWQIGL"
                    data-uc-ct="closeo"
                  />
                ) : null}
              </div>
            )
          }}
          data-uc-id="wHxjbjmLn"
          data-uc-ct="tree"
        />
      )
    },
    [menuItemRender]
  )

  return (
    <div className={`${PREFIX}-menu-container`} style={menuStyle}>
      {menu?.length > 0 ? (
        menu?.map((menuGroup, index) => (
          <div
            key={menuGroup.key || index}
            style={
              menuGroup.height ? { height: menuGroup.height, overflow: 'hidden' } : { flex: 1, overflow: 'hidden' }
            }
          >
            {showDivider && index > 0 && <Divider className={`${PREFIX}-menu-divider`} />}
            {menuGroup.title && (
              <>
                {/* @ts-expect-error ttt */}
                <Layout.Header className={`${PREFIX}-menu-header f-bg-none`}>{menuGroup.title}</Layout.Header>
                <Divider className={classNames(`${PREFIX}-menu-divider`, `${PREFIX}-menu-divider-space`)} />
              </>
            )}
            <div
              className={`${PREFIX}-tree-container`}
              style={{ overflow: 'scroll', height: `calc(100% - ${menuGroup.title ? 40 : 0}px)` }}
            >
              <Tree
                defaultExpandAll={defaultExpandAll}
                defaultExpandedKeys={defaultExpandedKeys}
                defaultSelectedKeys={defaultSelectedKeys}
                multiple={multiple}
                onSelect={(_, { node, selected }) => {
                  // console.log(_, node, selected)
                  onMenuSelect?.(node as MenuItemProps, selected)
                }}
                onExpand={(expandedKeys) => onMenuExpand?.(expandedKeys as string[])}
                data-uc-id="8fs4A5vzes"
                data-uc-ct="tree"
              >
                {menuGroup.children?.map((item) => renderMenuItem(item))}
              </Tree>
            </div>
          </div>
        ))
      ) : (
        <Empty description="无数据" data-uc-id="wPCMOugOrz" data-uc-ct="empty" />
      )}
      {menuFooter}
    </div>
  )
}

export default MenuComponent
