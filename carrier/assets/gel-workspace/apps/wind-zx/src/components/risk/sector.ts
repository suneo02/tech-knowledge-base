import { getLocale, t } from '@/utils/intl'

export const RiskSector = () => {
  return `
<div class="sector">
              <div class="fontA">${t('risk.title')}</div>
              <div class="fontB" style="margin-top: 8px">${t('risk.description')}</div>
              <div class="fontC ${getLocale()}">
                ${t('risk.content')}
              </div>
            </div>
            </div>
  `
}
