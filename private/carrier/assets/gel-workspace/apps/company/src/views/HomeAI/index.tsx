import ToolsBar from '@/components/toolsBar'
import React, { useEffect, useRef, useState } from 'react'
import rectImg from '../../assets/imgs/rect.jpg'
import Advertisement, { advertisementKey } from '../../components/modal/AdvertisementModal.tsx'
import { pointHomepageLoad } from '../../lib/pointBuriedGel.tsx'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils.tsx'
import { HomeSearchForm } from './comp/SearchForm'
import styles from './style/index.module.less'

import { request } from '@/api/request'
import imageUrl from '@/assets/imgs/activityLogo.png'
import { usePageTitle } from '@/handle/siteTitle'
import { AIAssistant } from '@/views/HomeAI/comp/AIAssistant'
import { HomeCorpDynamic } from '@/views/HomeAI/comp/CorpDynamic'
import { Button } from '@wind/wind-ui'
import { usedInClient } from 'gel-util/env'
import { isEn } from 'gel-util/intl'
import { DEFAULT_SITE_TITLE_WEB_CN } from 'gel-util/misc'
import { pointBuriedNew } from '../../api/configApi.ts'
import { MessagePopup, VipPopup } from '../../lib/globalModal.tsx'
import { useUserInfoStore } from '../../store/userInfo.ts'
import { HomeTitle } from './comp/HomeTitle.tsx'
import { HotCorp } from './comp/HotCorp/index.tsx'
import { HomeMainFunc } from './comp/MainFunc/index.tsx'
import { HomeRecommendFunc } from './comp/RecommendFunc/index.tsx'

export interface CountDataType {
  corpCount?: number
  featuredCount?: number
}

/**
 * Calculates a date range for API queries
 * @returns An object with formatted date strings for the query
 */
const calculateDateRange = (): { startDate: string; endDate: string } => {
  const d = new Date()

  // Calculate end date (yesterday with adjustments for weekends)
  let endYear = d.getFullYear()
  let endMonth = d.getMonth() + 1
  let endDay = d.getDate() - 1
  const weekDay = d.getDay()

  // Adjust for weekends
  let adjustment = 0
  if (weekDay === 1) {
    // Monday
    adjustment = 2
  } else if (weekDay === 0) {
    // Sunday (7 in the original code)
    adjustment = 1
  }

  endDay -= adjustment

  // Handle month/year rollover if day becomes zero or negative
  if (endDay <= 0) {
    endMonth -= 1

    // Handle January rollover to previous year
    if (endMonth <= 0) {
      endMonth = 12
      endYear -= 1
    }

    // Set the correct last day of the previous month
    if ([1, 3, 5, 7, 8, 10, 12].includes(endMonth)) {
      endDay = 31 + endDay // endDay is negative, so this is actually subtraction
    } else if (endMonth === 2) {
      // Check for leap year
      const isLeapYear = (endYear % 4 === 0 && endYear % 100 !== 0) || endYear % 400 === 0
      endDay = (isLeapYear ? 29 : 28) + endDay
    } else {
      endDay = 30 + endDay
    }
  }

  // Format end date
  const formattedEndMonth = endMonth < 10 ? `0${endMonth}` : `${endMonth}`
  const formattedEndDay = endDay < 10 ? `0${endDay}` : `${endDay}`

  // Create date object for end date
  const endDate = new Date(`${endYear}-${formattedEndMonth}-${formattedEndDay}`)

  // Calculate start date (2 days before end date)
  const startDateTimestamp = endDate.getTime() - 2 * 24 * 60 * 60 * 1000
  const startDate = new Date(startDateTimestamp)

  const startYear = startDate.getFullYear()
  const startMonth = startDate.getMonth() + 1
  const startDay = startDate.getDate()

  // Format start date
  const formattedStartMonth = startMonth < 10 ? `0${startMonth}` : `${startMonth}`
  const formattedStartDay = startDay < 10 ? `0${startDay}` : `${startDay}`

  return {
    startDate: `${startYear}${formattedStartMonth}${formattedStartDay}`,
    endDate: `${endYear}${formattedEndMonth}${formattedEndDay}`,
  }
}

/**
 * @constructor
 */
