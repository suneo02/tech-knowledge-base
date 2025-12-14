import { Button, message } from '@wind/wind-ui'
import React, { FC, lazy, Suspense } from 'react'
import * as globalActions from '../actions/global'
import { applytrailsvip } from '../api/homeApi'
import { clearAndLogout } from '../lib/utils'
import store from '../store/store'
import intl from '../utils/intl'
import { wftCommon } from '../utils/utils'
import global from './global'
// 需要替换成下载的二维码
import { InfoCircleButton } from '@/components/icons/InfoCircle'
import { ModalSafeType } from '@/components/modal/ModalSafeType.tsx'

// 懒加载 VipModule 组件 - 优化弹窗加载性能
// 只有在用户触发VIP弹窗时才会动态加载该组件
const VipModule = lazy(() => import('../components/company/VipModule'))

// 基础toast
export const toast = (msg) => {
  if (!window.toastEl) {
    window.toastEl = document.createElement('div')
    window.toastEl.classList.add('toast')
    document.body.appendChild(window.toastEl)
  }
  window.toastEl.innerText = msg
  window.toastEl.classList.add('show')
  setTimeout(() => {
    window.toastEl.classList.remove('show')
  }, 1500)
}

// 试用vip提示
export const tryVip = (content) => {
  store.dispatch(
    globalActions.setGolbalModal({
      className: 'VipModal',
      width: 560,
      visible: true,
      onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
      title: intl(237485, '温馨提示'),
      content: <p className="content">{content}</p>,
      footer: [
        <Button
          // @ts-expect-error ttt
          type="grey"
          onClick={() => store.dispatch(globalActions.clearGolbalModal())}
          data-uc-id="aHX58HhsS"
          data-uc-ct="button"
        >
          残忍放弃
        </Button>,
        <Button type="primary" onClick={() => applyTrail()} data-uc-id="n1m6KD_Pro" data-uc-ct="button">
          立即试用
        </Button>,
      ],
    })
  )
}

// 购买vip提示
export const buyVip = () => {}

// vip超限提示
export const overVip = (content, className) => {
  store.dispatch(
    globalActions.setGolbalModal({
      className: className || 'VipModal',
      width: 560,
      visible: true,
      onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
      title: intl(237485, '温馨提示'),
      content: <p className="content">{content}</p>,
      footer: [
        <Button
          // @ts-expect-error wind ui
          type="grey"
          onClick={() => store.dispatch(globalActions.clearGolbalModal())}
          data-uc-id="dkK8Wv0tuu"
          data-uc-ct="button"
        >
          {intl('209713', '我知道了')}
        </Button>,
      ],
    })
  )
}

// 用户协议更新提示
export const updateAlert = () => {
  store.dispatch(
    globalActions.setGolbalModal({
      className: 'VipModal',
      width: 560,
      visible: true,
      onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
      title: '条款变更提示',
      content: (
        <div className="content">
          <p style={{ marginBottom: 20 }}>
            <span>
              为了给您提供更好的产品与服务，并让您清楚地了解我们是如何处理和保护您的个人信息安全，我们更新了用户服务协议及隐私政策的部分条款。
            </span>
          </p>
          <p>
            点击“同意”即表示您已阅读并同意
            <a href="/superlist/useragreement.html" target="_blank" data-uc-id="V0VIo0lJYb" data-uc-ct="a">
              {intl(248084, '用户服务协议')}
            </a>
            <span>{intl(257661, '及')}</span>
            <a href="/superlist/privacypolicy.html" target="_blank" data-uc-id="J2n7RK5jGH" data-uc-ct="a">
              {intl(242146, '隐私政策')}
            </a>
            <span>的全部条款，可以继续使用我们的产品和服务。</span>
          </p>
        </div>
      ),
      footer: [
        <Button
          // @ts-expect-error ttt
          type="grey"
          onClick={() => {
            store.dispatch(globalActions.clearGolbalModal())
            clearAndLogout()
          }}
          data-uc-id="72aSLrxyUb"
          data-uc-ct="button"
        >
          不同意并退出
        </Button>,
        <Button
          //   onClick={() => agree().then(res => {
          //     if (res.code === global.SUCCESS) {
          //       window.location.reload();
          //     }
          //   })}
          type="primary"
          data-uc-id="LFgvYK7gxk"
          data-uc-ct="button"
        >
          同 意
        </Button>,
      ],
    })
  )
}

