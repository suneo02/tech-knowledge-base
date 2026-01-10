const PATCH_FLAG = '__open_patched__' as const

declare global {
  interface Window {
    __open_patched__?: boolean
  }
}

if (typeof window !== 'undefined' && !window.__open_patched__) {
  const originalOpen = window.open.bind(window)

  window.open = function (url?: string | URL, target?: string, features?: string) {
    try {
      let finalUrl: string | URL | undefined = url

      if (typeof url === 'string' || url instanceof URL) {
        const currentParams = new URLSearchParams(window.location.search)
        if (currentParams.has('notoolbar')) {
          const urlObj = url instanceof URL ? new URL(url) : new URL(url, window.location.origin)

          if (!urlObj.searchParams.has('notoolbar')) {
            const value = currentParams.get('notoolbar')
            urlObj.searchParams.set('notoolbar', value ?? '1')
          }

          finalUrl = urlObj.toString()
        }
      }

      return originalOpen(finalUrl, target, features)
    } catch {
      return originalOpen(url, target, features)
    }
  }

  window[PATCH_FLAG] = true
}

export {}