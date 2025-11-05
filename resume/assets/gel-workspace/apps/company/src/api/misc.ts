import { myWfcAjax } from '@/api/common.ts'

export const apiTranslate = async (data) => {
  return myWfcAjax<any>('apitranslates', data)
}
