import { getQueryCommonList } from '@/api/searchListApi.ts'
import { VipPopup } from '@/lib/globalModal.tsx'

import { wftCommon } from '@/utils/utils.tsx'
import { Button, Dropdown, Menu, Spin } from '@wind/wind-ui'
import React, { FC, useEffect, useRef, useState } from 'react'

import { pointBuriedByModule } from '@/api/pointBuried/bury.ts'
import { LinkSafe, MenuSafe, SubMenuSafe } from '@/components/windUISafe/index.tsx'
import { translateToEnglish } from '@/utils/intl/complexHtml.ts'
import { DownO } from '@wind/icons'
import Table, { ColumnProps } from '@wind/wind-ui-table'
import { isEn, t } from 'gel-util/intl'
import { MyIcon } from '../../../../components/Icon'
import { homeSelectDate, homeSelectType } from './config.ts'
import { mapDynamicDetail } from './dynamicDetailMapper.ts'
import { mapText2JSX } from './linkMapper.ts'
import './style/index.module.less'
import styles from './style/index.module.less'

let isLoading = false
let sortAfter = ''
let allArr = []
let zh2enArr = []

const intlMsg = {
  allTime: t('72086', '全部时间'),
  allType: t('12074', '全部类型'),
  myCorpDynamic: t('455514', '我的企业动态'),
  loadFailed: t('313373', '加载失败，请重试}'),
  retry: t('313393', '重 试'),
  noData: t('132725', '暂无数据'),
  viewMore: t('375453', '首页最多查看50条动态，点此查看更多'),
  dynamicTime: t('437308', '动态时间'),
  dynamicSummary: t('437327', '动态摘要'),
  dynamicType: t('437226', '动态类别'),
  tip: t('31041', '提示'),
  buyVip: t('478628', '购买VIP/SVIP套餐，获取更多数据查看条数'),
}

enum SelectType {
  type = 'type',
  date = 'date',
}

