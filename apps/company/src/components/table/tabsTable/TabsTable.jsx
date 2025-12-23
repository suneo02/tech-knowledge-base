import { Tabs } from '@wind/wind-ui'
import { useState } from 'react'
import CardHeader from '@/components/common/card/header/Header'
import TableNew from '../TableNew'
/**
 * 标签页Table组件
 * @param {*} param
 * @returns
 */
const TabsTable = ({ tabs, tableProps }) => {
  const [activeKey, setActiveKey] = useState(tabs[0].key)
  const tab = tabs?.find((res) => res.key === activeKey)
  const operations = tab?.downDocType ? <CardHeader hiddenTxt={true} {...tab} /> : null
  return (
    <Tabs
      tabBarExtraContent={operations}
      onTabClick={(key) => setActiveKey(key)}
      data-uc-id="LGPtAvcYF2"
      data-uc-ct="tabs"
    >
      {tabs?.map((res, index) => (
        <Tabs.TabPane
          tab={
            <span>
              {res.title}
              {res.num ? <span className="num">{`（${res.num}）`}</span> : null}
            </span>
          }
          key={res.treeKey || res.key || `tabs-${index}`}
          disabled={(!res.num || res.num === '0') && !res.display}
          data-uc-id="aVUG3G59HF"
          data-uc-ct="tabs"
          data-uc-x={res.treeKey || res.key || `tabs-${index}`}
        >
          <TableNew nodes={tableProps} {...res} key={res.treeKey || res.key || `tabs-table-${index}`} />
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}

export default TabsTable
