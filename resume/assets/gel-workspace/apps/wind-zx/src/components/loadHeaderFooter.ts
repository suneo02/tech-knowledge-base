import { getPrivacyAggrement } from '../utils/misc'
import { createFooterComponent } from './footer/footer'
import { createHeaderComponent } from './header/header'

// 给所有具有 类名的 div 元素添加点击事件监听器
function initHeaderMenuClick() {
  $('#home-header-menu >*').on('click', function () {
    var id = $(this).attr('data-id')

    if (!id) {
      return
    }

    $(this).addClass('active')

    // 移除其他具有 active 类名的兄弟元素上的 active 类
    $(this).siblings('.active').removeClass('active')
  })
}

function initActiveMenuItem() {
  // 获取当前页面的 URL 路径
  var path = window.location.pathname

  // 根据不同的 HTML 文件名设置相应菜单项为选中状态
  if (path.includes('risk.html')) {
    $('[data-id=risk]').addClass('active')
  } else if (path.includes('index.html')) {
    $('[data-id=gel]').addClass('active')
  } else if (path.includes('other.html')) {
    $('[data-id=other]').addClass('active')
  } else if (path.includes('contact.html')) {
    $('[data-id=contact]').addClass('active')
  }
}

function onLoadHeaderSuccess() {
  initHeaderMenuClick()
  initActiveMenuItem()
  $('#red-rect').hover(
    function () {
      $('.tips-container').show()
    },
    function () {
      $('.tips-container').hide()
    }
  )

  // @ts-expect-error
  if (window.external && window.external.ClientFunc) {
    // 在wft内打开，不走web登录
    $('#header-login').on('click', function (e) {
      if ($('.header-login-msg').length) return
      var msg = `<div class="header-login-msg">您已登录，将自动跳转至企业库首页..</div>`
      $('body').append(msg)
      setTimeout(function () {
        window.open('https://wx.wind.com.cn/Wind.WFC.Enterprise.Web/PC.Front/Company/SearchHome.html')
        $('.header-login-msg').remove()
      }, 1000)
      e.stopPropagation()
      e.preventDefault()
    })
  }
}

function onLoadFooterSuccess() {
  var reportDemoClickLock = 0
  $('.report-demo .foot-col span').on('click', function (e) {
    var currentTime = Date.now()
    if (currentTime - reportDemoClickLock < 600) return
    reportDemoClickLock = currentTime
    var target = $(e.target)
    var url = $(target).attr('data-url')
    if (url) {
      var file = $(target).attr('title')
      var link = document.createElement('a')
      link.href = url
      link.download = file
      link.click()
      link.remove()
    }
  })

  // 初始化隐私政策链接
  $('#privacy-policy-link').on('click', function (e) {
    e.preventDefault()
    // 检查 getPrivacyAggrement 函数是否已加载
    if (typeof getPrivacyAggrement === 'function') {
      const privacyUrl = getPrivacyAggrement()
      window.open(privacyUrl, '_blank')
    } else {
      console.error('getPrivacyAggrement function not found')
    }
  })
}

export function loadHeaderFooter() {
  $('#header-placeholder').append(createHeaderComponent())
  $('#footer-placeholder').append(createFooterComponent())
  onLoadHeaderSuccess()
  onLoadFooterSuccess()
}
