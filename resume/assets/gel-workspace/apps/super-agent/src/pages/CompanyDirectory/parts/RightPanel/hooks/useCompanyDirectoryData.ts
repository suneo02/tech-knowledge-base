import { useRequest } from 'ahooks'
import { MOCK_DATA } from '@/mock/constant'

export interface UseCompanyDirectoryDataOptions {
  selectedId?: number
  search?: string
  filters?: Record<string, unknown>
}

export const useCompanyDirectoryData = (options: UseCompanyDirectoryDataOptions) => {
  const { selectedId, search, filters } = options
  console.log('🚀 ~ useCompanyDirectoryData ~ search:', search)
  console.log('🚀 ~ useCompanyDirectoryData ~ filters:', filters)

  const request = useRequest(
    async () => {
      await new Promise((r) => setTimeout(r, 300))
      if (!selectedId) return MOCK_DATA
      return Array.isArray(MOCK_DATA)
        ? (MOCK_DATA as any[]).map((row, idx) => ({
            ...row,
            name: `${row.name}#${selectedId}-${idx + 1}`,
          }))
        : MOCK_DATA
    },
    { refreshDeps: [selectedId] }
  )

  return request
}
