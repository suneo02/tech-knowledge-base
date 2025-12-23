import MarkdownIt from 'markdown-it'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import { useEmbedMode } from '@/context/EmbedMode'
import { copyTextAndMessage } from '@/util'
import { Popover } from '@wind/wind-ui'
import { AxiosInstance } from 'axios'
import { BuryAction, DPUItem, postPointBuriedWithAxios, RAGItem, WithDPUList, WithRAGList } from 'gel-api'
import { ChatDPUTableModal } from 'gel-ui'
import { convertNerLinksToHtml, convertSourceMarkersToHtml, SOURCE_MARKER_CONSTANTS } from 'gel-util/common'
import { EIsSeparate, generateUrlByModule, handleJumpTerminalCompatible, LinkModule } from 'gel-util/link'
import './index.less'
import { PopoverContent } from './PopoverContent'

export { createStockCodeAwareMarkdownRenderer } from './mdInstance'

/** AI 回答 Markdown 渲染器的 Props */
interface AIAnswerMarkdownViewerProps extends Partial<WithDPUList>, Partial<WithRAGList> {
  isDev: boolean
  wsid: string
  entWebAxiosInstance: AxiosInstance
  content: string
  className?: string
  md: MarkdownIt
}

/** 溯源标记信息 */
interface SourceMarkerInfo {
  sourceId: string
  positions: Array<{ start: string; end: string }>
  rect?: DOMRect | null
  tableData?: DPUItem
  refData?: RAGItem
}

/**
 * AI 回答 Markdown 渲染器（支持溯源与实体识别）
 *
 * ## 核心功能
 * 1. Markdown 渲染：将 AI 生成的 Markdown 文本渲染为格式化的 HTML
 * 2. 实体识别链接（NER）：自动将公司名等实体转换为可点击的详情页链接
 * 3. 溯源标记交互：支持点击溯源标记（如【0(10~20)】）查看参考资料来源
 * 4. 参考资料展示：DPU 表格用模态框，文档/新闻/研报用 Popover
 * 5. 代码块复制：内置复制按钮
 * 6. 嵌入模式兼容：支持 iframe 跨域跳转
 *
 * ## 数据处理流程
 * content → NER 转换 → Markdown 渲染 → 溯源标记转换 → 最终 HTML
 *
 * ## 溯源标记索引规则
 * - 索引 0 ~ refTable.length-1：DPU 表格（模态框展示）
 * - 索引 refTable.length ~ 总长度-1：文档/新闻/研报（Popover 展示）
 *
 * ## 事件处理
 * 使用事件委托模式监听容器点击：
 * - button.copy：复制代码
 * - .source-marker：展示参考资料
 * - a[data-companycode]：跳转公司详情页
 *
 * @author 刘兴华 <xhliu.liuxh@wind.com.cn>
 *
 * @example
 * // 基础使用
 * <AIAnswerMarkdownViewer
 *   content="# 标题\n\n腾讯控股(00700.HK)今日上涨"
 *   md={markdownItInstance}
 *   isDev={false}
 *   wsid="workspace-123"
 *   entWebAxiosInstance={axiosInstance}
 * />
 *
 * @example
 * // 带溯源的使用
 * <AIAnswerMarkdownViewer
 *   content="营收100亿【0(10~20)】"
 *   refTable={[{ title: '财务数据表', data: [...] }]}
 *   md={markdownItInstance}
 *   isDev={false}
 *   wsid="workspace-123"
 *   entWebAxiosInstance={axiosInstance}
 * />
 */
export const AIAnswerMarkdownViewer: React.FC<AIAnswerMarkdownViewerProps> = ({
  isDev,
  content,
  className,
  dpuList,
  ragList,
  md,
  wsid,
  entWebAxiosInstance,
}) => {
  const { isEmbedMode } = useEmbedMode()
  const containerRef = useRef<HTMLDivElement>(null)

  // 文本处理流水线：NER 转换 → Markdown 渲染 → 溯源标记转换
  const nerLinks = convertNerLinksToHtml(content, isDev)
  const renderedHtml = md.render(nerLinks)
  const html = convertSourceMarkersToHtml(renderedHtml)

  // 溯源标记状态管理
  const [activeMarker, setActiveMarker] = useState<SourceMarkerInfo | null>(null)
  console.log('🚀 ~ activeMarker:', activeMarker)

  // 溯源标记点击处理
  const handleSourceMarkerClick = useCallback(
    (target: HTMLElement) => {
      try {
        const sourceId = target.getAttribute(SOURCE_MARKER_CONSTANTS.SOURCE_ID)
        const positionsStr = target.getAttribute(SOURCE_MARKER_CONSTANTS.POSITIONS)
        if (!sourceId || !positionsStr) return

        const positions = JSON.parse(positionsStr) as Array<{ start: string; end: string }>
        const sourceIdNum = Number(sourceId)

        // DPU 表格范围
        if (dpuList && sourceIdNum < dpuList.length) {
          const ref = dpuList[sourceIdNum] || {}
          return setActiveMarker({ sourceId, positions, tableData: ref })
        }

        // 文档数据范围
        if (ragList && sourceIdNum >= (dpuList?.length || 0)) {
          const refBaseIndex = sourceIdNum - (dpuList?.length || 0)
          const ref = ragList[refBaseIndex] || {}
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
    },
    [dpuList, ragList]
  )

  // 统一点击事件处理（事件委托模式）
  const handleClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const linkEl = target.tagName === 'A' ? target : target.closest('a')

      // 代码块复制
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
        return
      }

      // 溯源标记点击
      if (target.matches(`.${SOURCE_MARKER_CONSTANTS.CLASS_NAME}`)) {
        handleSourceMarkerClick(target)
        return
      }

      // 嵌入模式下的实体链接
      if (isEmbedMode && linkEl) {
        e.preventDefault()

        const companyCode = linkEl?.getAttribute('data-companycode')
        if (companyCode) {
          const url = generateUrlByModule({
            module: LinkModule.COMPANY_DETAIL,
            params: {
              companycode: companyCode,
              isSeparate: EIsSeparate.True,
            },
            isDev: isDev,
          })

          if (url) {
            postPointBuriedWithAxios(entWebAxiosInstance, BuryAction.VIEW_COMPANY_DETAIL, {
              id: companyCode,
            })
            handleJumpTerminalCompatible(url, false)
          }
        }
      }
    },
    [handleSourceMarkerClick, isEmbedMode, isDev, entWebAxiosInstance]
  )

  // 事件监听器生命周期管理
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
      />

      {renderPopover()}

      <ChatDPUTableModal
        data={activeMarker?.tableData as DPUItem}
        visible={!!activeMarker?.tableData}
        onClose={() => setActiveMarker(null)}
      />
    </>
  )
}
