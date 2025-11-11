// 工具类型，用于获取 Enum 的键类型
export type EnumKeys<T> = keyof T

// 工具类型，用于获取 Enum 的值类型
export type EnumValues<T> = T[EnumKeys<T>]

// 工具函数，用于获取枚举的键（过滤掉数字键）
export const getEnumKeys = <T extends object>(enumObj: T): Array<EnumKeys<T>> => {
  return Object.keys(enumObj).filter((key) => isNaN(Number(key))) as Array<EnumKeys<T>>
}

// 工具函数，用于获取枚举的值
export const getEnumValues = <T extends object>(enumObj: T): Array<EnumValues<T>> => {
  return getEnumKeys(enumObj).map((key) => enumObj[key])
}

export type ValuesOf<T> = T[keyof T]
