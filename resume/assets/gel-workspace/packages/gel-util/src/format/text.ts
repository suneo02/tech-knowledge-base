export const formatText = (str: string | undefined) => {
  str = str + ''
  if (str && str.toLowerCase() != 'null' && str.toLowerCase() != 'undefined') {
    return str
  } else {
    return '--'
  }
}
