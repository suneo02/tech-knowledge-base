import { AddStarO, DataEditO, DownloadO, HomeO, QuestionCircleO, StarF, ToTopO } from '@wind/icons'
import { BackTop, Tooltip } from '@wind/wind-ui'
import React, { FC, memo, useCallback, useState } from 'react'
import { getcustomercountgroupnew } from '../../api/companyDynamic'

import { wftCommon } from '../../utils/utils'
import Collect from '../searchListComponents/collect'

import appImg from '@/assets/imgs/logo/app.png'
import miniAppImg from '@/assets/imgs/logo/mini-app.jpg'
import supportImg from '@/assets/imgs/logo/support.jpg'
import './index.less'

import { entWebAxiosInstance } from '@/api/entWeb'
import { AliceBitAnimation } from '@/components/AIBitmapAnimation'
import { useFeedbackModal } from '@/components/company/feedback/useFeedbackModal'
import { postPointBuriedWithAxios } from 'gel-api'
import { t } from 'gel-util/intl'
import './index.less'

const is_terminal = wftCommon.usedInClient()

// 反馈提交按钮逻辑移至通用函数，工具栏无需自带提交按钮

interface ToolsBarProps {
  isShowApp?: boolean
  isShowMiniApp?: boolean
  isShowPublic?: boolean
  isShowCollect?: boolean
  isShowFeedback?: boolean
  isShowHome?: boolean
  isShowAlice?: boolean
  isShowReport?: boolean
  isShowBackTop?: boolean
  isShowHelp?: boolean
  backTopWrapClass?: string
  isHorizon?: boolean
  companyCode?: string
  companyName?: string
  setCollectState?: (state: boolean) => void
  collectState?: boolean
  onClickReport?: () => void
  showRight?: boolean
  onAliceClick?: (show?: boolean | ((i: boolean) => boolean)) => void
  onShowFeedback?: () => void
}

