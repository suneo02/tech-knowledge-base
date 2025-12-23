import React from 'react'
import { ColumnRender } from '@wind/wind-ui-table'

export const handleColBidProductRender: ColumnRender<any> = (txt) => {
  try {
    if (Array.isArray(txt) && txt.length) {
      return txt.map((item) => <span key={item}>#{item} </span>)
    } else {
      return '--'
    }
  } catch (e) {
    console.error(e)
    return '--'
  }
}
