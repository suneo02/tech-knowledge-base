import { addSearchHistory, getSearchHistoryAndSlice } from '../../api/services/history'
import { SearchBidNewState } from './type'

type SetStateFunc = (
  state: Partial<SearchBidNewState> | ((prevState: Readonly<SearchBidNewState>) => Partial<SearchBidNewState> | null),
  callback?: () => void
) => void

interface HistoryParams {
  title?: string
  productName?: string
  showBuyPre?: string[]
  showWinPre?: string[]
  showbidWinnerPre?: string[]
}

export const updateSearchHistory = (setState: SetStateFunc, params: HistoryParams) => {
  const { title, productName, showBuyPre, showWinPre, showbidWinnerPre } = params

  if (title) {
    addSearchHistory('BID_SEARCH_TITLE', title).then(() => {
      getSearchHistoryAndSlice('BID_SEARCH_TITLE').then((titleHis) => {
        setState({
          keywordHis: titleHis || [],
        })
      })
    })
  }
  if (productName) {
    addSearchHistory('BID_SEARCH_PRODUCT', productName).then(() => {
      getSearchHistoryAndSlice('BID_SEARCH_PRODUCT').then((productHis) => {
        setState({
          productsHis: productHis || [],
        })
      })
    })
  }
  if (showBuyPre.length > 0) {
    Promise.all(showBuyPre.map((item) => addSearchHistory('BID_SEARCH_PURCHASING_UNIT', item))).then(() => {
      getSearchHistoryAndSlice('BID_SEARCH_PURCHASING_UNIT').then((purchaseHis) => {
        setState({
          purchaseHis: purchaseHis || [],
        })
      })
    })
  }
  if (showWinPre.length > 0) {
    Promise.all(showWinPre.map((item) => addSearchHistory('BID_SEARCH_PARTICIPATING_UNIT', item))).then(() => {
      getSearchHistoryAndSlice('BID_SEARCH_PARTICIPATING_UNIT').then((partHis) => {
        setState({
          partHis: partHis || [],
        })
      })
    })
  }
  if (showbidWinnerPre.length > 0) {
    Promise.all(showbidWinnerPre.map((item) => addSearchHistory('BID_SEARCH_BID_WINNER', item))).then(() => {
      getSearchHistoryAndSlice('BID_SEARCH_BID_WINNER').then((winHis) => {
        setState({
          winHis: winHis || [],
        })
      })
    })
  }
}
