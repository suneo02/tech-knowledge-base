import StickyBox from '@/components/StickyBox'
import { formatNumber } from '@/utils/common'
import intl from '@/utils/intl'
import { Spin, Tabs } from '@wind/wind-ui'
import { ConfigProvider } from 'antd'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { GSTabsEnum } from '../../types'
import GlobalTips from '../GlobalTips'
import GlobalSearchTab from '../GSTab'
import useStats from './useStats'
import './index.less'
import { useScrollContext } from '@/components/layout/layoutScrollContent/ScrollContext'
import { wftCommon } from '@/utils/utils'
import { hashParams } from '@/utils/links'
import { outCompanyParam } from '@/handle/searchConfig'

export const OTHER_STATS_API = 'search/company/getSearchNum'

export const CHINA_FULL = 'search/company/getCompanySearchFullMatch' //精准搜索
export const CHINA_PART = 'search/company/getCompanySearchPartMatch' //模糊搜索

export const GLOBAL_FULL = 'search/company/getGlobalCompanySearchFullMatch'
export const GLOBAL_PART = 'search/company/getGlobalCompanySearchPartMatch'

const TAB_LIST = [
  { key: GSTabsEnum.GLOBAL, label: intl('206099', '全球企业') },
  { key: GSTabsEnum.CHINA, label: intl('406774', '中国企业') },
  { key: GSTabsEnum.CHARACTER, label: intl('138433', '人物') },
  { key: GSTabsEnum.GROUP, label: intl('148622', '集团系') },
  { key: GSTabsEnum.BIDDING, label: intl('271633', '招投标') },
  { key: GSTabsEnum.IP, label: intl('120665', '知识产权') },
]

interface Props {
  type?: GSTabsEnum
  queryText?: string
  onUserActionChange?: (key: GSTabsEnum) => void
  onChange?: (key: GSTabsEnum) => void
}

