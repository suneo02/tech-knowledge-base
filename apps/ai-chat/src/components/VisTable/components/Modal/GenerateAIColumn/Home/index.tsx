import { requestToWFCSuperlistFcs } from '@/api'
import { useSmartFill } from '@/components/VisTable/context/SmartFillContext'
import type { InjectedRouteProps } from '@/components/common/RouteModal'
import { Button, Card, Col, Divider, Row, Skeleton, Checkbox } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { Form, Mentions } from 'antd'
import { AiModelEnum } from 'gel-api'
import React, { useCallback, useEffect, useState } from 'react'
import ModelSelector from '../components/ModelSelector'
import { ToolsDisplay, type SuperListTool } from '../components/ToolDisplay'
import { aiModels as importedAiModels, superListTools as importedSuperListTools } from '../index.json'
import Footer from './Footer'
import styles from './index.module.less'
import { t } from 'gel-util/intl'
import { isUsageAcknowledged } from '@/components/Modal/confirm'
import { generateUrlByModule, LinkModule, UserLinkParamEnum } from 'gel-util/link'

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
  PROMPT_PLACEHOLDER: t(
    '464094',
    '@ 引用列名，描述生成需求，AI逐行智能分析\n• 支持引用多个列名 \n• 描述越具体效果越好 \n \n示例： \n• 根据@企业名称，分析企业画像 \n• 提取@网址，找寻企业产品信息 \n• 分析@企业名称，给我营销建议 \n• 将@企业介绍翻译为专业的英文，仅输出英文内容'
  ),
  TYPE_AT_TO_SEE_MORE: t('464199', "试试输入 '@' 即可选择并引用其他列作为提示词的参数。"),
  MODEL_TITLE: t('464181', '模型'),
  TOOLS_TITLE: t('464112', '工具'),
  PROMPT_TITLE: t('464143', '提示词'),
  USE_TEMPLATE_BUTTON: t('257739', '使用模板'),
}

const CREDIT_AFFECTING_FIELDS: (keyof FormValues)[] = [
  'aiModel',
  'enableLinkTool',
  'enableWindBrowser',
  'enableWindDPU',
]

const toolsDisplayData: SuperListTool[] = importedSuperListTools as SuperListTool[]
const aiModelsData: AiModel[] = importedAiModels

// 添加 id 属性以修复类型错误
interface SuperListToolWithId extends SuperListTool {
  id: number
}
const toolsDisplayDataWithId: SuperListToolWithId[] = importedSuperListTools as SuperListToolWithId[]

