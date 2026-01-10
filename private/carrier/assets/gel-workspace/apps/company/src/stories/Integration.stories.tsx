import type { Meta, StoryObj } from '@storybook/react'
import React, { useLayoutEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import { MemoryRouter } from 'react-router-dom'
import AppIntlProvider from '../components/AppIntlProvider'
import { routes } from '../config/routes'
import store from '../store/store'
// 样式懒加载 (注释后会有影响，目前看主搜索页的国家地区筛选会异常)
import '@wind/wind-ui/dist/wind-ui.min.css'
import 'ai-ui/dist/index.css'
import 'gel-ui/dist/index.css'
import '../index.less'
import '../styles/helper/index.less'

// Simple Error Boundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red', border: '1px solid red' }}>
          <h3>Page Crashed</h3>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

const RouteRenderer = ({ path }: { path: string }) => {
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    try {
      // Sync window.location for components reading it directly (like hashParams)
      // Use the iframe's window
      const url = new URL(path, window.location.href)
      window.history.replaceState(null, '', url.toString())
      setReady(true)
    } catch (e) {
      console.error('Failed to sync URL:', e)
      setReady(true)
    }
  }, [path])

  if (!ready) return null

  return (
    <ErrorBoundary key={path}>
      <Provider store={store}>
        <AppIntlProvider>
          {/* We still pass path to MemoryRouter so react-router matches the route */}
          <MemoryRouter initialEntries={[path]}>{renderRoutes(routes)}</MemoryRouter>
        </AppIntlProvider>
      </Provider>
    </ErrorBoundary>
  )
}

