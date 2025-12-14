/**
 * 实体接口定义
 */
export interface EntityRecognition {
  /** 实体关键词（用于匹配文本） */
  key: string
  /** 实体名称 */
  name: string
  /** 实体编码 */
  code: string
  /** 实体类型（如 company、person 等），默认为 company */
  type?: string
}

/**
 * 将文本中的实体识别结果转换为 Markdown 链接格式
 *
 * 该函数会将文本中匹配的实体替换为 `[实体名称](ner:类型:编码)` 格式的 Markdown 链接。
 * 处理逻辑：
 * 1. 按实体 key 长度降序排序，优先处理较长的实体（避免短实体误匹配）
 * 2. 去重，保留相同 key 的第一个实体
 * 3. 使用占位符机制避免嵌套替换问题
 *
 * ## 设计文档
 * @see {@link file://../../../../../packages/gel-ui/docs/biz/ai-chat/md-rendering-design.md MD 文本渲染系统设计文档}
 *
 * @author 刘兴华 <xhliu.liuxh@wind.com.cn>
 * @param {string} text - 需要处理的原始文本
 * @param {EntityRecognition[] | undefined} entities - 实体识别结果数组，每个元素包含 key、name、code、type 等字段
 * @returns {string} 处理后的文本，匹配的实体已被替换为 Markdown 链接格式
 *
 * @example
 * // 场景：将公司实体转换为 Markdown 链接
 * const text = '小米科技有限责任公司成立于2010年'
 * const entities = [
 *   {
 *     key: '小米科技有限责任公司',
 *     name: '小米科技有限责任公司',
 *     code: '1047934153',
 *     type: 'company'
 *   }
 * ]
 * const result = insertEntityMarkdownLinks(text, entities)
 * // 返回: '[小米科技有限责任公司](ner:company:1047934153)成立于2010年'
 *
 * @example
 * // 场景：处理多个实体，避免短实体误匹配
 * const text = '小米科技和小米集团是同一家公司'
 * const entities = [
 *   { key: '小米', name: '小米', code: '001', type: 'company' },
 *   { key: '小米科技', name: '小米科技', code: '002', type: 'company' },
 * ]
 * const result = insertEntityMarkdownLinks(text, entities)
 * // 返回: '[小米科技](ner:company:002)和[小米](ner:company:001)集团是同一家公司'
 * // 注意：较长的 '小米科技' 优先匹配
 */
export const insertEntityMarkdownLinks = (text: string, entities: EntityRecognition[] | undefined): string => {
  if (!text || !entities?.length) return text

  // 按照 key 长度降序排序，优先处理较长的实体
  const sortedEntities = [...entities].sort((a, b) => {
    if (!a.key || !b.key) return 0
    return b.key.length - a.key.length
  })

  // 去重实体，保留相同 key 的第一个实体
  const uniqueEntities = sortedEntities.reduce<EntityRecognition[]>((acc, current) => {
    if (!acc.find((item) => item.key === current.key)) {
      acc.push(current)
    }
    return acc
  }, [])

  // 转义正则表达式特殊字符
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  // 使用唯一标识符替换实体，避免嵌套
  const placeholders = new Map()
  let placeholderCounter = 0
  let result = text

  // 第一步：将所有实体替换为占位符
  uniqueEntities.forEach((entity) => {
    if (!entity.key || !entity.code) return

    const escapedKey = escapeRegExp(entity.key)
    const regex = new RegExp(escapedKey, 'g')

    result = result.replace(regex, (match) => {
      const placeholder = `__ENTITY_${placeholderCounter}__`
      placeholders.set(placeholder, {
        text: match,
        entity: entity,
      })
      placeholderCounter++
      return placeholder
    })
  })

  // 第二步：将占位符替换为最终的链接格式
  placeholders.forEach((value, placeholder) => {
    const { text, entity } = value
    const entityType = entity.type || 'company'
    const replacement = `[${text}](ner:${entityType}:${entity.code})`
    result = result.replace(placeholder, replacement)
  })

  return result
}
