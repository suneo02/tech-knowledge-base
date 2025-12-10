// @ts-nocheck
import { useFetchCDERes } from '@/components/CDE/hooks/FetchCDERes.ts'
import { CDEFilterItemUser, useCDEMeasuresCtx } from 'cde'
import { default as classNames } from 'classnames'
import { CDEFilterResItem, CDEMeasureItem } from 'gel-api'
import { FC } from 'react'
import { useFetchCDEConfig } from '../hooks/CDEConfig'
import styles from '../style/index.module.less'
import { FilterResAndAddToExist } from './FilterResAndAddToExist'

interface CDEModalProps {
  open: boolean
  close: () => void
  onCancel?: () => void
  container?: HTMLElement | null
  className?: string
  wrapperClassName?: string
  width?: string
  height?: string
  onAdd?: (measuresOverall: CDEMeasureItem[], data: CDEFilterResItem[]) => void
  filters: CDEFilterItemUser[] | undefined
  measures: CDEMeasureItem[]
}

export const CDEMonitorPreview: FC<CDEModalProps> = ({
  open,
  close,
  onCancel,
  container,
  className,
  wrapperClassName,
  onAdd,
  filters,
  measures,
  ...restPorps
}) => {
  const { measuresOverall } = useCDEMeasuresCtx()
  const { fetch, data, loading, page } = useFetchCDERes(filters, measures)
  const [isAddable, setIsAddable] = useState(false)

  // Only fetch config when modal is opened
  useFetchCDEConfig(open)

  // Calculate if filters are valid

  const displayFooter = [
    <Button key="return" type="link" onClick={close}>
      返回
    </Button>,
    // 添加至表格
    <Button key="add" type="primary" disabled={!isAddable} onClick={() => onAdd?.(measuresOverall, data)}>
      添加至表格
    </Button>,
  ]

  return (
    <Modal
      title={'监控数据预览'}
      open={open}
      onCancel={onCancel}
      footer={displayFooter}
      className={classNames(styles['cde-modal--body'], className)}
      wrapClassName={classNames(styles['cde-modal--wrapper'], wrapperClassName)}
      getContainer={() => container || document.body}
      mask={false}
      centered
      {...restPorps}
    >
      <div className={styles['cde-modal-content']}>
        <FilterResAndAddToExist fetch={fetch} res={data} loading={loading} page={page} setIsAddable={setIsAddable} />
      </div>
    </Modal>
  )
}
