import {
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  Divider,
  Input,
  Layout,
  Menu,
  Radio,
  Resizer,
  Select,
  Tabs,
  ThemeProvider,
  Tree,
} from '@wind/wind-ui'
import Form from '@wind/wind-ui-form'
import Table from '@wind/wind-ui-table'
import queryString from 'qs'
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { pointBuriedGel } from '../../api/configApi'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import {
  getqualificationdetail,
  getqualificationfilter,
  getqualificationslist,
  getqualificationtree,
} from '../../api/qualificationsApi'
import CompanyLink from '../../components/company/CompanyLink'
import { VipModule } from '../../components/company/VipModule'
import { usePageTitle } from '../../handle/siteTitle'
import { getVipInfo } from '../../lib/utils'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import { qualificationBury } from './qualificationBury'
import './qualifications_detail.less'

const { SubMenu } = Menu
const { Header, Content, Sider, Operator } = Layout
const TreeNode = Tree.TreeNode
const Search = Input.Search
const Option = Select.Option
const { RangePicker, MonthRangePicker } = DatePicker
const TabPane = Tabs.TabPane
const { HorizontalTable } = Table

const RadioGroup = Radio.Group

/** !warning 勿删 */
const old = {
  62880: { point: '922602100946', name: '资质详情页-造价咨询资质' },
  62881: { point: '922602100945', name: '资质详情页-设计与施工一体化资质' },
  62882: { point: '922602100943', name: '资质详情页-勘查资质' },
  62883: { point: '922602100944', name: '资质详情页-监理资质' },
  62884: { point: '922602100942', name: '资质详情页-建筑业企业资质' },
  62885: { point: '922602100947', name: '资质详情页-设计资质' },
  65891629: { point: '922602100904', name: '资质详情页-支付业务许可' },
  65891630: { point: '922602100911', name: '资质详情页-小额贷款公司经营许可' },
  65891631: { point: '922602100916', name: '资质详情页-装帧流通人民币许可' },
  65891632: {
    point: '922602100917',
    name: '资质详情页-国库集中支付代理银行资格认定',
  },
  65891633: { point: '922602100905', name: '资质详情页-银行卡清算业务许可' },
  65891634: { point: '922602100910', name: '资质详情页-金融许可' },
  65891635: { point: '922602100912', name: '资质详情页-保险许可' },
  65891636: { point: '922602100913', name: '资质详情页-保险中介许可' },
  65891637: { point: '922602100915', name: '资质详情页-典当经营许可' },
  65891886: {
    point: '922602100918',
    name: '资质详情页-在宣传品、出版物或者其他商品上使用人民币',
  },
  65891887: {
    point: '922602100919',
    name: '资质详情页-黄金及其制品进出口行政许可',
  },
  65891889: { point: '922602100914', name: '资质详情页-经营证券期货业务许可' },
  137025226: { point: '922602100901', name: '资质详情页-进口网络游戏审批许可' },
  137025227: { point: '922602100899', name: '资质详情页-国产网络游戏审批许可' },
  137025384: {
    point: '922602100907',
    name: '资质详情页-互联网域名根服务器设置及其运行机构和注册管理机构设立审批',
  },
  137025486: { point: '922602100900', name: '资质详情页-进口电子游戏审批许可' },
  137025643: { point: '922602100909', name: '资质详情页-开采黄金矿产许可' },
  137025644: {
    point: '922602100906',
    name: '资质详情页-设立互联网域名注册服务机构审批',
  },
  137026640: { point: '922602100908', name: '资质详情页-电子认证服务许可' },
  137026950: {
    point: '922602100920',
    name: '资质详情页-设立经营个人征信业务的征信机构审批',
  },
  137026952: { point: '922602100902', name: '资质详情页-企业征信机构备案' },
  137027207: { point: '922602100921', name: '资质详情页-金融控股公司准入' },
  137027208: { point: '922602100903', name: '资质详情页-信用评级机构备案' },
  137979989: {
    point: '922602100922',
    name: '资质详情页-银行卡清算机构获准筹备机构',
  },
  142622857: { point: '922602100924', name: '资质详情页-代理国家金库业务' },
  142622860: {
    point: '922602100925',
    name: '资质详情页-非税收入收缴业务及代理银行资格',
  },
  142623262: {
    point: '922602100923',
    name: '资质详情页-银行办理即期结售汇业务',
  },
  142623265: { point: '922602100926', name: '资质详情页-进出口企业名录登记' },
  948895990: {
    point: '922602100928',
    name: '资质详情页-合格境内机构投资者资格的批复',
  },
  948895991: {
    point: '922602100929',
    name: '资质详情页-合格境外机构投资者托管人资格的批复',
  },
  948895992: { point: '922602100930', name: '资质详情页-合格境外投资者批复' },
  948899247: {
    point: '922602100931',
    name: '资质详情页-基金监管特定客户资产管理业务资格',
  },
  948899248: { point: '922602100932', name: '资质详情页-证券投资咨询业务资格' },
  948900504: { point: '922602100933', name: '资质详情页-证券自营业务许可' },
  948901761: { point: '922602100934', name: '资质详情页-证券经纪业务许可' },
  948903018: {
    point: '922602100935',
    name: '资质详情页-证券承销与保荐业务许可',
  },
  948904275: { point: '922602100936', name: '资质详情页-证券资产管理业务许可' },
  948904276: { point: '922602100937', name: '资质详情页-证券外资股业务许可' },
  948906789: { point: '922602100938', name: '资质详情页-期货监管业务资格' },
  948906790: { point: '922602100939', name: '资质详情页-基金销售业务资格许可' },
  948923046: { point: '922602100940', name: '资质详情页-基金托管业务资格许可' },
  1225193195: { point: '922602100927', name: '资质详情页-公募基金注册' },
  2597253491: {
    point: '922602100941',
    name: '资质详情页-证券登记结算机构批复',
  },
}
const qualificationCode2funcPoint = Object.assign(old, qualificationBury)
// 主表格 res.Data.config字段map函数，生成columns

