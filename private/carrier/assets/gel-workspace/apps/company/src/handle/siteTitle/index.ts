import { useIntl } from 'gel-ui'
import { t } from 'gel-util/intl'
import { generatePageTitle, PageLocation } from 'gel-util/misc'
import { useEffect, useMemo } from 'react'
export { generatePageTitle }

/**
 * function for class component to set the document title dynamically on page load.
 * @param location
 * @param params
 */
export function setPageTitle(location: PageLocation, params?: string[] | string): void {
  const title = generatePageTitle(t, location, params)
  document.title = title
}

/**
 * Hook to set the document title dynamically on page load.
 * @param location - The current page location enum.
 * @param params - Optional parameters for the title template.
 */
export function usePageTitle(location: PageLocation, params?: string[] | string): void {
  const t = useIntl()
  const title = useMemo(() => {
    // Generate the title based on the location and parameters
    return generatePageTitle(t, location, params)
  }, [location, params])

  useEffect(() => {
    // Set the document title
    document.title = title
  }, [title])
}
