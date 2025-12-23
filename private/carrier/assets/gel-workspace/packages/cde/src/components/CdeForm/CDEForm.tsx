import { Form, FormProps } from 'antd'
import React, { useImperativeHandle } from 'react'
import { FilterFormItem } from './components/FilterFormItem'
import { useFilterForm } from './hooks/useFilterForm'
import { CDEFormBizValues, CDEFormConfigItem, CDEFormValues, CDEMenuConfigItem } from './types'

const FilterFormInternal: React.ForwardRefRenderFunction<
  { resetFields: () => void; submit: () => void },
  FormProps<CDEFormValues> & {
    config: CDEFormConfigItem[]
    onValuesChange?: (fieldValues: CDEFormValues, transformedValues: CDEFormBizValues[]) => void
    onFinish?: (values: CDEFormBizValues[]) => void
  }
> = (props, ref) => {
  const { config, initialValues, onValuesChange, onFinish } = props
  const [form] = Form.useForm()
  const { handleValuesChange, handleFinish, normalizedInitialValues } = useFilterForm({
    config: config.map((item) => ({
      ...item,
      id: item.categoryId,
      value: item.categoryId,
      label: item.category,
      children: item.newFilterItemList,
    })) as CDEMenuConfigItem[],
    form,
    initialValues,
    onValuesChange,
    onFinish,
  })

  const resetFields = () => {
    form.resetFields()
  }
  const submit = () => {}

  useImperativeHandle(ref, () => ({
    resetFields,
    submit,
  }))

  return (
    <Form
      form={form}
      {...props}
      layout="vertical"
      onValuesChange={handleValuesChange}
      onFinish={handleFinish}
      initialValues={normalizedInitialValues}
    >
      <FilterFormItem config={config} />
    </Form>
  )
}

export const FilterForm = React.forwardRef(FilterFormInternal)
FilterForm.displayName = 'FilterForm'
