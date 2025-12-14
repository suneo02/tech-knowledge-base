import { AliceBitmapAnimation } from '@wind/alice-bitmap-animation'
import { Button } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import React, { FC, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { pointBuriedGel } from '../../api/configApi'
import closeImg from '../../assets/imgs/closeIcon.png'
import f5_header_animation_1 from '../../assets/imgs/f5_header_animation_1.png'
import svipex from '../../assets/imgs/svip-ex.png'
import { VipPopup } from '../../lib/globalModal'
import { getVipInfo } from '../../lib/utils'
import { useConditionFilterStore } from '../../store/cde/useConditionFilterStore'
import { MyIcon } from '../Icon'
import FilterBox from './comps/FilterBox'
import { generateUrlByModule, LinkModule } from 'gel-util/link'
import { isDeveloper } from '@/utils/common'

const RestructFilter: FC<{
  fromModal?: boolean
  onClose?: () => void
  width?: string
  isShow?: boolean
  onSearch?: () => void
  currentDefault?: number
  changeSubscribeVisible?: () => void
  inModal?: boolean // 是否在弹窗中
}> = ({
  fromModal = false,
  onClose = () => null,
  width = '100%',
  isShow = false, // 是否一直展示
  onSearch,
  currentDefault = 0, // 查找
  changeSubscribeVisible = () => null,
  inModal = false,
}) => {
  // 获取筛选项配置
  const { filters, geoFilters, resetFilters, getFiltersVipCount } = useConditionFilterStore()
  const speakSearchRef = useRef()

  const [current, setCurrent] = useState(currentDefault)
  useEffect(() => {
    if (currentDefault !== undefined) {
      setCurrent(currentDefault)
    }
  }, [currentDefault])
  const history = useHistory()

  const cannotSubmit = getFiltersVipCount() > 0 && !getVipInfo().isSvip

  const submit = () => {
    if (current === -1) {
      // @ts-expect-error ttt
      speakSearchRef.current.setWords(speakSearchRef.current.state.inputValue, 'search')
      return
    }
    if (onSearch) {
      // 判断是否传进来查找方法
      onSearch()
      onClose()
      return
    }
    pointBuriedGel('922602100837', '数据浏览器', 'cdeFirstSearch', { filters: JSON.stringify(filters) })
    history.push('filterRes', {
      specialSQL: '',
      searchType: '',
      filters,
      geoFilter: geoFilters,
    })
  }

  const reset = () => {
    resetFilters()
    // @ts-expect-error ttt
    setCurrent(new Number(current))
  }

  const showSubscribe = () => {
    changeSubscribeVisible()
  }

  const shop = () => {
    // buyVip("您可以通过以下方式联系客户经理开通VIP服务，解锁30余项VIP权益！", i18n.t);
    VipPopup({ onlySvip: true })
  }
  return (
    <Box width={width} fromModal={fromModal}>
      <Head>
        <h1 className="h1"> {t('259750', '企业数据浏览器')} </h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              const url = generateUrlByModule({ module: LinkModule.SUPER })
              window.open(url, '_blank')
            }}
            data-uc-id="yk7sOuRDBTi"
            data-uc-ct="div"
          >
            <AliceBitmapAnimation
              imageSrc={f5_header_animation_1}
              frameWidth={94}
              frameHeight={36}
              fps={10}
              reactNode={
                <div className="animation-content-div" style={{ paddingLeft: '10px' }}>
                  <span>{t('464234', '一句话找企业')}</span>
                </div>
              }
            ></AliceBitmapAnimation>
          </div>
          {isDeveloper ? (
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => history.push('/queryEnterpriseInOneSentence')}
              data-uc-id="yk7sOuRDBTi"
              data-uc-ct="div"
            >
              <AliceBitmapAnimation
                imageSrc={f5_header_animation_1}
                frameWidth={94}
                frameHeight={36}
                fps={10}
                reactNode={
                  <div className="animation-content-div" style={{ paddingLeft: '10px' }}>
                    <span>{t('455036', '一句话查企业')}</span>
                  </div>
                }
              ></AliceBitmapAnimation>
            </div>
          ) : null}
          <span className="tips">{t('355864', '仅限中国大陆企业筛选')}</span>
          {!isShow && <img src={closeImg} onClick={onClose} data-uc-id="xZNMMRR6N5R" data-uc-ct="img" />}
        </div>
      </Head>
      <FilterBox currentChange={setCurrent} leftCurrent={current} fromModal={fromModal} inModal={inModal} />
      <Bottom>
        <div className="filter-occupy"></div>
        <div className="filter-button-box">
          <div className="flex a-c">
            {cannotSubmit && (
              <p className="vipAlert">
                {window.en_access_config ? 'Only For Svip' : '您已选中高级筛选项，仅限SVIP使用'}
                <a onClick={shop} data-uc-id="ckiJsFMGHGH" data-uc-ct="a">
                  {' '}
                  {window.en_access_config ? t('204669', '立即开通') : '点击开通'}
                  <MyIcon name="ToRight_small_Pri" />
                </a>
              </p>
            )}
          </div>

          <div className="button-box">
            <Button
              // @ts-expect-error ttt
              type="default"
              disabled={filters.length === 0 && geoFilters.length === 0 ? true : false}
              onClick={reset}
              data-uc-id="FgCj--8vuFi"
              data-uc-ct="button"
            >
              {' '}
              {t('138490', '重置条件')}
            </Button>

            {!fromModal ? (
              <Button
                // @ts-expect-error ttt
                type="default"
                disabled={filters.length === 0 && geoFilters.length === 0 ? true : false}
                onClick={showSubscribe}
                data-uc-id="_NfvNvgXzzE"
                data-uc-ct="button"
              >
                {' '}
                {t('261051', '保存条件')}
              </Button>
            ) : null}

            <Button
              type="primary"
              disabled={
                cannotSubmit || (filters.length === 0 && geoFilters.length === 0 && current >= 0) ? true : false
              }
              onClick={submit}
              data-uc-id="du43wJjU7ND"
              data-uc-ct="button"
            >
              {' '}
              {t('138500', '立即搜索')}{' '}
            </Button>
          </div>
        </div>
      </Bottom>
    </Box>
  )
}

