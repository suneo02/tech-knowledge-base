// Declaration for the Wind library
declare const Wind: {
  langControl: {
    intl: (id: string | number, defaultVal?: string) => string
    initByJSON: (path: string, success: () => void, error: () => void) => void
    lang: string
    getLocale: () => string
  }
  uri: (url: string) => {
    query: (key: string, value: string) => string
  }
}

// Extend window interface if needed
interface Window {
  wind?: typeof Wind
  intl?: (id: string | number, defaultVal?: string) => string
  $: JQueryStatic
  global_wsid?: string
  layer?: any
}
