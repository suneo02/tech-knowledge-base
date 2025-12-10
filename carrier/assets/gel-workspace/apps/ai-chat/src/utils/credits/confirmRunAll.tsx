import { Modal, Spin } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import precheckRunAllPoints from './precheck'
import { AiModelEnum, AiToolEnum } from 'gel-api'
import { t } from 'gel-util/intl'

interface ConfirmRunAllOptions {
  sheetId: number
  totalRows?: number
  aiModel?: AiModelEnum | number | string
  tool?: Record<AiToolEnum, object>
  onConfirm: () => Promise<void> | void
}

const STRINGS = {
  TITLE: t('464208', '运行全部确认'),
  DESC: t('464119', '即将对该列的全部数据执行 AI 处理。'),
  ROWS_LABEL: t('464187', '涉及条数'),
  POINTS_LABEL: t('464224', '预估消耗'),
  POINTS_TIP: t('464122', '基于当前配置与条目数，最终以实际消耗为准'),
  CONSENT: t('464131', '我已知晓并同意按企业客户协议扣除对应积分'),
  OK: t('464108', '同意并运行'),
  CANCEL: t('19405', '取消')
}

const ConfirmRunAllBody = ({
  sheetId,
  aiModel,
  tool,
  totalRows,
  onReady,
  onFail,
}: {
  sheetId: number
  totalRows?: number
  aiModel?: AiModelEnum | number | string
  tool?: Record<AiToolEnum, object>
  onReady: (points: number | null) => void
  onFail: () => void
}) => {
  const { data, loading } = useRequest(() => precheckRunAllPoints({ sheetId, aiModel, tool }), {
    retryCount: 3,
    retryInterval: 1000,
    onSuccess: (points) => onReady(points ?? null),
    onError: () => onFail(),
  })

  return (
    <div style={{ lineHeight: 1.6 }}>
      <div>{STRINGS.DESC}</div>
      <div style={{ marginTop: 8 }}>
        <span style={{ color: 'var(--basic-6)' }}>{STRINGS.ROWS_LABEL}：</span>
        <span>{totalRows ?? '-'}</span>
      </div>
      <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'var(--basic-6)' }}>{STRINGS.POINTS_LABEL}：</span>
        {loading ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Spin size="small" />
            <span>计算中…</span>
          </span>
        ) : (
          <span>{typeof data === 'number' ? data.toLocaleString() : '将根据配置计算'}</span>
        )}
      </div>
      <div style={{ color: 'var(--basic-6)', fontSize: 12, marginTop: 2 }}>{STRINGS.POINTS_TIP}</div>
      <div style={{ marginTop: 12 }}>{STRINGS.CONSENT}</div>
    </div>
  )
}

export const showConfirmRunAllModal = async ({
  sheetId,
  totalRows,
  aiModel,
  tool,
  onConfirm,
}: ConfirmRunAllOptions) => {
  return new Promise<void>((resolve, reject) => {
    const modal = Modal.confirm({
      title: STRINGS.TITLE,
      content: (
        <ConfirmRunAllBody
          sheetId={sheetId}
          totalRows={totalRows}
          aiModel={aiModel}
          tool={tool}
          onReady={(points) => {
            modal.update?.({ okButtonProps: { disabled: false } })
          }}
          onFail={() => {
            modal.destroy?.()
            reject(new Error('precheck failed'))
          }}
        />
      ),
      okText: STRINGS.OK,
      cancelText: STRINGS.CANCEL,
      okButtonProps: { disabled: true },
      keyboard: false,
      maskClosable: false,
      onOk: async () => {
        await onConfirm()
        resolve()
      },
      onCancel: () => reject(new Error('cancel')),
    }) as unknown as { destroy?: () => void; update?: (config: any) => void }
  })
}

export default showConfirmRunAllModal
