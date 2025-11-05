import { AddStarO, DataEditO, DownloadO, HomeO, QuestionCircleO, StarF, ToTopO } from '@wind/icons'
import { BackTop, Button, message, Tooltip } from '@wind/wind-ui'
import React, { memo, useCallback, useState } from 'react'
import * as globalActions from '../../actions/global'
import { myWfcAjax } from '../../api/companyApi'
import { getcustomercountgroupnew } from '../../api/companyDynamic'
import store from '../../store/store'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'
import Collect from '../searchListComponents/collect'

import appImg from '@/assets/imgs/logo/app.png'
import miniAppImg from '@/assets/imgs/logo/mini-app.jpg'
import supportImg from '@/assets/imgs/logo/support.jpg'
import './index.less'

import { AliceBitAnimation } from '@/views/CompanyDetailAI/comp/AIBitmapAnimation'
import { useSelector } from 'react-redux'
import './index.less'

const is_terminal = wftCommon.usedInClient()
const CompanyFloatingWindowComp = () => React.lazy(() => import('../company/CompanyFloatingWindow'))

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
  setCollectState?: (state: boolean) => void
  collectState?: boolean
  onClickReport?: () => void
  showRight?: boolean
  onAliceClick?: (show?: boolean | ((i: boolean) => boolean)) => void
  onShowFeedback?: () => void
}