const Box = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  background-color: #fff;
  width: ${(props) => props.width};
  height: ${(props) => (props.fromModal ? 'auto' : 'calc(100% - 4px)')};
`

const Head = styled.div`
  padding: 0 20px;
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e3e3e3;

  h1 {
    font-size: 16px;
    font-weight: bold;
    color: #000;
    margin: 0;
    position: relative;
    min-width: 40%;
  }
  .h1:after {
    content: '';
    background: url(${svipex}) no-repeat;
    width: 94px;
    height: 20px;
    position: absolute;
    background-size: 100%;
    margin-top: 5px;
  }
  .tips {
    margin-left: 10px;
    color: #999;
    font-size: 12px;
  }

  img {
    width: 16px;
    cursor: pointer;
  }
`

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  .filter-occupy {
    width: 160px;
    height: 53px;
    background-color: #f2f2f2;
  }
  .filter-button-box {
    border-top: 1px solid #eee;
    display: flex;
    flex: 1;
    justify-content: space-between;
    .button-box {
      display: flex;
      align-items: center;

      button {
        margin: 0 10px;
        min-width: 88px;

        &.ant-btn-default {
          border: 1px solid #e3e3e3;
          border-radius: 2px;
          color: #666;
        }
      }
    }
  }

  .vipAlert {
    line-height: 32px;
    padding-left: 16px;
    font-size: 12px;
    color: #fc5252;
    display: flex;
    align-items: center;
    a {
      margin-left: 10px;
      color: #00aec7;
      text-decoration: underline;

      .myIcon {
        margin-left: 3px;
        font-size: 14px;
        min-width: 14px;
      }

      &:hover {
        color: #3dc1d4;
      }
    }
  }
`

export default RestructFilter
