import { useMemo } from 'react'
import { isNil } from 'lodash'

export const titleDefault = '--'

export const useLinkTitle = (titleProp, { module, type }) => {
  return useMemo(() => {
    if (!isNil(titleProp) && titleProp !== '') {
      return titleProp
    }
    return titleDefault
  }, [titleProp, module, type])
}
