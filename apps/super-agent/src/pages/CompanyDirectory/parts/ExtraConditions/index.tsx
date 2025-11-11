import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Button, Input, Tag } from '@wind/wind-ui'
import styles from './index.module.less'
import { DownO, LoadingO, UpO } from '@wind/icons'

export interface ExtraConditionsProps {
  onApply?: (params: { include: string[]; exclude: string[] }) => void
}

export const ExtraConditions: React.FC<ExtraConditionsProps> = (props) => {
  const { onApply } = props || {}

  // 快捷提示
  const quickPrompts = useMemo(
    () => [
      '注册资本小于100万，成立时间<3年',
      '参保人数>50，排除已注销',
      '所在城市=上海/深圳，含关键词“AI”',
      '近30天有融资新闻，员工数>200',
    ],
    []
  )

  // AI 对话输入与流式输出
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [stream, setStream] = useState('')
  const streamTimerRef = useRef<number | null>(null)
  const inputRowRef = useRef<HTMLDivElement | null>(null)
  const [overlayTop, setOverlayTop] = useState<number>(0)

  // 生成的结构化结果（演示）
  const [include, setInclude] = useState<string[]>([])
  const [exclude, setExclude] = useState<string[]>([])
  // 可选择集合（默认同步解析结果，可单独调整）
  const [selectedInclude, setSelectedInclude] = useState<string[]>([])
  const [selectedExclude, setSelectedExclude] = useState<string[]>([])

  // 根容器用于 click-away
  const containerRef = useRef<HTMLDivElement | null>(null)

  const hasAny = include.length > 0 || exclude.length > 0

  const stopStream = () => {
    if (streamTimerRef.current) {
      window.clearInterval(streamTimerRef.current)
      streamTimerRef.current = null
    }
  }

  const parseToFilters = (text: string) => {
    // 简单解析示例：包含“排除/不要”关键字的片段进入 exclude，其余进入 include
    const segs = text
      .split(/[，,。.;\n]/)
      .map((s) => s.trim())
      .filter(Boolean)
    const inc: string[] = []
    const exc: string[] = []
    segs.forEach((s) => {
      const lower = s.toLowerCase()
      if (lower.includes('排除') || lower.includes('不要') || lower.includes('exclude')) exc.push(s)
      else inc.push(s)
    })
    return { inc, exc }
  }

  const runGenerate = useCallback(
    (seed: string) => {
      if (!seed.trim()) return
      stopStream()
      setStream('')
      setIsGenerating(true)
      setOverlayOpen(true)
      // 模拟 AI 流式输出
      const full =
        `根据你的条件「${seed}」，建议：\n` +
        `1. 只要：注册资本小于100万；成立时间小于3年；含“AI”关键词\n` +
        `2. 排除：已注销、异常经营、空壳公司\n` +
        `3. 可选：参保人数大于50；所在城市为上海/深圳`
      let idx = 0
      streamTimerRef.current = window.setInterval(() => {
        idx += 2
        const chunk = full.slice(0, idx)
        setStream(chunk)
        if (idx >= full.length) {
          stopStream()
          setIsGenerating(false)
          const { inc, exc } = parseToFilters(full)
          setInclude(inc)
          setExclude(exc)
          setSelectedInclude(inc)
          setSelectedExclude(exc)
          if (onApply) onApply({ include: inc, exclude: exc })
        }
      }, 30)
    },
    [onApply]
  )

  useEffect(() => () => stopStream(), [])

  // 将悬浮卡片“贴合”输入行底部，避免割裂感
  useLayoutEffect(() => {
    const el = inputRowRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    // 容器内定位：输入行相对于容器顶部的偏移
    const parentRect = el.parentElement?.getBoundingClientRect()
    const top = parentRect ? rect.bottom - parentRect.top : el.offsetTop + el.clientHeight
    setOverlayTop(top)
  }, [prompt, overlayOpen])

  // 点击组件外关闭悬浮层
  useEffect(() => {
    if (!overlayOpen) return
    const handleClickAway = (e: MouseEvent) => {
      const root = containerRef.current
      if (!root) return
      if (!root.contains(e.target as Node)) {
        setOverlayOpen(false)
        stopStream()
      }
    }
    document.addEventListener('mousedown', handleClickAway)
    return () => document.removeEventListener('mousedown', handleClickAway)
  }, [overlayOpen])

  // 交互：切换选择
  const toggleSelect = useCallback((type: 'inc' | 'exc', item: string) => {
    if (type === 'inc') {
      setSelectedInclude((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]))
    } else {
      setSelectedExclude((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]))
    }
  }, [])

  const clearSelections = useCallback(() => {
    setSelectedInclude([])
    setSelectedExclude([])
  }, [])

  const applySelections = useCallback(() => {
    if (onApply) onApply({ include: selectedInclude, exclude: selectedExclude })
    setOverlayOpen(false)
  }, [onApply, selectedInclude, selectedExclude])

  // 更多推荐（演示）
  const moreRecommendations = useMemo(() => {
    return ['含“智能制造”关键词', '近90天新增招聘>20条', '融资轮次≥A轮', '注册地址在北京/广州']
  }, [])

  return (
    <div ref={containerRef} className={styles.container} data-open={overlayOpen ? 'true' : 'false'}>
      我的筛选条件
      <div className={styles.headerRow}>
        <div className={styles.aiInputRow} ref={inputRowRef}>
          <Input
            value={prompt}
            onChange={(e) => setPrompt((e.target as HTMLInputElement).value)}
            placeholder="用自然语言描述你想要的筛选条件（回车或点生成）"
            className={styles.aiInput}
            suffix={isGenerating ? <span className={styles.inlineLoading} /> : null}
          />
          <Button type="primary" onClick={() => runGenerate(prompt)} disabled={!prompt.trim()}>
            重新生成
          </Button>
        </div>
        <div>
          {hasAny && (
            <div className={styles.summary}>
              {!isGenerating && <Tag>已生成 {include.length + exclude.length} 条</Tag>}
              {isGenerating && (
                <Tag>
                  正在生成
                  <LoadingO style={{ marginInlineStart: 4, color: 'var(--green-4)' }} />
                </Tag>
              )}
              <Button type="text" onClick={() => setOverlayOpen((v) => !v)} icon={overlayOpen ? <UpO /> : <DownO />} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.quickPrompts}>
        {quickPrompts.map((q) => (
          <Tag
            key={q}
            className={styles.quickChip}
            onClick={() => {
              setPrompt(q)
              runGenerate(q)
            }}
          >
            {q}
          </Tag>
        ))}
      </div>
      {/* 生成结果流式卡片：绝对定位，不挤压下方表格 */}
      {overlayOpen && (isGenerating || stream) && (
        <div className={styles.overlay} data-open={overlayOpen ? 'true' : 'false'} style={{ top: overlayTop }}>
          <div className={styles.overlayCard} data-open={overlayOpen ? 'true' : 'false'}>
            <div className={styles.overlayHeader}>
              <div>
                {isGenerating ? (
                  <>
                    <LoadingO /> 正在输出内容
                  </>
                ) : (
                  <>正在补充筛选条件</>
                )}
              </div>
              <div className={styles.pill}>点击空白处可收起</div>
            </div>
            <div className={styles.overlayBody}>
              <pre className={styles.overlayText}>{stream || '...'}</pre>
              {!isGenerating && (
                <>
                  <div className={styles.overlaySection}>
                    <div className={styles.label}>只要</div>
                    <div className={styles.overlayList}>
                      {include.map((item) => (
                        <Tag
                          key={`inc-${item}`}
                          className={styles.selectableChip}
                          data-active={selectedInclude.includes(item) ? 'true' : 'false'}
                          onClick={() => toggleSelect('inc', item)}
                        >
                          {item}
                        </Tag>
                      ))}
                    </div>
                  </div>
                  <div className={styles.overlaySection}>
                    <div className={styles.label}>排除</div>
                    <div className={styles.overlayList}>
                      {exclude.map((item) => (
                        <Tag
                          key={`exc-${item}`}
                          className={styles.selectableChip}
                          data-active={selectedExclude.includes(item) ? 'true' : 'false'}
                          onClick={() => toggleSelect('exc', item)}
                        >
                          {item}
                        </Tag>
                      ))}
                    </div>
                  </div>
                  <div className={styles.overlaySection}>
                    <div className={styles.label}>更多推荐</div>
                    <div className={styles.overlayList}>
                      {moreRecommendations.map((rec) => (
                        <Tag
                          key={`rec-${rec}`}
                          className={styles.quickChip}
                          onClick={() => {
                            setSelectedInclude((prev) => (prev.includes(rec) ? prev : [...prev, rec]))
                          }}
                        >
                          {rec}
                        </Tag>
                      ))}
                    </div>
                  </div>
                  <div className={styles.footerRow}>
                    <Button size="small" onClick={clearSelections}>
                      清空选择
                    </Button>
                    <Button size="small" type="primary" onClick={applySelections}>
                      应用筛选
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
