## 使用**分层聚合模式**重构了 `@/super` 模块:

### 新的目录结构

```
src/wfc/super/
├── domains/              # 领域模块
│   ├── sheet/           # Sheet 领域
│   │   ├── types.ts     # Sheet 相关类型
│   │   ├── api.ts       # Sheet API 映射
│   │   ├── addDataToSheet.ts  # 添加数据相关
│   │   └── index.ts     # Sheet 领域导出
│   └── subscription/    # 订阅领域
│       ├── types.ts     # 订阅相关类型
│       ├── api.ts       # 订阅 API 映射
│       └── index.ts     # 订阅领域导出
├── shared/              # 共享模块
│   ├── types.ts         # 共享类型定义
│   ├── constants.ts     # 常量定义
│   └── index.ts         # 共享模块导出
└── index.ts             # 聚合根
```

### 举例订阅接口

1. **获取订阅列表** (`getSubSuperListCriterion`)

   - 请求：`GetSubscriptionListRequest`
   - 响应：`GetSubscriptionListResponse`

2. **更新订阅设置** (`updateSubSuperListCriterion`)

   - 请求：`UpdateSubscriptionRequest`
   - 响应：`UpdateSubscriptionResponse`

3. **获取CDE新增公司数量** (`getCdeNewCompany`)

   - 请求：`GetCDENewCompanyRequest`
   - 响应：`GetCDENewCompanyResponse`

4. **禁用CDE新增公司通知** (`disableCdeNewCompanyNotice`)
   - 请求：`DisableCDENewCompanyNoticeRequest`
   - 响应：`DisableCDENewCompanyNoticeResponse`

### 架构优势

1. **🎯 职责清晰**：按业务领域拆分，每个文件职责单一
2. **🔒 类型安全**：完整的TypeScript类型系统，编译时检查
3. **🔄 易于维护**：修改某个功能时影响范围最小
4. **📦 便于扩展**：新增功能时只需添加新的领域
5. **🛡️ 边界清晰**：模块间依赖关系明确
6. **🎛️ 配置驱动**：通过常量文件统一管理API路径
7. **🔍 易于测试**：每个领域可以独立测试

### 类型定义示例

```typescript
// 订阅相关类型
export interface GetSubscriptionListResponse {
  lastQueryTime: string
  list: SubscriptionListItem[]
  mail: string
  subPush: boolean
  tableName: string
}

export interface UpdateSubscriptionRequest extends BaseTableRequest {
  subPush: boolean
  mail: string
}
```

### 🔧 使用方式

```typescript
// 导入方式保持不变
import { GetSubscriptionListRequest, UpdateSubscriptionRequest } from '@/wfc/super'

// API 路径映射自动聚合
const apiMap: wfcSuperApiPathMap = {
  'superlist/excel/getSubSuperListCriterion': {
    data: GetSubscriptionListRequest,
    response: ApiResponseForWFC<GetSubscriptionListResponse>,
  },
  // ... 其他接口
}
```
