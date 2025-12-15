// @ts-expect-error
import { ExtendedColumnDefine } from '@/components/MultiTable/utils/columnsUtils'
import { Result } from '@wind/wind-ui'
import TableLoading from '@/components/common/TableLoading'
import { AiModelEnum } from 'gel-api'
import React, { useRef } from 'react'
import GenerateAIColumn from './components/Modal/GenerateAIColumn'
// import Welcome from './components/welcome'
import { useSmartFill } from './context/SmartFillContext'
import { useVisTableContext } from './context/VisTableContext'
import { useVisTableSetup } from './hooks/setup/useVisTableSetup'
import { OperationHandler } from './hooks/useOperationHandler'
import { CellSelectedWithSourceOperation } from './types/operationTypes'
import { useCellNotification } from './utils/notification'
import VisTableTemplate from '@/pages/ProgressGuardDemo/Right/Template'

// 定义刷新参数接口
interface PageRefreshParams {
  sheets?: number[]
}

/**
 * 内部VisTable组件实现
 */
const VisTableComponent = ({
  sheetId,
  onOperation,
  onCellSelectedWithSource,
  tableId,
  onDataImported,
  onPageRefresh,
}: {
  sheetId: number
  tableId: string
  onOperation?: OperationHandler
  onCellSelectedWithSource?: (cell?: CellSelectedWithSourceOperation['payload']) => void
  onDataImported: () => void
  onPageRefresh?: (params?: PageRefreshParams) => void
}) => {
  // console.log('🚀 ~ VisTableComponent onPageRefresh:', onPageRefresh)
  const elementRef = useRef<HTMLDivElement>(null)
  // 使用初始化hook，传入onOperation回调
  // elementRef.current 将始终有效，因为下面的div会始终渲染
  const { rowLength, loading } = useVisTableSetup(elementRef, sheetId, onOperation, onCellSelectedWithSource)
  // console.log('🚀 ~ rowLength:', rowLength)

  return (
    <>
      {loading ? (
        <TableLoading loadingText="正在加载智能表格..." style={{ width: '100%', height: 'calc(100vh - 92px)' }} />
      ) : null}
      <div
        key={`VisTableInstance-${sheetId}`}
        style={{
          width: '100%',
          height: loading ? '0%' : 'calc(100vh - 132px)',
          display: rowLength ? 'block' : 'none',
        }}
        ref={elementRef}
        className="vis-table-container"
        data-id="super-excel"
      ></div>

      {rowLength === 0 ? <VisTableTemplate /> : null}
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
  onPageRefresh?: (params?: PageRefreshParams) => void
}> = ({ sheetId, onOperation, tableId, onDataImported, onPageRefresh }) => {
  // TODO 测试用
  const { visTableRef } = useVisTableContext()
  // 使用SmartFill上下文
  const { isModalOpen, selectedColumnId, closeSmartFillModal } = useSmartFill()

  const { contextHolder, openCellNotification } = useCellNotification()
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
        onPageRefresh={onPageRefresh}
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
