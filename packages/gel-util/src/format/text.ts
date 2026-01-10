export const EMPTY_PLACEHOLDER = '--'

export const formatText = (str: string | undefined | number): string => {
  str = str + ''
  if (str && str.toLowerCase() != 'null' && str.toLowerCase() != 'undefined') {
    return str
  } else {
    return EMPTY_PLACEHOLDER
  }
}
