# Vue 生态系统与实践

> 本文涵盖 Vue Router、Vuex 之外的生态工具、测试框架以及实践技巧。

## 目录

1. [路由 (Vue Router)](#路由-vue-router)
2. [工具与测试](#工具与测试)
3. [实践技巧](#实践技巧)

---

## 路由 (Vue Router)

### 导航守卫

导航守卫用于在路由跳转的不同阶段进行拦截与处理。

**全局前置守卫：**

```javascript
const router = new VueRouter({ ... })
router.beforeEach((to, from, next) => {
  // ...
})
```

每个守卫参数：`to`、`from`、`next`。`next` 的不同调用方式会影响导航流转。

**全局解析守卫、后置钩子、路由独享守卫与组件内守卫：**

```javascript
// 全局后置钩子
router.afterEach((to, from) => {
  // 无 next
})

// 路由独享守卫
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})

// 组件内守卫
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) { /* ... */ },
  beforeRouteUpdate (to, from, next) { /* ... */ },
  beforeRouteLeave (to, from, next) { /* ... */ }
}
```

### 登录鉴权示例（全局前置）

```javascript
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)){
    const hasToken = !!(sessionStorage.getItem('token') || localStorage.getItem('token'))
    if (!hasToken) {
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})
```

### 路由懒加载

```javascript
const Foo = () => import('./Foo.vue')
const router = new VueRouter({ 
  routes: [{ path: '/foo', component: Foo }] 
})
```

### Hash 与 History

- **Hash 模式**: 依赖 `hashchange` 事件，不触发服务端请求。
- **History 模式**: 依赖 `pushState/replaceState` 与 `popstate` 事件，需服务端兜底配置指向 `index.html`。

---

## 工具与测试

### Vitest 概览

Vitest 是基于 Vite 的极速单元测试框架，特别适合 Vue 项目：

- **原生 ESM**：启动快速
- **配置共享**：与 Vite 配置共享，前端依赖零摩擦
- **TypeScript 支持**：良好的 TypeScript 支持

**最小可运行用例：**

```javascript
// sum.test.js
import { describe, it, expect } from 'vitest'

describe('sum', () => {
  it('adds numbers', () => {
    const sum = (a, b) => a + b
    expect(sum(1, 2)).toBe(3)
  })
})
```

### 相关资源

- [部署 | Vue CLI](https://cli.vuejs.org/zh/guide/deployment.html#云开发-cloudbase)
- [juejin.cn 文章 1](https://juejin.cn/post/6844903837774397447)
- [juejin.cn 文章 2](https://juejin.cn/post/6862206197877964807)
- [juejin.cn 文章 3](https://juejin.cn/post/6844904032218120200)

---

## 实践技巧

### computed vs watch

**computed（计算属性）**：
- 有缓存，依赖的响应式数据不变时不会重新计算
- 必须有 `return` 值
- 适用于：从已有数据派生新数据（如格式化、筛选、计算）

**watch（侦听器）**：
- 无缓存，监听的数据变化就会执行
- 无需 `return` 值
- 适用于：数据变化时执行异步或开销较大的操作

```javascript
// computed 示例
computed: {
  fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

// watch 示例
watch: {
  searchQuery(newVal) {
    // 执行 API 调用或其他副作用
    this.fetchResults(newVal)
  }
}
```

### Vue 性能优化

1. **v-if vs v-show**：频繁切换用 `v-show`，条件少变用 `v-if`
2. **v-for 的 key**：使用唯一 ID，避免用 index
3. **computed 缓存**：利用计算属性的缓存特性
4. **异步组件**：大组件懒加载 `() => import('./Component.vue')`
5. **keep-alive**：缓存组件状态，避免重复渲染
6. **虚拟滚动**：长列表使用虚拟滚动（如 `vue-virtual-scroller`）
7. **Object.freeze()**：冻结不需响应式的大数据对象

### 常见问题排查

**数据更新了但视图不更新**：
- 对象属性新增/删除 → 使用 `Vue.set` / `this.$set`
- 数组索引直接赋值 → 使用 `Vue.set` 或 `splice`
- 数据改变在 `nextTick` 之前检查 → 使用 `this.$nextTick()`

**组件通信选择**：
- 父子 → `props` / `$emit`
- 跨级 → `provide` / `inject` 或 `$attrs` / `$listeners`
- 兄弟/任意 → Event Bus 或 Vuex

### 开发调试技巧

1. **Vue Devtools**：浏览器扩展，查看组件树、状态、事件
2. **性能追踪**：`performance.mark()` 配合 Vue Devtools
3. **错误边界**：使用 `errorCaptured` 钩子捕获子组件错误
4. **开发环境配置**：合理使用 `process.env.NODE_ENV` 区分环境

```javascript
// 错误捕获示例
export default {
  errorCaptured(err, vm, info) {
    console.error('Error:', err)
    console.log('Component:', vm)
    console.log('Info:', info)
    // 返回 false 阻止错误继续向上传播
    return false
  }
}
```

---

## 相关文档

- [Vue 基础](./basics.md) - 核心概念、数据绑定、生命周期
- [组件通信](./components-communication.md) - 7 种组件通信方式
- [状态管理](./state-management.md) - Vuex 详解
- [React vs Vue 对比](../comparisons.md) - 框架对比

