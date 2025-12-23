import { RPPreviewCtxProvider, RPPreviewProviderProps } from '@/context/RPPreview'
import { PreviewReportContent } from '@/components/RPPreview/PreviewReportContent'
import { PreviewReportLeft } from '@/components/RPPreview/PreviewReportLeft'
import PreviewReportRightTop from '@/components/RPPreview/PreviewReportRightTop'
import { useRPPreviewCtx } from '@/context/RPPreview'
import { Layout } from '@wind/wind-ui'
import React, { useState } from 'react'
import { PreviewReportContentCtxProvider } from '../../context/RPPreviewContent'
import styles from './preview.module.less'
import { usePreviewReportContent } from './PreviewReportContent/helper'

const { Content } = Layout

const RPInner: React.FC = () => {
  const previewReportContentRef = usePreviewReportContent()
  const { corpBasicInfo } = useRPPreviewCtx()

  const [zoomPercent, setZoomPercent] = useState(1)

  // Handlers
  const handleZoomChange = (percent: number) => {
    setZoomPercent(percent)
  }

  const handleNodeSelected = (nodeId: string | null) => {
    if (nodeId) {
      previewReportContentRef.scrollToItem(nodeId)
    }
  }

  return (
    // @ts-expect-error wind-ui 的类型定义有问题
    <Layout className={styles['rp-preview-layout']}>
      <PreviewReportLeft onNodeSelected={handleNodeSelected} />
      {/* @ts-expect-error wind-ui 的类型定义有问题 */}
      <Layout className={styles['right-panel']}>
        <PreviewReportRightTop
          className={styles['right-top']}
          corpBaseInfo={corpBasicInfo}
          onZoomChange={handleZoomChange}
        />
        {/* @ts-expect-error wind-ui 的类型定义有问题 */}
        <Content className={styles['right-content-panel']}>
          <PreviewReportContentCtxProvider>
            <PreviewReportContent ref={previewReportContentRef.getCurrent()} scale={zoomPercent} />
          </PreviewReportContentCtxProvider>
        </Content>
      </Layout>
    </Layout>
  )
}

export const RPPreviewComp: React.FC<RPPreviewProviderProps> = (props) => {
  return (
    <RPPreviewCtxProvider {...props}>
      <RPInner />
    </RPPreviewCtxProvider>
  )
}

const RPPrintInner: React.FC = () => {
  const previewReportContentRef = usePreviewReportContent()

  return (
    <PreviewReportContentCtxProvider>
      <PreviewReportContent ref={previewReportContentRef.getCurrent()} />
    </PreviewReportContentCtxProvider>
  )
}
export const RPPrintComp: React.FC<RPPreviewProviderProps> = (props) => {
  return (
    <RPPreviewCtxProvider {...props}>
      <RPPrintInner />
    </RPPreviewCtxProvider>
  )
}
