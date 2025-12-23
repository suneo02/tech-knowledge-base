# FileTable 组件设计文档

## 概述

FileTable 是一个用于展示文件列表的表格组件，具有文件状态管理、状态轮询、进度条动画等功能。该组件主要用于展示文件生成、下载等操作的状态，适用于文件管理、导出文件等场景。

## 详细功能说明

FileTable 组件的主要功能包括：

1. **文件列表展示**：以表格形式展示文件列表，包括文件名、导出时间、状态和操作等信息。
2. **文件状态管理**：支持四种文件状态（等待中、处理中、成功、失败），并根据状态展示不同的UI。
3. **状态轮询**：对处理中的文件进行状态轮询，实时更新文件状态。
4. **进度条动画**：为处理中的文件提供平滑的进度条动画，提供更好的用户体验。
5. **文件操作**：支持下载成功的文件，重试失败的文件等操作。
6. **分页功能**：支持文件列表分页展示。

组件内部逻辑被拆分为三个主要的hooks：

- `useFileData`：处理文件数据获取和状态管理
- `useFilePolling`：处理文件状态轮询逻辑
- `useProgressAnimation`：处理进度条动画逻辑

以及两个辅助组件：

- `FileIcon`：根据文件类型展示对应的图标
- `FileStatusDisplay`：根据文件状态展示对应的状态UI

## 参数说明

### FileTable 组件

| 参数名   | 类型   | 必填 | 默认值 | 描述                                   |
| -------- | ------ | ---- | ------ | -------------------------------------- |
| folderId | string | 是   | -      | 文件夹ID，用于获取该文件夹下的文件列表 |

### useFileData hook

| 参数名   | 类型   | 必填 | 默认值 | 描述                                   |
| -------- | ------ | ---- | ------ | -------------------------------------- |
| folderId | string | 是   | -      | 文件夹ID，用于获取该文件夹下的文件列表 |

返回值：

| 参数名             | 类型                                                            | 描述               |
| ------------------ | --------------------------------------------------------------- | ------------------ |
| files              | FileItem[]                                                      | 文件列表数据       |
| loading            | boolean                                                         | 是否正在加载       |
| currentPage        | number                                                          | 当前页码           |
| setCurrentPage     | (page: number) => void                                          | 设置当前页码的方法 |
| updateFileStatus   | (fileId: string, status: FileStatus, progress?: number) => void | 更新文件状态的方法 |
| retryFile          | (fileId: string) => void                                        | 重试生成文件的方法 |
| hasProcessingFiles | boolean                                                         | 是否有处理中的文件 |

### useFilePolling hook

| 参数名             | 类型                                         | 必填 | 默认值 | 描述                     |
| ------------------ | -------------------------------------------- | ---- | ------ | ------------------------ |
| files              | FileItem[]                                   | 是   | -      | 文件列表数据             |
| hasProcessingFiles | boolean                                      | 是   | -      | 是否有处理中的文件       |
| onFileStatusChange | (fileId: string, status: FileStatus) => void | 是   | -      | 文件状态变化时的回调函数 |

返回值：

| 参数名         | 类型       | 描述                   |
| -------------- | ---------- | ---------------------- |
| pollFileStatus | () => void | 开始轮询文件状态的方法 |
| cancelPolling  | () => void | 取消轮询的方法         |

### useProgressAnimation hook

| 参数名            | 类型                                       | 必填 | 默认值 | 描述                 |
| ----------------- | ------------------------------------------ | ---- | ------ | -------------------- |
| files             | FileItem[]                                 | 是   | -      | 文件列表数据         |
| onProgressChange  | (fileId: string, progress: number) => void | 是   | -      | 进度变化时的回调函数 |
| onCompleteSuccess | (fileId: string) => void                   | 是   | -      | 成功完成时的回调函数 |

返回值：

| 参数名                 | 类型                                         | 描述                   |
| ---------------------- | -------------------------------------------- | ---------------------- |
| progressMap            | Record<string, number>                       | 文件ID到进度的映射     |
| initializeProgress     | (files: FileItem[]) => void                  | 初始化进度的方法       |
| handleFileStatusChange | (fileId: string, status: FileStatus) => void | 处理文件状态变化的方法 |
| resetProgress          | (fileId: string) => void                     | 重置文件进度的方法     |

## 使用示例

```tsx
import React from 'react'
import { FileTable } from '@/components/FileTable'

const MyFileManagement: React.FC = () => {
  const folderId = 'folder123'

  return (
    <div className="my-file-management">
      <h1>我的文件</h1>
      <FileTable folderId={folderId} />
    </div>
  )
}

export default MyFileManagement
```

## 实现细节

### 状态轮询

组件使用 ahooks 的 useRequest 实现轮询逻辑，每3秒轮询一次处理中的文件状态。轮询会在以下情况下停止：

1. 没有处理中的文件
2. 组件卸载时
3. 页面隐藏时

### 进度条动画

进度条动画使用了平滑过渡的方式，通过递归的 setTimeout 实现进度的平滑变化。不同状态有不同的进度处理逻辑：

- 等待中：进度保持在10-15%
- 处理中：根据当前进度自动计算下一个目标进度值，随着进度增加而增长速度减缓
- 成功：进度拉到100%
- 失败：进度最多到40%
