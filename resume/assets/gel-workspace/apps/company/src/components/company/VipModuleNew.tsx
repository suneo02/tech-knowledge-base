import { connect } from 'react-redux'

import * as HomeActions from '../../actions/home'
import {
  createCrmOrder,
  createPayOrderByClient,
  getPayGoods,
  getPayOrderByClient,
  getUserAgreements,
  setUserAgreements,
} from '../../api/homeApi'
import global from '../../lib/global'
import intl from '../../utils/intl'
import { wftCommon } from '../../utils/utils'

import { Button, Checkbox, Col, message, Modal, Row, Tag } from '@wind/wind-ui'
import React, { useEffect, useRef, useState } from 'react'
import * as globalActions from '../../actions/global'
import store from '../../store/store'
import { useUserInfoStore } from '../../store/userInfo'
import './vipModuleNew.less'

import { getVipInfo } from '@/lib/utils'
import { getWsid } from '@/utils/env'
import { localStorageManager, sessionStorageManager } from '@/utils/storage'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import LimitedtimeOffer from '../../assets/vip/limitedtimeOffer.png'
import { InvoiceSample, PrivacyPolicyBtn, UserAgreementBtn } from '../pay/tip'
import { VipForbidden } from '../user/vip/forbidden'

// 需要替换成下载的二维码

