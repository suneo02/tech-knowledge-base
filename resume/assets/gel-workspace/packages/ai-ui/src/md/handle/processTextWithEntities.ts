/**
 * 处理文本中的实体识别
 * @param {string} text - 需要处理的原始文本
 * @param {Array} entities - 实体数组，每个实体包含 key, name, code, type 等字段
 * @returns {string} - 处理后的文本，实体被替换为标记格式
 * @example
 * processTextWithEntities('小米科技有限责任公司', [{ key: '小米科技有限责任公司', name: '小米科技有限责任公司', code: '1047934153', type: 'company' }])
 * // 返回: '[小米科技有限责任公司](ner:company:1047934153)'
 */
export const processTextWithEntities = (
  text: string,
  entities: Array<{ key: string; name: string; code: string; type?: string }>
): string => {
  if (!text || !entities?.length) return text

  // 按照 key 长度降序排序，优先处理较长的实体
  const sortedEntities = [...entities].sort((a, b) => {
    if (!a.key || !b.key) return 0
    return b.key.length - a.key.length
  })

  // 去重实体，保留相同key的第一个实体
  const uniqueEntities = sortedEntities.reduce<Array<{ key: string; name: string; code: string; type?: string }>>(
    (acc, current) => {
      if (!acc.find((item) => item.key === current.key)) {
        acc.push(current)
      }
      return acc
    },
    []
  )

  // 转义正则表达式特殊字符
  const escapeRegExp = (string) => {
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
