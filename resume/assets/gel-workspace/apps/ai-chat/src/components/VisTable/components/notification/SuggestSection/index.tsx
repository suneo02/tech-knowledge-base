import { entWebAxiosInstance } from '@/api/entWeb'
import { getWsidDevProd } from '@/utils/env'
import { WithDPUList, WithRAGList } from 'gel-api'
import { ChatRefList } from 'gel-ui'
import { VALID_CHAT_SUGGEST_SOURCE_TYPES } from 'gel-util/common'
import { useMemo } from 'react'
import Section from '../Section'

interface SuggestSectionProps extends WithDPUList, WithRAGList {
  onModalOpen?: () => void
  onModalClose?: () => void
  defaultExpanded?: boolean
}

const SuggestSection = ({
  ragList,
  dpuList,
  onModalClose,
  onModalOpen,
  defaultExpanded = true,
}: SuggestSectionProps) => {
  const filterSuggest = ragList.filter((item) => VALID_CHAT_SUGGEST_SOURCE_TYPES.includes(item.type))
  const refLength = useMemo(() => {
    try {
      return (filterSuggest?.length ?? 0) + (dpuList?.length ?? 0)
    } catch {
      return 0
    }
  }, [filterSuggest, dpuList])

  return (
    <Section title={`参考资料（${refLength}）`} defaultExpanded={defaultExpanded}>
      <ChatRefList
        ragList={filterSuggest || []}
        isDev={false}
        wsid={getWsidDevProd()}
        entWebAxiosInstance={entWebAxiosInstance}
        dpuList={dpuList || []}
        onModalClose={onModalClose}
        onModalOpen={onModalOpen}
      />
    </Section>
  )
}

export default SuggestSection
