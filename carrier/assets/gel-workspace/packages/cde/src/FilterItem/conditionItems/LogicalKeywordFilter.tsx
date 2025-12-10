import { isMultiCDEFilterItemUser } from '@/types/filter.ts'
import { CDELogicDefault } from '../config.tsx'
import { FilterLabel } from '../filterOptions/FilterLabel.tsx'
import { InputKeyWords, InputKeyWordsProps } from '../filterOptions/InputKeyWords.tsx'
import { LogicOption, LogicOptionProps } from '../filterOptions/LogicOption.tsx'
import conditionItemStyles from './style/conditionItem.module.less'
import styles from './style/logicalKeywordFilter.module.less'
import { CDEFilterCompType } from './type.ts'

/**
 * LogicalKeywordFilter 组件
 *
 * 该组件是一个条件过滤器组件，允许用户输入关键词并选择逻辑关系（包含任一、包含所有等）。
 * 它集成了 LogicOption（逻辑选择器）和 InputKeyWords（关键词输入组件）。
 *
 * 用于实现复杂的多关键词过滤功能，支持不同的逻辑关系筛选。
 *
 * @param {object} item - 过滤项配置，包含itemId、itemName和hoverHint等信息
 * @returns 返回组合了逻辑选择和关键词输入的过滤器组件
 */
export const LogicalKeywordFilter: CDEFilterCompType = ({ item, updateFilter, filter }) => {
  // 解构获取过滤项的基础属性
  const { itemId, itemName, hoverHint } = item

  // 验证过滤器类型，确保是多值过滤器
  if (filter && !isMultiCDEFilterItemUser(filter)) {
    console.error('filter not multi', itemId, filter)
    return null
  }

  /**
   * 处理逻辑选项变化的回调函数
   * 当用户选择不同的逻辑关系（如"包含任一"、"包含所有"）时触发
   *
   * @param {CDELogicOptionValue} logic - 新的逻辑值
   */
  const handleLogicChange: LogicOptionProps['onChange'] = (logic) => {
    // 无论是否有输入值，都直接更新 filter 中的 logic
    updateFilter({
      filter: item,
      logic,
      // 保留现有的 value（如果有）
      value: filter?.value,
    })
  }

  /**
   * 处理关键词输入变化的回调函数
   * 当用户添加、删除关键词时触发
   *
   * @param {string[]} value - 更新后的关键词数组
   */
  const handleInputChange: InputKeyWordsProps['onChange'] = (value) => {
    updateFilter({
      filter: item,
      value,
      // 使用 filter 中的 logic 或默认值
      logic: filter?.logic || CDELogicDefault,
    })
  }

  return (
    <div className={conditionItemStyles.conditionItem}>
      {/* 条件标题组件，显示过滤器名称和提示信息 */}
      <FilterLabel filter={Boolean(filter)} itemName={itemName} hoverHint={hoverHint} />

      <div className={styles['logical-keyword-wrapper']}>
        {/* 逻辑选择组件，用于选择关键词之间的逻辑关系 */}
        <LogicOption
          className={styles['logical-keyword-wrapper--option']}
          value={filter?.logic || CDELogicDefault}
          onChange={handleLogicChange}
        />
        {/* 关键词输入组件，用于输入和管理关键词 */}
        {/* 如果 filter 为空，则设置 value 为空数组表示没有关键词 */}
        <InputKeyWords value={filter?.value ?? []} onChange={handleInputChange} />
      </div>
    </div>
  )
}
