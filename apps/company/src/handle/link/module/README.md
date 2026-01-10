# 企业链接模块

提供企业间关系链接、知识图谱构建和数据浏览功能。

## 目录结构
```
module/
├── DataBrowser.tsx             # 数据浏览器组件
├── KG.tsx                      # 知识图谱组件
├── List.tsx                    # 列表展示组件
├── Search.tsx                  # 搜索功能组件
├── Table.tsx                   # 表格展示组件
├── Tree.tsx                    # 树形结构组件
├── api.ts                      # API接口定义
├── config.ts                   # 配置文件
├── constants.ts                # 常量定义
├── index.ts                    # 入口文件
├── miscDetail/                 # 杂项详情目录
│   ├── index.tsx               # 详情入口
│   ├── Left.tsx                # 左侧面板
│   ├── Right.tsx               # 右侧面板
│   └── Top.tsx                 # 顶部面板
└── qulification/               # 资质目录
    ├── index.tsx               # 资质入口
    ├── Left.tsx                # 左侧面板
    ├── Right.tsx               # 右侧面板
    └── Top.tsx                 # 顶部面板
```

## 关键文件说明
- `index.ts` - 模块入口，导出所有链接相关功能
- `KG.tsx` - 企业知识图谱构建与展示核心组件
- `DataBrowser.tsx` - 企业关系数据浏览器
- `api.ts` - 统一的API接口定义
- `miscDetail/` - 企业杂项详情展示组件集合
- `qulification/` - 企业资质详情展示组件集合

## 依赖示意
- 依赖：`../../corpModuleCfg` - 企业模块配置
- 上游：企业详情页面、关系分析模块
- 下游：企业关系可视化、知识图谱展示

## 相关文档
- [企业知识图谱设计](../../../docs/knowledge-graph-design.md)
- [企业关系数据模型](../../../docs/corp-relation-data-model.md)