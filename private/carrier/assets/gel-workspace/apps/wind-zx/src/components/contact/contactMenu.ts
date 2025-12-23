import { applyComponent, contactComponent, disclaimerComponent, getAgreementComponent } from '@/components'
import { t } from '@/utils/intl'
import { getPrivacyAggrement } from '@/utils/misc'
import $ from 'jquery'

// 定义映射表
const getContactContentMap = () => ({
  contact: contactComponent,
  apply: applyComponent,
  agreement: getAgreementComponent(),
  disclaimer: disclaimerComponent,
})

export const createContactMenu = () => {
  return `
       <div class="contact-container" data-contact-menu="../resource/js/component/contactMenu.html" id="container">
            <div class="about-side-menu" id="about-side-menu">
              <a data-content="contact">${t('common.contactUs')}</a>
              <a data-content="apply">${t('common.disputeApplication')}</a>
              <a data-content="agreement">${t('common.userAgreement')}</a>
              <a data-content="privacyPolicy">${t('common.privacyPolicy')}</a>
              <a data-content="disclaimer">${t('common.disclaimer')}</a>
            </div>
            <div class="content contact-content"></div>
          </div>
  `
}

function activateMenuItem(key: string) {
  try {
    // 如果是 privacyPolicy，先将第一个菜单项设为 active，然后跳转到目标 URL
    if (key === 'privacyPolicy') {
      // 获取第一个菜单项并设置为 active
      const firstMenuItem = $('#about-side-menu > *').first()
      firstMenuItem.addClass('active')
      firstMenuItem.siblings('.active').removeClass('active')

      // 更新 URL 参数为第一个菜单的 content 值
      const firstMenuContentKey = firstMenuItem.data('content') || 'contact'
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.set('content', firstMenuContentKey)
      window.history.pushState({}, '', newUrl)

      // 跳转到隐私政策页面
      // 检查 getPrivacyAggrement 函数是否已加载
      if (typeof getPrivacyAggrement === 'function') {
        const privacyUrl = getPrivacyAggrement()
        window.open(privacyUrl, '_blank')
      } else {
        console.error('getPrivacyAggrement function not found')
      }
      return
    }

    const menuItem = $(`#about-side-menu > *[data-content="${key}"]`)

    // 如果找不到对应 key 的菜单项，则直接退出函数
    if (!menuItem.length) {
      console.error(`No menu item found for key: ${key}`)
      return
    }

    // 更新 active 状态
    menuItem.addClass('active')
    menuItem.siblings('.active').removeClass('active')

    const contactContentMap = getContactContentMap()

    const content = contactContentMap[key as keyof typeof contactContentMap]
    if (!content) {
      console.error(`No valid Content specified in the data-content attribute.`)
      return
    }

    // 加载内容
    $('.content').html(content)

    // 更新 URL，但不刷新页面
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('content', key)
    window.history.pushState({}, '', newUrl)
  } catch (e) {
    console.error(e)
  }
}

function initActiveContactMenuItem() {
  const params = new URLSearchParams(window.location.search)
  const contentQuery = params.get('content')
  const contentDefault = 'contact'

  const contentKey = contentQuery || contentDefault
  activateMenuItem(contentKey)
}

function initMenuHandlers() {
  // 为所有菜单项添加点击事件处理
  $('#about-side-menu a').on('click', function (e) {
    e.preventDefault() // 阻止默认的链接跳转行为
    const contentKey = $(this).data('content')
    activateMenuItem(contentKey)
  })

  // 处理浏览器前进/后退按钮
  window.addEventListener('popstate', function () {
    initActiveContactMenuItem()
  })
}

function init() {
  initActiveContactMenuItem()
  initMenuHandlers()
}

// 修改初始化方式，确保在 jQuery 加载完成后执行
export function ensureInitContactMenu() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    // 即使 DOM 加载完成，也等待一个微任务周期
    Promise.resolve().then(init)
  }
}
