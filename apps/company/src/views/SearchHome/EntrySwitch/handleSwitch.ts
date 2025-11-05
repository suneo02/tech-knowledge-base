import { getHomeEntryList } from '@/views/HomeAI/comp/RecommendFunc/config'
import { useEffect, useMemo, useState } from 'react'
import { wftCommon } from '@/utils/utils.tsx'

/**
 * Helper function to shuffle an array using the Fisher-Yates algorithm.
 *
 * @param array - The array to shuffle.
 * @returns The shuffled array.
 */
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index j such that 0 ≤ j ≤ i
    const j = Math.floor(Math.random() * (i + 1))

    // Swap elements at indices i and j
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
/**
 * Custom hook that returns num random items from the list, ensuring all items are used before reshuffling.
 *
 * @param list - The constant array from which to select items.
 * @param num - The number of random items to select.
 * @returns An array containing num random items from the list.
 */
function useRandomItems<T>(list: T[], num: number): [T[], Function] {
  // State to keep track of remaining items to select from
  const [remainingItems, setRemainingItems] = useState<T[]>([])
  // State to hold the current random items
  const [randomItems, setRandomItems] = useState<T[]>([])
  // State to track if it's the first load
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useEffect(() => {
    // Initialize the remainingItems with a shuffled version of the list
    setRemainingItems(shuffleArray([...list]))
    // On first load, set the first num items
    if (isFirstLoad) {
      setRandomItems(list.slice(0, num))
      setIsFirstLoad(false)
    }
  }, [list])

  // Function to get the next set of random items
  const getNextItems = () => {
    let updatedRemainingItems = [...remainingItems]

    // If there are not enough items left, reshuffle the list
    if (updatedRemainingItems.length < num) {
      updatedRemainingItems = shuffleArray([...list])
    }

    // Select the next num items
    const selectedItems = updatedRemainingItems.slice(0, num)

    // Update the remaining items
    updatedRemainingItems = updatedRemainingItems.slice(num)

    // Update states
    setRandomItems(selectedItems)
    setRemainingItems(updatedRemainingItems)
  }

  useEffect(() => {
    // Only call getNextItems on initial load if it's not the first load
    if (!isFirstLoad) {
      getNextItems()
    }
  }, [list, num])

  return [randomItems, getNextItems]
}

export const useRandomEntryList = () => {
  const homeEntryList = useMemo(() => {
    return getHomeEntryList()
  }, [wftCommon.is_overseas_config])
  const [entryListRandom, entrySwitcher] = useRandomItems(homeEntryList, 5)
  return [entryListRandom, entrySwitcher]
}
