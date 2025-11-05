import MarkdownIt from 'markdown-it'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import { useEmbedMode } from '@/context/EmbedMode'
import { copyTextAndMessage } from '@/util'
import { Modal, Popover } from '@wind/wind-ui'
import { AxiosInstance } from 'axios'
import { QueryReferenceSuggest, RefTableData } from 'gel-api'
import { RefTable } from '../ChatRoles/components/suggestion/RefTable/tableComp'
import { processNerLinks, processSourceMarkers } from './handle'
import './index.less'
import { PopoverContent } from './PopoverContent'
import { handleJumpTerminalCompatible, generateUrlByModule, LinkModule } from 'gel-util/link'
export * from './handle'
export * from './mdInstance'
interface MarkdownProps {
  isDev: boolean
  wsid: string
  entWebAxiosInstance: AxiosInstance
  content: string
  className?: string
  md: MarkdownIt
  /** 溯源用 */
  refTable?: RefTableData[]
  refBase?: QueryReferenceSuggest[]
}

interface SourceMarkerInfo {
  sourceId: string
  positions: Array<{ start: string; end: string }>
  rect?: DOMRect | null
  tableData?: RefTableData
  refData?: QueryReferenceSuggest
}

export const Markdown: React.FC<MarkdownProps> = ({
  isDev,
  content,
  className,
  refTable,
  refBase,
  md,
  wsid,
  entWebAxiosInstance,
}) => {
  const { isEmbedMode } = useEmbedMode()
  const containerRef = useRef<HTMLDivElement>(null)

  const nerLinks = processNerLinks(content, isDev) // 实体识别
  // 渲染Markdown内容
  const renderedHtml = md.render(nerLinks)
  // 然后处理溯源标记
  const html = processSourceMarkers(renderedHtml)

  // 跟踪当前激活的溯源标记
  const [activeMarker, setActiveMarker] = useState<SourceMarkerInfo | null>(null)
  console.log('🚀 ~ activeMarker:', activeMarker)

  // 处理source-marker点击的函数
  const handleSourceMarkerClick = useCallback((target: HTMLElement) => {
    try {
      const sourceId = target.getAttribute('data-source-id')
      const positionsStr = target.getAttribute('data-positions')

      if (!sourceId || !positionsStr) return

      const positions = JSON.parse(positionsStr) as Array<{ start: string; end: string }>

      if (refTable && Number(sourceId) < refTable.length) {
        const ref = refTable[Number(sourceId)] || {}
        return setActiveMarker({
          sourceId,
          positions,
          tableData: ref,
        })
      } else if (refBase && Number(sourceId) >= (refTable?.length || 0)) {
        const ref = refBase[Number(sourceId) - (refTable?.length || 0)] || {}
        return setActiveMarker({
          sourceId,
          positions,
          refData: ref,
          rect: target.getBoundingClientRect(),
        })
      }
    } catch (error) {
      console.error('处理溯源标记点击时出错:', error)
    }
  }, [])

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const linkEl = target.tagName === 'A' ? target : target.closest('a')

      if (target.matches('button.copy')) {
        const code = decodeURIComponent(target.getAttribute('data-code') || '')
        copyTextAndMessage(code, {
          onSuccess: () => {
            target.textContent = '已复制'
            setTimeout(() => {
              target.textContent = '复制'
            }, 2000)
          },
        })
      } else if (target.matches('.source-marker')) {
        // 处理溯源标记点击
        handleSourceMarkerClick(target)
      }
      // const sourceId = linkEl?.getAttribute('data-source-id')
      // const positionsStr = linkEl?.getAttribute('data-positions')
      //  iframe嵌入模式处理链接点击
      if (isEmbedMode && linkEl) {
        e.preventDefault()
        const href = linkEl?.getAttribute('href')
        const companyCode = linkEl?.getAttribute('data-companycode')
        if (companyCode) {
          const url = generateUrlByModule({
            module: LinkModule.COMPANY_DETAIL,
            params: {
              companycode: companyCode,
            },
            isDev: isDev,
          })
          if (url) {
            handleJumpTerminalCompatible(url, false)
          }
        }
        return
      }
    },
    [handleSourceMarkerClick, isEmbedMode]
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('click', handleClick)
    return () => container.removeEventListener('click', handleClick)
  }, [handleClick])

  const width = 500

  // 创建一个独立的Portal元素，用于渲染Popover
  // 使用Portal可以避免定位问题
  const renderPopover = () => {
    if (!activeMarker || !activeMarker.rect || !activeMarker.refData) return null

    const { positions, refData, rect } = activeMarker

    const { top, left, bottom } = rect || {}

    // 计算最佳位置
    // 如果元素距离顶部太近，就将弹窗显示在下方
    const isCloseToTop = top < 180 // 留些空间给弹窗
    const placement = isCloseToTop ? 'bottom' : 'top'

    // 根据placement计算top位置
    const topPosition = isCloseToTop
      ? bottom + 10 // 在元素下方
      : top - 10 // 在元素上方

    // 检查右侧边界
    const windowWidth = window.innerWidth
    let leftPosition = left + width / 2

    // 确保弹窗不会超出右侧边界，留10px的安全距离
    if (leftPosition + width / 2 > windowWidth - 10) {
      leftPosition = windowWidth - width / 2 - 10
    }

    return ReactDOM.createPortal(
      <div
        className="source-popover-container"
        style={{
          position: 'fixed',
          left: leftPosition, // 使用计算后的左侧位置
          top: topPosition,
          zIndex: 1500,
        }}
      >
        <Popover
          content={
            <PopoverContent
              refData={refData}
              positions={positions}
              isDev={isDev}
              wsid={wsid}
              entWebAxiosInstance={entWebAxiosInstance}
            />
          }
          trigger="click"
          overlayClassName="source-popover-overlay"
          overlayStyle={{
            width: `100%`,
            maxWidth: `500px`,
            minWidth: `328px`,
          }}
          placement={placement}
          visible={true}
          onVisibleChange={(visible) => {
            if (!visible) setActiveMarker(null)
          }}
        >
          <div style={{ width: '1px', height: '1px' }} />
        </Popover>
      </div>,
      document.body
    )
  }

  return (
    <>
      <div
        ref={containerRef}
        className={`markdown-content ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
      {renderPopover()}
      {/* @ts-expect-error Modal组件类型声明与实际使用方式不一致，但功能正常 */}
      <Modal
        title={activeMarker?.tableData?.rawSentence || ''}
        visible={!!activeMarker?.tableData}
        onCancel={() => setActiveMarker(null)}
        footer={null}
        width={'70%'}
        style={{ minWidth: 900, maxWidth: 1920 }}
        destroyOnClose
      >
        <RefTable data={activeMarker?.tableData as RefTableData} />
      </Modal>
    </>
  )
}
