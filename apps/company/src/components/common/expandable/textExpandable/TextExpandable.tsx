import intl from '@/utils/intl'
import React, { useEffect, useRef, useState } from 'react'
import './textExpandable.less'

function getBrowserInfo() {
  const userAgent = navigator.userAgent

  // 检查是否是 Safari
  const isSafari = /Safari/.test(userAgent) && !/Chrome|CriOS/.test(userAgent)

  // 检查是否是 Chrome
  const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent)

  return {
    isSafari,
    isChrome,
  }
}

/**
 * 文本展开收起
 * @param {content:string, maxLines:number, marginBottom: number } props
 * @returns
 */
const TextExpandable: React.FC<{ content: string; maxLines: number; marginBottom?: number }> = ({
  content,
  maxLines,
  marginBottom,
}) => {
  return (
    // TODO 请勿删除
    // getBrowserInfo().isChrome ? (
    //   <CommonExpandable {...{ content, maxLines, marginBottom }} />
    // ) : (
    //   <SafariExpandable {...{ content, maxLines }} />
    // )
    // 麒麟系统太变态了，客户不知道浏览器内核是什么，只能使用更加兼容的safari方案
    <SafariExpandable {...{ content, maxLines }} />
  )
}

const CommonExpandable = ({ maxLines, content, marginBottom }) => {
  const [expanded, setExpanded] = useState(false)
  const [scrollHeight, setScrollHeight] = useState(null)
  const [clientHeight, setClientHeight] = useState(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (contentRef.current) {
      setScrollHeight(contentRef.current.scrollHeight)
      setClientHeight(contentRef.current.clientHeight)
    }
  }, [contentRef.current])

  const toggleExpand = () => {
    setExpanded(!expanded)
  }
  useEffect(() => {
    if (contentRef.current) {
      setScrollHeight(contentRef.current.scrollHeight)
    }
  }, [content])

  const enableExpand = scrollHeight !== null && scrollHeight > (clientHeight || 0)
  return (
    <div className="text-expandable-container">
      <div
        ref={contentRef}
        className="text-expandable-content"
        // @ts-expect-error ttt
        style={{ WebkitLineClamp: expanded ? '99999' : maxLines, '--marginBottom': marginBottom || '' }}
      >
        {enableExpand ? (
          !expanded ? (
            <span className="text-expandable-btn open" onClick={() => toggleExpand()}>
              {expanded ? intl('119102') : intl('28912')}
            </span>
          ) : null
        ) : null}
        {content}
        {enableExpand ? (
          expanded ? (
            <span className="text-expandable-btn" onClick={() => toggleExpand()}>
              {intl('119102')}
            </span>
          ) : null
        ) : null}
      </div>
    </div>
  )
}

const SafariExpandable = ({ maxLines, content }) => {
  const [expanded, setExpanded] = useState(false)
  const [scrollHeight, setScrollHeight] = useState(null)
  const [clientHeight, setClientHeight] = useState(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (contentRef.current) {
      setScrollHeight(contentRef.current.scrollHeight)
      setClientHeight(contentRef.current.clientHeight)
    }
  }, [contentRef.current])

  const toggleExpand = () => {
    setExpanded(!expanded)
  }
  useEffect(() => {
    if (contentRef.current) {
      setScrollHeight(contentRef.current.scrollHeight)
    }
  }, [content])
  const enableExpand = scrollHeight !== null && scrollHeight > (clientHeight || 0)
  return (
    <div className="text-expandable-container-safari">
      <div
        ref={contentRef}
        className="text-expandable-content"
        style={{ WebkitLineClamp: expanded ? undefined : maxLines }}
      >
        {enableExpand ? (
          !expanded ? (
            <span className="text-expandable-btn open" onClick={() => toggleExpand()}>
              {intl('28912')}
            </span>
          ) : null
        ) : null}
        {content}
        {enableExpand ? (
          expanded ? (
            <span className="text-expandable-btn" onClick={() => toggleExpand()}>
              {intl('119102')}
            </span>
          ) : null
        ) : null}
      </div>
    </div>
  )
}

export default TextExpandable
