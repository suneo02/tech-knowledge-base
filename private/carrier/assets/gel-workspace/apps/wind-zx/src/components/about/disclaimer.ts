import { t } from '@/utils/intl'

/**
 * 免责声明组件
 * @returns {string} 组件 HTML 内容
 */
export function disclaimerComponent() {
  return `
<div class="customer-title">${t('discilaimer.title')}</div>
<div class="user-note-page">
  <h1>${t('discilaimer.title-sub')}</h1>
  <p>
    ${t('discilaimer.content-prefix')}<a href="mailto:GELSUPPORT@wind.com.cn">GELSUPPORT@wind.com.cn</a
    >${t('discilaimer.content-suffix')}
  </p>
</div>
  `
}
