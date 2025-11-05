import { VisTable } from '@/components/VisTable'
import { SmartFillProvider } from '@/components/VisTable/context/SmartFillContext'
import { VisTableContextProvider } from '@/components/VisTable/context/VisTableContext'
import { VisTableOperationProvider } from '@/components/VisTable/context/VisTableOperationContext'
import { TableAITaskProvider } from '@/components/MultiTable/context'
import { forwardRef, useImperativeHandle, useRef } from 'react'

// 定义刷新参数接口
export interface ContainerRefreshParams {
  sheets?: number[]
}

// 表格内容组件
const VisTableContent: React.FC<{
  sheetId: number
  tableId: string
  onDataImported: () => void
}> = ({ sheetId, tableId, onDataImported }) => {
  return <VisTable sheetId={sheetId} tableId={tableId} onDataImported={onDataImported} />
}

// 表格容器组件
export const VisTableContainer = forwardRef<
  { refresh: (params?: ContainerRefreshParams) => void },
  { tableId: string; sheetId: number; onDataImported: () => void }
>(({ tableId, sheetId, onDataImported }, ref) => {
  const refreshRef = useRef<{
    refresh: (params?: ContainerRefreshParams) => void
  }>({
    refresh: (params?: ContainerRefreshParams) => {
      console.log('Container refreshing with params:', params)
    },
  })

  useImperativeHandle(ref, () => ({
    refresh: (params) => {
      console.log('Container refresh called with params:', params)
      if (refreshRef.current) {
        refreshRef.current.refresh(params)
      }
    },
  }))

  // 实现刷新方法
  const onRefresh = (params?: ContainerRefreshParams) => {
    console.log('🚀 ~ VisTableContainer onRefresh ~ params:', params)
    // 在组件挂载时，会收到此回调
    // 将真正的refresh方法赋值给refreshRef.current，以便父组件调用
    // refreshRef.current.refresh = actualRefreshFunctionFromVisTableContext; // 这只是一个示例，实际实现可能不同
  }

  return (
    <SmartFillProvider>
      <VisTableContextProvider sheetId={sheetId} onRefresh={onRefresh}>
        <VisTableOperationProvider sheetId={sheetId}>
          <TableAITaskProvider sheetId={sheetId}>
            <VisTableContent
              key={`content-${sheetId}`}
              sheetId={sheetId}
              tableId={tableId}
              onDataImported={onDataImported}
            />
          </TableAITaskProvider>
        </VisTableOperationProvider>
      </VisTableContextProvider>
    </SmartFillProvider>
  )
})

VisTableContainer.displayName = 'VisTableContainer'
