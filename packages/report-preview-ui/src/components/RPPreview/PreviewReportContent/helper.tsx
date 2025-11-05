import { ApiResponseForWFC } from 'gel-api'
import { TCorpDetailNodeKey } from 'gel-types'
import { useCallback, useRef, useState } from 'react'
import { processReportNodeDataTranslation } from 'report-util/misc'
import { PreviewReportContentRef } from './type'

export type NodeDataStoreReturn = {
  nodeDataStore: Partial<Record<TCorpDetailNodeKey, any>>
  updateData: (data: any, key: TCorpDetailNodeKey, response: ApiResponseForWFC<any>) => void
  nodeDataOverallStore: Partial<Record<TCorpDetailNodeKey, ApiResponseForWFC<any>>>
}

export const useNodeDataStore = (apiTranslate: (data: any) => Promise<any>, isEn: boolean): NodeDataStoreReturn => {
  const [nodeDataStore, setNodeDataStore] = useState<Partial<Record<TCorpDetailNodeKey, any>>>({})
  const [nodeDataOverallStore, setNodeDataOverallStore] = useState<NodeDataStoreReturn['nodeDataOverallStore']>({})
  const updateData = useCallback<NodeDataStoreReturn['updateData']>(
    async (data, key, response) => {
      setNodeDataStore((prev) => ({ ...prev, [key]: data }))
      setNodeDataOverallStore((prev) => ({ ...prev, [key]: response }))
      if (isEn) {
        try {
          const translatedData = await apiTranslate(data)
          const translatedDataProcessed = processReportNodeDataTranslation(data, translatedData, key)
          setNodeDataStore((prev) => ({ ...prev, [key]: translatedDataProcessed }))
          setNodeDataOverallStore((prev) => ({
            ...prev,
            [key]: {
              ...response,
              Data: translatedDataProcessed,
            },
          }))
        } catch (e) {
          console.error(e)
        }
      }
    },
    [apiTranslate]
  )
  return { nodeDataStore, updateData, nodeDataOverallStore }
}

export const usePreviewReportContent = () => {
  const ref = useRef<PreviewReportContentRef>(null)

  // 用于开发环境下的警告提示
  const warning = useRef(false)

  const warnIfNotReady = () => {
    if (!warning.current) {
      warning.current = true
      console.warn('PreviewReportContent is not ready. ' + 'Please ensure it is rendered with valid props.')
    }
  }

  return {
    getCurrent: () => ref,
    scrollToItem: (id: string) => {
      if (!ref.current) {
        warnIfNotReady()
        return
      }
      ref.current.scrollToItem(id)
    },
  }
}
