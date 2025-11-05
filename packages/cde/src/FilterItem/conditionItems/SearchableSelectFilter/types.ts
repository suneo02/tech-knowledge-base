import { CDEFilterOptionFront } from '@/types/filter.ts'
import { CDERankQueryFilterValue } from 'gel-api'

export interface InputWithSearchSelectOption {
  label: string
  value: string
  data: Partial<CDERankQueryFilterValue>
}

export type InputWithSearchSelectValue = {
  value: NonNullable<CDEFilterOptionFront['id']>
  label: string
}

/**
 * Configuration for certification years of different corporate lists.
 * Each key represents a corporate list ID or group of IDs, and the value is an array of valid certification years.
 */
export const CreditYearConfig = {
  108020113: [2013, 2014, 2015, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
  108020136: [2021, 2023],
  108020137: [2019, 2020],
  108020138: [2023],
  108020117: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
  108020115: [2009, 2014, 2015, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
  108020112: [2010, 2011, 2018, 2019, 2020, 2021, 2023, 2024],
  108020109: [2008, 2009, 2011],
  108020110: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
  '108020097,108020098,108020099': [2016, 2017, 2019, 2020, 2022, 2023, 2024],
}
