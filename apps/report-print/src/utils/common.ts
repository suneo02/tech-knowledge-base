// Overload signatures
export function includePolyfill<T>(array: T[], item: T): boolean
export function includePolyfill(text: string, charOrSubstring: string): boolean
// Implementation
export function includePolyfill<T>(collection: T[] | string, item: T | string): boolean {
  if (typeof collection === 'string' && typeof item === 'string') {
    return collection.indexOf(item) !== -1
  } else if (Array.isArray(collection)) {
    // We need to be careful with the type of 'item' here.
    // If collection is T[], then item should be T.
    // The overloads should enforce this, but the implementation needs to handle the union type.
    return collection.indexOf(item as T) !== -1
  }
  // Should not be reached if overloads are used correctly, but as a fallback:
  return false
}
