import { Button, Layout, message } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import classNames from 'classnames'
import { requestToWFCWithAxios } from 'gel-api'
import { CorpBasicInfo } from 'gel-types'
import { CorpPresearch } from 'gel-ui'
import { getLang, isEn, t } from 'gel-util/intl'
import React, { useState } from 'react'
import { getCorpName } from 'report-util/misc'
import { encodeHiddenNodes } from 'report-util/url'
import { handleDownloadReport } from '../../../api'
import { useRPPreviewCtx } from '../../../context/RPPreview'
import { ZoomBar } from '../../ZoomBar'
import styles from './index.module.less'

const { Operator } = Layout

export interface PreviewReportRightTopProps {
  className?: string
  corpBaseInfo: CorpBasicInfo | undefined
  onZoomChange?: (zoomPercent: number) => void
  initialZoom?: number
}

export const PreviewReportRightTop: React.FC<PreviewReportRightTopProps> = ({
  corpBaseInfo,
  onZoomChange,
  initialZoom = 100,
  className,
}) => {
  const { run: downloadReport, loading } = useRequest(requestToWFCWithAxios, {
    manual: true,
    onSuccess: handleDownloadReport,
    onError: (error) => {
      console.error(error)
      message.error(t('204684', '导出出错'))
    },
  })
  const handleDownload = () => {
    downloadReport(
      axiosInstance,
      'download/createtask/dueDiligenceReport',
      {
        pattern: encodeHiddenNodes(hiddenNodeIds),
        lang: getLang(),
      },
      {
        appendUrl: corpBaseInfo?.corp_id ?? '',
      }
    )
  }
  const { hiddenNodeIds, axiosInstance, onCorpSwitch } = useRPPreviewCtx()
  const [isSearchMode, setIsSearchMode] = useState(false)

  return (
    // @ts-expect-error wind-ui 的类型定义有问题
    <Operator className={classNames(styles['preview-report-right-top'], className)}>
      <div className={styles['search-container']}>
        <div className={styles['content-container']}>
          {isSearchMode ? (
            <CorpPresearch
              axiosInstance={axiosInstance}
              placeholder="输入公司名称搜索"
              initialValue={getCorpName(corpBaseInfo, isEn())}
              onChange={(corpId) => {
                onCorpSwitch(corpId)
                setIsSearchMode(false)
              }}
            />
          ) : (
            <div className={styles['corp-name-display']}>{getCorpName(corpBaseInfo, isEn())}</div>
          )}
        </div>
        <div className={styles['button-container']}>
          {isSearchMode ? (
            <Button onClick={() => setIsSearchMode(false)}>{t('19405', '取消')}</Button>
          ) : (
            <Button type="primary" onClick={() => setIsSearchMode(true)}>
              {t('425514', '切换')}
            </Button>
          )}
        </div>
        <div className={styles['button-container']}>
          <Button type="primary" loading={loading} onClick={handleDownload}>
            {t('90846', '下载')}
          </Button>
        </div>
      </div>
      <div className={styles['zoom-bar-container']}>
        <ZoomBar initialZoom={initialZoom} onChange={onZoomChange} />
      </div>
    </Operator>
  )
}

export default PreviewReportRightTop
