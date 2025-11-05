import { TOnCascadeMultipleChange } from '@/components/cascade/type'
import { isString } from 'lodash'
import { useCallback } from 'react'

export const useFilterAllCascadeChange = (onChange: TOnCascadeMultipleChange) => {
  return useCallback<TOnCascadeMultipleChange>(
    (value, options) => {
      try {
        if (options.length !== 0) {
          const current = options[value.length - 1][0]
          if (isString(current)) {
            if (['0000', '全国|0000', '全部|0000', 'National|0000', 'All|0000'].includes(current)) {
              // 点击全国，取消其他选中
              value.splice(0, value.length, [current])
            } else {
              if (isString(value[0][0])) {
                // 点击其他，取消全国选中
                if (value[0][0].split('|')[1] === '0000' || value[0][0] === '0000') value.splice(0, 1)
              }
            }
          }
        }
      } catch (e) {
        console.error(e)
      }
      onChange(value, options)
    },
    [onChange]
  )
}
