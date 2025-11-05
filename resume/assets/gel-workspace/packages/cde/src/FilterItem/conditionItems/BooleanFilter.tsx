import { isSingleCDEFilterItemUser } from '@/types/filter.ts'
import { isSingleCDEFilterOption } from 'gel-api'
import { ErrorBoundary } from 'gel-ui'
import { BooleanOption } from '../filterOptions/BooleanOption.tsx'
import { FilterLabel } from '../filterOptions/FilterLabel.tsx'
import { getCDEFilterComp } from './index.tsx'
import styles from './style/conditionItem.module.less'
import { CDEFilterCompType } from './type.ts'

export const BooleanFilter: CDEFilterCompType = ({ item, updateFilter, filter, removeFilter, getFilterById }) => {
  const { itemName, logicOption, itemOption, hasExtra, hoverHint } = item

  if (itemOption && !isSingleCDEFilterOption(itemOption)) {
    console.error('itemOption is not single option', item)
    return null
  }

  if (filter && !isSingleCDEFilterItemUser(filter)) {
    console.error('filter is not single option', filter)
    return null
  }
  //#endregion

  const changeOptionCallback = (value: string) => {
    //#region 清除子元素有的数据
    if (value === 'false' && hasExtra && item.extraConfig) {
      // 收集需要删除的 itemId
      const itemIdsToRemove = new Set(item.extraConfig.map((extra) => extra.itemId))
      // 移除相关的过滤条件
      itemIdsToRemove.forEach((id) => removeFilter(id))
    }

    updateFilter({
      filter: item,
      value,
      logic: logicOption,
    })
  }

  return (
    <div style={{ position: 'relative' }}>
      <div className={styles.conditionItem}>
        <FilterLabel filter={Boolean(filter)} itemName={itemName} hoverHint={hoverHint} />
        <BooleanOption itemOption={itemOption} value={filter?.value} changeOptionCallback={changeOptionCallback} />
      </div>
      {item.hasExtra && filter && filter.value === 'true'
        ? item.extraConfig?.map((extra) => {
            const Component = getCDEFilterComp(extra.itemType)
            if (!Component) {
              console.error(`Component ${extra.itemType} does not exist`)
              return null
            }
            return (
              <ErrorBoundary>
                <Component
                  key={extra.itemId}
                  item={extra}
                  parent={item}
                  filter={getFilterById(extra.itemId)}
                  updateFilter={updateFilter}
                  removeFilter={removeFilter}
                  getFilterById={getFilterById}
                />
              </ErrorBoundary>
            )
          })
        : null}
    </div>
  )
}
