import { requestToWFCSecure } from '@/api'
import { isCorpListPresearchResponse } from 'gel-api'

export const getCorpListPresearch = async (val) => {
  const res = await requestToWFCSecure(
    { cmd: 'corplistpresearch' },
    { keyword: val },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )
  if (!res) {
    return
  }
  if (isCorpListPresearchResponse(res)) {
    console.log('🚀 ~ getCorpListPresearch ~ res:', res)
    const { Data, ...rest } = res
    return {
      Data: Data.map((r) => ({
        ...r,
        objectName: r.objectName.replace(/<[^>]+>/g, ''),
      })),
      ...rest,
    }
  } else {
    console.error('get error', res)
    return
  }
}
