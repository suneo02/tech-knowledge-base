import { SearchComponent } from '@visactor/vtable-search'
import { SearchO, LeftO, RightO } from '@wind/icons'
import React, { useState, useRef, useEffect } from 'react'
import { Input, Button, Popover } from '@wind/wind-ui'
import PropTypes from 'prop-types'
import { useSuperChatRoomContext } from '@/contexts/SuperChat'
import { t } from 'gel-util/intl'
import styles from './index.module.less'
import { pickByLanguage } from '@/utils/langSource'

interface ETableSearchProps {
  tabKey: string
  searchInstance: SearchComponent
}

const PREFIX = 'e-table-search'

const STRINGS = {
  SEARCH_PLACEHOLDER: t('464215', '请输入你想搜索的内容'),
  SEARCH_BUTTON: pickByLanguage({ cn: '表内搜索', en: 'In-table Search', jp: 'In-table Search' }),
}

const DEFAULT_SEARCH_RESULT = '0/0'

const ETableSearch: React.FC<ETableSearchProps> = ({ tabKey, searchInstance }) => {
  const { tabVersions } = useSuperChatRoomContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState(DEFAULT_SEARCH_RESULT)
  const suffixRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSearchTerm('')
    setSearchResult(DEFAULT_SEARCH_RESULT)
  }, [tabVersions])

  useEffect(() => {
    handleSearch()
  }, [searchTerm])

  const handleSearch = () => {
    const result = searchInstance.search(searchTerm)
    setSearchResult(
      !result || result?.results.length === 0 ? DEFAULT_SEARCH_RESULT : `${result?.index + 1}/${result?.results.length}`
    )
  }
  const handlePrev = () => {
    const result = searchInstance.prev()
    setSearchResult(
      !result || result?.results.length === 0 ? DEFAULT_SEARCH_RESULT : `${result?.index + 1}/${result?.results.length}`
    )
  }
  const handleNext = () => {
    const result = searchInstance.next()
    setSearchResult(
      !result || result?.results.length === 0 ? DEFAULT_SEARCH_RESULT : `${result?.index + 1}/${result?.results.length}`
    )
  }

  useEffect(() => {
    // console.log('🚀 ~ tabVersions:', tabVersions)
  }, [tabVersions])

  return (
    <Popover
      content={
        <div className={styles[`${PREFIX}-container`]} key={`${tabKey}-${tabVersions[tabKey]}`}>
          <Input.Group>
            <Input
              style={{ paddingInlineEnd: suffixRef.current?.clientWidth ?? 0 }}
              // @ts-expect-error wind-ui
              prefix={<SearchO />}
              placeholder={STRINGS.SEARCH_PLACEHOLDER}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={handleNext}
              allowClear
            />
            <div className={styles[`${PREFIX}-suffix`]} ref={suffixRef}>
              {/* @ts-expect-error wind-ui */}
              <Button onClick={handlePrev} icon={<LeftO />} type="text" />
              <div>{searchResult}</div>
              {/* @ts-expect-error wind-ui */}
              <Button onClick={handleNext} icon={<RightO />} type="text" />
            </div>
          </Input.Group>
        </div>
      }
      trigger="click"
      placement="bottom"
    >
      {/* @ts-expect-error wind-ui */}
      <Button icon={<SearchO />} type={searchTerm ? 'link' : 'text'}>
        {STRINGS.SEARCH_BUTTON}
      </Button>
    </Popover>
  )
}

ETableSearch.propTypes = {
  searchInstance: PropTypes.object.isRequired,
}

export default ETableSearch
