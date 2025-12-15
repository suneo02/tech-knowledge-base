import { FilterListRef } from '@/FilterList'
import { MutableRefObject, useRef } from 'react'

export interface CDEFilterCatalogWithMenuSubRef extends Pick<FilterListRef, 'resetFilters'> {}

export interface CDEFilterCatalogWithMenuSubInstance extends CDEFilterCatalogWithMenuSubRef {
  getCurrent: () => MutableRefObject<CDEFilterCatalogWithMenuSubRef | null>
}
export const useCDEFilterCatalogWithMenuSub = () => {
  const ref = useRef<CDEFilterCatalogWithMenuSubRef>(null)

  // 用于开发环境下的警告提示
  const warning = useRef(false)

  const warnIfNotReady = () => {
    if (process.env.NODE_ENV !== 'production' && !warning.current) {
      warning.current = true
      console.warn('CDEFilterPanel is not ready. ' + 'Please ensure it is rendered with valid props.')
    }
  }

  const instance = useRef<CDEFilterCatalogWithMenuSubInstance>({
    getCurrent: () => ref,
    resetFilters: () => {
      if (!ref.current) {
        warnIfNotReady()
        return
      }
      ref.current.resetFilters()
    },
  })

  return instance.current
}
