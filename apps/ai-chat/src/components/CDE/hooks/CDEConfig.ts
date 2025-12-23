import { fetchFilterCategories, selectFilterCategories, selectHasLoaded, useAppDispatch } from '@/store'
import { session } from '@/utils'
import { useCDEFilterCfgCtx } from 'cde'
import { useSelector } from 'react-redux'

export const useFetchCDEConfig = (open: boolean) => {
  const { setFilterCfg } = useCDEFilterCfgCtx()
  const dispatch = useAppDispatch()
  const filterCategories = useSelector(selectFilterCategories)
  const hasLoaded = useSelector(selectHasLoaded)
  const filterCategoriesFromSession = session.get('CDE_FILTER_CATEGORIES')
  const isInitialized = useRef(false)

  // Fetch categories if needed
  useEffect(() => {
    if (open && !hasLoaded && !filterCategoriesFromSession) {
      dispatch(fetchFilterCategories())
    }
  }, [open, hasLoaded, filterCategoriesFromSession, dispatch])

  // Handle filter configuration updates
  useEffect(() => {
    // Skip if already initialized
    if (isInitialized.current) {
      return
    }

    // Try to initialize from session first
    if (filterCategoriesFromSession) {
      setFilterCfg(filterCategoriesFromSession)
      isInitialized.current = true
      return
    }

    // If Redux state is available, use it
    if (filterCategories) {
      setFilterCfg(filterCategories)

      // Update session only if needed
      const currentSession = session.get('CDE_FILTER_CATEGORIES')
      if (JSON.stringify(currentSession) !== JSON.stringify(filterCategories)) {
        session.set('CDE_FILTER_CATEGORIES', filterCategories)
      }

      isInitialized.current = true
    }
  }, [filterCategories, filterCategoriesFromSession, setFilterCfg])

  return { filterCategories }
}
