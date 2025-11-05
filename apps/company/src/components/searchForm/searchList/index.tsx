import React, { FC } from 'react'
import intl from '../../../utils/intl'

import { isEn } from 'gel-util/intl'
import './index.less'
import { SearchItem, SearchListProps } from './type'

const SearchList: FC<SearchListProps> = ({
  list,
  onItemClick,
  listFlag,
  showSearchHistoryFlag,
  showTag,
  onClearHistory,
}) => {
  // 匹配不同类型的tag展示标签
  const setTagHtml = (data: SearchItem) => {
    try {
      if ('highlight' in data) {
        return data?.highlight?.[0]?.label
      }
      return ''
    } catch (error) {
      return ''
    }
  }

  const setName = (data: SearchItem) => {
    // @ts-expect-error ttt
    let highLitKey = data?.name || data?.corp_name || data?.corpName || data?.groupsystem_name
    if ('highlight' in data && Object.keys(data.highlight).length > 0) {
      if (Object.keys(data.highlight)[0] === 'corp_name') {
        highLitKey = data.highlight[Object.keys(data.highlight)[0]]
      }
    }

    return highLitKey
  }

  const setEnglishName = (data: SearchItem) => {
    if ('corpNameEng' in data) {
      return data.corpNameEng
    }
    return ''
  }

  return (
    <>
      {
        <div className={listFlag ? 'input-toolbar-search-list' : 'input-toolbar-search-list hide'}>
          {showSearchHistoryFlag && list.length > 0 && (
            <div className="search-list-title">
              {intl('437396', '历史搜索')}
              <span className="search-list-icon" onMouseDown={onClearHistory}>
                <i></i>
                {intl('149222', '清空')}
              </span>
            </div>
          )}
          {list &&
            list.length > 0 &&
            list.map((item) => {
              // @ts-expect-error ttt
              const key = item.value || item.id || item.name
              // @ts-expect-error ttt
              const { aiTransFlag, corpNameEng } = item
              return isEn() ? (
                <>
                  <div key={key} className="search-list-div en-search-list-div" onMouseDown={() => onItemClick(item)}>
                    <div className="name-box">
                      <p className="name zhName" dangerouslySetInnerHTML={{ __html: setName(item) }} />
                      <p>
                        <span className="name enName" dangerouslySetInnerHTML={{ __html: setEnglishName(item) }}></span>
                        {corpNameEng && aiTransFlag && <span className="foot">{intl('362293', '该翻译由AI提供')}</span>}
                      </p>
                    </div>

                    {setTagHtml(item)?.length > 0 && !showTag && (
                      <span
                        className="tag enTag"
                        dangerouslySetInnerHTML={{ __html: setTagHtml(item) + ' ' + intl('233028', '匹配') }}
                      ></span>
                    )}
                  </div>
                </>
              ) : (
                <div key={key} className="search-list-div" onMouseDown={() => onItemClick(item)}>
                  <span className="name" dangerouslySetInnerHTML={{ __html: setName(item) }} />
                  {setTagHtml(item)?.length > 0 && !showTag && (
                    <span
                      className="tag"
                      dangerouslySetInnerHTML={{ __html: setTagHtml(item) + ' ' + intl('233028', '匹配') }}
                    ></span>
                  )}
                </div>
              )
            })}
        </div>
      }
    </>
  )
}

export default SearchList
