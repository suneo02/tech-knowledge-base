import { Button, Form, Space } from 'antd'
import React, { Suspense, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo } from 'react'
import CompositeFilter from './components/CompositeFilter'
import { getCompositionConfig } from './config/compositionMap'
import { componentMap } from './registry'
import { FilterConfigItem } from './types'
import { preprocessFilterItem } from './utils/preprocess'

export interface FilterFormProps {
  config: FilterConfigItem[]
  onFinish?: (values: any) => void
  initialValues?: any
  onValuesChange?: (changedValues: any, allValues: any) => void
  form: any // antd Form instance
}

export interface FilterFormRef {
  getSubmissionValues: () => Record<string, any>
  getDisplayValues: () => string[]
  form: any // antd Form instance
}

const DevErrorDisplay =
  process.env.NODE_ENV !== 'production' ? React.lazy(() => import('./dev/DevErrorDisplay')) : () => null

/**
 * 从配置数组中构建初始值对象。
 * 解决了 defaultValue 仅在 UI 生效，但未注册到 antd form 状态中的问题。
 * @author Calvin<xyi.calvin@gmail.com>
 * @param config 筛选表单的配置数组
 * @returns 一个 antd form `initialValues` 所需的对象
 */
const buildInitialValuesFromConfig = (config: FilterConfigItem[]): Record<string, any> => {
  const initialValues: Record<string, any> = {}

  for (const originalItem of config) {
    const item = preprocessFilterItem(originalItem)
    const compositionConfig = getCompositionConfig(item) || (item.itemType === 'composite' ? item : undefined)

    if (compositionConfig?.composition) {
      const compositeInitialValue: Record<string, any> = {}
      for (const comp of compositionConfig.composition) {
        if (comp.defaultValue !== undefined) {
          compositeInitialValue[comp.componentKey] = comp.defaultValue
        }
      }

      if (Object.keys(compositeInitialValue).length > 0) {
        initialValues[item.itemId] = { ...initialValues[item.itemId], ...compositeInitialValue }
      }
    } else {
      let valueToSet
      if (originalItem.initialValue !== undefined) {
        valueToSet = originalItem.initialValue
      } else if (item.defaultValue !== undefined) {
        valueToSet = item.defaultValue
      }
      if (valueToSet !== undefined) {
        initialValues[item.itemId] = { value: valueToSet }
      }
    }
  }

  return initialValues
}

