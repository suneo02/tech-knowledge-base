import { selectIsTranslating, useAppSelector } from '@/store'
import { message } from '@wind/wind-ui'
import { useEffect } from 'react'

const MESSAGE_KEY = 'translating'

export const GlobalTranslationIndicator = () => {
  const isTranslating = useAppSelector(selectIsTranslating)

  useEffect(() => {
    if (isTranslating) {
      message.loading('Translating...', 0)
    } else {
      message.destroy(MESSAGE_KEY)
    }
    return () => {
      message.destroy(MESSAGE_KEY)
    }
  }, [isTranslating])

  return null
}
