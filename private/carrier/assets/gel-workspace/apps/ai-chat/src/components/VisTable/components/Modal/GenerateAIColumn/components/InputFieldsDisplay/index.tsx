import React, { useState } from 'react'
import { Form } from 'antd'
import { Input, Select, Button } from '@wind/wind-ui'
import styles from './index.module.less'
import { RecommendIcon } from '@/assets/icon'

export interface InputField {
  title: string
  key?: string // Used as form item name, falls back to title
  placeholder?: string
  value?: string // Default/initial value
  required?: boolean
  type?: 'input' | 'select' | 'multiSelect' | 'textarea' // Add 'textarea' type
  options?: { label: string; value: string | number }[] // Specific options for this select field
  disabled?: boolean // To control if the field is editable
  recommend?: string // Optional recommendation text for textarea
  rows?: number // Optional rows for textarea
}

interface InputFieldsDisplayProps {
  inputFields: InputField[]
  defaultSelectOptions?: { label: string; value: string | number }[] // Fallback options for select type
  isEditable: boolean // General flag to disable all fields if false
}

const PREFIX = 'input-fields-display'

// 文本输入框组件（带Form.Item）
const InputTypeFormItem: React.FC<{
  field: InputField
  isEditable: boolean
  index: number
}> = ({ field, isEditable, index }) => {
  const fieldName = field.key || field.title

  return (
    <Form.Item
      key={fieldName || `input-field-${index}`}
      label={field.title}
      name={fieldName}
      rules={[{ required: field.required, message: `${field.title} 是必填项` }]}
      className={styles[`${PREFIX}-item`]}
    >
      <Input
        placeholder={field.placeholder || `请输入 ${field.title}`}
        disabled={!isEditable || field.disabled}
        className="wind-input"
      />
    </Form.Item>
  )
}

// 单选下拉框组件（带Form.Item）
const SelectTypeFormItem: React.FC<{
  field: InputField
  isEditable: boolean
  defaultOptions: { label: string; value: string | number }[]
  index: number
}> = ({ field, isEditable, defaultOptions, index }) => {
  const fieldName = field.key || field.title

  return (
    <Form.Item
      key={fieldName || `select-field-${index}`}
      label={field.title}
      name={fieldName}
      rules={[{ required: field.required, message: `${field.title} 是必填项` }]}
      className={styles[`${PREFIX}-item`]}
    >
      <Select
        placeholder={field.placeholder || `请选择 ${field.title}`}
        options={field.options || defaultOptions}
        disabled={!isEditable || field.disabled}
        style={{ width: '100%' }}
        className="wind-select"
      />
    </Form.Item>
  )
}

// 多选下拉框组件（带Form.Item）
const MultiSelectTypeFormItem: React.FC<{
  field: InputField
  isEditable: boolean
  defaultOptions: { label: string; value: string | number }[]
  index: number
}> = ({ field, isEditable, defaultOptions, index }) => {
  const fieldName = field.key || field.title
  const form = Form.useFormInstance()
  const [, forceUpdate] = useState({})
  const fieldOptions = field.options || defaultOptions
  const currentFieldValue = form.getFieldValue(fieldName)

  const isAllSelected =
    Array.isArray(currentFieldValue) &&
    fieldOptions.length > 0 &&
    currentFieldValue.length === fieldOptions.length &&
    fieldOptions.every((option) => currentFieldValue.includes(option.value))

  const handleToggleSelectAll = () => {
    if (fieldOptions.length > 0) {
      if (isAllSelected) {
        // 如果已全选，则取消全选
        form.setFieldsValue({ [fieldName]: [] })
      } else {
        // 如果未全选，则全选
        const allValues = fieldOptions.map((option) => option.value)
        form.setFieldsValue({ [fieldName]: allValues })
      }
      forceUpdate({}) // 强制重新渲染以更新UI
    }
  }

  return (
    <Form.Item
      key={fieldName || `multi-select-field-${index}`}
      label={
        <div className={styles[`${PREFIX}-label-with-button`]}>
          <span>{field.title}</span>
          {isEditable && !field.disabled && defaultOptions.length > 0 && (
            <Button size="mini" onClick={handleToggleSelectAll} className={styles[`${PREFIX}-select-all-button`]}>
              {isAllSelected ? '取消全选' : '全选'}
            </Button>
          )}
        </div>
      }
      name={fieldName}
      rules={[{ required: field.required, message: `${field.title} 是必填项` }]}
      className={styles[`${PREFIX}-item`]}
    >
      <Select
        mode="multiple"
        placeholder={field.placeholder || `请选择 ${field.title} (可多选)`}
        options={field.options || defaultOptions}
        disabled={!isEditable || field.disabled}
        style={{ width: '100%' }}
        className="wind-select-multiple"
        maxTagCount="responsive"
      />
    </Form.Item>
  )
}

// 文本域组件（带Form.Item）
const TextAreaTypeFormItem: React.FC<{
  field: InputField
  isEditable: boolean
  index: number
}> = ({ field, isEditable, index }) => {
  const form = Form.useFormInstance()
  const [, forceUpdate] = useState({})
  const fieldName = field.key || field.title
  const currentFieldValue = form.getFieldValue(fieldName)

  const handleUseRecommendation = () => {
    if (field.recommend) {
      form.setFieldsValue({ [fieldName]: field.recommend })
      forceUpdate({})
    }
  }

  return (
    <Form.Item
      key={fieldName || `textarea-field-${index}`}
      label={field.title}
      name={fieldName}
      rules={[{ required: field.required, message: `${field.title} 是必填项` }]}
      className={styles[`${PREFIX}-item`]}
    >
      <div className={styles[`${PREFIX}-textarea-wrapper`]}>
        <Input.TextArea
          placeholder={field.recommend || field.placeholder || `请输入 ${field.title}`}
          disabled={!isEditable || field.disabled}
          rows={field.rows || 4}
          value={currentFieldValue}
          onChange={(e) => {
            form.setFieldsValue({ [fieldName]: e.target.value })
            forceUpdate({})
          }}
          className="wind-textarea"
        />
        {isEditable && field.recommend && !currentFieldValue && (
          <div onClick={handleUseRecommendation} className={styles[`${PREFIX}-recommend-button`]}>
            <RecommendIcon width={18} height={18} />
            <span>使用推荐思路</span>
          </div>
        )}
      </div>
    </Form.Item>
  )
}

// 根据类型渲染对应的输入字段组件
const renderFieldByType = (
  field: InputField,
  isEditable: boolean,
  index: number,
  defaultOptions: { label: string; value: string | number }[]
) => {
  const fieldType = field.type || 'select'

  switch (fieldType) {
    case 'input':
      return <InputTypeFormItem field={field} isEditable={isEditable} index={index} />
    case 'select':
      return <SelectTypeFormItem field={field} isEditable={isEditable} defaultOptions={defaultOptions} index={index} />
    case 'multiSelect':
      return (
        <MultiSelectTypeFormItem field={field} isEditable={isEditable} defaultOptions={defaultOptions} index={index} />
      )
    case 'textarea':
      return <TextAreaTypeFormItem field={field} isEditable={isEditable} index={index} />
    default:
      return null
  }
}

export const InputFieldsDisplay: React.FC<InputFieldsDisplayProps> = ({
  inputFields,
  defaultSelectOptions = [],
  isEditable,
}) => {
  return <>{inputFields.map((field, index) => renderFieldByType(field, isEditable, index, defaultSelectOptions))}</>
}
