import {
  AutoComplete,
  Breadcrumb,
  Button,
  Col,
  Input,
  Layout,
  Link,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Tabs,
  Tag,
  Timeline,
  Tooltip,
  Upload,
} from '@wind/wind-ui'
import Table from '@wind/wind-ui-table'
import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import XLSX from 'xlsx'
import {
  addCustomerBatch,
  addtomycustomer,
  batchquerycorp,
  cleancollectiongroup,
  copycollectionentity,
  DeleteCustomer,
  deletecustomergroups,
  getcorpeventlist,
  getcustomercountgroupnew,
  getsectorstockinfobysectorid,
  getusersector,
  movecollectionentity,
  searchcollectlist,
  updatecustomergroup,
} from '../../api/companyDynamic'
import { parseQueryString } from '../../lib/utils.tsx'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils.tsx'
import RangePickerDialog from '../SingleCompanyDynamic/RangePickerDialog.tsx'
import './CompanyDynamic.less'

import CompanyLink from '../../components/company/CompanyLink.tsx'

import { DeleteOBtn } from '@/components/common/btn/DeleteOBtn/index.tsx'
import { CheckO, CloseO, CopyO, DeleteO, EditO, FileAddO, FileTextO, PlusCircleO } from '@wind/icons'
import CheckboxGroup from '@wind/wind-ui/lib/checkbox/Group'
import { getDynamicDetail } from 'gel-ui'
import { pointBuriedByModule } from '../../api/pointBuried/bury.ts'
import Cancel from '../../assets/imgs/Cancel.png'
import yidongdao from '../../assets/imgs/yidongdao.png'
import { usePageTitle } from '../../handle/siteTitle'
import { corpDynamicMenu } from './dynamic/config.ts'

const Dragger = Upload.Dragger
const TabPane = Tabs.TabPane
const Option = AutoComplete.Option
const Search = Input.Search
const { Sider } = Layout
const RadioGroup = Radio.Group
const { TextArea } = Input

