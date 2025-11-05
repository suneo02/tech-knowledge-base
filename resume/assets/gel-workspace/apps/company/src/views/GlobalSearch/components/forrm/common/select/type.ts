import { OptionProps, SelectProps, SelectValue } from '@wind/wind-ui/lib/select'

export type SelectOptionProps = (OptionProps | SelectValue) & {
  filterLabel?: string // 在筛选项展示的参数 取名filterLabel会报错,
  labelCloned?: string // 如果用了labelOptions 必须使用此参数，不然回显会出问题
  labelId?: string // 多语言词条使用
} & Record<string, unknown>

// 定义自定义多选组件的属性类型，排除掉不需要的属性
export type WSelectProps = Omit<SelectProps, 'mode' | 'value'> & {
  options: SelectOptionProps[]
  label: string
  suffix?: string
  value?: SelectOptionProps
  showVipIcon?: 'vip' | 'svip'
  showCustom?: boolean
  borderless?: boolean // 是否删除border
}

// TODO 需要移动通用theme.ts文件夹内
export const PRIMARY_COLOR_1 = '#0596b3'
export const BASIC_COLOR_7 = '#707680'
