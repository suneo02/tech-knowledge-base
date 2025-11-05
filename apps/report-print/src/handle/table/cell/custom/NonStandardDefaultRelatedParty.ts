import { t } from '@/utils/lang'

export const renderNonStandardDefaultRelatedParty = (txt, _row) => {
  if (!txt) return ''
  const partiesArr = []
  $.each(txt, (item) => {
    if (txt[item]) {
      $.each(txt[item], (itemChid) => {
        partiesArr.push(itemChid)
      })
    }
  })
  const $element = $('span').addClass('parties-tooltip')
  $element.html(`${t('4600', '担保人')}: ${partiesArr[0].companyName}`)
  return $element
}
