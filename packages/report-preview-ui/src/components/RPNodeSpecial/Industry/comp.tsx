import { IndustrySector } from 'gel-types'
import React from 'react'
import { getCorpIndustryDisplayConfidence, getCorpIndustrySeparator } from 'report-util/table'
import styles from './comp.module.less'

export const IndustryDataCell: React.FC<{ sector: IndustrySector }> = ({ sector }) => {
  if (!sector || !sector.list) {
    return null
  }

  const separator = getCorpIndustrySeparator(sector.key)

  return (
    <>
      {sector.list.map((confidenceGroup, j) => {
        const confidence = getCorpIndustryDisplayConfidence(confidenceGroup)
        return (
          <div key={j} className={styles['corp-belong-industry-group']}>
            <div>
              {confidenceGroup.list.map((item, k) => (
                <React.Fragment key={k}>
                  <span>{item.name}</span>
                  {confidence !== null && confidence !== undefined && k === confidenceGroup.list.length - 1 && (
                    <sup className="confidence-level">{confidence}</sup>
                  )}
                  {k < confidenceGroup.list.length - 1 && <span>{separator}</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )
      })}
    </>
  )
}
