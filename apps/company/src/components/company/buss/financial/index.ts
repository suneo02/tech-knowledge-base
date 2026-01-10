/**
 * 财务模块入口：创建服务实例并导出主要组件、Provider 与工具。
 * @author yxlu.calvin
 * @example
 * import { FinancialStatement, FinancialFiltersProvider, financialService } from '@/components/company/buss/financial'
 * <FinancialFiltersProvider>
 *   <FinancialStatement companyCode="600000" variant="domestic" service={financialService} />
 * </FinancialFiltersProvider>
 */
import { createFinancialDataClient } from './infrastructure/api/financialDataClient'
import { createFinancialStatementService } from './application/services/financialStatementService'
import { createFinancialFiltersClient } from './infrastructure/api/financialFiltersClient'
import { createConfigProvider } from './application/services/financialStatementService'
import { financialVariants } from './config/variants'
import { FinancialStatement as FinancialStatementComponent } from './presentation/components/FinancialStatement'
import { FinancialFiltersProvider } from './application/contexts/financialFilters'
// 创建服务实例
const dataClient = createFinancialDataClient({
  timeout: 30000,
  useMockOnError: false,
})

const configProvider = createConfigProvider(financialVariants)
const filtersClient = createFinancialFiltersClient({ timeout: 30000 })
const financialService = createFinancialStatementService(dataClient, filtersClient, configProvider)

// 导出主要组件和服务
export { FinancialStatement } from './presentation/components/FinancialStatement'
export { FinancialFiltersProvider } from './application/contexts/financialFilters'
export { financialService }
export { financialVariants }
export { UNIT_SCALES } from './domain/value-objects/unitScale'

// 默认导出
export default {
  FinancialStatement: FinancialStatementComponent,
  FinancialFiltersProvider,
  financialService,
  financialVariants,
}
