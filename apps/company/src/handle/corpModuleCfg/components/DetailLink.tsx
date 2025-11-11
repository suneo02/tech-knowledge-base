import { wftCommon } from '@/utils/utils.tsx'
import React, { FC } from 'react'

export const DetailLink: FC<{
  url: string
  txt: string
  openFunc?: (url: string) => void
  style?: React.CSSProperties
}> = ({ url, txt, openFunc, style }) => {
  if (!url) return <span>{txt || '--'}</span>
  return (
    <a
      style={style}
      onClick={() => {
        if (openFunc) {
          openFunc(url)
        } else {
          if (wftCommon.isDevDebugger()) {
            return window.open(url)
          }
          wftCommon.jumpJqueryPage(url)
        }
      }}
      data-uc-id="xihx-2EyB"
      data-uc-ct="a"
    >
      {txt || '--'}
    </a>
  )
}
