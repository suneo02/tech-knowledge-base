import { Tabs } from '@wind/wind-ui'
import './index.less'
import intl from '../../../../utils/intl'
import { pointBuriedByModule } from '../../../../api/pointBuried/bury'
import { checkComponentHidden } from '../../../../store/handle'
import React, { FC } from 'react'
import { ICfgDetailCompJson } from '@/types/configDetail/module'

interface TabsContainerProps {
  tabs: ICfgDetailCompJson[]
  children: (tab: ICfgDetailCompJson & { hiddenTxt: boolean }) => React.ReactNode
}

// Tabs container optimized for Wind UI with analytics hook and disabled handling
const TabsContainer: FC<TabsContainerProps> = ({ tabs, children }) => {
  // Do not render when all tabs are hidden/disabled to prevent UI errors
  if (tabs.length && tabs.every((tab) => checkComponentHidden(tab))) {
    return null
  }

  const handleChange = (value: string) => {
    const cur = tabs.find((res: ICfgDetailCompJson) => value === res.title)
    if (cur?.bury) {
      const { id, ...rest } = cur.bury
      pointBuriedByModule(Number(id), rest as any)
    }
  }

  return (
    <Tabs className="calvin-tab-box-4" onChange={handleChange} data-uc-id="y4PgZxuk2w" data-uc-ct="tabs">
      {tabs.map((res) => (
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
