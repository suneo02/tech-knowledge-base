import { CorpAnotherNameList, CorpBasicInfo } from 'gel-types'
import { isArray } from 'lodash'
import React from 'react'
import styles from './index.module.less'

/**
 * 别名组件
 * @description 展示公司的别名、曾用名、片假名、英文名等
 */
export const CorpAnotherName: React.FC<{
  anotherNames: CorpBasicInfo['anotherNames']
}> = ({ anotherNames }) => {
  let anotherNamesList: CorpAnotherNameList
  if (isArray(anotherNames)) {
    anotherNamesList = anotherNames
  } else {
    anotherNamesList = Object.entries(anotherNames || {}).map(([key, value]) => ({
      type: key,
      anotherNames: value,
    }))
  }

  // 如果 anotherNames 不存在或者为空数组，则直接返回 '--'
  if (!anotherNamesList || anotherNamesList.length === 0 || !isArray(anotherNamesList)) {
    return <>--</>
  }

  // 对 anotherNames 进行处理，过滤掉 anotherNames 为空或空数组的情况
  const vals = anotherNamesList.reduce<{ type: string; names: string[] }[]>((acc, k) => {
    const val = k.anotherNames
    if (val && val.length > 0) {
      acc.push({
        type: k.type,
        names: val.map((t) => t.formerName || '--'),
      })
    }
    return acc
  }, [])

  // 如果处理后的 vals 为空，则返回 '--'
  if (vals.length === 0) {
    return <>--</>
  }

  return (
    <div className={styles.alias}>
      {vals.map((t, i) => (
        <React.Fragment key={i}>
          <span className={styles['alias-title']}>{t.type}</span>
          <div className={styles['alias-names']}>
            {t.names.map((name, j) => (
              <span key={j}>{name}</span>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
