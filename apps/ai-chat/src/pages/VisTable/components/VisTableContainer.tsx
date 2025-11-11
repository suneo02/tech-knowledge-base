import { TableAITaskProvider } from '@/components/ETable/context/TableAITaskContext'
import { VisTable } from '@/components/VisTable'
import { SmartFillProvider } from '@/components/VisTable/context/SmartFillContext'
import { VisTableContextProvider } from '@/components/VisTable/context/VisTableContext'
import { VisTableOperationProvider } from '@/components/VisTable/context/VisTableOperationContext'
import { forwardRef, useImperativeHandle, useRef } from 'react'

// 定义刷新参数接口
export interface ContainerRefreshParams {
  sheets?: number[]
}

// 表格容器组件
export const VisTableContainer = forwardRef<
  { refresh: (params?: ContainerRefreshParams) => void },
  {
    tableId: string
    sheetId: number
    onDataImported: () => void
    onPageRefresh?: (params?: ContainerRefreshParams) => void
  }
>(({ tableId, sheetId, onDataImported, onPageRefresh }, ref) => {
  // 存储主页面传递下来的刷新方法
  const pageRefreshRef = useRef<((params?: ContainerRefreshParams) => void) | null>(null)

  // 将主页面的刷新方法保存到ref中
  pageRefreshRef.current = onPageRefresh || null

  // 内部的刷新引用（用于VisTable内部的刷新）
  const internalRefreshRef = useRef<{
    refresh: (params?: ContainerRefreshParams) => void
  }>({
    refresh: (params?: ContainerRefreshParams) => {
      // console.log('Internal refresh method not implemented yet, refreshing with params:', params)
    },
  })

  // 暴露给主页面的刷新方法
  useImperativeHandle(ref, () => ({
    refresh: (params) => {
      // console.log('Container refresh called with params:', params)
      // 这里调用主页面传递下来的刷新方法
      if (pageRefreshRef.current) {
        pageRefreshRef.current(params)
      } else {
        // 降级到内部刷新
        if (internalRefreshRef.current) {
          internalRefreshRef.current.refresh(params)
        }
      }
    },
  }))

  // 实现内部刷新方法（用于VisTable内部的刷新）
  const onInternalRefresh = (params?: ContainerRefreshParams) => {
    // console.log('🚀 ~ VisTableContainer onInternalRefresh ~ params:', params)
    // 这个是给VisTable内部使用的刷新方法
  }

  // 创建页面刷新方法，这个方法会被传递给 VisTable 组件
  const handlePageRefresh = (params?: ContainerRefreshParams) => {
    // console.log('🚀 ~ VisTableContainer handlePageRefresh ~ params:', params)
    // 直接调用主页面传递下来的刷新方法
    if (onPageRefresh) {
      onPageRefresh(params)
    }
  }

  return (
    <SmartFillProvider>
      <VisTableContextProvider sheetId={sheetId} onRefresh={onInternalRefresh}>
        <VisTableOperationProvider sheetId={sheetId}>
          <TableAITaskProvider sheetId={sheetId}>
            <VisTable
              sheetId={sheetId}
              tableId={tableId}
              onDataImported={onDataImported}
              onPageRefresh={handlePageRefresh}
            />
          </TableAITaskProvider>
        </VisTableOperationProvider>
      </VisTableContextProvider>
    </SmartFillProvider>
  )
})

VisTableContainer.displayName = 'VisTableContainer'
