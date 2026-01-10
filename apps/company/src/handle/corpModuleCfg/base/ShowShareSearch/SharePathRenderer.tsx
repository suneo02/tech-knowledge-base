import { wftCommon } from '@/utils/utils'
import { ShareholderBreakthroughCombined } from 'gel-types'
import { usedInClient } from 'gel-util/env'
import React from 'react'

interface ShareNodeProps {
  node: ShareholderBreakthroughCombined['shareRoute'][number][number]
  isFirst: boolean
  isBond: boolean
  pingParam: string
}

const ShareNode: React.FC<ShareNodeProps> = ({ node, isFirst, isBond, pingParam }) => {
  const nameR = node.shareholderName ? node.shareholderName : '--'
  const type = node.shareholderId && node.shareholderId.length > 13 ? 'person' : 'company'
  const code = node.shareholderId ? node.shareholderId : ''
  const css = code ? ' wi-secondary-color underline wi-link-color ' : ''

  if (isFirst && isBond) {
    if (usedInClient()) {
      return (
        <span
          className="underline wi-secondary-color wi-link-color"
          data-page="Funds"
          data-code={code}
          data-name={nameR}
          data-pingParam={pingParam}
        >
          {nameR}
        </span>
      )
    } else {
      return <span>{nameR}</span>
    }
  }

  if (!code || code.length > 15) {
    return (
      <span data-name={nameR} data-type={type} data-code={code} data-pingParam={pingParam}>
        {nameR}
      </span>
    )
  }

  return (
    <span className={css} data-name={nameR} data-type={type} data-code={code} data-pingParam={pingParam}>
      <a onClick={() => window.open(`#/companyDetail?needtoolbar=1&companycode=${code}`)}>{nameR}</a>
    </span>
  )
}

interface SharePathRendererProps {
  data: ShareholderBreakthroughCombined['shareRoute']
  rowType?: string
}

export const SharePathRenderer: React.FC<SharePathRendererProps> = ({ data, rowType }) => {
  if (!data || data.length === 0) return null

  // Accumulate pingParam across all paths and nodes to match legacy behavior
  let pingParam = ''

  return (
    <>
      {data.map((pathArr, j) => (
        <div className="path-shareholdertrace" key={j}>
          {pathArr.map((node, i) => {
            const code = node.shareholderId ? node.shareholderId : ''
            pingParam += '&opId=' + code

            const ratio = node.percent ? wftCommon.formatPercent(node.percent) : '--'
            // Check if it is bond.
            const isBond = i === 0 && (rowType === 'bond' || node.type === 'bond')

            return (
              <React.Fragment key={i}>
                <ShareNode node={node} isFirst={i === 0} isBond={isBond} pingParam={pingParam} />
                {i !== pathArr.length - 1 && (
                  <span className="bow-path">
                    <span className="bow-path-text">{ratio}</span>
                  </span>
                )}
              </React.Fragment>
            )
          })}
        </div>
      ))}
    </>
  )
}