const ToolsBar: FC<ToolsBarProps> = ({
  isShowApp,
  isShowMiniApp,
  isShowPublic,
  isShowCollect,
  collectState,
  setCollectState,
  isShowFeedback,
  isShowHome,
  isShowAlice,
  isShowReport,
  isShowBackTop = true,
  isShowHelp = true,
  backTopWrapClass,
  isHorizon = false,
  companyCode,
  companyName,
  onAliceClick,
  onClickReport,
}) => {
  const [collectList, setCollectList] = useState([])
  const [modalShow, setModalShow] = useState(false)
  const { openFeedbackModal } = useFeedbackModal()

  const showFeedBackModel = useCallback(() => {
    openFeedbackModal(companyName)
  }, [companyName, openFeedbackModal])

  // 收藏相关功能
  const showCollectModal = useCallback(() => {
    getcustomercountgroupnew().then((res) => {
      if (res.Data && res.Data.length) {
        setCollectList(res.Data)
        setModalShow(true)
      }
    })
  }, [])

  const closeModal = useCallback(() => {
    setModalShow(false)
  }, [])

  // 水平工具栏
  const HorizonToolsBar = useCallback(() => {
    console.log('🚀 ~ HorizonToolsBar ~ 渲染:')
    return (
      <div className="tools-bar-horizon">
        <div className="tools-bar-horizon-left">
          {isShowApp && (
            <>
              <span className="horizon-item" onClick={() => {}} data-uc-id="Tus-YqtYhOJ" data-uc-ct="span">
                <div className="content-toolbar-APP-icon"></div>
              </span>
            </>
          )}

          {isShowMiniApp && (
            <>
              <span className="horizon-item" onClick={() => {}} data-uc-id="cGqa862VyRj" data-uc-ct="span">
                <div className="content-toolbar-mini-icon"></div>
              </span>
            </>
          )}

          {isShowPublic && (
            <>
              <span className="horizon-item" onClick={() => {}} data-uc-id="4y6fqVAWOqK" data-uc-ct="span">
                <div className="content-toolbar-QRCode-icon"></div>
              </span>
            </>
          )}

          {isShowReport && (
            <>
              <span
                className="horizon-item"
                onClick={() => onClickReport?.()}
                data-uc-id="j10jd49smxZ"
                data-uc-ct="span"
              >
                <DownloadO
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  data-uc-id="NJrFb0AuaTP"
                  data-uc-ct="downloado"
                />
                <span className="horizon-item-text">{t('175211', '报告')}</span>
              </span>
            </>
          )}

          {isShowHome && (
            <>
              <span
                className="horizon-item"
                onClick={() => wftCommon.jumpJqueryPage('SearchHome.html')}
                data-uc-id="j1-2ACgp8yI"
                data-uc-ct="span"
              >
                <HomeO
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  data-uc-id="9P6N5eauWfD"
                  data-uc-ct="homeo"
                />
              </span>
            </>
          )}

          {isShowCollect && (
            <>
              <span
                className={`horizon-item ${collectState ? 'sel-customer' : ''}`}
                onClick={showCollectModal}
                data-uc-id="MpgKNhHgVvt"
                data-uc-ct="span"
              >
                {collectState ? (
                  <StarF
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    data-uc-id="IgGmPER1Ra5"
                    data-uc-ct="starf"
                  />
                ) : (
                  <AddStarO
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    data-uc-id="86B6_pNMm-"
                    data-uc-ct="addstaro"
                  />
                )}
                <span className="horizon-item-text">{collectState ? t('138129', '已收藏') : t('143165', '收藏')}</span>
              </span>
            </>
          )}

          {isShowFeedback && (
            <>
              <span
                className="horizon-item"
                style={{ zIndex: 2 }}
                onClick={() => showFeedBackModel()}
                data-uc-id="K3_Oa_yyw5E"
                data-uc-ct="span"
              >
                <DataEditO
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  data-uc-id="N6Fk57ypfPM"
                  data-uc-ct="dataedito"
                />
                <span className="horizon-item-text">{t('142975', '反馈')}</span>
              </span>
            </>
          )}

          {isShowBackTop && (
            <span
              className="horizon-item"
              onClick={() => {
                const targetElement = document.getElementsByClassName(backTopWrapClass)[0]
                if (targetElement) {
                  targetElement.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              data-uc-id="iDNu1qxaAZJ"
              data-uc-ct="span"
            >
              <ToTopO
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                data-uc-id="Ooy_9JCmhsu"
                data-uc-ct="totopo"
              />
            </span>
          )}
        </div>
        {isShowAlice ? (
          <span
            className="horizon-item"
            onClick={() => {
              onAliceClick?.((i) => {
                postPointBuriedWithAxios(entWebAxiosInstance, i ? '922610370036' : '922610370035')
                return !i
              })
            }}
            data-uc-id="5lASMtn9tVS"
            data-uc-ct="span"
          >
            <AliceBitAnimation className="horizon-item-alice-icon" />
            <span className="horizon-item-text">{t('451214', 'AI问企业')}</span>
          </span>
        ) : null}
      </div>
    )
  }, [
    isShowApp,
    isShowMiniApp,
    isShowPublic,
    isShowCollect,
    collectState,
    isShowFeedback,
    is_terminal,
    backTopWrapClass,
    showFeedBackModel,
  ])

  // 垂直工具栏
  const VerticalToolsBar = useCallback(() => {
    return (
      <>
        <div className="backTop-box">
          {isShowApp ? (
            // @ts-expect-error ttt
            <BackTop
              className="content-toolbar-APP"
              // onClick={() => wftCommon.jumpJqueryPage('SearchHome.html')}
              visibilityHeight={-1}
              data-uc-id="oCW4LynYtXO"
              data-uc-ct="backtop"
            >
              <Tooltip
                placement="left"
                overlayClassName="backTop-tooltip"
                title={<img src={appImg} alt="APP" style={{ width: 180 }} />}
              >
                <div className="content-toolbar-APP-icon"></div>
                <span>{t('', 'APP')}</span>
              </Tooltip>
            </BackTop>
          ) : null}
          {isShowMiniApp ? (
            // @ts-expect-error ttt
            <BackTop
              className="content-toolbar-mini"
              visibilityHeight={-1}
              data-uc-id="VXgtAgPVp-l"
              data-uc-ct="backtop"
            >
              <Tooltip
                placement="left"
                overlayClassName="backTop-tooltip"
                title={<img src={miniAppImg} alt={t('431128', '小程序')} style={{ width: 180 }} />}
              >
                <div className="content-toolbar-mini-icon"></div>
                <span>{t('431128', '小程序')}</span>
              </Tooltip>
            </BackTop>
          ) : null}
          {isShowPublic ? (
            // @ts-expect-error ttt
            <BackTop
              className="content-toolbar-QRCode"
              // onClick={() => wftCommon.jumpJqueryPage('SearchHome.html')}
              visibilityHeight={-1}
              data-uc-id="klrxc7wgI8E"
              data-uc-ct="backtop"
            >
              <Tooltip
                placement="left"
                overlayClassName="backTop-tooltip"
                title={<img src={supportImg} alt={t('431127', '服务号')} style={{ width: 180 }} />}
              >
                <div className="content-toolbar-QRCode-icon"></div>
                <span>{t('431127', '服务号')}</span>
              </Tooltip>
            </BackTop>
          ) : null}

          {isShowHome ? (
            // @ts-expect-error ttt
            <BackTop
              className="content-toolbar-home"
              visibilityHeight={-1}
              onClick={() => wftCommon.jumpJqueryPage('SearchHome.html')}
              data-uc-id="SE39Z9CRxXl"
              data-uc-ct="backtop"
            >
              <HomeO
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                data-uc-id="AsdcYgRrFIk"
                data-uc-ct="homeo"
              ></HomeO>
              <span>{t('19475', '首页')}</span>
            </BackTop>
          ) : null}

          {isShowCollect ? (
            // @ts-expect-error ttt
            <BackTop
              className={collectState ? 'content-toolbar-customer sel-customer' : 'content-toolbar-customer'}
              visibilityHeight={-1}
              onClick={showCollectModal}
              data-uc-id="TrhmeT7UsPC"
              data-uc-ct="backtop"
            >
              {collectState ? (
                <StarF
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  data-uc-id="tO09EGSyeA1"
                  data-uc-ct="starf"
                />
              ) : (
                <AddStarO
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  data-uc-id="pS3j9X1Sf2g"
                  data-uc-ct="addstaro"
                ></AddStarO>
              )}
              <span>{collectState ? t('138129', '已收藏') : t('143165', '收藏')}</span>
            </BackTop>
          ) : null}

          {isShowFeedback ? (
            // @ts-expect-error ttt
            <BackTop
              className="content-toolbar-feedback"
              visibilityHeight={-1}
              onClick={() => showFeedBackModel()}
              data-uc-id="82-MR-6zP8J"
              data-uc-ct="backtop"
            >
              <DataEditO
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                data-uc-id="MkQ_fJfEDPk"
                data-uc-ct="dataedito"
              />
              <span>{t('142975', '反馈')}</span>
            </BackTop>
          ) : null}

          {is_terminal && isShowHelp ? (
            // @ts-expect-error ttt
            <BackTop
              className="content-toolbar-home"
              visibilityHeight={-1}
              onClick={() => {
                if (is_terminal) {
                  window.open('//UnitedWebServer/helpcenter/helpCenter/redirect/document?id=30', '_blank')
                }
              }}
              data-uc-id="kW87w8UCZIT"
              data-uc-ct="backtop"
            >
              <QuestionCircleO
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                data-uc-id="JL15XP7AlDP"
                data-uc-ct="questioncircleo"
              />
              <span>{window.en_access_config ? 'Help' : '帮助'}</span>
            </BackTop>
          ) : null}

          {isShowAlice ? (
            // @ts-expect-error ttt
            <BackTop
              className="content-toolbar-feedback"
              style={{}}
              visibilityHeight={-1}
              onClick={() => onAliceClick?.((i) => !i)}
              data-uc-id="suOLZhURQba"
              data-uc-ct="backtop"
            >
              <AliceBitAnimation
                style={{ transform: 'scale(0.4)', height: '30px', marginLeft: '-55px', transformOrigin: 'center' }}
              />
              <span>{t('', 'Alice')}</span>
            </BackTop>
          ) : null}

          <BackTop
            className="content-toolbar-top"
            // @ts-expect-error ttt
            target={() => document.getElementsByClassName(backTopWrapClass)[0]}
            visibilityHeight={-1}
            data-uc-id="OJoLT1VbpJK"
            data-uc-ct="backtop"
          >
            <ToTopO
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              data-uc-id="b5cOxvo04Pf"
              data-uc-ct="totopo"
            ></ToTopO>
            <span>{t('416013', '置顶')}</span>
          </BackTop>
        </div>
      </>
    )
  }, [
    collectState,
    isShowApp,
    isShowMiniApp,
    isShowPublic,
    isShowCollect,
    isShowFeedback,
    is_terminal,
    backTopWrapClass,
    showFeedBackModel,
  ])

  const renderToolsBar = () => {
    // 水平工具栏
    if (isHorizon) {
      return <HorizonToolsBar />
    }
    return <VerticalToolsBar />
  }
  return (
    <>
      {renderToolsBar()}
      {/* 使用原有的Collect组件处理收藏功能 */}
      {modalShow && (
        <Collect
          state={collectState}
          list={collectList}
          code={companyCode}
          from={'detail'}
          close={closeModal}
          change={(state) => setCollectState(state)}
        />
      )}
    </>
  )
}

export default memo(ToolsBar)
