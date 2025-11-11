import { CascaderProps } from '@wind/wind-ui/lib/cascader'
import { DataNode } from '@wind/wind-ui/lib/cascader/rc-cascader'

interface TCascadeOptionNodeCommon {
  code: string
  level?: number
  name:
    | string
    | {
        type: string
      }
  nameEn?: string
  disabled?: boolean
  oldCode?: string
}
export type TCascadeOptionNode = TCascadeOptionNodeCommon & {
  node?: TCascadeOptionNode[]
}

export type CascaderValue = TCascadeOptionNode['code']

/**
 * 级联选择器 props
 *
 * @param OptionType 选项类型
 * @param ValueField 值类型 的 key
 */
export interface WindCascadeProps<OptionType extends Record<string, any>, ValueField extends keyof OptionType>
  extends Omit<CascaderProps<OptionType>, 'onChange' | 'value' | 'fieldNames' | 'dropdownMatchSelectWidth'> {
  /**
   * 值变化
   * value: 选中的值 的 path，一维数组中的最后一个节点是叶子节点，实际选中值
   * selectedOptions: 选中的选项 的 path，一维数组中的最后一个节点是叶子节点，实际选中值
   */
  onChange?: (value: OptionType[ValueField][][], selectedOptions?: OptionType[][]) => void
  fieldNames?: {
    label: keyof OptionType
    value: ValueField
    children: keyof OptionType
  }
  /**
   * 值
   */
  value?: OptionType[ValueField][][]
  /**
   * 是否默认展开
   */
  defaultOpen?: boolean
  /**
   * 控制下拉菜单是否展开
   */
  open?: boolean
  /**
   * 下拉菜单展开状态变化回调
   */
  onOpenChange?: (open: boolean) => void
  /**
   * 是否根据选择器宽度自动调整下拉菜单宽度
   */
  dropdownMatchSelectWidth?: boolean
  /**
   * 选项数据源, 用于动态加载数据，做性能优化
   */
  optionsKey?: string
}

export type WIndCascadeOptionCommon = {
  code: string
  name: string
  nameEn?: string
  node?: WIndCascadeOptionCommon[]
}

/**
 * wind ui 类型定义有问题
 */
export type TOnCascadeMultipleChange = (value: React.Key[][], selectOptions: DataNode[][]) => void
