import { Form } from 'antd'
import { CDESubscribeItem } from 'gel-api'
import { useEffect } from 'react'
import { SubscriptionFormConfig, SubscriptionFormData } from './types'

interface UseSubscriptionFormProps {
  open: boolean
  close: () => void
  info?: CDESubscribeItem
  fromAdd?: boolean
  subEmail: string | undefined
}

/**
 * 订阅表单自定义Hook
 *
 * 使用 Form 管理表单状态，处理：
 * - 表单初始化
 * - 表单提交
 * - 邮箱编辑权限
 */
export const useSubscriptionForm = ({ open, close, info, fromAdd, subEmail }: UseSubscriptionFormProps) => {
  const [form] = Form.useForm<SubscriptionFormData>()

  // 表单配置
  const formConfig: SubscriptionFormConfig = {
    isEmailEditable: !info?.subEmail || !info?.subPush,
    defaultEmail: subEmail || info?.subEmail,
  }

  // 初始化表单
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        subscriptionName: fromAdd ? '' : info?.subName || '',
        isPushEnabled: Boolean(info?.subPush),
        isEmailEnabled: Boolean(info?.subPush),
        emailAddress: subEmail || info?.subEmail || '',
      })
    }
  }, [open, info, subEmail, fromAdd, form])

  // 处理表单取消
  const handleModalClose = () => {
    form.resetFields()
    close()
  }

  // 处理表单验证
  const handleFormValidate = async () => {
    try {
      const formData = await form.validateFields()
      return formData
    } catch (error) {
      console.error('Form validation error:', error)
      throw error
    }
  }

  return {
    form,
    formConfig,
    handleModalClose,
    handleFormValidate,
  }
}
