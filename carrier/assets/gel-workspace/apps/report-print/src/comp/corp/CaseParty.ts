import { DEFAULT_EMPTY_TEXT, safeToStringRender } from '@/handle/table/cell/shared'
import { arrayFind } from '@/utils/array'

export function createCaseParty(arrDataArr, nameKey?, idKey?) {
  try {
    if (!arrDataArr || !Array.isArray(arrDataArr) || arrDataArr.length === 0) {
      return DEFAULT_EMPTY_TEXT
    }
    const arrData = []
    arrDataArr.map((item) => {
      if (item.roleType === '原告') {
        arrData.unshift(item)
      } else {
        arrData.push(item)
      }
    })
    nameKey = nameKey || 'name'
    idKey = idKey || 'id'
    const newArr = []
    if (!arrData || arrData.length === 0) {
      return DEFAULT_EMPTY_TEXT
    }
    arrData.forEach((item) => {
      const parent = arrayFind(newArr, (c) => c.roleType === item.roleType)
      if (parent) {
        parent.childs.push(item)
      } else {
        const obj = {
          roleType: item.roleType,
          childs: [item],
        }
        newArr.push(obj)
      }
    })
    const $element = $('<div></div>')
    for (let i = 0; i < newArr.length; i++) {
      const childs = newArr[i].childs
      const $roleContainer = $('<span>')
      $roleContainer.append(newArr[i].roleType + ': ')

      childs.forEach((t, idx) => {
        if (idx > 0) {
          $roleContainer.append('、')
        }
        const $span = $('<span>')
        $span.append(' ').append(safeToStringRender(t[nameKey])).append(' ')
        $roleContainer.append($span)
      })

      $element.append($roleContainer)
      if (i < newArr.length - 1) {
        $element.append($('<br>'))
      }
    }
    return $element
  } catch (e) {
    console.error('CaseParty error:', e)
    return DEFAULT_EMPTY_TEXT
  }
}
