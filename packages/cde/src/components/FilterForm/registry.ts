// 导入所有需要注册的组件
import Cascader from './FilterItem/basic/Cascader'
import CheckboxGroup from './FilterItem/basic/CheckboxGroup'
import NumberRange from './FilterItem/basic/NumberRange'
import RadioGroup from './FilterItem/basic/RadioGroup'
import Search from './FilterItem/basic/Search'
import Select from './FilterItem/basic/Select'
import TagsInput from './FilterItem/basic/TagsInput'
import TreeCheckbox from './FilterItem/basic/TreeCheckbox'
import CheckboxGroupWithNumberRange from './FilterItem/custom/CheckboxGroupWithNumberRange'
import LogicWithSearchableTags from './FilterItem/custom/LogicWithSearchableTags'
import RadioWithDateRange from './FilterItem/custom/RadioWithDateRange'

/**
 * 组件注册的单一数据源。
 * 所有筛选器组件都在此声明式地映射。
 * 使用 `as const` 来确保键是字面量类型，便于 TypeScript 进行类型推断。
 */
export const componentMap = {
  select: Select,
  tagsInput: TagsInput,
  cascader: Cascader,
  radioGroup: RadioGroup,
  checkboxGroup: CheckboxGroup,
  search: Search,
  numberRange: NumberRange,
  radioWithDateRange: RadioWithDateRange,
  checkboxGroupWithNumberRange: CheckboxGroupWithNumberRange,
  treeCheckbox: TreeCheckbox,
  logicWithSearchableTags: LogicWithSearchableTags,
} as const
