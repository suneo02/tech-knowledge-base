import intl from '@/utils/intl'
import React, { FC } from 'react'
import './styles/moreTag.less'

import { ModalSafeType } from '@/components/modal/ModalSafeType.tsx'
import { CorpTag } from 'gel-api'
import { CorpTagInDetail } from 'gel-ui'
import { splitTags2MapByModule } from 'gel-util/biz'
import { CorpTagTrans } from './type'

const StylePrefix = 'company-more-tags-modal'

const TagGroup: React.FC<{
  title: string // 模块标题
  tagList: CorpTagTrans[] // 标签数组
  onTagClick: (corpTag: CorpTag) => void
}> = ({ title, tagList, onTagClick }) => {
  if (!tagList || !tagList.length) return null

  return (
    <div className={`${StylePrefix}--group`}>
      <div className={`${StylePrefix}--title`}>
        {title}({tagList.length})
      </div>
      <div className={`${StylePrefix}--tags`}>
        {tagList.map((tag) => (
          <CorpTagInDetail key={tag.id} corpTag={tag} tagNameOriginal={tag.nameOriginal} onClick={onTagClick} />
        ))}
      </div>
    </div>
  )
}

export const CompanyMoreTagsModal: FC<{
  open: boolean
  setOpen: (open: boolean) => void
  tags: CorpTagTrans[]
  onTagClick: (corpTag: CorpTag) => void
}> = ({ open, setOpen, tags, onTagClick }) => {
  const corpTagMap = splitTags2MapByModule(tags)

  const footer = (
    <div className={`${StylePrefix}--footer`}>
      *{intl('365134', '该数据从公示结果解析得出，仅供参考，不代表万得征信任何明示、暗示之观点或保证。')}
    </div>
  )

  const tagConfigs = [
    {
      title: intl('272172', '企业标签'),
      tagList: corpTagMap.CORP,
    },
    {
      title: intl('449235', '所属行业/产业'),
      tagList: corpTagMap.INDUSTRY,
    },
    {
      title: intl('329253', '企业入选名录'),
      tagList: corpTagMap.LIST,
    },
    {
      title: intl('342113', '风险标签'),
      tagList: corpTagMap.RISK,
    },
    {
      title: intl('325333', '企业产品'),
      tagList: corpTagMap.PRODUCTION,
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
      data-uc-id="Ihf5LKuoBNk"
      data-uc-ct="modalsafetype"
    >
      <div className={`${StylePrefix}--body`}>
        {tagConfigs.map((config, index) => (
          <TagGroup key={index} {...config} onTagClick={onTagClick} />
        ))}
      </div>
    </ModalSafeType>
  )
}
