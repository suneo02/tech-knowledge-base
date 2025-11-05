import type { InjectedRouteProps } from '@/components/common/RouteModal'
import { Button, Card, Col, Divider, Row } from '@wind/wind-ui'
import { Form, Mentions } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { aiModels as importedAiModels, superListTools as importedSuperListTools } from '../index.json'
import styles from './index.module.less'
import { ToolsDisplay, type SuperListTool } from '../components/ToolDisplay'
import ModelSelector from '../components/ModelSelector'
import Footer from './Footer'
import { requestToWFCSuperlistFcs } from '@/api'
import { AiModelEnum } from 'gel-api'

interface FormValues {
  aiModel?: string | number
  enableLinkTool?: boolean
  enableWindBrowser?: boolean
  enableWindDPU?: boolean
  templateName?: string
  prompt?: string
  columnId?: string
  [key: string]: string | number | boolean | undefined
}

interface AiModel {
  id: number
  name: string
  baseCredits: number
  description?: string
}

export interface GenerateAIColumnHomeProps extends InjectedRouteProps {
  mentionsOptions: {
    value: string
    label: string
    field: string
  }[]
  onClose: () => void
}

const PREFIX = 'generate-ai-column-home'
const GET_AI_INSERT_COLUMN_PARAM_URL = 'superlist/excel/getAiInsertColumnParam'

const STRINGS = {
  PROMPT_PLACEHOLDER: '在此输入内容，使用 @ 提及可用变量或列名...',
  AVAILABLE_VARIABLES_TEXT: '可用的变量:',
  TYPE_AT_TO_SEE_MORE: "输入 '@' 查看更多。",
  MODEL_TITLE: '模型',
  TOOLS_TITLE: '工具',
  PROMPT_TITLE: '提示语',
  USE_TEMPLATE_BUTTON: '使用模板',
  CREDITS_PER_ITEM: '/ 条',
  LIMITED_FREE_TAG: '限时免费',
}

const CREDIT_AFFECTING_FIELDS: (keyof FormValues)[] = [
  'aiModel',
  'enableLinkTool',
  'enableWindBrowser',
  'enableWindDPU',
]

const toolsDisplayData: SuperListTool[] = importedSuperListTools as SuperListTool[]
const aiModelsData: AiModel[] = importedAiModels

