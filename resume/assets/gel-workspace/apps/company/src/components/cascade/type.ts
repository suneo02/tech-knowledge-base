import { CascaderProps } from '@wind/wind-ui/lib/cascader'
import { DataNode } from '@wind/wind-ui/lib/cascader/rc-cascader'
import React from 'react'

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
  node?: TCascadeOptionNode[] | null
}

export type TCascadeOptionItem = TCascadeOptionNodeCommon & {
  node: TCascadeOptionNode[]
}

/**
 * wind ui 类型定义有问题
 */
export type TOnCascadeMultipleChange = (value: React.Key[][], selectOptions: DataNode[][]) => void

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
   */
  onChange?: (value: OptionType[ValueField][][], selectedOptions?: any[]) => void
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
}
export type WIndCascadeOptionCommon = {
  code: string
  name: string
  nameEn?: string
  node?: WIndCascadeOptionCommon[]
}

export const WindCascadeFieldNamesCommon: NonNullable<WindCascadeProps<WIndCascadeOptionCommon, 'code'>['fieldNames']> =
  {
    label: window.en_access_config ? 'nameEn' : 'name',
    value: 'code',
    children: 'node',
  }
