# ref

引用资料处理模块，负责数据提取、去重、排序和引用计数

## 目录结构

```
ref/
├── index.ts                    # 主导出文件
├── chapterRefExtractor.ts      # 章节引用资料提取工具
├── referenceProcessor.ts       # 引用资料处理和排序工具
└── referenceUtils.ts           # 引用资料通用工具函数
```

## 关键说明

- **referenceUtils.ts**: 唯一键生成和引用标识符获取函数
- **chapterRefExtractor.ts**: 从章节中提取表格、建议、文件引用数据并去重
- **referenceProcessor.ts**: 引用资料的引用次数计算、排序和类型判断

## 依赖关系

referenceProcessor → referenceUtils
chapterRefExtractor → referenceUtils
