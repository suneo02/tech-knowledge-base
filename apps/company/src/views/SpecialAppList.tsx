import SpecialAppFilterTab from '@/components/specialAppFilterTab'
import SpecialAppNav from '@/components/specialAppNav'
import TableNew from '@/components/table/TableNew'
import ToolsBar from '@/components/toolsBar'
import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { Input } from '@wind/wind-ui'
import React, { useEffect, useRef, useState } from 'react'
import { pointBuriedByModule } from '../api/pointBuried/bury'
import { SpecialAppListConfig } from '../locales/constants'
import intl from '../utils/intl'
import { wftCommon } from '../utils/utils'
import { useSpecialCorpListPageTitle } from './sepcialCorpList/config'
import './SpecialAppList.less'

const Search = Input.Search

function SpecialAppList(props) {
  const [activeKey, setActiveKey] = useState(wftCommon.parseQueryString('pageType', window.location.search))
  useSpecialCorpListPageTitle(activeKey)
  const currentRef = useRef(null)
  const [filter, setFilter] = useState({}) // 修改搜索类型
  const [title, setTitle] = useState(intl('142006', '上市企业')) // 默认title

  const [companyName, setCompanyName] = useState('') // 搜索的值
  const [filterObj, setFilterObj] = useState() // tab filter key
  const [tableData, setTableData] = useState() // 默认上市企业

  // input change
  const inputChange = (e) => {
    let val = e.target.value
    if (val.length === 0) {
      setCompanyName('')
    }
  }

  // filter tabs click
  const onFiltersHandle = (objData) => {
    setFilterObj(objData.params)
  }

  // nav click
  const navClickHandle = (key) => {
    setCompanyName('')
    init(key)
  }

  const init = (activeKeyParam) => {
    setActiveKey(activeKeyParam)
    let tableDataObj = SpecialAppListConfig[activeKeyParam]
    setTableData(tableDataObj)
    setTitle(tableDataObj.title)
    setFilterObj(tableDataObj.defaultParams)
  }

  useEffect(() => {
    const activeKey = wftCommon.parseQueryString('pageType', window.location.search)
    if (activeKey) {
      init(activeKey)
    }
  }, [])

  useEffect(() => {
    if (currentRef.current) {
      setFilter({
        ...filterObj || {},
        companyname: companyName || '',
      })
    } else {
      currentRef.current = true
    }
    // @ts-expect-error filterObj is undefined
  }, [companyName, filterObj?.corpNature])

  const gotoBrowser = () => {
    pointBuriedByModule(922602101045)
    // @ts-expect-error filterObj is undefined
    const corpNature = filterObj?.corpNature
    // @ts-expect-error filterObj is undefined
    const route = filterObj?.route
    let type = ''
    let val = '1'
    if (route && route == 'otherFinancial') {
      type = 'otherFinancial'
    }
    if (corpNature) {
      switch (corpNature) {
        case '中央企业':
          type = 'corporation_tags_1'
          break
        case '中央国有企业':
          type = 'corporation_tags_2'
          break
        case '省级国有企业|市级国有企业|区县级国有企业':
          type = 'corporation_tags_3'
          break
      }
    }
    return wftCommon.jumpJqueryPage(`index.html#/findCustomer?type=${type}&val=${val}&itemId=`)
  }

  return (
    <React.Fragment>
      <div className="special-app-list">
        <div className="bread-crumb">
          <div className="bread-crumb-content">
            <span
              className="last-rank"
              onClick={() => window.open(getUrlByLinkModule(LinksModule.HOME))}
              data-uc-id="8yGXfHi-v4w"
              data-uc-ct="span"
            >
              {intl('19475', '首页')}
            </span>
            <i></i>

            <span>{intl('244162', '特色企业')}</span>
          </div>
        </div>
        <div className="special-list-wrap">
          <SpecialAppNav
            config={SpecialAppListConfig}
            navClickHandle={navClickHandle}
            data-uc-id="uoBDwjVARRg"
            data-uc-ct="specialappnav"
          />

          <div className="content-special-list">
            <div className="widget-header">
              <span className="title">{title}</span>

              <Search
                key={title}
                placeholder={intl('437746', '请输入公司、地区等关键词')}
                style={{ width: 240 }}
                onSearch={(value) => {
                  // 原来代码很恶心，没有key!!!，纯中文判断 by calvin
                  if (title === intl('142006', '上市企业')) {
                    pointBuriedByModule(922602101037)
                  } else if (title === intl('220263', '发债企业')) {
                    pointBuriedByModule(922602101038)
                  } else if (title === intl('252985', '央企国企')) {
                    pointBuriedByModule(922602101040)
                  } else if (title === intl('48058', '金融机构')) {
                    pointBuriedByModule(922602101042)
                  } else if (title === intl('265623', 'PEVC被投企业')) {
                    pointBuriedByModule(922602101043)
                  }
                  setCompanyName(value)
                }}
                allowClear
                onChange={(e) => inputChange(e)}
                data-uc-id={`49ScDZpOTau${title}`}
                data-uc-ct="search"
                data-uc-x={title}
              />
            </div>

            <SpecialAppFilterTab
              onFiltersHandle={onFiltersHandle}
              // @ts-expect-error tableData is undefined
              filtersData={tableData?.filters}
              data-uc-id="ZrlTTvSWtd3"
              data-uc-ct="specialappfiltertab"
            />

            <div className="table-container">
              {Object.getOwnPropertyNames(filter).length > 0 ? (
                <TableNew
                  // @ts-expect-error tableData is undefined
                  {...tableData}
                  nodes={{ filter: filter }}
                  titleRender={(total) =>
                    // @ts-expect-error total is string
                    intl('437787', '共找到%家企业').replace('%', ` ${wftCommon.formatMoneyComma(total)}` || 0)
                  }
                  footerLeftRender={
                    <div className="page-tip">
                      {intl('437760', '注：请输入关键词进行搜索，搜索结果最多展示40条数据，筛选更多企业请使用')}
                      <span onClick={gotoBrowser} data-uc-id="_uEBp_nFETv" data-uc-ct="span">
                        {intl('259750')}
                      </span>
                      {intl('437893', '功能')}
                    </div>
                  }
                  maxTotal={40}
                />
              ) : null}
            </div>
          </div>
        </div>
        <ToolsBar backTopWrapClass="page-container" isShowHome={true} isShowFeedback={true} />
      </div>
    </React.Fragment>
  )
}

export default SpecialAppList
