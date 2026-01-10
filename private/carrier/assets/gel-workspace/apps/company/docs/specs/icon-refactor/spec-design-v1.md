# 渐进式菜单图标改造方案 (Spec Design V1)

## 1. 背景与现状

目前 `HeaderHasUser` 组件中的菜单图标（`IFuncMenuItem.icon`）主要依赖全局 LESS 类名（如 `BDML`, `YQGQ` 等）来设置背景图。这些样式定义在 `src/components/Header.less` 中。

### 存在的问题

1.  **全局样式污染**：所有图标样式都堆积在 `Header.less` 中，且使用了简单的类名（如 `.icon.BDML`），容易与项目中其他样式冲突。
2.  **维护成本高**：新增或修改图标需要同时修改 TypeScript 配置文件（`type.ts`）、LESS 文件（`Header.less`）以及确保图片资源路径正确。
3.  **加载性能**：所有图标样式在加载 `Header.less` 时一次性加载，无法做到按需加载或更好的 Tree Shaking。
4.  **类型不安全**：`icon` 字段目前是 `string` 类型，无法在编译时检查图标是否存在。

## 2. 改造目标

1.  **组件化/模块化**：移除对全局 LESS 的依赖，使用 React 组件或模块化导入的方式管理图标。
2.  **渐进式迁移**：由于涉及菜单项较多，需支持新旧方案共存，逐步替换，不影响现有功能。
3.  **类型安全**：建立图标注册表（Registry），提供更好的类型提示和检查。

## 3. 方案设计

### 3.1 总体思路

引入一个 `AllMenuIcons`（全部功能菜单图标映射表），将图标标识符（Key）映射到具体的 SVG 资源。
在 `HeaderHasUser` 组件渲染“全部功能”菜单时，优先检查 `AllMenuIcons` 中是否存在对应 Key 的图标：

- 如果存在：使用映射表中的图标渲染（通过 `background-image` 内联样式）。
- 如果不存在：回退到旧逻辑，使用 `className` 渲染（兼容旧代码）。

### 3.2 详细步骤

#### 阶段一：基础设施搭建 (Infrastructure)

1.  **创建图标映射文件**：
    在 `src/components/HeaderHasUser/` 下创建 `AllMenuIcons.ts`（或者考虑放在 `src/components/Home/AllMenus/` 下，视模块归属而定，这里暂定与渲染组件同级）。
    该文件负责 `import` 所有的 SVG 图标资源，并导出一个 `AllMenuIconMap` 对象。

    ```typescript
    // src/components/HeaderHasUser/AllMenuIcons.ts
    import BDML from '@/assets/fcon/BDML.svg'
    // ... 其他图标导入

    export const AllMenuIconMap: Record<string, string> = {
      BDML,
      // ...
    }
    ```

2.  **更新渲染逻辑**：
    修改 `src/components/HeaderHasUser/index.tsx`，引入 `AllMenuIconMap`。
    在渲染菜单项时，增加判断逻辑：

    ```tsx
    // 伪代码
    import { AllMenuIconMap } from './AllMenuIcons'

    // ... render loop
    {
      menuItem.icon ? (
        AllMenuIconMap[menuItem.icon] ? (
          // 新方案：直接使用图片资源
          <span
            className="icon"
            style={{
              marginInlineEnd: 6,
              backgroundImage: `url(${AllMenuIconMap[menuItem.icon]})`,
              backgroundSize: '100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
        ) : (
          // 旧方案：保留 class 方式
          <span className={`icon ${menuItem.icon}`} style={{ marginInlineEnd: 6 }}></span>
        )
      ) : null
    }
    ```

#### 阶段二：逐步迁移 (Migration)

1.  **批量注册图标**：将 `Header.less` 中用到的 SVG 图片逐步添加到 `AllMenuIcons.ts` 中。
2.  **验证显示**：由于我们优先使用 `AllMenuIconMap`，一旦图标在 Map 中注册，页面就会自动切换到新渲染逻辑。

#### 阶段三：清理与规范化 (Cleanup)

1.  **移除 LESS 样式**：当确认某个图标已通过 Map 正常渲染后，可以从 `Header.less` 中删除对应的 CSS 类定义。
2.  **类型定义优化**：
    修改 `IFuncMenuItem` 的 `icon` 类型定义。

    ```typescript
    // src/components/Home/AllMenus/type.ts
    // 长期目标
    import { AllMenuIconMap } from '../../HeaderHasUser/AllMenuIcons' // 注意循环依赖风险，可能需要将 Map 移到更底层或仅使用 string

    export interface IFuncMenuItem {
      // ...
      icon?: keyof typeof AllMenuIconMap | string
    }
    ```

## 4. 验证计划

1.  **视觉回归测试**：在迁移过程中，对比新旧渲染方式的图标大小、位置、边距是否一致。
2.  **功能测试**：确保点击菜单项的跳转逻辑不受影响。

## 5. 回滚策略

如果发现新方案有严重样式问题，只需在 `HeaderHasUser/index.tsx` 中注释掉对 `AllMenuIconMap` 的判断逻辑，即可一键回退到纯 Class 渲染模式。

---

**注**：此方案不需要修改菜单配置数据的结构（`config/*.ts`），只改变渲染层的实现，风险最小。
