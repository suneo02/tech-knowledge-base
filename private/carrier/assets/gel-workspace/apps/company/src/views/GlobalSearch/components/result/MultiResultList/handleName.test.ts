import { isEn } from 'gel-util/intl'
import { detectChinese, detectEnglish } from 'gel-util/misc'

// 导入待测试的函数 - 需要导出 handleItem
// import { handleItem } from './handleName'

// Mock 依赖
jest.mock('gel-util/intl', () => ({
  isEn: jest.fn(),
}))

jest.mock('gel-util/misc', () => ({
  detectChinese: jest.fn(),
  detectEnglish: jest.fn(),
}))

const mockIsEn = isEn as jest.MockedFunction<typeof isEn>
const mockDetectChinese = detectChinese as jest.MockedFunction<typeof detectChinese>
const mockDetectEnglish = detectEnglish as jest.MockedFunction<typeof detectEnglish>

describe('handleItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('英文环境 (isEn = true)', () => {
    beforeEach(() => {
      mockIsEn.mockReturnValue(true)
    })

    it('应该保持原始英文名称不变（企业名称是英文）', () => {
      // TODO: 添加测试用例
    })

    it('应该保持原始名称不变（企业已有翻译名称）', () => {
      // TODO: 添加测试用例
    })

    it('应该使用 AI 翻译（企业名称是中文且无翻译名称）', () => {
      // TODO: 添加测试用例
    })
  })

  describe('中文环境 (isEn = false)', () => {
    beforeEach(() => {
      mockIsEn.mockReturnValue(false)
    })

    it('应该展示中文名称 + 英文名称（企业名称是中文）', () => {
      // TODO: 添加测试用例
    })

    it('应该使用后端提供的翻译（非中文企业且有翻译名称）', () => {
      // TODO: 添加测试用例
    })

    it('应该使用 AI 翻译（非中文企业且无翻译名称）', () => {
      // TODO: 添加测试用例
    })
  })
})
