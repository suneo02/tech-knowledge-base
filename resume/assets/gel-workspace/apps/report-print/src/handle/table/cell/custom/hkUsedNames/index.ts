import { CorpBasicInfo } from 'gel-types'
import styles from './index.module.less'
/**
 * 

 * @param record 
 * @returns 
 */
export const renderHKUsedNames = (txt: CorpBasicInfo['usednames']) => {
  if (!txt || txt.length === 0) {
    return '--'
  }

  const $element = $(`<div>`)
  $.each(txt, (_index, element) => {
    const $itemWrapper = $(`<div>`).addClass(styles['hk-used-name-item'])
    const $itemElement = $(`<div>`).addClass(styles['hk-used-name-item-element'])
    $itemElement.append(`${element.used_name}`)
    if (element.used_name && element.usedEnName) {
      $itemElement.append(`<br />`)
    }
    $itemElement.append(`${element.usedEnName}`)
    $itemWrapper.append($itemElement)
    if (element.useFrom || element.useTo) {
      $itemWrapper.append(
        `<div class="${styles['hk-used-name-item-date']}">（${element.useFrom} ~ ${element.useTo}）</div>`
      )
    }
    $element.append($itemWrapper)
  })
  return $element.html()
}