const FilterForm = forwardRef<FilterFormRef, FilterFormProps>(
  ({ config, onFinish, initialValues, onValuesChange }, ref) => {
    const [form] = Form.useForm()

    const finalInitialValues = useMemo(() => {
      // 从组件配置中提取内部定义的默认值
      const configInitialValues = buildInitialValuesFromConfig(config)

      // 深度合并配置默认值和外部传入的初始值，外部值优先级更高
      const finalInitialValues = { ...configInitialValues }
      if (initialValues) {
        for (const key in initialValues) {
          const isObject =
            typeof finalInitialValues[key] === 'object' &&
            finalInitialValues[key] !== null &&
            !Array.isArray(finalInitialValues[key])
          if (isObject && typeof initialValues[key] === 'object') {
            finalInitialValues[key] = { ...finalInitialValues[key], ...initialValues[key] }
          } else {
            finalInitialValues[key] = initialValues[key]
          }
        }
      }
      return finalInitialValues
    }, [config, initialValues])

    useEffect(() => {
      form.setFieldsValue(finalInitialValues)
    }, [finalInitialValues, form])

    useImperativeHandle(ref, () => ({
      getSubmissionValues: () => {
        return form.getFieldsValue()
      },
      getDisplayValues: () => {
        // Placeholder for future implementation
        return []
      },
      form,
    }))

    const handleFinish = useCallback(() => {
      const values = form.getFieldsValue()
      console.log('--- Raw Form Values ---')
      console.log(values)
      console.log('--- JSON for values ---')
      console.log(JSON.stringify(values, null, 2))
      onFinish?.(values)
    }, [form, onFinish])

    const handleReset = useCallback(() => {
      form.resetFields()
    }, [form])

    const renderLabel = useCallback((item: FilterConfigItem) => {
      return item.itemName
    }, [])

    const renderBasicItem = useCallback(
      (item: FilterConfigItem) => {
        const mutableItem = preprocessFilterItem(item)

        const Component = componentMap[mutableItem.itemType as keyof typeof componentMap]

        // --- 渲染或错误提示 ---
        if (process.env.NODE_ENV !== 'production' && !Component) {
          return (
            <Suspense fallback={null}>
              <DevErrorDisplay
                type="unregistered-component"
                itemType={mutableItem.itemType}
                originalItemType={item.itemType}
              />
            </Suspense>
          )
        }

        if (!Component) {
          console.warn(`Component of type '${mutableItem.itemType}' is not registered.`)
          return null
        }

        // --- 智能 Form.Item 包裹 ---
        if ((Component as any).hasOwnFormItem) {
          return (
            <Form.Item key={item.itemId} name={item.itemId} noStyle>
              <Component {...mutableItem} label={renderLabel(item)} />
            </Form.Item>
          )
        }

        return (
          <Form.Item key={item.itemId} name={item.itemId} label={renderLabel(item)}>
            <Component {...mutableItem} />
          </Form.Item>
        )
      },
      [renderLabel]
    )

    const renderCompositionItem = useCallback(
      (item: FilterConfigItem, compositionConfig: any) => {
        // Dev-only check for industry filters that are missing the tree data
        if (
          process.env.NODE_ENV !== 'production' &&
          (item.itemType === '0' || item.itemType === '10') &&
          !compositionConfig.composition?.some((c: any) => c.itemType === 'cascader' && (c.options as any[])?.length)
        ) {
          return (
            <Suspense fallback={null}>
              <DevErrorDisplay type="missing-options-tree" itemName={item.itemName} itemType={item.itemType} />
            </Suspense>
          )
        }

        const finalComposition = compositionConfig.composition?.map((comp: any) => ({
          ...comp,
          ...(item[comp.componentKey] as Record<string, unknown>),
        }))

        return (
          <Form.Item key={item.itemId} name={item.itemId} label={renderLabel(item)}>
            <CompositeFilter composition={finalComposition || []} />
          </Form.Item>
        )
      },
      [renderLabel]
    )

    const renderFilterItem = useCallback(
      (item: FilterConfigItem) => {
        const compositionConfig = getCompositionConfig(item)
        if (compositionConfig) {
          return renderCompositionItem(item, compositionConfig)
        }

        // Fallback for legacy static composition
        if (item.itemType === 'composite' && item.composition) {
          return renderCompositionItem(item, item)
        }

        return renderBasicItem(item)
      },
      [renderBasicItem, renderCompositionItem]
    )

    const renderFilterItemWithExtra = useCallback(
      (item: FilterConfigItem) => {
        const mainItem = renderFilterItem(item)

        if (!item.hasExtra || !item.extraConfig?.length) {
          return mainItem
        }

        return (
          <React.Fragment key={item.itemId}>
            {mainItem}
            <Form.Item noStyle dependencies={[item.itemId]}>
              {(form) => {
                const value = form.getFieldValue(item.itemId)
                // The component for `hasExtra` is a boolean-like radio that returns a value of 'true' or 'false'
                if (value?.value === 'true') {
                  return item.extraConfig?.map((extraItem) => <div>{renderFilterItem(extraItem)}</div>)
                }
                return null
              }}
            </Form.Item>
          </React.Fragment>
        )
      },
      [renderFilterItem]
    )

    const handleValuesChange = useCallback(
      (changedFields: any, allFields: any) => {
        console.log('changedFields', changedFields)
        console.log('allFields', allFields)
        onValuesChange?.(changedFields, allFields)
      },
      [onValuesChange]
    )

    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={finalInitialValues}
        onValuesChange={handleValuesChange}
      >
        {config.map((item) => renderFilterItemWithExtra(item))}
        <Form.Item>
          <Space>
            <Button type="primary" onClick={handleFinish}>
              提交
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>
    )
  }
)

FilterForm.displayName = 'FilterForm'
export { FilterForm }
