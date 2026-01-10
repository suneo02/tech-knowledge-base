/**
 * VipModuleNew 企业库会员购买模块组件
 *
 * 功能概述：
 * - 展示VIP、SVIP和企业套餐三种会员类型的购买选项
 * - 处理用户选择套餐、同意协议、创建订单和支付流程
 * - 支持活动期间特殊优惠（如买一年送3个月）
 * - 针对海外用户和特定终端类型进行限制
 *
 * @see 设计文档: ../docs/auth/membership-permissions-interaction.md
 */
import * as HomeActions from '../../actions/home'
import {
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
import { isEn } from 'gel-util/intl'
import { ReactNode, useEffect, useRef, useState } from 'react'
import * as globalActions from '../../actions/global'
import { pointBuriedByModule } from '../../api/pointBuried/bury'
import store from '../../store/store'
import { useUserInfoStore } from '../../store/userInfo'
import { VipForbidden } from '../user/vip/forbidden'
import './vipModuleNew.less'

import { applyForTrialAndShowToast } from '@/api/baifen/service'
import { getVipInfo } from '@/lib/utils'
import { getWsid, isDev } from '@/utils/env'
import { localStorageManager, sessionStorageManager } from '@/utils/storage'
import LimitedtimeOffer from '../../assets/vip/limitedtimeOffer.png'
import { InvoiceSample, PrivacyPolicyBtn, UserAgreementBtn } from '../pay/tip'
import { VipMarketingEdition } from '../user/vip/VipMarketingEdition'
import { EpOnlyGroup, MoreInfoLink } from '../user/vip/VipModuleComponents'

// 需要替换成下载的二维码

/**
 * VipPurchase 组件传参说明
 *
 * 用于控制会员购买模块的展示形态与默认选项，支持仅展示特定套餐、覆盖标题与说明等。
 *
 * 属性列表：
 * - title?: ReactNode
 *   模块标题；默认展示为国际化“全球企业库”。可传入任意 React 节点以自定义标题。
 *
 * - onlySvip?: boolean
 *   仅展示 SVIP 套餐卡片。当为 true 时：
 *   1) 初始选中套餐强制设为 'svip'（见 useEffect）；
 *   2) 仅渲染 SvipOnlyGroup，隐藏其他套餐卡片。
 *
 * - onlyEp?: boolean
 *   仅展示营销版（企业版）卡片。当为 true 时仅渲染 EpOnlyGroup。
 *
 * - description?: string
 *   标题右侧的提示文案；为空或未传时显示默认文案“购买企业库高级权限即可使用付费功能”。
 *
 * - vipPopupSel?: 'vip' | 'svip' | 'ep'
 *   初始默认选中的套餐类型。若未传，默认选中 'vip'。该值会影响：
 *   1) 套餐卡片的选中样式和状态；
 *   2) 底部操作区（ActionFooter）的行为；
 *   3) 营销版（ep）时的“立即联系”分支逻辑。
 *
 */
interface VipPurchaseProps {
  title?: ReactNode
  onlySvip?: boolean
  onlyEp?: boolean
  description?: string
  vipPopupSel?: 'vip' | 'svip' | 'ep'
}

export const VipPurchase = ({
  title = intl('149697', '全球企业库'),
  onlySvip = false,
  onlyEp = false,
  description,
  vipPopupSel: vipPopupSelProp,
}: VipPurchaseProps) => {
  /** 用户协议是否勾选（购买前置条件） */
  const [agreeUserPrivacy, setAgreeUserPrivacy] = useState(false)
  /** 当前选中的套餐类型（影响 UI 与购买/联系行为） */
  const [vipPopupSel, setVipPopupSel] = useState<'vip' | 'svip' | 'ep'>(vipPopupSelProp || 'vip')
  const userVipInfo = getVipInfo()
  /** 活动规则说明弹窗显隐 */
  const [showModal, setShowModal] = useState(false)

  const { isActivityUser, setIsActivityUser } = useUserInfoStore()

  /** 支付轮询计数（用于超时处理与防抖） */
  let interCount = 0

  const usedInClient = wftCommon.usedInClient()
  let windSessionid = getWsid()

  /**
   * 初始化行为：当仅展示 SVIP 时，强制设置默认选中为 'svip'。
   * 同时组件卸载时清理可能存在的支付轮询定时器。
   */
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

  /**
   * 支付状态轮询
   * - 每 3s 查询一次订单状态（见 createPayOrderHandler 中 setInterval）
   * - 成功：提示并刷新页面
   * - 失败或异常：停止轮询
   * - 超时：提示并关闭弹窗，随后刷新页面
   */
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

  /**
   * 创建支付订单
   * - 清理本地登录缓存（终端内）确保后续权限刷新
   * - 校验是否已同意用户协议
   * - 获取商品 goodsId（从 wftCommon.listPayGoods）
   * - 调用创建订单接口并打开支付链接（独立 Web 需拼接 sessionid）
   * - 开启支付状态轮询
   */
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

  /**
   * 用户购买入口
   * - 前置：必须勾选用户协议
   * - 分支：'ep'（营销版）调用联系客户经理接口，其余套餐走下单支付流程
   */
  const agreeBuyAction = () => {
    pointBuriedByModule(922602101082)
    // 立即开通 创建微信支付订单
    if (!agreeUserPrivacy) {
      message.info('请阅读并同意用户协议')
      return
    }

    if (vipPopupSel == 'ep') {
      applyForTrialAndShowToast().then(undefined, () => {
        message.info('提交失败，请稍后重试')
      })
      return
    }

    createPayOrderHandler(vipPopupSel)
  }

  /**
   * 用户协议勾选
   * - 切换本地勾选状态
   * - 服务端确认用户是否已同意过（会话存储标记），如未同意则调用设置接口
   */
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

  // 用户权限检查：
  // 1. 终端类型在禁止销售列表中
  // 2. 海外用户且非 SVIP
  if (
    wftCommon.forbiddenTerminalSales.indexOf(wftCommon.terminalType) > -1 ||
    (wftCommon.is_overseas_config && !userVipInfo.isSvip)
  ) {
    // 禁止用户
    return <VipForbidden title={title} data-uc-id="7aPMIJI-0l" data-uc-ct="vipforbidden" />
  }

  /**
   * 套餐切换：更新选中值并清理支付轮询
   */
  const handleSelect = (type: 'vip' | 'svip' | 'ep') => {
    pointBuriedByModule(922602101081, { packageName: type.toUpperCase() })
    inter && inter.current && window.clearInterval(inter.current)
    setVipPopupSel(type)
  }

  const ActivityTag = isActivityUser ? (
    <div
      className="activity-tag"
      style={{
        position: 'absolute',
      }}
    >
      <Tag
        color="color-1"
        type="primary"
        style={{
          borderTopLeftRadius: '4px',
        }}
        data-uc-id="F_whPtO5nr"
        data-uc-ct="tag"
      >
        {intl('394293', '买一年送3个月')}
      </Tag>
    </div>
  ) : (
    <></>
  )
  return (
    <div className="gel-vip-module-new">
      {isDev && (
        <Button
          style={{
            position: 'absolute',
            zIndex: 10,
          }}
          onClick={() => {
            setIsActivityUser(!isActivityUser)
          }}
          data-uc-id="aNHXHsrjj"
          data-uc-ct="button"
        >
          切换活动用户（开发站）:{isActivityUser ? '活动用户' : '非活动用户'}
        </Button>
      )}
      <Row gutter={12} className="gel-vip-header">
        <Col className="gel-vip-title">{title}</Col>
        <Col className="gel-vip-tips">
          {description?.length > 0 ? description : intl('353695', '购买企业库高级权限即可使用付费功能')}
        </Col>
      </Row>
      <div className="gel-vip-content">
        {onlySvip ? (
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
            <Col span={12}>
              <VipMarketingEdition selected={vipPopupSel === 'ep'} onClick={() => handleSelect('ep')} />
            </Col>
          </Row>
        ) : onlyEp ? (
          <EpOnlyGroup vipPopupSel={vipPopupSel} onSelect={handleSelect} />
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
            <Col span={8}>
              <VipMarketingEdition selected={vipPopupSel === 'ep'} onClick={() => handleSelect('ep')} />
            </Col>
          </Row>
        )}

        <MoreInfoLink vipPopupSel={vipPopupSel} />
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
                data-uc-id="7xAQgbwYFS"
                data-uc-ct="button"
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
              data-uc-id="1aXnnvLc1g"
              data-uc-ct="div"
            >
              {' '}
              {vipPopupSel == 'ep' ? intl('353722', '立即联系') : intl('392560', '立即支付')}
            </div>
          </Col>
          <Col>
            <Checkbox
              checked={agreeUserPrivacy}
              onChange={() => {
                onChangeUserAgree()
              }}
              data-uc-id="LdPxbqg6IB"
              data-uc-ct="checkbox"
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
            data-uc-id="f8V9wAiiBI"
            data-uc-ct="button"
          >
            {intl('209713', '我知道了')}
          </Button>,
        ]}
        data-uc-id="2hNH4NP39F"
        data-uc-ct="modal"
      >
        <p>
          （1）
          {isEn()
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
          <a href="mailto://GELSUPPORT@wind.com.cn" data-uc-id="kdJEDgqD0V" data-uc-ct="a">
            GELSupport@wind.com.cn
          </a>
          。
        </p>
      </Modal>
    </div>
  )
}

export { VipPurchase as VipModule }
