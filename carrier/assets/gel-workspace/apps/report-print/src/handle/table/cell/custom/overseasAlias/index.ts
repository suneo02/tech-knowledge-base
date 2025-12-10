import { CorpAnotherNameList, CorpBasicInfo } from 'gel-types'
import { DEFAULT_EMPTY_TEXT } from '../../shared'
import styles from './index.module.less'
/**
 * 

 * @param record 
 * @returns 
 */
export const renderOverseasAlias = (anotherNames: CorpBasicInfo['anotherNames']) => {
  let anotherNamesList: CorpAnotherNameList
  if (Array.isArray(anotherNames)) {
    anotherNamesList = anotherNames
  } else {
    anotherNamesList = Object.entries(anotherNames || {}).map(([key, value]) => ({
      type: key,
      anotherNames: value,
    }))
  }

  // 如果 anotherNames 不存在或者为空数组，则直接返回 '--'
  if (!anotherNamesList || anotherNamesList.length === 0 || !Array.isArray(anotherNamesList)) {
    return DEFAULT_EMPTY_TEXT
  }

  // 对 anotherNames 进行处理，过滤掉 anotherNames 为空或空数组的情况
  const vals = anotherNamesList.reduce<{ type: string; names: string[] }[]>((acc, k) => {
    const val = k.anotherNames
    if (val && val.length > 0) {
      acc.push({
        type: k.type,
        names: val.map((t) => t.formerName || DEFAULT_EMPTY_TEXT),
      })
    }
    return acc
  }, [])

  // 如果处理后的 vals 为空，则返回 '--'
  if (vals.length === 0) {
    return DEFAULT_EMPTY_TEXT
  }

  const $element = $(`<div>`).addClass(styles.alias)
  $.each(vals, (_index, element) => {
    const $title = $(`<span class="${styles['alias-title']}">${element.type}</span>`)
    const $names = $(`<div>`).addClass(styles['alias-names'])
    $.each(element.names, (_index, name) => {
      $names.append(`<span>${name}</span>`)
    })
    $element.append($title)
    $element.append($names)
  })
  return $element
}
