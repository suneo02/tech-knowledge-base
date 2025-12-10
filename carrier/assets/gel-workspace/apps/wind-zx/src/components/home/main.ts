import { getLocale, t } from '@/utils/intl'

export const createHomeMain = () => {
  return `
   <div class="main-text">
          <div class="sector">
            <div class="title">${t('common.globalEnterpriseLibrary')}</div>
            <div class="fontE ${getLocale()}">
              ${t('common.globalEnterpriseLibraryDesc')}
            </div>
          </div>

          <div class="left-sector">
            <div class="section">
              <div class="title">${t('common.inDepthInformation')}</div>
              <div class="fontC">
                ${t('common.inDepthInformationDesc')}
              </div>
            </div>
            <div class="In-depth_Information img"></div>
          </div>

          <div class="right-sector">
            <div class="Equity_Penetration img"></div>
            <div class="section">
              <div class="title">${t('common.shareholdingPenetration')}</div>
              <div class="fontC">
                ${t('common.shareholdingPenetrationDesc')}
              </div>
            </div>
          </div>

          <div class="left-sector">
            <div class="section">
              <div class="title">${t('common.associatedRelationship')}</div>
              <div class="fontC">
                ${t('common.associatedRelationshipDesc')}
              </div>
            </div>
            <div class="Associated_Relationship img"></div>
          </div>

          <div class="right-sector">
            <div class="Financing img"></div>
            <div class="section">
              <div class="title">${t('common.financingAndCreditExposure')}</div>
              <div class="fontC">
                ${t('common.financingAndCreditExposureDesc')}
              </div>
            </div>
          </div>

          <div class="left-sector">
            <div class="section">
              <div class="title">${t('common.companyGroup')}</div>
              <div class="fontC">${t('common.companyGroupDesc')}</div>
            </div>
            <div class="Group img"></div>
          </div>

          <div class="right-sector">
            <div class="Report img"></div>
            <div class="section">
              <div class="title">${t('common.creditReport')}</div>
              <div class="fontC">
                ${t('common.creditReportDesc')}
              </div>
            </div>
          </div>

          <div class="left-sector">
            <div class="section">
              <div class="title">${t('common.discoverEmergingCompanies')}</div>
              <div class="fontC">
                ${t('common.discoverEmergingCompaniesDesc')}
              </div>
            </div>
            <div class="New_Enterprise img"></div>
          </div>

          <div class="right-sector">
            <div class="Enterprise_Lists_and_Directories img"></div>
            <div class="section">
              <div class="title">${t('common.enterpriseListsAndDirectories')}</div>
              <div class="fontC">${t('common.enterpriseListsAndDirectoriesDesc')}</div>
            </div>
          </div>

          <div class="left-sector">
            <div class="section">
              <div class="title">${t('common.windMap')}</div>
              <div class="fontC">
                ${t('common.windMapDesc')}
              </div>
            </div>
            <div class="Wind_Map img"></div>
          </div>

          <div class="right-sector">
            <div class="Newsletters img"></div>
            <div class="section">
              <div class="title">${t('common.companyMovements')}</div>
              <div class="fontC">${t('common.companyMovementsDesc')}</div>
            </div>
          </div>

          <div class="left-sector">
            <div class="section">
              <div class="title">${t('common.bidding')}</div>
              <div class="fontC">
                ${t('common.biddingDesc')}
              </div>
            </div>
            <div class="Bid img"></div>
          </div>
        </div>`
}
