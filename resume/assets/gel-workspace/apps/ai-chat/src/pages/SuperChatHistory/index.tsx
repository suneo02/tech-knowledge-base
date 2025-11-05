import { createSuperlistRequestFcs } from '@/api/handleFcs'
import { HistoryConversation } from '@/components/SuperList/HistoryConversation'
import { HomeSider } from '@/components/SuperList/HomeSider'
import { useRequest } from 'ahooks'
import { ApiCodeForWfc, ApiPageForSuperlist } from 'gel-api'
import styles from './index.module.less'

/**
 * @deprecated 请使用 SuperHome 组件
 * @returns
 */
const SuperChatHistory = () => {
  const [page, setPage] = useState<ApiPageForSuperlist>({
    pageNo: 0, // 从 0 开始
    pageSize: 10,
    total: 0,
  })

  const {
    run: fetchConversationHistory,
    loading,
    data,
  } = useRequest(createSuperlistRequestFcs('conversation/conversationList'), {
    onSuccess: (data) => {
      if (data.ErrorCode === ApiCodeForWfc.SUCCESS && data?.Data?.page) {
        setPage((prev) => ({
          ...prev,
          total: data.Data.page.total,
        }))
      }
    },
    onError: console.error,
    manual: true,
  })

  useEffect(() => {
    fetchConversationHistory({
      pageNo: page.pageNo,
      pageSize: page.pageSize,
    })
  }, [fetchConversationHistory, page.pageNo, page.pageSize])

  const conversations = useMemo(() => {
    return data?.Data?.list || []
  }, [data])

  const handlePageChange = (pageNo: number, pageSize: number) => {
    setPage((prev) => ({
      ...prev,
      pageNo: pageNo - 1,
      pageSize: pageSize,
    }))
    fetchConversationHistory({
      pageNo: pageNo - 1,
      pageSize: pageSize,
    })
  }
  return (
    <div className={styles.superChatHistory}>
      <HomeSider />
      <HistoryConversation
        className={styles.historyConversation}
        page={page}
        loading={loading}
        onPageChange={handlePageChange}
        conversations={conversations}
      />
    </div>
  )
}

export default SuperChatHistory
