export interface ValidationResult {
  valid: boolean
  errors: Array<{
    property: string
    message: string
    schema?: any
    instance?: any
  }>
  rootInstance?: any
}

/**
 * 验证实例是否符合指定的 JSON Schema
 * @param instance 要验证的实例
 * @param schema JSON Schema 定义
 * @param path 当前验证路径，用于错误定位
 * @param definitions 全局定义，用于解析 $ref 引用
 * @param rootInstance 根实例，用于递归验证
 * @returns 验证结果
 */
export function validateSchema(
  instance: any,
  schema: any,
  path: string = '',
  definitions?: any,
  rootInstance?: any
): ValidationResult {
  try {
    const errors: ValidationResult['errors'] = []
    if (rootInstance === undefined) rootInstance = instance

    // 处理 $ref 引用
    if (schema.$ref) {
      // 简单的引用处理，假设是相对于根定义的引用
      const refPath = schema.$ref.replace('#/definitions/', '')
      const definitionsToUse = definitions || schema.definitions

      if (definitionsToUse && definitionsToUse[refPath]) {
        return validateSchema(instance, definitionsToUse[refPath], path, definitionsToUse, rootInstance)
      } else {
        errors.push({
          property: path,
          message: `无法解析引用: ${schema.$ref}`,
          schema,
          instance,
        })
        return { valid: false, errors, rootInstance }
      }
    }

    // 验证枚举值 - 这是重点功能
    if (schema.enum) {
      if (schema.enum.indexOf(instance) === -1) {
        errors.push({
          property: path,
          message: `值 "${instance}" 不在枚举范围内，允许的值: [${schema.enum.join(', ')}]`,
          schema,
          instance,
        })
      }
    }

    // 验证 const 值
    if (schema.const !== undefined) {
      if (instance !== schema.const) {
        errors.push({
          property: path,
          message: `值必须等于 "${schema.const}"，当前值: "${instance}"`,
          schema,
          instance,
        })
      }
    }

    // 验证类型
    if (schema.type) {
      const expectedTypes = Array.isArray(schema.type) ? schema.type : [schema.type]
      const actualType = getJsonType(instance)

      if (expectedTypes.indexOf(actualType) === -1) {
        errors.push({
          property: path,
          message: `类型错误，期望: ${expectedTypes.join(' 或 ')}，实际: ${actualType}`,
          schema,
          instance,
        })
      }
    }

    // 验证对象
    if (schema.type === 'object' || schema.properties) {
      if (instance && typeof instance === 'object' && !Array.isArray(instance)) {
        // 验证必填字段
        if (schema.required && Array.isArray(schema.required)) {
          for (const requiredField of schema.required) {
            if (!(requiredField in instance)) {
              errors.push({
                property: path ? `${path}.${requiredField}` : requiredField,
                message: `缺少必填字段: ${requiredField}`,
                schema,
                instance,
              })
            }
          }
        }

        // 验证属性 - 替换 Object.entries
        if (schema.properties) {
          for (const propertyName in schema.properties) {
            if (schema.properties.hasOwnProperty(propertyName)) {
              const propertySchema = schema.properties[propertyName]
              if (propertyName in instance) {
                const propertyPath = path ? `${path}.${propertyName}` : propertyName
                const propertyResult = validateSchema(
                  instance[propertyName],
                  propertySchema,
                  propertyPath,
                  definitions,
                  rootInstance
                )
                errors.push(...propertyResult.errors)
              }
            }
          }
        }

        // 验证 additionalProperties - 替换 Object.keys
        if (schema.additionalProperties === false && schema.properties) {
          const allowedProperties: string[] = []
          for (const prop in schema.properties) {
            if (schema.properties.hasOwnProperty(prop)) {
              allowedProperties.push(prop)
            }
          }

          for (const propertyName in instance) {
            if (instance.hasOwnProperty(propertyName)) {
              if (allowedProperties.indexOf(propertyName) === -1) {
                errors.push({
                  property: path ? `${path}.${propertyName}` : propertyName,
                  message: `不允许的额外属性: ${propertyName}`,
                  schema,
                  instance,
                })
              }
            }
          }
        }
      }
    }

    // 验证数组
    if (schema.type === 'array' || schema.items) {
      if (Array.isArray(instance)) {
        // 验证数组项
        if (schema.items) {
          instance.forEach((item, index) => {
            const itemPath = `${path}[${index}]`
            const itemResult = validateSchema(item, schema.items, itemPath, definitions, rootInstance)
            errors.push(...itemResult.errors)
          })
        }

        // 验证最小长度
        if (schema.minItems !== undefined && instance.length < schema.minItems) {
          errors.push({
            property: path,
            message: `数组长度不能少于 ${schema.minItems}，当前长度: ${instance.length}`,
            schema,
            instance,
          })
        }

        // 验证最大长度
        if (schema.maxItems !== undefined && instance.length > schema.maxItems) {
          errors.push({
            property: path,
            message: `数组长度不能超过 ${schema.maxItems}，当前长度: ${instance.length}`,
            schema,
            instance,
          })
        }
      }
    }

    // 验证字符串
    if (schema.type === 'string' && typeof instance === 'string') {
      // 验证最小长度
      if (schema.minLength !== undefined && instance.length < schema.minLength) {
        errors.push({
          property: path,
          message: `字符串长度不能少于 ${schema.minLength}，当前长度: ${instance.length}`,
          schema,
          instance,
        })
      }

      // 验证最大长度
      if (schema.maxLength !== undefined && instance.length > schema.maxLength) {
        errors.push({
          property: path,
          message: `字符串长度不能超过 ${schema.maxLength}，当前长度: ${instance.length}`,
          schema,
          instance,
        })
      }

      // 验证正则表达式
      if (schema.pattern) {
        const regex = new RegExp(schema.pattern)
        if (!regex.test(instance)) {
          errors.push({
            property: path,
            message: `字符串不匹配模式: ${schema.pattern}`,
            schema,
            instance,
          })
        }
      }
    }

    // 验证数字
    if ((schema.type === 'number' || schema.type === 'integer') && typeof instance === 'number') {
      // 验证最小值
      if (schema.minimum !== undefined && instance < schema.minimum) {
        errors.push({
          property: path,
          message: `数值不能小于 ${schema.minimum}，当前值: ${instance}`,
          schema,
          instance,
        })
      }

      // 验证最大值
      if (schema.maximum !== undefined && instance > schema.maximum) {
        errors.push({
          property: path,
          message: `数值不能大于 ${schema.maximum}，当前值: ${instance}`,
          schema,
          instance,
        })
      }

      // 验证是否为整数
      if (schema.type === 'integer' && !Number.isInteger(instance)) {
        errors.push({
          property: path,
          message: `必须是整数，当前值: ${instance}`,
          schema,
          instance,
        })
      }
    }

    // 验证 anyOf / oneOf / allOf
    if (schema.anyOf) {
      const anyOfResults = schema.anyOf.map((subSchema: any) =>
        validateSchema(instance, subSchema, path, definitions, rootInstance)
      )
      if (anyOfResults.every((result: ValidationResult) => !result.valid)) {
        errors.push({
          property: path,
          message: `值不符合任何一个 anyOf 条件`,
          schema,
          instance,
        })
      }
    }

    if (schema.oneOf) {
      const oneOfResults = schema.oneOf.map((subSchema: any) =>
        validateSchema(instance, subSchema, path, definitions, rootInstance)
      )
      const validCount = oneOfResults.filter((result: ValidationResult) => result.valid).length
      if (validCount !== 1) {
        errors.push({
          property: path,
          message: `值必须符合 oneOf 中的恰好一个条件，当前符合 ${validCount} 个`,
          schema,
          instance,
        })
      }
    }

    if (schema.allOf) {
      for (const subSchema of schema.allOf) {
        const subResult = validateSchema(instance, subSchema, path, definitions, rootInstance)
        errors.push(...subResult.errors)
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      rootInstance,
    }
  } catch (e) {
    console.error(e)
    return {
      valid: false,
      errors: [{ property: 'unknown', message: 'unknown error', instance }],
      rootInstance,
    }
  }
}

/**
 * 获取 JSON 类型
 */
function getJsonType(value: any): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

/**
 * 验证根 schema，处理包含 definitions 的完整 schema
 */
export function validateWithDefinitions(instance: any, rootSchema: any): ValidationResult {
  // 如果 schema 有 $ref，从根开始解析
  if (rootSchema.$ref) {
    const refPath = rootSchema.$ref.replace('#/definitions/', '')
    if (rootSchema.definitions && rootSchema.definitions[refPath]) {
      const targetSchema = rootSchema.definitions[refPath]
      return validateSchema(instance, targetSchema, '', rootSchema.definitions, instance)
    }
  }

  // 传递 definitions 给验证函数
  return validateSchema(instance, rootSchema, '', rootSchema.definitions, instance)
}
