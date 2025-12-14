import { Menu, Badge, Tag } from '@wind/wind-ui'
import React, { useCallback, useMemo } from 'react'
import styles from './index.module.less'
import { CDEFormValues } from '../../CdeForm/types'
import { CDEMenuConfigItem } from '../../CdeForm/types'
import { isEmpty } from 'gel-util/common'

const PREFIX = 'left-menu'
export const LeftMenu: React.FC<{
  activeKey: string
  onSelect: (key: string) => void
  data: CDEMenuConfigItem[]
  formValues?: CDEFormValues
}> = ({ activeKey, onSelect, data, formValues }) => {
  const menuCounts = useMemo(() => {
    return data.reduce(
      (acc: Record<string, number>, menuItem) => {
        const childFieldNames = menuItem.children?.map((child) => String(child.itemId)) || []
        const count = childFieldNames.reduce((currentCount, fieldName) => {
          const field = formValues?.[fieldName]
          if (field && !isEmpty(field.value)) {
            return currentCount + 1
          }
          return currentCount
        }, 0)

        acc[menuItem.id] = count
        return acc
      },
      {} as Record<string, number>
    )
  }, [data, formValues])

  const handleMenuSelect = useCallback(
    ({ key }: { key: string }) => {
      onSelect(key)
    },
    [onSelect]
  )

  return (
    // @ts-expect-error wind-ui
    <Menu
      mode="vertical"
      selectedKeys={[activeKey]}
      onSelect={handleMenuSelect}
      className={styles[`${PREFIX}-container`]}
    >
      {data.map((item) => {
        const count = menuCounts[item.id] || 0
        return (
          <Menu.Item key={item.id}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {item.icon}
                <span>{item.label}</span>
                {item.isNew && (
                  <Tag color="color-4" type="primary" style={{ marginLeft: 8 }}>
                    New
                  </Tag>
                )}
                {item.isHot && <span>🔥</span>}
              </div>
              {count > 0 && <Badge count={count} overflowCount={99} />}
            </div>
          </Menu.Item>
        )
      })}
    </Menu>
  )
}
