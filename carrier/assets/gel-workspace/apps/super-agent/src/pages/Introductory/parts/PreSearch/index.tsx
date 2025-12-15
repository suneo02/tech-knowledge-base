import React, { useMemo, useState } from 'react'
import styles from './index.module.less'
import { AutoComplete, Input } from '@wind/wind-ui'
import type { DataSourceItemType } from '@wind/wind-ui/lib/auto-complete'
import { t } from 'gel-util/locales'
import { useRequest } from 'ahooks'
import { requestToWFC } from '@/api'

export interface PreSearchProps {
  name?: string
  // onChange 若被 Form 捕获将写入字段值；本组件内部改为直接写入 corpId 到 companyName
  onChange?: (value: string) => void
}

const PREFIX = 'pre-search'

const STRINGS = {
  MY_COMPANY_NAME_PLACEHOLDER: t('superAgent:', '例：小船科技有限公司'),
}

export const PreSearch: React.FC<PreSearchProps> = (props) => {
  const { onChange } = props || {}
  const [inputValue, setInputValue] = useState('')
  const [dataSource, setDataSource] = useState<DataSourceItemType[]>([])

  // 仅当输入长度>1时触发搜索
  const onSearch = (input: string) => {
    const v = (input || '').trim()
    if (v.length <= 1) {
      setDataSource([])
      return
    }
    runSearch({ queryText: v })
  }

  // 预搜索请求
  interface PreSearchItem {
    corpId: string
    corpName: string
  }
  interface PreSearchResponse {
    Data?: { search?: PreSearchItem[] }
  }

  const { run: runSearch, loading: loadingSearch } = useRequest(
    async (data: { queryText: string }) =>
      requestToWFC('search/company/getGlobalCompanyPreSearch', {
        queryText: data.queryText,
      }),
    {
      manual: true,
      onSuccess: (res: PreSearchResponse) => {
        const list = (res?.Data?.search || []) as PreSearchItem[]
        setDataSource(
          list.map((item) => ({
            // 使用 CSS 变量，禁止硬编码色值
            text: <span className={styles[`${PREFIX}-text`]} dangerouslySetInnerHTML={{ __html: item.corpName }} />,
            value: item.corpId, // 输入框展示纯文本
            title: item.corpName.replace(/<[^>]*>/g, ''),
          })) as unknown as DataSourceItemType[]
        )
      },
      debounceWait: 800,
    }
  )

  type OptionWithCorp = { value?: string; text?: string; title?: string }
  const handleSelect = (selectedValue: string | number, option: OptionWithCorp) => {
    const displayName = String(option?.text || option?.title || selectedValue || '')
    setInputValue(displayName)
    onChange?.(String(selectedValue))
  }

  const inputPlaceholder = useMemo(() => STRINGS.MY_COMPANY_NAME_PLACEHOLDER, [])

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <AutoComplete
        dataSource={dataSource}
        value={inputValue}
        onChange={(v: string | number) => setInputValue(String(v ?? ''))}
        onSelect={handleSelect}
        onSearch={onSearch}
        optionLabelProp="value" // 输入框只展示 value（纯文本 corpName）
        size="large"
        style={{ width: '100%', minWidth: '100%' }}
        loading={loadingSearch}
      >
        <Input.Search allowClear placeholder={inputPlaceholder} />
      </AutoComplete>
    </div>
  )
}