const meta: Meta<typeof RouteRenderer> = {
  title: 'Integration/App Pages',
  component: RouteRenderer,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof RouteRenderer>

// --- Generated Stories ---

export const GlobalSearch: Story = { args: { path: '/globalSearch' } }
export const Report: Story = { args: { path: '/report' } }
export const CompanyHome: Story = { args: { path: '/companyHome' } }
export const HomeNav: Story = { args: { path: '/home' } }
export const FindCustomer: Story = { args: { path: '/findCustomer' } }
export const Qualifications: Story = { args: { path: '/qualifications' } }
export const CompanyDynamic: Story = { args: { path: '/companyDynamic' } }
export const SingleCompanyDynamic: Story = { args: { path: '/singleCompanyDynamic' } }
export const QualificationsDetail: Story = { args: { path: '/qualificationsDetail' } }
export const FeaturedCompany: Story = { args: { path: '/featuredcompany' } }
export const FeaturedList: Story = { args: { path: '/featuredlist' } }
export const RankList: Story = { args: { path: '/rankList' } }
export const RankingListTree: Story = { args: { path: '/rankingListTree' } }
export const RankListDetail: Story = { args: { path: '/rankListDetail' } }
export const FilterRes: Story = { args: { path: '/filterRes' } }
export const QueryEnterpriseInOneSentence: Story = { args: { path: '/queryEnterpriseInOneSentence' } }
export const QueryDetailEnterpriseInOneSentence: Story = { args: { path: '/queryDetailEnterpriseInOneSentence' } }
export const SearchList: Story = { args: { path: '/searchList' } }
export const PersonSearchList: Story = { args: { path: '/personSearchList' } }
export const GroupSearchList: Story = { args: { path: '/groupSearchList' } }
export const IntelluctalSearch: Story = { args: { path: '/intelluctalSearch' } }
export const BidSearchList: Story = { args: { path: '/bidSearchList' } }
export const OutCompanySearch: Story = { args: { path: '/outCompanySearch' } }

// CompanyDetail with various corpCodes (inspired by DDRP.stories.tsx)
export const CompanyDetail_CO: Story = {
  args: { path: '/companyDetail?companyCode=1173319566' },
  name: 'CompanyDetail (CO)',
}
export const CompanyDetail_FCP: Story = {
  args: { path: '/companyDetail?companyCode=1063144164' },
  name: 'CompanyDetail (FCP)',
}
export const CompanyDetail_FPC: Story = {
  args: { path: '/companyDetail?companyCode=1002954109' },
  name: 'CompanyDetail (FPC)',
}
export const CompanyDetail_SPE: Story = {
  args: { path: '/companyDetail?companyCode=1004283596' },
  name: 'CompanyDetail (SPE)',
}
export const CompanyDetail_GOV: Story = {
  args: { path: '/companyDetail?companyCode=1179064448' },
  name: 'CompanyDetail (GOV)',
}
export const CompanyDetail_IIP: Story = {
  args: { path: '/companyDetail?companyCode=1102955966' },
  name: 'CompanyDetail (IIP)',
}
export const CompanyDetail_LS: Story = {
  args: { path: '/companyDetail?companyCode=1248823373' },
  name: 'CompanyDetail (LS)',
}
export const CompanyDetail_NGO: Story = {
  args: { path: '/companyDetail?companyCode=1226065840' },
  name: 'CompanyDetail (NGO)',
}
export const CompanyDetail_PE: Story = {
  args: { path: '/companyDetail?companyCode=1038862373' },
  name: 'CompanyDetail (PE)',
}
export const CompanyDetail_SOE: Story = {
  args: { path: '/companyDetail?companyCode=1355909797' },
  name: 'CompanyDetail (SOE)',
}
export const CompanyDetail_OE: Story = {
  args: { path: '/companyDetail?companyCode=1054443718' },
  name: 'CompanyDetail (OE)',
}
export const CompanyDetail_SH: Story = {
  args: { path: '/companyDetail?companyCode=1225626853' },
  name: 'CompanyDetail (SH)',
}
export const CompanyDetail_HK: Story = {
  args: { path: '/companyDetail?companyCode=1207343546' },
  name: 'CompanyDetail (HK)',
}
export const CompanyDetail_TW: Story = {
  args: { path: '/companyDetail?companyCode=1250975407' },
  name: 'CompanyDetail (TW)',
}
export const CompanyDetail_CANADA: Story = {
  args: { path: '/companyDetail?companyCode=1247070793' },
  name: 'CompanyDetail (CANADA)',
}
export const CompanyDetail_ENGLAND: Story = {
  args: { path: '/companyDetail?companyCode=1213525159' },
  name: 'CompanyDetail (ENGLAND)',
}
export const CompanyDetail_FRANCE: Story = {
  args: { path: '/companyDetail?companyCode=1337588182' },
  name: 'CompanyDetail (FRANCE)',
}
export const CompanyDetail_GERMANY: Story = {
  args: { path: '/companyDetail?companyCode=1265819509' },
  name: 'CompanyDetail (GERMANY)',
}
export const CompanyDetail_INDIA: Story = {
  args: { path: '/companyDetail?companyCode=1555171305' },
  name: 'CompanyDetail (INDIA)',
}
export const CompanyDetail_ITALY: Story = {
  args: { path: '/companyDetail?companyCode=1284842480' },
  name: 'CompanyDetail (ITALY)',
}
export const CompanyDetail_JAPAN: Story = {
  args: { path: '/companyDetail?companyCode=1224890572' },
  name: 'CompanyDetail (JAPAN)',
}
export const CompanyDetail_KOREA: Story = {
  args: { path: '/companyDetail?companyCode=1207772711' },
  name: 'CompanyDetail (KOREA)',
}
export const CompanyDetail_LUXEMBOURG: Story = {
  args: { path: '/companyDetail?companyCode=1239158216' },
  name: 'CompanyDetail (LUXEMBOURG)',
}
export const CompanyDetail_MALAYSIA: Story = {
  args: { path: '/companyDetail?companyCode=1575116880' },
  name: 'CompanyDetail (MALAYSIA)',
}
export const CompanyDetail_NEW_ZEALAND: Story = {
  args: { path: '/companyDetail?companyCode=1354418508' },
  name: 'CompanyDetail (NEW_ZEALAND)',
}
export const CompanyDetail_RUSSIA: Story = {
  args: { path: '/companyDetail?companyCode=1550341742' },
  name: 'CompanyDetail (RUSSIA)',
}
export const CompanyDetail_SINGAPORE: Story = {
  args: { path: '/companyDetail?companyCode=1223920191' },
  name: 'CompanyDetail (SINGAPORE)',
}
export const CompanyDetail_TAILAND: Story = {
  args: { path: '/companyDetail?companyCode=1524110754' },
  name: 'CompanyDetail (TAILAND)',
}
export const CompanyDetail_VIETNAM: Story = {
  args: { path: '/companyDetail?companyCode=1273211271' },
  name: 'CompanyDetail (VIETNAM)',
}

export const BiddingInfo: Story = { args: { path: '/biddingInfo' } }
export const LawDetail: Story = { args: { path: '/lawdetail' } }
export const BiddingDetail: Story = { args: { path: '/biddingdetail' } }
export const SearchJob: Story = { args: { path: '/searchJob' } }
export const SearchBidNew: Story = { args: { path: '/searchBidNew' } }
export const GameApproval: Story = { args: { path: '/gameapproval' } }
export const PatentDetail: Story = { args: { path: '/patentDetail' } }
export const EvaluationDetail: Story = { args: { path: '/evaluationDetail' } }
export const LogoDetail: Story = { args: { path: '/logoDetail' } }
export const JobDetail: Story = { args: { path: '/jobDetail' } }
export const ProductDetail: Story = { args: { path: '/productDetail' } }
export const NewGroup: Story = { args: { path: '/newGroup' } }
export const Character: Story = { args: { path: '/character' } }
export const NewCompany: Story = { args: { path: '/newCompany' } }
export const LinksPageTest: Story = { args: { path: '/linksPageTest' } }
export const TagsPageTest: Story = { args: { path: '/tagsPageTest' } }
export const StandardInfoDetail: Story = { args: { path: '/standardInfoDetail' } }
export const BGroup: Story = { args: { path: '/bgroup' } }
export const AtlasPlatform: Story = { args: { path: '/atlasplatform' } }
export const SearchPlatformDefault: Story = {
  args: { path: '/searchPlatform/default' },
  name: 'SearchPlatform (Default/Patent)',
}
export const SearchPlatformBrand: Story = { args: { path: '/searchPlatform/searchbrand' } }
export const SearchPlatformGlobal: Story = { args: { path: '/searchPlatform/globalsearch' } }
export const SearchPlatformGroup: Story = { args: { path: '/searchPlatform/searchgroupdepartment' } }
export const SearchPlatformFetured: Story = { args: { path: '/searchPlatform/searchfetured' } }
export const SearchPlatformPatent: Story = { args: { path: '/searchPlatform/searchpatent' } }
export const HomeAI: Story = { args: { path: '/homeAI' } }
export const SearchHome: Story = { args: { path: '/searchHome' } }
export const BankingWorkbench: Story = { args: { path: '/bankingWorkbench' } }
export const SpecialAppList: Story = { args: { path: '/specialAppList' } }
export const VersionPrice: Story = { args: { path: '/versionPrice' } }
export const VersionPriceOversea: Story = { args: { path: '/versionPriceOversea' } }
export const RelatedLinks: Story = { args: { path: '/relatedlinks' } }
export const InnerLinks: Story = { args: { path: '/innerLinks' } }
export const CompanyNews: Story = { args: { path: '/CompanyNews' } }
export const Customer: Story = { args: { path: '/customer' } }
export const GqctChart: Story = { args: { path: '/gqctChart' } }
export const GlgxChart: Story = { args: { path: '/glgxChart' } }
export const ActCtrlChart: Story = { args: { path: '/actCtrlChart' } }
export const BeneficialChart: Story = { args: { path: '/beneficialChart' } }
export const CompanyMap: Story = { args: { path: '/companyMap' } }
export const Graph: Story = { args: { path: '/graph' } }
export const IcLayout: Story = { args: { path: '/icLayout' } }
export const AiGraph: Story = { args: { path: '/aiGraph' } }

// Top level routes outside Home
export const AnnualReportDetail: Story = { args: { path: '/annualReportDetail' } }
export const AgreementCN: Story = { args: { path: '/agreementCN' } }
export const AgreementEN: Story = { args: { path: '/agreementEN' } }
export const ReportInfo: Story = { args: { path: '/reportInfo' } }
