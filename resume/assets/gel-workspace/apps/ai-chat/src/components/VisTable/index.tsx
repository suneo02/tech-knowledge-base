import { ExtendedColumnDefine } from '@/components/MultiTable/utils/columnsUtils'
import Toolbar from '@/pages/VisTable/components/toolbar'
import { Result } from '@wind/wind-ui'
import { AiModelEnum } from 'gel-api'
import React, { useEffect, useRef } from 'react'
import GenerateAIColumn from './components/Modal/GenerateAIColumn'
import Welcome from './components/welcome'
import { useSmartFill } from './context/SmartFillContext'
import { useVisTableContext } from './context/VisTableContext'
import { useVisTableSetup } from './hooks/setup/useVisTableSetup'
import { OperationHandler } from './hooks/useOperationHandler'
import { CellSelectedWithSourceOperation } from './types/operationTypes'
import { useCellNotification } from './utils/notification'

/**
 * 内部VisTable组件实现
 */
const VisTableComponent = ({
  sheetId,
  onOperation,
  onCellSelectedWithSource,
  tableId,
  onDataImported,
}: {
  sheetId: number
  tableId: string
  onOperation?: OperationHandler
  onCellSelectedWithSource?: (cell?: CellSelectedWithSourceOperation['payload']) => void
  onDataImported: () => void
}) => {
  const elementRef = useRef<HTMLDivElement>(null)
  // 使用初始化hook，传入onOperation回调
  // elementRef.current 将始终有效，因为下面的div会始终渲染
  const { rowLength } = useVisTableSetup(elementRef, sheetId, onOperation, onCellSelectedWithSource)
  console.log('🚀 ~ rowLength:', rowLength)

  return (
    <>
      {/* Toolbar conditionally rendered based on rowLength */}
      {rowLength && rowLength > 0 ? <Toolbar sheetId={sheetId} tableId={tableId} /> : null}
      {/* This div is always rendered to ensure elementRef is populated */}
      {/* Its visibility is controlled by the display style based on rowLength */}
      <div
        key={`VisTableInstance-${sheetId}`}
        style={{
          width: '100%',
          height: 'calc(100vh - 164px)', // Applied when table is visible
          display: rowLength ? 'block' : 'none', // Hide if no rows, Welcome will be shown instead
        }}
        ref={elementRef}
        className="vis-table-container"
        data-id="super-excel"
      />
      {rowLength && rowLength > 0 ? (
        // "Add row" button, conditionally rendered based on rowLength
        <div
          style={{
            height: 30,
            backgroundColor: '#fff',
            border: '2px solid #e9e9e9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            boxSizing: 'border-box',
            cursor: 'pointer',
          }}
          onClick={() => {
            // addRecord()
          }}
        >
          添加一行至末尾
        </div>
      ) : null}
      {rowLength === 0 ? <Welcome sheetId={sheetId} tableId={tableId} onDataImported={onDataImported} /> : null}
      {rowLength && rowLength < 0 ? <Result status="404" /> : null}
    </>
  )
}

/**
 * 可视化表格组件
 * 提供了一个容器和上下文，用于渲染和操作可视化内容
 */
export const VisTable: React.FC<{
  sheetId: number
  tableId: string
  onOperation?: OperationHandler
  onDataImported: () => void
}> = ({ sheetId, onOperation, tableId, onDataImported }) => {
  // TODO 测试用
  const { visTableRef } = useVisTableContext()
  // 使用SmartFill上下文
  const { isModalOpen, selectedColumnId, closeSmartFillModal } = useSmartFill()

  const { contextHolder, openCellNotification } = useCellNotification()

  useEffect(() => {
    console.log('recordsCount', visTableRef?.current?.recordsCount)
  }, [visTableRef?.current])
  const handleCellSeleted = (cell?: CellSelectedWithSourceOperation['payload']) => {
    console.log('🚀 ~ handleCellSeleted ~ cell:', cell)
    openCellNotification(cell)
  }

  // 获取当前表格的所有列
  const getColumns = () => {
    if (!visTableRef.current) return [] as ExtendedColumnDefine[]

    const _columns = visTableRef.current.columns.filter((col) => col.field !== '操作')

    return _columns.map((col) => ({
      field: col.field,
      title: col.title,
      width: 100, // 默认宽度
      headerIcon: col.headerIcon,
    })) as ExtendedColumnDefine[]
  }

  // 包装Context Provider，确保上下文可用
  return (
    <>
      <VisTableComponent
        sheetId={sheetId}
        tableId={tableId}
        key={`VisTableComponent-${sheetId}`}
        onOperation={onOperation}
        onCellSelectedWithSource={handleCellSeleted}
        onDataImported={onDataImported}
      />
      {contextHolder}
      <GenerateAIColumn
        open={isModalOpen}
        onCancel={closeSmartFillModal}
        onOk={() => console.log('ok')}
        width={1000}
        mentionsOptions={getColumns().map((col) => ({
          value: col.title,
          label: col.title,
          field: col.field,
        }))}
        initParams={{
          aiModel: AiModelEnum.ALICE,
          enableLinkTool: false,
          enableWindBrowser: true,
          enableWindDPU: true,
          columnId: selectedColumnId,
          // runType:  RunTypeEnum.RUN_TOP_10
        }}
        columns={getColumns().map((col) => ({
          label: col.title,
          key: col.field,
          value: col.title,
        }))}
      />
    </>
  )
}

// 导出操作类型和操作处理相关内容
export type { OperationHandler } from './hooks/useOperationHandler'
export { OperationType } from './utils/OperationTypes'

// // 导出hook以便在其他组件中使用
// export { useVisTableContext } from './context/VisTableContext'
// export const useVisTable = useVisTableInitialization