export const VipModule = ({ title = intl('149697', '全球企业库'), onlySvip = false, description, ...props }) => {
  const [agreeUserPrivacy, setAgreeUserPrivacy] = useState(false) // 同意用户协议
  const [vipPopupSel, setVipPopupSel] = useState(props?.vipPopupSel || 'vip') // 设置默认选中vip
  const userVipInfo = getVipInfo()
  const [showModal, setShowModal] = useState(false) // 是否展示规则说明

  const { isActivityUser, setIsActivityUser } = useUserInfoStore()

  let interCount = 0

  const usedInClient = wftCommon.usedInClient()
  let windSessionid = getWsid()

  useEffect(() => {
    if (onlySvip) {
      setVipPopupSel('svip')
    }
    return () => {
      console.log('清空定时器', inter.current)
      inter && inter.current && window.clearInterval(inter.current)
    }
  }, [onlySvip])

  const inter = useRef(null)

  const payCall = (orderId) => {
    interCount++
    console.log('🚀 ~ payCall ~ orderId interCount:', orderId, interCount)
    if (interCount > 240) {
      // 循环等待 10+ 分钟
      if (interCount == 241) {
        message.info('支付等待超时，将为您重新刷新页面...')
        inter && inter.current && window.clearInterval(inter.current)
        store.dispatch(globalActions.setGolbalVipModal({ show: false }))
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
      return
    }
    getPayOrderByClient({ orderId: orderId }).then(
      (res) => {
        if (res.ErrorCode == global.SUCCESS) {
          if (res.Data && res.Data.paid) {
            message.info('支付成功, 正在为您重新加载页面')
            try {
              inter && inter.current && window.clearInterval(inter.current)
            } catch (e) {}
            window.location.reload()
          }
        } else {
          inter && inter.current && window.clearInterval(inter.current)
          console.log('支付异常!(-2)')
        }
      },
      function () {
        console.log('支付失败!(500)')
        inter && inter.current && window.clearInterval(inter.current)
      }
    )
  }

  const createPayOrderHandler = (productName) => {
    // 终端内 更新本地local
    if (usedInClient) {
      // 终端内 更新本地local
      localStorageManager.remove('globaluserinfo4gel')
      localStorageManager.remove('globaluserpackage4gel')
    }
    if (!agreeUserPrivacy) {
      return
    }
    inter && inter.current && window.clearInterval(inter.current)

    let goodsId = ''
    console.log('🚀 ~ createPayOrderHandler ~ wftCommon.listPayGoods:', wftCommon.listPayGoods)
    if (wftCommon.listPayGoods) {
      if (!productName) {
        goodsId = wftCommon.listPayGoods['vip'] ? wftCommon.listPayGoods['vip'].goodsId : ''
      } else {
        goodsId = wftCommon.listPayGoods[productName] ? wftCommon.listPayGoods[productName].goodsId : ''
      }
    }
    if (!goodsId) {
      message.info('未获取到可购买的商品/权限信息，请稍后重试', 3)
      getPayGoods().then((res) => {
        res && res.Data && store.dispatch(HomeActions.getPayGoods({ ...res }))
        res && res.Data && wftCommon.payGoodsSet(res.Data)
      })
      return
    }
    let param: any = { goodsId, count: 1 }
    if (isActivityUser) {
      param.activityId = 1
    }
    createPayOrderByClient(param).then((res) => {
      if (res.ErrorCode == '200012') {
        message.info('权限正在开通中，请稍后刷新页面查看，请勿重复购买', 3)
        return
      }
      if (res.ErrorCode == global.SUCCESS) {
        if (res.Data.pcUrl) {
          // 独立web要在url后加sessionid
          let url = usedInClient
            ? res.Data?.pcUrl
            : `${res.Data?.pcUrl?.replace('#/', '')}&wind.sessionid=${windSessionid}`
          res.Data.pcUrl && window.open(url)
          inter.current = window.setInterval(function () {
            payCall(res.Data.orderId)
          }, 3000)
          message.info('权限正在开通中，请稍后刷新页面查看', 600)
        } else {
          message.info('创建订单异常，请稍候重试')
        }
      } else {
        message.info('创建订单失败，请稍候重试' + res.ErrorCode)
      }
    })
  }

  const agreeBuyAction = () => {
    pointBuriedByModule(922602101082)
    // 立即开通 创建微信支付订单
    if (!agreeUserPrivacy) {
      message.info('请阅读并同意用户协议')
      return
    }

    if (vipPopupSel == 'ep') {
      createCrmOrder({ product: 'svip' })
      message.info('专属客户经理已收到开通需求，将在一个工作日内同您联系')
      return
    }

    if (vipPopupSel !== 'ep') {
      createPayOrderHandler(vipPopupSel)
    }
  }

  const onChangeUserAgree = () => {
    setAgreeUserPrivacy(!agreeUserPrivacy)
    const userAgreementsConfig = sessionStorageManager.get('WFT-GEL-USERAGREEMENTS') // 服务端记录是否曾今同意了用户协议
    if (!userAgreementsConfig) {
      getUserAgreements((res) => {
        if (res && res.Data) {
          if (res.Data.agreed) {
            sessionStorageManager.set('WFT-GEL-USERAGREEMENTS', '1')
          } else {
            sessionStorageManager.set('WFT-GEL-USERAGREEMENTS', '1')
            setUserAgreements()
          }
        }
      })
    }
  }

  // 1. 海外用户并且非 svip 展示尽请期待
  // 2. 未知产品 展示尽请期待
  if (
    wftCommon.forbiddenTerminalSales.indexOf(wftCommon.terminalType) > -1 ||
    (wftCommon.is_overseas_config && !userVipInfo.isSvip)
  ) {
    // 禁止用户
    return <VipForbidden title={title} description={description} />
  }

  const ActivityTag = isActivityUser ? (
    <div
      className="activity-tag"
      style={{
        position: 'absolute',
      }}
    >
      {/* @ts-expect-error wind ui */}
      <Tag
        color="color-1"
        type="secondary"
        style={{
          borderTopLeftRadius: '4px',
        }}
      >
        {intl('394293', '买一年送3个月')}
      </Tag>
    </div>
  ) : (
    <></>
  )
  return (
    <div className="gel-vip-module-new">
      {wftCommon.isDevDebugger() && (
        <Button
          style={{
            position: 'absolute',
            zIndex: 10,
          }}
          onClick={() => {
            setIsActivityUser(!isActivityUser)
          }}
        >
          切换活动用户（开发站）:{isActivityUser ? '活动用户' : '非活动用户'}
        </Button>
      )}

      <Row gutter={12} className="gel-vip-header">
        <Col className="gel-vip-title">{title}</Col>
        <Col className="gel-vip-tips">
          {description?.length > 0 ? description : intl('353695', '购买企业库高级权限即可使用付费功能')}
        </Col>
        <Col className="gel-vip-tips-third">{intl('437745', '该数据由第三方提供')}</Col>
      </Row>

      <div className="gel-vip-content">
        {onlySvip ? (
          <>
            <Row gutter={12}>
              <Col
                span={12}
                // @ts-expect-error wind ui
                onClick={() => {
                  pointBuriedByModule(922602101081, { packageName: 'SVIP' })
                  inter && inter.current && window.clearInterval(inter.current)
                  setVipPopupSel('svip')
                }}
              >
                <div className={`gel-vipR-prices-item ${vipPopupSel == 'svip' ? 'gel-vipR-prices-sel' : ''}`}>
                  {ActivityTag}
                  <div className="type">SVIP</div>
                  <div className="price">
                    <b>￥1980</b>
                    <span>/{intl('353694', '1年')}</span>
                  </div>
                </div>
              </Col>
              <Col
                span={12}
                // @ts-expect-error wind ui
                onClick={() => {
                  pointBuriedByModule(922602101081, { packageName: 'EP' })
                  inter && inter.current && window.clearInterval(inter.current)
                  setVipPopupSel('ep')
                }}
              >
                <div className={`gel-vipR-prices-item ${vipPopupSel == 'ep' ? 'gel-vipR-prices-sel' : ''} `}>
                  <div className="type">{intl('208372', '企业套餐')}</div>
                  <div className="contact">
                    <span>
                      {intl('234937', '联系客户经理')}
                      {window.en_access_config ? 'Get Price' : '获取套餐价格'}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        ) : (
          <Row gutter={12}>
            <Col
              span={8}
              // @ts-expect-error wind ui
              onClick={() => {
                pointBuriedByModule(922602101081, { packageName: 'VIP' })
                inter && inter.current && window.clearInterval(inter.current)
                setVipPopupSel('vip')
              }}
            >
              <div className={`gel-vipR-prices-item ${vipPopupSel == 'vip' ? 'gel-vipR-prices-sel' : ''}`}>
                <div className="type">VIP</div>
                <div className="price">
                  <b>￥398</b>
                  <span>/{intl('353694', '1年')}</span>
                </div>
              </div>
            </Col>

            <Col
              span={8}
              // @ts-expect-error wind ui
              onClick={() => {
                pointBuriedByModule(922602101081, { packageName: 'SVIP' })
                inter && inter.current && window.clearInterval(inter.current)
                setVipPopupSel('svip')
              }}
            >
              <div className={`gel-vipR-prices-item ${vipPopupSel == 'svip' ? 'gel-vipR-prices-sel' : ''}`}>
                {ActivityTag}
                <div className="type">SVIP</div>
                <div className="price">
                  <b>￥1980</b>
                  <span>/{intl('353694', '1年')}</span>
                </div>
              </div>
            </Col>
            <Col
              span={8}
              // @ts-expect-error wind ui
              onClick={() => {
                pointBuriedByModule(922602101081, { packageName: 'EP' })
                inter && inter.current && window.clearInterval(inter.current)
                setVipPopupSel('ep')
              }}
            >
              <div className={`gel-vipR-prices-item ${vipPopupSel == 'ep' ? 'gel-vipR-prices-sel' : ''} `}>
                <div className="type">{intl('208372', '企业套餐')}</div>
                <div className="contact">
                  <span>
                    {intl('234937', '联系客户经理')}
                    {window.en_access_config ? 'Get Price' : '获取套餐价格'}
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        )}

        <Row
          className="gel-vipR-more"
          // @ts-expect-error wind ui
          onClick={() => {
            wftCommon.jumpJqueryPage('Company.html#/versionPrice?nosearch=1')
          }}
        >
          <Col>{intl('353715', '查看全部权限和价格')}</Col>
        </Row>
        {isActivityUser && (
          <div className="activity-box">
            <img className="limitedtimeOffer" src={LimitedtimeOffer} alt="" />
            &nbsp;&nbsp;
            <span>
              2024/11/1-2024/11/30{intl('394295', '期间，购买1年SVIP即可获赠3个月同档位权益，详情可查看')}
              <Button
                type="link"
                onClick={() => {
                  setShowModal(true)
                }}
                style={{
                  padding: 0,
                }}
              >
                {intl('394313', '规则说明')}
              </Button>
            </span>
          </div>
        )}

        <Row gutter={12} className="gel-vipR-content gel-vipR-content-hide">
          <Col>
            <div
              className="gel-vipR-content-btn"
              onClick={() => {
                agreeBuyAction()
              }}
            >
              {' '}
              {vipPopupSel == 'ep' ? intl('149772', '立即联系') : intl('392560', '立即支付')}
            </div>
          </Col>
          <Col>
            <Checkbox
              checked={agreeUserPrivacy}
              onChange={() => {
                onChangeUserAgree()
              }}
            ></Checkbox>
            {intl('150315', '我已阅读并同意')} <UserAgreementBtn /> {intl('437761', '和')} <PrivacyPolicyBtn />
          </Col>

          <Col style={{ color: '#999', textAlign: 'left' }}>
            <div className="gel-vipR-tk">
              <a> * {intl('392561', '万得企业库会员服务自完成支付起生效，权限开通需要一定时间，支持开具发票')} </a>
              <InvoiceSample />
            </div>
            <div>* {intl('392563', '万得企业库会员服务一经开通后不可退款。')}</div>
          </Col>
        </Row>
      </div>

      {/* @ts-expect-error wind ui */}
      <Modal
        visible={showModal}
        onCancel={() => {
          setShowModal(false)
        }}
        title={intl('394313', '规则说明')}
        footer={[
          <Button
            type="primary"
            size="large"
            onClick={() => {
              setShowModal(false)
            }}
          >
            {intl('209713', '我知道了')}
          </Button>,
        ]}
      >
        <p>
          （1）
          {window.en_access_config
            ? 'Exclusive for invited users, valid 2024-11-1 to 2024-11-30'
            : '本活动仅限特邀用户参与，本活动周期为2024年11月1日至11月30日。'}
        </p>
        <p>
          （2）
          {intl(
            '394314',
            '本活动赠送规则：特邀用户通过活动页面在线支付开通SVIP会员一年，即可额外获赠3个月SVIP会员权益，如支付失败则不会赠送。赠送的会员权益即时生效并开始计算服务期限。'
          )}
        </p>
        <p>
          （3）
          {intl(
            '394315',
            '请您阅读并同意：当您参与活动并支付SVIP会员服务费用之前，须认可该项服务标明之价格，确认接受相关的服务条款及支付条款，严格按照支付流程操作，并在支付时注意及确保支付环境安全，否则应自行承担全部不利后果。万得企业库SVIP会员的服务价格以万得企业库网站及相关软件产品中标注的详细资费标价为准，万得企业库对会员的服务有修改价格、升级服务、增减服务内容等权利。SVIP会员的增值服务标准以万得企业库标注的详细资费标价为准。您可以通过登录万得企业库用户中心查询您的账号信息详情。'
          )}
        </p>
        <p>
          （4）{intl('394297', '万得对本次活动拥有最终解释权。如有任何疑问，请联系万得客服，联系方式为')}
          <a href="mailto://GELSUPPORT@wind.com.cn">GELSupport@wind.com.cn</a>。
        </p>
      </Modal>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    home: state.home,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPayGoods: () => {
      getPayGoods().then((res) => {
        console.log(res)
        res && res.Data && dispatch(HomeActions.getPayGoods({ ...res }))
      })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VipModule)
