import { useCallback, useMemo, useRef, useState } from 'react'
import { CDEFormConfigItem, CDEFormBizValues, CDEFormValues } from '../types'
import { FormInstance } from 'antd'
import { isEmpty } from 'gel-util/common'
import { useNormalizedValues } from './useNormalizedValues'
import type { CDEMenuConfigItem } from '../types'
import { transformFormValues } from '../utils/transform'

export interface UseFilterFormProps {
  config: CDEMenuConfigItem[] | CDEFormConfigItem[]
  form: FormInstance<CDEFormValues>
  onValuesChange?: (fieldValues: CDEFormValues, transformedValues: CDEFormBizValues[]) => void
  initialValues?: CDEFormBizValues[] | CDEFormValues
  onFinish?: (values: CDEFormBizValues[]) => void
}

export const useFilterForm = ({ config, form, onValuesChange, initialValues, onFinish }: UseFilterFormProps) => {
  const normalizedInitialValues = useNormalizedValues(initialValues)
  const [formValues, setFormValues] = useState<CDEFormValues>(normalizedInitialValues || {})
  const allFilterConfigItems: CDEFormConfigItem[] = useMemo(() => {
    if (!config || config.length === 0) {
      return []
    }
    if (config.some((item) => item.children)) {
      return (config as CDEMenuConfigItem[]).flatMap((item) => item.children || [])
    }
    return config as CDEFormConfigItem[]
  }, [config])
  const previousFormValuesCache = useRef<CDEFormValues | null>(null)

  const shouldShowExtra = (fieldValue: { value?: unknown } | undefined | null): boolean => {
    if (!fieldValue?.value) return false
    const { value } = fieldValue
    return value === 'true' || (Array.isArray(value) && value[0] === 'true')
  }

  const getActiveFieldIds = useCallback(
    (values: CDEFormValues): Set<string> => {
      const activeIds = new Set<string>()
      const traverse = (currentItems: CDEFormConfigItem[]) => {
        if (!currentItems) return
        currentItems.forEach((item) => {
          activeIds.add(String(item.itemId))
          const fieldValue = values[item.itemId]
          if (item.extraConfig?.length && fieldValue) {
            if (shouldShowExtra(fieldValue)) {
              traverse(item.extraConfig)
            } else {
              item.extraConfig.forEach((extraItem) => {
                form.setFieldValue(String(extraItem.itemId), undefined) // 清空不显示的额外配置
              })
            }
          }
        })
      }
      traverse(allFilterConfigItems)
      return activeIds
    },
    [allFilterConfigItems, form]
  )

  const compareFormValues = (prev: CDEFormValues | null, next: CDEFormValues): boolean => {
    if (!prev) return true
    let shouldUpdate = true
    Object.keys(next).forEach((key) => {
      if (isEmpty(prev[key]?.value) && isEmpty(next[key]?.value)) {
        shouldUpdate = false
      }
    })
    return shouldUpdate
  }

  const handleValuesChange = useCallback(
    (changedValues: CDEFormValues, allValues: CDEFormValues) => {
      const activeIds = getActiveFieldIds(allValues)

      const newFormValues = Object.keys(allValues).reduce((acc, key) => {
        if (activeIds.has(key) && !isEmpty(allValues[key]?.value)) {
          acc[key] = allValues[key]
        }
        return acc
      }, {} as CDEFormValues)

      setFormValues(newFormValues)

      if (compareFormValues(previousFormValuesCache.current, changedValues)) {
        onValuesChange?.(changedValues, transformFormValues(newFormValues, allFilterConfigItems))
      }
      previousFormValuesCache.current = allValues
    },
    [getActiveFieldIds, onValuesChange, allFilterConfigItems]
  )

  const handleFinish = useCallback(
    (values: CDEFormValues) => {
      onFinish?.(transformFormValues(values, allFilterConfigItems))
    },
    [onFinish, allFilterConfigItems]
  )

  const handleSubmit = useCallback((): Promise<CDEFormBizValues[]> => {
    const values = form.getFieldsValue()
    handleFinish(values)
    return Promise.resolve(transformFormValues(values, allFilterConfigItems))
  }, [form, allFilterConfigItems, handleFinish])

  const reset = () => {
    form.resetFields()
    setFormValues(normalizedInitialValues || {})
  }

  return { handleValuesChange, handleFinish, formValues, reset, normalizedInitialValues, handleSubmit }
}
