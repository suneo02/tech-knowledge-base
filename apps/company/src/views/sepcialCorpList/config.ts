import { PageLocation } from 'gel-util/misc'
import { usePageTitle } from '../../handle/siteTitle'

export type TSpecialCorpListPageType = 'ipoNew' | 'debtNew' | 'cngroup' | 'financialcorp' | 'pevcinvest'

export const SpecialCorpListPageTypeMap: Record<TSpecialCorpListPageType, PageLocation> = {
  ipoNew: 'FeaturedListed',
  debtNew: 'FeaturedBonds',
  cngroup: 'FeaturedStateOwned',
  financialcorp: 'FeaturedFinance',
  pevcinvest: 'FeaturedPEVC',
}

export const useSpecialCorpListPageTitle = (pageType: TSpecialCorpListPageType): void => {
  let eLocation: PageLocation
  try {
    eLocation = SpecialCorpListPageTypeMap[pageType]
  } catch (e) {
    console.error(e)
  }
  usePageTitle(eLocation)
}
