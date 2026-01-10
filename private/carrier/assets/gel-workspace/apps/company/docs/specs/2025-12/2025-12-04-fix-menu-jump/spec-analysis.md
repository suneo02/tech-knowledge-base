# 菜单点击跳转抖动问题分析

## 1. 问题现象
用户点击左侧菜单中的“股权穿透图”(`getShareAndInvest`) 或 “科创分”(`gettechscore`) 时，菜单选中态出现抖动：
1.  **点击瞬间**：选中目标菜单项。
2.  **滚动过程中**：选中态跳变回上一个菜单项。
3.  **最终态**：选中态再次跳回目标菜单项。

## 2. 原因分析

### 2.1 交互流程冲突
问题的核心在于**手动点击触发的强制选中**与**滚动监听触发的自动选中**发生了冲突。

1.  **点击阶段 (`treeMenuClick`)**:
    *   用户点击菜单。
    *   `setSelectedKeys` 立即更新为目标 ID。
    *   调用 `scrollTo` 触发页面滚动。
    *   设置全局标记 `SCROLL_FROM_MENU_CLICK_ID.value = menu`。
    *   **关键点**：设置了一个 600ms 的 `setTimeout`，再次强制更新选中态。

2.  **滚动监听阶段 (`scrollCallback`)**:
    *   页面滚动触发 `scroll` 事件。
    *   `createCorpDetailScrollCallback` (debounce 300ms) 执行。
    *   计算当前视口可见区域占比最大的模块 (`createCorpDetailScrollCallbackLogic`)。

3.  **冲突点**:
    *   当点击“股权穿透图”等模块时，由于该模块位于页面底部或内容高度动态变化（如 `React.Suspense` 加载中），滚动停止时，计算逻辑可能判定**上一个模块**更接近视口中心或占据更多空间。
    *   `scrollCallback` 因此触发 `setSelectedKeys` 更新为上一个模块（第一次跳变）。
    *   随后，`treeMenuClick` 的 600ms 定时器触发，再次强制更新为目标模块（第二次跳变）。

### 2.2 代码证据
- **CompanyDetail.tsx**: `treeMenuClick` 中的 `setTimeout` 强制修正逻辑。
- **scroll.ts**: `handleCorpDetailScrollMenuChanged` 接收计算出的 `moduleId` 并直接更新 `selectedKeys`，未充分考虑点击触发场景下的保护。

## 3. 解决方案

### 3.1 核心思路
利用 `SCROLL_FROM_MENU_CLICK_ID` 全局变量，在滚动回调中识别“点击触发的滚动”。如果当前滚动是由点击触发的，且计算出的可视模块与点击目标不一致，则**阻止**更新选中态，直到确认到达目标或用户进行手动交互。

### 3.2 修改方案

修改 `apps/company/src/handle/corp/misc/scroll.ts` 中的 `handleCorpDetailScrollMenuChanged` 和 `handleCorpDetailScrollMenuLoad`。

**逻辑伪代码**:
```typescript
const handleCorpDetailScrollMenuChanged = (moduleId, cbs) => {
  // 检查是否处于点击触发的滚动状态
  const clickedMenuId = SCROLL_FROM_MENU_CLICK_ID.value;
  
  if (clickedMenuId) {
     // 如果当前计算出的模块不是点击的目标，且点击目标确实存在于菜单中
     // 则认为可能是滚动未完成或误判，暂时忽略此次更新，避免跳变
     const currentMenuId = moduleId.split('-')[0];
     if (currentMenuId !== clickedMenuId) {
        return; // 阻止跳变
     }
  }
  
  // ... 原有更新逻辑
}
```

### 3.3 补充措施
- 确保 `SCROLL_FROM_MENU_CLICK_ID.value` 在用户**手动滚动**（非点击触发）时能被及时清理，防止死锁。建议在 `scrollCallback` 入口处增加判断，或者在 `treeMenuClick` 中使用更可靠的机制（如时间戳）来判断点击时效性。鉴于现有代码结构，最稳妥的方式是在 `handleCorpDetailScrollMenuChanged` 中仅做被动防御。

## 4. 验证计划
1.  点击“股权穿透图”，观察菜单选中态是否稳定。
2.  点击其他普通模块，观察滚动是否正常。
3.  手动滚动页面，观察滚动监听是否依然有效（即确保没有过度阻止正常的滚动选中更新）。
