import { expandHandle } from '@/components/company/corpCompMisc'
import LongTxtMergenceLabel from '@/handle/corpModuleCfg/base/ShowShareSearch/LongTxtMergenceLabel'
import { wftCommon } from '@/utils/utils'
import React from 'react'

/**
 * 股东穿透-合并统计-持股路径
 */
export const ShowShareSearchLayerByMergeSharePath: React.FC<{
  row: any
}> = ({ row }) => {
  // type为2
  const data = row.shareRoute
  if (data && data.length > 0) {
    const pathArr = data
    let pingParam = '' //bury
    const arr = []

    for (let j = 0; j < pathArr.length; j++) {
      arr.push('<div class="path-shareholdertrace">')
      for (let i = 0; i < pathArr[j].length; i++) {
        const nameR = pathArr[j][i].shareholderName ? pathArr[j][i].shareholderName : '--'
        const ratio = pathArr[j][i].percent ? wftCommon.formatPercent(pathArr[j][i].percent) : '--'
        const type = pathArr[j][i].shareholderId && pathArr[j][i].shareholderId.length > 13 ? 'person' : 'company'
        const code = pathArr[j][i].shareholderId ? pathArr[j][i].shareholderId : ''
        const css = code ? ' wi-secondary-color underline wi-link-color ' : ''
        pingParam += '&opId=' + code
        if (i === 0 && row.type === 'bond') {
          if (window.external && window.external.ClientFunc) {
            arr.push(
              '<span class="underline wi-secondary-color wi-link-color" data-page="Funds" data-code="' +
                code +
                '" data-name="' +
                nameR +
                '" data-pingParam="' +
                pingParam +
                '">' +
                nameR +
                '</span>'
            )
          } else {
            arr.push('<span>' + nameR + '</span>')
          }
        } else {
          if (!code || code.length > 15) {
            arr.push(
              '<span data-name="' +
                nameR +
                '" data-type="' +
                type +
                '" data-code="' +
                code +
                '" data-pingParam="' +
                pingParam +
                '">' +
                nameR +
                '</span>'
            )
          } else {
            arr.push(
              '<span class="' +
                css +
                '" data-name="' +
                nameR +
                '" data-type="' +
                type +
                '" data-code="' +
                code +
                '" data-pingParam="' +
                pingParam +
                '"><a onClick={window.open("#/companyDetail?needtoolbar=1&companycode=' +
                code +
                '")}>' +
                nameR +
                '</a></span>'
            )
          }
        }
        if (i != pathArr[j].length - 1) {
          arr.push('<span class="bow-path"><span class="bow-path-text">' + ratio + '</span></span>')
        }
      }
      arr.push('</div>')
    }
    const rtnStr = arr.join('')

    const rtnStrLen = rtnStr.replace(/(<([^>]+)>)/gi, '')
    if (rtnStrLen.length > 80) {
      const id = row.shareholderId || row.shareholderName
      return <LongTxtMergenceLabel txt={rtnStr} expand={expandHandle} id={id} code={row.windId} />
    } else {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: rtnStr,
          }}
        ></div>
      )
    }
  } else {
    return '--'
  }
}
