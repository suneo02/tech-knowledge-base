import { AIIcon } from '@/assets/icon'
import CompanyIcon from '@/assets/icon/company.svg?react'
// @ts-expect-error
import { ExtendedColumnDefine } from '@/components/MultiTable/utils/columnsUtils'
import { IconTypeEnum } from '@/components/VisTable/types/iconTypes'
import { Divider, Radio, Select, Switch } from '@wind/wind-ui'
import { Form, Mentions } from 'antd'
import type { FormInstance } from 'antd/es/form'
import { AiInsertColumnRequest } from 'gel-api'
import { useEffect } from 'react'
import { RunTypeEnum } from '../config/formConfig'
import styles from './styles.module.less'
// 表单数据接口
export interface TemplateFormData extends Partial<AiInsertColumnRequest> {
  enableLinkTool?: boolean // 是否联网
  enableWindBrowser?: boolean // 是否Wind资讯浏览
  enableWindDPU?: boolean // 是否Wind数据查询
  runType?: string // 运行类型
  templateName?: string // 模板名称
}

// 字段配置接口
export interface FieldConfig {
  name: string
  label?: string
  type: 'select' | 'switch' | 'mentions' | 'text' | 'column_mapping' | 'radio'
  required?: boolean
  disabled?: boolean
  options?: Array<{ label: string; value: string | number; disabled?: boolean }>
  placeholder?: string
  description?: string
  descriptionColor?: string
  rows?: number
  mentionsOptions?: Array<{ key: string; value: string; label: string }>
  group?: string // 字段所属的分组
  fieldName?: string // 用于列映射的原始字段名
  runType?: RunTypeEnum // 运行类型
  credits?: number // 积分
}

interface ConfigurableFormProps {
  /**
   * 表格列配置
   */
  columns: ExtendedColumnDefine[]
  /**
   * 表单初始值
   */
  initialValues?: Partial<TemplateFormData>
  /**
   * 表单值变更回调
   */
  onFormChange?: (field: string, value: string | boolean) => void
  /**
   * 表单实例引用
   */
  formRef?: React.MutableRefObject<FormInstance<TemplateFormData> | null>
  /**
   * 字段配置
   */
  fieldConfigs: FieldConfig[]
  /**
   * 是否禁用所有字段（只读模式）
   */
  readOnly?: boolean
  /**
   * 列映射数据
   */
  columnMappings?: Record<string, string>
  /**
   * 处理列映射变更的回调
   */
  onColumnMappingChange?: (fieldName: string, columnField: string) => void
  /**
   * 自定义渲染标签内容
   */
  renderCustomLabel?: (name: string, label: string) => React.ReactNode
}

/**
 * 配置化表单组件
 */
