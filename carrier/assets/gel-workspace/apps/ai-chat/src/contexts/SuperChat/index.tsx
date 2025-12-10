import { ReactNode, useState } from 'react'
import { ConversationProvider, useConversationContext } from './ConversationContext'
import { SheetProvider, useSheetContext } from './SheetContext'
import { TableProvider, useTableContext } from './TableContext'

export const useSuperChatRoomContext = () => {
  const conversation = useConversationContext()
  const table = useTableContext()
  const sheet = useSheetContext()

  return {
    ...conversation,
    ...table,
    ...sheet,
  }
}

const Providers = ({ children }: { children: ReactNode }) => {
  const { tableId, conversationId } = useConversationContext()
  const [activeSheetId, setActiveSheetId] = useState<string>('')
  return (
    <TableProvider tableId={tableId} conversationId={conversationId} setActiveSheetId={setActiveSheetId}>
      <SheetProvider activeSheetId={activeSheetId} setActiveSheetId={setActiveSheetId}>
        {children}
      </SheetProvider>
    </TableProvider>
  )
}

export const SuperChatRoomProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ConversationProvider>
      <Providers>{children}</Providers>
    </ConversationProvider>
  )
}
