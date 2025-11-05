import { getUrlByLinkModule, handleJumpTerminalCompatibleAndCheckPermission, LinksModule } from '@/handle/link'
import { wftCommon } from '@/utils/utils'
import { wftCommonType } from '@/utils/WFTCommonWithType'
import React from 'react'

interface ShareholderPathProps {
  row: any
}

export const ShowShareSearchPathItem = ({
  item,
  index,
  row,
  pingParam,
}: {
  item: any
  index: number
  row: any
  pingParam: string
}) => {
  const data = row.path
  const nameR = item.shareholderName ? item.shareholderName : '--'
  const ratio = item.percent ? wftCommonType.displayPercent(item.percent) : '--'
  const type = item.shareholderId && item.shareholderId.length > 13 ? 'person' : 'company'
  const code = item.shareholderId ? item.shareholderId : ''
  const css = code ? 'wi-secondary-color underline wi-link-color' : ''

  const urlCorp = getUrlByLinkModule(LinksModule.COMPANY, {
    id: code,
  })

  return (
    <React.Fragment key={index}>
      {index === 0 && row.type === 'bond' ? (
        wftCommon.usedInClient() ? (
          <span
            className="underline wi-secondary-color wi-link-color"
            data-page="Funds"
            data-code={code}
            data-name={nameR}
            data-pingParam={pingParam}
          >
            {nameR}
          </span>
        ) : (
          <span>{nameR}</span>
        )
      ) : !code || code.length > 15 ? (
        <span data-name={nameR} data-type={type} data-code={code} data-pingParam={pingParam}>
          {nameR}
        </span>
      ) : (
        <span className={css} data-name={nameR} data-type={type} data-code={code} data-pingParam={pingParam}>
          <a
            onClick={() => {
              handleJumpTerminalCompatibleAndCheckPermission(urlCorp)
            }}
          >
            {nameR}
          </a>
        </span>
      )}
      {index !== data.length - 1 && (
        <span className="bow-path">
          <span className="bow-path-text">{ratio}</span>
        </span>
      )}
    </React.Fragment>
  )
}
/**
 * 股东穿透-逐层穿透-持股路径
 * @returns
 */
export const ShowShareSearchLayerByLayerSharePath: React.FC<ShareholderPathProps> = ({ row }) => {
  const data = row.path
  if (!(data && data.length > 0)) {
    return <div>--</div>
  }

  const pathArr = data
  let pingParam = '' //bury

  return (
    <div className="path-shareholdertrace">
      {pathArr.map((item, i) => {
        const code = item.shareholderId ? item.shareholderId : ''
        pingParam += '&opId=' + code
        return <ShowShareSearchPathItem item={item} index={i} row={row} pingParam={pingParam} />
      })}
    </div>
  )
}
