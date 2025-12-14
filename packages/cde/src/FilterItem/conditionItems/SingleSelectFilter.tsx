/**
 * SingleSelectFilter 组件
 * 用于处理自定义单选条件项的组件
 * 支持单个值的选择和更新，并与过滤器上下文进行交互
 */
import { isSingleCDEFilterItemUser } from '@/types/filter.ts'
import { FilterLabel } from '../filterOptions/FilterLabel.tsx'
import { SingleOption } from '../filterOptions/SingleOption.tsx'
import styles from './style/conditionItem.module.less'
import { CDEFilterCompType } from './type.ts'
import { Button } from '@wind/wind-ui'
import { ReductionO } from '@wind/icons'

export const SingleSelectFilter: CDEFilterCompType = ({ item, updateFilter, filter }) => {
  // 从传入的 item 中解构所需属性
  const { itemId, itemName, logicOption, itemOption, hoverHint } = item

  // 验证过滤器类型，确保是单值类型
  if (filter && !isSingleCDEFilterItemUser(filter)) {
    console.error('filter not multi', itemId, filter)
    return null
  }

  /**
   * 处理选项变更的回调函数
   * @param {string} value - 新选择的值
   */
  const changeOptionCallback = (value: string) => {
    updateFilter({
      filter: item,
      value,
      logic: logicOption,
    })
  }

  /**
   * 重置选择的回调函数
   */
  const handleReset = () => {
    changeOptionCallback('')
  }

  return (
    <div className={styles.conditionItem}>
      {/* 渲染条件标题和重置按钮，放在同一行 */}
      <div className={styles.titleContainer}>
        <FilterLabel filter={Boolean(filter)} itemName={itemName} hoverHint={hoverHint} />
        {filter?.value && (
          <Button
            className={styles.resetButton}
            size="small"
            onClick={handleReset}
            // @ts-expect-error wind-ui 的 icon 类型定义
            icon={<ReductionO style={{ color: '#666' }} />}
          >
            重置
          </Button>
        )}
      </div>
      {/* 渲染单选选项组件，传入必要的属性和回调函数 */}
      <SingleOption
        itemOption={itemOption}
        info={item}
        value={filter?.value}
        changeOptionCallback={changeOptionCallback}
      />
    </div>
  )
}
