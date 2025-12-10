import { t } from '@/utils/intl'

export const createHomeBg = () => {
  const $container = $('<div>').addClass('bg')
  $container.append($('<div>').text(t('common.bigDataAnalyticsPlatform')))
  return $container
}
