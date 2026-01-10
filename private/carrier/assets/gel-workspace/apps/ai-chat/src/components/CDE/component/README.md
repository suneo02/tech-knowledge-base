# CDE组件库

提供CDE(企业数据引擎)相关的UI组件和交互功能。

## 目录结构
```
component/
├── AddDataBtn.tsx                  # 添加数据按钮组件
├── FilterPreviewModal.tsx          # 过滤预览模态框
├── FilterResPreview.tsx             # 过滤结果预览
├── FilterResTip.tsx                 # 过滤结果提示
├── handle.ts                        # 事件处理函数
├── type.tsx                         # 类型定义
├── CDEFilterConsoleFooter/          # 过滤控制台底部组件
├── Search/                          # 搜索相关组件
│   ├── CDEModal/                    # CDE模态框
│   ├── CDESearch/                   # CDE搜索
│   ├── components/                  # 子组件
│   ├── hooks/                       # 搜索相关hooks
│   └── index.tsx                    # 搜索入口
├── hooks/                           # 通用hooks
└── style/                           # 样式文件
```

## 关键文件说明
- `AddDataBtn.tsx` - 添加数据到表格的按钮组件
- `handle.ts` - 统一的事件处理函数集合
- `type.tsx` - 组件类型定义和接口
- `Search/` - 搜索功能相关组件集合
- `hooks/` - 通用业务逻辑hooks

## 依赖示意
- 依赖：`antd` - UI组件库、`react` - React框架
- 上游：CDE数据引擎、企业数据API
- 下游：AI聊天应用中的数据筛选功能

## 相关文档
- [CDE组件使用指南](../../../../../docs/cde-component-guide.md)
- [企业数据搜索设计](../../../../../docs/enterprise-data-search-design.md)