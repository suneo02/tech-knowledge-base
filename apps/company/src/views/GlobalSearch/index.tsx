import LayoutScrollContent from '@/components/layout/layoutScrollContent'
import StickyBox from '@/components/StickyBox'
import { hashParams } from '@/utils/links'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import GSTabs from './components/GSTabs'
import HistorySearch from './components/HistorySearch'
import './index.less'
import { GSTabsEnum } from './types'
import PopularSearch from './components/PopularSearch'

const StylePrefix = 'global-search'

const DEFAULT_RIGHT_BOX_WIDTH = 280 // 默认右侧宽度
const PRIMARY_TOP = 12 // 通用距离

type GlobalSearchProps = {
  globalSearchTimeStamp?: number
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ globalSearchTimeStamp }) => {
  const { getParamValue } = hashParams()
  const GSType = getParamValue('type') as GSTabsEnum
  const [type, setType] = useState<GSTabsEnum>(GSType || GSTabsEnum.CHINA)
  const [active, setActive] = useState<GSTabsEnum>(GSType || GSTabsEnum.CHINA)
  const queryText = getParamValue('keyword')

  return (
    <LayoutScrollContent title="全球企业搜索" showBackTop>
      <StickyBox offsetTop={0} style={{ zIndex: 3 }} className={`${StylePrefix}--overflow-box`}></StickyBox>
      <div style={{ position: 'relative', width: '100%', display: 'flex' }}>
        <div style={{ flex: 1, maxWidth: 1000 }}>
          <GSTabs
            type={type}
            queryText={queryText}
            globalSearchTimeStamp={globalSearchTimeStamp}
            onChange={setActive}
            onUserActionChange={setType}
            data-uc-id="QAnvQikDox"
            data-uc-ct="gstabs"
          />
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

const mapStateToProps = (state) => {
  return {
    globalSearchTimeStamp: state.companySearchList.globalSearchTimeStamp,
  }
}

export default connect(mapStateToProps)(GlobalSearch)
