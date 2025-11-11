/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect } from 'react'
import { useMap } from 'ahooks'
import { CustomComponentProps, ItemOptionItem } from '../../../types'
import { DateRangeValue, formatDateRange, parseDateString } from '../../utils/date'
import { SelectedItem } from './SelectedItemTag'

type InitialValue = {
  logic?: 'any' | 'notAny' | 'all'
  value?: {
    objectName: string
    objectId: string
    validDate: number
    objectDate?: string
    [key: string]: any
  }[]
  [key: string]: any
}

export const useItemManagement = ({ value, itemOption = [], onChange }: CustomComponentProps) => {
  const initialValue = value as InitialValue | undefined
  const [logic, setLogic] = useState<'any' | 'notAny' | 'all'>(initialValue?.logic || 'any')
  const [selectedItems, { set, remove, get, setAll }] = useMap<string, SelectedItem>([])

  // Effect to initialize and sync state from props
  useEffect(() => {
    const initialSelectedItems = new Map<string, SelectedItem>()
    const initialLogic = initialValue?.logic || 'any'
    setLogic(initialLogic)

    if (initialValue?.value) {
      initialValue.value.forEach((item) => {
        const { objectId, objectName, validDate, objectDate, ...rest } = item
        const selectedItem: SelectedItem = {
          ...rest,
          id: objectId,
          name: objectName,
          value: objectId,
          validDate: validDate,
          dateRange: parseDateString(objectDate) as DateRangeValue,
        }
        initialSelectedItems.set(objectId, selectedItem)
      })
    }
    setAll(initialSelectedItems)
  }, [value, setAll])

  const notifyChange = (currentLogic: 'any' | 'notAny' | 'all', currentItems: Map<string, SelectedItem>) => {
    if (!onChange) return

    const itemsToEmit = Array.from(currentItems.values()).map((item) => {
      const { dateRange, ...remaning } = item
      return {
        ...remaning,
        objectName: item.name,
        objectId: item.id,
        objectDate: dateRange ? formatDateRange(dateRange) : undefined,
      }
    })

    onChange({
      logic: currentLogic,
      value: itemsToEmit,
    } as any)
  }

  const handleLogicChange = (newLogic: 'any' | 'notAny' | 'all') => {
    setLogic(newLogic)
    notifyChange(newLogic, selectedItems)
  }

  const handleSelect = (itemId: string) => {
    const options = itemOption as ItemOptionItem[]
    const option = options.find((opt) => opt.id === itemId)
    if (option && !get(itemId)) {
      const newItem: SelectedItem = { ...option, dateRange: undefined }
      const newItems = new Map(selectedItems)
      newItems.set(itemId, newItem)
      set(itemId, newItem)
      notifyChange(logic, newItems)
    }
  }

  const handleRemove = (itemToRemove: SelectedItem) => {
    const newItems = new Map(selectedItems)
    newItems.delete(itemToRemove.id as string)
    remove(itemToRemove.id as string)
    notifyChange(logic, newItems)
  }

  const handleDateChange = (itemToUpdate: SelectedItem, dates: DateRangeValue) => {
    const updatedItem = { ...itemToUpdate, dateRange: dates }
    const newItems = new Map(selectedItems)
    newItems.set(itemToUpdate.id as string, updatedItem)
    set(itemToUpdate.id as string, updatedItem)
    notifyChange(logic, newItems)
  }

  const availableOptions = useMemo(() => {
    const options = itemOption as ItemOptionItem[]
    return options.filter((option) => !selectedItems.has(option.id as string))
  }, [itemOption, selectedItems])

  return {
    logic,
    selectedItems: Array.from(selectedItems.values()),
    availableOptions,
    handleLogicChange,
    handleSelect,
    handleRemove,
    handleDateChange,
  }
}
