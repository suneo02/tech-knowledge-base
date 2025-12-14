import React, { FC } from 'react'
import intl from '../../../utils/intl'
import { getCompanyStateColor } from '@/views/SearchFunc/state'
import { Tag } from '@wind/wind-ui'
import { TagsModule, TagWithModule } from 'gel-ui'
import { isChineseName, wftCommon } from '../../../utils/utils'
import './ResultList.less'
import { SearchItem } from './type'

/**
 * 预搜索结果列表
 * @author 刘兴华<xhliu.liu@wind.com.cn>
 * @component ResultList
 * @param props.list 列表数据
 * @param props.onItemClick 列表项点击回调
 * @param props.listFlag 列表显隐
 * @param props.showTag 是否强制显示 tag（仅结果列表内使用）
 * @param props.withLogo 是否显示左侧 Logo
 */
export interface ResultListProps {
  list: SearchItem[]
  onItemClick: (item: SearchItem) => void
  listFlag: boolean
  showTag?: boolean
  withLogo?: boolean
}

const ResultList: FC<ResultListProps> = ({ list, onItemClick, listFlag, showTag, withLogo = false }) => {
  const setTagHtml = (data: SearchItem) => {
    try {
      if ('highlight' in data) {
        const match = (data as any)?.highlight?.[0]?.label
        if (match === '公司名称' || match?.toLowerCase()?.includes('company name')) return ''
        return match
      }
      return ''
    } catch {
      return ''
    }
  }

  const setName = (data: SearchItem) => {
    const anyData = data as any
    let highLitKey = anyData?.name || anyData?.corp_name || anyData?.corpName || anyData?.groupsystem_name
    if ('highlight' in anyData && Object.keys(anyData.highlight).length > 0) {
      if (Object.keys(anyData.highlight)[0] === 'corp_name') {
        highLitKey = anyData.highlight[Object.keys(anyData.highlight)[0]]
      }
    }
    return highLitKey
  }

  const setEnglishName = (data: SearchItem) => {
    if ('corpNameEng' in (data as any)) return (data as any).corpNameEng
    return ''
  }

  const renderLogo = (item: any) => {
    if (!withLogo) return null
    if (item?.logo) return wftCommon.imageBaseCorp('', item.logo, 'logo', true)
    let logoName = item?.corpName?.replace(/<em>|<\/em>/g, '') || ''
    if (!isChineseName(logoName)) {
      if (logoName?.length) logoName = logoName.slice(0, 1)
      return <span className="logo-text-alpha"> {logoName} </span>
    } else logoName = logoName?.slice(0, 4)
    return <span className="logo-text">{logoName} </span>
  }

  return (
    <>
      <div className={listFlag ? 'input-toolbar-search-list' : 'input-toolbar-search-list hide'}>
        {list &&
          list.length > 0 &&
          list.map((item: any) => {
            const key = item.value || item.id || item.name
            const { aiTransFlag, corpNameEng } = item
            return (
              <div
                key={key}
                className="search-result-item"
                onMouseDown={() => onItemClick(item)}
                data-uc-id="f2-xXmxb7t"
                data-uc-ct="div"
                data-uc-x={key}
              >
                {withLogo && <div className="search-result-item-logo">{renderLogo(item)}</div>}
                <div className="search-result-item-content">
                  <div className="search-result-item-content-name">
                    <span className="name" dangerouslySetInnerHTML={{ __html: setName(item) }} />
                  </div>
                  <div className="search-result-item-content-en">
                    <span className="name enName" dangerouslySetInnerHTML={{ __html: setEnglishName(item) }} />
                    {corpNameEng && aiTransFlag && <span className="foot">{intl('362293', '该翻译由AI提供')}</span>}
                  </div>
                  <div className="search-result-item-content-tag">
                    {setTagHtml(item)?.length > 0 && !showTag && (
                      <span
                        className="match"
                        dangerouslySetInnerHTML={{
                          __html: `${setTagHtml(item)}：${(item as any)?.highlight?.[0]?.value}`,
                        }}
                      />
                    )}
                    {item?.province && (
                      <TagWithModule
                        styles={{ lineHeight: '20px', height: '20px', fontSize: '13px', padding: '0 8px' }}
                        module={TagsModule.AREA}
                      >
                        {item?.province}
                      </TagWithModule>
                    )}
                    {item?.regStatus && (
                      <Tag
                        type="secondary"
                        color={getCompanyStateColor(item?.regStatus)}
                        style={{ lineHeight: '20px', height: '20px', fontSize: '13px', padding: '0 8px' }}
                      >
                        {item?.regStatus}
                      </Tag>
                    )}
                    {item?.tags?.length > 0 && (
                      <TagWithModule
                        module={TagsModule.STOCK}
                        styles={{ lineHeight: '20px', height: '20px', fontSize: '13px', padding: '0 8px' }}
                      >
                        {item?.tags[0]?.name}
                      </TagWithModule>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </>
  )
}

export default ResultList
