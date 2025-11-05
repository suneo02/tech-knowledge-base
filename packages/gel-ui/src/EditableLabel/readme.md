# EditableLabel 可编辑标签组件

## 概述

EditableLabel是一个通用的可编辑标签组件，用于在只读状态和编辑状态之间切换。组件默认显示文本内容和编辑图标，点击编辑图标后变为可编辑状态，用户编辑完成后可以保存或取消。组件支持编辑过程中的验证，以及保存时的异步操作状态反馈。

## 详细功能说明

1. **显示模式**：

   - 显示文本内容和编辑图标
   - 点击编辑图标进入编辑模式

2. **编辑模式**：

   - 显示输入框、保存按钮和取消按钮
   - 支持按Enter键保存，Esc键取消
   - 支持输入验证和错误提示
   - 显示保存操作的加载状态

3. **状态管理**：

   - 管理组件的编辑、加载和错误状态
   - 保存时显示Loading状态
   - 错误时显示错误提示

4. **自定义样式**：
   - 支持自定义组件和输入框的样式
   - 可设置占位符文本
   - 可自定义最大输入长度

## 参数说明

| 参数名      | 类型                                                       | 必填 | 描述                          |
| ----------- | ---------------------------------------------------------- | ---- | ----------------------------- |
| value       | string                                                     | 是   | 显示的文本值                  |
| onSave      | (value: string) => Promise<void>                           | 是   | 保存时的回调函数，返回Promise |
| style       | React.CSSProperties                                        | 否   | 组件容器的样式                |
| inputStyle  | React.CSSProperties                                        | 否   | 输入框的样式                  |
| placeholder | string                                                     | 否   | 输入框的占位符文本            |
| disabled    | boolean                                                    | 否   | 是否禁用编辑功能              |
| maxLength   | number                                                     | 否   | 输入内容的最大长度限制        |
| validateFn  | (value: string) => { isValid: boolean; errorMsg?: string } | 否   | 自定义验证函数                |

## 返回值说明

组件根据当前状态渲染不同的UI：

1. 非编辑状态：显示文本和编辑图标
2. 编辑状态：显示输入框、保存按钮和取消按钮

## 使用示例

### 基本用法

```tsx
import { EditableLabel } from '@/components/EditableLabel'
import { message } from '@wind/wind-ui'

const MyComponent = () => {
  const handleSave = async (newValue: string) => {
    try {
      // 调用接口保存数据
      await requestToSuperlistFcs('excel/updateTableName', {
        tableName: newValue,
      })
      message.success('保存成功')
    } catch (error) {
      message.error('保存失败')
      throw error // 抛出错误让组件显示错误状态
    }
  }

  return <EditableLabel value="表格名称" onSave={handleSave} placeholder="请输入表格名称" maxLength={50} />
}
```

### 使用自定义验证

```tsx
import { EditableLabel } from '@/components/EditableLabel'

const MyComponent = () => {
  const validateTableName = (value: string) => {
    if (value.length < 2) {
      return { isValid: false, errorMsg: '表格名称不能少于2个字符' }
    }
    if (/[<>\/\\]/.test(value)) {
      return { isValid: false, errorMsg: '表格名称不能包含特殊字符' }
    }
    return { isValid: true }
  }

  const handleSave = async (newValue: string) => {
    // 调用接口保存数据
    await requestToSuperlistFcs('excel/updateTableName', {
      tableName: newValue,
    })
  }

  return (
    <EditableLabel value="我的表格" onSave={handleSave} validateFn={validateTableName} style={{ fontWeight: 'bold' }} />
  )
}
```
