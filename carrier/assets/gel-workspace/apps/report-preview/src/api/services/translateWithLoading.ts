import { store } from '@/store'
import { decrementTranslateTask, incrementTranslateTask } from '@/store/translation'
import { apiTranslate } from './translate'

export const apiTranslateWithLoading = async (data: any) => {
  store.dispatch(incrementTranslateTask())
  try {
    const result = await apiTranslate(data)
    return result
  } finally {
    store.dispatch(decrementTranslateTask())
  }
}
