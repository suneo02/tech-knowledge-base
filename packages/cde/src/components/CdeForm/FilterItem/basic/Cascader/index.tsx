import { Cascader as WindCascader } from '@wind/wind-ui'
import { ErrorBoundary } from 'gel-ui'
import React, { useMemo } from 'react'
import { CustomComponentProps, FilterOption } from '../../../types'
import styles from './index.module.less'
import { t } from 'gel-util/intl'

const PREFIX = 'cascader'
const STRINGS = {
  PLACEHOLDER: t('', '请输入或者选择对应的的内容'),
}

// Define a new type for the component that can hold a static property
type CascaderComponentType = React.FC<CustomComponentProps & { label?: React.ReactNode }> & {
  hasOwnFormItem?: boolean
}

const Cascader: CascaderComponentType = ({ value, onChange, options, label, ...restProps }) => {
  const handleChange = (newValue: any, _options: any) => {
    // antd/wind-ui Cascader's multiple mode gives (string|number)[][]
    const paths = newValue || []
    const flattenedValue = paths.map((path: string) => path[path.length - 1])
    onChange?.({
      ...(value || {}),
      value: flattenedValue,
    })
  }

  const displayValue = useMemo(() => {
    const rawValue = value?.value
    if (!rawValue || !Array.isArray(rawValue) || !options) {
      return []
    }

    // 检查 value 是否已经是期望的嵌套数组格式
    if (rawValue.length > 0 && Array.isArray(rawValue[0])) {
      return rawValue
    }

    // 如果是扁平数组，则需要转换回嵌套格式以供回显
    const valueToPathMap = new Map<string | number, (string | number)[]>()
    const buildMap = (currentOptions: FilterOption[], currentPath: (string | number)[]) => {
      for (const option of currentOptions) {
        const newPath = [...currentPath, option.value]
        valueToPathMap.set(option.value, newPath)
        if (option.children && option.children.length > 0) {
          buildMap(option.children, newPath)
        }
      }
    }
    buildMap(options, [])

    const flattenedValues = rawValue as (string | number)[]
    return flattenedValues
      .map((leafValue) => valueToPathMap.get(leafValue))
      .filter((path): path is (string | number)[] => !!path)
  }, [value, options])

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <ErrorBoundary fallback={<div></div>}>
        <WindCascader
          placeholder={STRINGS.PLACEHOLDER}
          size="large"
          style={{ width: '100%' }}
          options={options}
          value={displayValue as any}
          onChange={handleChange}
          dropdownMatchSelectWidth
          {...restProps}
        />
      </ErrorBoundary>
    </div>
  )
}

Cascader.hasOwnFormItem = true

export default Cascader
