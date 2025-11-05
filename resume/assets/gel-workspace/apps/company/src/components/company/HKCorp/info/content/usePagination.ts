import { useState, useCallback, useMemo } from 'react'

export interface PaginationState {
  pageSize: number
  current: number
  pageNo: number
  total?: number
  showSizeChanger: boolean
  showQuickJumper: boolean
}

interface UsePaginationProps {
  initialPageSize?: number
  maxTotal?: number
}

export const usePagination = ({ initialPageSize = 10, maxTotal = 5000 }: UsePaginationProps = {}) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: initialPageSize,
    current: 1,
    pageNo: 0,
    showSizeChanger: false,
    showQuickJumper: true,
  })

  // 处理分页变化
  const handlePageChange = useCallback(({ currentPage, pageSize }) => {
    setPagination((prev) => ({
      ...prev,
      current: currentPage,
      pageNo: currentPage - 1,
      pageSize: pageSize || prev.pageSize,
    }))
  }, [])

  // 处理分页总数更新
  const updateTotal = useCallback(
    (total: number) => {
      setPagination((prev) => ({
        ...prev,
        total: Math.min(total, maxTotal),
      }))
    },
    [maxTotal]
  )

  // 重置分页
  const resetPagination = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
      pageNo: 0,
    }))
  }, [])

  // 处理分页配置
  const handlePagination = useCallback(
    (p: PaginationState) => {
      // 如果 total 为 null/undefined，说明数据还未加载，不显示总数
      if (p.total == null) {
        return { ...p, total: undefined }
      }
      // 有数据时，限制最大展示数量
      return { ...p, total: Math.min(p.total, maxTotal) }
    },
    [maxTotal]
  )

  // 缓存处理后的分页数据
  const paginationHandled = useMemo(
    () => handlePagination(pagination),
    [handlePagination, pagination]
  )

  return {
    pagination: paginationHandled, // 返回缓存的结果
    setPagination,
    handlePageChange,
    updateTotal,
    resetPagination,
  }
}