// 试用
export const applyTrail = () => {
  applytrailsvip({}).then(
    (res) => {
      if (res.Data && res.Data.retCode == 0) {
        message.info('正在为您开通企业库SVIP试用...')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else if (res.Data && res.Data.retCode == 1) {
        message.info('很抱歉，您已经开通试用，无法再次开通！')
      } else if (res.Data && res.Data.retCode == 2) {
        message.info('很抱歉，该账号不支持在当前终端环境下开通试用！')
      } else {
        message.info(`开通失败，请稍后重试!(${res.Data.retCode})`)
      }
    },
    function () {
      message.info('申请试用异常，请稍后重试!(500)')
    }
  )
}

// 海外不允许使用弹窗，支持提交申请
export const overseaTipsSimple = (closable = false) => {
  store.dispatch(
    globalActions.setGolbalModal({
      type: 'simple',
      className: 'oversea-tips-simple',
      width: 560,
      visible: true,
      onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
      maskClosable: closable,
      closable: closable,
      content: (
        <>
          <span className="oversea-tips-simple-icon">
            <InfoCircleButton />
          </span>
          <div className="oversea-tips-simple-content">
            <p style={{ margin: '20px 0' }}>
              根据相关法律法规，您所在的地区暂不支持访问这些数据。如有疑问，请联系官方客服或您的专属客户经理。
            </p>
            <p>
              According to relevant laws and regulations, this access is not available in your area. If you have any
              questions, please contact the official customer service or your account manager.
            </p>
            <table style={{ marginTop: '20px' }}>
              <tr>
                <td style={{ width: '80px' }}>TEL:</td>
                <td>400-820-9463</td>
              </tr>
              <tr>
                <td>E-mail: </td>
                <td>
                  <a
                    href="mailto:GelSupport@wind.com.cn?subject=中国大陆以外地区访问商业数据咨询"
                    data-uc-id="2hMjllIgx_"
                    data-uc-ct="a"
                  >
                    GELSupport@wind.com.cn
                  </a>
                </td>
              </tr>
            </table>
          </div>
        </>
      ),
      // 如果不在终端中，那么显示 footer，允许关闭页面
      // 终端中不能展示，因为会关闭整个f9页面
      footer: [
        <Button
          type="primary"
          onClick={() => {
            try {
              store.dispatch(globalActions.clearGolbalModal())
            } catch (e) {
              console.error(e)
            }
          }}
          data-uc-id="SKfi9tFHjl"
          data-uc-ct="button"
        >
          OK
        </Button>,
      ],
    })
  )
}

export const MessagePopup = (msg, onJump, onClose?) => {
  const ele = document.createElement('div')
  ele.innerHTML = `<span class="wind-gel-exp-link wind-gel-exp-link-nounderline">${msg}</span>${onClose ? '<span class="wind-gel-exp-close">x</span>' : ''}`
  ele.className = 'wind-gel-exp-user'
  document.body.appendChild(ele)
  document.body.classList.add('wind-global-exp')

  window.document.querySelector('.wind-gel-exp-link') &&
    window.document.querySelector('.wind-gel-exp-link').addEventListener('click', (e) => {
      e.stopPropagation()
      onJump()
    })

  window.document.querySelector('.wind-gel-exp-close') &&
    window.document.querySelector('.wind-gel-exp-close').addEventListener('click', () => {
      window.document.querySelector('.wind-global-exp') &&
        window.document.querySelector('.wind-global-exp').classList.remove('wind-global-exp')
      return
    })
}

/**
 * vip付费弹框 - 懒加载优化版本
 * @author bcheng<bcheng@wind.com.cn>
 * 只有在show为true时才会动态加载VipModule组件，优化首屏加载性能
 */
export const VipPopupModal: FC<{
  show?: boolean
  disabled?: boolean
  title?: string
  onlySvip?: boolean
  description?: string
}> = ({ show = false, disabled, title, onlySvip, description }) => {
  // 只有在需要显示时才渲染模态框
  if (!show) {
    return null
  }

  let overseaModalCss = ''
  if (wftCommon.is_overseas_config) {
    // 海外无权用户
    overseaModalCss = 'gel-vip-model-oversea'
  }

  return (
    <ModalSafeType
      className={`gel-vip-model ${overseaModalCss} `}
      type="large"
      visible={show}
      forceRender={true}
      okText="确定"
      cancelText="取消"
      closable={!disabled}
      onCancel={() => {
        store.dispatch(globalActions.setGolbalVipModal({ show: false }))
      }}
      footer={null}
      width={wftCommon.is_overseas_config ? 760 : 858}
      title={wftCommon.is_overseas_config ? '申请购买【全球企业库】' : null}
      maskClosable={wftCommon.is_overseas_config ? false : true}
      data-uc-id="e-oZHex8ON"
      data-uc-ct="modalsafetype"
    >
      <Suspense fallback={<div></div>}>
        <VipModule
          title={title}
          onlySvip={onlySvip}
          description={description}
          data-uc-id="tqAsI8ymHs"
          data-uc-ct="vipmodule"
        />
      </Suspense>
    </ModalSafeType>
  )
}

export const VipPopup = (data?) => {
  const modelInstanceNum = global.VIP_MODEL_COUNT++
  store.dispatch(globalActions.setGolbalVipModal({ ...data, show: true, modelInstanceNum }))
}
