import { TaskTemplate } from '../types'
import { ConfigurableForm, TemplateFormData } from './ConfigurableForm'
import { getReadOnlyFieldConfigs } from '../config/formConfig'
// @ts-expect-error
import { ExtendedColumnDefine } from '@/components/MultiTable/utils/columnsUtils'
import Markdown from '@/components/markdown'
import styles from './styles.module.less'
import { Divider } from '@wind/wind-ui'

interface TemplateInfoProps {
  /**
   * 选中的任务模板
   */
  selectedTaskTemplate: TaskTemplate | null
  /**
   * 列映射数据
   */
  columnMappings: Record<string, string>
  /**
   * 处理列映射变更的回调
   */
  onColumnMappingChange: (fieldName: string, columnField: string) => void
  /**
   * 表格列配置
   */
  columns: ExtendedColumnDefine[]
  /**
   * 预览内容变更回调
   */
  onPreviewChange?: (content: string) => void
}

/**
 * 模板详情组件
 */
export const TemplateInfo = ({
  selectedTaskTemplate,
  columnMappings,
  columns,
  onColumnMappingChange,
  onPreviewChange,
}: TemplateInfoProps) => {
  // console.log('TemplateInfo columns', columns)
  // 如果没有选择任务模板，显示默认内容
  if (!selectedTaskTemplate) {
    return (
      <div>
        <h3>请先选择一个模板</h3>
      </div>
    )
  }

  // 获取只读模式的表单字段配置
  const fieldConfigs = getReadOnlyFieldConfigs(selectedTaskTemplate.inputFields, columns)

  // 生成预览提示词
  const generatePreviewPrompt = () => {
    let previewPrompt = selectedTaskTemplate.prompt
    // // console.log('Generating preview with mappings:', columnMappings)

    // 替换提示词中的变量
    Object.entries(selectedTaskTemplate.inputFields).forEach(([, field]) => {
      const fieldName = field.title
      const columnField = columnMappings[fieldName] || ''
      const placeholder = `{{${fieldName}}}`
      // // console.log('Processing field:', { fieldName, columnField, placeholder })

      if (previewPrompt && previewPrompt.includes(placeholder)) {
        // 如果已选择列，则替换为@列名
        if (columnField) {
          const columnTitle = columns.find((col) => col.field === columnField)?.title || ''
          // // console.log('Replacing with column:', { columnField, columnTitle })
          previewPrompt = previewPrompt.replace(new RegExp(placeholder, 'g'), `@${columnTitle}`)
        } else {
          // 未选择列，保持原样
          previewPrompt = previewPrompt.replace(new RegExp(placeholder, 'g'), placeholder)
        }
      }
    })

    // 当预览内容变化时通知父组件
    onPreviewChange?.(previewPrompt || '')
    // // console.log('Final preview:', previewPrompt)
    return previewPrompt
  }

  // 将任务模板数据转换为表单数据
  const templateFormData: Partial<TemplateFormData> = {
    prompt: selectedTaskTemplate.prompt,
    enableLinkTool: selectedTaskTemplate.enableLinkTool,
    enableWindBrowser: selectedTaskTemplate.enableWindBrowser,
    enableWindDPU: selectedTaskTemplate.enableWindDPU,
    runType: selectedTaskTemplate.runType,
    aiModel: selectedTaskTemplate.aiModel,
    templateName: selectedTaskTemplate.templateName,
  }

  // // console.log('Rendering TemplateInfo with mappings:', columnMappings)

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <h3 style={{ marginBottom: 12 }}>描述</h3>
      <div style={{ marginBottom: 12 }}>{selectedTaskTemplate.description}</div>
      <Divider style={{ margin: '0 12px' }} />
      {/* 使用ConfigurableForm显示模板基本信息，设为只读模式 */}
      <ConfigurableForm
        columns={columns}
        initialValues={templateFormData}
        fieldConfigs={fieldConfigs}
        onFormChange={(field, value) => {
          if (field.includes('mapping_')) {
            // 从字段名中提取实际的字段名（去掉 mapping_ 前缀）
            const fieldName = field.replace('mapping_', '')
            // 调用 onColumnMappingChange 更新映射关系
            onColumnMappingChange(fieldName, value as string)
            // 立即生成新的预览内容
            const newPreviewPrompt = generatePreviewPrompt()
            onPreviewChange?.(newPreviewPrompt || '')
          }
        }}
      />

      <Divider style={{ margin: '0 12px' }} />

      <h3>提示词</h3>
      <div className={styles.gradientBorderContainer}>
        <Markdown content={generatePreviewPrompt() || ''} />
      </div>
    </div>
  )
}
