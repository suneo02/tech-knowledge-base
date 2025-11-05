import { CompanyCommonTagWithJump } from '@/components/company/intro/tag/index.tsx'
import { TagsModule } from 'gel-ui'
import React, { FC } from 'react'

export const CorpProductWordTags: FC<{
  productWords: string[]
}> = ({ productWords }) => {
  try {
    if (!productWords) return null

    return productWords
      .slice(0, 5)
      .map((item) => (
        <CompanyCommonTagWithJump
          key={`3risktagspan--${item}`}
          itemDestruct={{ content: item, type: '产品' }}
          module={TagsModule.COMPANY_PRODUCT}
        />
      ))
  } catch (e) {
    console.error(e)
    return null
  }
}
