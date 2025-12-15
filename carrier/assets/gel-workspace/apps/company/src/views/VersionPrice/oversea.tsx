import React from 'react'
import { wftCommon } from '../../utils/utils'

import { Button } from '@wind/wind-ui'
import { VersionPriceMenuLeft } from './comp/MenuLeft'
import {
  VIPEnterpriseOverviewCfg,
  VIPInsightBusinessCfg,
  VIPMenuArr,
  VIPOverseaEnterpriseFeatureCfg,
  VIPOverseaSpecialDataCfg,
  VIPSceneCfg,
  VIPSceneEnum,
} from './config'
import { useVersionPriceCommonHook } from './handle'

import SvipOversea from '../../assets/vip/SvipOversea.png'
import SvipOverseaEn from '../../assets/vip/SvipOverseaEn.png'
import { VersionPriceFooter, VersionPriceSceneTable } from './comp'
import { VIPOverseaDueDiligenceCfg } from './config/DueDiligence'
import { usePageTitle } from '../../handle/siteTitle'
import { isEn } from 'gel-util/intl'

export const VersionPriceOversea = () => {
  usePageTitle('VIPServices')
  const {
    isVipUser,
    setIsVipUser,
    isVipSelected,
    setIsVipSelected,
    currentIndex,
    setCurrentIndex,
    isSticky,
    setIsSticky,
    domIsInViewPort,
    translateIntl,
  } = useVersionPriceCommonHook()

  const ScentTableCfgArr = [
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
      sceneContentCfg: VIPOverseaEnterpriseFeatureCfg,
      sceneTitleCfg: VIPSceneCfg[VIPSceneEnum.EnterpriseFeature],
      className: currentIndex === 0 ? 'sel' : '',
      id: 'tab1',
    },
    {
      sceneContentCfg: VIPOverseaSpecialDataCfg,
      sceneTitleCfg: VIPSceneCfg[VIPSceneEnum.SpecialData],
      className: currentIndex === 0 ? 'sel' : '',
      id: 'tab1',
    },
    {
      sceneContentCfg: VIPOverseaDueDiligenceCfg,
      sceneTitleCfg: VIPSceneCfg[VIPSceneEnum.DueDiligence],
      className: currentIndex === 0 ? 'sel' : '',
      id: 'tab1',
    },
  ]
  return (
    <>
      {wftCommon.isDevDebugger() ? (
        <Button
          style={{
            top: '72px',
            position: 'fixed',
          }}
          onClick={() => setIsVipUser((i) => !i)}
          data-uc-id="EnLdOZQeW20"
          data-uc-ct="button"
        >
          切换vip(开发环境测试使用，上线时去掉)
        </Button>
      ) : null}
      <VersionPriceMenuLeft
        className={'left-menu'}
        menuArr={VIPMenuArr}
        onMenuClick={(i, index) => {
          setCurrentIndex(index)
          let elements = document.querySelectorAll('.tit-price')
          elements[index]?.scrollIntoView({
            block: 'center',
          })
        }}
        currentIndex={currentIndex}
        data-uc-id="sDaRo0SZbPa"
        data-uc-ct="versionpricemenuleft"
      />
      <div className={isVipSelected ? 'main-price main-price-vip' : 'main-price main-price-svip'}>
        <table className="price-table price-table-header">
          <tbody>
            <tr>
              {/* @ts-expect-error langkey is not a valid prop for td */}
              <td langkey="103722" style={{ 'padding-left': '48px', 'border-radius': '10px 0 0 0' }}>
                功能说明
              </td>
              {/* @ts-expect-error langkey is not a valid prop for td */}
              <td width="240" align="center" langkey="208371">
                免费版
              </td>
              {/* @ts-expect-error langkey is not a valid prop for td */}
              <td width="240" align="center" style={{ 'border-radius': '0 10px 0 0' }}>
                <img className="svip-title-desc" src={isEn() ? SvipOverseaEn : SvipOversea} />
                <br />
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
            ifHideVip={true}
            data-uc-id="Vt1UEIfE8gs"
            data-uc-ct="versionpricescenetable"
          />
        ))}
      </div>
      <VersionPriceFooter />
    </>
  )
}
