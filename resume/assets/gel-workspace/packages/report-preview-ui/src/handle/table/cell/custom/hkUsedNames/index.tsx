import { CorpBasicInfo } from 'gel-types'
import React from 'react'
import styles from './index.module.less'

export const HKUsedNames: React.FC<{
  usednames?: CorpBasicInfo['usednames']
}> = ({ usednames }) => {
  if (!usednames || usednames.length === 0) {
    return <>--</>
  }
  return (
    <div>
      {usednames.map((element, idx) => (
        <div className={styles['hk-used-name-item']} key={idx}>
          <div className={styles['hk-used-name-item-element']}>
            {element.used_name}
            {element.used_name && element.usedEnName ? <br /> : null}
            {element.usedEnName}
          </div>
          {(element.useFrom || element.useTo) && (
            <div className={styles['hk-used-name-item-date']}>
              （{element.useFrom} ~ {element.useTo}）
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// 兼容旧的调用方式
export const renderHKUsedNames = (txt: CorpBasicInfo['usednames']) => <HKUsedNames usednames={txt} />
