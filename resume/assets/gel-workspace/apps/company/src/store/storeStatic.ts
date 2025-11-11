// Function to get current translating state
export const getStoreStaticIsTranslating = () => {
  try {
    // Lazy imports to avoid circular dependency
    const { selectIsTranslating } = require('@/reducers/global')
    const store = require('./store').default
    return selectIsTranslating(store.getState())
  } catch (error) {
    console.warn('Failed to get translation state:', error)
    return false
  }
}