// 自定义字段表格宽度
const mapParam2Width = (field) => {
  let width = ''
  switch (field) {
    case 'licenseNo': // 证书编号
      width = '220px'
      break
    // 游戏审批
    case 'gameLicenseIsbn': // 出版物号
    case 'adminApprNumber': // 文号
    case 'regCap': // 注册资本
      width = '200px'
      break

    // 日期
    case 'apprDate': //审批时间-行政审批
    case 'cancelDate':
    case 'recordDayData': // 备案时间

    //状态
    case 'corpState': // 企业状态
    case 'adminLicenseCorpState': // 企业状态
      width = window.en_access_config ? '140px' : '120px'
      break

    case 'quaPublishDate': //有效期起始日-资质
    case 'validFrom': //有效期开始日期-行政许可
    case 'validTo': //有效期截止日期-行政许可
      width = window.en_access_config ? '170px' : '140px'
      break

    case 'adminLicensePublishDate': // 公示日期
    case 'publishDate': //发证日期
      width = window.en_access_config ? '190px' : '140px'
      break

    case 'qualificationNo': // 证书编号-资质
      width = '150px'
      break
    // 资质状态
    case 'adminApprValid':
    case 'adminLicenseValid':
    case 'quaVaild':
    case 'processStatus': //备案状态
      width = window.en_access_config ? '120px' : '80px'
      break

    case '':
      width = ''
      break
    case '':
      width = ''
      break
    case '':
      width = ''
      break
    case '':
      width = ''
      break
    case '':
      width = ''
      break
    case '':
      break
    case 'quaName':
      break
    case 'quaCorpName':
      break
    default:
      // width=100
      break
  }
  return width
}

