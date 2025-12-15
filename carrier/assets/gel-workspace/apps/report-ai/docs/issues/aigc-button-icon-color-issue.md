# AIGC 按钮背景色异常

## 问题概览

| 字段     | 内容                         |
| -------- | ---------------------------- |
| 问题     | 后续章节 AIGC 按钮背景变灰色 |
| 状态     | ✅ 已解决                    |
| 优先级   | 🟡 P1                        |
| 发现时间 | 2025-11-11                   |
| 解决时间 | 2025-11-11                   |

## 问题描述

第一个章节的 AIGC 按钮显示正常（背景透明，图标默认灰色、hover 蓝色），但后续章节的按钮背景变成灰色。

## 根因

SVG 使用固定 ID 的 clipPath（`id="smart-gen-i1"`），多个实例时 ID 冲突导致渲染异常。

## 解决方案

1. **移除 clipPath**：将 clipPath 路径直接转换为 path 元素，完全移除 ID 依赖
2. **使用 currentColor**：将 `fill="#666666"` 改为 `fill="currentColor"`
3. **覆盖背景色**：在 SmartGenBtn 中强制设置 `background: transparent !important`

## 修改文件

1. `apps/report-ai/src/assets/icon/smart_gen.svg` - 移除 clipPath，直接使用 path + currentColor
2. `apps/report-ai/src/components/common/SmartGenBtn/index.module.less` - 新增，覆盖背景色
3. `apps/report-ai/src/components/common/SmartGenBtn/index.tsx` - 应用样式类

## 相关代码

**SVG 修改（关键部分）：**

```xml
<!-- 将 clipPath 路径直接作为 path 元素，无 ID -->
<g transform="translate(...)">
  <path d="..." fill="currentColor"/>
</g>
```

**组件样式：**

```less
.smartGenBtn {
  background: transparent !important;
  &:hover {
    background: transparent !important;
  }
}
```
