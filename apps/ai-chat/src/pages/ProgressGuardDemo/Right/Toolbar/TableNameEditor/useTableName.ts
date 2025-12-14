import { requestToWFCSuperlistFcs } from '@/api'
import { message } from '@wind/wind-ui'
import { useEffect, useState } from 'react'
import { isEn } from 'gel-util/intl'

/**
 * 表格名称管理Hook
 * @param tableId 表格ID
 * @param initialName 初始表格名称
 * @param onChange 表格名称变化回调
 * @returns 表格名称相关状态和方法
 */
export const useTableName = (tableId: string, initialName: string = '', onChange?: (name: string) => void) => {
  const [tableName, setTableName] = useState<string>(initialName)

  // 设置表格名称
  const updateTableName = (name: string) => {
    setTableName(name)
    // 触发外部回调
    if (onChange) {
      onChange(name)
    }
  }

  // 更新表格名称的处理函数
  const handleUpdateTableName = async (newTableName: string): Promise<void> => {
    if (!tableId) {
      message.error(isEn() ? 'Table ID does not exist' : '表格ID不存在')
      throw new Error('表格ID不存在')
    }

    try {
      await requestToWFCSuperlistFcs('superlist/excel/updateTableName', {
        tableId,
        tableName: newTableName,
      })
      updateTableName(newTableName)
      message.success(isEn() ? 'Table name updated successfully' : '表格名称更新成功')
    } catch (err) {
      console.error('更新表格名称失败:', err)
      if (err instanceof Error) {
        message.error(isEn() ? `Failed to update table name: ${err.message}` : `更新表格名称失败: ${err.message}`)
      } else {
        message.error(isEn() ? 'Failed to update table name' : '更新表格名称失败')
      }
      throw err
    }
  }

  // 验证表格名称
  const validateTableName = (value: string) => {
    if (!value.trim()) {
      message.error(isEn() ? 'Table name cannot be empty' : '表格名称不能为空')
      return { isValid: false }
    }
    if (value.length > 50) {
      message.error(isEn() ? 'Table name cannot exceed 50 characters' : '表格名称不能超过50个字符')
      return { isValid: false }
    }
    if (/[<>\\]/.test(value)) {
      message.error(isEn() ? 'Table name cannot contain special characters' : '表格名称不能包含特殊字符')
      return { isValid: false }
    }
    return { isValid: true }
  }

  // 当initialName变更时更新内部状态
  useEffect(() => {
    if (initialName && initialName !== tableName) {
      updateTableName(initialName)
    }
  }, [initialName])

  return {
    tableName,
    updateTableName,
    handleUpdateTableName,
    validateTableName,
  }
}
