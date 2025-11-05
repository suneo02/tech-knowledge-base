import { getQueryCommonList } from '@/api/searchListApi.ts'
import { VipPopup } from '@/lib/globalModal.tsx'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { DownO } from '@wind/icons'
import { Button, Dropdown, Menu, Spin } from '@wind/wind-ui'
import React, { FC, useEffect, useRef, useState } from 'react'

import { pointBuriedByModule } from '@/api/pointBuried/bury.ts'
import { LinkSafe, MenuSafe, SubMenuSafe } from '@/components/windUISafe/index.tsx'
import Table, { ColumnProps } from '@wind/wind-ui-table'
import { homeSelectDate, homeSelectType } from './config.ts'
import { mapDynamicDetail } from './dynamicDetailMapper.ts'
import { mapText2JSX } from './linkMapper.ts'
import './style/index.module.less'
import styles from './style/index.module.less'

let isLoading = false
let sortAfter = ''
let allArr = []
let zh2enArr = []
export const HomeCorpDynamic: FC<{
  scrollObj: {
    scrollHeight: number
    scrollTop: number
    clientHeight: number
  }
  onScrollTop: () => void
}> = ({ scrollObj, onScrollTop }) => {
  const [selectDate, setSelectDate] = useState(intl('72086', '全部时间')) // 选中时间下拉框的名称
  const [selectDateVal, setSelectDateVal] = useState('365') // 选中时间下拉框的值
  const [selectType, setSelectType] = useState(intl('12074', '全部类型')) // 选中类型下拉框的名称
  const [selectTypeVal, setSelectTypeVal] = useState('') // 选中类型下拉框的值
  const [lastDatas, setLastDatas] = useState([]) // 企业最新动态
  const [lastDatasCode, setLastDatasCode] = useState<string | number>('0') // 企业动态请求返回的errorCode
  const [dynamicEventLoaded, setDynamicEventLoaded] = useState(false) // 数据全部加载完成
  const [category, setCategory] = useState('') // 请求参数
  const [eventType, setEventType] = useState('') // 请求参数
  const [scrollYOld, setScrollYOld] = useState('') // 请求参数
  const [dynamicLoading, setDynamicLoading] = useState(false) // loading文字显示
  const [, setLoadAllDone] = useState(false) // 是否加载全部
  const initRef = useRef(null)

  useEffect(() => {
    scrollHandle(scrollObj)
  }, [scrollObj.scrollTop])
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
    <MenuSafe onClick={(e) => selectChangeHandle(e, 'type')} selectedKeys={[selectTypeVal]}>
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
          <SubMenuSafe key={item.name} title={item.name}>
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
          </SubMenuSafe>
        )
      })}
    </MenuSafe>
  )

  // 全部时间下拉框数据
  const menuDate = (
    <MenuSafe selectedKeys={[selectDateVal]}>
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
    </MenuSafe>
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
      onScrollTop()
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
              setLastDatas(() => newData || [])
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

  // 定义表格列配置
  const columns: ColumnProps[] = [
    {
      title: intl('437308', '动态时间'),
      dataIndex: 'event_date',
      key: 'event_date',
      width: '120px',
      render: (text) => <span className={styles.dateColumn}>{wftCommon.formatCont(text)}</span>,
    },
    {
      title: intl('437327', '动态摘要'),
      dataIndex: 'text',
      key: 'text',
      width: '80%',
      render: (_, record) => {
        const linkInfo = mapText2JSX(record)
        return linkInfo.href ? (
          <LinkSafe target={'_blank'} href={linkInfo.href}>
            {linkInfo.text}
          </LinkSafe>
        ) : (
          linkInfo.text
        )
      },
    },
    {
      title: intl('437226', '动态类别'),
      dataIndex: 'event_type',
      key: 'event_type',
      align: 'right',
      width: '18%',
      render: (text, record) => <span className={styles.eventTypeColumn}>{text || record.event_category || '--'}</span>,
    },
  ]

  // 处理表格数据
  const getTableData = () => {
    return lastDatas.filter((item) => {
      return (
        !(/1002502502|1058060339/.test(item.corp_id) && /开庭公告|法院公告|裁判文书/.test(item.event_type)) ||
        !(item.event_type == '招投标公告' && item.role == '无角色主体')
      )
    })
  }

  // 自定义空状态
  const customEmpty = () => {
    if (lastDatasCode === '-2') {
      return (
        <div className={styles.loadingFailed}>
          <p>{intl('313373', '加载失败，请重试}')}</p>
          <p>
            <button
              className={styles.reloadBtn}
              onClick={() => {
                allArr = []
                getBid()
              }}
            >
              {intl('333836', '重 试')}
            </button>
          </p>
        </div>
      )
    }
    return intl('132725', '暂无数据')
  }

  // 自定义页脚
  const customFooter = () => {
    if (lastDatas.length !== 0 && lastDatas.length === 50 && dynamicEventLoaded) {
      return (
        <div className={styles.dynamicLoadingMore}>
          <LinkSafe target={'_blank'} href="index.html#/companyDynamic?keyMenu=2">
            {intl('375453', '首页最多查看50条动态，点此查看更多')}
          </LinkSafe>
        </div>
      )
    }
    if (lastDatas.length !== 0 && dynamicLoading) {
      return <Spin className={styles.dynamicLoading} />
    }
    return null
  }

  return (
    <React.Fragment>
      <div className={styles.homeCurrent}>
        <div className={styles.homeCurrentTop}>
          <span className={styles.latest}>{intl('248131', '企业动态')}</span>

          <div className={styles.dropdownWrap}>
            <Dropdown trigger={['click']} overlay={menuType}>
              <Button className={styles.dropdownBtn}>
                {selectType} <DownO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              </Button>
            </Dropdown>
            <Dropdown trigger={['click']} overlay={menuDate}>
              <Button className={styles.dropdownBtn}>
                {selectDate} <DownO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              </Button>
            </Dropdown>
          </div>
        </div>

        <div className={styles.homeCurrentBody}>
          <Table
            className={styles.corpDynamicTable}
            columns={columns}
            dataSource={getTableData()}
            pagination={false}
            showHeader={false}
            locale={{
              emptyText: customEmpty(),
            }}
            footer={customFooter}
          />
        </div>
      </div>
    </React.Fragment>
  )
}
