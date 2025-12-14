import { message } from '@wind/wind-ui'
import { SelectProps } from '@wind/wind-ui/lib/select'
import { CDEFilterOption, CDERankQueryFilterValue } from 'gel-api'
import { intl } from 'gel-util/intl'
import { isArray } from 'lodash'
import { CreditYearConfig, InputWithSearchSelectOption } from './types'

/**
 * Formats options for display in the Select component
 * @param options - Array of option items
 * @returns Formatted options for the Select component
 */
export const formatSelectOptions = (options: Partial<CDERankQueryFilterValue>[]): InputWithSearchSelectOption[] => {
  return options.map((opt) => {
    if (opt.label === undefined || opt.label === null) {
      console.error('Option missing label:', opt)
    }
    if (opt.value === undefined || opt.value === null) {
      console.error('Option missing value:', opt)
    }
    return {
      label: opt.label ?? '',
      value: isArray(opt.value) ? String(opt.value[0]) : (opt.value ?? ''),
      data: opt,
    }
  })
}

/**
 * Processes selected options from the Select component
 * @param values - Selected values from the Select component
 * @param options - Selected options from the Select component
 * @returns Processed selected options or null if validation fails
 */
export const processSelectedOptions: (
  ...args: Parameters<NonNullable<SelectProps['onChange']>>
) => CDERankQueryFilterValue[] | null = (values, options) => {
  // Convert options to array format
  const optionsArray: CDERankQueryFilterValue[] = []

  if (options) {
    const optArray = isArray(options) ? options : [options]
    optArray.forEach((o) => {
      if (o && o.data) {
        optionsArray.push(o.data)
      }
    })
  }

  // Validate maximum selection limit
  if (values && isArray(values) && values.length > 5) {
    message.warning(intl('', '上限5条，请删除其他后重试'))
    return null
  }

  // Process each selected option
  return optionsArray.map((option) => {
    const optionItem = { ...option }

    // Handle certification year options for corp lists
    if (!optionItem.validDate && optionItem.certYear) {
      optionItem.selfDefine = 0
      optionItem.itemOption = []

      // Handle CreditYearConfig with type safety
      const itemId = optionItem.id?.toString()
      if (itemId && itemId in CreditYearConfig) {
        optionItem.itemOption = CreditYearConfig[itemId as keyof typeof CreditYearConfig].map((year) => ({
          name: String(year),
          value: String(year),
        }))
      }
    }

    return optionItem
  })
}

/**
 * Maps item options to option items
 * @param itemOption - Array of item options
 * @returns Array of option items
 */
export const mapItemOptionsToOptionItems = (itemOption: CDEFilterOption[]): CDERankQueryFilterValue[] => {
  return itemOption
    .filter((t) => {
      if (!t.id) {
        console.error('Item option missing id:', t)
        return false
      }
      if (!t.name) {
        console.error('Item option missing name:', t)
        return false
      }
      return true
    })
    .map((t) => ({
      label: t.name,
      objectName: t.name,
      value: t.id,
      objectId: t.id as string,
      ...t,
    })) as CDERankQueryFilterValue[]
}
