import Links from '../../../common/links/Links'
import { LinksModule } from '@/handle/link'
import './index.less'
import React from 'react'

const StylePrefix = 'patent-main-body-info-list'
/**
 * [
 {
 "patentMainBody": "小米科技（武汉）有限公司",
 "patentMainBodyId": "1197122646"
 },
 {
 "patentMainBody": "小米智能家电（武汉）有限公司",
 "patentMainBodyId": "1508626251"
 },
 {
 "patentMainBody": "北京小米移动软件有限公司",
 "patentMainBodyId": "1030208713"
 }
 ]
 * */
export const handleCompanyLinkArr = (col) => {
  col.render = (cell) => {
    if (!cell || !col.companyLinkArr) {
      return String(cell)
    }

    const cellParsed = Array.isArray(cell) ? cell : [cell]

    return (
      <div className={StylePrefix}>
        {cellParsed.map((corp) => {
          if (!corp) {
            return null
          }
          const id = corp[col.companyLinkArr.corpIdKey]
          const title = corp[col.companyLinkArr.corpNameKey]
          return (
            corp && (
              <div>
                <Links module={LinksModule.COMPANY} id={id} title={title} />
              </div>
            )
          )
        })}
      </div>
    )
  }
}
