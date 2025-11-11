export { WindCascadeFieldNamesCommon } from './config'
export { useCascadeOpenState } from './hooks'
export {
  type CascaderValue,
  type TCascadeOptionNode,
  type TOnCascadeMultipleChange,
  type WIndCascadeOptionCommon,
  type WindCascadeProps,
} from './type'
export {
  checkIfCDESearchFilter,
  convertCascadeOptions,
  convertRimeTrackValue,
  filterCascadeOptionByLevel,
  findCascadeOptionByValue,
  flattenWindCascadeValue,
  getCdeSearchFilterDisplayValues,
  isCDEValueObject,
  parseFlattenedWindCascadeValue,
  truncateNestedOptionsMutating,
} from './utils'

import { Cascader } from '@wind/wind-ui'
import { useControllableValue } from 'ahooks'
import classNames from 'classnames'
import { isEn } from 'gel-util/intl'
import { useEffect, useRef, useState } from 'react'
import { useCascadeOpenState } from './hooks'
import styles from './style/cascade.module.less'
import { WindCascadeProps } from './type'
import { convertCascadeOptions } from './utils/convertCascadeOptions'

// 缓存已加载的选项数据
const optionsCache = new Map()

// 动态导入函数
const loadOptionsData = async (optionsKey: string) => {
  if (optionsCache.has(optionsKey)) {
    return optionsCache.get(optionsKey)
  }

  let data
  switch (optionsKey) {
    case 'area':
      const { globalAreaTree } = await import('gel-util/config')
      data = globalAreaTree
      break
    case 'industry':
      const { industryOfNationalEconomyCfg } = await import('gel-util/config')
      data = industryOfNationalEconomyCfg
      break
    case 'industryOld':
      const { industryOfNationalEconomyCfgThree } = await import('gel-util/config')
      data = industryOfNationalEconomyCfgThree
      break
    default:
      data = null
  }

  if (data) {
    optionsCache.set(optionsKey, data)
  }
  return data
}

export const WindCascade = <OptionType extends Record<string, any>, ValueField extends keyof OptionType = 'value'>({
  value,
  options,
  optionsKey,
  onChange,
  fieldNames,
  className,
  style,
  open: propOpen,
  onOpenChange,
  defaultOpen,
  placeholder,
  ...props
}: WindCascadeProps<OptionType, ValueField> & {
  optionsKey?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const cascaderRef = useRef<any>(null)

  // Use the custom hook to manage open state
  const { open, setOpen } = useCascadeOpenState({
    ref,
    defaultOpen,
    open: propOpen,
    onOpenChange,
  })

  // Provide default fieldNames within the component body to avoid type errors
  const defaultFieldNames: NonNullable<WindCascadeProps<OptionType, ValueField>['fieldNames']> = {
    label: 'label',
    value: 'value' as ValueField,
    children: 'children',
  }

  const mergedFieldNames = fieldNames || defaultFieldNames

  // Use ahooks to make the component controlled
  const [cascadeValue, setCascadeValue] = useControllableValue<OptionType[ValueField][][]>({
    value,
    // Remove onChange from here to avoid double calls and stale closure issues
    defaultValue: [],
  })
  const [dynamicOptions, setDynamicOptions] = useState<OptionType[]>(options || [])
  const [isLoading, setIsLoading] = useState(false)

  // 动态加载选项
  useEffect(() => {
    const loadOptions = async () => {
      if (optionsKey && !options) {
        setIsLoading(true)
        try {
          const data = await loadOptionsData(optionsKey)
          if (data) {
            setDynamicOptions(data)
          }
        } catch (error) {
          console.error(`Failed to load options for ${optionsKey}:`, error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (optionsKey && !options) {
      loadOptions()
    }
  }, [optionsKey, options])

  const finalOptions = dynamicOptions || options
  const optionsConverted = convertCascadeOptions(finalOptions, mergedFieldNames)

  // Handle both values and options in the onChange
  const handleChange = (values: any, newSelectedOptions: any) => {
    // Update the value first
    setCascadeValue(values)
    // Then call onChange with the fresh selectedOptions to avoid stale closure
    if (onChange) {
      onChange(values, newSelectedOptions)
    }
  }

  // 显示加载状态
  if (isLoading) {
    return null
  }

  return (
    <div
      className={classNames(styles['custom-cascade'], className, {
        [styles['dropdownMatchSelectWidth']]: props.dropdownMatchSelectWidth,
      })}
      style={style}
      ref={ref}
    >
      <Cascader
        className={styles['custom-cascade-inner']}
        ref={cascaderRef}
        popupClassName={styles['custom-cascade--popup']}
        options={optionsConverted}
        placeholder={placeholder || (isEn() ? 'Please select' : '请选择')}
        onChange={handleChange}
        maxTagCount={'responsive'}
        value={cascadeValue}
        showSearch
        popupVisible={open}
        onPopupVisibleChange={setOpen}
        getPopupContainer={() => {
          if (ref.current) {
            return ref.current
          } else {
            console.warn('cascade wrapper ref is null')
            return document.body
          }
        }}
        multiple={true}
        expandTrigger="hover"
        // @ts-expect-error error
        matchInputWidth={props.dropdownMatchSelectWidth}
        {...props}
      />
    </div>
  )
}