function ToolsBar(props: ToolsBarProps) {
  const {
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
    showRight,
    onAliceClick,
    onClickReport,
  } = props

  const [collectList, setCollectList] = useState([])
  const [modalShow, setModalShow] = useState(false)

  const feedParam = useSelector((state: any) => state.company?.feedBackPara)

  const showFeedBackModel = useCallback(() => {
    const CompanyFloatingWindowCss = CompanyFloatingWindowComp()
    store.dispatch(
      globalActions.setGolbalModal({
        className: 'companyIntroductionTagModal',
        width: 720,
        visible: true,
        onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
        title: intl('97058', '意见反馈'),
        content: <React.Suspense fallback={<div></div>}>{<CompanyFloatingWindowCss name={''} />}</React.Suspense>,
        footer: [
          // @ts-expect-error ttt
          <Button key={19405} type="grey" onClick={() => store.dispatch(globalActions.clearGolbalModal())}>
            {intl('19405', '取消')}
          </Button>,
          <Button
            key={14108}
            type="primary"
            onClick={() => showFeedParam(() => store.dispatch(globalActions.clearGolbalModal()))}
          >
            {intl('14108', '提交')}
          </Button>,
        ],
      })
    )
  }, [])

  const showFeedParam = useCallback(
    async (fn) => {
      try {
        if (!feedParam || !feedParam.message || feedParam?.message?.length == 0) {
          message.warning('请填写反馈描述!', 2)
        } else {
          const res = await myWfcAjax('addfeedback', feedParam)
          if (res.ErrorCode == 0) {
            message.success('感谢您的反馈!', 2)
            fn?.()
          } else {
            message.warning('提交失败，请稍后重试!', 2)
          }
        }
      } catch (e) {
        console.error(e)
      }
    },
    [feedParam]
  )

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
              <span className="horizon-item" onClick={() => {}}>
                <div className="content-toolbar-APP-icon"></div>
              </span>
            </>
          )}

          {isShowMiniApp && (
            <>
              <span className="horizon-item" onClick={() => {}}>
                <div className="content-toolbar-mini-icon"></div>
              </span>
            </>
          )}

          {isShowPublic && (
            <>
              <span className="horizon-item" onClick={() => {}}>
                <div className="content-toolbar-QRCode-icon"></div>
              </span>
            </>
          )}

          {isShowReport && (
            <>
              <span className="horizon-item" onClick={() => onClickReport?.()}>
                <DownloadO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                <span className="horizon-item-text">{intl('175211', '报告')}</span>
              </span>
            </>
          )}

          {isShowHome && (
            <>
              <span className="horizon-item" onClick={() => wftCommon.jumpJqueryPage('SearchHome.html')}>
                <HomeO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              </span>
            </>
          )}

          {isShowCollect && (
            <>
              <span className={`horizon-item ${collectState ? 'sel-customer' : ''}`} onClick={showCollectModal}>
                {collectState ? (
                  <StarF onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                ) : (
                  <AddStarO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                )}
                <span className="horizon-item-text">
                  {collectState ? intl('138129', '已收藏') : intl('143165', '收藏')}
                </span>
              </span>
            </>
          )}

          {isShowFeedback && (
            <>
              <span className="horizon-item" style={{ zIndex: 2 }} onClick={() => showFeedBackModel()}>
                <DataEditO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                <span className="horizon-item-text">{intl('142975', '反馈')}</span>
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
            >
              <ToTopO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </span>
          )}
        </div>
        {isShowAlice ? (
          <span
            className="horizon-item"
            onClick={() => {
              onAliceClick?.((i) => !i)
            }}
          >
            <AliceBitAnimation
              style={{ transform: 'scale(0.4)', transformOrigin: 'center', marginRight: '-36px', height: '30px' }}
            />
            <span className="horizon-item-text">{intl('451214', 'AI问企业')}</span>
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
              visibilityHeight={-1}
              // onClick={() => wftCommon.jumpJqueryPage('SearchHome.html')}
            >
              <Tooltip placement="left" title={<img src={appImg} alt="APP" style={{ width: 180 }} />}>
                <div className="content-toolbar-APP-icon"></div>
                <span>{intl('', 'APP')}</span>
              </Tooltip>
            </BackTop>
          ) : null}
          {isShowMiniApp ? (
            // @ts-expect-error ttt
            <BackTop className="content-toolbar-mini" visibilityHeight={-1}>
              <Tooltip placement="left" title={<img src={miniAppImg} alt="服务号" style={{ width: 180 }} />}>
                <div className="content-toolbar-mini-icon"></div>
                <span>{intl('', '小程序')}</span>
              </Tooltip>
            </BackTop>
          ) : null}
          {isShowPublic ? (
            // @ts-expect-error ttt
            <BackTop
              className="content-toolbar-QRCode"
              visibilityHeight={-1}
              // onClick={() => wftCommon.jumpJqueryPage('SearchHome.html')}
            >
              <Tooltip placement="left" title={<img src={supportImg} alt="服务号" style={{ width: 180 }} />}>
                <div className="content-toolbar-QRCode-icon"></div>
                <span>{intl('', '服务号')}</span>
              </Tooltip>
            </BackTop>
          ) : null}

          {isShowHome ? (
            // @ts-expect-error ttt
            <BackTop
              className="content-toolbar-home"
              visibilityHeight={-1}
              onClick={() => wftCommon.jumpJqueryPage('SearchHome.html')}
            >
              <HomeO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}></HomeO>
              <span>{intl('19475', '首页')}</span>
            </BackTop>
          ) : null}

          {isShowCollect ? (
            // @ts-expect-error ttt
            <BackTop
              className={collectState ? 'content-toolbar-customer sel-customer' : 'content-toolbar-customer'}
              visibilityHeight={-1}
              onClick={showCollectModal}
            >
              {collectState ? (
                <StarF onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              ) : (
                <AddStarO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}></AddStarO>
              )}
              <span>{collectState ? intl('138129', '已收藏') : intl('143165', '收藏')}</span>
            </BackTop>
          ) : null}

          {isShowFeedback ? (
            // @ts-expect-error ttt
            <BackTop className="content-toolbar-feedback" visibilityHeight={-1} onClick={() => showFeedBackModel()}>
              <DataEditO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              <span>{intl('142975', '反馈')}</span>
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
            >
              <QuestionCircleO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
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
            >
              <AliceBitAnimation
                style={{ transform: 'scale(0.4)', height: '30px', marginLeft: '-55px', transformOrigin: 'center' }}
              />
              <span>{intl('', 'Alice')}</span>
            </BackTop>
          ) : null}

          <BackTop
            className="content-toolbar-top"
            // @ts-expect-error ttt
            target={() => document.getElementsByClassName(backTopWrapClass)[0]}
            visibilityHeight={-1}
          >
            <ToTopO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}></ToTopO>
            <span>{intl('416013', '置顶')}</span>
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
