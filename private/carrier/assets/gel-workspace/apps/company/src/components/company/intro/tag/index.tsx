import { getCompanyTags } from '@/api/companyApi'
import { handleJumpTerminalCompatibleAndCheckPermission } from '@/handle/link'
import { isDev } from '@/utils/env'
import { translateComplexHtmlData } from '@/utils/intl'
import { useRequest } from 'ahooks'
import { CorpTag } from 'gel-api'
import { CorpBasicInfo } from 'gel-types'
import { CorpTagInDetail } from 'gel-ui'
import { getCorpTagClickHandler, splitTags2ArrByModule } from 'gel-util/biz'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import styleModule from './index.module.less'
import { CorpShowMoreTags } from './misc'
import { CompanyMoreTagsModal } from './MoreTag'
import { OverseaTagComp } from './overseaTagComp'
import { CorpTagTrans } from './type'

/**
 * 产品词标签 展示上限
 */
const PRODUCT_WORD_TAG_MAX_COUNT = 5

/**
 * TODO 翻译，有链接跳转时的样式
 * @param corpTags 标签列表
 * @returns 翻译后的标签列表
 */
export const CompanyDetailTags: FC<{
  companyCode: string
  corpBasicInfo: Partial<CorpBasicInfo>
  onJumpRisk?: (url: string) => void
}> = ({ companyCode, corpBasicInfo, onJumpRisk }) => {
  const [moreTagsModalOpen, setMoreTagsModalOpen] = useState(false)
  const { data, loading } = useRequest(() => getCompanyTags(companyCode), {
    refreshDeps: [companyCode],
  })

  const corpTagsRaw = useMemo(() => {
    return data?.Data || []
  }, [data])

  const [corpTagsTrans, setCorpTagsTrans] = useState<CorpTagTrans[]>([])
  useEffect(() => {
    console.log('🚀 ~ CompanyDetailTags ~ corpTagsRaw:', corpTagsRaw)
    translateComplexHtmlData(corpTagsRaw).then((res) => {
      setCorpTagsTrans(res.map((tag, index) => ({ ...tag, nameOriginal: corpTagsRaw[index]?.name || '' })))
    })
  }, [corpTagsRaw])

  const getTagClickHandler = useCallback(
    (corpTag: CorpTag) => {
      // 获取标签点击处理函数，如果标签有跳转链接，则返回跳转函数，否则返回空函数，这个逻辑设计到是否展示 可跳转样式
      const clickHandler = getCorpTagClickHandler(corpTag, {
        onJumpTerminalCompatible: handleJumpTerminalCompatibleAndCheckPermission,
        onJumpRisk,
        isDev: isDev,
      })
      if (clickHandler) {
        return (corpTag: CorpTag, e: React.MouseEvent<HTMLDivElement>) => {
          clickHandler(corpTag, e)
          setMoreTagsModalOpen(false)
        }
      }
      // 没有跳转链接，则返回空函数，不展示可跳转样式
      return
    },
    [onJumpRisk]
  )

  const ifProductTagOverMaxCount = useMemo(() => {
    return corpTagsRaw.filter((tag) => tag.module === 'PRODUCTION').length > PRODUCT_WORD_TAG_MAX_COUNT
  }, [corpTagsRaw])

  // 过滤标签，对于 PRODUCTION 模块的标签只保留前 PRODUCT_WORD_TAG_MAX_COUNT 个
  const corpTagsFiltered = useMemo(() => {
    let productTagCount = 0
    return corpTagsTrans.filter((tag) => {
      // 如果不是产品标签，直接保留
      if (tag.module !== 'PRODUCTION') {
        return true
      }

      // 对于产品标签，检查是否超过限制
      if (productTagCount < PRODUCT_WORD_TAG_MAX_COUNT) {
        productTagCount++
        return true
      }

      // 超过限制的产品标签不保留
      return false
    })
  }, [corpTagsTrans])

  /**
   * 根据模块拆分标签
   */
  const corpTagsByModule = splitTags2ArrByModule(corpTagsFiltered)

  if (loading || !corpTagsTrans.length) return null

  return (
    <>
      <div className={styleModule['company-intro-tags']}>
        <OverseaTagComp corpBasicInfo={corpBasicInfo} />
        {corpTagsByModule.map((tags) =>
          tags.map((tag) => (
            <CorpTagInDetail key={tag.id} corpTag={tag} tagNameOriginal={tag.name} onClick={getTagClickHandler(tag)} />
          ))
        )}
        {ifProductTagOverMaxCount && <CorpShowMoreTags onClick={() => setMoreTagsModalOpen(true)} />}
      </div>
      <CompanyMoreTagsModal
        open={moreTagsModalOpen}
        setOpen={setMoreTagsModalOpen}
        tags={corpTagsTrans}
        onTagClick={getTagClickHandler}
      />
    </>
  )
}
