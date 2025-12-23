import { SmartFillProvider } from '@/components/VisTable/context/SmartFillContext'
import { SuperChatRoomProvider, useSuperChatRoomContext } from '@/contexts/SuperChat'
import { DevProvider } from '@/dev'
import { Skeleton } from '@wind/wind-ui'
import { ConversationsSuperProvider } from 'ai-ui'
import cx from 'classnames'
import { Suspense, lazy } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Left } from '../SuperChat/CDE/components/Left'
import { CdeProvider } from '../SuperChat/CDE/context/CdeContext'
import Right from './Right'
import Toolbar from './Right/Toolbar'
import styles from './index.module.less'
import { TableAITaskProvider } from '@/components/ETable/context/TableAITaskContext'
import { t } from 'gel-util/intl'
import { postPointBuried } from '@/utils/common/bury'
import { useSize } from 'ahooks'
import { fetchUserInfo, selectUserInfo, useAppSelector } from '@/store'

const PREFIX = 'progress-guard-demo'

const ChatMessageSuper = lazy(() =>
  import('@/components/SuperList/ChatMessage').then((module) => ({ default: module.ChatMessageSuper }))
)

export const ProgressGuardDemoContainer = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const size = useSize(tableContainerRef.current)
  const { roomId } = useSuperChatRoomContext()
  const [showChat, setShowChat] = useState(true)
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')

  const isCDE = type === 'CDE'
  console.log('🚀 ~ ProgressGuardDemoContainer ~ isCDE:', isCDE)

  const renderContent = () => {
    if (isCDE) {
      return <Left setShowChat={setShowChat} />
    }
    // Add other conditions for other types
    // else if (type === 'some-other-type') {
    //   return <div>Another interface</div>
    // }
    return (
      <Suspense fallback={<Skeleton animation />}>
        <ChatMessageSuper key={`chat-messages-${roomId}`} setShowChat={setShowChat} />
      </Suspense>
    )
  }

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div className={styles[`${PREFIX}-header`]}>
        <Toolbar showHome showTableNameEditor showUser showSubscribe={isCDE} showDownload />
      </div>
      <div className={styles[`${PREFIX}-content`]}>
        <div className={cx(styles[`${PREFIX}-content-left`], { [styles.hide]: !showChat })}>
          {/* <DebugContainer /> */}
          {renderContent()}
        </div>
        <div className={styles[`${PREFIX}-content-right`]} ref={tableContainerRef}>
          <Right showChat={showChat} setShowChat={setShowChat} height={size?.height} />
        </div>
      </div>
    </div>
  )
}

const TaskContainer = () => {
  const { activeSheetId } = useSuperChatRoomContext()
  return (
    <TableAITaskProvider sheetId={Number(activeSheetId)}>
      <ConversationsSuperProvider>
        <CdeProvider>
          <ProgressGuardDemoContainer />
        </CdeProvider>
      </ConversationsSuperProvider>
    </TableAITaskProvider>
  )
}

const ProgressGuardDemoPage = () => {
  useEffect(() => {
    document.title = t('464234', '一句话找企业')
    postPointBuried('922604570324')
  }, [])
  return (
    <DevProvider>
      <SmartFillProvider>
        <SuperChatRoomProvider>
          <TaskContainer />
        </SuperChatRoomProvider>
      </SmartFillProvider>
    </DevProvider>
  )
}

export default ProgressGuardDemoPage
