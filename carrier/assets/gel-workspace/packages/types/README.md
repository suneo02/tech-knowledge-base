# types

类型定义包，为整个 monorepo 提供共享的类型定义。

## 功能特点

- 提供模块化的类型定义
- 支持 TypeScript 类型声明
- 包含各业务领域的类型定义
- 支持 Tree-shaking 优化

## 安装

在 monorepo 中使用时，可以直接通过工作区引用：

```json
{
  "dependencies": {
    "types": "workspace:*"
  }
}
```

## 使用方法

### 导入类型

```typescript
// 导入全局类型
import { ApiResponse, PaginationParams } from 'types';

// 导入特定模块类型
import { UserInfo, CompanyInfo } from 'types/models';
import { HttpMethod, RequestOptions } from 'types/api';
import { TableColumn, Size } from 'types/components';
import { Dictionary, Status } from 'types/common';
```

## 目录结构

```
./
├── api/              // API 相关类型
├── common/           // 通用基础类型
├── components/       // UI 组件相关类型
├── models/           // 数据模型类型
├── utils/            // 工具函数相关类型
└── index.ts          // 主入口文件
```

## 类型概览

- **API 类型**：与 API 交互相关的类型定义，如请求方法、头部配置等
- **通用类型**：通用的基础类型定义，如键值对、可选类型等
- **组件类型**：UI 组件相关的类型定义，如尺寸、颜色、表格配置等
- **数据模型**：业务数据模型的类型定义，如用户、企业、部门等
- **工具类型**：工具函数相关的类型定义，如防抖、节流、日志等

## 最佳实践

1. **按需导入**：只导入需要的类型，避免过度引入
2. **遵循命名规范**：类型名称采用 PascalCase，枚举值采用 UPPER_CASE
3. **添加注释**：为类型添加详细的 JSDoc 注释，方便开发者理解
4. **保持同步**：当业务变更时，及时更新相应的类型定义 