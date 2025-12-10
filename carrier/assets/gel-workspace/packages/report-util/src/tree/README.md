# tree - 树结构操作模块

## 🎯 一句话定位

提供**报告树状结构的状态管理**，主要处理节点的**显示/隐藏状态传播**和更新逻辑。

## 📁 目录结构

```
src/tree/
├── propagateHiddenToChildren.ts    # 父节点隐藏状态向下传播
├── updateHiddenTreeNodes.ts        # 更新树节点隐藏状态
├── type.ts                         # 树结构类型定义
└── index.ts                        # 统一导出
```

## 🚀 核心功能

| 函数 | 用途 | 特点 |
| :--- | :--- | :--- |
| **`propagateHiddenToChildren`** | 父隐藏⇒子隐藏 | 前序遍历，确保父子隐藏一致性 |
| **`updateHiddenTreeNodes`** | 批量更新节点状态 | 支持多种状态更新场景 |

## 💡 使用示例

```typescript
import {
  propagateHiddenToChildren,
  TreeFns
} from 'report-util/tree';

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

// 定义树操作函数
const treeFns: TreeFns<TreeNode> = {
  getId: (node) => node.id,
  getChildren: (node) => node.children
};

// 场景：父节点被隐藏时，所有子节点也应隐藏
const hiddenIds = propagateHiddenToChildren(
  rootNode,
  ['parent1'],
  treeFns
);
// 返回: ['parent1', 'child1', 'child2', 'grandchild1', ...]
```

## 🎯 应用场景

### 报告目录树管理
- **目录折叠**: 父目录折叠时，子目录自动隐藏
- **权限控制**: 某个节点无权限时，其子节点也需隐藏
- **过滤功能**: 父节点被过滤时，子节点不再显示

### 树状数据展示
- **报告章节树**: 章节隐藏时，子章节自动隐藏
- **企业结构树**: 部门隐藏时，下属部门自动隐藏

## ⚠️ 重要特性

### 算法特点
- **前序遍历**: 先处理父节点，再处理子节点
- **状态传播**: 父隐藏 ⇒ 子隐藏
- **批量处理**: 支持单节点和节点数组输入

### 性能考虑
- **高效遍历**: 单次遍历完成状态传播
- **内存优化**: 复用节点引用，避免深度拷贝

## 🧪 测试覆盖

模块包含完整的单元测试，覆盖以下场景：
- [x] 单节点输入
- [x] 多节点数组输入
- [x] 深层嵌套结构
- [x] 空数组处理
- [x] 无子节点处理

## 📖 相关文档

- [report-util 主文档](../README.md)
- [测试用例](../__test__/tree/propagateHiddenToChildren.test.ts)