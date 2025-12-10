import React, { useState, useContext, createContext, useMemo, useCallback, ComponentType } from 'react'

// Modal Components
import { ChatCDEModals } from '@/components/CDE/SuperChat/ChatCDEModals'
import { BulkImportForChat, BulkImportModalLocal } from '@/components/Indicator/BulkImport'
import { IndicatorTreePanelLocal } from '@/components/Indicator/TreePanel'
import { CDEFilterPreviewModalIndependent } from '@/components/CDE/SuperHome/CDEFilterAndPreview'

// Base props for modals opened via useModal
type BaseModalProps<T extends unknown[] = unknown[]> = {
  onFinish?: (...args: T) => void
  onCancel?: () => void
}

type BulkImportFinishData = {
  header: {
    companyCode: string
    [key: string]: string
  }
  dataList: {
    companyCode: string
    [key: string]: string
  }[]
}

// Specific props for each modal type
type ChatCDEModalProps = { tableId?: string; sheetId?: number; canAddCdeToCurrent?: boolean } & BaseModalProps
type IndicatorTreePanelLocalProps = {
  tableId: string
  sheetId: number
  width?: string
  height?: string
} & BaseModalProps
type BulkImportForChatProps = { tableId: string; sheetId: number } & BaseModalProps<[BulkImportFinishData, string]>
type CDEFilterPreviewModalIndependentProps = {
  //   container: React.RefObject<HTMLElement>['current']
  confirmLoading?: boolean
  confirmText?: string
  sheetId?: number
} & BaseModalProps
type BulkImportModalLocalProps = { loading?: boolean; sheetId?: number } & BaseModalProps<
  [BulkImportFinishData, string]
>

// A map from modal type to its props
export type ModalPropsMap = {
  chatCDE: ChatCDEModalProps
  indicatorTree: IndicatorTreePanelLocalProps
  bulkImportChat: BulkImportForChatProps
  cdeHome: CDEFilterPreviewModalIndependentProps
  bulkImportHome: BulkImportModalLocalProps
}

export type ModalType = keyof ModalPropsMap

// The actual modal components accept more props than defined here, so `any` is a pragmatic choice.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MODAL_COMPONENTS: { [key in ModalType]: ComponentType<any> } = {
  chatCDE: ChatCDEModals,
  indicatorTree: IndicatorTreePanelLocal,
  bulkImportChat: BulkImportForChat,
  cdeHome: CDEFilterPreviewModalIndependent,
  bulkImportHome: BulkImportModalLocal,
}

type ActiveModalState = {
  [T in ModalType]: {
    type: T
    props: ModalPropsMap[T]
  }
}[ModalType]

type ModalState = ActiveModalState | { type: null; props: Record<string, never> }

interface ModalContextType {
  openModal: <T extends ModalType>(type: T, props: ModalPropsMap[T]) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a GlobalModalProvider')
  }
  return context
}

export const GlobalModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modal, setModal] = useState<ModalState>({ type: null, props: {} })

  const openModal = useCallback(<T extends ModalType>(type: T, props: ModalPropsMap[T]) => {
    setModal({ type, props } as ActiveModalState)
  }, [])

  const closeModal = useCallback(() => {
    setModal({ type: null, props: {} })
  }, [])

  const modalContextValue = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal])

  const renderModal = () => {
    if (!modal.type) {
      return null
    }

    const ModalComponent = MODAL_COMPONENTS[modal.type]
    if (!ModalComponent) {
      return null
    }

    const { onFinish, onCancel, ...restProps } = modal.props

    const handleFinish = (...args: unknown[]) => {
      if (onFinish) {// @ts-expect-error ttt
        onFinish(...args)
      }
      closeModal()
    }
    const handleCancel = () => {
      if (onCancel) {
        onCancel()
      }
      closeModal()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let adaptedProps: any

    switch (modal.type) {
      case 'chatCDE':
        adaptedProps = {
          ...restProps,
          actionModal: 'cde',
          setActionModal: (value?: string) => {
            if (!value) closeModal() // Special handling for this modal's closing mechanism
          },
          onAddFinish: handleFinish,
        }
        break
      case 'indicatorTree':
        adaptedProps = {
          ...restProps,
          open: true,
          close: handleCancel,
          onFinish: handleFinish,
        }
        break
      case 'bulkImportChat':
        adaptedProps = {
          ...restProps,
          open: true,
          handleCancel: handleCancel,
          onFinish: handleFinish,
        }
        break
      case 'cdeHome':
        adaptedProps = {
          ...restProps,
          open: true,
          close: handleCancel,
          onFinish: handleFinish,
        }
        break
      case 'bulkImportHome':
        adaptedProps = {
          ...restProps,
          open: true,
          handleCancel: handleCancel,
          onFinish: handleFinish,
        }
        break
      default:
        adaptedProps = {
          ...restProps,
          open: true,
          onClose: handleCancel,
          onCancel: handleCancel,
          onFinish: handleFinish,
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <ModalComponent {...(adaptedProps as any)} />
  }

  return (
    <ModalContext.Provider value={modalContextValue}>
      {children}
      {renderModal()}
    </ModalContext.Provider>
  )
}
