import React from 'react'
import { Button, Modal as WModal, Checkbox } from '@wind/wind-ui'
import { local } from '@/utils/storage'
import { ModalFuncProps } from '@wind/wind-ui/lib/modal'
import { generateUrlByModule, LinkModule, UserLinkParamEnum } from 'gel-util/link'
import { t } from 'gel-util/intl'

export type ConfirmUsageType = 'AI_GENERATE_COLUMN' | 'ADD_COLUMN'

const STRINGS = {
  USER_AGREEMENT: t('452995', '用户协议'),
  NOTICE: t(
    '465498',
    '我已知晓并同意 {{user}}，指标提取结果受限于可查找的数据信息，可能返回无数据、或存在不准确的情况，请核实后再使用',
    {
      user: (
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
        >
          {t('452995', '用户协议')}
        </Button>
      ),
    }
  ),
  NOTICE_AI_GENERATE_COLUMN: t(
    '465476',
    '我已知晓并同意 {{user}}，AI 生成结果受限于可查找的数据信息，可能返回无数据、或存在不准确的情况，请核实后再使用',
    {
      user: (
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
        >
          {t('452995', '用户协议')}
        </Button>
      ),
    }
  ),
  DEFAULT_CHECKBOX_TEXT: t('465480', '后续默认为我勾中提示'),
  TITLE: t('237485', '温馨提示'),
  OK_TEXT: t('103328', '确定'),
  CANCEL_TEXT: t('19405', '取消'),
}

export const isUsageAcknowledged = (modalType: ConfirmUsageType) => {
  const STORAGE_KEY_MAP: Record<ConfirmUsageType, string> = {
    AI_GENERATE_COLUMN: 'ai-usage-ack-ai-generate-column',
    ADD_COLUMN: 'ai-usage-ack-add-column',
  }
  return Boolean(local.get(STORAGE_KEY_MAP[modalType] as never))
}

export interface ConfirmUsageOptions extends Partial<Omit<ModalFuncProps, 'onOk'>> {
  modalType: ConfirmUsageType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOk: (func?: any) => any
}

export const confirmUsage = (options: ConfirmUsageOptions) => {
  const { modalType, onOk, ...rest } = options || {}

  if (!modalType) throw new Error('CModal.confirm: 缺少必填参数 type')
  if (!onOk) throw new Error('CModal.confirm: 缺少必填回调 onOk')

  const TITLE = STRINGS.TITLE
  const CONTENT_MAP: Record<ConfirmUsageType, React.ReactNode> = {
    AI_GENERATE_COLUMN: STRINGS.NOTICE_AI_GENERATE_COLUMN,
    ADD_COLUMN: STRINGS.NOTICE,
  }

  const STORAGE_KEY_MAP: Record<ConfirmUsageType, string> = {
    AI_GENERATE_COLUMN: 'ai-usage-ack-ai-generate-column',
    ADD_COLUMN: 'ai-usage-ack-add-column',
  }

  let checked = false

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div>{CONTENT_MAP[modalType]}</div>
      <Checkbox defaultChecked={false} onChange={(e) => (checked = !!e.target?.checked)}>
        {STRINGS.DEFAULT_CHECKBOX_TEXT}
      </Checkbox>
    </div>
  )

  return WModal.confirm({
    title: TITLE,
    content,
    okText: STRINGS.OK_TEXT,
    cancelText: STRINGS.CANCEL_TEXT,
    closable: false,
    type: 'info',
    onOk: async () => {
      if (checked) local.set(STORAGE_KEY_MAP[modalType], true)
      else local.remove(STORAGE_KEY_MAP[modalType])
      return onOk()
    },
    zIndex: 1050,
    ...rest,
  })
}
