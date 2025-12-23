# tree 架构说明

## 目录职责
提供完整的通用树形数据结构操作工具集，涵盖树形数据的创建、查询、遍历、变换、移动、映射等全生命周期操作，为项目中所有涉及树形结构的业务场景提供统一的底层支撑。

## 目录结构
```
src/utils/common/tree/
├── index.ts                # 统一导出所有树形工具函数
├── treeTypes.ts           # 树形结构基础类型定义
├── treeTraversal.ts       # 树形遍历、查找、扁平化操作
├── treeManipulation.ts    # 树形过滤、映射、克隆、更新操作
├── treeMovement.ts        # 树形节点移动、缩进、取消缩进操作
├── treeMapping.ts         # 树形映射表构建工具
└── architecture.md        # 架构文档
```

## 文件职责说明
- **index.ts**: 统一导出所有树形工具函数和类型，提供完整的树形数据处理能力
- **treeTypes.ts**: 定义TreeNode接口、TreePath类型、查找遍历选项等所有树形相关类型
- **treeTraversal.ts**: 提供树形遍历、查找、扁平化、路径导航等功能
- **treeManipulation.ts**: 提供树形过滤、映射、克隆、深度计算、节点更新等操作
- **treeMovement.ts**: 提供树形节点移动、缩进、取消缩进等层级调整操作
- **treeMapping.ts**: 提供树形结构转换为映射表的工具函数（包括节点映射、层级映射、排序映射、路径映射）

## 模块依赖
- treeTraversal → treeTypes (使用TreeNode、TreePath等类型)
- treeManipulation → treeTypes (使用TreeNode、TreePath等类型)  
- treeMovement → treeTraversal (使用getNodeByPath函数)
- treeMovement → treeManipulation (使用cloneTree函数)
- treeMovement → treeTypes (使用TreeNode、TreePath等类型)
- treeMapping → treeTraversal (使用traverseTree、flattenTreeWithPath函数)
- treeMapping → treeTypes (使用TreeNode、TreePath等类型)
- index → 所有模块 (统一导出)
- domain层 → tree模块 (使用树形工具和类型，如buildTreePathMap用于章节编号)
- 组件层 → tree模块 (使用树形工具和类型)
