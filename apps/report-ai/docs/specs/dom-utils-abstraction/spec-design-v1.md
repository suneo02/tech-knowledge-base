---
title: DOM 操作工具抽象 - 方案设计
version: v1
status: 🚧 进行中
---

[← 返回任务概览](/apps/report-ai/docs/specs/dom-utils-abstraction/README.md)

# 方案设计

## 目录结构

```
apps/report-ai/src/utils/dom/
├── index.ts           # 统一导出
├── container.ts       # 临时容器管理
├── element.ts         # 元素创建与操作
├── query.ts           # 元素查询
├── html.ts            # HTML 字符串处理
└── __tests__/         # 单元测试
```

## 核心模块设计

### 1. 临时容器管理（container.ts）

| 函数                | 功能                 | 参数                     | 返回               |
| ------------------- | -------------------- | ------------------------ | ------------------ |
| createTempContainer | 创建临时容器         | html?, document?         | TempContainer 实例 |
| withTempContainer   | 自动管理容器生命周期 | html, handler, document? | handler 返回值     |

**TempContainer 接口**：提供 element、getHTML()、setHTML()、querySelector()、querySelectorAll()、destroy() 方法

**使用场景**：HTML 字符串解析、节点清洗、内容转换

### 2. 元素创建与操作（element.ts）

| 函数             | 功能         | 参数                                                  | 返回        |
| ---------------- | ------------ | ----------------------------------------------------- | ----------- |
| createElement    | 创建元素     | tag, attributes?, textContent?, innerHTML?, children? | HTMLElement |
| setAttributes    | 批量设置属性 | element, attributes                                   | void        |
| removeAttributes | 移除属性     | element, ...attributes                                | void        |
| replaceElement   | 替换元素     | oldElement, newElement                                | void        |
| removeElements   | 批量移除元素 | elements[]                                            | void        |

**类型安全**：createElement 支持泛型，根据 tag 推导返回类型

**使用场景**：章节序号节点创建、标题元素转换、属性批量设置

### 3. 元素查询（query.ts）

| 函数             | 功能         | 参数                         | 返回            |
| ---------------- | ------------ | ---------------------------- | --------------- |
| querySelector    | 查询单个元素 | selector, context?           | Element \| null |
| querySelectorAll | 查询所有元素 | selector, context?           | Element[]       |
| forEachElement   | 遍历元素     | selector, callback, context? | void            |
| mapElements      | 映射元素     | selector, mapper, context?   | T[]             |

**类型安全**：支持泛型指定元素类型，返回类型安全的数组

**使用场景**：批量查询标题、遍历处理节点、提取数据

### 4. HTML 字符串处理（html.ts）

| 函数           | 功能             | 参数                       | 返回          |
| -------------- | ---------------- | -------------------------- | ------------- |
| htmlToElement  | HTML 转元素      | html, document?            | HTMLElement   |
| htmlToElements | HTML 转元素数组  | html, document?            | HTMLElement[] |
| elementToHTML  | 元素转 HTML      | element                    | string        |
| fragmentToHTML | Fragment 转 HTML | fragment, document?        | string        |
| processHTML    | 处理 HTML 字符串 | html, processor, document? | string        |

**使用场景**：Fragment 转换、HTML 内容处理、DOM 与字符串互转

## 迁移策略

### 迁移对照表

| 原始操作                           | 新工具函数             | 优势               |
| ---------------------------------- | ---------------------- | ------------------ |
| document.createElement + innerHTML | withTempContainer      | 自动清理、类型安全 |
| querySelectorAll + forEach         | forEachElement         | 简化遍历、统一接口 |
| createElement + setAttribute       | createElement(options) | 声明式、批量设置   |
| element.replaceWith                | replaceElement         | 统一 API、兼容性   |
| fragment.appendChild + innerHTML   | fragmentToHTML         | 直接转换、无副作用 |

### 重点迁移模块

| 模块                  | 当前问题                   | 迁移方案                                          |
| --------------------- | -------------------------- | ------------------------------------------------- |
| contentSanitizer      | 手动创建容器、重复查询移除 | 使用 withTempContainer + removeElements           |
| chapter/render        | 标题转换逻辑冗长           | 使用 processHTML + forEachElement + createElement |
| chapterOrdinal/render | 节点创建缺少类型约束       | 使用 createElement 统一创建                       |
| document/parse        | Fragment 转 HTML 手动操作  | 使用 fragmentToHTML 直接转换                      |

## 设计原则

1. **纯函数优先**：无副作用，便于测试
2. **依赖注入**：支持传入 document 对象（测试友好）
3. **类型安全**：TypeScript 泛型，元素类型推导
4. **单一职责**：每个函数只做一件事
5. **渐进增强**：与现有代码兼容，支持逐步迁移

## 兼容性设计

| 方面         | 策略                                                  |
| ------------ | ----------------------------------------------------- |
| EditorFacade | 互补使用，编辑器内部用 EditorFacade，独立处理用新工具 |
| 现有代码     | 保持兼容，不强制迁移，新代码优先使用新工具            |
| 测试环境     | 支持 JSDOM，所有函数可传入自定义 document             |

## 测试策略

| 测试类型 | 覆盖内容     | 目标           |
| -------- | ------------ | -------------- |
| 单元测试 | 每个工具函数 | 覆盖率 >90%    |
| 集成测试 | 实际业务场景 | 功能一致性验证 |
| 性能测试 | 批量操作     | 无性能回归     |

@see /apps/report-ai/docs/specs/dom-utils-abstraction/spec-require-v1.md  
@see /apps/report-ai/docs/specs/dom-utils-abstraction/spec-implementation-plan-v1.md  
@see /apps/report-ai/src/domain/reportEditor/editor/contentSanitizer.ts:44  
@see /apps/report-ai/src/domain/reportEditor/chapter/render.ts:120
