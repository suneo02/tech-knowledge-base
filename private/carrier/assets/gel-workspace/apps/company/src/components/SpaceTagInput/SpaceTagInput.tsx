import React, { useRef, useState } from 'react'
import { Select } from '@wind/wind-ui'

/**
 * SpaceTagInput 业务组件：以“空格 | ｜(全角/半角) | 回车 | 粘贴”作为分隔创建标签。
 * - 隐藏下拉建议
 * - 中文输入法合成保护
 * - 支持粘贴按空白/竖线拆分为多个标签
 *
 * @author 刘兴华<xhliu.liuxh@wind.com.cn>
 * @component SpaceTagInput
 *
 * @param {string[]}value 当前标签数组
 * @param {(next: string[]) => void} onChange 标签变更回调；入参 next 为新标签数组；无返回值
 * @param {string} [placeholder] 占位文案
 * @param {number|"responsive"} [maxTagCount=20] 最大展示标签数
 * @param {boolean} [hideDropdown=true] 是否隐藏下拉面板
 * @param {import('react').CSSProperties} [style] 外层样式
 * @param {string} [className] 外层类名
 * @param {import('react').FocusEventHandler} [onFocus] 聚焦回调；无返回值
 * @param {import('react').FocusEventHandler} [onBlur] 失焦回调；无返回值
 * @param {string} [data-uc-id] UC埋点 ID
 * @param {string} [data-uc-ct] UC埋点组件类型
 */
export interface SpaceTagInputProps {
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  maxTagCount?: number | 'responsive'
  hideDropdown?: boolean
  style?: React.CSSProperties
  className?: string
  onFocus?: React.FocusEventHandler<any>
  onBlur?: React.FocusEventHandler<any>
  ['data-uc-id']?: string
  ['data-uc-ct']?: string
}

export const SpaceTagInput: React.FC<SpaceTagInputProps> = ({
  value,
  onChange,
  placeholder,
  maxTagCount = 20,
  hideDropdown = true,
  style,
  className,
  onFocus,
  onBlur,
  ...dataAttrs
}) => {
  const [searchValue, setSearchValue] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const selectRef = useRef<any>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isComposing) return

    if (e.key === ' ' || e.key === '|' || e.key === '｜' || e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      const text = searchValue.trim()
      if (!text) return
      const next = Array.from(new Set([...(value || []), text]))
      onChange(next)
      setSearchValue('')
      requestAnimationFrame(() => selectRef.current?.focus?.())
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData?.getData('text') || ''
    if (!text) return
    // 粘贴包含空格（或换行/制表）时，拆分为多个标签
    const parts = text
      .split(/[|｜\s]+/)
      .map((t) => t.trim())
      .filter(Boolean)
    if (parts.length <= 1) return // 单个词交给原生输入
    e.preventDefault()
    const next = Array.from(new Set([...(value || []), ...parts]))
    onChange(next)
    setSearchValue('')
    requestAnimationFrame(() => selectRef.current?.focus?.())
  }

  return (
    <Select
      ref={selectRef}
      className={className}
      mode="tags"
      size="large"
      value={value}
      onChange={(v) => {
        onChange(v as unknown as string[])
        requestAnimationFrame(() => selectRef.current?.focus?.())
      }}
      //   allowClear
      searchValue={searchValue}
      onSearch={setSearchValue}
      placeholder={placeholder}
      maxTagCount={maxTagCount}
      onFocus={onFocus}
      onBlur={onBlur}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={() => setIsComposing(false)}
      onInputKeyDown={handleKeyDown}
      onPaste={handlePaste}
      dropdownStyle={hideDropdown ? { display: 'none' } : undefined}
      style={{ width: '100%', maxWidth: '100%', ...style }}
      {...dataAttrs}
    />
  )
}

export default SpaceTagInput
