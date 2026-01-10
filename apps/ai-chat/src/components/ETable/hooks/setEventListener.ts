import type { ListTableAll } from '@visactor/vtable/es/ListTable-all'
import { CellMetadata, RunColumnStatus, SourceTypeEnum } from 'gel-api'
import { eTableOperation } from '../utils/operation'
import { TaskIdentifier } from '@/components/ETable/context/ai-task/types'
import { AppDispatch } from '@/store/type'
import { fetchPoints } from '@/store'
import { postPointBuried } from '@/utils/common/bury'
import { TYPES } from '@visactor/vtable'
import { CModal } from '@/components/Modal'
import { LONG_TEXT_COLUMNS } from '@/config/longTextColumns'

export interface CellRect {
  x: number
  y: number
  width: number
  height: number
}

export interface CellOnClickRecord extends CellMetadata {
  columnName: string
  value: string
}

export interface SetEventListenerProps {
  onCellClick: CellOnClick
  updateTask: (list: TaskIdentifier[]) => void
  dispatch: AppDispatch
  openSmartFillModal: (columnId?: string, clearTemplate?: boolean) => void
  addTasksOnly: (list: TaskIdentifier[]) => void
}

export type CellOnClick = (rect: CellRect, record: CellOnClickRecord) => void

export const setEventListener = (ref: ListTableAll, sheetId: string, props: SetEventListenerProps) => {
  const { onCellClick, updateTask, dispatch, openSmartFillModal, addTasksOnly } = props
  ref.on('selected_cell', (event) => {
    // 目前只考虑单个单元格的操作
    const { col: startCol, row: startRow } = event.ranges[0].start
    const { col: endCol, row: endRow } = event.ranges[0].end
    if (event.ranges.length !== 1 || !(startCol === endCol && startRow === endRow)) {
      return
    }

    const { col, row } = event
    const cellRect = ref.getCellRelativeRect(col, row)
    const field = ref.getHeaderField(col, row) as string
    const headerInfo = ref.columns.find((column) => column.field === field)

    const record = ref.getRecordByCell(col, row)
    const { x1, y1, x2, y2 } = cellRect.bounds
    const rect = { x: x1, y: y1, width: x2 - x1, height: y2 - y1 }
    const info = record[`${field}&`]
    const columnName = headerInfo?.title as string
    const value = record[field]

    postPointBuried('922604570323', { column: columnName })
    if (LONG_TEXT_COLUMNS.has(columnName)) {
      const metadata = (info || { columnIndex: col, rowIndex: row }) as any
      onCellClick(rect, { ...metadata, columnName, value: String(value ?? '') })
      return
    }
    if (info.sourceId) {
      onCellClick(rect, { ...info, columnName, value })
    }
  })

  ref.on('icon_click', (event) => {
    if (event.name === 'RUN') {
      const taskId = eTableOperation(ref).runCell(event.col, event.row)
      if (taskId) {
        updateTask([taskId])
        dispatch(fetchPoints()) // 扣除积分
      }
    }
  })

  ref.on('mouseenter_cell', (args) => {
    const { col, row } = args
    const field = ref.getHeaderField(col, row) as string
    const record = ref.getRecordByCell(col, row)
    const info = record[`${field}&`]
    const columnName = (ref.columns.find((c) => c.field === field)?.title || '') as string
    const value = record[field]
    if (info.sourceType === SourceTypeEnum.AI_GENERATE_COLUMN) {
      const rect = ref.getVisibleCellRangeRelativeRect({ col, row })
      ref.showTooltip(col, row, {
        content: '请点击查看详情',
        referencePosition: { rect, placement: TYPES.Placement.bottom },
        className: 'defineTooltip',
        disappearDelay: 100,
        style: {
          color: '#333',
          fontSize: 14,
          arrowMark: true,
        },
      })
    }
    if (LONG_TEXT_COLUMNS.has(columnName)) {
      const rect = ref.getVisibleCellRangeRelativeRect({ col, row })
      ref.showTooltip(col, row, {
        content: '点击查看全部',
        referencePosition: { rect, placement: TYPES.Placement.bottom },
        className: 'defineTooltip',
        disappearDelay: 100,
        style: {
          color: '#333',
          fontSize: 14,
          arrowMark: true,
        },
      })
    }
  })

  ref.on('dropdown_menu_click', async (event) => {
    if (event.menuKey === 'AI_GENERATE_COLUMN') {
      postPointBuried('922604570318')
      openSmartFillModal()
      return
    }
    if (event.menuKey === 'EDIT_AI_COLUMN') {
      postPointBuried('922604570319')
      openSmartFillModal(event.field?.toString(), true)
      return
    }
    if (event.menuKey === 'RUN_ALL') {
      const executeRunAll = async () => {
        if (event.field) {
          const taskIds = await eTableOperation(ref).runColumn(event.field as string, Number(sheetId))
          if (taskIds) {
            addTasksOnly(taskIds)
            dispatch(fetchPoints()) // 扣除积分
          }
        }
      }

      if (CModal.isUsageAcknowledged('AI_GENERATE_COLUMN')) {
        await executeRunAll()
        return
      }

      CModal.confirm({
        modalType: 'AI_GENERATE_COLUMN',
        onOk: () => executeRunAll(),
      })
      return
    }
    if (event.menuKey === 'RUN_PENDING') {
      const executeRunPending = async () => {
        if (event.field) {
          const taskIds = await eTableOperation(ref).runColumn(
            event.field as string,
            Number(sheetId),
            RunColumnStatus.PENDING
          )
          if (taskIds) {
            addTasksOnly(taskIds)
            dispatch(fetchPoints()) // 扣除积分
          }
        }
      }

      if (CModal.isUsageAcknowledged('AI_GENERATE_COLUMN')) {
        await executeRunPending()
        return
      }

      CModal.confirm({
        modalType: 'AI_GENERATE_COLUMN',
        onOk: () => executeRunPending(),
      })

      return
    }
    // if (event.menuKey === 'RUN_ALL') {
  })
}