export const GenerateAIColumnHome: React.FC<GenerateAIColumnHomeProps> = ({
  navigate,
  location,
  mentionsOptions,
  onClose,
}) => {
  const [credits, setCredits] = useState(0)
  const [form] = Form.useForm<FormValues>()
  const { columnId } = useSmartFill()
  const [checked, setChecked] = useState<boolean>(isUsageAcknowledged('AI_GENERATE_COLUMN'))

  const getAiInsertColumnParam = async (columnId: string): Promise<Partial<FormValues> | null> => {
    try {
      const response = (await requestToWFCSuperlistFcs(GET_AI_INSERT_COLUMN_PARAM_URL, { columnId })) as {
        Data: {
          prompt?: string
          aiModel?: AiModelEnum
          tool?: Record<string, object>
          templateName?: string
        } | null
      }
      const apiResult = response.Data
      if (apiResult) {
        const mappedValues: Partial<FormValues> = {
          prompt: apiResult.prompt,
          aiModel: apiResult.aiModel,
          templateName: apiResult.templateName,
        }

        if (apiResult.tool) {
          toolsDisplayDataWithId.forEach((toolConfig) => {
            if (apiResult.tool && Object.prototype.hasOwnProperty.call(apiResult.tool, toolConfig.id)) {
              mappedValues[toolConfig.key as keyof FormValues] = true
            } else {
              mappedValues[toolConfig.key as keyof FormValues] = false
            }
          })
        }
        return mappedValues
      }
      return null
    } catch (error) {
      console.error('Failed to fetch AI insert column params:', error)
      return null
    }
  }

  const { loading, run: fetchColumnParams } = useRequest(getAiInsertColumnParam, {
    manual: true,
    onSuccess: (data) => {
      if (data) {
        const finalFormValues: FormValues = {
          prompt: data.prompt ?? '',
          aiModel: data.aiModel ?? aiModelsData[0]?.id,
          enableLinkTool: data.enableLinkTool ?? false,
          enableWindBrowser: data.enableWindBrowser ?? false,
          enableWindDPU: data.enableWindDPU ?? false,
          templateName: data.templateName,
        }
        form.setFieldsValue(finalFormValues)
        calculateTotalCredits(finalFormValues)
      }
    },
  })

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

  useEffect(() => {
    const initializeForm = async () => {
      const stateFromLocation = location?.state as Partial<
        FormValues & {
          selectedTemplate?: FormValues
          columnId?: string
        }
      >

      const columnIdForEdit = columnId

      if (columnIdForEdit) {
        fetchColumnParams(columnIdForEdit)
      } else {
        let initialFormValues: Partial<FormValues> = {}
        if (stateFromLocation?.selectedTemplate) {
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
          initialFormValues = {
            prompt: stateFromLocation.prompt,
            aiModel: stateFromLocation.aiModel,
            enableLinkTool: stateFromLocation.enableLinkTool,
            enableWindBrowser: stateFromLocation.enableWindBrowser,
            enableWindDPU: stateFromLocation.enableWindDPU,
            templateName: stateFromLocation.templateName,
          }
        }

        const finalFormValues: FormValues = {
          prompt: initialFormValues.prompt ?? '',
          aiModel: initialFormValues.aiModel ?? aiModelsData[0]?.id,
          enableLinkTool: initialFormValues.enableLinkTool ?? false,
          enableWindBrowser: initialFormValues.enableWindBrowser ?? false,
          enableWindDPU: initialFormValues.enableWindDPU ?? false,
          templateName: initialFormValues.templateName,
        }

        if (
          stateFromLocation?.selectedTemplate ||
          Object.values(finalFormValues).some((v) => v !== undefined) ||
          finalFormValues.prompt === ''
        ) {
          form.setFieldsValue(finalFormValues)
          calculateTotalCredits(finalFormValues)
        }
      }
    }

    initializeForm()
  }, [location?.state, form, calculateTotalCredits, columnId, fetchColumnParams])

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
  const Left = () => (
    <Card size="small" divider="none" shadowed={false}>
      <div className={styles[`${PREFIX}-use-template-button`]}>
        <Button variant="alice" onClick={handleUseTemplate} disabled={loading}>
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
        isEditable={!loading}
        onToolToggle={handleToolToggle}
      />
    </Card>
  )

  const Right = () => (
    <Card size="small" divider="none" shadowed={false} className={styles[`${PREFIX}-mentions`]}>
      <div className={styles[`${PREFIX}-mentions-title`]}>
        <h4>{STRINGS.PROMPT_TITLE}</h4>
        <span className={styles[`${PREFIX}-mentions-remark`]}>({STRINGS.TYPE_AT_TO_SEE_MORE})</span>
      </div>
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
          disabled={loading}
        />
      </Form.Item>
      <div className={styles[`${PREFIX}-mentions-usage-agreement`]}>
        <Checkbox checked={checked} onChange={() => setChecked(!checked)} />
        我已知晓并同意
        <Button
          type="link"
          onClick={() =>
            window.open(
              generateUrlByModule({
                module: LinkModule.USER_CENTER,
                params: { type: UserLinkParamEnum.UserNote },
              }),
              '_blank'
            )
          }
          style={{ padding: 0 }}
          size="mini"
        >
          《用户协议》
        </Button>
        ，AI 生成结果受限于可查找的数据信息，可能返回无数据、或存在不准确的情况，请核实后再使用。
      </div>
    </Card>
  )

  return (
    <div className={styles[`${PREFIX}-container`]}>
      {loading ? (
        <Skeleton animation />
      ) : (
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
      )}
      <div className={styles[`${PREFIX}-footer`]}>
        <Footer
          credits={credits}
          form={form}
          columns={mentionsOptions}
          onClose={onClose}
          checked={checked}
          updateChecked={setChecked}
        />
      </div>
    </div>
  )
}
