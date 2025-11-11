import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { numberFormat } from '@/lib/utils'
import { featureInfo } from '@/locales/constants'
import intl, { getLang } from '@/utils/intl'
import React, { useEffect, useState } from 'react'
import { handleSearchHomeNavigation } from './handle/searchHomeNavigation'
import { HotItemProps, isDepartmentData, isFeaturedData, isSearchHomeData } from './types'
import { routerToFeaturedCompany } from '@/views/SearchFetured'
import { hashParams } from '@/utils/links'

function HotItem({ hotFlag, itemData, extendData }: HotItemProps) {
  const { getParamValue } = hashParams()
  const linksource = getParamValue('linksource')
  const [descriptionFlag, setDescriptionFlag] = useState(false) // 是否显示全部描述
  const [description, setDescription] = useState<string>('') // 描述

  useEffect(() => {
    let corpStr = ''
    if (isSearchHomeData(itemData) && itemData.key === 'newcorps') {
      if (getLang() === 'en') {
        corpStr =
          '<i id="homeNewCorpCount" class="home-card-i">' +
          (extendData.records ? extendData.records : 'n') +
          '</i>' +
          intl('422030')
        corpStr = corpStr.replace(/%/, '')
      } else {
        corpStr = intl('422030')
        corpStr = corpStr.replace(
          /%/,
          '<i id="homeNewCorpCount" class="home-card-i">' + (extendData.records ? extendData.records : 'n') + '</i>'
        )
      }
    } else if (isSearchHomeData(itemData) && itemData.key === 'bid') {
      corpStr = extendData.listDictory - 2 + intl('338369', '个榜单和科技类企业名录')
    } else if (isSearchHomeData(itemData)) {
      corpStr = itemData.desc
    }
    setDescription(corpStr)
  }, [extendData, itemData])

  const itemClick = () => {
    // 企业榜单名录
    if (hotFlag === 'fetured' && isFeaturedData(itemData)) {
      routerToFeaturedCompany({ id: itemData.objectId, linksource })
      // window.open(`index.html#/feturedcompany?id=${itemData.objectId}`)
    }

    // 集团系查询
    if (hotFlag === 'department' && isDepartmentData(itemData)) {
      window.open(
        getUrlByLinkModule(LinksModule.GROUP, {
          id: itemData.groupSystemId,
        })
      )
    }

    if (hotFlag === 'searchHome' && isSearchHomeData(itemData)) {
      handleSearchHomeNavigation(itemData.key, itemData.url)
    }
  }

  return (
    <React.Fragment>
      {/* 集团系 */}
      {hotFlag === 'department' && isDepartmentData(itemData) && (
        <div className="hot-item" onClick={() => itemClick()} data-uc-id="bP7sk-V8Q" data-uc-ct="div">
          <div className="item-left">
            <img className="item-img" width="76" src={itemData.groupSystemLogoUrl} />
          </div>
          <div className="item-right">
            <div className="item-name">{itemData.groupSystemName}</div>
            <div className="item-num">
              {intl('216413', '主体公司')}：{itemData.subjectCompanyNum} <br />
              {intl('216415', '成员公司')}：{itemData.memberCompanyNum}
            </div>
          </div>
        </div>
      )}
      {/* 榜单名录 */}
      {hotFlag === 'fetured' && isFeaturedData(itemData) && (
        <div className="hot-item" onClick={() => itemClick()} data-uc-id="zmEjnwI-0j" data-uc-ct="div">
          <div className="item-fetured-header">
            <span className="item-fetured-title">{featureInfo[itemData.objectId].name || itemData.objectName}</span>
            <span className="fetured-num">
              {numberFormat(itemData.count, true)}&nbsp;{intl('138901', '家')}
              <i></i>
            </span>
          </div>
          <div
            className="fetured-description"
            onMouseOver={() => setDescriptionFlag(true)}
            onMouseLeave={() => setDescriptionFlag(false)}
            data-uc-id="QB_Z2y4vXy"
            data-uc-ct="div"
          >
            {featureInfo[itemData.objectId].brief || itemData.description}
          </div>
          {descriptionFlag && (
            <div className="show-all-text">{featureInfo[itemData.objectId].brief || itemData.description}</div>
          )}
        </div>
      )}
      {/* @deprecated ai 首页完成后删除 */}
      {/* 企业库首页 */}
      {hotFlag === 'searchHome' && isSearchHomeData(itemData) && (
        <div
          className={`icon-topic icon-topic-${itemData.key}`}
          onClick={() => itemClick()}
          data-uc-id="_zII5sCiIx"
          data-uc-ct="div"
        >
          <div>{itemData.title}</div>
          <span dangerouslySetInnerHTML={{ __html: description }}></span>
        </div>
      )}
    </React.Fragment>
  )
}

export default HotItem
