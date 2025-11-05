import { Spin } from '@wind/wind-ui'
import { isEn } from 'gel-util/intl'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { getCreditRPAppendix, getCreditRPComment, getRPCommonLocale } from 'report-util/constants'
import { tableSectionsHelper } from 'report-util/corpConfigJson'
import { useRPPreviewCtx } from '../../../context/RPPreview'
import { usePreviewReportContentCtx } from '../../../context/RPPreviewContent'
import { tForRPPreview, useTrackTopElementInViewport } from '../../../utils'
import { PDFCover } from '../../PDFCover'
import { RPAppendix } from '../../RPAppendix'
import { RPComment } from '../../RPComment'
import { PreviewRenderOrderItem } from './item'
import styles from './styles.module.less'
import { PreviewReportContentReactProps, PreviewReportContentRef } from './type'
/**
 * PreviewReportContent component - Handles the right content panel of the report preview
 * Contains the cover and table sections
 */

export const PreviewReportContent = forwardRef<PreviewReportContentRef, PreviewReportContentReactProps>(
  ({ scale = 1 }, ref) => {
    const contentWrapperRef = useRef<HTMLDivElement>(null)
    const elementRef = useRef<HTMLDivElement>(null)

    const { corpOtherInfo, reportConfig, ifAllFetched, corpName, reportTitle } = useRPPreviewCtx()

    // Handle scale changes
    useEffect(() => {
      if (contentWrapperRef.current) {
        contentWrapperRef.current.style.transformOrigin = 'center top'
        contentWrapperRef.current.style.transform = `scale(${scale})`
      }
    }, [scale])

    const [currentTopItemId, setCurrentTopItemId] = useState<string | null>(null)

    // Use context for report config and hidden nodes
    const { renderOrder } = usePreviewReportContentCtx()

    // Refs for DOM elements
    const containerRef = useRef<HTMLDivElement>(null)
    const renderedItemsRef = useRef<{ [id: string]: HTMLDivElement | null }>({})

    // Handle scroll tracking
    useTrackTopElementInViewport(
      containerRef,
      renderedItemsRef.current,
      currentTopItemId,
      (newTopId) => {
        if (currentTopItemId !== newTopId) {
          setCurrentTopItemId(newTopId)
        }
      },
      100
    )

    // Scroll to specific preview item by id
    const scrollToItem = (id: string) => {
      // 优先查找sectionId
      const sectionId = tableSectionsHelper.generateSectionId(id)
      const sectionEl = renderedItemsRef.current[sectionId]
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      // 如果sectionId不存在，则查找tableId
      const el = renderedItemsRef.current[id]
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    useImperativeHandle(ref, () => ({
      scrollToItem,
    }))

    const renderCover = () => {
      const { reportDate = '' } = getRPCommonLocale(tForRPPreview, isEn())
      return (
        <div className={styles['pdf-page-preview-container']}>
          <PDFCover companyName={corpName} reportTitle={reportTitle} reportDate={reportDate} />
        </div>
      )
    }

    const renderRPComment = () => {
      const reportComment = getCreditRPComment(reportConfig, tForRPPreview, isEn())
      return (
        <div className={styles['pdf-page-preview-container']}>
          <RPComment content={reportComment} />
        </div>
      )
    }

    const renderRPAppendix = () => {
      const reportAppendix = getCreditRPAppendix(corpOtherInfo?.isObjection, tForRPPreview, isEn())
      return (
        <div className={styles['pdf-page-preview-container']}>
          <RPAppendix content={reportAppendix} />
        </div>
      )
    }

    if (!ifAllFetched) {
      return (
        <div className={styles['preview-report-content']}>
          <Spin />
        </div>
      )
    }

    return (
      <div ref={elementRef} className={styles['preview-report-content']}>
        <div ref={contentWrapperRef} className={styles['content-wrapper']}>
          {renderCover()}
          {renderRPComment()}
          <div ref={containerRef} className={styles['table-sections-container']}>
            {renderOrder.map((item) => (
              <PreviewRenderOrderItem key={item.id} item={item} renderedItemsRef={renderedItemsRef} />
            ))}
          </div>
          {renderRPAppendix()}
        </div>
      </div>
    )
  }
)

PreviewReportContent.displayName = 'PreviewReportContent'
