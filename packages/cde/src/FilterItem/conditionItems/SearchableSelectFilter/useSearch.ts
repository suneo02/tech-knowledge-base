import { CDEFilterOption, CDERankQueryFilterValue } from 'gel-api'
import { debounce } from 'lodash'
import { useState } from 'react'
import { CDEFilterItemApi } from '../type'
import { mapItemOptionsToOptionItems } from './utils'

/**
 * Custom hook for search functionality
 * @param itemType - Type of item being searched
 * @param itemOption - Array of item options
 * @param getBFSD - Function to fetch track data
 * @param getBFYQ - Function to fetch park data
 * @returns Search-related state and functions
 */
export const useSearch = (
  itemType: string,
  itemOption: CDEFilterOption[] | undefined,
  getBFSD?: CDEFilterItemApi['getBFSD'],
  getBFYQ?: CDEFilterItemApi['getBFYQ'],
  getCorpListPresearch?: CDEFilterItemApi['getCorpListPresearch']
) => {
  const [options, setOptions] = useState<Omit<CDERankQueryFilterValue, 'name'>[]>([])
  const [fetching, setFetching] = useState(false)
  const isCorpLists = itemType === '91'

  // Load initial options for corporate lists
  const loadInitialOptions = () => {
    if (isCorpLists && itemOption?.length) {
      setOptions(mapItemOptionsToOptionItems(itemOption))
    }
  }

  /**
   * Debounced function to fetch options based on search input
   */
  const debouncedFetchOptions = debounce(async (value: string) => {
    if (!value) {
      if (isCorpLists && itemOption?.length) {
        setOptions(mapItemOptionsToOptionItems(itemOption))
      } else {
        setOptions([])
      }
      return
    }

    setFetching(true)
    setOptions([])

    try {
      if (isCorpLists) {
        // Local filtering for corp lists
        const filteredOptions = mapItemOptionsToOptionItems(
          itemOption?.filter((t) => {
            const reg = new RegExp(value, 'gi')
            return reg.test(t.name)
          }) || []
        )

        setOptions(filteredOptions)
      } else if (itemType === 'park_id' && getBFYQ) {
        // Remote search for parks
        const res = await getBFYQ(value)
        if (res.resultCode === '200' && res.resultData?.dataList?.length) {
          const opts = res.resultData.dataList.map((t: any) => ({
            label: t.parkName.replace(/<em>|<\/em>/g, ''),
            value: t.parkId,
            objectId: t.parkId,
            objectName: t.parkName.replace(/<em>|<\/em>/g, ''),
          })) as CDERankQueryFilterValue[]
          setOptions(opts)
        }
      } else if (itemType === 'track_id' && getBFSD) {
        // Remote search for tracks
        const res = await getBFSD(value)
        if (res.resultCode === '200' && res.resultData?.length) {
          const opts = res.resultData.map((t: any) => ({
            label: t.name.replace(/<em>|<\/em>/g, ''),
            value: t.code,
            objectId: t.code,
            objectName: t.name.replace(/<em>|<\/em>/g, ''),
          })) as CDERankQueryFilterValue[]
          setOptions(opts)
        }
      } else {
        const res = await getCorpListPresearch?.(value)
        console.log('🚀 ~ res:', res)
        if (res && res.Data) {
          setOptions(
            res.Data.map((t) => ({
              label: t.objectName,
              value: t.objectId,
              objectId: t.objectId,
              objectName: t.objectName,
            }))
          )
        }
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setFetching(false)
    }
  }, 300)

  return {
    options,
    fetching,
    loadInitialOptions,
    debouncedFetchOptions,
  }
}
