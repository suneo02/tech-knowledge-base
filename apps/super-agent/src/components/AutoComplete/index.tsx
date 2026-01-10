import { useControllableValue, useRequest } from 'ahooks'
import type { AutoCompleteProps } from 'antd'
import { AutoComplete, Empty, Input, Spin } from 'antd'
import type { DefaultOptionType } from 'antd/es/select'
import { t } from 'gel-util/intl'
import { useMemo, useRef, useState } from 'react'
import styles from './index.module.less'

export interface InteractiveAutoCompleteProps extends AutoCompleteProps {
  debounceWait?: number // 防抖等待时间，默认 500ms
  minCharsToSearch?: number // 最小输入字符数，默认 2
  placeholder?: string
  fetchOptions?: (query: string) => Promise<NonNullable<AutoCompleteProps['options']>> // 异步获取选项的函数
}

const PREFIX = 'auto-complete'
const DEFAULT_DEBOUNCE = 500 // 防抖等待时间，默认 500ms
const DEFAULT_MIN_CHARS_TO_SEARCH = 2 // 最小输入字符数，默认 2

interface OptionType extends DefaultOptionType {
  title?: string
  corpId?: string
}

export const InteractiveAutoComplete: React.FC<InteractiveAutoCompleteProps> = (props) => {
  const STRINGS = {
    PLACEHOLDER: t('442954', '请输入'),
    NO_RESULT: t('17235', '暂无数据'),
  } as const
  const {
    placeholder = STRINGS.PLACEHOLDER,
    size = 'large',
    className,
    style,
    debounceWait = DEFAULT_DEBOUNCE,
    minCharsToSearch = DEFAULT_MIN_CHARS_TO_SEARCH,
    fetchOptions,
    onSelect,
  } = props

  const [value, setValue] = useControllableValue<string>(props, {
    defaultValue: '',
    defaultValuePropName: 'defaultValue',
    valuePropName: 'value',
    trigger: 'onChange',
  })

  const [options, setOptions] = useState<OptionType[]>([])
  const [open, setOpen] = useState(false)
  const [typingLoading, setTypingLoading] = useState(false)
  const latestValidQueryRef = useRef('')
  // 记录是否是选择行为，用于 blur 时判断
  const isSelectedRef = useRef(false)
  // 记录是否聚焦，用于处理 blur 后的异步回调
  const isFocusedRef = useRef(false)

  const {
    run: runFetch,
    loading: loadingFetch,
    cancel: cancelFetch,
  } = useRequest(
    async (q: string) => {
      const res = await (fetchOptions ? fetchOptions(q) : Promise.resolve([]))
      return res as OptionType[]
    },
    {
      manual: true,
      debounceWait,
      onSuccess: (res, params) => {
        // 如果已经失去焦点，不再处理结果，也不打开弹窗
        if (!isFocusedRef.current) return

        const req = params?.[0]
        if (!req || req !== latestValidQueryRef.current) return
        setOptions(res || [])
        setTypingLoading(false)
        // 如果有结果，或者虽然无结果但需要显示 empty 状态，都应该保持 open
        setOpen(true)
      },
      onError: () => {
        if (!isFocusedRef.current) return
        setTypingLoading(false)
        setOptions([])
        setOpen(true) // 报错也显示下拉，展示 empty/error 状态（这里复用 empty）
      },
    }
  )

  const showLoading = useMemo(() => {
    return typingLoading || loadingFetch
  }, [typingLoading, loadingFetch])

  // 构造下拉菜单内容（notFoundContent）
  const notFoundContent = useMemo(() => {
    // 1. Loading 状态：优先展示 loading
    if (showLoading) {
      return (
        <div className={styles[`${PREFIX}-dropdown-loading`]}>
          <Spin size="small" />
        </div>
      )
    }

    const len = (value || '').length
    // 2. 输入字符不足提示
    if (len > 0 && len < minCharsToSearch) {
      return <div className={styles[`${PREFIX}-dropdown-hint`]}>{t('481524', '继续输入以搜索...')}</div>
    }

    // 3. 无数据/空状态
    if (len >= minCharsToSearch && !showLoading && options.length === 0) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={STRINGS.NO_RESULT} />
    }

    return null
  }, [showLoading, value, minCharsToSearch, options.length])

  const handleSearch = (input: string) => {
    const v = (input || '').trim()
    isSelectedRef.current = false

    if (v.length < minCharsToSearch) {
      // 输入不足时，清空选项，但打开下拉展示提示
      setOptions([])
      cancelFetch?.()
      latestValidQueryRef.current = ''
      setTypingLoading(false)
      if (v.length > 0) {
        setOpen(true)
      } else {
        setOpen(false)
      }
      return
    }

    latestValidQueryRef.current = v
    setTypingLoading(true)
    // 即使还在 loading，也打开下拉以展示 loading 状态
    setOpen(true)
    runFetch(v)
  }

  const handleSelect = (selectedValue: string, option: DefaultOptionType) => {
    setValue(selectedValue)
    isSelectedRef.current = true
    onSelect?.(selectedValue, option)
    setOpen(false)
  }

  const handleChange = (v: string) => {
    setValue(v)
    // 如果清空了，关闭下拉和取消请求
    if (!v) {
      setOptions([])
      setOpen(false)
      cancelFetch?.()
      latestValidQueryRef.current = ''
      setTypingLoading(false)
      isSelectedRef.current = false
    }
  }

  const handleFocus = () => {
    isFocusedRef.current = true
  }

  const handleBlur = () => {
    isFocusedRef.current = false
    setOpen(false)
    // 立即取消正在进行的请求
    cancelFetch?.()
    setTypingLoading(false)

    // 如果只是输入了文字但没有触发 Select（即没有命中选项），则清空
    // 注意：这里是一个严格的策略，要求必须从下拉选或者完全匹配
    // 简单起见，如果用户 blur 时没有标记为 selected，且输入框有值，说明用户没选
    // 但为了体验，如果用户输入的值正好等于某个选项的 value，也可以算作选中（需要遍历 options，这里暂不复杂化）
    // 根据需求：当用户没有选择对应的企业的时候一旦不聚焦这个autocomplete切弹窗也是关闭的情况下就删除填入的文案。
    // 我们依靠 isSelectedRef 来判断是否触发了 onSelect
    // 但由于 onSelect 和 onBlur 的触发顺序问题（Select 先于 Blur），我们可以利用 setTimeout
    setTimeout(() => {
      if (!isSelectedRef.current && value) {
        // 再次检查当前 value 是否匹配 options 中的某一项（防止用户手输完整名称但没点选）
        const match = options.find((opt) => opt.value === value || opt.label === value || opt.title === value)
        if (match) {
          // 视为选中
          onSelect?.(match.value as string, match)
        } else {
          // 没选中且没匹配，清空
          setValue('')
          // 也可以选择回调 onChange('')
        }
      }
    }, 200)
  }

  const dropdownRender = (menu: React.ReactNode) => {
    return (
      <div className={styles[`${PREFIX}-dropdown-wrapper`]}>
        {menu}
        {showLoading && options.length > 0 && (
          <div className={styles[`${PREFIX}-dropdown-loading-overlay`]}>
            <Spin size="small" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`${styles[`${PREFIX}-container`]} ${className || ''}`}>
      <AutoComplete
        size="small"
        options={options}
        value={value}
        onChange={handleChange}
        onSearch={handleSearch}
        onSelect={handleSelect}
        onFocus={handleFocus}
        open={open}
        style={style}
        popupMatchSelectWidth
        onBlur={handleBlur}
        notFoundContent={notFoundContent}
        popupRender={dropdownRender}
      >
        <Input.Search allowClear placeholder={placeholder} size={size} loading={showLoading} />
      </AutoComplete>
    </div>
  )
}

export default InteractiveAutoComplete
