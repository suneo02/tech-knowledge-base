import { TaskTemplate } from '../types'
import { FormInstance } from 'antd/es/form'
import { TemplateFormData } from './ConfigurableForm'
import { CoinsIcon } from '@/assets/icon'
import { Button } from '@wind/wind-ui'

interface ModalFooterProps {
  /**
   * 当前页面索引
   */
  currentPage: number
  /**
   * 保存弹窗是否可见
   */
  savePopoverVisible: boolean
  /**
   * 设置保存弹窗可见性
   */
  setSavePopoverVisible: (visible: boolean) => void
  /**
   * 取消回调
   */
  onCancel: () => void
  /**
   * 保存回调
   */
  onOk: () => void
  /**
   * 选中的任务模板
   */
  selectedTaskTemplate?: TaskTemplate | null
  /**
   * 列映射数据
   */
  columnMappings: Record<string, string>
  /**
   * 使用此模板按钮点击回调
   */
  onUseTemplate?: () => void
  /**
   * 当前预览内容
   */
  previewContent?: string
  /**
   * 是否显示加载状态
   */
  loading?: boolean
  /**
   * 表单实例，用于验证表单
   */
  formRef?: React.MutableRefObject<FormInstance<TemplateFormData> | null>
}

/**
 * 模态框底部组件
 */
export const ModalFooter = ({
  currentPage,
  setSavePopoverVisible,
  onCancel,
  onOk,
  selectedTaskTemplate,
  columnMappings,
  onUseTemplate,
  previewContent,
  loading = false,
  formRef,
}: ModalFooterProps) => {
  // 检查必填字段是否都已映射
  const areRequiredFieldsMapped = () => {
    if (!selectedTaskTemplate) return false

    // 获取所有必填字段
    const requiredFields = Object.entries(selectedTaskTemplate.inputFields)
      .filter(([, fieldConfig]) => fieldConfig.required)
      .map(([, field]) => field.title)

    console.log('Required fields:', requiredFields)
    console.log('Current mappings:', columnMappings)

    // 检查所有必填字段是否都已映射
    return requiredFields.every((fieldName) => !!columnMappings[fieldName])
  }

  // 验证首页表单
  const validateHomeForm = async () => {
    if (!formRef?.current) return true

    try {
      await formRef.current.validateFields()
      return true
    } catch (error) {
      console.error('表单验证失败:', error)
      return false
    }
  }

  // 处理保存按钮点击
  const handleSave = async () => {
    if (currentPage === 0) {
      // 首页表单验证
      const valid = await validateHomeForm()
      if (valid) {
        onOk()
      }
    } else {
      onOk()
    }
  }

  // 获取当前积分信息
  const getCreditsInfo = () => {
    // 基础积分
    const baseCredits = 10

    // 根据当前页面和模板设置确定是否启用联网提取
    let enableLinkTool = true // 默认值设为true，与SmartFillModal组件中的默认值保持一致

    // 当在模板详情页面时，从selectedTaskTemplate中获取设置
    if (currentPage === 2 && selectedTaskTemplate) {
      enableLinkTool = selectedTaskTemplate.enableLinkTool === undefined ? false : selectedTaskTemplate.enableLinkTool
    }
    // 在首页时，从表单获取设置
    else if (formRef?.current) {
      const values = formRef.current.getFieldsValue()
      enableLinkTool = values.enableLinkTool !== undefined ? values.enableLinkTool : true
    }

    // 如果启用联网提取，总积分为15，否则为10
    const totalCredits = enableLinkTool ? 15 : 10

    return { baseCredits, totalCredits, enableLinkTool }
  }

  // 根据当前页面渲染不同的底部按钮
  switch (currentPage) {
    case 0: {
      // 首页 - AI生成列
      const { totalCredits } = getCreditsInfo()
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(240, 111, 19, 0.08)',
              borderRadius: 16,
              padding: '4px 10px',
              marginInlineEnd: 12,
            }}
          >
            <CoinsIcon style={{ width: 16, height: 16, marginRight: 4, color: '#f06f13' }} />
            <span style={{ fontSize: 14, color: '#f06f13', marginInlineEnd: 4 }}>{totalCredits} </span>
            <span style={{ fontSize: 14, color: '#f06f13' }}>{`/ 行`}</span>
          </div>
          <Button
            size="small"
            loading={loading}
            style={{ width: 100 }}
            variant="alice"
            type="primary"
            onClick={handleSave}
          >
            保存
          </Button>
        </div>
      )
    }
    case 1: // 查看模板页
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>取消</Button>
        </div>
      )
    case 2: {
      // 模板详情页
      const { totalCredits: templateCredits } = getCreditsInfo()
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(240, 111, 19, 0.08)',
              borderRadius: 16,
              padding: '4px 10px',
              marginInlineEnd: 12,
            }}
          >
            <CoinsIcon style={{ width: 16, height: 16, marginRight: 4, color: '#f06f13' }} />
            <span style={{ fontSize: 14, color: '#f06f13', marginInlineEnd: 4 }}>{templateCredits} </span>
            <span style={{ fontSize: 14, color: '#f06f13' }}>{`/ 行`}</span>
          </div>
          <Button style={{ marginRight: 8 }} onClick={onCancel}>
            取消
          </Button>
          <Button
            type="primary"
            disabled={!selectedTaskTemplate || !areRequiredFieldsMapped()}
            onClick={() => {
              if (onUseTemplate && previewContent) {
                // 如果有预览内容，则将其传递给父组件
                onUseTemplate()
              } else {
                setSavePopoverVisible(true)
              }
            }}
            loading={loading}
          >
            使用此模板
          </Button>
        </div>
      )
    }
    default:
      return null
  }
}