function HomeAI() {
  if (!usedInClient() && !isEn()) {
    // web端、中文版，设置默认标题，SEO优化
    window.document.title = DEFAULT_SITE_TITLE_WEB_CN
  } else {
    usePageTitle('CompanyHome')
  }
  const [imgHover, setImgHover] = useState(false) // 征信备案
  const [scrollObj, setScrollObj] = useState({
    scrollHeight: 0,
    scrollTop: 0,
    clientHeight: 0,
  }) // 鼠标滚动相关参数

  const { isActivityUser, isEmployee } = useUserInfoStore()

  const isDev = wftCommon.isDevDebugger()

  const [countData, setCountData] = useState<CountDataType>({})

  const searchHomeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCorpCount = async () => {
      try {
        const { startDate, endDate } = calculateDateRange()

        const res = await request('getcrossfilterforhome', {
          matchOldData: true,
          params: {
            createDate: `${startDate}~${endDate}`,
            govlevel: '存续',
            PageSize: 0,
          },
        })
        setCountData((prevData) => ({
          ...prevData,
          corpCount: res.Page.Records,
        }))
      } catch (error) {
        console.error('Failed to fetch count data:', error)
      }
    }

    const fetchFeaturedCount = async () => {
      try {
        const res = await request('corplistrecommend', {
          matchOldData: true,
          params: { PageNo: 0 },
        })
        const count = res.Page.Records
        setCountData((prevData) => ({
          ...prevData,
          featuredCount: count,
        }))
      } catch (e) {
        console.error('Failed to fetch featured count data:', e)
      }
    }
    fetchCorpCount()
    fetchFeaturedCount()
  }, [])

  useEffect(() => {
    // 埋点
    pointHomepageLoad()

    if (document.querySelector('.logo')) {
      document.querySelector('.logo').addEventListener('mouseover', () => setImgHover(true))
      document.querySelector('.logo').addEventListener('mouseout', () => setImgHover(false))
    }
    return () => {
      if (document.querySelector('.logo')) {
        document.querySelector('.logo').removeEventListener('hover', () => setImgHover(true))
        document.querySelector('.logo').removeEventListener('mouseout', () => setImgHover(false))
      }
    }
  }, [])

  useEffect(() => {
    if (isActivityUser) {
      MessagePopup(
        intl(
          '394294',
          '尊敬的特邀用户，感谢您对全球企业库的长期支持与陪伴！点击参加回归礼遇活动，即可获赠3个月SVIP会员权限。'
        ),
        () => {
          VipPopup()
          pointBuriedNew('922602100961', {
            opEntity: '促销活动-顶部BANNER点击',
          })
        }
      )
    }
  }, [isActivityUser])

  const scrollHandle = (e) => {
    setScrollObj({
      scrollHeight: e.target.scrollHeight,
      scrollTop: e.target.scrollTop,
      clientHeight: e.target.clientHeight,
    })
  }

  const handleScrollTop = () => {
    searchHomeRef.current?.scrollTo({ top: 0 })
  }

  return (
    <React.Fragment>
      {/* 营销活动广告弹窗  开发18秒内展示一次,线上一天内展示一次 */}
      {isActivityUser && (
        <>
          {isEmployee && (
            <Button
              style={{
                position: 'absolute',
              }}
              onClick={() => {
                localStorage.removeItem(advertisementKey)
              }}
              data-uc-id="y2VQfUw6R"
              data-uc-ct="button"
            >
              清空弹窗广告时间限制(员工账号)
            </Button>
          )}
          {/* @ts-expect-error ttt */}
          <Advertisement
            imageUrl={imageUrl}
            width="415px"
            height="444px"
            onJump={() => {
              VipPopup()
            }}
            expiry={isDev ? 0.05 * 0.1 : 24}
            data-uc-id="VC1pSCQ8WW"
            data-uc-ct="advertisement"
          />
        </>
      )}
      {imgHover && (
        <div className={styles.rectImg}>
          <div>
            <img src={rectImg} />
          </div>
        </div>
      )}
      <div
        className={styles.searchHome}
        ref={searchHomeRef}
        onScroll={(e) => scrollHandle(e)}
        data-uc-id="1SzC7WTGxm"
        data-uc-ct="div"
      >
        <div className={styles.homeTopContainer}>
          <div className={styles.homeTop}>
            <HomeTitle />
            <HomeSearchForm />
            <HotCorp />
            <HomeMainFunc countData={countData} />
            <AIAssistant />
          </div>
        </div>
        <div className={styles.homeBottomContainer}>
          <HomeRecommendFunc />
          {/* 企业最新动态 */}
          <HomeCorpDynamic
            scrollObj={scrollObj}
            onScrollTop={handleScrollTop}
            data-uc-id="kpIiVyibvk"
            data-uc-ct="homecorpdynamic"
          />
        </div>
      </div>
      <ToolsBar backTopWrapClass={styles.searchHome} isShowApp isShowMiniApp isShowPublic isShowFeedback={true} />
    </React.Fragment>
  )
}

export default HomeAI
