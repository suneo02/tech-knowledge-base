import { CDEFilterOptionFront } from '@/types/filter'
import { CDEFilterItem, CDEFilterOption } from 'gel-api'

/**
 * CheckBoxOption组件属性接口
 */
export interface CheckBoxOptionProps {
  /** 选项数据数组 */
  itemOption: CDEFilterOption[]
  /** 选项变更时的回调函数 - 受控组件使用 */
  onChange?: (value: string[]) => void
  /** 选中的值数组 - 受控组件使用 */
  value?: string[]
  /** 默认选中的值数组 - 非受控组件使用 */
  defaultValue?: string[]
  /** 过滤项信息 */
  info: CDEFilterItem
  /** 是否使用多级复选框模式 */
  multiCbx: CDEFilterItem['multiCbx']
}

/**
 * CheckBoxMulti组件的属性接口定义
 * 纯受控组件，不维护内部状态
 */
export interface CheckBoxMultiProps {
  /** 复选框选项数据 */
  optss: CDEFilterOptionFront[]
  /** 当前选中的值数组 */
  value: string[]
  /** 选项变更时的回调函数，返回所有选中值的逗号分隔字符串 */
  onChange?: (value: string) => void
  /** 自定义样式类名 */
  className?: string
}

/**
 * 二级复选框组件的属性接口定义
 */
export interface SecondLevelCheckboxProps {
  /** 父级选项数据 */
  item: CDEFilterOptionFront
  /** 当前二级选项数据 */
  subItem: CDEFilterOptionFront
  /** 已选中的值列表 */
  selectedValues: string[]
  /** 值变更时的回调函数 */
  onChange: (values: string[]) => void
}

/**
 * 普通复选框渲染选项接口
 */
export interface CheckboxRenderOptions {
  options: CDEFilterOption[]
  customValue: string
  info: CDEFilterItem
  checkboxGroupValue: string[]
  onCustomValueChange: (value: string) => void
  onDateChange: (_: any, dateString: [string, string]) => void
}

/**
 * 自定义值处理相关接口
 */
export interface CustomValueHandlerProps {
  selectedValues: string[]
  itemOption: CDEFilterOption[]
  setSelectedValues: (v: React.SetStateAction<string[]>) => void
}
