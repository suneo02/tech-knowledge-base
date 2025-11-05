import { CompanyCommonTagWithJump } from './index.tsx'
import { isNil } from 'lodash'
import React, { FC } from 'react'
import { getCompanyTagModule, getInfoFromCompanyTag } from './handle.ts'

export type ICompanyTagArr =
  | string
  | {
      type: string
      content: string
      id: string
    }[]

/**
 * 历史遗留代码
 * @param {*} param0
 *
 * @param {CompanyTagConfig []} param0.tagArr  eg [
 "投资机构_投资机构|小米科技_2000465176",
 "集团系_小米系_2010500722",
 "企业规模_小型企业",
 "企业规模_小微企业",
 "企业性质_民营企业",
 "控股类型_私人绝对控股",
 "融资阶段_战略投资",
 "生命周期_成长期"
 ]
 * @returns
 */
export const CompanyTagArr: FC<{
  tagArr: ICompanyTagArr
}> = ({ tagArr }) => {
  //显示公司的标签
  if (isNil(tagArr) || !Array.isArray(tagArr) || !tagArr.length) return null

  return (
    <>
      {tagArr.map((i) => {
        let type, content, id
        if (typeof i === 'string') {
          ;({ type, content, id } = getInfoFromCompanyTag(i))
        } else {
          ;({ type, content, id } = i)
        }

        const tagModule = getCompanyTagModule(type, content, id)

        return (
          <CompanyCommonTagWithJump
            key={`company-tags-${i}`}
            itemDestruct={{
              type,
              content,
              id,
            }}
            module={tagModule}
          />
        )
      })}
    </>
  )
}
