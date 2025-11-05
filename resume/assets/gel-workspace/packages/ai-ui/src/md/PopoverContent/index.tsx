import { RefModal } from '@/ChatRoles/components/suggestion/comp/modal'
import { useRefLink } from '@/hooks/useRefLink'
import { Button } from '@wind/wind-ui'
import { AxiosInstance } from 'axios'
import { QueryReferenceSuggest, QueryReferenceSuggestType } from 'gel-api'
import { t } from 'gel-util/intl'
import { RefTag } from '../../ChatRoles/components/suggestion/comp/RefTag/RefTag'
import './popoverContent.less'

type PopoverContentProps = {
  refData: QueryReferenceSuggest
  positions: Array<{ start: string; end: string }>
  isDev: boolean
  wsid: string
  entWebAxiosInstance: AxiosInstance
}
/**
 * 溯源弹窗内容 reg数据
 * @param positions 位置
 * @param text 文本
 * @returns
 */
export const PopoverContent = ({ refData, positions = [], isDev, wsid, entWebAxiosInstance }: PopoverContentProps) => {
  const { text, content, publishdate, publish_date, type } = refData
  const { handleRefJump, showModal, closeModal, tagText } = useRefLink(refData, isDev, wsid, entWebAxiosInstance)

  // 根据positions生成带高亮的HTML内容
  const getHighlightedContent = () => {
    if (!content) return null

    // 复制一份positions并按start降序排序
    const sortedPositions = [...positions].sort((a, b) => parseInt(b.start) - parseInt(a.start))

    let highlightedContent = content

    // 从后往前插入mark标签，避免位置偏移
    sortedPositions.forEach((pos) => {
      const start = parseInt(pos.start)
      const end = parseInt(pos.end)

      // 跳过无效位置
      if (isNaN(start) || isNaN(end) || start < 0 || start >= content.length) {
        return
      }

      const beforeMark = highlightedContent.substring(0, start)
      const markContent = highlightedContent.substring(start, end)
      const afterMark = highlightedContent.substring(end)

      highlightedContent = beforeMark + `<mark>${markContent}</mark>` + afterMark
    })

    return highlightedContent
  }

  // 只保留年月日 2025-04-01 09:46:30
  const publishDate = publishdate || publish_date || ''
  const formatPublishDate = publishDate.replace(/(\d{4})-(\d{2})-(\d{2}).*/, '$1-$2-$3')
  // 默认返回基本内容
  return (
    <div className="source-popover">
      <div className="source-popover--title">
        <RefTag tagType={type as QueryReferenceSuggestType} tagText={tagText} size="large" />
        <div className="source-popover--title-text" title={text}>
          {text}
        </div>
      </div>
      <div className="source-popover--scroll">
        {content && <div dangerouslySetInnerHTML={{ __html: getHighlightedContent() || '' }} />}
      </div>
      <div className="source-popover--footer">
        <Button type="link" style={{ padding: 0 }} onClick={handleRefJump}>
          {t('417677', '查看原文')}
        </Button>
        <span>
          {t('274151', '发布时间')}: {formatPublishDate}
        </span>
      </div>
      <RefModal showModal={showModal} closeModal={closeModal} />
    </div>
  )
}
