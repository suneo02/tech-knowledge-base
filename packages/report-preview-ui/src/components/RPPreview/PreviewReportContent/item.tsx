import { CorpBelongIndustry } from '@/components/RPNodeSpecial/Industry'
import { RPSection } from '@/components/RPSection'
import { ConfigTable } from '@/components/table'
import classNames from 'classnames'
import { ReportDetailCustomNodeJson, ReportDetailTableJson, TCorpDetailNodeKey } from 'gel-types'
import { ErrorBoundary } from 'gel-ui'
import { isEn } from 'gel-util/intl'
import { FC, MutableRefObject } from 'react'
import { getReportNodeSuffixComment, ReportRenderItem } from 'report-util/corpConfigJson'
import { getReportNodeSuffixDataComment } from 'report-util/table'
import { useRPPreviewCtx } from '../../../context/RPPreview'
import { usePreviewReportContentCtx } from '../../../context/RPPreviewContent'
import { tForRPPreview } from '../../../utils'
import { TableComment } from '../../TableComment'
import styles from './styles.module.less'

// New: RenderOrderItem component
export const PreviewRenderOrderItem: FC<{
  item: ReportRenderItem
  renderedItemsRef: MutableRefObject<{ [id: string]: HTMLDivElement | null }>
}> = ({ item, renderedItemsRef }) => {
  const { corpBasicNum, axiosInstance, getWsid, corpCode } = useRPPreviewCtx()

  // Use context for report config and hidden nodes
  const {
    sectionConfigStore,
    tableConfigsStore,
    normalizedHiddenNodes,
    customNodeConfigStore,
    nodeDataStore,
    updateData,
    nodeDataOverallStore,
  } = usePreviewReportContentCtx()

  if (item.type === 'heading') {
    const sectionConfig = sectionConfigStore[item.id]
    if (!sectionConfig) {
      console.error('sectionConfig not found', item.id)
      return null
    }
    return (
      <div
        key={item.id}
        ref={(el) => (renderedItemsRef.current[item.id] = el)}
        className={classNames(styles['preview-item'], {
          'd-none': normalizedHiddenNodes.includes(item.id),
        })}
      >
        <RPSection
          tableKey={item.relevateTableId}
          tableData={item.relevateTableId ? nodeDataStore[item.relevateTableId] : undefined}
          tableConfigsStore={tableConfigsStore}
          {...sectionConfig}
        />
      </div>
    )
  }

  /**
   * 获取节点注释
   * @param item
   * @param config
   * @returns
   */
  const getNodeComment = (
    item: {
      id: TCorpDetailNodeKey
    },
    config: ReportDetailTableJson | ReportDetailCustomNodeJson | undefined
  ) => {
    const dataOverall = nodeDataOverallStore[item.id]
    const dataComment = getReportNodeSuffixDataComment(isEn(), dataOverall, config)
    const suffixComment = getReportNodeSuffixComment(item.id, config, tForRPPreview, isEn())
    return (
      <>
        {suffixComment ? (
          Array.isArray(suffixComment) ? (
            suffixComment.map((item) => <TableComment key={item} content={item} />)
          ) : (
            <TableComment content={suffixComment} />
          )
        ) : null}
        {dataComment ? <TableComment content={dataComment} /> : null}
      </>
    )
  }
  if (item.type === 'table') {
    const tableConfig = tableConfigsStore[item.id]
    if (!tableConfig) {
      console.error('tableConfig not found', item.id)
      return null
    }
    return (
      <ErrorBoundary>
        <div
          key={item.id}
          ref={(el) => (renderedItemsRef.current[item.id] = el)}
          className={classNames(styles['preview-item'], {
            'd-none': normalizedHiddenNodes.includes(item.id),
          })}
        >
          <ConfigTable
            corpBasicNum={corpBasicNum}
            config={tableConfig}
            onDataLoadedSuccess={updateData}
            dataSource={nodeDataStore[item.id]}
            axiosInstance={axiosInstance}
            getWsid={getWsid}
          />
        </div>
        {getNodeComment(item, tableConfig)}
      </ErrorBoundary>
    )
  }

  if (item.type === 'custom' && item.id === 'BelongIndustry') {
    const nodeConfig = customNodeConfigStore[item.id]
    if (!nodeConfig) {
      console.error('tableConfig not found', item.id)
      return null
    }
    return (
      <ErrorBoundary>
        <div
          key={item.id}
          ref={(el) => (renderedItemsRef.current[item.id] = el)}
          className={classNames(styles['preview-item'], {
            'd-none': normalizedHiddenNodes.includes(item.id),
          })}
        >
          <CorpBelongIndustry
            corpCode={corpCode}
            corpBasicNum={corpBasicNum}
            config={nodeConfig}
            onDataLoadedSuccess={(data, key, response) => {
              updateData(data, key, response)
            }}
            dataSource={nodeDataStore[item.id]}
            axiosInstance={axiosInstance}
          />
        </div>
        {getNodeComment(item, nodeConfig)}
      </ErrorBoundary>
    )
  }
  console.error('unknown item type', item)
  return null
}
