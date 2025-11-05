import { useCDEFilterCfgCtx } from '@/ctx/index.tsx'
import { countMatchingFiltersInCategory } from '@/handle'
import { CDEFilterItemUser } from '@/types/filter.ts'
import { Badge, Menu } from '@wind/wind-ui'
import { MenuProps } from '@wind/wind-ui/lib/menu'
import classNames from 'classnames'
import { FC, useMemo } from 'react'
import styles from './style/filterMenu.module.less'

interface FilterMenuProps extends Omit<MenuProps, 'onSelect'> {
  current?: number
  onSelect: (index: number) => void
  filters: CDEFilterItemUser[] | undefined
}

export const CDEFilterMenu: FC<FilterMenuProps> = ({ current, onSelect, filters, className, ...rest }) => {
  const { filterCfg } = useCDEFilterCfgCtx()

  const menuItems = useMemo(
    () =>
      filterCfg.map((item, index) => {
        const validFilterCount = countMatchingFiltersInCategory(item, filters)
        return {
          key: index.toString(),
          label:
            validFilterCount > 0 ? (
              <div className={classNames(styles.hasValue)}>
                {item.category}
                <Badge count={validFilterCount} style={{ marginLeft: 8 }} />
              </div>
            ) : (
              item.category
            ),
        }
      }),
    [filterCfg, filters]
  )

  return (
    // @ts-expect-error wind ui
    <Menu
      className={classNames(styles.menu, className)}
      selectedKeys={[current?.toString() || '']}
      mode="vertical"
      {...rest}
    >
      {menuItems.map((item) => (
        <Menu.Item
          key={item.key}
          onClick={() => {
            const index = parseInt(item.key)
            onSelect(index)
          }}
        >
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  )
}
