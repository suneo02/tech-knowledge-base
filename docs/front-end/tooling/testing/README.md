# 前端测试工具

> 本文档介绍前端测试的核心概念、主流测试框架和工具链，帮助建立完整的前端测试体系。

## 概述

前端测试是保证代码质量和项目稳定性的重要手段。根据测试粒度和场景，前端测试可分为：

- **单元测试（Unit Testing）** - 测试独立的函数、组件
- **集成测试（Integration Testing）** - 测试多个模块协作
- **端到端测试（E2E Testing）** - 测试完整的用户流程
- **视觉回归测试（Visual Regression Testing）** - 测试 UI 一致性

## 测试框架分类

### 1. 单元测试框架

#### Jest

**特点：**
- Facebook 出品，零配置开箱即用
- 内置断言库、Mock 功能、覆盖率报告
- 快照测试（Snapshot Testing）
- 并行执行，性能优秀
- 广泛用于 React 项目

**官方文档：** [Jest](https://jestjs.io/)

**基础用法：**

```javascript
// sum.test.js
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

**适用场景：**
- React、Vue 组件测试
- 纯函数单元测试
- Node.js 应用测试

#### Vitest

**特点：**
- Vite 原生测试框架
- 与 Jest API 兼容
- 极快的执行速度（基于 esbuild）
- 原生支持 ESM、TypeScript
- 与 Vite 配置共享

**官方文档：** [Vitest](https://vitest.dev/)

**适用场景：**
- Vite 项目
- 需要极致速度的项目
- TypeScript 项目

#### Mocha

**特点：**
- 灵活性高，需自行配置断言库
- 支持多种断言库（Chai、Should.js）
- 浏览器和 Node.js 均可运行
- 异步测试支持良好

**官方文档：** [Mocha](https://mochajs.org/)

**适用场景：**
- 需要自定义测试栈
- Node.js 后端测试

### 2. React 组件测试

#### React Testing Library

**特点：**
- 鼓励测试用户行为而非实现细节
- 轻量级，基于 DOM Testing Library
- 与 Jest 配合使用
- 官方推荐的 React 测试方案

**官方文档：** [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

**基础用法：**

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('increments counter', () => {
  render(<Counter />);
  const button = screen.getByRole('button', { name: /increment/i });
  fireEvent.click(button);
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

**适用场景：**
- React 组件功能测试
- 用户交互测试
- 可访问性测试

#### Enzyme

**特点：**
- Airbnb 出品
- 提供浅渲染、完整渲染、静态渲染
- 可直接操作组件实例
- 社区逐渐迁移到 React Testing Library

**官方文档：** [Enzyme](https://enzymejs.github.io/enzyme/)

**注意：** React 18+ 支持不完善，建议新项目使用 React Testing Library

### 3. Vue 组件测试

#### Vue Test Utils

**特点：**
- Vue 官方测试工具库
- 支持 Vue 2 和 Vue 3
- 提供 mount、shallowMount 等 API
- 与 Jest/Vitest 配合使用

**官方文档：** [Vue Test Utils](https://test-utils.vuejs.org/)

**基础用法：**

```javascript
import { mount } from '@vue/test-utils';
import Counter from './Counter.vue';

test('increments counter', async () => {
  const wrapper = mount(Counter);
  await wrapper.find('button').trigger('click');
  expect(wrapper.find('.count').text()).toBe('1');
});
```

### 4. 端到端（E2E）测试

#### Cypress

**特点：**
- 现代化 E2E 测试框架
- 实时重载、时间旅行调试
- 自动等待、自动重试
- 可视化测试运行界面
- 内置截图、视频录制

**官方文档：** [Cypress](https://www.cypress.io/)

**基础用法：**

```javascript
describe('Login Flow', () => {
  it('should login successfully', () => {
    cy.visit('/login');
    cy.get('[data-testid="username"]').type('user@example.com');
    cy.get('[data-testid="password"]').type('password123');
    cy.get('[data-testid="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

**适用场景：**
- 完整用户流程测试
- 跨页面交互测试
- 表单提交、登录认证测试

#### Playwright

**特点：**
- Microsoft 出品
- 支持多浏览器（Chromium、Firefox、WebKit）
- 支持移动端模拟
- 并行执行，速度快
- 强大的 API 和调试工具

**官方文档：** [Playwright](https://playwright.dev/)

**基础用法：**

```javascript
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://example.com');
  await page.click('text=Get Started');
  expect(await page.textContent('h1')).toBe('Welcome');
});
```

**适用场景：**
- 多浏览器兼容性测试
- 移动端测试
- 性能监控

#### Puppeteer

**特点：**
- Google 出品，无头 Chrome 控制工具
- 可用于测试、爬虫、PDF 生成等
- API 相对底层
- 仅支持 Chromium

**官方文档：** [Puppeteer](https://pptr.dev/)

**基础用法：**

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({ path: 'example.png' });
  await browser.close();
})();
```

**适用场景：**
- 自动化任务
- 网页截图
- PDF 生成
- 性能分析

### 5. 视觉回归测试

#### Percy

**特点：**
- 自动化视觉测试平台
- 捕获、对比 UI 快照
- 与 CI/CD 集成
- 支持多种框架

**官方文档：** [Percy](https://percy.io/)

#### Chromatic

**特点：**
- Storybook 团队出品
- 与 Storybook 深度集成
- 自动化视觉测试和审查

**官方文档：** [Chromatic](https://www.chromatic.com/)

## 测试工具对比

### 单元测试框架对比

| 特性 | Jest | Vitest | Mocha |
|------|------|--------|-------|
| 配置复杂度 | 低 | 低 | 中 |
| 执行速度 | 快 | 极快 | 快 |
| TypeScript 支持 | 需配置 | 原生 | 需配置 |
| 快照测试 | ✅ | ✅ | ❌ |
| 内置断言 | ✅ | ✅ | ❌ |
| Vite 集成 | 需插件 | 原生 | 需配置 |
| 社区生态 | 丰富 | 成长中 | 成熟 |

### E2E 测试框架对比

| 特性 | Cypress | Playwright | Puppeteer |
|------|---------|-----------|-----------|
| 多浏览器支持 | 有限 | 全面 | 仅 Chromium |
| 执行速度 | 快 | 极快 | 快 |
| API 易用性 | 优秀 | 优秀 | 中等 |
| 调试体验 | 优秀 | 良好 | 良好 |
| 学习曲线 | 平缓 | 平缓 | 陡峭 |
| 用途 | E2E 测试 | E2E 测试 | 多用途 |

## 测试最佳实践

### 1. 测试金字塔

```
        /\
       /  \    E2E 测试（少量）
      /----\
     / 集成  \  集成测试（适量）
    /--------\
   /  单元测试 \ 单元测试（大量）
  /------------\
```

**原则：**
- 单元测试数量最多，执行最快
- 集成测试适量，覆盖关键流程
- E2E 测试少量，覆盖核心场景

### 2. 测试编写原则

**AAA 模式：**
```javascript
test('description', () => {
  // Arrange - 准备测试数据
  const input = 'test';
  
  // Act - 执行被测试的操作
  const result = processInput(input);
  
  // Assert - 验证结果
  expect(result).toBe('expected');
});
```

**测试独立性：**
- 每个测试应该独立运行
- 不依赖其他测试的执行结果
- 使用 beforeEach/afterEach 清理状态

**测试可读性：**
- 使用描述性的测试名称
- 一个测试只验证一个行为
- 避免测试实现细节

### 3. Mock 与 Stub

**何时使用 Mock：**
- 外部 API 调用
- 数据库操作
- 文件系统操作
- 复杂依赖

**Jest Mock 示例：**
```javascript
// Mock 模块
jest.mock('./api');
import { fetchUser } from './api';

test('fetches user', async () => {
  fetchUser.mockResolvedValue({ name: 'John' });
  const user = await getUserData();
  expect(user.name).toBe('John');
});
```

### 4. 测试覆盖率

**推荐覆盖率目标：**
- 语句覆盖率（Statement）：80% 以上
- 分支覆盖率（Branch）：75% 以上
- 函数覆盖率（Function）：80% 以上
- 行覆盖率（Line）：80% 以上

**注意：** 覆盖率是手段不是目的，关注测试质量而非数字。

### 5. CI/CD 集成

**建议配置：**
```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
      - run: npm run test:e2e
```

## 学习路径

### 入门路径

1. **理解测试类型**
   - 单元测试 vs 集成测试 vs E2E 测试
   - 测试金字塔理论
   - 何时该写什么测试

2. **掌握基础框架**
   - 学习 Jest 基础 API
   - 编写简单的单元测试
   - 理解断言和匹配器

3. **组件测试**
   - React Testing Library 或 Vue Test Utils
   - 测试组件渲染
   - 测试用户交互

4. **E2E 测试入门**
   - 选择 Cypress 或 Playwright
   - 编写简单的用户流程测试
   - 理解异步等待

### 进阶路径

1. **高级测试技巧**
   - Mock 和 Stub 策略
   - 测试异步代码
   - 测试 Hooks 和复杂状态

2. **测试优化**
   - 提高测试执行速度
   - 减少测试脆弱性
   - 平衡覆盖率与维护成本

3. **测试驱动开发（TDD）**
   - 先写测试后写代码
   - 红绿重构循环
   - TDD 实践案例

4. **自动化测试体系**
   - CI/CD 集成
   - 自动化测试报告
   - 视觉回归测试
   - 性能测试

## 工具链资源

### 官方文档

- [Jest](https://jestjs.io/) - 单元测试框架
- [Vitest](https://vitest.dev/) - Vite 测试框架
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - React 组件测试
- [Vue Test Utils](https://test-utils.vuejs.org/) - Vue 组件测试
- [Cypress](https://www.cypress.io/) - E2E 测试框架
- [Playwright](https://playwright.dev/) - 多浏览器 E2E 测试
- [Puppeteer](https://pptr.dev/) - 无头浏览器控制

### 学习资源

- [Testing JavaScript](https://testingjavascript.com/) - Kent C. Dodds 的测试课程
- [Jest 实践指南](https://github.com/facebook/jest/tree/main/examples) - Jest 官方示例
- [Cypress 最佳实践](https://docs.cypress.io/guides/references/best-practices) - Cypress 官方最佳实践

### 相关内部文档

- [前端工具链总览](../README.md)
- [Vitest 框架](../../frameworks/vitest/)
- [工具链资源](../resources.md)

---

**维护说明：** 测试工具和最佳实践持续演进，建议定期更新本文档内容。

**最后更新：** 2024-10
