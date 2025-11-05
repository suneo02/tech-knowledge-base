import { VipPopup } from '@/lib/globalModal.tsx'
import { DownO } from '@wind/icons'
import { Button, Dropdown, Link, Menu } from '@wind/wind-ui'
import React, { useEffect, useRef, useState } from 'react'
import { getQueryCommonList } from '../../api/searchListApi.ts'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils.tsx'

import { pointBuriedByModule } from '@/api/pointBuried/bury.ts'
import { homeSelectDate, homeSelectType } from '@/views/HomeAI/comp/CorpDynamic/config.ts'
import { mapDynamicDetail } from '../HomeAI/comp/CorpDynamic/dynamicDetailMapper.ts'
import { mapText2JSX } from '../HomeAI/comp/CorpDynamic/linkMapper.ts'
import './HomeLatestNews.less'

const SubMenu = Menu.SubMenu

let isLoading = false
let sortAfter = ''
let allArr = []
let zh2enArr = []
function SearchHome(props) {
  const [selectDate, setSelectDate] = useState(intl('72086', '全部时间')) // 选中时间下拉框的名称
  const [selectDateVal, setSelectDateVal] = useState('365') // 选中时间下拉框的值
  const [selectType, setSelectType] = useState(intl('12074', '全部类型')) // 选中类型下拉框的名称
  const [selectTypeVal, setSelectTypeVal] = useState('') // 选中类型下拉框的值
  const [lastDatas, setLastDatas] = useState([]) // 企业最新动态
  const [dynamicHeader, setDynamicHeader] = useState(true) // 是否展示table title
  const [lastDatasCode, setLastDatasCode] = useState<string | number>('0') // 企业动态请求返回的errorCode
  const [dynamicEventLoaded, setDynamicEventLoaded] = useState(false) // 数据全部加载完成
  const [category, setCategory] = useState('') // 请求参数
  const [eventType, setEventType] = useState('') // 请求参数
  const [scrollYOld, setScrollYOld] = useState('') // 请求参数
  const [dynamicLoading, setDynamicLoading] = useState(false) // loading文字显示
  const [loadAllDone, setLoadAllDone] = useState(false) // 是否加载全部
  const initRef = useRef(null)

  useEffect(() => {
    scrollHandle(props.scrollObj)
  }, [props.scrollObj.scrollTop])
  // 监控选择的下拉框值发生改变后重新发起请求
  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true
    } else {
      allArr = []
    }
    getBid()
  }, [category, eventType, selectDateVal])

  // 全部类型下拉框数据
  const menuType = (
    // @ts-expect-error ttt
    <Menu onClick={(e) => selectChangeHandle(e, 'type')} selectedKeys={selectTypeVal}>
      {homeSelectType.map((item) => {
        return !item?.children ? (
          <Menu.Item
            key={item.name}
            onClick={(e) => {
              pointBuriedByModule(922602101026)
              menuItemClick(e, 'type', item)
            }}
          >
            {item.name}
          </Menu.Item>
        ) : (
          // @ts-expect-error ttt
          <SubMenu key={item.name} title={item.name}>
            {item.children.map((childItem) => {
              return (
                <Menu.Item
                  key={childItem.name}
                  onClick={(e) => {
                    pointBuriedByModule(922602101026)
                    menuItemClick(e, 'type', childItem)
                  }}
                >
                  {childItem.name}
                </Menu.Item>
              )
            })}
          </SubMenu>
        )
      })}
    </Menu>
  )

  // 全部时间下拉框数据
  const menuDate = (
    // @ts-expect-error ttt
    <Menu selectedKeys={selectDateVal}>
      {homeSelectDate.map((item) => {
        return (
          <Menu.Item
            key={item.code}
            onClick={(e) => {
              pointBuriedByModule(922602101027)
              menuItemClick(e, '', item)
            }}
          >
            {item.name}
          </Menu.Item>
        )
      })}
    </Menu>
  )

  // 下拉框选择事件
  const selectChangeHandle = (e, flag) => {
    if (flag === 'type') {
      // 设置下拉框选中值
      setSelectTypeVal(e.keyPath)
    }
  }

  // 下拉框点击事件
  const menuItemClick = (e, flag, data) => {
    if (flag === 'type') {
      // 设置下拉框选中值
      setSelectType(data.name)

      const code = data.val
      const lev = data.lev
      setCategory(data.parentVal || '')
      if (lev == 1) {
        setEventType('')
      } else {
        if (code == '招投标信息') {
          setEventType('招投标公告')
        } else {
          setEventType(code)
        }
      }
    } else {
      // 设置下拉框选名字
      setSelectDate(data.name)
      // 设置下拉框选中值
      setSelectDateVal(e.key)

      document.getElementsByClassName('search-home')[0].scrollTop = 0
    }
  }

  // 请求企业最新动态数据
  const searchRequestList = () => {
    isLoading = true
    const date = wftCommon.format()
    getQueryCommonList({
      url: '/Wind.WFC.Enterprise.Web/Enterprise/gel/search/company/getmycorpeventlistnew',
      data: {
        foldType: '',
        category: category,
        eventType: eventType,
        type: 2,
        endDate: date,
        dateRange: selectDateVal,
        pageRoll: true,
        sortAfter: sortAfter,
        pageSize: 20,
      },
    })
      .then((res) => {
        isLoading = false
        if (!res.Data) {
          setDynamicLoading(false)
          return
        }
        zh2enArr = [...res.Data]

        // 小于20表示为最后一页，不显示loading文字
        if (res.Data.length < 20) {
          setDynamicLoading(false)
          setLoadAllDone(true)
        } else {
          setDynamicLoading(true)
          setLoadAllDone(false)
        }

        zh2enArr.forEach((i) => {
          i.text = mapDynamicDetail(i)
          i.event_type_raw = i.event_type
        })

        allArr = [...allArr, ...zh2enArr]

        const len = allArr.length
        if (len > 50) {
          setDynamicEventLoaded(true)
          setDynamicLoading(false)
          allArr = allArr.slice(0, 50)
        } else {
          setDynamicEventLoaded(false)
        }

        if (window.en_access_config && allArr?.length) {
          if (!sortAfter) {
            // 仅第一页，采用先展示中文，后展示英文方式，后续还是沿用 中文+英文，方式，避免填充数据紊乱
            setLastDatas(allArr)
          }
          wftCommon.zh2en(
            wftCommon.deepClone(allArr),
            (newData) => {
              setLastDatas((i) => newData || [])
            },
            null,
            null,
            ['event_type', 'corp_name', 'text']
          )
        } else {
          setLastDatas(allArr || [])
        }

        setLastDatasCode(res.ErrorCode)

        sortAfter = allArr[len - 1]?.sortAfter?.replace(/\-/g, '')
        if (res.ErrorCode === '-10') {
          setDynamicEventLoaded(true)
          setDynamicLoading(false)
          VipPopup({ title: intl('282273', '我的企业动态') })
          return
        } else if (res.ErrorCode == '-13' || res.ErrorCode == '-9') {
          setDynamicEventLoaded(true)
          setDynamicLoading(false)
          VipPopup({
            title: intl('31041', '提示'),
            description: intl('333838', '购买VIP/SVIP套餐，获取更多数据查看条数'),
          })
          return
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const formatBusinessStr = (str) => {
    if (str && str.length > 0) {
      if (str.substring(0, 2) == '发生') {
        str = str.substring(2)
      }
      const len = str.length
      if (str.substring(len - 2) == '变更') {
        str = str.substring(0, len - 2)
      }
      return str
    } else {
      return '--'
    }
  }

  // 加载失败，重试操作
  const getBid = () => {
    window.scrollTo({ top: 0 })
    sortAfter = ''
    searchRequestList()
  }

  const scrollHandle = (scrollObj) => {
    if (
      scrollObj.scrollHeight - scrollObj.scrollTop - scrollObj.clientHeight <= 100 &&
      scrollObj.scrollTop > scrollYOld && // 向下滚动
      !isLoading &&
      !dynamicEventLoaded // 没有全部加载完成
    ) {
      pointBuriedByModule(922602101025)
      searchRequestList()
    }
    setScrollYOld(scrollObj.scrollTop)
  }

  return (
    <React.Fragment>
      <div className="home-current">
        <div className="home-current-top">
          <span className="latest">{intl('437234', '企业最新动态')}</span>

          <div className="dropdown-wrap">
            <Dropdown trigger={['click']} overlay={menuType}>
              <Button>
                {selectType} <DownO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              </Button>
            </Dropdown>
            <Dropdown trigger={['click']} overlay={menuDate}>
              <Button>
                {selectDate} <DownO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              </Button>
            </Dropdown>
          </div>
        </div>

        <div className="home-current-body">
          <div className="home-current-content">
            {/* table title */}
            {dynamicHeader && !(lastDatas.length === 0 || lastDatasCode !== '0') && (
              <table className="table-dynamic-header">
                <thead>
                  <tr>
                    {/*// @ts-expect-error ttt*/}
                    <th width="18%">{intl('437308', '动态时间')}</th>
                    {/*// @ts-expect-error ttt*/}
                    <th width="18%">{intl('437226', '动态类别')}</th>
                    {/*// @ts-expect-error ttt*/}
                    <th width="64%">{intl('437327', '动态摘要')}</th>
                  </tr>
                </thead>
              </table>
            )}
            <table className="table-dynamic">
              <tbody>
                {lastDatasCode === '-2' && (
                  <tr>
                    {/*// @ts-expect-error ttt*/}
                    <td colSpan="4">
                      <div className="loading-failed">
                        <p>{intl('313373', '加载失败，请重试}')}</p>
                        <p>
                          <button
                            className="reload-btn"
                            onClick={() => {
                              allArr = []
                              getBid()
                            }}
                          >
                            {intl('333836', '重 试')}
                          </button>
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
                {lastDatas.map((item, index) => {
                  if (
                    !(
                      /1002502502|1058060339/.test(item.corp_id) && /开庭公告|法院公告|裁判文书/.test(item.event_type)
                    ) ||
                    !(item.event_type == '招投标公告' && item.role == '无角色主体')
                  ) {
                    return (
                      <tr key={item.event_id} data-index={index}>
                        <td width="18%">{wftCommon.formatCont(item.event_date)}</td>
                        <td width="18%">
                          {item.event_type ? item.event_type : item.event_category ? item.event_category : '--'}
                        </td>
                        <td>
                          <span>
                            {(() => {
                              const linkInfo = mapText2JSX(item)
                              return linkInfo.href ? (
                                // @ts-expect-error ttt
                                <Link target="_blank" href={linkInfo.href}>
                                  {linkInfo.text}
                                </Link>
                              ) : (
                                linkInfo.text
                              )
                            })()}
                          </span>
                        </td>
                      </tr>
                    )
                  }
                })}
                {(lastDatas.length === 0 || lastDatasCode !== '0') && (
                  <tr className="tr-loading tr-loadingdata">
                    {/*// @ts-expect-error ttt*/}
                    <td colSpan="4" className="no-list-data" id="dynamicLoading">
                      {intl('132725', '暂无数据')}
                    </td>
                  </tr>
                )}
                {lastDatas.length !== 0 && lastDatas.length === 50 && dynamicEventLoaded && (
                  <tr className="tr-loading tr-loadingdata">
                    {/*// @ts-expect-error ttt*/}
                    <td colSpan="4" className="dynamic-loading-more">
                      {/*// @ts-expect-error ttt*/}
                      <Link target="_blank" href="index.html#/companyDynamic?keyMenu=2">
                        {intl('375453', '首页最多查看50条动态，点此查看更多')}
                      </Link>
                    </td>
                  </tr>
                )}

                {lastDatas.length !== 0 && dynamicLoading && (
                  <tr className="tr-loading tr-loadingdata">
                    {/*// @ts-expect-error ttt*/}
                    <td colSpan="4" className="dynamic-loading">
                      {intl('132761', '加载中')}...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SearchHome
