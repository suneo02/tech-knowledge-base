import { Select } from '@wind/wind-ui'
import { SelectProps } from '@wind/wind-ui/lib/select'
import { AxiosInstance } from 'axios'
import { requestToWFCWithAxios } from 'gel-api'
import { CorpPreSearchResult } from 'gel-types'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './index.module.less'
import { CorpSearchRow } from './item'

const STRINGS = {
  placeholder: '输入公司名称查询',
  notFound: '没有找到相关公司',
}

interface CorpPresearchProps {
  axiosInstance: AxiosInstance
  initialValue?: string
  placeholder?: string
  onChange?: (corpId: string, corpName: string) => void
  debounceTime?: number
}

interface SelectOption {
  label: React.ReactNode
  value: string
  data: CorpPreSearchResult
}

export const CorpPresearch: React.FC<CorpPresearchProps> = ({
  axiosInstance,
  initialValue,
  placeholder = STRINGS.placeholder,
  debounceTime = 300,
  onChange,
}) => {
  const [searchOptions, setSearchOptions] = useState<SelectOption[]>([])
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null)

  const handleSearch = useCallback(async (searchText: string) => {
    if (!searchText || searchText.trim() === '') {
      setSearchOptions([])
      return
    }

    try {
      const response = await requestToWFCWithAxios(axiosInstance, 'search/company/getGlobalCompanyPreSearch', {
        queryText: searchText,
      })

      if (response?.Data?.search) {
        const preSearchData = response.Data.search
        const options = preSearchData.map((item) => ({
          label: <CorpSearchRow item={item} />,
          value: item.corpId,
          data: item,
        }))
        setSearchOptions(options)
      } else {
        setSearchOptions([])
      }
    } catch (error) {
      console.error('CorpPresearch error:', error)
      setSearchOptions([])
    }
  }, [])

  const debouncedSearch = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null

    return (searchText: string) => {
      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => {
        handleSearch(searchText)
      }, debounceTime)
    }
  }, [debounceTime, handleSearch])

  const handleChange = useCallback<NonNullable<SelectProps['onChange']>>(
    (value, option) => {
      setSelectedOption(option as SelectOption)
      if (onChange) {
        // @ts-expect-error TODO
        onChange(String(value), String(option.data.corpId))
      }
    },
    [onChange]
  )

  useEffect(() => {
    if (initialValue) {
      debouncedSearch(initialValue)
    }
  }, [initialValue, debouncedSearch])

  return (
    <Select
      className={styles.corpPresearch}
      defaultValue={initialValue}
      placeholder={placeholder}
      showSearch
      allowClear
      notFoundContent={STRINGS.notFound}
      options={searchOptions}
      value={selectedOption?.value}
      onSearch={debouncedSearch}
      onChange={handleChange}
      filterOption={false}
    />
  )
}
