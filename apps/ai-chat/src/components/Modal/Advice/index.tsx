import { CoinsIcon } from '@/assets/icon'
import { Alert, Button, Input, message } from '@wind/wind-ui'
import { Form } from 'antd'
import { t } from 'gel-util/intl'
import { FC } from 'react'

export type FeedbackCategory =
  | 'DATA_CORRECTION' // 数据纠错
  | 'FEATURE_IMPROVEMENT' // 功能优化/改进
  | 'USABILITY_ISSUE' // 使用问题/Bug
  | 'SERVICE_PROCESS' // 服务/流程反馈
  | 'COMPLIANCE_DISPUTE' // 合规/争议处理
  | 'OTHER' // 其他建议

export interface FeedbackFormValues {
  category: FeedbackCategory
  description: string
  contact?: string
}

export interface AdviceProps {
  defaultValues?: Partial<FeedbackFormValues>
  onSubmit?: (values: FeedbackFormValues) => void
  onCancel?: () => void
}

const STRINGS = {
  TIPS: (coins: number) =>
    t('464107', '凡提交有效反馈，次日即发放 {{coins}} 作为感谢。', {
      coins: (
        <div style={{ color: 'var(--orange-6)', display: 'flex', alignItems: 'center', marginInlineEnd: 4 }}>
          <CoinsIcon style={{ margin: '0 4px' }} />
          {coins}
        </div>
      ), }),
  // CATEGORY: t('', '反馈类型'),
  DESCRIPTION: t('', '建议描述'),
  // CONTACT: t('', '联系方式'),
  SUBMIT: t('', '提交'),
  CANCEL: t('19405', '取消'),
  SUCCESS: t('464134', '已提交，我们会尽快处理'),
  ERROR: t('464217', '请选择反馈类型'),
  ERROR_DESCRIPTION: t('438476', '请填写反馈描述'),
  CONTACT_PLACEHOLDER: t('464202', '请留下您的联系方式，以便我们联系您'),
  DESCRIPTION_PLACEHOLDER: t('464201', '请尽量详细描述问题或建议，便于我们快速处理'),
  REMARK: t('464130', '我们深知，来自真实业务场景的建议，是打磨企业级解决方案的核心依据。您的每一条反馈都将直接进入产品迭代优先级评估池，助力功能更贴合组织级需求。期待通过您的行业经验，共同打造更高效的工具体验。')
}

// const categoryOptions: Array<{ label: string; value: FeedbackCategory }> = [
//   { label: '数据纠错', value: 'DATA_CORRECTION' },
//   { label: '功能优化', value: 'FEATURE_IMPROVEMENT' },
//   { label: '使用问题', value: 'USABILITY_ISSUE' },
//   { label: '其他建议', value: 'OTHER' },
// ]

const Advice: FC<AdviceProps> = ({ defaultValues, onSubmit, onCancel }) => {
  const [form] = Form.useForm<FeedbackFormValues>()

  const handleFinish = (values: FeedbackFormValues) => {
    onSubmit?.({
      category: values.category,
      description: values.description?.trim(),
      contact: values.contact?.trim(),
    })
    message.success(STRINGS.SUCCESS)
  }

  return (
    <div>
      <Alert
        message={<div style={{ display: 'flex', alignItems: 'center' }}>{STRINGS.TIPS(100)}</div>}
        type="info"
        style={{ marginBlockEnd: 12, padding: '4px 12px' }}
      />
      <Form
        form={form}
        layout="vertical"
        wrapperCol={{ flex: 1 }}
        initialValues={{ category: 'DATA_CORRECTION', ...defaultValues }}
        colon={false}
        onFinish={handleFinish}
      >
        {/* <Form.Item label={STRINGS.CATEGORY} name="category" rules={[{ required: true, message: STRINGS.ERROR }]}>
          <Radio.Group style={{ width: '100%' }}>
            {categoryOptions.map((opt) => (
              <Radio key={opt.value} value={opt.value} style={{ marginRight: 16 }}>
                {opt.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item> */}

        <Form.Item
          label={STRINGS.DESCRIPTION}
          name="description"
          rules={[{ required: true, message: STRINGS.ERROR_DESCRIPTION }]}
        >
          <Input.TextArea rows={6} placeholder={STRINGS.DESCRIPTION_PLACEHOLDER} />
        </Form.Item>

        {/* <Form.Item label={STRINGS.CONTACT} name="contact" style={{ marginBlockEnd: 8 }}>
          <Input placeholder={STRINGS.CONTACT_PLACEHOLDER} />
        </Form.Item> */}
        <div style={{ marginBlockEnd: 12, color: 'var(--basic-8)', fontSize: 12 }}>{STRINGS.REMARK}</div>
        <Form.Item noStyle>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={onCancel}>{STRINGS.CANCEL}</Button>
            <Button type="primary" htmlType="submit">
              {STRINGS.SUBMIT}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Advice
