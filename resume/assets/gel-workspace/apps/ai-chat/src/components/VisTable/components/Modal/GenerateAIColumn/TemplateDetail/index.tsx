import { CoinsIcon } from '@/assets/icon' // If displaying credits
import type { InjectedRouteProps } from '@/components/common/RouteModal' // If needed for route props consistency
import { Alert, Button, Card, Col, Divider, Result, Row, Select, Spin, message } from '@wind/wind-ui'
import { Form } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { generateDynamicPrompt, type FormValues } from '@/utils' // 导入新的工具函数和类型
import { InputFieldsDisplay, type InputField as InputFieldTypeProp } from '../components/InputFieldsDisplay'
import { ToolsDisplay, type SuperListTool } from '../components/ToolDisplay' // Import the new ToolsDisplay component
import {
  aiModels as aiModelsData,
  superListTools as importedSuperListToolsData,
  superListTemplates,
} from '../index.json' // Import all necessary data
import styles from './index.module.less'

const PREFIX = 'template-detail'

const STRINGS = {
  BACK_BUTTON: '返回',
  USE_TEMPLATE_BUTTON: '使用此模板',
  TEMPLATE_NOT_FOUND: '未找到指定的模板或必要信息缺失。',
  INPUT_FIELDS_TITLE: '自定义参数',
  MODEL_INFO_TITLE: '模型信息',
  TOOLS_INFO_TITLE: '工具信息',
  PROMPT_TITLE: '提示语',
  FIELD_LABEL: '标签',
  FIELD_VALUE: '值',
  FIELD_DESCRIPTION: '描述',
  AI_MODEL_LABEL: 'AI 模型',
  LINK_TOOL_LABEL: '联网工具',
  WIND_BROWSER_LABEL: '万得浏览器',
  WIND_DPU_LABEL: '万得DPU',
  ENABLED: '已启用',
  DISABLED: '未启用',
  NO_INPUT_FIELDS: '此模板没有可自定义的参数。',
  NO_MODEL_INFO: '未指定模型信息。',
  NO_TOOLS_INFO: '未配置工具。',
  LIMITED_FREE_TAG: '限时免费',
  NO_PROMPT_PROVIDED: '未提供提示语。',
}

// Interface for the template data structure from index.json
interface JsonTemplateData {
  id: string | number
  name: string
  description?: string
  prompt: string
  aiModel?: string | number // Corresponds to id in aiModelsData
  enableLinkTool?: boolean
  enableWindBrowser?: boolean
  enableWindDPU?: boolean
  inputFields?: InputFieldTypeProp[]
  tools?: SuperListTool[]
  [key: string]: unknown // Changed from any to unknown for better type safety
}

// Define a type for columns passed via location state for defaultSelectOptions
interface ColumnOption {
  label: string
  value: string | number
  key?: string // key might also be present
}

// Define a more specific type for location.state expected by this component
interface TemplateDetailLocationState {
  id?: string // ID of the template to display
  from?: string // Path of the previous page
  // Allow other properties that might be passed in location.state
  [key: string]: unknown // Changed from any to unknown
}

