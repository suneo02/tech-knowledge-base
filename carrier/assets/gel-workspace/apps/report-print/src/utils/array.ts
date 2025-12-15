export function arrayFind<T>(array: T[], predicate: (item: T) => boolean): T | undefined {
  for (const item of array) {
    if (predicate(item)) {
      return item
    }
  }
  return undefined
}

export function arrayFindIndex<T>(array: T[], predicate: (item: T) => boolean): number {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return i
    }
  }
  return -1
}
