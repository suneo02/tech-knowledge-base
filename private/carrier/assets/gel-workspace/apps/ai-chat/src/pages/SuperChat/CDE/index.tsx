import { ProgressGuardProvider } from '@/components/ProgressGuard'
import { ChatRoomSuperProvider } from '@/contexts/ChatRoom/super'
import { Container } from './components/Container'
import { ConversationsSuperProvider, PresetQuestionSuperProvider } from 'ai-ui'
import { CdeProvider } from './context/CdeContext'

const CDE = () => {
  return (
    <ProgressGuardProvider>
      <ChatRoomSuperProvider>
        <PresetQuestionSuperProvider>
          <ConversationsSuperProvider>
            <CdeProvider>
              <Container />
            </CdeProvider>
          </ConversationsSuperProvider>
        </PresetQuestionSuperProvider>
      </ChatRoomSuperProvider>
    </ProgressGuardProvider>
  )
}

export default CDE
