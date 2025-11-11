import { IndustrySector } from 'gel-types'
import { getCorpIndustryDisplayConfidence, getCorpIndustrySeparator } from 'report-util/table'
import styles from './comp.module.less'

/**
 *
 */
export const createIndustryDataCell = (sector: IndustrySector) => {
  if (!sector || !sector.list) {
    return null
  }

  const separator = getCorpIndustrySeparator(sector.key)

  const $element = $('<div>')

  sector.list.forEach((confidenceGroup) => {
    const $group = $('<div>').addClass(styles['corp-belong-industry-group'])
    const $itemContainer = $('<div>')
    $group.append($itemContainer)
    confidenceGroup.list.forEach((item, k) => {
      const confidence = getCorpIndustryDisplayConfidence(confidenceGroup)
      const $item = $('<span>').text(item.name)
      $itemContainer.append($item)
      if (confidence !== null && confidence !== undefined && k === confidenceGroup.list.length - 1) {
        $item.append($('<sup>').addClass('confidence-level').text(confidence))
      }
      if (k < confidenceGroup.list.length - 1) {
        $item.append($('<span>').text(separator))
      }
    })
    $element.append($group)
  })
  return $element.html()
}
