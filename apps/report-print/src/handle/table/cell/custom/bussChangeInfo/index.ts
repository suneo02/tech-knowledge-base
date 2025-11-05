import { replaceScript } from 'report-util/misc'
import './index.less'

export const addChangeTag = function (data, afterData) {
  if (data && data.indexOf('text-insert') > -1) {
    data = data.replace(/<span class='text-insert'>/g, '')
    data = data.replace(/<\/span>/g, '')
  }
  if (data && data.indexOf('text-delete') > -1) {
    data = data.replace(/<span class='text-delete'>/g, '')
    data = data.replace(/<\/span>/g, '')
  }
  if (afterData && afterData.indexOf('text-insert') > -1) {
    afterData = afterData.replace(/<span class='text-insert'>/g, '')
    afterData = afterData.replace(/<\/span>/g, '')
  }
  if (afterData && afterData.indexOf('text-delete') > -1) {
    afterData = afterData.replace(/<span class='text-delete'>/g, '')
    afterData = afterData.replace(/<\/span>/g, '')
  }
  if (data.indexOf(',') > -1) {
    data = data.split(',')
  } else if (data.indexOf('，') > -1) {
    data = data.split('，')
  }
  if (afterData.indexOf(',') > -1) {
    afterData = afterData.split(',')
  } else if (afterData.indexOf('，') > -1) {
    afterData = afterData.split('，')
  }
  for (let i = 0; i < data.length; i++) {
    let flag = true
    for (let j = 0; j < afterData.length; j++) {
      if (data[i] == afterData[j]) {
        flag = false
        break
      }
    }
    if (flag) {
      data[i] = '<span class="text-insert">' + data[i] + '</span>'
    }
  }
  data = data.join('，')
  return data
}

export function renderBussChangeInfo(txt: any, record: any) {
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
    const nodes = $.parseHTML(data, document, true)
    return $(nodes)
  } catch (e) {
    console.error('renderBussChangeInfo error:', e, txt)
    return '--'
  }
}
