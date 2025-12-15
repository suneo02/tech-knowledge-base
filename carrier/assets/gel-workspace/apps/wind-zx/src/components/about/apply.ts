import {
  objectionApplicationLegalEntity,
  objectionApplicationNaturalPerson,
  powerOfAttorneyLegalEntities,
} from '@/assets/static'
import { t } from '@/utils/intl'
import './apply.less'
/**
 * 异议申请及处理组件
 * @returns {string} 组件 HTML 内容
 */
export function applyComponent() {
  return `
<div class="apply-content">
  <h1>${t('apply.apply-title')}</h1>
  <h3>${t('apply.apply-channel-title')}</h3>
  <p>${t('apply.apply-channel-1-title')}</p>
  <p>${t('apply.apply-channel-1-content')}<a href="mailto:GELSUPPORT@wind.com.cn">GELSUPPORT@wind.com.cn</a></p>
  <p>${t('apply.apply-channel-2-title')}</p>
  <p>${t('apply.apply-channel-2-content')}<a href="https://www.windzx.com">https://www.windzx.com</a></p>
  <p>${t('apply.apply-channel-2-content-2')}<a href="mailto:GELSUPPORT@wind.com.cn">GELSUPPORT@wind.com.cn</a></p>
  
  <h3>${t('apply.apply-material-title')}</h3>

  <p>
    ${t('apply.apply-material-intro')}
  </p>
  <p>
    ${t('apply.apply-material-content-prefix')}<a href="mailto:GELSUPPORT@wind.com.cn">GELSUPPORT@wind.com.cn</a
    >${t('apply.apply-material-content-suffix')}
  </p>
  <br />

  <p>${t('apply.apply-material-legal-entity-title')}</p>
  <p>1. ${t('apply.apply-material-1')}</p>
  <p>2. ${t('apply.apply-material-2')}</p>
  <p>3. ${t('apply.apply-material-3')}</p>
  <p>4. ${t('apply.apply-material-4')}</p>
  <br />
  <p>${t('apply.apply-material-legal-entity-entrust-title')}</p>
  <p>1. ${t('apply.apply-material-1')}</p>
  <p>2. ${t('apply.apply-material-2')}</p>
  <p>3. ${t('apply.apply-material-6')}</p>
  <p>4. ${t('apply.apply-material-7')}</p>
  <p>5. ${t('apply.apply-material-4')}</p>
  <br />
  <p>${t('apply.apply-material-natural-person-title')}</p>
  <p>1. ${t('apply.apply-material-8')}</p>
  <p>2. ${t('apply.apply-material-9')}</p>
  <p>3. ${t('apply.apply-material-4')}</p>
  <br />
  <p>${t('apply.apply-material-template-download')}</p>
  <p>
    <a
      class="w-link w-link-underline apply-docx-link"
      download="${t('apply.apply-material-template-download-legal-entity')}.docx"
      href="${objectionApplicationLegalEntity}"
      type="text"
      >${t('apply.apply-material-template-download-legal-entity')}</a
    >
  </p>
  <p>
    <a
      class="w-link w-link-underline apply-docx-link"
      download="${t('apply.apply-material-template-download-legal-entity-entrust')}.docx"
      href="${powerOfAttorneyLegalEntities}"
      type="text"
      >${t('apply.apply-material-template-download-legal-entity-entrust')}</a
    >
  </p>
  <p>
    <a
      class="w-link w-link-underline apply-docx-link"
      download="${t('apply.apply-material-template-download-natural-person')}.docx"
      href="${objectionApplicationNaturalPerson}"
      type="text"
      >${t('apply.apply-material-template-download-natural-person')}</a
    >
  </p>
  <h3>${t('apply.apply-process-title')}</h3>
  <p>1. ${t('apply.apply-process-1')}</p>
  <p>2. ${t('apply.apply-process-2')}</p>
  <p>3. ${t('apply.apply-process-3')}</p>
  <p>4. ${t('apply.apply-process-4')}</p>
  <p>5. ${t('apply.apply-process-5')}</p>
  <p>6. ${t('apply.apply-process-6')}</p>
</div>
  `
}