function CompanyDynamic(props) {
  usePageTitle('CompanyNews')
  const qsParam = parseQueryString()
  const keyMenu = qsParam['keyMenu']

  const { location, history } = props
  const { id } = parseQueryString()

  const [value, setValue] = useState('')
  const [keyWord, setKeyWord] = useState('') // 搜索企业名称
  const [paraKeyWord, setParaKeyWord] = useState('') // 搜索企业名称
  const [textareaValue, setTextareaValue] = useState('') // 批量导入文本粘贴

  const [defaultActiveKey, setDefaultActiveKey] = useState('1')
  const [current_group, setCurrent_group] = useState<any>({
    name: 'all',
    groupId: 'all',
  })
  const [groups, setGroups] = useState([])

  const [isAdd, setIsAdd] = useState(false) // 是否是添加
  const [isEdit, setIsEdit] = useState(false) // 是否是编辑
  const [isCopy, setIsCopy] = useState(false)
  const [isFirst, setIsFirst] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const [isShowRangePicker, setIsShowRangePicker] = useState(false) // 是否显示时间选择器

  const [visible, setVisible] = useState(false)
  const [cancelVisible, setCancelVisible] = useState(false) // 取消收藏确认框
  const [emptyVisible, setEmptyVisible] = useState(false) // 清空收藏确认框
  const [importVisible, setImportVisible] = useState(false) // 批量导入确认框

  const [mouseOnGroupId, setMouseOnGroupId] = useState<any>(false)

  const [paramGroupId, setParamGroupId] = useState<any>('')
  const [sectorId, setSectorId] = useState('')

  const [selectedGroups, setSelectedGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState('')

  const [loading, setLoading] = useState(false)
  const [timelineBoxLoading, setTimelineBoxLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [matchSelectedRowKeys, setMatchSelectedRowKeys] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [companyMatchData, setCompanyMatchData] = useState<any>()
  const [corpeventlist, setCorpeventlist] = useState([]) //企业动态数据

  const [fileList, setFileList] = useState([])

  const [handletoGroupId, setHandletoGroupId] = useState([])

  const [companyCodes, setCompanyCodes] = useState('')

  const [isChanged, setIsChanged] = useState(false)

  const [activeKey, setActiveKey] = useState('1')
  const [activeKeyMenu, setActiveKeyMenu] = useState(keyMenu || '1')

  const [usersector, setUsersector] = useState([]) // 自选股

  const [customDate, setCustomDate] = useState<any>({}) // 自定义时间
  const [activeMenu, setActiveMenu] = useState<any>({
    name: intl('138649', '不限'),
  })
  const [activeSubMenus, setActiveSubMenus] = useState([])

  const [activeDate, setActiveDate] = useState<any>({
    name: intl('138649', '不限'),
  })
  const [currentMenu, setCurrentMenu] = useState([])
  const [sortAfter, setSortAfter] = useState('')
  const sortAfterRef = useRef<any>()
  sortAfterRef.current = sortAfter

  const searchRef = useRef(null)
  const scrollRef = useRef<any>()
  const loadingRef = useRef<any>()
  loadingRef.current = timelineBoxLoading

  const columns = [
    {
      key: 'No.',
      title: intl('138677', '企业名称'),
      dataIndex: 'CompanyName',
      render: (text, record) => (
        <>
          <span>
            <CompanyLink divCss="CompanyName" name={text} id={record?.CompanyCode}></CompanyLink>
          </span>
          {record?.EventAgg ? (
            <span
              className="dynamicTag"
              onClick={() => {
                window.open(`index.html#/SingleCompanyDynamic?companycode=${record?.CompanyCode}`)
              }}
            >
              {record?.EventAgg}
            </span>
          ) : (
            <></>
          )}
        </>
      ),
    },
    {
      title: intl('134794', '企业状态'),
      width: 180,
      dataIndex: 'RegState',
    },
    {
      title: intl('36348', '操作'),
      width: 220,
      dataIndex: 'address',
      render: (text, record) => (
        <span>
          <Popconfirm
            title={intl('371233', `确定要从【${current_group.name}】分组下取消收藏“${record.CompanyName}”吗？`)
              .replace('%', current_group.name)
              .replace('&', record.CompanyName)}
            onConfirm={() => {
              pointBuriedByModule(922602101053)
              handleDeleteCollect(current_group.groupId, record.CompanyCode)
            }}
            okText={intl('19482', '确认')}
            cancelText={intl('19405', '取消')}
          >
            <a>{intl('257657', '取消收藏')}</a>
          </Popconfirm>
          &nbsp;&nbsp;&nbsp;
          <a
            onClick={() => {
              pointBuriedByModule(922602101054)
              setIsCopy(false)
              setVisible(true)
              setCompanyCodes(record.CompanyCode)
            }}
          >
            {intl('370255', '移动到')}
          </a>
          &nbsp;&nbsp;&nbsp;
          <a
            onClick={() => {
              pointBuriedByModule(922602101055)
              setIsCopy(true)
              setVisible(true)
              setCompanyCodes(record.CompanyCode)
            }}
          >
            {intl('370256', '复制到')}
          </a>
        </span>
      ),
    },
  ]

  const now = new Date()
  const CurrentDate = Number(
    now.getFullYear() + ('0' + (now.getMonth() + 1)).slice(-2) + ('0' + now.getDate()).slice(-2)
  )
  const dates = [
    {
      name: intl('138649', '不限'),
      langkey: '',
      endDate: '',
    },
    {
      name: intl('8886', '今日'),
      langkey: '',
      endDate: CurrentDate,
      dateRange: 1,
    },
    {
      name: intl('19332', '昨日'),
      langkey: '',
      endDate: CurrentDate - 1,
      dateRange: 1,
    },
    {
      name: intl('19533', '本周'),
      langkey: '',
      endDate: CurrentDate,
      dateRange: 7,
    },
    {
      name: intl('437894', '上周'),
      langkey: '',
      endDate: CurrentDate - 7,
      dateRange: 7,
    },
    {
      name: intl('19534', '本月'),
      langkey: '',
      endDate: CurrentDate,
      dateRange: 30,
    },
  ]
  // const [pageindex, setPageindex] = useState(0);

  const pageindex = useRef(0)
  useEffect(() => {
    getGroups()
  }, [isChanged])

  const pagenum = 20

  useEffect(() => {
    setLoading(true)
    pageindex.current = 0
    setSelectedRowKeys([])
    setDataSource([])
    searchcollectlist({
      groupId: current_group.groupId,
      keyWord: paraKeyWord,
      pagenum: pagenum,
      pageindex: pageindex.current,
    }).then((result) => {
      if (window.en_access_config && result?.Data?.length) {
        wftCommon.zh2en(result?.Data || [], (newData) => {
          setDataSource(newData)
        })
      }
      setDataSource(() => result?.Data || [])
      setLoading(false)
    })
    const timer = setTimeout(() => {
      const table = document.querySelector('.collect_table') as HTMLElement
      let isRequestingData = false
      // table.scrollTop = 0;
      table &&
        (table.onscroll = function () {
          const scrollTop = table.scrollTop
          const scrollHeight = table.scrollHeight
          const clientHeight = table.clientHeight

          if (scrollTop + clientHeight == scrollHeight && !isRequestingData) {
            isRequestingData = true
            pageindex.current = pageindex.current + 1
            // setLoading(true)
            searchcollectlist({
              groupId: current_group.groupId,
              keyWord: paraKeyWord,
              pagenum: pagenum,
              pageindex: pageindex.current,
            })
              .then((result) => {
                if (!result.Data || !result.Data.length) {
                  setLoading(false)
                  return
                }
                isRequestingData = false
                if (window.en_access_config && result?.Data?.length) {
                  wftCommon.zh2en(result?.Data || [], (newData) => {
                    setDataSource((dataSource) => [...dataSource, ...newData])
                    setLoading(false)
                  })
                } else {
                  setDataSource((dataSource) => dataSource.concat(result?.Data) || [])
                  setLoading(false)
                }
                // setDataSource(dataSource =>[...dataSource, ...result?.Data] || [])
              })
              .catch(() => {
                setLoading(false)
                isRequestingData = false
              })
          }
        })
    }, 1000)
    return () => {
      const table = document.querySelector('.content_table') as HTMLElement
      if (table) table.onscroll = () => {}
      clearTimeout(timer)
    }
  }, [current_group.groupId, isChanged, paraKeyWord])

  useEffect(() => {
    const { endDate, dateRange } = activeDate
    if (activeKeyMenu == '2') {
      function loadMore(e) {
        const { offsetHeight, scrollHeight, scrollTop } = e.target
        // // console.log('🚀 ~loadMore ~ offsetHeight,scrollHeight,scrollTop:', offsetHeight, scrollTop, scrollTop + offsetHeight, scrollHeight)
        if (scrollTop + offsetHeight >= scrollHeight) {
          if (loadingRef.current) return
          fetchData()
        }
      }

      function fetchData() {
        setTimelineBoxLoading(() => true)
        setIsLoading(true)
        const param: any = {
          type: 'list',
          category: activeMenu.value,
          eventType: activeSubMenus.map((i) => i.value).join(','),
          pageSize: 20,
          pageRoll: true,
          groupId: current_group.groupId,
          endDate: endDate || '' + '',
        }
        if (sortAfterRef.current) {
          param.sortAfter = sortAfterRef.current
        }
        if (dateRange) {
          param.dateRange = dateRange
        }
        getcorpeventlist(param)
          .then((res) => {
            const len = res.Data.length
            if (!len) return
            // console.log('🚀 ~useEffect ~ res:', res)
            res.Data.forEach((i) => {
              i.text = getDynamicDetail(i)
              i.event_type_raw = i.event_type
            })
            if (window.en_access_config && res.Data?.length) {
              if (!param.sortAfter) {
                // 仅第一页，采用先展示中文，后展示英文方式，后续还是沿用 中文+英文，方式，避免填充数据紊乱
                setCorpeventlist(res.Data || [])
              }

              wftCommon.zh2en(
                res.Data || [],
                (newData) => {
                  if (param.sortAfter) {
                    res.Data && setCorpeventlist((arr) => [...arr, ...newData])
                  } else {
                    if (newData?.length) {
                      setCorpeventlist([...newData])
                    } else {
                      setCorpeventlist([])
                    }
                  }
                },
                null,
                null,
                ['event_type', 'corp_name', 'text']
              )
            } else {
              if (param.sortAfter) {
                res.Data && setCorpeventlist((arr) => [...arr, ...res.Data])
              } else {
                setCorpeventlist(res.Data || [])
              }
            }

            setSortAfter(() => res.Data[len - 1]?.sortAfter || '')
          })
          .catch(() => {})
          .finally(() => {
            setIsLoading(false)
            setTimelineBoxLoading(() => false)
          })
      }

      setSortAfter(() => '')
      sortAfterRef.current = ''
      setCorpeventlist([])
      fetchData()
      const Dom = scrollRef.current
      // console.log('🚀 ~useEffect ~ Dom:', Dom)
      Dom.addEventListener('scroll', loadMore)
      return () => {
        setSortAfter(() => '')
        Dom.removeEventListener('scroll', loadMore)
      }
    }
  }, [current_group.groupId, activeSubMenus, activeDate, activeKeyMenu, activeMenu])

  const getGroups = () => {
    getcustomercountgroupnew()
      .then((res) => {
        if (window.en_access_config && res?.Data?.length) {
          wftCommon.zh2en(res?.Data || [], (newData) => {
            setGroups(newData)
            setCurrent_group(newData[0])
          })
        }
        // console.log('🚀 ~getcustomercountgroupnew ~ res:', res)
        setGroups(res?.Data || [])
        setCurrent_group(res?.Data[0])
      })
      .catch(() => {})
  }

  const handleSelect = (data) => {
    setCurrent_group(data)
  }

  const handleAddGroup = () => {
    if (value && !groups.some((i) => i.name == value)) {
      addCustomerBatch({
        groupName: value,
      }).then((res) => {
        // console.log('🚀 ~handleAddGroup ~ res:', res)
        // message.success('')
        setValue('')
        setIsAdd(false)
        if (res.ErrorCode == '200019' || res.ErrorCode == '200008') {
          message.warning(intl('370840', '最多添加10个分组'))
        }
        getcustomercountgroupnew()
          .then((res) => {
            // console.log('🚀 ~getcustomercountgroupnew ~ res:', res)
            setGroups(res?.Data || [])
            const group = res?.Data.find((i) => i.name == value)
            group && setCurrent_group(group)
          })
          .catch(() => {})
      })
    }
  }

  const handleUpdateGroup = (groupId) => {
    if (value) {
      updatecustomergroup({
        groupId,
        groupName: value,
      }).then(() => {
        setIsEdit(false)
        setValue('')
        getcustomercountgroupnew()
          .then((res) => {
            setGroups(res?.Data || [])
          })
          .catch(() => {})
      })
    }
  }

  const handleDeleteGroup = (groupId) => {
    const index = groups.findIndex((i) => i.groupId == groupId)
    deletecustomergroups({
      groupId,
    }).then(() => {
      getcustomercountgroupnew()
        .then((res) => {
          if (!res.Data && res.ErrorCode) {
            message.error(res.ErrorMessage)
          }

          setGroups(res?.Data || [])
          setCurrent_group(res?.Data[index] || res?.Data[index - 1])
        })
        .catch(() => {})
    })
  }

  const handleDeleteCollect = (groupId, CompanyCode) => {
    return DeleteCustomer({
      groupId,
      CompanyCode,
    }).then(() => {
      // console.log('🚀 ~handleDeleteCollect ~ res:', res)
      setIsChanged(!isChanged)
    })
  }

  const dispalyImportModal = () => {
    setImportVisible(true)
    setFileList([])
    // @ts-expect-error ttt
    setCompanyMatchData()
    setIsFirst(true)
    setTextareaValue('')
    setActiveKey('1')
    setMatchSelectedRowKeys([])
  }

  const handleOk = () => {
    setSelectedGroup('')
    setSelectedGroups([])
    const param = {
      from: current_group.groupId,
      to: handletoGroupId,
      companyCodes,
    }
    if (isCopy) {
      copycollectionentity(param).then(() => {
        message.success(intl('144378', '复制成功'))
        setVisible(false)
        setCompanyCodes('')
        setIsChanged(!isChanged)
      })
    } else {
      movecollectionentity(param).then(() => {
        message.success(intl('370833', '移动成功'))
        setVisible(false)
        setCompanyCodes('')
        setIsChanged(!isChanged)
      })
    }
  }

  // 移动到
  const onChange = (e) => {
    // console.log('🚀 ~onChange ~ e:', e)
    if (isCopy) {
      setSelectedGroups(e)
    } else {
      setSelectedGroup(e.target.value)
    }
    setHandletoGroupId(isCopy ? e.join(',') : e.target.value)
  }

  // 文本域
  const handleTextAreaChange = (e) => {
    setTextareaValue(e.target.value)
  }

  const mapText2JSX = ({ event_type_raw, text, event_id, event_source_id, corp_id }) => {
    switch (event_type_raw) {
      case '招投标公告':
        return (
          // @ts-expect-error ttt
          <Link target="_blank" href={`index.html?nosearch=1#/biddingDetail?detailid=${event_source_id}`}>
            {text}
          </Link>
        )
      case '招聘信息':
        return (
          <Link
            // @ts-expect-error ttt
            target="_blank"
            href={`index.html#/jobDetail?type=jobs&detailid=${event_source_id}&jobComCode=${corp_id}`}
          >
            {text}
          </Link>
        )

      // 法律诉讼
      case '裁判文书':
        return (
          // @ts-expect-error ttt
          <Link target="_blank" href={`index.html#/lawdetail?reportName=Judgment&id=${event_source_id}`}>
            {text}
          </Link>
        )
      case '开庭公告':
        return (
          // @ts-expect-error ttt
          <Link target="_blank" href={`index.html#/lawdetail?reportName=CourtSession&id=${event_source_id}`}>
            {text}
          </Link>
        )
      case '法院公告':
        return (
          // @ts-expect-error ttt
          <Link target="_blank" href={`index.html#/lawdetail?reportName=CourtAnnouncement&id=${event_source_id}`}>
            {text}
          </Link>
        )

      // 知识产权
      case '商标信息':
        return (
          // @ts-expect-error ttt
          <Link target="_blank" href={`index.html?type=brand&expover=${0}&detailid=${event_source_id}#/logoDetail`}>
            {text}
          </Link>
        )
      case '专利信息':
        return (
          // @ts-expect-error ttt
          <Link target="_blank" href={`index.html#/patentDetail?nosearch=1&detailId=${event_id}`}>
            {text}
          </Link>
        )

      default:
        return text
    }
  }

  const radioStyle = {
    display: 'block',
    height: '34px',
    lineHeight: '34px',
  }

  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      setSelectedRowKeys(selectedRowKeys)
    },
    // getCheckboxProps: record => ({
    //     disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    // }),
  }

  const matchRowSelection = {
    type: 'checkbox',
    selectedRowKeys: matchSelectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      setMatchSelectedRowKeys(selectedRowKeys)
    },
    // getCheckboxProps: record => ({
    //     disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    // }),
  }
  const footer = (
    <div>
      <br />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span>{intl('437801', '导入到我的收藏分组')}&nbsp; </span>
        <Select
          allowClear
          // value={paramGroupId}
          placeholder={intl('437320', '选择分组')}
          onChange={(groupId) => {
            setParamGroupId(groupId)
          }}
          style={{ flex: 1 }}
        >
          {groups.map(({ name, groupId }) =>
            groupId === 'all' ? (
              <></>
            ) : (
              // @ts-expect-error ttt
              <Option key={groupId} title={name}>
                {name}
              </Option>
            )
          )}
        </Select>
      </div>
    </div>
  )

  const dupName = (
    <p
      style={{
        lineHeight: '16px',
        fontSize: '12px',
        color: '#D9001B',
      }}
    >
      {intl('371234', '与现有分组重名')}
    </p>
  )

  const matchResult = (
    <>
      <p
        style={{
          margin: '4px 0 16px',
        }}
      >
        {intl('370855', `匹配成功 % 家企业，匹配失败 & 家企业`)
          .replace('%', companyMatchData?.successNum)
          .replace('&', companyMatchData?.errorNum)}
      </p>
      <Table
        dataSource={companyMatchData?.companyMatchList
          ?.filter((i) => i.corpId)
          .map((i) => ({
            ...i,
            key: i.corpId,
          }))}
        scroll={{
          y: 300,
        }}
        className="companyMatchList"
        columns={[
          {
            title: intl('138677', '企业名称'),
            dataIndex: 'corpName',
            render: (text) => (
              <>
                <span>{text}</span>
              </>
            ),
          },
          {
            title: intl('370841', '所属地区/省份'),
            dataIndex: 'region',
            render: (text) => (
              <>
                <span>{text}</span>
              </>
            ),
          },
        ]}
        // scroll={{
        //     y:300
        // }}
        pagination={false}
        rowSelection={matchRowSelection}
        empty={intl('17235', '暂无数据')}
      ></Table>

      {footer}
    </>
  )

  return (
    <React.Fragment>
      <div className="breadcrumb-box">
        <Breadcrumb>
          <Breadcrumb.Item style={{ cursor: 'pointer' }}>{intl('19475', '首页')}</Breadcrumb.Item>
          <Breadcrumb.Item style={{ cursor: 'pointer' }}>{intl('370234', '收藏&动态')}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div id="companyCollect">
        {/* 页面的任何地方加上Prompt组件都生效 */}
        {/* <Prompt when={isHoldUpRouter} message={this.handleRouterHoldUp} /> */}

        {/*// @ts-expect-error ttt*/}
        <Layout
          style={{
            backgroundColor: 'transparent',
          }}
        >
          {/*// @ts-expect-error ttt*/}
          <Sider
            theme="light"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '4px',
            }}
          >
            <div className="collect_menu">
              <div className="title">
                <span>{intl('370253', '收藏分组')}</span>
                <Tooltip title={intl('370838', '点击新增分组')}>
                  <Button
                    type="text"
                    onClick={() => {
                      pointBuriedByModule(922602101049)
                      setValue('')
                      setIsAdd(true)
                      setIsEdit(false)
                    }}
                    icon={
                      <PlusCircleO
                        className="add-group-icon"
                        title={intl('370838', '点击新增分组')}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    }
                  />
                </Tooltip>
              </div>
              <div className="tree">
                {groups.map((i) => {
                  return (
                    <div
                      key={i.groupId}
                      className={classNames('group', {
                        current_group: i.groupId === current_group.groupId,
                      })}
                      onClick={() => {
                        setParaKeyWord('')
                        setKeyWord('')
                        handleSelect(i)
                      }}
                      onMouseEnter={() => {
                        if (isEdit) return
                        setMouseOnGroupId(i.groupId)
                      }}
                      onMouseLeave={() => {
                        if (isEdit) return
                        setMouseOnGroupId('')
                      }}
                    >
                      {mouseOnGroupId == i.groupId && isEdit ? (
                        <div className="EditBox">
                          <Input
                            size="mini"
                            placeholder=""
                            autoFocus
                            value={value}
                            onChange={(e) => {
                              setValue(e.target.value)
                            }}
                            style={{
                              width: '130px',
                              marginRight: '12px ',
                            }}
                          />
                          <Button
                            type="text"
                            onClick={() => {
                              handleUpdateGroup(i.groupId)
                            }}
                            icon={<CheckO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                          />
                          &nbsp;&nbsp;
                          <Button
                            type="text"
                            onClick={() => {
                              setIsEdit(false)
                            }}
                            icon={<CloseO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                          />
                          {groups.some((j) => j.name == value && j.name !== i.name) ? dupName : <></>}
                        </div>
                      ) : (
                        <>
                          <span className="groupName">
                            &nbsp;{i.name}（{i.num}）
                          </span>
                          {mouseOnGroupId == i.groupId && i.groupId !== 'all' ? (
                            <>
                              <Button
                                type="text"
                                className={classNames({
                                  'icon-in-active-menu': i.groupId === current_group.groupId,
                                })}
                                onClick={() => {
                                  pointBuriedByModule(922602101051)
                                  setIsAdd(false)
                                  setIsEdit(true)
                                  setValue(i.name)
                                }}
                                icon={<EditO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                              />
                              &nbsp;&nbsp;
                              {groups?.length > 2 ? (
                                <Popconfirm
                                  title={intl('370837', `删除操作不可撤销，确定删除分组“%”么？`).replace('%', i.name)}
                                  onConfirm={() => {
                                    pointBuriedByModule(922602101050)
                                    handleDeleteGroup(i.groupId)
                                  }}
                                  okText={intl('19482', '确认')}
                                  cancelText={intl('19405', '取消')}
                                >
                                  <DeleteOBtn
                                    className={classNames({
                                      'icon-in-active-menu': i.groupId === current_group.groupId,
                                    })}
                                  />
                                </Popconfirm>
                              ) : (
                                <></>
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
                {isAdd ? (
                  <div className="add-group-box">
                    <Input
                      size="mini"
                      placeholder=""
                      value={value}
                      onChange={(e) => {
                        setValue(e.target.value)
                      }}
                      style={{
                        width: '130px',
                        marginRight: '12px ',
                      }}
                    />
                    <Button
                      type="text"
                      onClick={handleAddGroup}
                      icon={<CheckO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                    />
                    &nbsp;&nbsp;
                    <Button
                      type="text"
                      onClick={() => {
                        setIsAdd(false)
                      }}
                      icon={<CloseO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                    />
                    {groups.some((i) => i.name == value) ? dupName : <></>}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </Sider>
          {/*// @ts-expect-error ttt*/}
          <Layout
            className="content_Layout"
            style={{
              marginLeft: '24px',
            }}
          >
            {/*// @ts-expect-error ttt*/}
            <Tabs
              defaultActiveKey={defaultActiveKey}
              activeKey={activeKeyMenu}
              onChange={(key) => {
                if (key === '2') {
                  pointBuriedByModule(922602101058)
                }
                props.history.push(`/companyDynamic?keyMenu=${key}`)
                setActiveKeyMenu(key)
              }}
            >
              {/*// @ts-expect-error ttt*/}
              <TabPane tab={intl('370235', '收藏的企业')} key="1">
                <div className="operation">
                  <Search
                    ref={searchRef}
                    style={{ flex: 1 }}
                    value={keyWord}
                    onChange={(e) => {
                      setKeyWord(e.target.value)
                    }}
                    placeholder={intl('317177', '搜索企业名称')}
                    onSearch={(value) => {
                      pointBuriedByModule(922602101057)
                      setParaKeyWord(value)
                    }}
                    allowClear
                  ></Search>
                  <div className="operation_btns">
                    <Button
                      icon={<DeleteO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                      onClick={() => {
                        pointBuriedByModule(922602101052)
                        setEmptyVisible(true)
                      }}
                    >
                      {intl('437738', '清空收藏')}
                    </Button>

                    <Button
                      icon={<img className="operation_btns_icon" src={Cancel} />}
                      onClick={() => {
                        if (!selectedRowKeys.length) {
                          return message.warn(intl('373273', '至少选择1条数据'))
                        }
                        pointBuriedByModule(922602101053)

                        setCancelVisible(true)
                      }}
                    >
                      {intl('257657', '取消收藏')}
                    </Button>

                    <Button
                      icon={<img className="operation_btns_icon" src={yidongdao} />}
                      onClick={() => {
                        if (!selectedRowKeys.length) {
                          return message.warn(intl('373273', '至少选择1条数据'))
                        }
                        pointBuriedByModule(922602101054)
                        setCompanyCodes(selectedRowKeys.join(','))
                        setVisible(true)
                        setIsCopy(false)
                      }}
                    >
                      {intl('370255', '移动到')}
                    </Button>

                    <Button
                      icon={<CopyO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                      onClick={() => {
                        if (!selectedRowKeys.length) {
                          return message.warn(intl('373273', '至少选择1条数据'))
                        }
                        pointBuriedByModule(922602101055)
                        setCompanyCodes(selectedRowKeys.join(','))
                        setVisible(true)
                        setIsCopy(true)
                      }}
                    >
                      {intl('370256', '复制到')}
                    </Button>

                    <Button
                      icon={<FileAddO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                      onClick={() => {
                        pointBuriedByModule(922602101056)
                        dispalyImportModal()
                      }}
                    >
                      {intl('286238', '批量导入')}
                    </Button>
                  </div>
                </div>
                <div className="collect_table">
                  <Table
                    columns={columns}
                    pagination={false}
                    empty={
                      <div
                        style={{
                          height: 'calc(100vh - 300px)',
                          textAlign: 'center',
                          lineHeight: 'calc(100vh - 300px)',
                        }}
                      >
                        {intl('370244', '暂无收藏的企业，')}
                        <a onClick={dispalyImportModal}>{intl('370263', '点击添加')}</a>
                      </div>
                    }
                    dataSource={dataSource.map((i) => ({
                      ...i,
                      key: i.CompanyCode,
                    }))}
                    loading={loading}
                    rowSelection={rowSelection}
                    size="large"
                  />
                </div>
              </TabPane>
              {/*// @ts-expect-error ttt*/}
              <TabPane tab={intl('370254', '企业动态')} key="2">
                <Row className="dynamicType">
                  <Col
                    span={2}
                    style={{
                      color: '#666',
                    }}
                  >
                    {intl('432248', '动态类型')}
                  </Col>
                  <Col span={21}>
                    {corpDynamicMenu.map((i) => (
                      <span
                        className={activeMenu.name == i.name ? 'activeMenu span' : 'span'}
                        onClick={() => {
                          setActiveMenu(i)
                          setCurrentMenu(i.children || [])
                          setActiveSubMenus([i.children[0] || ''])
                        }}
                      >
                        {intl('', i.name)}
                      </span>
                    ))}
                  </Col>
                  {currentMenu.length ? (
                    <>
                      <Col
                        span={2}
                        style={{
                          color: '#666',
                        }}
                      ></Col>
                      <Col
                        span={21}
                        style={{
                          marginTop: '12px',
                        }}
                      >
                        {currentMenu.map((i, index, arr) => (
                          <span
                            className={activeSubMenus.find((j) => j.name == i.name) ? 'activeMenu span' : 'span'}
                            onClick={() => {
                              setActiveSubMenus((menu) => {
                                const index = menu.findIndex((j) => j.name == i.name)
                                const isAllindex = menu.findIndex((j) => j.name == arr[0].name)
                                if (index > -1) {
                                  menu.splice(index, 1)
                                } else {
                                  if (i.isAll) {
                                    return [i]
                                  } else {
                                    isAllindex > -1 && menu.splice(isAllindex, 1)
                                    menu.push(i)
                                  }
                                }
                                if (!menu.length) menu = [arr[0]]

                                return [...menu]
                              })
                            }}
                          >
                            {intl('', i.name)}
                          </span>
                        ))}
                      </Col>
                    </>
                  ) : (
                    <></>
                  )}
                </Row>

                <Row className="dynamicDate">
                  <Col
                    span={2}
                    style={{
                      color: '#666',
                    }}
                  >
                    {intl('437308', '动态时间')}
                  </Col>
                  <Col span={22}>
                    {dates.map((i) => (
                      <span
                        className={activeDate.name == i.name ? 'activeMenu span' : 'span'}
                        onClick={() => {
                          setActiveDate(i)
                          setIsShowRangePicker(false)
                        }}
                      >
                        {intl('', i.name)}
                      </span>
                    ))}

                    <span
                      style={{
                        position: 'relative',
                      }}
                      // onBlur={()=>{
                      //   setIsShowRangePicker(false)
                      // }}
                      onClick={(e) => {
                        // console.log('🚀 ~CompanyDynamic ~ e:', e)
                        // @ts-expect-error ttt
                        if (e.target.nodeName == 'SPAN') {
                          setIsShowRangePicker(true)
                        }
                      }}
                      className={activeDate.name && customDate.name == activeDate.name ? 'activeMenu span' : 'span'}
                    >
                      {customDate.name || intl('25405', '自定义')}
                      <RangePickerDialog
                        show={isShowRangePicker}
                        onClose={() => setIsShowRangePicker(false)}
                        onChoose={(dateObj) => {
                          setActiveDate(dateObj)
                          setCustomDate(dateObj)
                        }}
                      />
                    </span>
                  </Col>
                </Row>

                <div className="timelineBox" ref={scrollRef}>
                  {corpeventlist && corpeventlist.length ? (
                    <Timeline>
                      {corpeventlist.map((i, index, arr) => (
                        <>
                          {/*// @ts-expect-error ttt*/}
                          <Timeline.Item
                            color="blue"
                            title={
                              arr[index - 1]?.event_date == i.event_date &&
                              arr[index - 1]?.event_type == i.event_type &&
                              arr[index - 1]?.corp_name == i.corp_name
                                ? ''
                                : i.event_date || ''
                            }
                            dot={
                              arr[index - 1]?.event_date == i.event_date &&
                              arr[index - 1]?.event_type == i.event_type &&
                              arr[index - 1]?.corp_name == i.corp_name ? (
                                <></>
                              ) : (
                                ''
                              )
                            }
                          >
                            <p
                              style={{
                                color: '#333',
                                fontWeight: 'bold',
                              }}
                            >
                              <CompanyLink divCss="CompanyName" name={i.corp_name || ''} id={i.corp_id}></CompanyLink>
                            </p>
                            <div
                              style={{
                                fontSize: '14px',
                                margin: '12px 0',
                                paddingRight: '20px',
                              }}
                            >
                              {/*// @ts-expect-error ttt*/}
                              <Tag
                                style={{
                                  color: '#6D78A5',
                                  cursor: 'default',
                                  borderColor: 'rgba(109, 120, 165, 0.5)',
                                  backgroundColor: 'transparent',
                                }}
                              >
                                {i.event_type || ''}
                              </Tag>
                              <span>{mapText2JSX(i)}</span>
                            </div>
                            <div
                              style={{
                                fontSize: '14px',
                              }}
                            ></div>
                          </Timeline.Item>
                        </>
                      ))}
                    </Timeline>
                  ) : (
                    <div
                      style={{
                        height: '300',
                        lineHeight: '300px',
                        textAlign: 'center',
                        color: '#333',
                        fontSize: '14px',
                      }}
                    >
                      {isLoading ? (
                        intl('132761', '加载中')
                      ) : current_group.num ? (
                        intl('17235', '暂无数据')
                      ) : (
                        <>
                          <span>{intl('370244', '暂无收藏的企业，')}</span>
                          <a onClick={dispalyImportModal}>{intl('370263', '点击添加')}</a>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </TabPane>
            </Tabs>
          </Layout>
        </Layout>

        {/*// @ts-expect-error ttt*/}
        <Modal
          title={isCopy ? intl('370256', '复制到') : intl('370255', '移动到')}
          visible={visible}
          onOk={handleOk}
          onCancel={() => {
            setSelectedGroup('')
            setSelectedGroups([])
            setVisible(false)
          }}
        >
          {isCopy ? (
            <>
              {/*// @ts-expect-error ttt*/}
              <p>{intl('370258', `将选中的%家企业复制到`).replace('%', selectedRowKeys.length)}</p>
              <CheckboxGroup
                name="fruit"
                value={selectedGroups}
                options={groups
                  .filter((i) => i?.groupId !== 'all' && i?.groupId !== current_group.groupId)
                  .map((i) => ({
                    label: i.name,
                    value: i.groupId,
                  }))}
                onChange={onChange}
              />
            </>
          ) : (
            <>
              {/*// @ts-expect-error ttt*/}
              <p>{intl('370238', `将选中的%家企业移动到`).replace('%', selectedRowKeys.length)}</p>
              <RadioGroup value={selectedGroup} onChange={onChange}>
                {groups.map((i) => {
                  if (i.groupId == 'all') return
                  return (
                    <Radio key={i.groupId} style={radioStyle} value={i.groupId}>
                      {i.name}
                    </Radio>
                  )
                })}
              </RadioGroup>
            </>
          )}
        </Modal>

        {/*// @ts-expect-error ttt*/}
        <Modal
          title={intl('437738', '清空收藏')}
          visible={emptyVisible}
          onOk={() => {
            cleancollectiongroup({
              groupId: current_group.groupId,
            }).then(() => {
              setIsChanged(!isChanged)
              setEmptyVisible(false)
            })
          }}
          onCancel={() => {
            setEmptyVisible(false)
          }}
        >
          <p>
            {intl('370236', `确定要清空【${current_group.name}】分组下的全部${dataSource.length}家公司吗？`)
              .replace('%', current_group.name)
              // @ts-expect-error ttt
              .replace('&', dataSource.length)}
          </p>
        </Modal>
        {/*// @ts-expect-error ttt*/}
        <Modal
          title={intl('257657', '取消收藏')}
          visible={cancelVisible}
          onOk={() => {
            handleDeleteCollect(current_group.groupId, selectedRowKeys.join(',')).then(() => {
              setCancelVisible(false)
              setIsChanged(!isChanged)
            })
          }}
          onCancel={() => {
            setCancelVisible(false)
          }}
        >
          <p>
            {intl('370237', `确定要从【${current_group.name}】分组下取消收藏${selectedRowKeys.length}家公司吗？`)
              .replace('%', current_group.name)
              // @ts-expect-error ttt
              .replace('&', selectedRowKeys.length)}
          </p>
        </Modal>

        {/*// @ts-expect-error ttt*/}
        <Modal
          title={intl('286238', '批量导入')}
          visible={importVisible}
          onOk={() => {}}
          onCancel={() => {
            setImportVisible(false)
            setIsFirst(true)
            // @ts-expect-error ttt
            setCompanyMatchData()
          }}
          footer={
            isFirst
              ? [
                  <Button
                    key="back"
                    size="large"
                    style={{
                      width: '80px',
                    }}
                    onClick={() => {
                      setImportVisible(false)
                    }}
                  >
                    {intl('19405', '取消')}
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    size="large"
                    loading={false}
                    onClick={() => {
                      let queryText
                      switch (activeKey) {
                        case '1':
                          if (fileList[0].status == 'error') {
                            return message.error(intl('371013', '单次最多导入100家企业'))
                          }
                          if (companyMatchData) {
                            setIsFirst(false)
                          }
                          break
                        case '2':
                          queryText = textareaValue.replace(/[\s\n\r]/g, ',')
                          batchquerycorp({
                            queryText: queryText,
                          }).then((res) => {
                            if (res.ErrorCode == 1 && res.ErrorMessage) {
                              return message.error(res.ErrorMessage)
                            }
                            setCompanyMatchData(res.Data)
                            setIsFirst(false)
                            // console.log('🚀 ~CompanyDynamic ~ res:', res)
                          })
                          break
                        case '3':
                          sectorId &&
                            getsectorstockinfobysectorid({
                              sectorId,
                            }).then((res) => {
                              setCompanyMatchData(res?.Data || [])
                              setIsFirst(false)
                            })
                          break
                        default:
                          break
                      }
                    }}
                    style={{
                      width: '80px',
                    }}
                  >
                    {intl('437739', '下一步')}
                  </Button>,
                ]
              : [
                  <Button
                    key="back"
                    size="large"
                    style={{
                      width: '80px',
                    }}
                    onClick={() => {
                      setIsFirst(true)
                      setCompanyMatchData('')
                    }}
                  >
                    {intl('12855', '上一步')}
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    size="large"
                    loading={false}
                    onClick={() => {
                      paramGroupId &&
                        matchSelectedRowKeys &&
                        matchSelectedRowKeys.length &&
                        addtomycustomer({
                          CompanyCode: matchSelectedRowKeys.join(','),
                          groupId: paramGroupId,
                        }).then((res) => {
                          if (res.ErrorCode === '200026') {
                            message.warn(intl('370834', '最多收藏2000家企业'))
                          }
                          if (res.Data === true) {
                            // message.success(intl('','导入成功'))
                            setImportVisible(false)
                            setIsFirst(true)
                            setCompanyMatchData('')
                            setCurrent_group(groups.find((i) => i.groupId === paramGroupId))
                            setIsChanged((i) => !i)
                          }
                          // console.log('🚀 ~CompanyDynamic ~ res:', res)
                        })
                    }}
                    style={{
                      width: '80px',
                    }}
                  >
                    {intl('257656', '导入')}
                  </Button>,
                ]
          }
          className="importModal"
        >
          {/*// @ts-expect-error ttt*/}
          <Tabs
            defaultActiveKey="1"
            activeKey={activeKey}
            onChange={(key) => {
              setIsFirst(true)
              // if(!isFirst)return
              setActiveKey(key)
              // @ts-expect-error ttt
              if (key == 3) {
                getusersector().then((res) => {
                  setUsersector(res.Data || [])
                })
              }
            }}
          >
            {/*// @ts-expect-error ttt*/}
            <TabPane tab={intl('437889', '文件导入')} key="1">
              {isFirst ? (
                <div className="fileUpload">
                  {/*// @ts-expect-error ttt*/}
                  <Dragger
                    name="file"
                    // showUploadList={false}
                    fileList={fileList}
                    accept={'.xlsx'}
                    beforeUpload={(file, fileList) => {
                      const reader = new FileReader()
                      reader.onload = function (e) {
                        // @ts-expect-error ttt
                        const data = new Uint8Array(e.target.result)
                        const workbook = XLSX.read(data, { type: 'array' })
                        // console.log('🚀 ~CompanyDynamic ~ workbook:', workbook)
                        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
                        // @ts-expect-error ttt
                        const csv = XLSX.utils.sheet_to_csv(worksheet, { header: 1 })
                        const rows = csv
                          .split('\n')
                          .filter((i) => {
                            const reg = /^,*$/
                            return !reg.test(i)
                          })
                          .map((i) => {
                            const arr = i.split(',')
                            let temp = arr.shift()
                            while (!temp && arr.length) {
                              temp = arr.shift()
                            }
                            return temp
                          }) // 获取到的有效数据行式数组
                        // console.log('🚀 ~CompanyDynamic ~ csv:', csv)
                        // console.log('🚀 ~CompanyDynamic ~ rows:', rows)
                        rows.shift()
                        if (rows.length > 100) {
                          fileList[0].status = 'error'
                          message.error(intl('371013', '单次最多导入100家企业'))
                        }
                        const queryText = rows.join(',')
                        batchquerycorp({
                          queryText: queryText,
                        }).then((res) => {
                          if (res.ErrorCode == 1 && res.ErrorMessage) {
                            return message.error(res.ErrorMessage)
                          }
                          setCompanyMatchData(res.Data)
                          // console.log('🚀 ~CompanyDynamic ~ res:', res)
                        })
                      }
                      // @ts-expect-error ttt
                      reader.readAsArrayBuffer(file)
                      console.log('file', file, fileList)
                      setFileList(fileList)
                      return false
                    }}
                    onRemove={() => {
                      setFileList([])
                      return true
                    }}
                  >
                    <p className="w-upload-drag-icon">
                      <FileTextO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    </p>
                    <p className="w-upload-text">
                      <a>{intl('286682', '点击上传')}</a>/{intl('370853', '拖拽Excel文件到此区域')}
                    </p>
                    <p className="w-upload-text">{intl('370993', '请上传Excel文件，查询企业家数在100家以内')}</p>
                  </Dragger>
                  <p>
                    {intl('370836', '第一步：点击下载')}
                    <a
                      href={
                        process.env.NODE_ENV == 'production'
                          ? '/Wind.WFC.Enterprise.Web/PC.Front/resource/static/ExportTemplate.xlsx'
                          : '/ExportTemplate.xlsx'
                      }
                      download={`${intl('437790', '模板文件')}.xlsx`}
                    >
                      {`${intl('437790', '模板文件')}.xlsx`}
                    </a>
                    {intl(
                      '370854',
                      '，并在此Excel文件中补充企业全称、曾用名或统一社会信用代码，单次最多关注100家企业。'
                    )}
                  </p>
                  <br />
                  <p>{intl('370259', '第二步：保存文件后，点击下方按钮或拖拽文件到下方区域导入文件。')}</p>
                </div>
              ) : (
                matchResult
              )}
            </TabPane>
            {/*// @ts-expect-error ttt*/}
            <TabPane tab={intl('370261', '文本粘贴')} key="2">
              {isFirst ? (
                <>
                  <TextArea
                    value={textareaValue}
                    placeholder={intl('370260', '粘贴企业名称或统一社会信用代码进行查询')}
                    autosize={{ minRows: 6, maxRows: 8 }}
                    style={{
                      margin: '12px 0 24px',
                      // ...TextAreaStyle
                    }}
                    onChange={handleTextAreaChange}
                  ></TextArea>

                  <p className="color999">{intl('370240', '第一步：粘贴企业名称或统一社会信用代码进行查询。')}</p>
                  <br />
                  <p className="color999">
                    {intl('370241', '第二步：每个企业的名称或统一社会信用代码为1行，单次粘贴的文本数量不超过100行。')}
                  </p>
                </>
              ) : (
                matchResult
              )}
            </TabPane>
            {/*// @ts-expect-error ttt*/}
            <TabPane tab={intl('370262', '自选股导入')} key="3">
              {isFirst ? (
                <div style={{ marginTop: '12px', padding: 0 }}>
                  <span>{intl('370242', '要导入的自选股：')}</span>
                  <Select
                    allowClear
                    placeholder={intl('437320', '选择分组')}
                    onChange={(sectorId) => {
                      // @ts-expect-error ttt
                      setSectorId(sectorId)
                    }}
                    style={{ width: 'calc(100% - 150px)' }}
                  >
                    {usersector?.map(({ sectorName, sectorId }) => (
                      // @ts-expect-error ttt
                      <Option key={sectorId} title={sectorName}>
                        {sectorName}
                      </Option>
                    ))}
                  </Select>
                </div>
              ) : (
                matchResult
              )}
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = () => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyDynamic)
