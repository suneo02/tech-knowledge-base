import { DataRangeValue } from 'gel-ui'
import { TemplateFormData } from './components'
import { AiModelEnum } from 'gel-api'
// @ts-expect-error
import { ExtendedColumnDefine } from '@/components/MultiTable/utils/columnsUtils'

/**
 * 输入字段接口
 */
export interface InputField {
  title: string
  description?: string
  required?: boolean
  defaultValue?: string
  placeholder?: string
}

/**
 * 任务模板接口
 */
export interface TaskTemplate extends TemplateFormData {
  id: number
  name: string
  inputFields: InputField[]
  description: string
  outputRequirement?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * 保存表单的数据类型
 */
export interface SaveFormValues {
  dataRange: DataRangeValue
  customCount?: number
  targetSheet: 'current' | 'new' | 'existing'
  existingSheetId?: string // 已存在sheet的ID
}

/**
 * 模板项接口
 */
export interface TemplateItem {
  name: string
  description: string
  id?: number
}

/**
 * SmartFillModal组件属性接口
 */
export interface SmartFillModalProps {
  /**
   * 控制Modal是否显示
   */
  open: boolean
  /**
   * 关闭Modal的回调函数
   */
  onCancel: () => void
  /**
   * 确认按钮的回调函数
   */
  onOk: () => void
  /**
   * 表格列配置
   */
  columns: ExtendedColumnDefine[]
  /**
   * 提交模板的回调函数，返回最终的提示词和列映射
   */
  onSubmitTemplate?: (
    finalPrompt: string,
    options: {
      tools?: Record<string, Record<string, never>>
      runType?: string
      aiModel?: AiModelEnum
    }
  ) => void
  /**
   * 表单初始值，用于回显之前的配置
   */
  initialValues?: Partial<TemplateFormData>
}

/**
 * 页面标题配置接口
 */
export interface PageTitleConfig {
  title: string
  showBack: boolean
  onBack?: () => void
}
