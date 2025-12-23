import { isEn } from 'gel-util/intl'
import { WIndCascadeOptionCommon, WindCascadeProps } from './type'

export const WindCascadeFieldNamesCommon: NonNullable<WindCascadeProps<WIndCascadeOptionCommon, 'code'>['fieldNames']> =
  {
    label: isEn() ? 'nameEn' : 'name',
    value: 'code',
    children: 'node',
  }
