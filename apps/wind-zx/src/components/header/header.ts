import { logoOfficial, logoWind } from '@/assets/images'
import { createLanguageSwitcher, t } from '@/utils/intl'
import { getLoginLink, getVipServiceLink } from '@/utils/link'
import './header.less'
import { createHeaderMenuArchor } from './menu'

export const createHeaderComponent = () => {
  const $container = $('<div>').addClass('header-menus general-padding')

  const $logoItem = $('<div>').addClass('logo-item').attr('id', 'red-rect')
  const $logoCombo = $('<div>').addClass('logo-combo')
  $logoCombo
    .append($('<img>').addClass('logo-img').attr('src', logoWind).attr('alt', 'Wind'))
    .append($('<span>').addClass('logo-text').text(t('common.windCreditService')))
    .append($('<img>').addClass('logo-img').attr('src', logoOfficial).attr('alt', 'Official'))
  $logoItem.append($logoCombo)

  const $menuContainer = $('<div>').attr('id', 'home-header-menu')

  // 添加菜单项
  $menuContainer.append(
    createHeaderMenuArchor({
      dataId: 'gel',
      href: './index.html',
      text: t('common.globalEnterpriseLibrary'),
      target: '_self',
    })
  )
  $menuContainer.append(
    createHeaderMenuArchor({ dataId: 'risk', href: './risk.html', text: t('common.windRisk'), target: '_self' })
  )
  $menuContainer.append(
    createHeaderMenuArchor({
      dataId: 'other',
      href: './other.html',
      text: t('common.unveilingCredit'),
      target: '_self',
    })
  )
  $menuContainer.append(
    createHeaderMenuArchor({ dataId: 'contact', href: './contact.html', text: t('common.aboutUs'), target: '_self' })
  )
  $menuContainer.append(
    createHeaderMenuArchor({
      href: getVipServiceLink(),
      text: t('common.vipService'),
      target: '_blank',
    })
  )
  $menuContainer.append(
    createHeaderMenuArchor({
      href: getLoginLink(),
      id: 'header-login',
      text: t('common.login'),
      target: '_blank',
    })
  )
  $menuContainer.append(createLanguageSwitcher())

  $container.append($logoItem).append($menuContainer)

  return $container
}
