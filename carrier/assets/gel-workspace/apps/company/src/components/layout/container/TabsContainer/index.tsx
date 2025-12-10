import { Tabs } from '@wind/wind-ui'
import './index.less'
import intl from '../../../../utils/intl'
import { pointBuriedByModule } from '../../../../api/pointBuried/bury'
import { checkComponentHidden } from '../../../../store/handle'
import React from 'react'

/**
 * 标签页Table组件
 * @param {*} param
 * @returns
 */
const TabsContainer = ({ tabs, children }) => {
  // const pointBuried = useGroupStore((store) => store.pointBuried)
  // 检查是否所有的 tabs 是否都是 disabled ，如果都是，这个组件就不渲染了，不然wind table 会报错
  if (tabs.every((tab) => checkComponentHidden(tab))) {
    return null
  }
  return (
    <Tabs
      className="calvin-tab-box-4"
      onChange={(v) => {
        const cur = tabs?.find((res) => v === res.title)
        console.log(cur)
        if (cur?.bury) {
          const { id, ...rest } = cur.bury
          console.log('今日')
          pointBuriedByModule(id, rest)
        }
      }}
      data-uc-id="y4PgZxuk2w"
      data-uc-ct="tabs"
    >
      {tabs?.map((res) => (
        <Tabs.TabPane
          tab={
            <span>
              {intl(res.titleId, res.title)}
              {res.num ? <span className="num">{`（${res.num}）`}</span> : null}
            </span>
          }
          key={res.title}
          disabled={checkComponentHidden(res)}
          data-uc-id="LGW7BGEZTw"
          data-uc-ct="tabs"
          data-uc-x={res.title}
        >
          {children({ ...res, hiddenTxt: true })}
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}
export default TabsContainer
