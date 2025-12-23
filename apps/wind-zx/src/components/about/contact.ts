import { t } from '@/utils/intl'
import './contact.less'

/**
 * 联系我们组件
 * @returns {string} 组件 HTML 内容
 */
export function contactComponent() {
  return `
<div class="source contact-source"><span>${t('common.companyAddress')}:</span><span>${t('common.shanghaiPudongNewAreaAddress')}</span></div>
<div class="source contact-source"><span>${t('common.officialPhone')}:</span><span>400-820-9463</span></div>
<div class="source contact-source">
  <span>${t('common.serviceEmail')}:</span><span><a href="mailto:GELSUPPORT@wind.com.cn">GELSUPPORT@wind.com.cn</a></span>
</div>
<div class="source contact-source">
  <span>${t('common.reportEmail')}:</span><span><a href="mailto:jubao@wind.com.cn">jubao@wind.com.cn</a></span>
</div>
<div class="source contact-source"><span>${t('common.postalCode')}:</span><span>200127</span></div>
  `
}
