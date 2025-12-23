import { replaceScript } from '@/misc'

export const addChangeTag = function (value, afterData) {
  if (value && value.indexOf('text-insert') > -1) {
    value = value.replace(/<span class='text-insert'>/g, '')
    value = value.replace(/<\/span>/g, '')
  }
  if (value && value.indexOf('text-delete') > -1) {
    value = value.replace(/<span class='text-delete'>/g, '')
    value = value.replace(/<\/span>/g, '')
  }
  if (afterData && afterData.indexOf('text-insert') > -1) {
    afterData = afterData.replace(/<span class='text-insert'>/g, '')
    afterData = afterData.replace(/<\/span>/g, '')
  }
  if (afterData && afterData.indexOf('text-delete') > -1) {
    afterData = afterData.replace(/<span class='text-delete'>/g, '')
    afterData = afterData.replace(/<\/span>/g, '')
  }
  if (value.indexOf(',') > -1) {
    value = value.split(',')
  } else if (value.indexOf('，') > -1) {
    value = value.split('，')
  }
  if (afterData.indexOf(',') > -1) {
    afterData = afterData.split(',')
  } else if (afterData.indexOf('，') > -1) {
    afterData = afterData.split('，')
  }
  for (let i = 0; i < value.length; i++) {
    let flag = true
    for (let j = 0; j < afterData.length; j++) {
      if (value[i] == afterData[j]) {
        flag = false
        break
      }
    }
    if (flag) {
      value[i] = '<span class="text-insert">' + value[i] + '</span>'
    }
  }
  value = value.join('，')
  return value
}

/**
 * 渲染工商变更信息
 * @param txt 文本
 * @param record 记录
 * @returns 渲染后的 html 文本
 */
export function renderBussChangeInfoAsHtml(txt: any, record: any) {
  try {
    let data = replaceScript(txt)
    if (record.change_type == '主要人员变更') {
      if (data.indexOf(',') > -1 || data.indexOf('，') > -1) {
        data = addChangeTag(data, record.after_change)
      }
    } else {
      if (data && data.indexOf('text-insert') > -1) {
        data = data.replace(/text-insert/g, 'text-insert ')
      }
      if (data && data.indexOf('text-delete') > -1) {
        data = data.replace(/text-delete/g, 'text-delete ')
      }
      if (data && data.indexOf('tag-red') > -1) {
        data = data.replace(/tag-red/g, 'tag-red ')
      }
    }
    // 假设 data = "这是前半段文本<span class='highlight'>重点</span>后半段"
    // parseHTML 会生成一个包含三个节点的数组：[TextNode("这是前半段文本"), <span>…, TextNode("后半段")]
    return data
  } catch (e) {
    console.error('renderBussChangeInfo error:', e, txt)
    return '--'
  }
}
