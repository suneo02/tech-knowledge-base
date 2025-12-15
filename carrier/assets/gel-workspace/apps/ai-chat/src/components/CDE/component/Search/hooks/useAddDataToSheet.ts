import { createWFCSuperlistRequestFcs } from '@/api'
import { useRequest } from 'ahooks'

const addDataToSheetFunc = createWFCSuperlistRequestFcs('superlist/excel/addDataToSheet')
export const useAddDataToSheet = (onAddFinish: (res: Awaited<ReturnType<typeof addDataToSheetFunc>>) => void) => {
  const { run: addDataToSheet, loading } = useRequest<
    Awaited<ReturnType<typeof addDataToSheetFunc>>,
    Parameters<typeof addDataToSheetFunc>
  >(addDataToSheetFunc, {
    onSuccess: (res) => {
      onAddFinish?.(res)
    },
    onError: (error) => {
      console.error(error)
    },
    manual: true,
  })
  return { addDataToSheet, loading }
}