export const GenerateAIColumnHome: React.FC<GenerateAIColumnHomeProps> = ({
  navigate,
  location,
  mentionsOptions,
  onClose,
}) => {
  const [credits, setCredits] = useState(0)
  const [form] = Form.useForm<FormValues>()

  const calculateTotalCredits = useCallback((formValues: FormValues) => {
    const selectedModel = aiModelsData.find((model) => model.id === formValues.aiModel)
    let currentCredits = selectedModel ? selectedModel.baseCredits : 0
    toolsDisplayData.forEach((tool) => {
      if (formValues[tool.key]) {
        currentCredits += tool.credits
      }
    })
    setCredits(currentCredits)
  }, [])

  const getAiInsertColumnParam = useCallback(async (columnId: string): Promise<Partial<FormValues> | null> => {
    try {
      // Assuming the API returns data that can be mapped to FormValues
      // The structure of 'Data' needs to align with what AiInsertColumnRequest might have saved
      // or a specific structure defined by GET_AI_INSERT_COLUMN_PARAM_URL endpoint.
      const response = (await requestToWFCSuperlistFcs(GET_AI_INSERT_COLUMN_PARAM_URL, { columnId })) as {
        Data: {
          prompt?: string
          aiModel?: AiModelEnum // Or a model ID that needs mapping
          tool?: Record<string, object> // Keys are tool IDs (e.g., "1", "2"), value is {} if enabled
          templateName?: string
          // other fields if any
        } | null
      }

      const apiResult = response.Data

      if (apiResult) {
        console.log('🚀 ~ getAiInsertColumnParam ~ Raw API Data:', apiResult)
        const mappedValues: Partial<FormValues> = {
          prompt: apiResult.prompt,
          aiModel: apiResult.aiModel,
          templateName: apiResult.templateName,
        }

        if (apiResult.tool) {
          toolsDisplayData.forEach((toolConfig) => {
            // toolConfig.id is the ID string like "1", "2", "3" from superListTools in index.json
            // toolConfig.key is "enableLinkTool", "enableWindBrowser", etc.
            if (apiResult.tool && Object.prototype.hasOwnProperty.call(apiResult.tool, toolConfig.id)) {
              mappedValues[toolConfig.key as keyof FormValues] = true
            } else {
              // If not present in the API's tool object, assume false for this form field
              mappedValues[toolConfig.key as keyof FormValues] = false
            }
          })
        }
        console.log('🚀 ~ getAiInsertColumnParam ~ Mapped API Data for Form:', mappedValues)
        return mappedValues
      }
      return null
    } catch (error) {
      console.error('Failed to fetch AI insert column params:', error)
      return null
    }
  }, []) // toolsDisplayData is a stable module-level constant

  useEffect(() => {
    const initializeForm = async () => {
      const stateFromLocation = location?.state as Partial<
        FormValues & {
          selectedTemplate?: FormValues
          columnId?: string // This comes from initParams via RouteModal
        }
      >

      console.log('🚀 ~ initializeForm ~ stateFromLocation:', stateFromLocation)

      const columnIdForEdit = stateFromLocation?.columnId
      let initialFormValues: Partial<FormValues> = {}

      if (columnIdForEdit) {
        // Editing an existing column, fetch its saved data
        const apiData = await getAiInsertColumnParam(columnIdForEdit)
        if (apiData) {
          initialFormValues = { ...apiData }
        }
      } else if (stateFromLocation?.selectedTemplate) {
        // Not editing, but a template was selected from template list
        const { prompt, aiModel, enableLinkTool, enableWindBrowser, enableWindDPU, templateName } =
          stateFromLocation.selectedTemplate || {}
        initialFormValues = {
          prompt,
          aiModel,
          enableLinkTool,
          enableWindBrowser,
          enableWindDPU,
          templateName,
        }
      } else if (stateFromLocation) {
        // Fallback to other state values if not editing and no template selected
        // (e.g. navigating back from template list without selection, or initial direct params)
        initialFormValues = {
          prompt: stateFromLocation.prompt,
          aiModel: stateFromLocation.aiModel,
          enableLinkTool: stateFromLocation.enableLinkTool,
          enableWindBrowser: stateFromLocation.enableWindBrowser,
          enableWindDPU: stateFromLocation.enableWindDPU,
          templateName: stateFromLocation.templateName,
        }
      }

      // Apply defaults for any unset values after determining base initial values
      const finalFormValues: FormValues = {
        prompt: initialFormValues.prompt ?? '',
        aiModel: initialFormValues.aiModel ?? aiModelsData[0]?.id,
        enableLinkTool: initialFormValues.enableLinkTool ?? false,
        enableWindBrowser: initialFormValues.enableWindBrowser ?? false,
        enableWindDPU: initialFormValues.enableWindDPU ?? false,
        templateName: initialFormValues.templateName,
      }

      // Set fields if there's any value, or if it's an edit/template scenario, or if prompt is empty string
      if (
        columnIdForEdit ||
        stateFromLocation?.selectedTemplate ||
        Object.values(finalFormValues).some((v) => v !== undefined) ||
        finalFormValues.prompt === ''
      ) {
        form.setFieldsValue(finalFormValues)
        calculateTotalCredits(finalFormValues)
      }
    }

    initializeForm()
  }, [location?.state, form, calculateTotalCredits, getAiInsertColumnParam])

  const handleFieldChange = (changedValues: Partial<FormValues>, allValues: FormValues) => {
    const affectsCredits = Object.keys(changedValues).some((field) =>
      CREDIT_AFFECTING_FIELDS.includes(field as keyof FormValues)
    )
    if (affectsCredits) {
      calculateTotalCredits(allValues)
    }
  }

  const handleToolToggle = (toolKey: string, enabled: boolean) => {
    form.setFieldsValue({ [toolKey]: enabled })
    calculateTotalCredits(form.getFieldsValue())
  }

  const handleUseTemplate = () => {
    const currentFormValues = form.getFieldsValue()
    const stateToPass = { ...currentFormValues }
    delete stateToPass.selectedTemplate

    navigate!('/generate-ai-column/templates', {
      state: stateToPass,
    })
  }

  const currentFormValues = form.getFieldsValue()
  const toolToggleValues: { [key: string]: boolean | undefined } = {}
  toolsDisplayData.forEach((tool) => {
    const value = currentFormValues[tool.key]
    if (typeof value === 'boolean') {
      toolToggleValues[tool.key] = value
    } else {
      toolToggleValues[tool.key] = undefined
    }
  })

  const parseMentionsOptions = () => {
    const len = mentionsOptions.length
    if (len < 1) return ''
    return (
      mentionsOptions
        .map((option) => `@${option.label}`)
        .slice(0, 3)
        .join(', ') + (len > 3 ? ' 等。' : '。')
    )
  }
  const Left = () => (
    <Card size="small" divider="none" shadowed={false}>
      <div className={styles[`${PREFIX}-use-template-button`]}>
        <Button variant="alice" onClick={handleUseTemplate}>
          {STRINGS.USE_TEMPLATE_BUTTON}
        </Button>
      </div>
      <Divider />

      <h4>{STRINGS.MODEL_TITLE}</h4>
      <div className={styles[`${PREFIX}-form-item`]}>
        <ModelSelector />
      </div>
      <Divider />
      <h4>{STRINGS.TOOLS_TITLE}</h4>
      <ToolsDisplay
        toolsData={toolsDisplayData}
        values={toolToggleValues}
        isEditable={true}
        onToolToggle={handleToolToggle}
      />
    </Card>
  )

  const Right = () => (
    <Card size="small" divider="none" shadowed={false} className={styles[`${PREFIX}-mentions`]}>
      <h4>{STRINGS.PROMPT_TITLE}</h4>
      <div className={styles[`${PREFIX}-mentions-insert`]}></div>
      <Form.Item name="prompt">
        <Mentions
          rows={8}
          placeholder={STRINGS.PROMPT_PLACEHOLDER}
          options={mentionsOptions}
          autoSize={{
            minRows: 22,
            maxRows: 22,
          }}
        />
      </Form.Item>
      <div style={{ marginTop: 8 }}>
        <span className={styles[`${PREFIX}-mentions-remark`]}>
          {STRINGS.AVAILABLE_VARIABLES_TEXT} {parseMentionsOptions()}
          {STRINGS.TYPE_AT_TO_SEE_MORE}
        </span>
      </div>
    </Card>
  )

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div>
        <Form form={form} layout="vertical" onValuesChange={handleFieldChange}>
          <Row type="flex" divider="solid" gutter={24}>
            <Col span={8}>
              <Left />
            </Col>
            <Col span={16}>
              <Right />
            </Col>
          </Row>
        </Form>
      </div>

      <Footer credits={credits} form={form} columns={mentionsOptions} onClose={onClose} />
    </div>
  )
}
