/**
 * @file 动态提示语生成工具函数
 * @description 根据用户输入动态替换提示语中的占位符
 * @author Calvin<xyi.panda@gmail.com>
 * @version 1.0.0
 * @since 2025-05-12
 */

/**
 * 动态提示语生成器所使用的输入字段配置接口。
 */
export interface DynamicPromptInputField {
  /**
   * 字段的显示标题。
   * 同时，在提示语模板中，该标题将作为占位符，格式为 `{{title}}`。
   * 例如，如果 title 是 "城市"，则模板中应为 `{{城市}}`。
   */
  title: string
  /**
   * 字段在表单数据中的键名。
   * 如果未提供，将使用 `title` 作为键名。
   */
  key?: string
  /**
   * 字段的输入类型。
   * - 'input': 普通文本输入。替换时，直接使用输入值。
   * - 'select': 单选选择。替换时，格式为 `@值`。
   * - 'multiSelect': 多选选择。替换时，格式为 `@值1 @值2 ...`。
   * 其他未指定类型将按 'select' 类型处理（添加 '@' 前缀）。
   */
  type?: 'input' | 'select' | 'multiSelect' | 'textarea'
  // 其他 InputField 可能存在的属性，这里省略，因为此函数主要关注 title, key, type
}

/**
 * 表单值的接口定义。
 * 键为字段的 `key` 或 `title`，值为字符串、字符串数组（用于多选）或 undefined。
 */
export interface FormValues {
  [key: string]: string | string[] | undefined
}

/**
 * 根据原始提示语、输入字段配置和当前的表单值，生成动态的提示语。
 *
 * @param originalPrompt 包含占位符的原始提示语字符串。例如："查找位于{{城市}}的天气，并关注{{关注点}}。"
 * @param inputFields 一个包含输入字段配置对象的数组。每个对象应符合 `DynamicPromptInputField` 接口。
 * @param formValues 一个包含当前表单值的对象，键为字段的 `key` 或 `title`。
 *
 * @returns {string} 处理和替换占位符后的动态提示语字符串。
 *                   如果原始提示语为空，则返回空字符串。
 *                   如果 `inputFields` 或 `formValues` 未提供或为空数组，则直接返回 `originalPrompt`。
 *
 * @example
 * const promptTemplate = "为我生成关于{{主题}}的{{数量}}个要点，风格偏向{{风格}}。"
 * const fields = [
 *   { title: "主题", type: "input" },
 *   { title: "数量", type: "select" },
 *   { title: "风格", type: "multiSelect", key: "styleChoices" }
 * ]
 * const values = {
 *   "主题": "人工智能",
 *   "数量": "5",
 *   "styleChoices": ["简洁", "专业"]
 * }
 * const dynamicPrompt = generateDynamicPrompt(promptTemplate, fields, values)
 * // dynamicPrompt 将会是: "为我生成关于人工智能的@5个要点，风格偏向@简洁 @专业。"
 *
 * const valuesEmpty = {
 *   "主题": "",
 *   "数量": undefined,
 *   "styleChoices": []
 * }
 * const dynamicPromptEmpty = generateDynamicPrompt(promptTemplate, fields, valuesEmpty)
 * // dynamicPromptEmpty 将会是: "为我生成关于{{主题}}的{{数量}}个要点，风格偏向{{风格}}。" (占位符保留)
 */
export const generateDynamicPrompt = (
  originalPrompt: string,
  inputFields: DynamicPromptInputField[] | undefined,
  formValues: FormValues | undefined
): string => {
  // 步骤 1: 处理基本边界情况
  if (!originalPrompt) return ''
  if (!inputFields || !formValues || inputFields.length === 0) {
    return originalPrompt
  }

  let processedPrompt = originalPrompt

  // 步骤 2: 遍历所有定义的输入字段
  inputFields.forEach((field) => {
    // 步骤 2.1:确定字段在表单值对象中的键名
    const fieldKeyInForm = field.key || field.title
    // 步骤 2.2: 确定在提示语模板中要替换的占位符文本，即 {{title}}
    const placeholderText = field.title

    // 如果字段标题无效，则跳过此字段
    if (typeof placeholderText !== 'string' || placeholderText.trim() === '') {
      return
    }

    // 步骤 2.3: 创建用于匹配占位符的正则表达式，例如 /{{城市}}/g
    // 对 placeholderText 中的正则表达式特殊字符进行转义，以确保它们被字面量匹配
    const placeholderRegex = new RegExp(`\\{\\{${placeholderText.replace(/[-^$*+?.()|[\]{}]/g, '\\$&')}\\}\\}`, 'g')

    // 步骤 2.4: 从表单值中获取当前字段的值
    const value = formValues[fieldKeyInForm]

    let replacementText = '' // 用于替换占位符的文本
    let hasValue = false // 标记当前字段是否有有效值用于替换

    // 步骤 2.5: 根据字段类型格式化替换文本
    if (field.type === 'multiSelect') {
      // 对于多选类型，如果值是数组且不为空，则格式化为 "@值1 @值2 ..."
      if (Array.isArray(value) && value.length > 0) {
        replacementText = value.map((v) => `@${v}`).join(' ')
        hasValue = true
      }
    } else if (field.type === 'input' || field.type === 'textarea') {
      // 对于输入类型，如果值存在且不为空字符串，则直接使用该值，不加 "@"
      if (value !== undefined && value !== null && value.toString().trim() !== '') {
        replacementText = value.toString()
        hasValue = true
      }
    } else {
      // 对于单选 ('select') 或其他未明确指定的类型，如果值存在且不为空字符串，则格式化为 "@值"
      if (value !== undefined && value !== null && value.toString().trim() !== '') {
        replacementText = `@${value}`
        hasValue = true
      }
    }

    // 步骤 2.6: 如果字段有有效值，则在处理后的提示语中执行替换
    if (hasValue) {
      processedPrompt = processedPrompt.replace(placeholderRegex, replacementText)
    }
    // 如果字段没有有效值 (hasValue 为 false)，则不进行替换。
    // 由于 processedPrompt 是从 originalPrompt 开始的，对应的 {{placeholderText}} 会保持原样。
  })

  // 步骤 3: 返回最终处理过的提示语
  return processedPrompt
}