export const HomeCorpDynamic: FC<{
  scrollObj: {
    scrollHeight: number
    scrollTop: number
    clientHeight: number
  }
  onScrollTop: () => void
}> = ({ scrollObj }) => {
  const [selectDate, setSelectDate] = useState(intlMsg.allTime) // 选中时间下拉框的名称
  const [selectDateVal, setSelectDateVal] = useState('365') // 选中时间下拉框的值
  const [selectType, setSelectType] = useState(intlMsg.allType) // 选中类型下拉框的名称
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
    <MenuSafe
      onClick={(e) => selectChangeHandle(e, SelectType.type)}
      selectedKeys={[selectTypeVal]}
      data-uc-id="4zyl0wgERb"
      data-uc-ct="menusafe"
    >
      {homeSelectType.map((item) => {
        return !item?.children ? (
          <Menu.Item
            key={item.name}
            onClick={(e) => {
              pointBuriedByModule(922602101026)
              menuItemClick(e, 'type', item)
            }}
            data-uc-id="6NLGeGMEn"
            data-uc-ct="menu"
            data-uc-x={item.name}
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
                  data-uc-id="Bu3Ze_Mdrv"
                  data-uc-ct="menu"
                  data-uc-x={childItem.name}
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
            data-uc-id="YFF5VGUC14"
            data-uc-ct="menu"
            data-uc-x={item.code}
          >
            {item.name}
          </Menu.Item>
        )
      })}
    </MenuSafe>
  )

  // 下拉框选择事件
  const selectChangeHandle = (e, flag) => {
    if (flag === SelectType.type) {
      // 设置下拉框选中值
      setSelectTypeVal(e.keyPath)
    } else if (flag === SelectType.date) {
      setSelectDateVal(e.keyPath)
    }
  }

  // 下拉框点击事件
  const menuItemClick = (e, flag, data) => {
    if (flag === SelectType.type) {
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
      // onScrollTop()
    }
  }

  // 请求企业最新动态数据
  const searchRequestList = () => {
    isLoading = true
    const date = wftCommon.format()
    getQueryCommonList({
      url: '/Wind.WFC.Enterprise.Web/Enterprise/gel/operation/query/getcorpeventlist',
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

        if (isEn() && allArr?.length) {
          if (!sortAfter) {
            // 仅第一页，采用先展示中文，后展示英文方式，后续还是沿用 中文+英文，方式，避免填充数据紊乱
            setLastDatas(allArr)
          }
          translateToEnglish(wftCommon.deepClone(allArr), {
            allowFields: ['event_type', 'text'],
          }).then((newDataRes) => {
            setLastDatas(() => newDataRes.data || [])
          })
        } else {
          setLastDatas(allArr || [])
        }

        setLastDatasCode(res.ErrorCode)

        sortAfter = allArr[len - 1]?.sortAfter?.replace(/\-/g, '')
        if (res.ErrorCode === '-10') {
          setDynamicEventLoaded(true)
          setDynamicLoading(false)
          VipPopup({ title: intlMsg.myCorpDynamic })
          return
        } else if (res.ErrorCode == '-13' || res.ErrorCode == '-9') {
          setDynamicEventLoaded(true)
          setDynamicLoading(false)
          VipPopup({
            title: intlMsg.tip,
            description: intlMsg.buyVip,
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
      title: intlMsg.dynamicTime,
      dataIndex: 'event_date',
      key: 'event_date',
      width: '120px',
      render: (text) => <span className={styles.dateColumn}>{wftCommon.formatCont(text)}</span>,
    },
    {
      title: intlMsg.dynamicSummary,
      dataIndex: 'text',
      key: 'text',
      width: '80%',
      render: (_, record) => {
        const linkInfo = mapText2JSX(record)
        return linkInfo.href ? (
          <LinkSafe target={'_blank'} href={linkInfo.href} data-uc-id="pSC1hvpVno" data-uc-ct="linksafe">
            {linkInfo.text}
          </LinkSafe>
        ) : (
          linkInfo.text
        )
      },
    },
    {
      title: intlMsg.dynamicType,
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
          <p>{intlMsg.loadFailed}</p>
          <p>
            <button
              className={styles.reloadBtn}
              onClick={() => {
                allArr = []
                getBid()
              }}
              data-uc-id="T0KYvRbIMR"
              data-uc-ct="button"
            >
              {intlMsg.retry}
            </button>
          </p>
        </div>
      )
    }
    return intlMsg.noData
  }

  // 自定义页脚
  const customFooter = () => {
    if (lastDatas.length !== 0 && lastDatas.length === 50 && dynamicEventLoaded) {
      return (
        <div className={styles.dynamicLoadingMore}>
          <LinkSafe
            target={'_blank'}
            href="index.html#/companyDynamic?keyMenu=2"
            data-uc-id="_DA3NM3_VQW"
            data-uc-ct="linksafe"
          >
            {intlMsg.viewMore}
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
          <div className={styles.homeCurrentTopLeft}>
            <MyIcon name="corp_dynamic" svgStyle={{ fontSize: '24px' }} />
            <span className={styles.latest}>{intlMsg.myCorpDynamic}</span>
          </div>

          <div className={styles.dropdownWrap}>
            <Dropdown trigger={['click']} overlay={menuType} data-uc-id="7xqtRejmQY" data-uc-ct="dropdown">
              <Button className={styles.dropdownBtn} data-uc-id="edW0TGhZEl" data-uc-ct="button">
                {selectType}{' '}
                <DownO
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  data-uc-id="oJpVDf0KoS"
                  data-uc-ct="downo"
                />
              </Button>
            </Dropdown>
            <Dropdown trigger={['click']} overlay={menuDate} data-uc-id="UHNkOCYeJ_" data-uc-ct="dropdown">
              <Button className={styles.dropdownBtn} data-uc-id="QG6u6tN36a" data-uc-ct="button">
                {selectDate}{' '}
                <DownO
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  data-uc-id="kSOLaknrBj"
                  data-uc-ct="downo"
                />
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
            locale={{
              emptyText: customEmpty(),
            }}
            footer={customFooter}
            data-uc-id="ilZ5hQ4BUJ"
            data-uc-ct="table"
          />
        </div>
      </div>
    </React.Fragment>
  )
}
