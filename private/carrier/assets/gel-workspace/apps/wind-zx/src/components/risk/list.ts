import { t } from '@/utils/intl'

export const RiskList = () => {
  return `
    <div class="list">
              <div class="fontD">${t('risk.helpTitle')}</div>
              <div class="fontE">
                <ul>
                  <li>${t('risk.helpContent')}</li>
                  <li>${t('risk.helpContent2')}</li>
                  <li>
                    ${t('risk.helpContent3')}
                  </li>
                  <li>${t('risk.helpContent4')}</li>
                  <li>${t('risk.helpContent5')}</li>
                  <li>${t('risk.helpContent6')}</li>
                  <li>${t('risk.helpContent7')}</li>
                </ul>
              </div>
            </div>
  `
}
