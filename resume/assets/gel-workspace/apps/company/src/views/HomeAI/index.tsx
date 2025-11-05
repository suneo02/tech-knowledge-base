import ToolsBar from '@/components/toolsBar'
import React, { useEffect, useRef, useState } from 'react'
import rectImg from '../../assets/imgs/rect.jpg'
import Advertisement, { advertisementKey } from '../../components/modal/AdvertisementModal.tsx'
import { pointClickCompanyTab, pointHomepageLoad } from '../../lib/pointBuriedGel.tsx'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils.tsx'
import { HomeSearchForm } from './comp/SearchForm'
import styles from './style/index.module.less'

import imageUrl from '@/assets/imgs/activityLogo.png'
import { usePageTitle } from '@/handle/siteTitle'
import { AIAssistant } from '@/views/HomeAI/comp/AIAssistant'
import { HomeCorpDynamic } from '@/views/HomeAI/comp/CorpDynamic'
import { Button } from '@wind/wind-ui'
import { pointBuriedNew } from '../../api/configApi.ts'
import { MessagePopup, VipPopup } from '../../lib/globalModal.tsx'
import { useUserInfoStore } from '../../store/userInfo.ts'
import { HotCorp } from './comp/HotCorp/index.tsx'
import { HomeMainFunc } from './comp/MainFunc/index.tsx'
import { HomeRecommendFunc } from './comp/RecommendFunc/index.tsx'
import { HomeTitle } from './comp/HomeTitle.tsx'
/**
 * @constructor
 */
function HomeAI() {
  usePageTitle('CompanyHome')
  const [imgHover, setImgHover] = useState(false) // 征信备案
  const [scrollObj, setScrollObj] = useState({
    scrollHeight: 0,
    scrollTop: 0,
    clientHeight: 0,
  }) // 鼠标滚动相关参数

  const { isActivityUser, getActivityInfos, isEmployee, getIsEmployee } = useUserInfoStore()

  const isDev = wftCommon.isDevDebugger()

  const searchHomeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 埋点
    pointHomepageLoad()
    pointClickCompanyTab()

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
    getActivityInfos()
    getIsEmployee()
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
      <div className={styles.searchHome} ref={searchHomeRef} onScroll={(e) => scrollHandle(e)}>
        <div className={styles.homeTopContainer}>
          <div className={styles.homeTop}>
            <HomeTitle />
            <HomeSearchForm />
            <HotCorp />
          </div>
        </div>
        <div className={styles.homeBottomContainer}>
          <div className={styles.aiMainContainer}>
            <AIAssistant />
            <HomeMainFunc />
          </div>
          <HomeRecommendFunc />

          {/* 企业最新动态 */}
          <HomeCorpDynamic scrollObj={scrollObj} onScrollTop={handleScrollTop} />
        </div>
      </div>
      <ToolsBar backTopWrapClass={styles.searchHome} isShowApp isShowMiniApp isShowPublic  isShowFeedback={true} />
    </React.Fragment>
  )
}

export default HomeAI
