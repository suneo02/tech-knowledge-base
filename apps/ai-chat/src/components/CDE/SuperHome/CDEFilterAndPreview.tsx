import { CDEFilterCfgProvider, CDEMeasureDefaultForSL, MeasuresProvider } from 'cde'
import React from 'react'
import { CDEFilterPreviewModal } from '../component/FilterPreviewModal'
import { CDEFilterPreviewModalProps } from '../component/type'

/**
 * @deprecated 已弃用，请使用 useCDEModal 方法替代
 * 首页使用，需要单独包裹 CDEFilterCfgProvider 和 MeasuresProvider
 * @param props
 * */
export const CDEFilterPreviewModalIndependent: React.FC<CDEFilterPreviewModalProps> = (props) => {
  return (
    <CDEFilterCfgProvider>
      <MeasuresProvider measuresDefault={CDEMeasureDefaultForSL}>
        <CDEFilterPreviewModal {...props} />
      </MeasuresProvider>
    </CDEFilterCfgProvider>
  )
}
