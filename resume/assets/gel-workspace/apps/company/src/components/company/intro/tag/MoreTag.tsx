import intl from '@/utils/intl'
import React, { FC, ReactNode } from 'react'
import './styles/moreTag.less'

import { ModalSafeType } from '@/components/modal/ModalSafeType.tsx'
import { wftCommon } from '@/utils/utils.tsx'
import { TagsModule } from 'gel-ui'
import { CompanyCommonTagWithJump } from './index.tsx'
import { IndustryTag } from './IndustryTag.tsx'
import { CompanyTagArr } from './TagArr.tsx'

const StylePrefix = 'company-more-tags-modal'

const TagGroup: React.FC<{
  title: string // 模块标题
  tagList: any[] // 标签数组
  tagComp: ReactNode
}> = ({ title, tagList, tagComp }) => {
  if (!tagList || !tagList.length) return null

  return (
    <div className={`${StylePrefix}--group`}>
      <div className={`${StylePrefix}--title`}>
        {title}({tagList.length})
      </div>
      <div className={`${StylePrefix}--tags`}>{tagComp}</div>
    </div>
  )
}

export const CompanyMoreTagsModal: FC<{
  open: boolean
  setOpen: (open: boolean) => void
  companyTags: any
  featureCompanyTagStrList: any
  riskTags: any
  corpTagStrList: any
  industryTags: [{ title: string; id: string; confidence: number }]
}> = ({ open, setOpen, companyTags, featureCompanyTagStrList, riskTags, corpTagStrList, industryTags }) => {
  const productWords =
    companyTags?.productWords?.map((item) => {
      return (
        <CompanyCommonTagWithJump
          key={`more-tags-${item}`}
          itemDestruct={{ content: item, type: '产品' }}
          module={TagsModule.COMPANY_PRODUCT}
        />
      )
    }) ?? []

  const footer = (
    <div className={`${StylePrefix}--footer`}>
      *{intl('365134', '该数据从公示结果解析得出，仅供参考，不代表万得征信任何明示、暗示之观点或保证。')}
    </div>
  )

  if (window.en_access_config) {
    setTimeout(() => {
      wftCommon.translateDivHtml(`.${StylePrefix}`, window.$(`.${StylePrefix}`))
    }, 300)
  }

  const tagConfigs = [
    {
      title: intl('272172', '企业标签'),
      tagList: corpTagStrList,
      tagComp: <CompanyTagArr tagArr={corpTagStrList} />,
    },
    {
      title: intl('449235', '所属行业/产业'),
      tagList: industryTags,
      tagComp: <IndustryTag tags={industryTags} />,
    },
    {
      title: intl('', '企业入选名录'),
      tagList: featureCompanyTagStrList,
      tagComp: <CompanyTagArr tagArr={featureCompanyTagStrList} />,
    },
    {
      title: intl('342113', '风险标签'),
      tagList: riskTags,
      tagComp: riskTags,
    },
    {
      title: intl('325333', '企业产品'),
      tagList: productWords,
      tagComp: productWords,
    },
  ]

  return (
    <ModalSafeType
      className={StylePrefix}
      visible={open}
      title={intl('272172', '企业标签')}
      onCancel={() => setOpen(false)}
      width={560}
      footer={footer}
    >
      <div className={`${StylePrefix}--body`}>
        {tagConfigs.map((config, index) => (
          <TagGroup key={index} {...config} />
        ))}
      </div>
    </ModalSafeType>
  )
}
