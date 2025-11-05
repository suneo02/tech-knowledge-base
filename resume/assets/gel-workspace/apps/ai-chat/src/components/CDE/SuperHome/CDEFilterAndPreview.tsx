import { CDEFilterCfgProvider, CDEMeasureDefaultForSL, MeasuresProvider } from 'cde'
import React from 'react'
import { CDEFilterPreviewModal } from '../component/FilterPreviewModal'
import { CDEFilterPreviewModalProps } from '../component/type'

/**
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
