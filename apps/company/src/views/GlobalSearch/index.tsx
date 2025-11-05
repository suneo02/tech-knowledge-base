import LayoutScrollContent from '@/components/layout/layoutScrollContent'
import StickyBox from '@/components/StickyBox'
import { hashParams } from '@/utils/links'
import React, { useState } from 'react'
import GSTabs from './components/GSTabs'
import HistorySearch from './components/HistorySearch'
import './index.less'
import { GSTabsEnum } from './types'
import PopularSearch from './components/PopularSearch'
import { parseQueryString } from '@/lib/utils'

const StylePrefix = 'global-search'

const DEFAULT_RIGHT_BOX_WIDTH = 280 // 默认右侧宽度
const PRIMARY_TOP = 12 // 通用距离

const GlobalSearch = () => {
  const getParamValue = parseQueryString()
  const GSType = getParamValue['type'] as GSTabsEnum
  const [type, setType] = useState<GSTabsEnum>(GSType || GSTabsEnum.CHINA)
  const [active, setActive] = useState<GSTabsEnum>(GSType || GSTabsEnum.CHINA)
  const queryText = getParamValue['keyword']
  console.warn('queryText: ', queryText)

  return (
    <LayoutScrollContent title="全球企业搜索" showBackTop>
      <StickyBox offsetTop={0} style={{ zIndex: 3 }} className={`${StylePrefix}--overflow-box`}></StickyBox>
      <div style={{ position: 'relative', width: '100%', display: 'flex' }}>
        <div style={{ flex: 1, maxWidth: 1000 }}>
          <GSTabs type={type} queryText={queryText} onChange={setActive} onUserActionChange={setType} />
        </div>
        <div style={{ width: DEFAULT_RIGHT_BOX_WIDTH, minWidth: DEFAULT_RIGHT_BOX_WIDTH }}>
          <div className={`${StylePrefix}--right-box`}>
            <StickyBox offsetTop={PRIMARY_TOP} style={{ zIndex: 1 }}>
              <HistorySearch />
              {active === GSTabsEnum.CHINA ? <PopularSearch /> : null}
            </StickyBox>
          </div>
        </div>
      </div>
    </LayoutScrollContent>
  )
}

export default GlobalSearch
