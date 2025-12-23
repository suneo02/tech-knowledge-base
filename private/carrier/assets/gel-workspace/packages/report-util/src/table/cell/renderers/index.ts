import { ConfigTableCellJsonConfig } from 'gel-types'
import { ReportSimpleTableCellRenderFunc } from '../type'
import { renderCurrency } from './currencyRenderers'
import { renderSimpleDate } from './dateRenderers'
import { renderNumber } from './numberRender'
import { renderRelativeType } from './relativeType'
import { renderStaticText } from './staticText'

export * from './currencyRenderers'
export * from './dateRenderers'
export * from './numberRender'
export * from './staticText'
export const reportTableCellSimpleRenderMap: Partial<
  Record<ConfigTableCellJsonConfig['renderType'], ReportSimpleTableCellRenderFunc>
> = {
  static: renderStaticText,
  number: renderNumber,
  date: renderSimpleDate,
  currency: renderCurrency,
  relativeType: renderRelativeType,
}
