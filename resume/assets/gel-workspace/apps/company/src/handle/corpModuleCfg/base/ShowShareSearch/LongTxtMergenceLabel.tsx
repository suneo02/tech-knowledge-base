import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import intl from '../../../../utils/intl'
import { wftCommon } from '../../../../utils/utils'

let loading = false
const BODYOFFSETTOP = 18
const LongTxtMergenceLabel = (props) => {
  const { txt, expand, id, code } = props
  const [open, setOpen] = useState(true)
  const [text, setText] = useState('')
  const openFun = () => {
    if (loading) {
      return
    }
    loading = true
    if (expand) {
      expand({
        code,
        id,
        callback: (data) => {
          if (data.length > 0) {
            loading = false
            const pathArr = data
            let pingParam = '' //bury
            const arr = []

            for (let j = 0; j < pathArr.length; j++) {
              arr.push('<div class="path-shareholdertrace">')
              for (let i = 0; i < pathArr[j].length; i++) {
                const nameR = pathArr[j][i].shareholderName ? pathArr[j][i].shareholderName : '--'
                const ratio = pathArr[j][i].percent ? wftCommon.formatPercent(pathArr[j][i].percent) : '--'
                const type =
                  pathArr[j][i].shareholderId && pathArr[j][i].shareholderId.length > 13 ? 'person' : 'company'
                const code = pathArr[j][i].shareholderId ? pathArr[j][i].shareholderId : ''
                const css = code ? ' wi-secondary-color underline wi-link-color ' : ''
                pingParam += '&opId=' + code
                if (i === 0 && pathArr[j][i].type === 'bond') {
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
            setText(rtnStr)
            setOpen(!open)
          }
        },
      })
    } else {
      setOpen(!open)
    }

    if (!open) {
      const tableOffsetTop =
        // @ts-expect-error ttt
        document.querySelector('#showShareSearch').offsetTop +
        // @ts-expect-error ttt
        document.querySelector(`.companyTab`).offsetTop +
        BODYOFFSETTOP
      document.querySelector('.companyBody').scrollTo({ top: tableOffsetTop, behavior: 'instant' })
    }
  }

  useEffect(() => {
    setText(txt)
  }, [txt])

  return (
    <Box>
      <div className={open ? 'long-txt-label-2' : ''} dangerouslySetInnerHTML={{ __html: text }}></div>
      <div className="wi-btn-color" onClick={openFun}>
        {' '}
        {open ? intl('28912', '展开') : intl('119102', '收起')}{' '}
      </div>
    </Box>
  )
}

const Box = styled.div``

export default LongTxtMergenceLabel
