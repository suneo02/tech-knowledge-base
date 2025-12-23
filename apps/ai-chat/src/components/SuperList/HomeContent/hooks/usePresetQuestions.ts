import { requestToChat } from '@/api'
import { getCurrentLanguage } from '@/utils/langSource'
import { ChatQuestion } from 'gel-api'
import { useEffect, useState } from 'react'

export const usePresetQuestions = () => {
  const [presetQuestions, setPresetQuestions] = useState<ChatQuestion[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPresetQuestions = async () => {
    setLoading(true)
    try {
      const res = await requestToChat('getQuestion', {
        questionsType: 0,
        questionsPlatform: 'WindEntSuperList',
        pageSize: 6,
        lang: getCurrentLanguage(),
      })
      setPresetQuestions(res?.Data || [])
    } catch (error) {
      console.error('Failed to fetch preset questions:', error)
      setPresetQuestions([]) // Set to empty array on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPresetQuestions()
  }, [])

  return { presetQuestions, loading }
}
