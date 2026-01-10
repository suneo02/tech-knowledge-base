import { useEffect, useRef } from 'react'
import intl from '../../utils/intl'

import svipImg from '../../assets/imgs/svip.png'
import vipEnImg from '../../assets/imgs/vip-en.png'
import vipImg from '../../assets/imgs/vip.png'

import { Button, Card } from '@wind/wind-ui'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import { usePageTitle } from '../../handle/siteTitle'
import { VipPopup } from '../../lib/globalModal'
import { useUserInfoStore } from '../../store/userInfo'
import { ProductIntro, VersionPriceFooter, VersionPriceSceneTable } from './comp'
import { VersionPriceMenuLeft } from './comp/MenuLeft'
import { MarketingCard } from './components/MarketingCard'
import {
  VIPDueDiligenceCfg,
  VIPEnterpriseFeatureCfg,
  VIPEnterpriseOverviewCfg,
  VIPInsightBusinessCfg,
  VIPMenuArr,
  VIPSceneCfg,
  VIPSceneEnum,
  VIPSpecialDataCfg,
} from './config'
import './domestic.css'
import './domestic.less'
import { useVersionPriceCommonHook } from './handle'
import { VIPFuncCfgScene } from './type'

export const VersionPriceDomestic = () => {
  usePageTitle('VIPServices')
  const { isVipUser, isVipSelected, setIsVipSelected, currentIndex, setCurrentIndex, isSticky } =
    useVersionPriceCommonHook()
  const { isActivityUser, getActivityInfos } = useUserInfoStore()
  const ref = useRef(null)

  useEffect(() => {
    getActivityInfos()
  }, [])

  const ScentTableCfgArr: {
    sceneContentCfg: VIPFuncCfgScene
    sceneTitleCfg: {
      title: string
      langKey: string
    }
    className: string
    id: string
  }[] = [
    {
      sceneContentCfg: VIPEnterpriseOverviewCfg,
      sceneTitleCfg: VIPSceneCfg[VIPSceneEnum.EnterpriseOverview],
      className: currentIndex === 0 ? 'sel' : '',
      id: 'tab1',
    },
    {
      sceneContentCfg: VIPInsightBusinessCfg,
      sceneTitleCfg: VIPSceneCfg[VIPSceneEnum.InsightBusiness],
      className: currentIndex === 0 ? 'sel' : '',
      id: 'tab1',
    },
    {
      sceneContentCfg: VIPEnterpriseFeatureCfg,
      sceneTitleCfg: VIPSceneCfg[VIPSceneEnum.EnterpriseFeature],
      className: currentIndex === 0 ? 'sel' : '',
      id: 'tab1',
    },
    {
      sceneContentCfg: VIPSpecialDataCfg,
      sceneTitleCfg: VIPSceneCfg[VIPSceneEnum.SpecialData],
      className: currentIndex === 0 ? 'sel' : '',
      id: 'tab1',
    },
    {
      sceneContentCfg: VIPDueDiligenceCfg,
      sceneTitleCfg: VIPSceneCfg[VIPSceneEnum.DueDiligence],
      className: currentIndex === 0 ? 'sel' : '',
      id: 'tab1',
    },
  ]

  return (
    <>
      <ProductIntro />
      {/* 轮播卡片 */}
      {isActivityUser ? (
        <div className="product-intro-map">
          <Card
            className="product-intro-card"
            // @ts-expect-error onClick is not a valid prop for Card
            onClick={() => {
              ref.current.container.className = 'product-intro-card'
              setTimeout(() => {
                ref.current.container.className = 'product-intro-card animation'
              }, 100)
              setIsVipSelected((i) => !i)
            }}
          >
            <div className={isVipSelected ? 'intro-header svip-header' : 'intro-header vip-header'}>
              {isVipSelected ? intl('312735', 'SVIP版') : intl('312734', 'VIP版')}
            </div>
            <div className="intro-main">
              <div className="product-intro-li-price">
                <span className="price">￥{isVipSelected ? 1980 : 398}</span>

                <span> / {intl('31342', '年')}</span>
              </div>
              <div className="product-intro-li-txt">
                {isVipSelected ? intl('394298', '特邀客户额外获赠3个月SVIP会员') : ''}
              </div>
              {isVipUser ? null : (
                <div className="product-intro-li-btn">
                  <Button className="btn" onClick={VipPopup} data-uc-id="FYO4_yEa2-F" data-uc-ct="button">
                    {intl('97182', '立即购买')}
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <Card className={'product-intro-card animation'} ref={ref}>
            <div className={isVipSelected ? 'intro-header vip-header' : 'intro-header svip-header'}>
              {isVipSelected ? intl('312734', 'VIP版') : intl('312735', 'SVIP版')}
            </div>
            <div className="intro-main">
              <div className="product-intro-li-price">
                <span className="price">￥{isVipSelected ? 398 : 1980}</span>

                <span> / {intl('31342', '年')}</span>
              </div>
              <div className="product-intro-li-txt">
                {isVipSelected ? '' : intl('394298', '特邀客户额外获赠3个月SVIP会员')}
              </div>
              {isVipUser ? null : (
                <div className="product-intro-li-btn">
                  <Button className="btn" onClick={VipPopup} data-uc-id="ePRe2zq_u3L" data-uc-ct="button">
                    {intl('97182', '立即购买')}
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <MarketingCard />
        </div>
      ) : (
        <div className="product-intro-map">
          <Card
            className="product-intro-card"
            // @ts-expect-error onClick is not a valid prop for Card
            onClick={() => {
              pointBuriedByModule(922602101081, { packageName: isVipSelected ? 'SVIP' : 'VIP' })
              ref.current.container.className = 'product-intro-card'
              setTimeout(() => {
                ref.current.container.className = 'product-intro-card animation'
              }, 100)
              setIsVipSelected((i) => !i)
            }}
          >
            <div className={isVipSelected ? 'intro-header svip-header' : 'intro-header vip-header'}>
              {isVipSelected ? intl('312735', 'SVIP版') : intl('312734', 'VIP版')}
            </div>
            <div className="intro-main">
              <div className="product-intro-li-price">
                <span className="price">￥{isVipSelected ? 1980 : 398}</span>

                <span> / {intl('31342', '年')}</span>
              </div>
              <div className="product-intro-li-txt">
                {isVipSelected ? intl('358016', '每天低至5.4元') : intl('358015', '每天低至1.1元')}
              </div>
              {isVipUser ? null : (
                <div className="product-intro-li-btn">
                  <Button className="btn" onClick={VipPopup} data-uc-id="B1kdxjyiVR-" data-uc-ct="button">
                    {intl('97182', '立即购买')}
                  </Button>
                </div>
              )}
            </div>
          </Card>
          <Card className={'product-intro-card animation'} ref={ref}>
            <div className={isVipSelected ? 'intro-header vip-header' : 'intro-header svip-header'}>
              {isVipSelected ? intl('312734', 'VIP版') : intl('312735', 'SVIP版')}
            </div>
            <div className="intro-main">
              <div className="product-intro-li-price">
                <span className="price">￥{isVipSelected ? 398 : 1980}</span>

                <span> / {intl('31342', '年')}</span>
              </div>
              <div className="product-intro-li-txt">
                {isVipSelected ? intl('358015', '每天低至1.1元') : intl('358016', '每天低至5.4元')}
              </div>
              {isVipUser ? null : (
                <div className="product-intro-li-btn">
                  <Button className="btn" onClick={VipPopup} data-uc-id="bIYks6vvy16" data-uc-ct="button">
                    {intl('97182', '立即购买')}
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <MarketingCard />
        </div>
      )}
      <VersionPriceMenuLeft
        className={'left-menu'}
        menuArr={VIPMenuArr}
        onMenuClick={(_i, index) => {
          setCurrentIndex(index)
          let elements = document.querySelectorAll('.tit-price')
          elements[index]?.scrollIntoView({
            block: 'center',
          })
        }}
        currentIndex={currentIndex}
        data-uc-id="hNAK_sfxHHL"
        data-uc-ct="versionpricemenuleft"
      />
      {/* 功能说明 */}
      <div className={isVipSelected ? 'main-price main-price-vip' : 'main-price main-price-svip'}>
        <table className="price-table price-table-header">
          <tbody>
            <tr>
              <td style={{ paddingLeft: 48, borderRadius: '10px 0 0 0' }}>{intl('103722', '功能说明')}</td>
              {/* @ts-expect-error langkey is not a valid prop for td */}
              <td width="240" align="center" langkey="208371">
                免费版
              </td>
              <td width="240" align="center">
                <img className="vip-title-desc" src={window.en_access_config ? vipEnImg : vipImg} />
                <br />

                {isSticky && !isVipUser ? (
                  <div
                    className="price-intro-buy"
                    // @ts-expect-error langkey is not a valid prop for div
                    langkey="97182"
                    onClick={VipPopup}
                    data-uc-id="S3CH1M98rzb"
                    data-uc-ct="div"
                  >
                    {intl('97182', '立即购买')}
                  </div>
                ) : (
                  <span className="price-intro">
                    <i>
                      {/* @ts-expect-error langkey is not a valid prop for span */}
                      398 <span langkey="23334">{intl('23334', '元')} </span>
                    </i>
                    {/* @ts-expect-error langkey is not a valid prop for span */}/{' '}
                    <span langkey="31342">{intl('31342', '年')}</span>
                  </span>
                )}
              </td>
              <td width="240" align="center" style={{ borderRadius: '0 10px 0 0' }}>
                <img className="svip-title-desc" src={svipImg} />
                <br />
                {isSticky && !isVipUser ? (
                  <div
                    className="price-intro-buy price-intro-buy-svip"
                    // @ts-expect-error langkey is not a valid prop for div
                    langkey="97182"
                    onClick={VipPopup}
                    data-uc-id="55T1K7R4mCf"
                    data-uc-ct="div"
                  >
                    {intl('97182', '立即购买')}
                  </div>
                ) : isActivityUser ? (
                  <span className="price-intro">
                    <i>
                      {/* @ts-expect-error langkey is not a valid prop for span */}
                      1,980 <span langkey="23334">{intl('23334', '元')} </span>
                    </i>
                    {/* @ts-expect-error langkey is not a valid prop for span */}/{' '}
                    <span langkey="31342">{intl('31342', '年') + intl('394299', '+3个月')}</span>
                  </span>
                ) : (
                  <span className="price-intro">
                    <i>
                      {/* @ts-expect-error langkey is not a valid prop for span */}
                      1,980 <span langkey="23334">{intl('23334', '元')} </span>
                    </i>
                    {/* @ts-expect-error langkey is not a valid prop for span */}/{' '}
                    <span langkey="31342">{intl('31342', '年')}</span>
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {ScentTableCfgArr.map((tableCfg) => (
          <VersionPriceSceneTable
            sceneContentCfg={tableCfg.sceneContentCfg}
            sceneTitleCfg={tableCfg.sceneTitleCfg}
            className={tableCfg.className}
            id={tableCfg.id}
            data-uc-id="pEz3yuLQLUd"
            data-uc-ct="versionpricescenetable"
          />
        ))}
      </div>
      <VersionPriceFooter />
    </>
  )
}
