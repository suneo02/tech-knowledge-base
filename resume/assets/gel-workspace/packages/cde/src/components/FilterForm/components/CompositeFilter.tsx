import React, { useCallback, useMemo } from 'react'
import { CompositionItem, FilterValue, PrimitiveValue } from '../types'
import styles from './CompositeFilter.module.less'
import { componentMap } from '../registry'

interface CompositeFilterProps {
  composition: CompositionItem[]
  value?: Record<string, PrimitiveValue>
  onChange?: (value: Record<string, PrimitiveValue>) => void
}

const getItemStyle = (item: CompositionItem): React.CSSProperties => {
  const style: React.CSSProperties = {}
  if (item.width) {
    style.width = item.width
  } else if (item.span) {
    style.width = `calc(${(item.span / 24) * 100}% - 8px)`
  }
  return style
}

const getItemClassName = (item: CompositionItem): string => {
  const classNames = [styles.item]
  if (item.width || item.span) {
    classNames.push(styles.itemNoShrink)
  } else {
    classNames.push(styles.itemGrow)
  }
  return classNames.join(' ')
}

const CompositeFilter: React.FC<CompositeFilterProps> = ({ composition, value = {}, onChange }) => {
  const hasValueComponent = useMemo(() => composition.some((item) => item.componentKey === 'value'), [composition])

  if (process.env.NODE_ENV !== 'production' && !hasValueComponent) {
    return (
      <div className={styles.error}>
        <p>
          <strong>[CompositeFilter Error]</strong>
        </p>
        <p>
          The `composition` prop is missing an item with `componentKey: 'value'`. This is a required part of the
          component's configuration.
        </p>
      </div>
    )
  }

  if (!hasValueComponent) {
    console.error("[CompositeFilter Error] The `composition` prop is missing an item with `componentKey: 'value'`.")
    return null
  }

  const handleComponentChange = useCallback(
    (componentKey: string, componentValueFromChild: FilterValue | undefined) => {
      const primitiveValue = componentValueFromChild?.value
      const newValue = { ...value }

      if (primitiveValue === undefined) {
        delete newValue[componentKey]
      } else {
        newValue[componentKey] = primitiveValue
      }

      onChange?.(newValue)
    },
    [onChange, value]
  )

  return (
    <div className={styles.wrapper}>
      {composition.map((item) => {
        const { componentKey, itemType, ...restProps } = item
        if (!componentKey) {
          if (process.env.NODE_ENV !== 'production') {
            console.error('[CompositeFilter Error] Missing `componentKey` in composition item.', item)
          }
          return null
        }

        const Component = componentMap[itemType]

        if (!Component) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`Component of type '${itemType}' is not registered.`)
          }
          return null
        }

        const primitiveValue = value?.[componentKey]
        const valueForChild: FilterValue | undefined =
          primitiveValue !== undefined ? { value: primitiveValue } : undefined

        return (
          <div key={componentKey} className={getItemClassName(item)} style={getItemStyle(item)}>
            <Component
              itemType={itemType}
              value={valueForChild}
              onChange={(val?: FilterValue) => handleComponentChange(componentKey, val)}
              {...restProps}
            />
          </div>
        )
      })}
    </div>
  )
}

export default CompositeFilter
