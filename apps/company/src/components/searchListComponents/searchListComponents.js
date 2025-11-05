import { DownloadO } from '@wind/icons'
import { Button, Select, Spin, Tag } from '@wind/wind-ui'
import { isArray } from 'lodash'
import React from 'react'
import intl from '../../utils/intl'
import { Nodata, wftCommon } from '../../utils/utils'
import './history.less'

const Option = Select.Option
const searchTitle = [
  {
    type: '全球企业',
    typeId: '206099',
    data: 'outCompanySearch',
    url: 'index.html#/globalSearch?type=global',
  },
  {
    type: '中国企业',
    typeId: '138835',
    data: 'searchList',
    url: 'index.html#/globalSearch',
  },
  {
    type: '人物',
    typeId: '138433',
    data: 'personSearchList',
  },
  {
    type: '集团系',
    typeId: '148622',
    data: 'groupSearchList',
  },
  {
    type: '招投标',
    typeId: '271633',
    data: 'bidSearchList',
  },
  {
    type: '知识产权',
    typeId: '120665',
    data: 'intelluctalSearch',
  },
  // {
  //   type: '法律诉讼',
  //   typeId: '271677',
  //   data: 'risk',
  // },
]
export const HistoryList = (props) => {
  let title = props.title
  let listShowFun = props.listShowFun
  let isDelete = props.isDelete

  const companyView = props.list
  return (
    <div className="company_see" id="ModelHistory">
      <h3 className="see_title" id="viewcompany">
        <span className="fl" langkey="">
          {title}
        </span>
        {props.allDelete ? (
          <a className="del-all buryClick" id="hisViewDelAllBtn" onClick={props.showModal}>
            <i></i>
          </a>
        ) : null}
      </h3>
      <ul id="FocusHistroy">
        {companyView
          ? companyView.map((item, index) => {
              return listShowFun(item, isDelete, index, companyView)
            })
          : null}
      </ul>
    </div>
  )
}

export const ResultContainer = (props) => {
  let resultNum = props.resultNum
  let collationOption = props.list
  let loading = props.loading
  let loadingList = props.loadingList
  let result = props.resultType
  let errorCode = props.errorCode
  let showError = ''
  let css = props.css || ''

  const resultList = props.resultList

  const resultComp =
    isArray(resultList) &&
    resultList.map((item, index) => {
      return <div key={item?.corp_id || index}>{props.searchCallBack(item)}</div>
    })

  if (errorCode == '-2') {
    showError = (
      <>
        {resultComp}
        <div className="loading-failed">
          <p>
            {intl('313373', '加载失败，请重试')} {`(${errorCode})`}{' '}
          </p>
          <p>
            <Button size="default" type="primary" onClick={props.reload}>
              {intl('138836', '确定')}
            </Button>
          </p>
        </div>
      </>
    )
  } else if (errorCode == '-13' || errorCode == '-9') {
    showError = (
      <>
        {resultComp}
        <div className="loading-failed">
          <p>
            {intl('317013', '您的查询数量已超限，请明日再试。若有疑问，请联系客户经理。')} {`(${errorCode})`}{' '}
          </p>
        </div>
      </>
    )
  } else if (errorCode && errorCode !== '0') {
    showError = (
      <>
        {resultComp}
        <div className="loading-failed">
          <p>
            {intl('313373', '加载失败，请重试')} {`(${errorCode})`}{' '}
          </p>
        </div>
      </>
    )
  } else {
    showError = loading ? <Spin /> : isArray(resultList) && resultList.length > 0 ? resultComp : <Nodata />
  }
  result = result.replace(/%/, '<span className="important-color wi-secondary-color">' + resultNum + '</span>')
  return (
    <div className={`frame-container ${css}`}>
      <div className="tit-frame-container">
        <div className={`result-r${props.hideTabs ? ' hide-tabs' : ''}`}>
          <p className="fl" id="searchResultNum" dangerouslySetInnerHTML={{ __html: result }}></p>
          {collationOption && collationOption.length > 0 ? (
            <div style={{ float: 'right', marginRight: 15, height: 45, lineHeight: '44px' }}>
              <Select
                allowClear
                placeholder="默认排序"
                style={{ width: 135 }}
                onChange={(e) => props.handleChange(e, 'sort')}
                value={props.selectValue || ''}
              >
                {collationOption.map(({ sort, sortid, key }) => {
                  return <Option key={key}>{intl(sortid, sort)}</Option>
                })}
              </Select>
              {props.export && !wftCommon.is_overseas_config ? (
                <Button icon={<DownloadO />} onClick={props.download} style={{ marginLeft: '15px' }}>
                  {intl('4698', '导出数据')}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <div id="div_DataList" className="div_CardList">
        {showError}
      </div>
    </div>
  )
}

export const AlreadyChooseFilter = (prop) => {
  let allFilter = prop.list
  let zhkeys = window.__GLOBAL__ZHKEYS__ || ''
  return allFilter.length > 0 ? (
    <div className="condition-list">
      <span className="condition-list-tips">
        <span langkey="">{intl('143069', '已选条件')}</span>：
      </span>
      <ul id="selectedCondition" className="selected-condition">
        {allFilter.map((item, index) => {
          let rawtext =
            window.en_access_config && zhkeys ? (zhkeys[item.value] ? zhkeys[item.value] : item.value) : item.value
          const isLongText = rawtext.length > 10
          let text = isLongText ? `${rawtext.slice(0, 10)}...` : rawtext // 大于10个字的...
          return (
            <Tag
              key={item.type}
              title={isLongText ? `${item.type}：${rawtext}` : null}
              type="primary"
              size="small"
              closable
              onClose={() => prop.delete(item.filter, item.type)}
            >
              {' '}
              {item.type}：{text}
            </Tag>
          )
        })}
      </ul>
      <Button id="clearAllCondtion" langkey="" onClick={prop.deleteAll}>
        {intl('138490', '重置条件')}
      </Button>
    </div>
  ) : null
}

export const SearchTitleList = (prop) => {
  return (
    <div className="home-fun-search search-tab-fix">
      <ul className="change-title-search serach-ui-fix" id="changeTitleSearch">
        {searchTitle.map((item) => {
          if (wftCommon.is_overseas_config) {
            // 海外 查人物 不可见
            if (item.data == 'personSearchList') {
              return ''
            }
          }
          return (
            <li
              key={item.typeId}
              className={item.data == prop.name ? 'wi-secondary-color sel' : ''}
              onClick={() => {
                if (item.url) {
                  wftCommon.jumpJqueryPage(
                    `${item.url}${localStorage.getItem('searchValue') ? (item.url.includes('?') ? `&` : `?`) + `keyword=${localStorage.getItem('searchValue')}` : ''}`
                  )
                  return
                }
                prop.jump(item.data)
              }}
            >
              <span>{intl(item.typeId, item.type)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
