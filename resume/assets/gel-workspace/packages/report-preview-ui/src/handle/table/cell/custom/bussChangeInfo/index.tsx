import React from 'react'
import { replaceScript } from '../../../../../utils'
import './index.less'

export const addChangeTag = function (data: any, afterData: any) {
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

export function renderBussChangeInfo(record: any) {
  let data = record['beforeChange']
  data = replaceScript(data)
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
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: data,
      }}
    ></span>
  )
}
