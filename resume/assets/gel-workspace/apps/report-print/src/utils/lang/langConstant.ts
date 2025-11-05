import { isEnForRPPrint } from './intl'

export const initZhEn = () => {
  try {
    if (isEnForRPPrint()) {
      $('body').addClass('wind-locale-en-US')
    }
  } catch (e) {
    console.trace(e)
  }
}
