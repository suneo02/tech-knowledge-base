// @ts-nocheck
import { InfoCircleButton } from '@/components/icons/InfoCircle'
import { DownloadO, FilterO, SearchO } from '@wind/icons'
import Table from '@wind/wind-ui-table'
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { connect } from 'react-redux'

import {
  Affix,
  Breadcrumb,
  Button,
  Checkbox,
  DatePicker,
  Input,
  message,
  Modal,
  Select,
  Tabs,
  Tooltip,
} from '@wind/wind-ui'

import { SpecialStatisticsSection } from './comp/SpecialStatisticsSection'
import { SpecialStatisticsConfigId } from './config/specialStatistics'

import queryString from 'qs'
import CompanyLink from '../../components/company/CompanyLink'
import { getVipInfo } from '../../lib/utils'
import intl from '../../utils/intl'
import { debounce, wftCommon } from '../../utils/utils'

import { globalIndustryOfNationalEconomy2 } from '@/utils/industryOfNationalEconomyTree'
import { pointBuriedNew } from '../../api/configApi'
import {
  corplistarea,
  corplistindustry,
  corpliststatisticcapital,
  corpliststatisticinsured,
  corpliststatistictype,
  createtaskList,
  createtaskRank,
  getCorpListOfLists,
  getCorpListOfRanks,
  ranklistaggselect,
} from '../../api/feturedcompany.js'
import { VipPopup } from '../../lib/globalModal'
import { globalAreaTree } from '../../utils/areaTree'
import './feturedcompany.less'

import { myWfcAjax } from '../../api/companyApi'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import { usePageTitle } from '../../handle/siteTitle'
import { useFeturedListStore } from '../../store/feturedlist'
import CascaderSelect from './comp/CascaderSelect'
import { buryFunctionCode, dateFormat, defaultArea, qualificationStatus, tabBuryList } from './config'
import { getFeaturedCompanyParam } from './handle'
import { formatFeaturedDate } from './handle/date'
import { codeNameMap } from './nameCodeMap/codeNameMap'
import { oldCodeNameMap } from './nameCodeMap/oldCodeNameMap'
import { oldNameCodeMap } from './nameCodeMap/oldNameCodeMap'
import { formatUpdateTime, updatefreqMap } from './util'
import { featuredCompany } from './utils'

const TwolayerMap = React.lazy(() => import('./../../components/map/TwolayerMap/index'))
const TabPane = Tabs.TabPane

const Option = Select.Option
const Search = Input.Search

const { RangePicker } = DatePicker

