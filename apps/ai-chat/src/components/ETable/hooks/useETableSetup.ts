import { useSuperChatRoomContext } from '@/contexts/SuperChat'
import { SearchComponent } from '@visactor/vtable-search'
import * as VTable from '@visactor/vtable'
import { useCallback, useEffect, useRef } from 'react'
import { useETableDataSource } from './useETableDataSource'
import { WIND_UI_THEME } from '../theme'
import { useRegister } from '@/components/VisTable/hooks/setup/useRegister'
import { CellOnClick, setEventListener } from './setEventListener'
import { TaskIdentifier } from '@/components/ETable/context/ai-task/types'
import { useAppDispatch } from '@/store'
import { useSmartFill } from '@/components/VisTable/context/SmartFillContext'

export interface ETableSetupProps {
  onCellClick: CellOnClick
  updateTask: (list: TaskIdentifier[]) => void
  addTasksOnly: (list: TaskIdentifier[]) => void
}

/**
 * 视图与生命周期管理 Hook
 * 唯一的职责是：管理 VTable 实例的创建、注册、和销毁。
 * @param tabKey - 当前标签页的 Key
 * @returns 返回 VTable 容器的 ref 和搜索组件的实例
 */
export const useETableSetup = (tabKey: string, props: ETableSetupProps) => {
  const { onCellClick, updateTask, addTasksOnly } = props
  const { openSmartFillModal } = useSmartFill()
  const dispatch = useAppDispatch()
  useRegister()
  const { registerTabRef, registerClearFn, tabVersions, registerSearchInstance, activeSheetId } =
    useSuperChatRoomContext()
  const version = tabVersions[tabKey] || 0
  const { dataSource, columns, clearQueue, loading } = useETableDataSource(tabKey, version)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const tableInstanceRef = useRef<VTable.ListTable | null>(null)

  // 创建新的表格实例的函数
  const createTableInstance = useCallback(() => {
    if (!containerRef.current || !dataSource || columns.length === 0) {
      return
    }

    // 先释放现有实例
    if (tableInstanceRef.current) {
      tableInstanceRef.current.release()
      tableInstanceRef.current = null
      registerSearchInstance(tabKey, null)
    }

    // 清空容器
    containerRef.current.innerHTML = ''

    const option: VTable.TYPES.ListTableConstructorOptions = {
      dataSource,
      columns: columns,
      widthMode: 'standard',
      heightMode: 'autoHeight',
      rowSeriesNumber: {
        title: '',
        width: 'auto',
        style: {
          textAlign: 'center',
        },
      },
      theme: WIND_UI_THEME,
      frozenColCount: 2,
      keyboardOptions: {
        pasteValueToCell: true,
        copySelected: true,
        moveEditCellOnArrowKeys: true,
      },
      editor: '',
      tooltip: {
        isShowOverflowTextTooltip: true,
      },
      select: {
        highlightMode: 'row',
      },
      hover: {
        highlightMode: 'row',
      },
    }
    const runCreate = () => {
      const tableInstance = new VTable.ListTable(containerRef.current!, option)
      tableInstanceRef.current = tableInstance

      setEventListener(tableInstance, activeSheetId, {
        onCellClick,
        updateTask,
        dispatch,
        openSmartFillModal,
        addTasksOnly,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const search = new SearchComponent({ table: tableInstance as any, autoJump: true })
      registerSearchInstance(tabKey, search)

      registerTabRef(tabKey, tableInstance)
      setTimeout(() => {
        tableInstance.setFrozenColCount(2)
        const options = tableInstance.options
        tableInstance.updateOption({ ...options })
      }, 300)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fontsReady = (document as any)?.fonts?.ready
    if (fontsReady && typeof fontsReady.then === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(document as any).fonts.ready.then(() => requestAnimationFrame(runCreate))
    } else {
      requestAnimationFrame(runCreate)
    }
  }, [dataSource, columns, registerTabRef, tabKey, registerSearchInstance])

  // 初始创建表格实例
  useEffect(() => {
    if (!tableInstanceRef.current) {
      createTableInstance()
    }
  }, [createTableInstance])

  // 监听版本变化，使用 updateOption 更新数据源和列
  useEffect(() => {
    if (tableInstanceRef.current && dataSource && columns.length > 0 && version > 0) {
      const options = tableInstanceRef.current.options
      tableInstanceRef.current.updateOption({ ...options, dataSource, columns })
    } else if (version > 0) {
      createTableInstance()
    }
  }, [dataSource, columns, version, createTableInstance])

  // 注册清理函数
  useEffect(() => {
    registerClearFn(tabKey, clearQueue)
    return () => {
      registerClearFn(tabKey, null)
    }
  }, [tabKey, clearQueue, registerClearFn])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (tableInstanceRef.current) {
        tableInstanceRef.current.release()
        tableInstanceRef.current = null
      }
      registerTabRef(tabKey, null)
      registerSearchInstance(tabKey, null)
    }
  }, [tabKey, registerTabRef, registerSearchInstance])

  return { containerRef, loading, noData: !dataSource?.length, registerTabRef }
}
