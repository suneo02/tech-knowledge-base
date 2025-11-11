import intl from '../../../../utils/intl'
import React from 'react'
import { isArray } from 'lodash'
import { PackUpDefaultO, UnfoldDefaultO } from '@wind/icons'

export const industryTdRender = (txt, row) => {
  if (!(txt && txt.length)) {
    return '--'
  }
  let expand = false // 超过3条 可进行展开/收起操作
  if (txt.length > 3) {
    expand = true
  }
  let expanded = txt.expanded || false // 是否已展开状态
  return (
    <div className={expand ? (expanded ? 'patent-detail-industry-expanded' : 'patent-detail-industry-expandnot') : ''}>
      {txt.map((t, idx) => {
        // 初始状态 只显示 0 1 2 ，三条数据
        if ((!expanded && idx > 2) || !isArray(t)) return null
        return (
          <>
            <div className="patent-detail-industry">{t.join(' > ')}</div>
            <br />
          </>
        )
      })}
      {expand ? (
        !expanded /** expand - 具有展开、收起 按钮 */ ? (
          /** expanded - 当前是初始状态 */
          <div
            className="patent-detail-icon"
            onClick={() => {
              if (txt.clickFn) txt.clickFn(txt)
            }}
            data-uc-id="hSvM20a7Ik"
            data-uc-ct="div"
          >
            <UnfoldDefaultO
              style={{ fontSize: 18, color: '#00aec7' }}
              data-uc-id="hBSpJ40BXi"
              data-uc-ct="unfolddefaulto"
            />{' '}
            {intl('12095', '全部展开')}
          </div>
        ) : (
          <div
            className="patent-detail-icon"
            onClick={() => {
              if (txt.clickFn) txt.clickFn(txt)
            }}
            data-uc-id="3lxEluG7pQ"
            data-uc-ct="div"
          >
            <PackUpDefaultO
              style={{ fontSize: 18, color: '#00aec7' }}
              data-uc-id="3ezfNaJSG"
              data-uc-ct="packupdefaulto"
            />{' '}
            {intl('119102', '收起')}
          </div>
        )
      ) : null}
    </div>
  )
}