function Feturedcompany(props: any) {
  const { location } = props
  const { id = '2010202098' } = queryString.parse(location.search, { ignoreQueryPrefix: true })

  const [dataSource, setDataSource] = useState([])
  const [columns, setColumns] = useState([])
  const [options, setOptions] = useState([])
  const [dateValue, setDateValue] = useState('')
  const [dateOptions, setDateOptions] = useState([])
  const [value, setValue] = useState('')
  const [isFilter, setIsFilter] = useState(false)
  const [filterCount, setFilterCount] = useState(0)
  const [originDate, setOriginDate] = useState([])
  const [expireDate, setExpireDate] = useState([])

  const [columnParam, setColumnParam] = useState({})

  const [corpName, setCorpName] = useState('')
  const [includingExpired, setIncludingExpired] = useState(true)

  const [selectConfig, setSelectConfig] = useState() // 筛选项配置
  const [pageNo, setPageNo] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [tableLoading, setTableLoading] = useState(false)
  const [area, setArea] = useState('')
  const [isNoDataBar, setIsNoDataBar] = useState(false)

  const [visible, setVisible] = useState(false)

  const [tabKey, setTabKey] = useState('1')
  // 地区分布table
  const [areaColumns, setAreaColumns] = useState([])
  const [areaDataSource, setAreaDataSource] = useState([])
  const [areaTableData, setAreaTableData] = useState([])
  const [areaTableLoading, setAreaTableLoading] = useState(false)

  // 行业分析table
  const [industryTable, setIndustryTable] = useState([])
  const [industryColumns, setIndustryColumns] = useState([])

  // ipo
  const [ipoTable, setIpoTable] = useState([])
  const [ipoTableLoading, setIpoTableLoading] = useState(false)
  const [ipoColumns, setIpoColumns] = useState([])
  //
  const [typeTable, setTypeTable] = useState([])
  const [typeTableLoading, setTypeTableLoading] = useState(false)
  const [typeColumns, setTypeColumns] = useState([])
  //
  const [moneyTable, setMoneyTable] = useState([])
  const [moneyTableLoading, setMoneyTableLoading] = useState(false)
  const [moneyColumns, setMoneyColumns] = useState([])
  //
  const [personTable, setPersonTable] = useState([])
  const [personTableLoading, setPersonTableLoading] = useState(false)
  const [personColumns, setPersonColumns] = useState([])

  const [checkboxVisible, setCheckboxVisible] = useState({})
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false)
  const [filterDropdownVisibleStart, setFilterDropdownVisibleStart] = useState(false)
  const [filterDropdownVisibleEnd, setFilterDropdownVisibleEnd] = useState(false)
  const [industryDropdownVisible, setIndustryDropdownVisible] = useState(false)
  const [areaDropdownVisible, setAreaDropdownVisible] = useState(false)

  const [indeterminate, setIndeterminate] = useState({})
  const [checkAll, setCheckAll] = useState({})
  const [checkedList, setCheckedList] = useState({})

  const [industrySelect, setIndustrySelect] = useState([])
  const [areaSelect, setAreaSelect] = useState([])

  const [isError, setIsError] = useState(false)
  const [leftVal, setLeftVal] = useState('')
  const [rightVal, setRightVal] = useState('')

  const iframeRef = useRef()
  const industryRoundRef = useRef()
  const ipoChartLRef = useRef()
  const ipoChartRRef = useRef()
  const typeChartRef = useRef()
  const personChartRef = useRef()
  const moneyChartRef = useRef()

  const { headerInfo, getfeturedDetailHeaderInfo } = useFeturedListStore()

  useEffect(() => {
    getfeturedDetailHeaderInfo(id)
  }, [])

  const {
    listColumnConfig,
    category,
    categoryId, // 名录面包屑
    parentLinkNodes, // 榜单面包屑
    count,
    description,
    // objectId,
    objectName, // 当前榜单 or 名录
    showOriginalName,
    type,
    countryCode, //'CHN'为国内，or为海外
    rankAttribute, // 为'2'时是人物榜单
    // 榜单
    source, // 统计来源
    bizDate,
    updatefreq,
    isExtraIncludingExpired, // 是否显示包含已失效
    isExtraAreaSelect, //是否需要额外的地区筛选
  } = headerInfo

  usePageTitle('RankListDetail', objectName)
  // column动态生成
  const configMapFunc = (i) => {
    if (i.field === 'NO.') {
      return {
        title: i.name,
        key: 'No.',
        width: '76px',
        align: 'center',
        render: (txt, row, index) => pageNo * pageSize + index + 1,
      }
    }

    const rendertitle = ({ jumpType, name, field }) => {
      if (jumpType === 'company' && isFilter) {
        return (
          <>
            {name}
            <span
              style={{ color: '#666', fontWeight: 'normal' }}
            >{`(${filterCount ? wftCommon.formatMoney(filterCount, [4, ')']) : filterCount + ')'}`}</span>
          </>
        )
      }
      // 认证年度加info
      if (field === 'certificationYear') {
        return (
          <>
            {name}
            <Tooltip
              overlayClassName="corp-tooltip"
              title={intl(
                '388173',
                '通过复核和拟通过复核状态下，认证年度指该企业初次通过认证的年度，在初次通过认证后，若在到期时发生复核，此时认证年度不变，有效期会更新。'
              )}
            >
              <InfoCircleButton />
            </Tooltip>
          </>
        )
      }
      return name
    }
    let obj = {
      title: rendertitle(i),
      dataIndex: i.field,
      align: i.fieldType === 'money' || i.fieldType === 'num' || i.fieldType === 'radio' ? 'right' : 'left',
      render: (txt, row) => {
        if (i.fieldType === 'date' || i.selectType === 'date') {
          return wftCommon.formatTime(txt) || '--'
        } else if (i.fieldType === 'money' && txt) {
          if (window.en_access_config) return txt || '--'
          return wftCommon.formatMoney(txt, [4, ' ']) || '--'
        } else if (i.fieldType === 'radio') {
          return wftCommon.formatPercent(txt, [4, ' ']) || '--'
        } else if (i.jumpType === 'company' && txt && row[i.jumpField]) {
          return <CompanyLink name={txt} id={row[i.jumpField]}></CompanyLink>
        }
        if (i.field == 'certificationYear') {
          return txt + intl('31342', '年') || '--'
        }
        return txt || '--'
      },
      filterIcon: null,
    }
    switch (i.selectType) {
      case 'checkbox':
        obj = {
          ...obj,
          filterIcon: <FilterO style={{ color: checkedList[i.selectValue]?.length ? '#0093AD' : '#999' }} />,
          filterDropdown: (
            <div
              style={{
                padding: 8,
                borderRadius: 6,
                background: '#fff',
                boxShadow: '0 1px 6px rgba(0, 0, 0, .2)',
              }}
            >
              <Checkbox
                value={''}
                indeterminate={indeterminate[i.selectValue]}
                onChange={(e) => {
                  let arr = selectConfig && selectConfig[i.selectValue]?.map((k) => k.value)
                  arr = e.target.checked ? arr : []
                  setCheckedList((j) => ({
                    ...j,
                    [i.selectValue]: arr,
                  }))
                  setIndeterminate((j) => ({
                    ...j,
                    [i.selectValue]: false,
                  }))
                  setCheckAll((j) => ({
                    ...j,
                    [i.selectValue]: e.target.checked,
                  }))
                }}
                checked={checkAll[i.selectValue]}
              >
                {intl('19498', '全部')}
              </Checkbox>
              <Checkbox.Group
                key={i.field}
                value={checkedList[i.selectValue]}
                options={
                  selectConfig &&
                  selectConfig[i.selectValue]?.map((j) => ({
                    label: j.key,
                    value: j.value,
                  }))
                }
                onChange={(value) => {
                  setCheckedList((j) => ({
                    ...j,
                    [i.selectValue]: value,
                  }))
                  setCheckAll((j) => ({
                    ...j,
                    [i.selectValue]: value?.length === selectConfig[i.selectValue]?.length,
                  }))
                  setIndeterminate((j) => ({
                    ...j,
                    [i.selectValue]: !!(value?.length < selectConfig[i.selectValue]?.length),
                  }))
                }}
              >
                <br />
                {/* {selectConfig ? (
                  selectConfig[i.selectValue]?.map((j) => {
                    return (
                      <>
                        <Checkbox value={j.value}>{j.key}</Checkbox>
                        <br />
                      </>
                    )
                  })
                ) : (
                  <></>
                )} */}
              </Checkbox.Group>
              <Button
                style={{
                  marginTop: '4px',
                }}
                onClick={() => {
                  setColumnParam((param) => {
                    return {
                      ...param,
                      [i.selectInput]: checkedList[i.selectValue]?.join(','),
                    }
                  })
                  setCheckboxVisible((j) => ({
                    ...j,
                    [i.selectValue]: false,
                  }))
                }}
              >
                {intl('257693', '应用筛选')}
              </Button>
            </div>
          ),
          filterDropdownVisible: checkboxVisible[i.selectValue],
          onFilterDropdownVisibleChange: (visible) => {
            setCheckboxVisible((j) => ({
              ...j,
              [i.selectValue]: visible,
            }))
          },
        }
        break
      // 日期筛选项
      case 'date':
        if (i.field === 'originDate') {
          obj = {
            ...obj,
            filterIcon: (
              <FilterO
                style={{ color: originDate && originDate.length && originDate.every((i) => i) ? '#0093AD' : '#999' }}
              />
            ),
            filterDropdown: (
              <div
                style={{
                  padding: 8,
                  borderRadius: 6,
                  background: '#fff',
                  boxShadow: '0 1px 6px rgba(0, 0, 0, .2)',
                }}
              >
                <RangePicker
                  open={filterDropdownVisibleStart}
                  format={dateFormat}
                  value={originDate}
                  onChange={(date, dateString) => {
                    if (dateString?.some((i) => !i) && dateString?.some((i) => i)) return
                    setOriginDate(date)
                    setColumnParam((param) => {
                      return {
                        ...param,
                        originDatePre: dateString[0]?.replace(/-/g, '') || '',
                        originDatePost: dateString[1]?.replace(/-/g, '') || '',
                      }
                    })

                    setFilterDropdownVisibleStart(() => false)
                    return {}
                  }}
                />
              </div>
            ),
            // filterIcon: <SmileO style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
            filterDropdownVisible: filterDropdownVisibleStart,
            onFilterDropdownVisibleChange: (visible) => {
              setFilterDropdownVisibleStart(() => visible)
            },
          }
        } else if (i.field === 'expireDate') {
          obj = {
            ...obj,
            filterIcon: (
              <FilterO
                style={{ color: expireDate && expireDate.length && expireDate.every((i) => i) ? '#0093AD' : '#999' }}
              />
            ),
            filterDropdown: (
              <div
                style={{
                  padding: 8,
                  borderRadius: 6,
                  background: '#fff',
                  boxShadow: '0 1px 6px rgba(0, 0, 0, .2)',
                }}
              >
                <RangePicker
                  value={expireDate}
                  open={filterDropdownVisibleEnd}
                  format={dateFormat}
                  onChange={(date, dateString) => {
                    console.log('🚀 ~ configMapFunc ~ expireDate:', expireDate)
                    console.log('🚀 ~ configMapFunc ~ date, dateString:', date, dateString)
                    if (dateString?.some((i) => !i) && dateString?.some((i) => i)) return
                    setExpireDate(date)
                    setColumnParam((param) => {
                      return {
                        ...param,
                        expireDatePre: dateString[0]?.replace(/-/g, '') || '',
                        expireDatePost: dateString[1]?.replace(/-/g, '') || '',
                      }
                    })
                    setFilterDropdownVisibleEnd(() => false)
                    return {}
                  }}
                />
              </div>
            ),
            // filterIcon: <SmileO style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
            filterDropdownVisible: filterDropdownVisibleEnd,
            onFilterDropdownVisibleChange: (visible) => {
              setFilterDropdownVisibleEnd(() => visible)
            },
          }
        } else {
          obj = {
            ...obj,
            filterIcon: <FilterO style={{ color: columnParam[i.selectInput] ? '#0093AD' : '#999' }} />,
            filterDropdown: (
              <div
                style={{
                  padding: 8,
                  borderRadius: 6,
                  background: '#fff',
                  boxShadow: '0 1px 6px rgba(0, 0, 0, .2)',
                }}
              >
                <RangePicker
                  value={columnParam[i.selectInput]}
                  open={filterDropdownVisible}
                  format={dateFormat}
                  onChange={(date, dateString) => {
                    console.log('🚀 ~ configMapFunc ~ date, dateString:', date, dateString)
                    if (dateString?.some((i) => !i) && dateString?.some((i) => i)) return
                    setColumnParam((param) => {
                      return {
                        ...param,
                        [i.selectInput]: dateString.join(','),
                      }
                    })
                    setFilterDropdownVisible(() => false)
                    return {}
                  }}
                />
              </div>
            ),
            // filterIcon: <SmileO style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
            filterDropdownVisible: filterDropdownVisible,
            onFilterDropdownVisibleChange: (visible) => {
              setFilterDropdownVisible(() => visible)
            },
          }
        }
        break
      // 国民经济行业
      case 'industry':
        obj = {
          ...obj,
          filterIcon: <FilterO style={{ color: industrySelect?.length ? '#0093AD' : '#999' }} />,
          filterDropdown: (
            <div
              style={{
                padding: 8,
                borderRadius: 6,
                background: '#fff',
                boxShadow: '0 1px 6px rgba(0, 0, 0, .2)',
              }}
            >
              <div className="filterDropdown_cascader">
                <CascaderSelect
                  style={{}}
                  fieldNames={{
                    label: window.en_access_config ? 'nameEn' : 'name',
                    value: 'code',
                    children: 'node',
                  }}
                  dropMatchWidth
                  maxTagCount="responsive"
                  changeOptionCallback={(value) => {
                    setIndustrySelect(value)
                  }}
                  // maxTagCount={1}
                  showFooter={{
                    onSubmit: () => {
                      setColumnParam((param) => {
                        return {
                          ...param,
                          [i.selectInput]: industrySelect.join(','),
                        }
                      })
                      setIndustryDropdownVisible(false)
                    },
                    onCLear: () => {
                      setIndustrySelect([])
                      setColumnParam((param) => {
                        return {
                          ...param,
                          [i.selectInput]: '',
                        }
                      })
                      setTimeout(() => {
                        setIndustryDropdownVisible(false)
                      }, 100)
                    },
                  }}
                  data={globalIndustryOfNationalEconomy2}
                />
              </div>
            </div>
          ),
          filterDropdownVisible: industryDropdownVisible,
          onFilterDropdownVisibleChange: (visible) => {
            setIndustryDropdownVisible(() => visible)
          },
        }
        break

      // 地区
      case 'area':
        obj = {
          ...obj,
          filterIcon: <FilterO style={{ color: areaSelect?.length ? '#0093AD' : '#aaa' }} />,
          filterDropdown: (
            <div
              style={{
                padding: 8,
                borderRadius: 6,
                background: '#fff',
                boxShadow: '0 1px 6px rgba(0, 0, 0, .2)',
              }}
            >
              <div className="filterDropdown_cascader">
                <CascaderSelect
                  // value={areaSelect}
                  fieldNames={{
                    label: window.en_access_config ? 'nameEn' : 'name',
                    value: 'code',
                    children: 'node',
                  }}
                  changeOptionCallback={(value) => {
                    setAreaSelect(value)
                  }}
                  dropMatchWidth
                  data={globalAreaTree}
                  maxTagCount="responsive"
                  showFooter={{
                    onSubmit: () => {
                      setAreaDropdownVisible(false)
                      setColumnParam((param) => {
                        return {
                          ...param,
                          [i.selectInput]: areaSelect.join(','),
                        }
                      })
                    },
                    onCLear: () => {
                      setColumnParam((param) => {
                        return {
                          ...param,
                          [i.selectInput]: '',
                        }
                      })
                      setAreaSelect([])
                      setTimeout(() => {
                        setAreaDropdownVisible(false)
                      }, 100)
                    },
                  }}
                />
              </div>
            </div>
          ),
          filterDropdownVisible: areaDropdownVisible,
          onFilterDropdownVisibleChange: (visible) => {
            setAreaDropdownVisible(() => visible)
          },
        }
        break

      default:
        break
    }
    return obj
  }

  useEffect(() => {
    const ChinaMapWithPinyin = JSON.parse(window.localStorage.getItem('ChinaMapWithPinyin'))
    //事先读城市数据
    if (ChinaMapWithPinyin && ChinaMapWithPinyin.citylist) {
      setCitySelector()
    } else {
      //重新获取城市数据
      wftCommon.getPinyinMaps().then((data) => {
        if (data && Number(data.resultCode) === 200 && data.resultData) {
          wftCommon.setPinyinMap(data)
          setCitySelector()
        }
      })
    }
  }, [type])

  useEffect(() => {
    if (headerInfo && headerInfo.type === 'rank') {
      pointBuriedNew('922602100272', {
        opEntity: objectName, //榜单名
        opId: id, //榜单id
      }) //'榜单全部列表页加载'
      const options = headerInfo.date.map((i) => ({
        name: featuredCompany.getDateLabel(i, headerInfo?.updatefreq),
        key: i,
      }))
      setDateOptions(options)
      setDateValue(options[0]?.key || '')
    } else if (headerInfo && headerInfo.type === 'list') {
      // 名录埋点
      if (buryFunctionCode[id]) {
        pointBuriedNew(buryFunctionCode[id], {
          opEntity: objectName,
        })
      }
    }
  }, [headerInfo])

  const setCitySelector = () => {
    const ChinaMapWithPinyin = JSON.parse(window.localStorage.getItem('ChinaMapWithPinyin'))
    const cityReturnData = ChinaMapWithPinyin.citylist
    const options = [{ name: window.en_access_config ? 'ALL' : '全国', key: '' }]
    for (let i = 0; i < cityReturnData.length; i++) {
      options.push({
        name: window.en_access_config ? cityReturnData[i].p_en : cityReturnData[i].p,
        key: cityReturnData[i].p,
      })
    }
    setOptions(options)
  }
  // 榜单用老接口
  const { param, restfulParam } = useMemo(() => {
    return getFeaturedCompanyParam(type, id, area, dateValue, includingExpired, columnParam?.qualificationStatus)
  }, [type, id, area, dateValue, includingExpired, columnParam?.qualificationStatus])
  useEffect(() => {
    if (tabKey == '2') {
      setAreaTableLoading(true)
      corplistarea(param, type)
        .then((res) => {
          let total
          let arr
          if (type == 'rank') {
            total = res.Data?.total

            arr = res?.Data?.aggregations?.area
          } else {
            total = res.Page?.Records
            arr = res?.Data?.areaList
          }

          setAreaDataSource(arr || [])
          if (type == 'list') {
            setAreaTableData(arr || [])
          }
          featuredCompany.drawBarHighChart(iframeRef.current, arr || [], setIsNoDataBar)

          wftCommon.zh2enAlwaysCallback(arr, (newArr) => {
            setAreaDataSource(newArr || [])
            if (type == 'list') {
              setAreaTableData(newArr || [])
            }
            featuredCompany.drawBarHighChart(iframeRef.current, newArr || [], setIsNoDataBar)
          })
          setAreaColumns([
            {
              title: intl('32674', '地区'),
              dataIndex: 'key',
            },
            {
              title: intl('283647', '截至%年企业数量').replace(
                '%',
                new Date().getFullYear() + (window.en_access_config ? '' : '年')
              ),
              dataIndex: 'doc_count',
              align: 'right',
              render: (text) => {
                return wftCommon.formatMoneyComma(text)
              },
            },
            {
              title: intl('105862', '占比'),
              dataIndex: 'doc_count',
              align: 'right',
              render: (text) => {
                return wftCommon.formatPercent((text / total) * 100)
              },
            },
          ])
        })
        .finally(() => setAreaTableLoading(false))
      // 榜单的区域分布统计table和list不一样
      if (type == 'rank') {
        const p = {
          id,
          area: area,
          date: dateValue,
          type: 'rank',
        }
        if (!includingExpired) {
          p.includingExpired = false
        }
        myWfcAjax('corplistaggtable', p).then(function (res) {
          const col = [
            {
              title: intl('32674', '地区'),
              dataIndex: 'name',
            },
            ...res.Data.date.map((i, index) => ({
              title: formatFeaturedDate(i),
              dataIndex: 'value',
              align: 'right',
              render: (text) => {
                return text[index] ? wftCommon.formatMoneyComma(text[index]) : text[index]
              },
            })),
          ]
          setAreaColumns(col)
          wftCommon.zh2enAlwaysCallback(
            res.Data?.list,
            (newArr) => {
              setAreaTableData(() => newArr)
            },
            null,
            null,
            ['name']
          )
        })
      }
    } else if (tabKey == '3') {
      corplistindustry(param, type).then((res) => {
        const rawData = type == 'rank' ? res?.Data?.aggregations?.industry : res?.Data?.industryList
        const total = type == 'rank' ? res.Data?.total : res.Page?.Records
        setIndustryColumns([
          {
            title: intl('31801', '行业'),
            dataIndex: 'key',
          },
          {
            title: intl('283647', '截至%年企业数量').replace(
              '%',
              new Date().getFullYear() + (window.en_access_config ? '' : '年')
            ),
            dataIndex: 'doc_count',
            align: 'right',
            render: (text) => {
              return text && wftCommon.formatMoneyComma(text)
            },
          },
          {
            title: intl('105862', '占比'),
            dataIndex: 'doc_count',
            align: 'right',
            render: (text) => {
              return wftCommon.formatPercent((text / total) * 100)
            },
          },
        ])
        featuredCompany.drawRound(industryRoundRef.current, rawData || [], total)
        setIndustryTable(rawData || [])
        wftCommon.zh2enAlwaysCallback(rawData, (arr) => {
          featuredCompany.drawRound(industryRoundRef.current, arr || [], total)
          setIndustryTable(arr || [])
        })
      })
    } else if (tabKey == '4') {
      setIpoTableLoading(true)
      // 榜单用老接口
      ranklistaggselect(type == 'rank' ? restfulParam : param, type)
        .then((res) => {
          const total = type == 'rank' ? res.Data?.total : res.Page?.Records
          const originData = type == 'rank' ? res.Data.listing_tag : res.Data?.listedStatus
          const tablePieData = []
          const resPie = []
          const resPie02 = []
          for (let i = 0; i < originData.length; i++) {
            const tmp = {}
            tmp.doc_count = type == 'rank' ? originData[i].docCount : originData[i].doc_count
            tmp.key = featuredCompany.switchZhEn[originData[i].key]
              ? featuredCompany.switchZhEn[originData[i].key]
              : originData[i].key
            tablePieData.push(tmp)
            resPie.push(tmp)
            if (originData[i].board && originData[i].board.length > 0) {
              for (let j = 0; j < originData[i].board.length; j++) {
                const tmp2 = {}
                tmp2.doc_count = type == 'rank' ? originData[i].board[j].docCount : originData[i].board[j].doc_count
                tmp2.key = featuredCompany.switchZhEn[originData[i].board[j].key]
                  ? featuredCompany.switchZhEn[originData[i].board[j].key]
                  : originData[i].board[j].key
                tmp2.isBoard = true // 是否是子节点
                tablePieData.push(tmp2)
                if (tmp2.doc_count) {
                  resPie02.push(tmp2)
                }
              }
            }
          }
          for (let i = 0; i < resPie.length; i++) {
            if (resPie[i].key === intl('16277', '已上市') && Number(resPie[i].doc_count) === 0) {
              resPie.splice(i, 1)
            } else if (resPie[i].key === intl('14816', '未上市') && Number(resPie[i].doc_count) === 0) {
              resPie.splice(i, 1)
            }
          }

          setIpoTable(tablePieData)
          setIpoColumns([
            {
              title: intl('66287', '上市状态'),
              dataIndex: 'key',
              render: (text, record) => {
                return record.isBoard ? <span>&nbsp;&nbsp;&nbsp;&nbsp;{text}</span> : text
              },
            },
            {
              title: intl('208504', '企业数量'),
              dataIndex: 'doc_count',
              align: 'right',
              render: (text) => {
                return text && wftCommon.formatMoneyComma(text)
              },
            },
            {
              title: intl('105862', '占比'),
              dataIndex: 'doc_count',
              align: 'right',
              render: (text) => {
                return wftCommon.formatPercent((text / total) * 100)
              },
            },
          ])
          featuredCompany.showIpoPie(ipoChartLRef.current, resPie)
          featuredCompany.showIpoPie(ipoChartRRef.current, resPie02)
        })
        .finally(() => {
          setIpoTableLoading(false)
        })
      setTypeTableLoading(true)
      corpliststatistictype(param, type)
        .then((res) => {
          const total = type == 'rank' ? res.Data.total : res.Page?.Records
          const originData = type == 'rank' ? res.Data.aggregations.corp_type : res.Data.companyType

          if (originData?.length > 0) {
            // 提取公共的数据处理函数
            const processTypeData = (translatedData = null) => {
              const { tablePieData, column } = featuredCompany.showTypeHandler(total, originData, translatedData)
              setTypeTable(tablePieData)
              setTypeColumns(column)
              featuredCompany.drawRoundType(typeChartRef?.current, tablePieData, total)
            }

            if (window.en_access_config) {
              // 构建翻译对象
              const enObj = {}
              for (let i = 0; i < originData.length; i++) {
                enObj[i] = originData[i].key
              }

              // 先使用原始数据渲染
              processTypeData(enObj)

              // 翻译后重新渲染
              wftCommon.translateService(enObj, function (en) {
                processTypeData(en)
              })
            } else {
              // 直接处理数据
              processTypeData()
            }
          }
        })
        .finally(() => {
          setTypeTableLoading(false)
        })
      setMoneyTableLoading(true)
      corpliststatisticcapital(param, type)
        .then((res) => {
          const total = type == 'rank' ? res.Data.total : res.Page?.Records
          const originData = type == 'rank' ? res.Data.aggregations.capital : res.Data.registerCapital
          if (originData?.length > 0) {
            const tablePieData = []
            const resPie = []

            for (let i = 0; i < originData.length; i++) {
              const tmp = {}
              if (originData[i].key == '5000-') {
                tmp.key = featuredCompany.switchZhEn['5000万元以上']
              } else if (originData[i].key == '其他') {
                tmp.key = featuredCompany.switchZhEn['其他']
              } else {
                tmp.key = featuredCompany.switchZhEn[originData[i].key + '万元']
              }
              tmp.doc_count = originData[i].doc_count
              tablePieData.push(tmp)
              resPie.push(tmp)
            }
            const column = [
              {
                title: intl('35779', '注册资本'),
                dataIndex: 'key',
              },
              {
                title: intl('208504', '企业数量'),
                dataIndex: 'doc_count',
                align: 'right',
                render: (text) => {
                  return text && wftCommon.formatMoneyComma(text)
                },
              },
              {
                title: intl('105862', '占比'),
                dataIndex: 'doc_count',
                align: 'right',
                render: (text) => {
                  return wftCommon.formatPercent((text / total) * 100)
                },
              },
            ]
            setMoneyTable(tablePieData)
            setMoneyColumns(column)
            featuredCompany.drawBarStatistics(moneyChartRef.current, tablePieData, total)
          }
        })
        .finally(() => {
          setMoneyTableLoading(false)
        })
      setPersonTableLoading(true)
      corpliststatisticinsured(param, type)
        .then((res) => {
          const total = type == 'rank' ? res.Data.total : res.Page?.Records
          const originData = type == 'rank' ? res.Data.aggregations.insured : res.Data.personnelScale
          if (originData?.length > 0) {
            const tablePieData = []
            const resPie = []

            for (let i = 0; i < originData.length; i++) {
              const tmp = {}
              if (originData[i].key == '10000-') {
                tmp.key = featuredCompany.switchZhEn['10000人以上']
              } else if (originData[i].key == '其他') {
                tmp.key = featuredCompany.switchZhEn['其他']
              } else {
                const section = originData[i].key.split('-')
                tmp.key = featuredCompany.switchZhEn[section[0] + '-' + Number(section[1] - 1) + '人']
              }
              tmp.doc_count = originData[i].doc_count
              tablePieData.push(tmp)
              resPie.push(tmp)
            }
            const column = [
              {
                title: intl('145878', '参保人数'),
                dataIndex: 'key',
              },
              {
                title: intl('208504', '企业数量'),
                dataIndex: 'doc_count',
                align: 'right',
                render: (text) => {
                  return text && wftCommon.formatMoneyComma(text)
                },
              },
              {
                title: intl('105862', '占比'),
                dataIndex: 'doc_count',
                align: 'right',
                render: (text) => {
                  return wftCommon.formatPercent((text / total) * 100)
                },
              },
            ]
            setPersonTable(tablePieData)
            setPersonColumns(column)
            featuredCompany.drawBarStatistics(personChartRef.current, tablePieData, total)
          }
        })
        .finally(() => {
          setPersonTableLoading(false)
        })
    } else {
      setTableLoading(true)
      if (type && type == 'list') {
        const columnp = {}
        for (const [key, value] of Object.entries(columnParam)) {
          if (value) {
            columnp[key] = value
          }
        }
        const param = {
          pageNo: pageNo,
          pageSize: pageSize,
          corpListId: id,
          corpName: corpName,
          ...columnp,
        }

        if (!includingExpired) {
          param.includingExpired = includingExpired
        }
        if (listColumnConfig) {
          getCorpListOfLists(param).then((result) => {
            setDataSource(result.Data?.list || [])
            setFilterCount(() => result.Page?.Records || 0)
            setTableLoading(false)
            wftCommon.zh2enAlwaysCallback(result.Data?.list || [], (newData) => {
              if (!selectConfig) {
                const { aggs_remarks, ...rest } = result.Data?.selectConfig || {}
                console.log('🚀 ~ wftCommon.zh2enAlwaysCallback ~ aggs_remarks:', aggs_remarks)
                wftCommon.pureTranslateService(wftCommon.deepClone(rest) || {}, (enConfig) => {
                  if (window.en_access_config) {
                    setTimeout(() => {
                      setSelectConfig(() => enConfig)
                    }, 1000)
                  }
                  setSelectConfig(() => enConfig)
                  setIsFilter(() => Object.values(columnParam).some((i) => i) || !includingExpired)
                  setDataSource(newData || [])
                })
              } else {
                setIsFilter(() => Object.values(columnParam).some((i) => i) || !includingExpired)
                setDataSource(newData || [])
              }
            })
          })
        }
      } else if (type && type == 'rank') {
        if (dateValue) {
          getCorpListOfRanks({
            pageNo: pageNo,
            pageSize: pageSize,
            corpListId: id,
            corpName: corpName,
            // area: area,
            areaCode: codeNameMap[area],
            rankDate: dateValue,
          }).then((result) => {
            setTableLoading(false)
            setDataSource(result.Data?.list || [])
            let column = [
              {
                width: '76px',
                title: intl('30635', '排名'),
                dataIndex: 'rank',
                render: (txt) => {
                  return txt || '--'
                },
              },

              {
                title: intl('437804', '排名对象'),
                dataIndex: 'rankItem',
                render: (txt) => {
                  return txt || '--'
                },
              },
              {
                title: intl('138677', '企业名称'),
                dataIndex: showOriginalName ? 'originalCompName' : 'corpName',
                render: (txt, row) => {
                  return <CompanyLink name={txt} id={row['corpId']}></CompanyLink>
                },
              },
              {
                title: intl('32674', '地区'),
                dataIndex: 'province',
                render: (txt) => {
                  return txt || '--'
                },
              },
              {
                title: intl('312254', '国民经济行业'),
                dataIndex: 'industryGb1',
                render: (txt) => {
                  return txt || '--'
                },
              },
            ]
            if (isPersonFetured) {
              column = [
                {
                  width: '176px',
                  title: intl('30635', '排名'),
                  dataIndex: 'rank',
                  // align:'center',
                  render: (txt) => {
                    return txt || '--'
                  },
                },

                {
                  title: intl('437804', '排名对象'),
                  dataIndex: 'rankItem',
                  render: (txt) => {
                    return txt || '--'
                  },
                },
              ]
            } else if (isOverseaFetured) {
              column = [
                {
                  width: '100px',
                  title: intl('30635', '排名'),
                  dataIndex: 'rank',
                  // align:'center',
                  render: (txt) => {
                    return txt || '--'
                  },
                },

                {
                  title: intl('437804', '排名对象'),
                  dataIndex: 'rankItem',
                  render: (txt) => {
                    return txt || '--'
                  },
                },
                {
                  title: intl('138677', '企业名称'),
                  dataIndex: showOriginalName ? 'originalCompName' : 'corpName',
                  render: (txt, row) => {
                    return <CompanyLink name={txt} id={row['corpId']}></CompanyLink>
                  },
                },
                {
                  title: intl('32674', '地区'),
                  dataIndex: 'province',
                  render: (txt) => {
                    return txt || '--'
                  },
                },
              ]
            }
            const config = result.data.config || []
            column = column.concat(
              config.map((i) => {
                return {
                  title: i.indexName + (i.indexUnit.length ? '(' + i.indexUnit + ')' : ''),
                  dataIndex: 'index',
                  align: 'right',
                  render: (txt) => {
                    return (
                      txt &&
                      txt.length &&
                      wftCommon.formatMoneyComma(txt.find((j) => j?.indexCode == i?.indexCode)?.indexValue)
                    )
                  },
                }
              })
            )
            // if()
            setColumns(() => column || [])
            wftCommon.zh2enAlwaysCallback(result.Data?.list || [], (newData) => {
              setIsFilter(() => Object.values(columnParam).some((i) => i) || !includingExpired)
              setFilterCount(() => result.Page.Records || 0)

              setDataSource(newData || [])
            })
          })
        }
      }
    }
  }, [
    id,
    tabKey,
    columnParam,
    pageNo,
    pageSize,
    type,
    listColumnConfig,
    expireDate,
    corpName,
    area,
    dateValue,
    includingExpired,
    showOriginalName,
  ])

  useEffect(() => {
    setPageNo(0)
  }, [columnParam, area, dateValue, includingExpired, corpName])

  useEffect(() => {
    if (type == 'list') {
      const column = listColumnConfig && listColumnConfig.map(configMapFunc)
      setColumns(() => column || [])
    }
  }, [
    pageNo,
    pageSize,
    type,
    isFilter,
    filterCount,
    checkboxVisible,
    indeterminate,
    checkedList,
    checkAll,
    industrySelect,
    areaSelect,
    filterDropdownVisible,
    filterDropdownVisibleStart,
    filterDropdownVisibleEnd,
    industryDropdownVisible,
    areaDropdownVisible,
    listColumnConfig,
  ])

  const exportList = (left, right) => {
    left = left < 0 ? 0 : left
    const fn = (res) => {
      if (res && (res.ErrorCode == '20012' || res.ErrorCode == '-9')) {
        // Common.PupupNoAccess(
        //   intl("" ,'该功能的使用量已超限，请联系客服咨询更多数据获取方式。'),
        //   intl("" ,'超限提示')
        // );
        return
      }
      if (res && res.ErrorCode == '-10') {
        return
      }
      if (res && res.ErrorCode == 0 && res.Data) {
        wftCommon.jumpJqueryPage('index.html#/customer?type=mylist')
        // }
      } else {
        message.error(intl('204684', '导出出错'))
      }
    }
    let parameter = {
      corpListId: id,
      from: left,
      to: right,
    }
    if (type === 'rank') {
      parameter = {
        ...parameter,
        corpName,
        area: area,
        rankDate: dateValue,
      }
      if (isPersonFetured) {
        parameter.type = 1
      } else if (isOverseaFetured) {
        parameter.type = 2
      } else {
        parameter.type = 0
      }
      createtaskRank(parameter).then(fn)
    } else {
      const columnp = {}
      for (const [key, value] of Object.entries(columnParam)) {
        if (value) {
          columnp[key] = value
        }
      }
      const param = {
        corpName: corpName,
        ...columnp,
      }

      if (!includingExpired) {
        param.includingExpired = includingExpired
      }
      parameter = {
        ...parameter,
        ...param,
      }
      createtaskList(parameter).then(fn)
    }
  }

  const handleChange = (value) => {
    if (!isSvip && !isVip) {
      return VipPopup({ onlySvip: true })
    }
    setValue(value)
    setArea(value)
    setColumnParam((param) => {
      return {
        ...param,
        areaCode: codeNameMap[value],
      }
    })
  }
  const handleStatusChange = (value) => {
    if (!isSvip && !isVip) {
      return VipPopup({ onlySvip: true })
    }
    setColumnParam((param) => {
      return {
        ...param,
        qualificationStatus: value,
      }
    })
  }

  const { isVip, isSvip } = getVipInfo()

  const isPersonFetured = rankAttribute == '2' && type == 'rank'

  const isOverseaFetured = countryCode !== 'CHN' && type == 'rank'
  const yearSelect = dateOptions?.length ? (
    <>
      <span>{intl('437816', '往期查询') + (window.en_access_config ? ': ' : '：')}</span>
      <Select
        placeholder="请选择"
        value={dateValue}
        style={{ marginRight: 10 }}
        onChange={(value) => {
          setDateValue(value || '')
        }}
      >
        {dateOptions.map(({ name, key, title, disabled }) => (
          <Option key={key} title={title} disabled={disabled}>
            {name}
          </Option>
        ))}
      </Select>
    </>
  ) : (
    <></>
  )

  // tabs表头自定义内容
  const tabBarExtraContent = (
    <>
      {isExtraIncludingExpired ? (
        <>
          <Checkbox
            checked={includingExpired}
            onChange={(e) => {
              setIncludingExpired(e.target.checked)
            }}
          >
            {intl('437914', '包含已失效')}
          </Checkbox>
        </>
      ) : (
        <></>
      )}
      {tabKey == 1 ? (
        <>
          {type == 'rank' ? (
            <>
              {yearSelect}
              {isPersonFetured ? (
                <></>
              ) : (
                <Select
                  allowClear
                  placeholder="请选择"
                  value={value}
                  style={{ width: 121, marginRight: 10 }}
                  onChange={handleChange}
                >
                  {options.map(({ name, key, title, disabled }) => (
                    <Option key={key} title={title} disabled={disabled}>
                      {name}
                    </Option>
                  ))}
                </Select>
              )}
            </>
          ) : (
            <>
              {isExtraAreaSelect ? (
                <Select
                  allowClear
                  placeholder="请选择"
                  value={value}
                  style={{ width: 121, marginRight: 10 }}
                  onChange={(val) => {
                    handleChange(val)
                  }}
                >
                  {options.map(({ name, key, title, disabled }) => (
                    <Option key={key} title={title} disabled={disabled}>
                      {name}
                    </Option>
                  ))}
                </Select>
              ) : (
                <></>
              )}
            </>
          )}
          <Search
            style={{
              width: '200px',
            }}
            // value={corpName}
            placeholder={isPersonFetured ? intl('299573', '请输入搜索内容') : intl('225183', '请输入公司名称')}
            suffix={<SearchO />}
            onChange={() => {
              debounce((e) => {
                setCorpName(e.targrt.value)
              }, 1000)
            }}
            onSearch={(val) => {
              if (!isSvip && !isVip) {
                return VipPopup({ onlySvip: true })
              }
              setCorpName(val)
              if (val) {
                pointBuriedByModule(922602100766, {
                  listName: val,
                })
              }
            }}
          />
          {wftCommon.is_overseas_config ? null : (
            <Button
              style={{
                margin: '0 12px',
              }}
              icon={<DownloadO />}
              onClick={() => {
                if (!isSvip) {
                  return VipPopup({ onlySvip: true })
                }
                setLeftVal('')
                setRightVal('')
                setVisible(true)
              }}
            >
              {intl('4698', '导出数据')}
            </Button>
          )}
        </>
      ) : (
        <>
          {yearSelect}
          {/* 专精特新小巨人企业地区分布加认证状态筛选项 */}
          {id === '2010100370' ? (
            <>
              <Select
                key={tabKey}
                defaultValue={''}
                allowClear
                placeholder="请选择"
                style={{ width: 121, marginRight: 10 }}
                onChange={handleStatusChange}
              >
                {qualificationStatus.map(({ value, key }) => (
                  <Option key={value} title={key}>
                    {key}
                  </Option>
                ))}
              </Select>
            </>
          ) : (
            <></>
          )}
          <Select
            allowClear
            placeholder="请选择"
            value={value}
            style={{ width: 121, marginRight: 10 }}
            onChange={handleChange}
          >
            {options.map(({ name, key, title, disabled }) => (
              <Option key={key} title={title} disabled={disabled}>
                {name}
              </Option>
            ))}
          </Select>
        </>
      )}
    </>
  )

  const initOption = () => {
    setIncludingExpired(true)
    setAreaSelect([]) //级联地区
    setIndustrySelect([]) //行业
    setCheckedList([]) //多选
    setOriginDate() //起始日
    setExpireDate() // 到期日
    setValue('') //年份多选
    setArea('') // 多选地区
    setColumnParam({}) // 请求参数
    setCorpName('') //input搜索
  }
  const renderDemoMap = () => {
    return (
      <Suspense fallback={<div style={{ width: '500px' }}></div>}>
        <TwolayerMap
          data={areaDataSource.map((i) => {
            return {
              ...i,
              value: i.doc_count,
              code: type == 'rank' ? oldCodeNameMap[i.key] : i.standardCode,
            }
          })}
          selectedArea={{
            oldCode: oldCodeNameMap[area],
            name: area,
          }}
          loading={areaTableLoading}
          onChange={({ oldCode }) => {
            setValue(oldNameCodeMap[oldCode] || '')
            setArea(oldNameCodeMap[oldCode] || '')
          }}
        ></TwolayerMap>
      </Suspense>
    )
  }

  // 特殊统计组件 - 使用 useMemo 缓存组件实例
  const MemoizedSpecialStatisticsSection = useMemo(() => {
    if (id !== SpecialStatisticsConfigId.ELDERLY_CARE) {
      return null
    }
    // 直接使用枚举值，不需要查找配置
    return <SpecialStatisticsSection configId={SpecialStatisticsConfigId.ELDERLY_CARE} param={param} />
  }, [param, id])

  return (
    <div className="feturecompany-body">
      <div className="fetured-inner-bg"></div>
      <Affix target={() => document.querySelector('.page-container')}>
        <div className="fetured-toolbar" id="fetured-toolbar">
          {!wftCommon.isBaiFenTerminalOrWeb() ? (
            <div className="fetured-toolbar-content">
              <span>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <a href="index.html#/searchPlatform/SearchFetured?nosearch=1">{intl('252965', '企业榜单名录')}</a>
                  </Breadcrumb.Item>
                  {type == 'list' ? (
                    <>
                      <Breadcrumb.Item>
                        <a href={`#feturedlist?id=${categoryId}`}>{category}</a>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>
                        <a onClick={() => {}}>{objectName}</a>
                      </Breadcrumb.Item>
                    </>
                  ) : (
                    <>
                      <Breadcrumb.Item>
                        <a href={`#feturedlist?id=${parentLinkNodes && parentLinkNodes[0]?.childNode?.nodeId}`}>
                          {parentLinkNodes && parentLinkNodes[0]?.childNode?.nodeName}
                        </a>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>
                        <a onClick={() => {}}>{objectName}</a>
                      </Breadcrumb.Item>
                    </>
                  )}
                </Breadcrumb>
              </span>

              <span className="link-fetured">
                <a href="#feturedlist?id=01010100"> {intl('437750', '查看全部榜单名录')}</a>
              </span>
            </div>
          ) : null}
        </div>
      </Affix>
      <div className="blank"></div>
      <div className="companyTec-title">{objectName}</div>
      <div className="fetured-wrapper">
        <div className="fetured-intro-statistics">
          <p>
            {type == 'list'
              ? intl('382613', '入选总数')
              : isPersonFetured
                ? intl('416950', '最新上榜人物数量')
                : intl('308619', '最新上榜企业数量')}
          </p>
          <div className="fetured-num">{wftCommon.formatMoney(count, [4, ' ']) + intl('138901', '家')}</div>
        </div>
        <div className="fetured-intro-text">
          {type == 'list' ? (
            description
          ) : (
            <>
              {intl('308620', '统计来源') + '：'}
              <span>{source}</span>
              <br />
              {intl('437815', '数据更新周期') + '：'}
              <span>{updatefreqMap[updatefreq] || ''}</span>
              <br />
              {intl('437847', '最近一期') + '：'}
              <span>
                {(updatefreq && bizDate && formatUpdateTime(wftCommon.formatTime(bizDate), updatefreq)) || ''}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="feturedMain">
        <Tabs
          animated={false}
          tabBarExtraContent={tabBarExtraContent}
          activeKey={tabKey}
          onChange={(key) => {
            try {
              setTabKey(() => key)
              if (key != 1) {
                initOption()
              }
              pointBuriedByModule(tabBuryList[Number(key) - 1], {
                listName: objectName,
              })
            } catch (e) {
              console.error(e)
            }
          }}
        >
          <TabPane tab={isPersonFetured ? intl('421582', '人物列表') : intl('138216', '企业列表')} key="1">
            {tabKey == 1 ? (
              <Table
                loading={tableLoading}
                columns={columns}
                dataSource={dataSource}
                // empty={tableLoading ? '' : intl('17235', '暂无数据')}
                locale={{
                  emptyText: tableLoading ? '' : intl('17235', '暂无数据'),
                }}
                pagination={{
                  currentPage: pageNo + 1,
                  pageSize,
                  total: filterCount > 5000 ? 5000 : filterCount,
                  showQuickJumper: true,
                  showSizeChanger: false,
                  onChange: (page, pagesize) => {
                    if (!isSvip) {
                      return VipPopup({ onlySvip: true })
                    }
                    setPageNo(() => page - 1)
                    setPageSize(pagesize)
                  },
                }}
              />
            ) : (
              <div></div>
            )}
            <span
              style={{
                position: 'relative',
                top: '-22px',
              }}
            >
              {isFilter ? (
                <span>
                  {intl('358394', '当前筛选条件下共找到%家企业').replace('%', filterCount) +
                    (window.en_access_config ? ',' : '，')}
                </span>
              ) : (
                <></>
              )}
            </span>
          </TabPane>
          {/* 人物榜和海外榜没有地区分布、行业分析、更多统计 */}
          {!(isPersonFetured || isOverseaFetured) && (
            <TabPane tab={intl('216301', '地区分布')} key="2">
              <div className="statistics-map">
                <div
                  className="top"
                  style={{
                    height: '400px',
                  }}
                >
                  <div
                    className="windMap"
                    style={{
                      margin: '20px 60px',
                      display: 'inline-block',
                    }}
                  >
                    {tabKey == 2 ? renderDemoMap() : <></>}
                  </div>

                  <div id="companyTec-r" ref={iframeRef}>
                    {isNoDataBar ? (
                      <>
                        <p className="no-data-content">
                          {window.en_access_config
                            ? area
                              ? `There are no enterprises selected as ${objectName || ''} in ${
                                  globalAreaTree.find((i) => i.code == codeNameMap[area])?.nameEn
                                }, and it cannot be ruled out that the information and objective facts may occur due to the expiration of the validity period of the enterprise selection list, undisclosed sources of information, differences in disclosure forms, lagging retrieval time and other situations.`
                              : `There are no enterprises selected in ${
                                  objectName || ''
                                }, and it cannot be ruled out that the information and objective facts may occur due to the expiration of the validity period of the enterprise selection list, undisclosed sources of information, differences in disclosure forms, lagging retrieval time and other situations.`
                            : `${area || defaultArea}暂无企业入选${
                                objectName || ''
                              }，\n不排除因企业入选名录有效期到期、\n信息公开来源尚未公开、公开形式存在差异、\n检索时间存在滞后等情况导致的信息与客观事实`}
                        </p>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="area-statistics">
                  <Table
                    title={() => intl('259184', '区域分布统计')}
                    columns={areaColumns}
                    empty={intl('17235', '暂无数据')}
                    pagination={false}
                    dataSource={areaTableData}
                  />
                </div>
              </div>
            </TabPane>
          )}
          {!(isPersonFetured || isOverseaFetured) && (
            <TabPane tab={intl('98629', '行业分析')} key="3">
              <div className="statistics-map">
                <div className="header-statistics">{intl('437772', '国民经济行业分布(更新至最近一期)')}</div>

                <div id="drawRoundArea" className="draw-round-area" ref={industryRoundRef}></div>
                <div className="area-statistics">
                  <Table
                    title={() => intl('261357', '行业分布统计')}
                    columns={industryColumns}
                    pagination={false}
                    dataSource={industryTable}
                    empty={intl('17235', '暂无数据')}
                  />
                </div>
              </div>
            </TabPane>
          )}

          {!(isPersonFetured || isOverseaFetured) && (
            <TabPane tab={intl('437762', '更多统计')} key="4">
              {/* 特殊统计组件 */}
              {MemoizedSpecialStatisticsSection}
              <div className="header-statistics">{intl('66287', '上市状态')}</div>
              {ipoTable.some((i) => i.doc_count) ? (
                <>
                  <div className="status-ipo">
                    <div className="status-left">
                      <div id="ipoChartL" className="ipo-chart-l" ref={ipoChartLRef}></div>
                      <div id="ipoChartR" className="ipo-chart-r" ref={ipoChartRRef}></div>
                    </div>
                    <div className="status-ipo-table">
                      <Table
                        columns={ipoColumns}
                        pagination={false}
                        dataSource={ipoTable}
                        empty={intl('17235', '暂无数据')}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>{<div className="feture-no-data">{ipoTableLoading ? '' : intl('17235', '暂无数据')}</div>}</>
              )}

              <div className="header-statistics">{intl('60452', '企业类型')}</div>
              {typeTable.some((i) => i.doc_count) ? (
                <>
                  <div className="status-ipo">
                    <div className="status-left">
                      <div id="typeChart" className="type-chart" ref={typeChartRef}></div>
                    </div>
                    <div className="status-ipo-table">
                      <Table
                        columns={typeColumns}
                        pagination={false}
                        dataSource={typeTable}
                        empty={intl('17235', '暂无数据')}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="feture-no-data">{typeTableLoading ? '' : intl('17235', '暂无数据')}</div>
              )}

              <div className="header-statistics">{intl('437766', '注册资本分布')}</div>
              {moneyTable.some((i) => i.doc_count) ? (
                <>
                  <div className="status-ipo">
                    <div className="status-left">
                      <div id="moneyChart" className="money-chart" ref={moneyChartRef}></div>
                    </div>
                    <div className="status-ipo-table">
                      <Table
                        columns={moneyColumns}
                        pagination={false}
                        dataSource={moneyTable}
                        empty={intl('17235', '暂无数据')}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="feture-no-data">{moneyTableLoading ? '' : intl('17235', '暂无数据')}</div>
              )}

              <div className="header-statistics">{intl('257664', '企业人员规模')}</div>
              {personTable.some((i) => i.doc_count) ? (
                <>
                  <div className="status-ipo">
                    <div className="status-left">
                      <div id="personChart" className="person-chart" ref={personChartRef}></div>
                    </div>
                    <div className="status-ipo-table">
                      <Table
                        columns={personColumns}
                        pagination={false}
                        dataSource={personTable}
                        empty={intl('17235', '暂无数据')}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="feture-no-data">{personTableLoading ? '' : intl('17235', '暂无数据')}</div>
              )}
            </TabPane>
          )}
        </Tabs>
      </div>
      <Modal
        title={intl('4698', '导出数据')}
        visible={visible}
        onOk={() => {
          if (/^\d+\.?\d*$/.test(leftVal) && 0 <= leftVal) {
          } else {
            setIsError(true)
            return false
          }
          if (/^\d+\.?\d*$/.test(rightVal) && 0 < rightVal) {
          } else {
            setIsError(true)
            return false
          }
          if (rightVal - leftVal + 1 > 50 || (leftVal - 1) * 20 > filterCount) {
            setIsError(true)
            return false
          } else if (rightVal - leftVal < 0 || rightVal - leftVal + 1 > 50) {
            setIsError(true)
            return false
          }
          pointBuriedByModule(922602100892, {
            listName: objectName,
          })
          exportList((leftVal - 1) * 20, rightVal * 20)
          setVisible(false)
        }}
        onCancel={() => {
          setVisible(false)
        }}
      >
        <p>{intl('355863', '每次最多导出1000条（50页），请选择导出的页码数')}</p>

        {window.en_access_config ? (
          <>
            <p>
              from{' '}
              <Input
                value={leftVal}
                style={{
                  margin: '4px 0',
                  width: '52px',
                }}
                size="mini"
                onChange={(e) => {
                  setLeftVal(e.target.value)
                }}
              ></Input>{' '}
              to{' '}
              <Input
                value={rightVal}
                onChange={(e) => {
                  setRightVal(e.target.value)
                }}
                style={{
                  width: '52px',
                }}
                size="mini"
              ></Input>
            </p>
          </>
        ) : (
          <p>
            第{' '}
            <Input
              value={leftVal}
              style={{
                margin: '4px 0',
                width: '52px',
              }}
              size="mini"
              onChange={(e) => {
                setLeftVal(e.target.value)
              }}
            ></Input>{' '}
            ~{' '}
            <Input
              value={rightVal}
              onChange={(e) => {
                setRightVal(e.target.value)
              }}
              style={{
                width: '52px',
              }}
              size="mini"
            ></Input>{' '}
            {intl('32047', '页')}
          </p>
        )}
        {isError ? (
          <p
            style={{
              color: '#c52131',
            }}
          >
            {intl('355821', '输入有误，请重新输入！')}
          </p>
        ) : (
          <></>
        )}
      </Modal>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    findCustomer: state.findCustomer,
    userPackageinfo: state.home.userPackageinfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetData: () => {
      dispatch({ type: 'RESET' })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feturedcompany)
