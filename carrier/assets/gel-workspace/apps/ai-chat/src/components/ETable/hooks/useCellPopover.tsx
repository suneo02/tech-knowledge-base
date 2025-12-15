import { requestToWFCSuperlistFcs } from '@/api/requestFcs'
import { NotificationDescription } from '@/components/VisTable/components/notification/NotificationDescription'
import { parseProgressSteps } from '@/components/VisTable/utils/progressUtils'
import { CloseO } from '@wind/icons'
import { Button, Skeleton } from '@wind/wind-ui'
import { useRequest, useSetState } from 'ahooks'
import { Popover } from 'antd'
import { SourceTypeEnum } from 'gel-api'
import React from 'react'
import { CellOnClick, CellOnClickRecord, CellRect } from './setEventListener'

interface CellPopoverState extends Partial<CellOnClickRecord> {
  open: boolean
  rect?: CellRect
  opacity?: number
}

export const useCellPopover = () => {
  const [popover, setPopover] = useSetState<CellPopoverState>({ open: false })
  const popoverCache = useRef<string | null>(null)

  const { data, loading, run } = useRequest(
    (params: { sourceId: string }) => requestToWFCSuperlistFcs('superlist/excel/sourceDetail', params),
    {
      manual: true,
      loadingDelay: 500,
    }
  )

  const openCellPopover: CellOnClick = (rect, record) => {
    console.log('🚀 ~ openCellPopover ~ record:', rect, record)
    const { columnIndex, rowIndex } = record || {}
    // Hide any existing popover first to ensure re-render for consecutive clicks.
    setPopover({ open: false })
    if (popoverCache.current === `${columnIndex}-${rowIndex}`) {
      popoverCache.current = null
      return
    }

    // Use a timeout to allow React to process the state change (to invisible)
    // before setting it back to visible at the new position.
    setTimeout(() => {
      setPopover({
        open: true,
        ...record,
        rect,
      })
      if (popoverCache.current && popoverCache.current === `${columnIndex}-${rowIndex}`) {
        return
      }
      popoverCache.current = `${columnIndex}-${rowIndex}`
      if (record.sourceId) {
        run({ sourceId: record.sourceId })
      }
    }, 0)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setPopover({ open: false })
    }
  }

  const responseData = data?.Data

  const sourceDetail = React.useMemo(() => {
    if (loading) return '加载中...'
    if (!responseData) return '无详细描述'

    const { cdeDescription, indicatorFilterDetail, rawSentence, question } = responseData
    switch (responseData.type) {
      case SourceTypeEnum.AI_GENERATE_COLUMN:
        return question || '无数据来源'
      case SourceTypeEnum.INDICATOR:
        return indicatorFilterDetail || '无详细描述'
      case SourceTypeEnum.AI_CHAT:
        return rawSentence || '无数据来源'
      default:
        return cdeDescription || '无详细描述'
    }
  }, [responseData, loading])

  const progressSteps = React.useMemo(() => {
    if (!responseData?.progress) return []
    return parseProgressSteps(responseData.progress)
  }, [responseData])

  const PopoverContent = loading ? (
    <div style={{ width: 300, height: 200 }}>
      <Skeleton animation />
    </div>
  ) : (
    <div style={{ width: 400, maxHeight: '80vh', overflow: 'hidden' }}>
      <NotificationDescription
        columnDataType={popover.columnDataType}
        sourceType={responseData?.type as SourceTypeEnum}
        value={popover.value}
        sourceId={responseData?.sourceId}
        sourceDetail={sourceDetail}
        progressSteps={progressSteps}
        info={responseData}
        onModalOpen={() => {
          console.log('我打开了')
          setPopover({ opacity: 0 })
        }}
        onModalClose={() => {
          console.log('我关闭了')
          setPopover({ opacity: 1 })
        }}
      />
    </div>
  )

  const CellPopover = popover.open && popover.rect && (
    <Popover
      open={popover.open}
      content={PopoverContent}
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {popover.columnName}
          {/* @ts-expect-error wind-icon */}
          <Button type="text" icon={<CloseO />} onClick={() => setPopover({ open: false })} />
        </div>
      }
      zIndex={999}
      placement="right"
      onOpenChange={handleOpenChange}
      autoAdjustOverflow
      arrow={false}
      trigger="click"
      overlayStyle={{ opacity: popover.opacity }}
    >
      <div
        style={{
          position: 'absolute',
          top: popover.rect.y,
          left: popover.rect.x,
          width: popover.rect.width,
          height: popover.rect.height,
          pointerEvents: 'none',
        }}
      />
    </Popover>
  )

  return {
    openCellPopover,
    CellPopover,
  }
}
