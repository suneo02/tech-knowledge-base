import Links from '@/components/common/links/Links.tsx'
import { LinksModule } from '@/handle/link'
import React from 'react'
import { ColumnRender } from '@wind/wind-ui-table'

export const handleColumnCorpLinkArrStrRender: ColumnRender<any> = (txt) => {
  try {
    if (!(txt && typeof txt === 'string')) {
      return '--'
    }
    const arr = txt.split(',')

    return arr.map((item) => {
      const [name, id] = item.split('|')
      return <Links key={id} module={LinksModule.COMPANY} title={name} id={id} />
    })
  } catch (e) {
    console.error(e)
    return '--'
  }
}
