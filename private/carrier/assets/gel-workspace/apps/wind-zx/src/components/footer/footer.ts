import { t } from '@/utils/intl'
import {
  reportDemo11,
  reportDemo12,
  reportDemo21,
  reportDemo22,
  reportDemo31,
  reportDemo32,
  reportDemo41,
} from '../../assets/static'
import './footer.less'

export const createFooterComponent = () => `
<div class="foot">
  <div class="foot-content general-padding">
    <div class="foot-left">
      <div class="foot-left-top">
        <div class="foot-row">
          <div class="w-100">
            <span>${t('footer.dataSource')}</span>
          </div>
          <div class="w-200 foot-col">
            <a href="https://shiming.gsxt.gov.cn" target="_blank">${t('footer.nationalEnterpriseCreditInformationPublicPlatform')}</a>
            <a href="https://www.cnipa.gov.cn" target="_blank">${t('footer.nationalIntellectualPropertyOffice')}</a>
            <a href="http://cx.cnca.cn" target="_blank">${t('footer.certificationAndAcceptanceInformationPublicPlatform')}</a>
          </div>
          <div class="w-200 foot-col">
            <a href="http://zxgk.court.gov.cn" target="_blank">${t('footer.chinaExecutionInformationPublicNetwork')}</a>
            <a href="https://sbj.cnipa.gov.cn/sbj/index.html" target="_blank">${t('footer.trademarkOffice')}</a>
          </div>
          <div class="w-200 foot-col">
            <a href="https://wenshu.court.gov.cn" target="_blank">${t('footer.chinaJudicialWenshuNetwork')}</a>
            <a href="https://www.ncac.gov.cn" target="_blank">${t('footer.copyrightOffice')}</a>
          </div>
          <div class="w-200 foot-col">
            <a href="https://cfws.samr.gov.cn" target="_blank">${t('footer.chinaMarketRegulationAdministrationPunishmentDocumentNetwork')}</a>
            <a href="https://std.samr.gov.cn" target="_blank">${t('footer.nationalStandardInformationPublicPlatform')}</a>
          </div>
        </div>
        <div class="foot-row">
          <div class="w-100">
            <span>${t('footer.friendLink')}</span>
          </div>
          <div class="w-200 foot-col">
            <a href="http://www.wind.com.cn" target="_blank">${t('footer.windInformationNetwork')}</a>
          </div>
        </div>

        <div class="foot-row report-demo">
          <div class="w-100">
            <span>${t('footer.reportDemo')}</span>
          </div>
          <div class="w-200 foot-col">
            <span data-url="${reportDemo11}" title="样例-企业深度信用报告.pdf"> ${t('footer.creditReport')} </span>
            <span data-url="${reportDemo12}" title="样例-投资穿透报告Excel版.xlsx"> ${t('footer.investmentPenetrationReport')} </span>
          </div>
          <div class="w-200 foot-col">
            <span data-url="${reportDemo21}" title="样例-尽职调查报告-高级版.pdf"> ${t('footer.dueDiligenceReport')} </span>
            <span data-url="${reportDemo22}" title="样例-关联方认定报告.xlsx"> ${t('footer.associatedPartyIdentificationReport')} </span>
          </div>
          <div class="w-200 foot-col">
            <span data-url="${reportDemo31}" title="样例-股权穿透报告-6层.xlsx"> ${t('footer.equityPenetrationReport')} </span>
            <span data-url="${reportDemo32}" title="样例-企业科创能力报告.pdf"> ${t('footer.enterpriseScientificAndTechnologicalInnovationReport')} </span>
          </div>
          <div class="w-200 foot-col">
            <span data-url="${reportDemo41}" title="样例-股权穿透分析报告.pdf"> ${t('footer.equityPenetrationAnalysisReport')} </span>
          </div>
        </div>
      </div>
      <div class="foot-left-bottom">
        <div class="foot-row">
          <span class="mr-40">${t('footer.copyright')}</span>
          <a class="mr-8" href="https://beian.miit.gov.cn/#/Integrated/recordQuery" target="_blank"
            >${t('footer.ICP')}</a
          >
        </div>
        <div class="foot-row">
          <span class="mr-40">${t('footer.badInformationReportPhone')}:021-20518200</span>
          <span>${t('footer.badInformationReportEmail')}:<a href="mailto:jubao@wind.com.cn">jubao@wind.com.cn</a></span>
        </div>
      </div>
    </div>
    <div class="foot-vertical-line"></div>
    <div class="foot-right">
      <div class="foot-right-header"><span>${t('footer.contactUs')}:</span></div>
      <div class="foot-contact-grid">
        <div class="foot-contact-item">
          <span class="foot-contact-label">${t('footer.serviceEmail')}:</span>
          <span class="foot-contact-value"><a href="mailto:GELSUPPORT@wind.com.cn">GELSUPPORT@wind.com.cn</a></span>
        </div>
        <div class="foot-contact-item">
          <span class="foot-contact-label">${t('footer.officialPhone')}:</span>
          <span class="foot-contact-value">400-820-9463</span>
        </div>
        <div class="foot-contact-item">
          <span class="foot-contact-label">${t('footer.workTime')}:</span>
          <span class="foot-contact-value">${t('footer.workday')} 9:00-18:00</span>
        </div>
        <div class="foot-contact-item">
          <span class="foot-contact-label">${t('footer.companyAddress')}:</span>
          <span class="foot-contact-value">${t('footer.shanghaiPudongNewAreaAddress')}</span>
        </div>
      </div>
      <div class="foot-links">
        <a href="javascript:void(0)" id="privacy-policy-link">${t('footer.privacyPolicy')}</a>
        <a href="./contact.html?content=apply">${t('footer.disputeApplication')}</a>
        <a href="./contact.html?content=agreement">${t('footer.userAgreement')}</a>
      </div>
    </div>
  </div>
</div>
`
