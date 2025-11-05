/**
 * 根据阿拉伯数字获得中文字符
 * 1 -> 一, 2 -> 二, 3 -> 三, 4 -> 四, 5 -> 五, 7 -> 七, 8 -> 八, 9 -> 九, 10 -> 十
 * 11 -> 十一, 12 -> 十二, 13 -> 十三, 14 -> 十四, 15 -> 十五, 16 -> 十六, 17 -> 十七, 18 -> 十八, 19 -> 十九, 20 -> 二十
 * 暂时处理到20
 * @param number - 阿拉伯数字
 * @returns 中文字符
 */

export const getChineseNumberByNumber = (number: number): string => {
  const chineseNumbers = [
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
    '十',
    '十一',
    '十二',
    '十三',
    '十四',
    '十五',
    '十六',
    '十七',
    '十八',
    '十九',
    '二十',
  ]
  if (number > 20) {
    console.warn(`getChineseNumberByNumber: 数字${number}超出范围，暂时处理到20`)
    return number.toString()
  }
  return chineseNumbers[number - 1]
}

// Assuming tableSectionsHelper is an existing export from this file.
// If tableSectionsHelper.generateSectionId is not available,
// a local definition would be needed, e.g.:
// const generateSectionIdInternal = (numbers: number[]): string => numbers.join('-');
// For now, we will rely on tableSectionsHelper.generateSectionId as implied by original code structure.

export const tableSectionsHelper = {
  /**
   * 生成章节的唯一标识符
   * @deprecated
   * @param relevateTableId - 章节序号数组
   * @returns 章节ID字符串
   */
  generateSectionId(relevateTableId: string): string {
    return `section-${relevateTableId}`
  },

  /**
   * 根据章节 id 获取章节 id 的原始 id
   * @deprecated
   * @param sectionId - 章节ID字符串
   * @returns 章节原始ID字符串
   */
  getRawIdFromSectionId(sectionId: string): string {
    const regex = /^section-(.+)$/
    const match = sectionId.match(regex)
    if (match) {
      return match[1]
    }
    return sectionId
  },
}

export const getSectionNumberText = (
  options: Pick<SectionHeadingOptions, 'numbers' | 'hideNumber' | 'headingLevel'>,
  isEn?: boolean
): string => {
  const { numbers, hideNumber, headingLevel } = options
  if (hideNumber) {
    return ''
  }
  if (numbers.length === 0) {
    return ''
  }
  if (headingLevel === 1 && numbers.length > 0) {
    if (isEn) {
      return numbers[0] + '. '
    } else {
      return getChineseNumberByNumber(numbers[0]) + '、'
    }
  }
  return numbers.join('.')
}

/**
 * 章节标题级别
 *  1-5 对应 h2-h6
 * 即 1 -> h2, 2 -> h3, 3 -> h4, 4 -> h5, 5 -> h6
 */
export type SectionHeadingLevel = 1 | 2 | 3 | 4 | 5

/**
 * 章节标题选项
 */
export interface SectionHeadingOptions {
  /** 自定义类名 */
  className?: string
  /** 序号数组，如 [1, 2, 3] 表示 "1.2.3" */
  numbers: number[]
  /** 标题文本 */
  title: string
  /** 是否隐藏序号 */
  hideNumber?: boolean
  /** 标题级别 (1-5)，对应 h2-h6 */
  headingLevel: SectionHeadingLevel | number
}
/**
 * 根据标题级别获得 h 标签
 * @param level - 标题级别
 * @returns h 标签
 */
export const getHeadingTagBySectionHeadingLevel = (level: SectionHeadingLevel | number): string => {
  if (level > 5) {
    return 'h6'
  }
  return `h${level + 1}`
}
