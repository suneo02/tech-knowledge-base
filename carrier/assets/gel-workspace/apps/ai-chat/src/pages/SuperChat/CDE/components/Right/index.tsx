import { useChatRoomSuperContext } from '@/contexts/ChatRoom/super'
import Loading from '@/pages/Fallback/loading'
import { lazy, Suspense, useRef } from 'react'
import styles from './index.module.less'

const VisTablePage = lazy(() => import('@/pages/VisTable'))

const PREFIX = 'super-chat-cde-right'

const Right = () => {
  const { tableId, visTableRef } = useChatRoomSuperContext()
  const visTablePageDivRef = useRef<HTMLDivElement>(null)

  return (
    <div className={styles[`${PREFIX}-container`]}>
      {tableId ? (
        <div className={styles[`${PREFIX}-container-content`]} ref={visTablePageDivRef}>
          <Suspense fallback={<Loading />}>
            <VisTablePage key={tableId} tableId={tableId} ref={visTableRef} />
          </Suspense>
        </div>
      ) : (
        <div className={styles[`${PREFIX}-container-loading`]}>
          <Loading />
        </div>
      )}
    </div>
  )
}

export default Right
