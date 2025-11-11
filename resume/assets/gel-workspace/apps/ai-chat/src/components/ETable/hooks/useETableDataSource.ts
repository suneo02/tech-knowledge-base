import * as VTable from '@visactor/vtable'
import { RowData } from 'gel-api'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useETableRecords } from './useGetRecords'
import { QueueStatus, useQueue } from './useQueue'
import { useSheetInfo } from './useSheetInfo'

// 定义队列中任务单元的类型
interface BatchTask {
  batchIndex: number
  rowIds: string[]
}

// 定义队列处理器返回结果的类型
interface BatchResult {
  batchIndex: number
  records: RowData[]
}

const DEFAULT_BATCH_SIZE = 20
const DEFAULT_MAX_CONCURRENCY = 3
const DEFAULT_CELL_INFO: RowData = { rowId: '', id: '' }

/**
 * 核心数据处理 Hook
 * 唯一的职责是：处理所有与数据相关的逻辑，包括获取元数据、设置并发队列、以及配置 VTable 的缓存数据源。
 * @param tabKey - 当前标签页的 Key
 * @param version - 版本号，用于触发数据刷新
 * @returns 返回配置好的 dataSource, columns, rowIds, 以及队列清理函数
 */
export const useETableDataSource = (tabKey: string, version: number) => {
  // console.log('🚀 ~ useETableDataSource ~ version:', tabKey, version)
  const { columns, rowIds, loading } = useSheetInfo(tabKey, version)
  const { getRecords } = useETableRecords()

  const loadedData = useRef<Record<number, Promise<RowData[]>>>({})
  const batchRequestPromises = useRef(
    new Map<number, { resolve: (data: RowData[]) => void; reject: (reason: unknown) => void }>()
  )

  const {
    add: addBatchToQueue,
    results: batchResults,
    clear: clearQueue,
  } = useQueue<BatchTask, BatchResult>({
    processor: async ({ batchIndex, rowIds }, signal) => {
      const records = await getRecords(rowIds, signal)
      return { batchIndex, records }
    },
    maxConcurrency: DEFAULT_MAX_CONCURRENCY,
  })

  const setupDataSource = useCallback(
    (currentrowIds: string[]) => {
      loadedData.current = {}
      batchRequestPromises.current.clear()
      clearQueue()

      return new VTable.data.CachedDataSource({
        get(index) {
          const batchSize = DEFAULT_BATCH_SIZE
          const batchIndex = Math.floor(index / batchSize)
          const batchStartIndex = batchIndex * batchSize

          if (!loadedData.current[batchIndex]) {
            const promise = new Promise<RowData[]>((resolve, reject) => {
              batchRequestPromises.current.set(batchIndex, { resolve, reject })
              const batchRowIds = currentrowIds.slice(batchStartIndex, batchStartIndex + batchSize)
              addBatchToQueue({ batchIndex, rowIds: batchRowIds })
            })
            loadedData.current[batchIndex] = promise
          }
          return loadedData.current[batchIndex].then(
            (batchData) => batchData[index - batchStartIndex] || DEFAULT_CELL_INFO
          )
        },
        length: currentrowIds.length,
      })
    },
    [addBatchToQueue, clearQueue, getRecords, version]
  )

  useEffect(() => {
    if (batchRequestPromises.current.size === 0) return

    for (const [task, result] of batchResults.entries()) {
      const { batchIndex } = task
      const promiseControls = batchRequestPromises.current.get(batchIndex)

      if (promiseControls) {
        if (result.status === QueueStatus.FULFILLED && result.value) {
          promiseControls.resolve(result.value.records)
        } else {
          promiseControls.reject(result.reason)
        }
        batchRequestPromises.current.delete(batchIndex)
      }
    }
  }, [batchResults])

  const dataSource = useMemo(() => {
    if (!rowIds || !rowIds.length) return null
    return setupDataSource(rowIds)
  }, [rowIds])

  return { dataSource, columns, rowIds, clearQueue, loading }
}
