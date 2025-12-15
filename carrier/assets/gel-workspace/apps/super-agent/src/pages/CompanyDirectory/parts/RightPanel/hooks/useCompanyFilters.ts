// import { useMemo, useState } from 'react'

// export interface UseCompanyFiltersResult<T extends Record<string, unknown>> {
//   search: string
//   setSearch: (v: string) => void
//   includeList: string[]
//   excludeList: string[]
//   setIncludeList: (v: string[]) => void
//   setExcludeList: (v: string[]) => void
//   filteredData: T[]
// }

// export const useCompanyFilters = <T extends Record<string, unknown>>(
//   data: T[] | undefined
// ): UseCompanyFiltersResult<T> => {
//   const [search, setSearch] = useState('')
//   const [includeList, setIncludeList] = useState<string[]>([])
//   const [excludeList, setExcludeList] = useState<string[]>([])

//   const filteredData = useMemo<T[]>(() => {
//     const base: T[] = Array.isArray(data) ? [...data] : []
//     let list: T[] = base
//     const q = (search || '').trim().toLowerCase()
//     if (q) {
//       list = list.filter((row: T) => {
//         const name: string = String((row as any)?.name ?? '')
//         const desc: string = String((row as any)?.description ?? '')
//         return name.toLowerCase().includes(q) || desc.toLowerCase().includes(q)
//       })
//     }
//     if (includeList.length > 0) {
//       list = list.filter((row: T) => includeList.some((kw) => String((row as any)?.name ?? '').includes(kw)))
//     }
//     if (excludeList.length > 0) {
//       list = list.filter((row: T) => !excludeList.some((kw) => String((row as any)?.name ?? '').includes(kw)))
//     }
//     return list
//   }, [data, search, includeList, excludeList])

//   return {
//     search,
//     setSearch,
//     includeList,
//     excludeList,
//     setIncludeList,
//     setExcludeList,
//     filteredData,
//   }
// }