const GSTabs: React.FC<Props> = ({ type = GSTabsEnum.CHINA, queryText, onUserActionChange, onChange }) => {
  const { getParamValue } = hashParams()
  const areaType = getParamValue('areaType')

  let initialValues
  if (areaType) {
    const code = outCompanyParam.find((c) => c.param === areaType)?.code
    initialValues = { areaCode: code ? code : [] }
  }
  const [activeKey, setActiveKey] = useState<GSTabsEnum | null>(type !== GSTabsEnum.CHINA ? type : GSTabsEnum.CHINA)
  const [disableTooltip, setDisableTooltip] = useState(false)
  const [remark, setRemark] = useState<string | null>(null)
  const { chinaStats, globalStats, otherStats, loading } = useStats(queryText, type)

  const openSearchPage = (key: GSTabsEnum) => {
    const urlMap = {
      [GSTabsEnum.CHARACTER]: 'personSearchList',
      [GSTabsEnum.GROUP]: 'groupSearchList',
      [GSTabsEnum.BIDDING]: 'bidSearchList',
      [GSTabsEnum.IP]: 'intelluctalSearch',
    }
    const path = urlMap[key]
    const keyword = getParamValue('keyword') || queryText
    if (path) {
      window.open(`SearchHomeList.html?linksource=CEL&keyword=${keyword}#/${path}`)
    }
  }

  const updateActiveKey = (key: GSTabsEnum) => {
    setActiveKey(key)
    onChange?.(key)
  }

  const handleTabChange = useCallback(
    (key: GSTabsEnum) => {
      openSearchPage(key)
      setRemark(null)
      if (key === GSTabsEnum.GLOBAL || key === GSTabsEnum.CHINA) {
        updateActiveKey(key)
        onUserActionChange?.(key)
      }
    },
    [onUserActionChange]
  )

  const renderItem = (item: (typeof TAB_LIST)[number]) => {
    switch (item.key) {
      case GSTabsEnum.GLOBAL:
        return (
          <GlobalSearchTab
            data={globalStats?.data}
            queryText={queryText}
            api={[GLOBAL_FULL, GLOBAL_PART]}
            type={item.key}
            remark={remark}
            filterParams={{ ...initialValues }}
          />
        )
      case GSTabsEnum.CHINA:
        return (
          <GlobalSearchTab
            data={chinaStats?.data}
            queryText={queryText}
            api={[CHINA_FULL, CHINA_PART]}
            type={item.key}
            remark={remark}
          />
        )
      // case GSTabsEnum.GROUP:
      //   return <div>集团系信息展示</div>
      // case GSTabsEnum.CHARACTER:
      //   return <div>人物信息展示</div>
      // case GSTabsEnum.BIDDING:
      //   return <div>招投标信息展示</div>
      // case GSTabsEnum.IP:
      //   return <IntelluctalSearch hideTabs />
      default:
        break
    }
  }

  const items = useMemo(() => {
    const staticData = {
      [GSTabsEnum.GLOBAL]: globalStats,
      [GSTabsEnum.CHINA]: chinaStats,
      [GSTabsEnum.GROUP]: { count: otherStats?.group },
      [GSTabsEnum.CHARACTER]: { count: otherStats?.person },
      [GSTabsEnum.BIDDING]: { count: otherStats?.bidding },
      [GSTabsEnum.IP]: { count: otherStats?.iP },
    }

    return TAB_LIST.map((item) => {
      // 如果是海外场景进入，则不展示人物Tab
      if (wftCommon.is_overseas_config && item.key === GSTabsEnum.CHARACTER) {
        return null
      }

      return {
        label: `${item.label} ${formatNumber(staticData[item.key]?.count)}`,
        key: item.key,
        children: loading ? (
          <Spin>
            <div style={{ width: '100%', height: '50vh' }}></div>
          </Spin>
        ) : (
          renderItem(item)
        ),
      }
    }).filter(Boolean)
  }, [globalStats, chinaStats, otherStats, loading])

  const GlobalTipsWrapper = memo(({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
    if (!visible || disableTooltip) return null

    // 添加30秒后自动消失的逻辑
    useEffect(() => {
      if (visible) {
        const timer = setTimeout(() => {
          onClose()
        }, 30000)

        return () => clearTimeout(timer)
      }
    }, [visible, onClose])

    return (
      <GlobalTips
        visible={visible}
        globalCount={Number(globalStats?.count) || 0}
        onClose={onClose}
        onClick={() => updateActiveKey(GSTabsEnum.GLOBAL)}
        data-uc-id="xD18WUKyUX"
        data-uc-ct="globaltips"
      />
    )
  })
  GlobalTipsWrapper.displayName = 'GlobalTipsWrapper'

  const renderTabBar = useCallback<any>(
    (props, DefaultTabBar) => (
      <StickyBox style={{ zIndex: 4, height: 36 }}>
        <GlobalTipsWrapper
          visible={!loading && !!chinaStats?.count && !!globalStats?.count}
          onClose={() => setDisableTooltip(true)}
          data-uc-id="J2VjRsPnWA"
          data-uc-ct="globaltipswrapper"
        />
        <DefaultTabBar {...props} style={{ backgroundColor: '#fff', paddingInline: 12, height: 36 }} />
      </StickyBox>
    ),
    [loading, chinaStats, globalStats, disableTooltip]
  )

  useEffect(() => {
    updateActiveKey(null)
    setDisableTooltip(false)
  }, [queryText])

  useEffect(() => {
    setRemark('')
    if (loading) return
    if (type === GSTabsEnum.GLOBAL) {
      if (!globalStats?.count && chinaStats?.count) {
        setRemark(intl('406775', '由于全球企业未找到相关数据，已为您切换到中国企业'))
        updateActiveKey(GSTabsEnum.CHINA)
        // onChange?.(GSTabsEnum.CHINA)
        return
      }
      setDisableTooltip(true)
      updateActiveKey(GSTabsEnum.GLOBAL)
    } else if (type === GSTabsEnum.CHINA) {
      if (!chinaStats?.count && globalStats?.count) {
        setRemark(intl('406793', '由于中国企业未找到相关数据，已为您切换到全球企业'))
        setDisableTooltip(true)
        updateActiveKey(GSTabsEnum.GLOBAL)
        // onChange?.(GSTabsEnum.GLOBAL)
        return
      }
      updateActiveKey(GSTabsEnum.CHINA)
      // onChange?.(GSTabsEnum.CHINA)
    } else {
      // TODO 其余的type 暂时跳转到原来的界面
      // setActiveKey(type)
    }
  }, [loading, chinaStats, globalStats])

  const { saveScrollPosition, restoreScrollPosition } = useScrollContext()

  useEffect(() => {
    if (activeKey === GSTabsEnum.GLOBAL) setDisableTooltip(true)
    restoreScrollPosition(activeKey)
    return () => {
      saveScrollPosition(activeKey)
    }
  }, [activeKey])

  return (
    <div style={{ width: '100%', backgroundColor: '#fff' }}>
      {/* @ts-expect-error ttt */}
      <Spin
        spinning={loading}
        style={{ maxHeight: '100vh', height: 'calc(100vh - 64px)', width: '100%', backgroundColor: '#fff' }}
      >
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                inkBarColor: '#0596b3',
                itemSelectedColor: '#0596b3',
                itemActiveColor: '#05809e',
                itemHoverColor: '#00aec7',
                horizontalItemPadding: '7px 0',
              },
            },
          }}
        >
          <Tabs
            className="global-search-tabs"
            activeKey={activeKey}
            onChange={handleTabChange}
            renderTabBar={renderTabBar}
            data-uc-id="wBX7Dw-x1J"
            data-uc-ct="tabs"
          >
            {items.map((item) => (
              <Tabs.TabPane
                key={item.key}
                tab={item.label}
                data-uc-id="rYLlLZxSnE"
                data-uc-ct="tabs"
                data-uc-x={item.key}
              >
                {item.children}
              </Tabs.TabPane>
            ))}
          </Tabs>
        </ConfigProvider>
      </Spin>
    </div>
  )
}

export default GSTabs
