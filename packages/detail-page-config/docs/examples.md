# 使用示例和代码参考

## 基本用法

### 导入配置生成函数

```typescript
// 企业详情页配置
import { getCreditRPConfig } from 'detail-page-config/corp';

// 配置验证工具
import { validateReportConfig } from 'detail-page-config/validation';

// 主入口（通用配置）
import { commonConfig } from 'detail-page-config';
```

### 生成报告配置

```typescript
import { getCreditRPConfig } from 'detail-page-config/corp';

interface ReportData {
  corpBasicInfo: CorpBasicInfo;
  businessRisk: BusinessRiskInfo;
  financeData: FinanceInfo;
}

// 从API获取数据
const reportData: ReportData = await fetchCorpReport(corpId);
const userFlags = getUserPermissions();

// 生成配置
const config = getCreditRPConfig(
  reportData,
  1, // 报告数量
  { reportType: 'credit' },
  userFlags
);
```

### 配置验证

```typescript
import { validateReportConfig } from 'detail-page-config/validation';

// 验证配置结构
const validationResult = validateReportConfig(config, 'ReportPageJson');

if (!validationResult.valid) {
  console.error('配置验证失败:', validationResult.errors);
}
```

### 条件模块加载

```typescript
import { getCreditRPConfig, filterReportConfigByUserInfo } from 'detail-page-config/corp';

// 根据用户权限过滤模块
const baseConfig = getCreditRPConfig(data, num, info, userFlags);
const filteredConfig = filterReportConfigByUserInfo(baseConfig, userFlags);
```

## React组件中使用

```typescript
import { ReportRenderer } from 'report-preview-ui';
import { getCreditRPConfig } from 'detail-page-config/corp';

function ReportPage({ corpId }: { corpId: string }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      const data = await fetchCorpData(corpId);
      const reportConfig = getCreditRPConfig(data, 1, {}, {});
      setConfig(reportConfig);
      setLoading(false);
    }

    loadConfig();
  }, [corpId]);

  if (loading) return <div>Loading...</div>;

  return <ReportRenderer config={config} />;
}
```

## wkhtmltopdf环境使用

```typescript
// 在 report-print 项目中
import { getCreditRPConfig } from 'detail-page-config/corp';

// 配置会用于 wkhtmltopdf 渲染
function generatePDF(corpId: string) {
  const data = fetchCorpDataSync(corpId); // 同步获取
  const config = getCreditRPConfig(data, 1, {}, {});

  // 将配置传递给模板引擎
  return renderTemplate('report-template', { config });
}
```

## ES5兼容代码示例

由于需要兼容wkhtmltopdf环境，Helper函数必须使用ES5语法：

```javascript
// ❌ 现代写法 (禁用)
const result = data
  .filter(item => item.active)
  .map(item => item.name)
  .includes('target');

// ✅ ES5写法 (推荐)
var result = false;
for (var i = 0; i < data.length; i++) {
  if (data[i].active && data[i].name === 'target') {
    result = true;
    break;
  }
}
```

## 最佳实践

1. **按需导入**: 只导入需要的配置函数
2. **数据缓存**: 配置生成过程可以缓存
3. **错误处理**: 处理配置生成可能的异常
4. **验证配置**: 开发环境使用验证工具
5. **权限检查**: 使用Helper函数进行权限过滤

## 相关文档

- @see ../README.md - 包概述
- @see ./design.md - 设计文档
- @see ./data-structures.md - 数据结构说明
- @see ./validation-design.md - 类型校验设计
- @see ./constraints.md - 运行时约束