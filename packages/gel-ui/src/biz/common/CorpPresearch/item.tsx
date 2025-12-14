import { InnerHtml } from '@/common/InnerHtml'
import { isEn, t } from 'gel-util/intl'
import React, { FC } from 'react'
import { CorpSearchRowProps } from './type'
import { imageBase, isChineseName } from './logo'
import styles from './item.module.less'

export const CorpSearchRow: FC<CorpSearchRowProps> = ({ item, onClick, onlyLabel = false }) => {
  const { corpName, corpId, corpNameEng, aiTransFlag, highlight, logo } = item || {}

  const handleClick = () => {
    onClick?.(item)
  }

  const renderLogo = (item) => {
    if (item?.logo) {
      return imageBase('', item.logo, 'logo', true, '', 'corp')
    } else {
      let logoName = item?.corpName?.replace(/<em>|<\/em>/g, '') || ''
      if (!isChineseName(logoName)) {
        // 非汉字情况下
        if (logoName.length) {
          logoName = logoName.slice(0, 1)
        }
        return <span className="logo-text-alpha"> {logoName} </span>
      } else {
        logoName = logoName.slice(0, 4)
      }

      return <span className="logo-text">{logoName} </span>
    }
  }

  // 匹配不同类型的tag展示标签
  const setTagHtml = (data) => {
    try {
      if ('highlight' in data) {
        return data?.highlight?.[0]?.label
      }
      return ''
    } catch (error) {
      return ''
    }
  }

  // 匹配不同类型的tag展示标签， 公司名称不展示匹配值
  const renderMatch = (item) => {
    const matchValue = item?.highlight?.[0]?.value
    const matchLabel = setTagHtml(item)
    if (matchLabel) {
      if (matchLabel !== '公司名称' && !matchLabel.toLowerCase().includes('company name')) {
        return matchLabel + '：' + '<span class="match-value">' + matchValue + '</span>'
      } else {
        return matchLabel
      }
    }
    return ''
  }

  return (
    <div className={styles['search-row']} onClick={handleClick}>
      {!onlyLabel && <div className={styles['search-row--logo']}>{renderLogo(item)}</div>}

      {isEn() ? (
        <div className={styles['result-list']} style={onlyLabel ? { margin: '0' } : {}}>
          <InnerHtml className="name zhName" html={corpName} />
          <p
            className="name enName"
            title={corpNameEng + '   ' + ((aiTransFlag && t('362293', '该翻译由AI提供')) || '')}
          >
            <InnerHtml html={corpNameEng}></InnerHtml>
            {aiTransFlag && corpNameEng && <span className="foot">{t('362293', '该翻译由AI提供')}</span>}
          </p>

          {!onlyLabel && setTagHtml(item)?.length > 0 && setTagHtml(item) && (
            <span
              className={styles.match}
              dangerouslySetInnerHTML={{
                __html: renderMatch(item),
              }}
            ></span>
          )}
        </div>
      ) : (
        <span className={styles['result-list']} style={onlyLabel ? { margin: '0' } : {}}>
          <InnerHtml className={styles['result-list-name']} html={corpName}></InnerHtml>
          {!onlyLabel && setTagHtml(item)?.length > 0 && setTagHtml(item) && (
            <span
              className={styles.match}
              dangerouslySetInnerHTML={{
                __html: renderMatch(item),
              }}
            ></span>
          )}
        </span>
      )}
    </div>
  )
}
