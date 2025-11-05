import { componentMap } from '../registry'

/**
 * 根据 `registry.ts` 中导出的 `componentMap` 自动推断出所有已注册的组件类型。
 * 这是实现类型安全的单一数据源。
 */
export type RegisteredComponentType = keyof typeof componentMap

/**
 * 原始值类型
 */
export type PrimitiveValue = string[] | number[] | string | number

/**
 * 表单项的内部值结构
 * antd Form.Item 的 value 将是这个结构
 */
export interface FilterValue {
  /** 用于提交的原始值 */
  value: PrimitiveValue
}

/**
 * 组合组件中单个子组件的配置
 */
export interface CompositionItem {
  /**
   * 在表单值对象中的 key
   * e.g., for { logic: 'any', keywords: [] }, componentKey would be 'logic' or 'keywords'
   */
  componentKey: string
  /**
   * 子组件类型，对应 componentMap 中的组件
   */
  itemType: keyof typeof componentMap
  /**
   * 布局占比, e.g., flex-grow value or Ant Design grid span
   */
  span?: number
  /**
   * 宽度，优先级比span高
   */
  width?: number | string
  /**
   * 传递给该基础组件的其他所有 props
   */
  [key: string]: unknown
}

/**
 * 自定义筛选组件需要遵循的 props 接口
 * antd Form.Item 会隐式地将 value 和 onChange 传递给组件
 */
export interface CustomComponentProps {
  value?: FilterValue
  onChange?: (value: FilterValue | undefined) => void
  /**
   * 透传来自 FilterConfigItem 的配置
   */
  options?: FilterOption[]
  placeholder?: string
  /** 额外的配置后面的单位 */
  suffix?: string
  /** @deprecated 是否有额外的选项，用于兼容旧的配置 */
  hasExtra?: boolean
  /** @deprecated 额外的配置，用于兼容旧的配置 */
  extraConfig?: FilterConfigItem[]
  /** @deprecated 额外的配置后面的单位，用于兼容旧的配置, 后续使用 suffix 代替 */
  itemRemark?: string
  /** @deprecated 额外的配置后面的单位，用于兼容旧的配置 */
  [key: string]: unknown
}

export interface FilterOption {
  label: string
  value: string | number
  children?: FilterOption[]
}

export interface ItemOptionItem {
  name: string
  value?: string[] | string
  certYear?: number
  id?: string
  validDate?: number
  itemOption?: {
    name: string
    value: string | string[]
    label?: string
    itemOption?: {
      name: string
      value: string
      label?: string
    }[]
  }[]
  values?: string[]
  hoverHint?: string
}

/**
 * 单个筛选器的配置项
 */
export interface FilterConfigItem {
  /** 唯一标识，将作为 antd Form.Item 的 name */
  itemId: string | number
  /** 筛选器名称，将作为 antd Form.Item 的 label */
  itemName: string
  /** 筛选器组件类型，用于在组件注册表中查找对应组件 */
  itemType: string

  itemField?: string
  /**
   * 当 itemType 为 'composite' 或在 compositionMap 中有映射时，
   * 使用此配置来动态构建组合 UI
   */
  composition?: CompositionItem[]
  new?: boolean
  tooltip?: string
  options?: FilterOption[]
  initialValue?: PrimitiveValue
  placeholder?: string
  [key: string]: unknown

  /** @deprecated 是否有额外的选项，用于兼容旧的配置 */
  hasExtra?: boolean
  /** @deprecated 额外的配置，用于兼容旧的配置 */
  extraConfig?: FilterConfigItem[]
  /** @deprecated 额外的配置后面的单位，用于兼容旧的配置 */
  itemRemark?: string
  /** @deprecated 是否是多选框组 */
  itemOption?: ItemOptionItem[]
}
