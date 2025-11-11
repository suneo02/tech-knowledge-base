import { IndicatorTreeClassification, IndicatorTreeIndicator } from 'gel-api'

// Helper function to filter indicators - extracted as a separate utility
export const filterIndicatorTree = (tree: IndicatorTreeClassification[]): IndicatorTreeClassification[] => {
  return tree.map((node) => {
    const newNode = { ...node }

    // Filter indicators if they exist
    if (newNode.indicators) {
      if (newNode.key === 2) {
        // For classification with key=2, keep all indicators
        newNode.indicators = [...newNode.indicators]
      } else {
        // For other classifications, remove indicators with key='0' or key='1'
        newNode.indicators = newNode.indicators.filter((indicator) => indicator.key !== '0' && indicator.key !== '1')
      }
    }

    // Recursively filter children if they exist
    if (newNode.children && newNode.children.length > 0) {
      newNode.children = filterIndicatorTree(newNode.children)
    }

    return newNode
  })
}

// Helper function to find indicator name by key
export const findIndicatorName = (classifications: IndicatorTreeClassification[], key: number): string | undefined => {
  for (const classification of classifications) {
    // Check current classification's indicators
    if (classification.indicators) {
      const indicator = classification.indicators.find((i) => i.spId === key)
      if (indicator) return indicator.indicatorDisplayName
    }

    // Recursively check child classifications
    if (classification.children) {
      const found = findIndicatorName(classification.children, key)
      if (found) return found
    }
  }
  return undefined
}

// Helper function to find complete indicator object by spId
export const findIndicatorById = (
  classifications: IndicatorTreeClassification[],
  spId: number
): IndicatorTreeIndicator | undefined => {
  for (const classification of classifications) {
    // Check current classification's indicators
    if (classification.indicators) {
      const indicator = classification.indicators.find((i) => i.spId === spId)
      if (indicator) return indicator
    }

    // Recursively check child classifications
    if (classification.children) {
      const found = findIndicatorById(classification.children, spId)
      if (found) return found
    }
  }
  return undefined
}