export const ConfigurableForm = ({
  columns,
  initialValues = {},
  onFormChange,
  formRef,
  fieldConfigs,
  readOnly = false,
  columnMappings = {},
  onColumnMappingChange,
  renderCustomLabel,
}: ConfigurableFormProps) => {
  // 使用Form实例
  const [form] = Form.useForm<TemplateFormData>()

  // 如果提供了外部formRef，则将form实例赋值给它
  useEffect(() => {
    if (formRef) {
      formRef.current = form
    }
  }, [form, formRef])

  // 当initialValues变化时更新表单值
  useEffect(() => {
    form.setFieldsValue(initialValues as TemplateFormData)
  }, [form, initialValues])

  // 处理表单字段变更
  const handleFieldChange = (changedFields: Record<string, string | boolean>) => {
    const changedField = Object.keys(changedFields)[0]
    const changedValue = changedFields[changedField]

    if (changedField && onFormChange) {
      onFormChange(changedField, changedValue)
    }
  }

  // 处理列映射变更
  const handleColumnMappingChange = (fieldName: string, value: string) => {
    if (onColumnMappingChange) {
      onColumnMappingChange(fieldName, value)
    }
  }

  // 渲染表单字段
  const renderField = (config: FieldConfig) => {
    // console.log('🚀 ~ renderField ~ config:', config, initialValues[config.name as keyof TemplateFormData])
    const isDisabled = readOnly || config.disabled

    switch (config.type) {
      case 'select':
        return (
          <Select
            style={{ width: '100%' }}
            options={config.options}
            placeholder={config.placeholder}
            disabled={isDisabled}
            defaultValue={initialValues[config.name as keyof TemplateFormData]}
            optionRender={(option) => {
              // console.log('🚀 ~ option:', option)
              return (
                <div style={{ display: 'div', alignItems: 'center' }}>
                  {option?.data?.icon === IconTypeEnum.COMPANY ? (
                    <CompanyIcon style={{ marginRight: 8 }} />
                  ) : option?.data?.icon === IconTypeEnum.AI ? (
                    <AIIcon style={{ marginRight: 8 }} />
                  ) : undefined}
                  {option.label}
                </div>
              )
            }}
          />
        )
      case 'switch':
        return (
          // <div justify="space-between" align="center" style={{ marginTop: 12 }}>
          //   <span>{config.label}</span>
          <Switch
            size="small"
            // @ts-expect-error
            id={config.name}
            disabled={isDisabled}
            defaultChecked={initialValues[config.name as keyof TemplateFormData] as boolean}
          />
          // </div>
        )
      case 'mentions':
        return (
          <Mentions
            rows={config.rows || 3}
            placeholder={config.placeholder}
            options={
              config.mentionsOptions ||
              columns.map((col) => ({
                key: String(col.field),
                value: String(col.title),
                label: String(col.title),
              }))
            }
            disabled={isDisabled}
            className={styles['gradient-mentions']}
          />
        )
      case 'radio':
        return (
          <Radio.Group disabled={isDisabled}>
            {/* @ts-expect-error */}
            {config.options.map((res) => (
              <Radio
                style={{
                  display: 'block',
                  height: '32px',
                  lineHeight: '32px',
                }}
                value={res.value}
                disabled={res.disabled}
              >
                {res.label}
              </Radio>
            ))}
          </Radio.Group>
        )
      case 'text':
        return <span>{initialValues[config.name]}</span>
      case 'column_mapping': {
        // 如果有fieldName属性，使用它作为映射的键，否则使用name
        const mappingKey = config.fieldName || config.name.replace('mapping_', '')
        return (
          <Select
            options={columns.map((col) => ({ label: col.title, value: col.field, icon: col.headerIcon }))}
            style={{ width: '100%' }}
            value={columnMappings[mappingKey] || undefined}
            onChange={(value) => handleColumnMappingChange(mappingKey, value)}
            placeholder={config.required ? '必选项' : '可选项'}
          />
        )
      }
      default:
        return null
    }
  }

  // 按分组组织字段
  const groupedFields = fieldConfigs.reduce<Record<string, FieldConfig[]>>((groups, config) => {
    const group = config.group || 'default'
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(config)
    return groups
  }, {})

  return (
    <div style={{ overflow: 'auto', paddingBottom: 16 }}>
      <Form form={form} layout="vertical" initialValues={initialValues} onValuesChange={handleFieldChange}>
        {Object.entries(groupedFields).map(([groupName, configs], groupIndex) => {
          // 检查该分组是否包含必填字段

          return (
            <div key={groupName}>
              {groupName !== 'default' && <h3 style={{ marginBottom: 12 }}>{groupName}</h3>}

              {configs.map((config, index) => (
                <div key={index}>
                  {config.type === 'switch' ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>
                        {renderCustomLabel ? renderCustomLabel(config.name, config.label || '') : config.label}
                      </span>
                      <Form.Item name={config.name} style={{ marginBottom: 0 }}>
                        <Switch
                          size="small"
                          // @ts-expect-error
                          id={config.name}
                          disabled={config.disabled}
                          defaultChecked={initialValues[config.name as keyof TemplateFormData] as boolean}
                        />
                      </Form.Item>
                    </div>
                  ) : (
                    <Form.Item
                      style={{ marginBottom: 12 }}
                      label={renderCustomLabel ? renderCustomLabel(config.name, config.label || '') : config.label}
                      name={config.name}
                      rules={
                        config.required ? [{ required: true, message: `请输入${config.label || '内容'}` }] : undefined
                      }
                    >
                      {renderField(config)}
                    </Form.Item>
                  )}

                  {config.description && (
                    <p style={{ fontSize: 14, color: config.descriptionColor || '#999' }}>{config.description}</p>
                  )}
                </div>
              ))}

              {groupIndex < Object.keys(groupedFields).length - 1 && (
                <Divider style={{ marginBlockStart: 12, marginBlockEnd: 12 }} />
              )}
            </div>
          )
        })}
      </Form>
    </div>
  )
}