function QualificationsDetail(props) {
  usePageTitle('QualificationsDetail')

  const { location } = props
  let { id, search, name } = queryString.parse(location.search, {
    ignoreQueryPrefix: true,
  })
  const searchId = queryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.id
  id = id || searchId
  console.log('🚀 ~ QualificationsDetail ~ location:', location, 'id', id, 'search', search, 'name', name)
  const [filterData, setFilterData] = useState([])

  const [treeData, setTreeData] = useState([]) // 菜单树
  const [leafs, setLeafs] = useState([]) // 叶子节点
  const [selectedKeys, setSelectedKeys] = useState([]) // tree
  const [expandedKeys, setExpandedKeys] = useState([])

  const [listData, setListData] = useState([])

  const [filterParam, setFilterParam] = useState(null)
  const [sortParam, setSortParam] = useState('')

  const [columns, setColumns] = useState([])

  const [cardData, setCardData] = useState({})

  const [horizonColumns, setHorizonColumns] = useState([])

  const [breadcrumb, setBreadcrumb] = useState('')

  const [isShowInputOption, setIsShowInputOption] = useState(search)
  const [isShowDetail, setIsShowDetail] = useState(false)
  const [isFolded, setIsFolded] = useState(false)
  const [searchValue, setSearchValue] = useState(search)

  const [currentDetail, setCurrentDetail] = useState('')

  const [scrollY, setScrollY] = useState(600) //滚动条高度

  const [tableLoading, setTableLoading] = useState(true)
  const [horizonTableLoading, setHorizonTableLoading] = useState(true)

  const [isDisplayVipBox, setIsDisplayVipBox] = useState(false) // 是否显示购买Vip框

  const pageNo = useRef(0)

  const [form] = Form.useForm()

  const tableRef = useRef(null)

  const userVipInfo = getVipInfo()
  const { isVip, isSvip } = userVipInfo

  let companyState = [
    {
      key: '存续',
      value: intl('257644', '存续'),
    },
    {
      key: '注销',
      value: intl('36489', '注销'),
    },
    {
      key: '迁出',
      value: intl('134788', '迁出'),
    },
    {
      key: '吊销，未注销',
      value: intl('134789', '吊销，未注销'),
    },
    {
      key: '吊销，已注销',
      value: intl('257722', '吊销，已注销'),
    },
    {
      key: '撤销',
      value: intl('257634', '撤销'),
    },
    {
      key: '停业',
      value: intl('257685', '停业'),
    },
    {
      key: '非正常户',
      value: intl('257686', '非正常户'),
    },
    {
      key: '责令关闭',
      value: intl('416883', '责令关闭'),
    },
  ]

  // 添加日期选择器状态管理
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const updateDatePickerState = useCallback((open) => {
    requestAnimationFrame(() => {
      setIsDatePickerOpen(open)
    })
  }, [])

  useEffect(() => {
    pointBuriedGel('922602100898', '资质大全-点击资质详情页', 'clickQualificationDetail')
    if (window.en_access_config) {
      wftCommon.zh2en(companyState, (newData) => {
        companyState = newData
      })
    }
    getqualificationtree().then((res) => {
      console.time('Tree')
      let expandedKeys = []
      let selectedKeys = []
      let leafsIndustry
      let leafsOffice

      const format = (arr, parentCode = '', type?) => {
        return arr.map((i, index) => {
          //
          if (i.level === 2) {
            if (index === 0) {
              leafsIndustry = i
              leafsIndustry.children = []
              type = 'Industry'
            } else if (index === 1) {
              leafsOffice = i
              leafsOffice.children = []
              type = 'Office'
            }
          }

          let codeName = parentCode ? parentCode + '-' + i.name : i.name
          // 是叶子节点就放到
          if (i.isLeaf) {
            if (type == 'Industry') {
              leafsIndustry.children.push({
                ...i,
                title: codeName,
                key: codeName,
              })
            } else if (type == 'Office') {
              leafsOffice.children.push({
                ...i,
                title: codeName,
                key: codeName,
              })
            }
          }

          // if (i.isLeaf && !selectedKeys.length) { selectedKeys.push(codeName) }

          if (i.code == id) {
            if (name == codeName) {
              selectedKeys = [codeName]
            } else if (!name) {
              selectedKeys.push(codeName)
            }
          }
          expandedKeys.push(codeName)

          return {
            ...i,
            title: i.name,
            key: codeName,
            children: format(i.childrenNode, codeName, type),
          }
        })
      }

      const formatData = format(res.Data.childrenNode)

      setLeafs([leafsIndustry, leafsOffice])
      if (!search) {
        handleClick(selectedKeys[0])
      }

      setBreadcrumb(selectedKeys[0] || '')
      setExpandedKeys(expandedKeys)
      setTreeData(formatData)
      console.timeEnd('Tree')
      return selectedKeys[0]
    })

    // overVip('该查询条件的数据浏览量已超限，请更换查询条件或联系客户经理咨询更多数据获取方式');
  }, [])

  useEffect(() => {
    getqualificationfilter(String(id)).then(async function (res) {
      if (res.Data && res.Data.length && window.en_access_config) {
        await res.Data.forEach((i) => {
          if (i.itemType == 'select' && i.itemField !== 'corpState') {
            wftCommon.zh2en(i.itemValue, (newData) => {
              i.itemValue = newData
              setFilterData(res.Data || [])
            })
          }
        })
        // setFilterData(res.Data || [])
      } else {
        setFilterData(res.Data || [])
      }
    })
  }, [id])

  useEffect(() => {
    pageNo.current = 0
    setTableLoading(true)
    let params: any = {
      qualificationCode: id,
      pageNo: 0,
      pageSize: 50,
    }
    if (filterParam) {
      params.queryCondition = JSON.stringify(filterParam)
    }
    if (sortParam) {
      params.sortFieldType = sortParam
    }
    getqualificationslist(params).then((res) => {
      console.log('🚀 ~ getqualificationslist ~ res:', res)

      if (!res?.Data || !res?.Data?.list.length) {
        setListData([])
        setTableLoading(false)
        setColumns([])
        return
      }

      if (!sortParam) {
        const colunms = res.Data?.config.map(configMapFunc)
        setColumns([
          {
            title: '',
            key: 'No.',
            width: '44px',
            align: 'center',
            render: (txt, row, index) => index + 1,
          },
          ...colunms,
        ])
      }

      if (window.en_access_config) {
        wftCommon.zh2en(res.Data.list, (newData) => {
          setListData(newData)
          setTableLoading(false)
        })
      } else {
        setListData(res.Data?.list)
        setTableLoading(false)
      }
    })

    let timer = setTimeout(() => {
      const table: any = document.querySelector('.content_table')
      table.scrollTop = 0
      let isRequestingData = false
      setIsDisplayVipBox(false)
      table &&
        (table.onscroll = function () {
          const scrollTop = table.scrollTop
          const scrollHeight = table.scrollHeight
          const clientHeight = table.clientHeight
          // console.log("🚀 ~ timer ~ clientHeight:", table, [table], scrollTop, clientHeight, 'scrollTop + clientHeight', scrollTop + clientHeight, scrollHeight)
          if (scrollTop + clientHeight >= scrollHeight - 10 && !isRequestingData && pageNo.current < 10) {
            // if (!isVip && !isSvip) {
            //     setIsDisplayVipBox(true)
            //     return
            // }
            isRequestingData = true
            setTableLoading(true)
            pageNo.current = pageNo.current + 1
            let params: any = {
              qualificationCode: id,
              pageNo: pageNo.current,
              pageSize: 50,
            }
            if (filterParam) {
              params.queryCondition = JSON.stringify(filterParam)
            }
            if (sortParam) {
              params.sortFieldType = sortParam
            }
            getqualificationslist(params)
              .then((res) => {
                // 资质大全无权限状态码 -10
                if ((res.ErrorCode as number) == -10 && !isVip && !isSvip) {
                  setIsDisplayVipBox(true)
                }
                if ((res.ErrorCode as number) == -13) {
                  setTableLoading(false)
                  return
                }
                if (!res || !res?.Data || !res?.Data?.list || !res?.Data?.list.length) {
                  // isRequestingData=false
                  setTableLoading(false)
                  return
                }

                if (window.en_access_config) {
                  wftCommon.zh2en(res.Data.list, (newData) => {
                    setListData((data) => [...data, ...newData])
                    isRequestingData = false
                    setTableLoading(false)
                  })
                } else {
                  setListData((data) => [...data, ...res.Data.list])
                  isRequestingData = false
                  setTableLoading(false)
                }
              })
              .catch(() => {
                isRequestingData = false
              })
          }
        })
    }, 1000)
    return () => {
      const table: any = document.querySelector('.content_table')
      table && (table.onscroll = () => {})
      clearTimeout(timer)
    }
  }, [id, filterParam, sortParam])

  const configMapFunc = (i) => {
    let obj: any = {
      title: i.titleCN,
      dataIndex: i.field,
      width: mapParam2Width(i.field),
      align: i.fieldType === 'money' || i.fieldType === 'num' ? 'right' : 'left',
      render: (txt) => {
        if (i.fieldType === 'date') {
          return wftCommon.formatTime(txt) || '--'
        } else if (i.fieldType === 'money' && txt) {
          if (window.en_access_config) return txt || '--'
          let [num, unit] = txt.split('万')
          return num ? wftCommon.formatMoney(txt, [4, '万' + unit]) : '--'
        }
        // else if(i.fieldType === 'num'&&txt){

        // }
        return txt || '--'
      },
    }
    if (i.canSort) {
      let [fieldType, direction] = sortParam.split('_')
      let sort: any = false
      if (fieldType == i.fieldType && sortParam) {
        sort = direction == 'desc' ? 'descend' : 'ascend'
      }
      obj.sortOrder = sort
      obj.sorter = true
    }
    return obj
  }
  // 搜索确认
  const handleSearch = () => {
    return {}
  }

  // 搜索框值change
  const onChange = (e) => {
    let val = e.target.value
    setSearchValue(val)
    // @ts-expect-error
    setIsShowInputOption(true)
  }

  const onFinish = (values) => {
    // 日期字段处理
    filterData.forEach((i) => {
      const rangeValue = values[i.itemField]
      if (i.itemType == 'date') {
        if (rangeValue) {
          values[i.itemField] = JSON.stringify([+rangeValue[0].format('YYYYMMDD'), +rangeValue[1].format('YYYYMMDD')])
        }
      } else if (i.itemType == 'dateMonth') {
        if (rangeValue) {
          values[i.itemField] = JSON.stringify([+rangeValue[0].format('YYYYMM'), +rangeValue[1].format('YYYYMM')])
        }
      }
    })
    // 不传空串
    for (let i in values) {
      if (values[i] === '') {
        delete values[i]
      }
    }
    setFilterParam(values)
    setSortParam('')
    console.log('🚀 ~file: detail.js:127 ~ onFinish ~ values:', values)
  }

  // 导出
  let isRequestingData = false

  // 添加防抖函数
  const debounce = (fn, delay) => {
    let timer = null
    return (...args) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
  }

  // 修改日期选择组件的渲染
  const generateFormItem = ({ itemName, itemNameEn, itemId, itemType, itemField, itemValue }) => {
    let ret: ReactNode = ''
    switch (itemType) {
      case 'search':
        ret = (
          <Form.Item
            key={itemId}
            label={itemName}
            name={itemField}
            rules={[{ message: intl('437794', '请输入关键字') }]}
          >
            <Input
              style={{
                width: '160px',
              }}
              placeholder={intl('437794', '请输入关键字')}
              data-uc-id="MdmfAUTtv"
              data-uc-ct="input"
            />
          </Form.Item>
        )
        break
      case 'radio':
        ret = (
          <Form.Item
            // label={itemName}
            key={itemId}
            name={itemField}
          >
            <RadioGroup data-uc-id="cVxO4514DJ" data-uc-ct="radiogroup">
              <Radio value={1} data-uc-id="7jifUx3dRR" data-uc-ct="radio">
                A
              </Radio>
              <Radio value={2} data-uc-id="Qpz8inIBsw" data-uc-ct="radio">
                B
              </Radio>
              <Radio value={3} data-uc-id="GtLDRSWk0C" data-uc-ct="radio">
                C
              </Radio>
              <Radio value={4} data-uc-id="-KPy_6l2u0" data-uc-ct="radio">
                D
              </Radio>
            </RadioGroup>
          </Form.Item>
        )
        break
      case 'date':
        ret = (
          <Form.Item key={itemId} label={itemName} name={itemField}>
            <RangePicker
              format="YYYY/MM/DD"
              getPopupContainer={(trigger) => trigger.parentElement || document.body}
              dropdownClassName="custom-date-picker-dropdown"
              style={{ width: 'auto' }}
              open={isDatePickerOpen}
              onOpenChange={updateDatePickerState}
              onBlur={() => {
                requestAnimationFrame(() => {
                  const table: any = document.querySelector('.content_table')
                  if (table) {
                    table.style.transform = 'translateZ(0)'
                  }
                })
              }}
              data-uc-id="5pgRkPnWy"
              data-uc-ct="rangepicker"
            />
          </Form.Item>
        )
        break
      case 'dateMonth':
        console.log(
          '🚀 ~ generateFormItem ~ dateMonth  itemName, itemNameEn, itemId, itemType, itemField, itemValue:',
          itemName,
          itemNameEn,
          itemId,
          itemType,
          itemField,
          itemValue
        )

        ret = (
          <Form.Item key={itemId} label={itemName} name={itemField}>
            <MonthRangePicker
              format="YYYY/MM"
              getPopupContainer={(trigger) => trigger.parentElement || document.body}
              dropdownClassName="custom-date-picker-dropdown"
              style={{ width: 'auto' }}
              open={isDatePickerOpen}
              onOpenChange={updateDatePickerState}
              onBlur={() => {
                requestAnimationFrame(() => {
                  const table: any = document.querySelector('.content_table')
                  if (table) {
                    table.style.transform = 'translateZ(0)'
                  }
                })
              }}
              data-uc-id="NL7xeonN7x"
              data-uc-ct="monthrangepicker"
            />
          </Form.Item>
        )
        break
      case 'select':
        if (itemField === 'corpState') {
          ret = (
            <Form.Item label={itemName} key={itemId} name={itemField}>
              <Select
                placeholder={intl('11835', '请选择')}
                style={{ width: 100 }}
                allowClear
                data-uc-id="xfCZUfliZ_"
                data-uc-ct="select"
              >
                {companyState.map((i) => (
                  <Option value={i.key} data-uc-id="LrPRITvpdg6" data-uc-ct="option">
                    {i.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )
        } else {
          ret = (
            <Form.Item
              label={itemName}
              key={itemId}
              name={itemField}
              // style={{ width: 80 }}
            >
              <Select
                placeholder={intl('11835', '请选择')}
                style={{ width: 100 }}
                allowClear
                data-uc-id="ji4QDb8UZJ"
                data-uc-ct="select"
              >
                {itemValue?.map((obj) => {
                  return (
                    <Option value={obj.value} data-uc-id="5c3_2SM_q8N" data-uc-ct="option">
                      {obj.key}
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>
          )
        }

        break
      case 'checkbox':
        // ret = <Form.Item
        //     key={itemId}
        //     name={itemField}
        // >
        //     <Checkbox.Group>
        //         <Checkbox value='A'>包含已到期企业</Checkbox>
        //     </Checkbox.Group>
        // </Form.Item>
        break
      default:
        break
    }

    return ret
  }

  const handleExpand = (expandedKeys) => {
    console.log('🚀 ~handleExpand ~ expandedKeys:', expandedKeys)
    setExpandedKeys(expandedKeys)
  }

  const handleSelect = (selectedKeys, e) => {
    if (!selectedKeys.length) return
    console.log('🚀 ~handleSelect ~ selectedKeys:', selectedKeys, e)
    const id = e.node['data-id'] || ''
    const isLeaf = e.node['data-isleaf']
    console.log('🚀 ~handleSelect ~ isLeaf:', isLeaf)
    if (!isLeaf) {
      if (expandedKeys.includes(selectedKeys[0])) {
        setExpandedKeys(expandedKeys.filter((i) => i !== selectedKeys[0]))
      } else {
        setExpandedKeys([...expandedKeys, selectedKeys[0]])
      }

      return
    }
    pointBuriedGel('922602100898', '资质大全-点击资质详情页', 'clickQualificationDetail')
    const buryParams = qualificationCode2funcPoint?.[id]
    if (buryParams?.qualification_id) {
      // 接入新的埋点
      const { point, ...rest } = buryParams
      if (buryParams?.point) pointBuriedByModule(buryParams.point, rest)
    } else if (buryParams) {
      buryParams?.point &&
        pointBuriedGel(buryParams.point, buryParams?.name || buryParams?.qualification_id, 'clickQualificationDetail')
    }
    props.history.push(`/qualificationsDetail?id=${id}&name=${selectedKeys[0]}&isSeparate=1&nosearch=1`)

    setFilterParam(null)
    setSortParam('')
    form.resetFields()
    setIsShowDetail(false)
    setBreadcrumb(selectedKeys[0] || '')
    setSelectedKeys(selectedKeys)
    return {}
  }

  //
  const handleClick = (val, code?) => {
    val = val || ''
    console.log('🚀 ~handleClick ~ val:', val)
    code && pointBuriedGel('922602100897', '资质大全-搜索', 'qualificationSearch')
    setSelectedKeys([val])
    if (code) props.history.push(`/qualificationsDetail?id=${code}&name=${val}&isSeparate=1&nosearch=1`)
    form.resetFields()
    setBreadcrumb(val || '')
    setFilterParam(null)
    setSortParam('')
    // @ts-expect-error
    setIsShowInputOption(false)
    setIsShowDetail(false)
    setTimeout(() => {
      let dom = document.querySelector(`div[data-code="${val.replace('\\', '\\\\')}"]`)
      if (!dom) {
        let interval = setInterval(() => {
          dom = document.querySelector(`div[data-code="${val.replace('\\', '\\\\')}"]`)
          console.log('定时器', val, dom)
          if (dom) {
            dom && dom.scrollIntoView()
            clearInterval(interval)
          }
        }, 500)
        setTimeout(() => {
          clearInterval(interval)
        }, 10000)
      }
      dom && dom.scrollIntoView()
    }, 1000)
    const buryParams = qualificationCode2funcPoint?.[code || id]
    if (buryParams?.qualification_id) {
      // 接入新的埋点
      const { point, ...rest } = buryParams
      if (buryParams?.point) pointBuriedByModule(buryParams.point, rest)
    } else if (buryParams) {
      buryParams?.point && pointBuriedGel(buryParams.point, buryParams.name, 'clickQualificationDetail')
    }

    console.log(
      '🚀 ~handleClick ~ document.querySelector(div[data-code=]):',
      val,
      document.querySelector(`div[data-code="${val.replace('\\', '\\\\')}"]`)
    )
  }

  // 搜索框-预搜索结果
  const SearchBox = () => {
    const matched = leafs?.some((leaf) =>
      leaf?.children.some((i) => i.name.indexOf(searchValue) > -1 || i.title.indexOf(searchValue) > -1)
    )
    return (
      <>
        {isShowInputOption && matched && (
          <div className="search_box">
            {leafs.map((i) => {
              let filterArr = i.children.filter((i) => {
                return i.name.indexOf(searchValue) > -1 || i.title.indexOf(searchValue) > -1
              })
              return (
                <div key={i.name}>
                  <div>{filterArr.length ? i.name : ''}</div>
                  {filterArr.map((j) => (
                    <div
                      className="input_option"
                      key={j.name}
                      onClick={() => {
                        handleClick(j.key, j.code)
                      }}
                      data-uc-id="JwfO9db4V1"
                      data-uc-ct="div"
                      data-uc-x={j.name}
                    >
                      <div
                        className="optTitle"
                        dangerouslySetInnerHTML={{
                          __html: j.name.replace(searchValue, `<em>${searchValue}</em>`),
                        }}
                      ></div>
                      <div
                        className="optName"
                        dangerouslySetInnerHTML={{
                          __html: j.title.split('-').slice(1).join('-').replace(searchValue, `<em>${searchValue}</em>`),
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )}
      </>
    )
  }

  const handleRowClick = (record) => {
    console.log('🚀 ~handleRowClick ~ record:', record)
    setIsShowDetail(true)
    setHorizonTableLoading(true)
    setIsFolded(false)
    getqualificationdetail({
      qualificationCode: id,
      qualificationDetailId: record.qualificationDetailId,
      companyCode: record.publishCorpId,
    }).then((res) => {
      console.log('🚀 ~getqualificationdetail ~ res:', res)
      const format = (arr) => {
        let obj = {}
        arr.forEach((i) => {
          Array.isArray(i) &&
            i.forEach((j) => {
              const colSpan = j.colSpan
              j.colSpan = colSpan * 2 - 1
              obj[j.field] = j.indexValue
              j.title = j.titleCN
              j.dataIndex = j.field
              j.titleAlign = 'left'
              let render = (txt) => txt || '--'
              if (j.jumpType && j.jumpValue) {
                switch (j.jumpType) {
                  case 'company':
                    render = (txt) => {
                      return <CompanyLink name={txt || ''} id={j.jumpValue} />
                    }
                    break
                  default:
                    break
                }
              }
              if (j.fieldType) {
                switch (j.fieldType) {
                  case 'date':
                    render = (txt) => {
                      return wftCommon.formatTime(txt) || '--'
                    }
                    break
                }
              }
              j.render = render
            })
        })
        return obj
      }

      // 生成子表格数据
      const formatData = format(res.Data?.list)
      console.log('🚀 ~getqualificationdetail ~ res.Data:', res.Data)

      if (window.en_access_config) {
        wftCommon.translateService(formatData, (newData) => {
          setCardData(newData)
          setHorizonTableLoading(false)
        })
        wftCommon.translateService({ title: res.Data?.title }, (newData) => {
          setCurrentDetail(`${breadcrumb.split('-').pop()}${newData?.title ? '-' + newData?.title : ''}`)
        })
      } else {
        setCardData(formatData)
        setHorizonTableLoading(false)
        setCurrentDetail(`${breadcrumb.split('-').pop()}${res.Data?.title ? '-' + res.Data?.title : ''}`)
      }

      setHorizonColumns(res.Data?.list)
      const contentHeight = document.querySelector('.content').clientHeight
      console.log('🚀 ~handleRowClick ~ contentHeight:', contentHeight, contentHeight / 4)
      setScrollY(contentHeight / 4 || 350)
    })
  }

  const loop = (data) =>
    data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            key={item.key}
            title={item.title}
            data-code={item.key}
            data-id={item.code}
            data-isleaf={item.isLeaf}
            data-uc-id="oKAXSVBMLD"
            data-uc-ct="treenode"
            data-uc-x={item.key}
          >
            {loop(item.children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
          key={item.key}
          title={item.title}
          data-uc-id="Pe5WxEyDR_"
          data-uc-ct="treenode"
          data-uc-x={item.key}
        />
      )
    })

  const handleResize = (evt, opt) => {
    const { node, folded } = opt
    // console.log("🚀 ~handleResize ~ height:", Element, [Element])
    if (evt.type === 'click') {
      setIsFolded(!isFolded)
    }
    // node是resize前的元素，需异步获取resize后的元素
    setTimeout(() => {
      console.log('🚀 ~handleResize ~ evt:', evt, opt, node.offsetTop, node.previousSibling.offsetHeight)
      let height = node.previousSibling.offsetHeight - 50 //50是表头的高度
      if (folded) {
        // setIsShowDetail(false)
        height = 600
      }
      setScrollY(height)
    }, 0)
  }

  const onSortChange = (pagination, filters, sorter) => {
    const copyColumns = wftCommon.deepClone(columns)
    copyColumns.forEach((col, index) => {
      if (col.dataIndex === sorter.dataIndex) {
        copyColumns[index].sortOrder = sorter.sortOrder
      } else {
        copyColumns[index].sortOrder = false
      }
    })
    setColumns(copyColumns)
    if (sorter.sortOrder) {
      setSortParam(`${sorter.dataIndex}_${sorter.sortOrder == 'descend' ? 'desc' : 'asc'}`)
    } else {
      setSortParam('')
    }

    console.log('🚀 ~onSortChange ~ pagination, filters, sorter:', pagination, filters, sorter)
    return {}
  }

  // 优化表格滚动处理
  const handleTableScroll = useCallback(
    debounce((table) => {
      if (!table) return
      const scrollTop = table.scrollTop
      const scrollHeight = table.scrollHeight
      const clientHeight = table.clientHeight

      if (scrollTop + clientHeight >= scrollHeight - 20 && !isRequestingData && pageNo.current < 10) {
        // ... existing scroll loading logic ...
      }
    }, 16),
    [id, filterParam, sortParam]
  )

  useEffect(() => {
    const table: any = document.querySelector('.content_table')
    if (!table) return

    // 添加 CSS 优化
    table.style.transform = 'translateZ(0)'
    table.style.backfaceVisibility = 'hidden'
    table.style.willChange = 'transform'

    table.addEventListener('scroll', () => handleTableScroll(table), { passive: true })

    return () => {
      table.removeEventListener('scroll', () => handleTableScroll(table))
    }
  }, [handleTableScroll])

  return (
    <React.Fragment>
      {/* @ts-expect-error */}
      <Layout className="qualificationsDetail" style={{ height: '100%' }}>
        {/*  侧边栏 */}
        <ThemeProvider pattern="gray">
          {/* @ts-expect-error */}
          <Sider
            className="menu"
            collapsible
            collapsedContent={
              // @ts-expect-error
              <Header size="small" className="f-wm-vr f-bg-none">
                {intl('364555', '资质大全')}
              </Header>
            }
          >
            {/* @ts-expect-error */}
            <Header size="small" className="f-tac f-bg-none">
              <a
                style={{
                  color: '#fff',
                }}
                href="#/qualifications?nosearch=1"
                data-uc-id="rAqyoW16Pi"
                data-uc-ct="a"
              >
                {intl('364555', '资质大全')}
              </a>
            </Header>
            {/* @ts-expect-error */}
            <Divider className="f-m0" foldedSize={500} onResize={() => {}} />
            <Tree
              // className="f-oya"
              treeData={treeData}
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              // height={800}
              onExpand={handleExpand}
              onSelect={handleSelect}
              style={{
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingBottom: '50px',
                maxHeight: 'calc(100vh - 120px)',
              }}
              data-uc-id="_-2fX8Blb4"
              data-uc-ct="tree"
            >
              {loop(treeData)}
            </Tree>

            {<SearchBox />}

            <Search
              value={searchValue}
              className="tree_search"
              style={{}}
              placeholder={intl('364556', '请输入搜索内容')}
              onSearch={handleSearch}
              onChange={onChange}
              onFocus={() => {
                setTimeout(() => {
                  // @ts-expect-error
                  searchValue && setIsShowInputOption(true)
                }, 200)
              }}
              onBlur={() => {
                setTimeout(() => {
                  // @ts-expect-error
                  setIsShowInputOption(false)
                }, 200)
              }}
              data-uc-id="Gq-UGUhJWR"
              data-uc-ct="search"
            />
          </Sider>
        </ThemeProvider>

        {/* 整体内容 */}
        {/* @ts-expect-error */}
        <Layout
          style={{
            backgroundColor: '',
          }}
        >
          {/* 面包屑 */}
          {/* @ts-expect-error */}
          <Operator data-uc-id="r6nrHBnw-7" data-uc-ct="operator">
            <div className="operation-main">
              <span>
                <Breadcrumb data-uc-id="an1cJ7RyiL" data-uc-ct="breadcrumb">
                  <Breadcrumb.Item data-uc-id="XdMWBNKnP" data-uc-ct="breadcrumb">
                    <a href="#/qualifications?nosearch=1" data-uc-id="o4a_2CVBTJ" data-uc-ct="a">
                      {intl('364555', '资质大全')}
                    </a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item data-uc-id="8tz7bKsVLu" data-uc-ct="breadcrumb">
                    {breadcrumb.split('-').pop()}
                  </Breadcrumb.Item>
                </Breadcrumb>
              </span>
              {/* <span className="export">

                                <Button
                                    type="text"
                                    icon={<FileExcelO />}
                                    onClick={handleExport}
                                >
                                    {
                                        intl('4675', '导出到Excel')
                                    }
                                </Button>
                            </span> */}
            </div>
          </Operator>
          {/* 搜索条件 */}
          <div className="filter_form">
            {filterData && filterData.length ? (
              <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
                {filterData.map((i) => generateFormItem(i))}
                <div
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '14px',
                  }}
                >
                  <Button
                    style={{ margin: '0 8px' }}
                    onClick={() => {
                      form.resetFields()
                    }}
                    data-uc-id="VCl-4LVPWP"
                    data-uc-ct="button"
                  >
                    {intl('138490', '重置条件')}
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => pointBuriedByModule(922602101080)}
                    data-uc-id="DP0UCr2SNu"
                    data-uc-ct="button"
                  >
                    {intl('257693', '应用筛选')}
                  </Button>
                </div>
              </Form>
            ) : (
              ''
            )}
          </div>
          {/* 内容区 */}
          {/* @ts-expect-error */}
          <Content className="content">
            <Tabs data-uc-id="lXS9oP1I2e" data-uc-ct="tabs">
              <TabPane
                tab={
                  // @ts-expect-error ttt
                  ['137025227', '137025486', '137025226'].indexOf(id) > -1
                    ? intl('364539', '游戏列表')
                    : intl('138216', '企业列表')
                }
                key="1"
                data-uc-id="KrRrb-AAaA"
                data-uc-ct="tabpane"
              >
                <div
                  className="content_table"
                  style={{
                    position: 'relative',
                    height: scrollY,
                    flexGrow: 1,
                    overflow: 'auto',
                    contain: 'strict', // 添加 contain 属性优化渲染
                  }}
                >
                  <Table
                    ref={tableRef}
                    style={
                      {
                        // padding: '12px'
                        // height:'100%'
                      }
                    }
                    columns={columns}
                    onChange={onSortChange}
                    dataSource={listData}
                    locale={{
                      emptyText: tableLoading ? '' : intl('17235', '暂无数据'),
                    }}
                    empty={tableLoading ? '' : intl('17235', '暂无数据')}
                    onRow={(record) => {
                      return {
                        onClick: () => {
                          handleRowClick(record)
                        }, // 点击行
                        style: {
                          cursor: 'pointer',
                        },
                        // className:'wind-ui-table-row-selected'
                      }
                    }}
                    // rowSelection={{
                    //     type:'radio',
                    //     onChange: (selectedRowKeys, selectedRows) => {
                    //       console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                    //     },
                    //     disabled:true
                    //   }}
                    loading={tableLoading}
                    pagination={false}
                    bordered="dotted"
                    data-uc-id="Lfl4Ef976O"
                    data-uc-ct="table"
                  ></Table>

                  {isDisplayVipBox ? (
                    <div className="vip_box">
                      <div
                        style={{
                          margin: '0 auto',
                          width: '700px',
                          // height:'400px'
                        }}
                      >
                        <VipModule />
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                {isShowDetail ? (
                  <>
                    <Resizer
                      direction="s"
                      foldable={true}
                      folded={isFolded}
                      onResize={handleResize}
                      data-uc-id="fyHZpPkKCV"
                      data-uc-ct="resizer"
                    />
                    <div style={{ height: '40%' }}>
                      <Card
                        title={currentDetail}
                        style={{
                          overflow: 'hidden',
                        }}
                        // styleType="block"
                      >
                        <HorizontalTable
                          loading={horizonTableLoading}
                          bordered={'dotted'}
                          rows={horizonColumns}
                          dataSource={cardData}
                          // @ts-expect-error
                          empty={horizonTableLoading ? '' : intl('132725', '暂无数据')}
                          data-uc-id="U2pbISRI4J"
                          data-uc-ct="horizontaltable"
                        ></HorizontalTable>
                      </Card>
                    </div>
                  </>
                ) : (
                  ''
                )}
              </TabPane>
              {/* <TabPane tab="统计图表" key="2">开发中O(∩_∩)O</TabPane> */}
            </Tabs>
          </Content>
        </Layout>
      </Layout>
    </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(QualificationsDetail)