export const TemplateDetail: React.FC<InjectedRouteProps & { columns: ColumnOption[] }> = ({
  location,
  navigate,
  columns,
}) => {
  const [form] = Form.useForm<FormValues>()
  const [loading, setLoading] = useState(false)
  const [template, setTemplate] = useState<JsonTemplateData | null>()
  const [dynamicPrompt, setDynamicPrompt] = useState<string>('') // State for the processed prompt

  const typedLocationState = location?.state as TemplateDetailLocationState | undefined
  const formValues = Form.useWatch([], form) // Watch all form values

  useEffect(() => {
    setLoading(true)
    const templateIdToShow = typedLocationState?.id
    if (templateIdToShow) {
      const foundTemplate = superListTemplates.find((t) => t.id.toString() === templateIdToShow)
      setTemplate((foundTemplate as JsonTemplateData) || null) // Ensure null if not found
    } else {
      setTemplate(null) // No ID, no template
    }
    setLoading(false)
  }, [typedLocationState?.id])

  useEffect(() => {
    if (template && template.inputFields) {
      const initialFormValues: FormValues = {}
      template.inputFields.forEach((field) => {
        initialFormValues[field.key || field.title] = field.value || (field.type === 'multiSelect' ? [] : undefined) // Use undefined for empty non-multiselect
      })
      form.setFieldsValue(initialFormValues)
    } else if (!template) {
      form.resetFields()
    }
    // Initial prompt update is handled by the next useEffect triggered by template/formValues change
  }, [template, form])

  useEffect(() => {
    if (!template || !template.prompt) {
      setDynamicPrompt(template?.prompt || '')
      return
    }
    // Call the helper function to update dynamicPrompt
    const newDynamicPrompt = generateDynamicPrompt(template.prompt, template.inputFields, formValues)
    setDynamicPrompt(newDynamicPrompt)
  }, [template, formValues]) // form is stable, template & formValues are key dependencies

  const handleUseTemplate = async () => {
    if (!template) return

    try {
      await form.validateFields()
    } catch (errorInfo) {
      console.error('Form validation failed:', errorInfo)
      message.error('请检查输入内容')
      return
    }

    // 将工具的key作为对象的key
    const keys = {}
    template?.tools?.forEach((tool) => {
      keys[tool.key] = true
    })

    // Construct state for Home page, excluding navigation-specific fields like 'id' and 'from'
    const homeState: { [key: string]: unknown } = { ...typedLocationState }
    delete homeState.id
    delete homeState.from

    navigate?.('/generate-ai-column/home', {
      state: {
        ...homeState, // Pass along other preserved state
        selectedTemplate: {
          // Specific structure Home.tsx expects
          templateName: template.name,
          prompt: dynamicPrompt, // Use the dynamically generated prompt
          aiModel: template.aiModel,
          ...keys,
        },
      },
    })
  }

  const handleGoBack = () => {
    const fromPath = typedLocationState?.from
    if (fromPath) {
      // Prepare state to pass back, removing detail-specific id and from
      const backState: { [key: string]: unknown } = { ...typedLocationState }
      delete backState.id
      delete backState.from
      navigate?.(fromPath, { state: backState })
    } else {
      navigate?.('/generate-ai-column/templates') // Default fallback
    }
  }

  const selectedAiModel = useMemo(() => {
    if (!template || typeof template.aiModel === 'undefined') return null
    return aiModelsData.find((m) => m.id === template.aiModel)
  }, [template])

  // Prepare values for ToolsDisplay based on the template
  const toolValues: { [key: string]: boolean | undefined } = {}
  if (template && template.tools) {
    template.tools.forEach((tool) => {
      toolValues[tool.key] = true
    })
  }

  // Cast superListToolsData to SuperListTool[] to match ToolsDisplay prop type
  const toolsDisplayData: SuperListTool[] = importedSuperListToolsData as SuperListTool[]

  return (
    //@ts-expect-error wind-ui 的 bug
    <Spin spinning={loading} tip="正在加载模板...">
      {!template ? (
        <div
          className={styles[`${PREFIX}-container`]}
          style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <Result status="404" title="404" subTitle={STRINGS.TEMPLATE_NOT_FOUND} />
          <div className={styles[`${PREFIX}-footer`]} style={{ flexShrink: 0 }}>
            <Button onClick={handleGoBack}>{STRINGS.BACK_BUTTON}</Button>
          </div>
        </div>
      ) : (
        <div className={styles[`${PREFIX}-container`]}>
          <Row className={styles[`${PREFIX}-content-row`]}>
            <Col span={8} className={styles[`${PREFIX}-left-panel`]}>
              <Card
                size="small"
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                divider="none"
                shadowed={false}
              >
                <div className={styles[`${PREFIX}-header-info`]}>
                  <div>{template.name}</div>
                  {template.description && (
                    <p className={styles[`${PREFIX}-header-info-remark`]}>{template.description}</p>
                  )}
                </div>
                <Divider />
                <Form
                  form={form}
                  layout="vertical"
                  style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '8px' /* for scrollbar */ }}
                >
                  {template.inputFields && template.inputFields.length > 0 ? (
                    <>
                      <h4 className={styles[`${PREFIX}-section-title`]}>{STRINGS.INPUT_FIELDS_TITLE}</h4>
                      <InputFieldsDisplay
                        inputFields={template.inputFields}
                        defaultSelectOptions={columns}
                        isEditable={true}
                      />
                    </>
                  ) : (
                    <Alert message={STRINGS.NO_INPUT_FIELDS} type="info" showIcon style={{ marginBottom: 16 }} />
                  )}

                  <Divider />
                  <h4 className={styles[`${PREFIX}-section-title`]}>{STRINGS.MODEL_INFO_TITLE}</h4>
                  {selectedAiModel ? (
                    <div className={styles[`${PREFIX}-form-item`]}>
                      <Select
                        style={{ width: '100%' }}
                        defaultValue={selectedAiModel.id}
                        disabled
                        options={aiModelsData.map((modal) => ({
                          label: (
                            <span style={{ display: 'inline-flex', width: '100%' }}>
                              <span>{modal.name}</span>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  width: '30px',
                                  marginInlineStart: 8,
                                }}
                              >
                                <CoinsIcon style={{ width: 12, height: 12, marginInlineEnd: 2 }} />
                                {modal.baseCredits}
                              </span>
                            </span>
                          ),
                          value: modal.id,
                        }))}
                      />
                    </div>
                  ) : (
                    <p className={styles[`text-secondary`]}>{STRINGS.NO_MODEL_INFO}</p>
                  )}
                  <Divider />
                  <h4 className={styles[`${PREFIX}-section-title`]}>{STRINGS.TOOLS_INFO_TITLE}</h4>

                  <ToolsDisplay toolsData={toolsDisplayData} values={toolValues} isEditable={false} />
                </Form>
              </Card>
            </Col>

            <Col span={16} className={styles[`${PREFIX}-right-panel`]}>
              <h4 className={styles[`${PREFIX}-section-title`]}>{STRINGS.PROMPT_TITLE}</h4>
              <div className={styles[`${PREFIX}-prompt-display-area`]}>
                {template && template.prompt ? dynamicPrompt : STRINGS.NO_PROMPT_PROVIDED || '此模板没有提供提示语。'}
                {/* <Markdown content={dynamicPrompt} /> */}
              </div>
            </Col>
          </Row>

          <div className={styles[`${PREFIX}-footer`]}>
            <Button onClick={handleGoBack}>{STRINGS.BACK_BUTTON}</Button>
            <Button
              type="primary"
              onClick={handleUseTemplate}
              variant="alice"
              style={{ height: 28, marginInlineStart: 8 }}
            >
              {STRINGS.USE_TEMPLATE_BUTTON}
            </Button>
          </div>
        </div>
      )}
    </Spin>
  )
}
