# 性能优化场景题

> 本文档整理前端性能优化相关的高频面试题，包括资源加载、渲染优化、网络优化等方面。

## 目录

- [QPS 峰值处理](#qps-峰值处理)
- [大规模并发请求处理](#大规模并发请求处理)
- [资源预加载策略](#资源预加载策略)
- [图片懒加载](#图片懒加载)
- [代码分割与按需加载](#代码分割与按需加载)
- [虚拟列表](#虚拟列表)
- [网页加载进度条](#网页加载进度条)
- [请求耗时统计工具](#请求耗时统计工具)
- [相关知识点](#相关知识点)

---

## QPS 峰值处理 {#qps-峰值处理}

### 问题背景

当请求量突然增大（如秒杀、大促）时，如何保证系统稳定和用户体验。

### 解决方案

**前端层面**：

1. **请求限流**
```javascript
// 令牌桶算法
class RateLimiter {
  constructor(rate, capacity) {
    this.rate = rate;      // 每秒生成令牌数
    this.capacity = capacity; // 桶容量
    this.tokens = capacity;
    this.lastTime = Date.now();
  }
  
  async acquire() {
    const now = Date.now();
    const elapsed = (now - this.lastTime) / 1000;
    
    // 补充令牌
    this.tokens = Math.min(
      this.capacity,
      this.tokens + elapsed * this.rate
    );
    this.lastTime = now;
    
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    
    // 等待令牌
    const waitTime = (1 - this.tokens) / this.rate * 1000;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    this.tokens = 0;
    return true;
  }
}
```

2. **请求队列**
```javascript
class RequestQueue {
  constructor(concurrent = 3) {
    this.concurrent = concurrent; // 最大并发数
    this.running = 0;
    this.queue = [];
  }
  
  async add(fn) {
    if (this.running >= this.concurrent) {
      await new Promise(resolve => this.queue.push(resolve));
    }
    
    this.running++;
    try {
      return await fn();
    } finally {
      this.running--;
      const next = this.queue.shift();
      if (next) next();
    }
  }
}
```

3. **降级策略**
- 优先展示缓存数据
- 关闭非核心功能
- 简化页面内容

**后端配合**：
- CDN 缓存静态资源
- 接口缓存（Redis）
- 消息队列削峰
- 服务降级和熔断

### 常见追问

**Q: 如何防止用户重复点击提交？**

A:
- 按钮置灰（disabled）
- Loading 状态
- 请求防重（前端生成唯一 ID）
- 后端幂等性设计

---

## 大规模并发请求处理 {#大规模并发请求处理}

### 问题背景

页面需要同时发起大量请求（如批量上传、数据同步），如何控制并发避免浏览器和服务器压力过大。

### 解决方案

**并发控制器**：
```javascript
async function concurrentRequest(urls, limit = 3) {
  const results = [];
  const executing = [];
  
  for (const [index, url] of urls.entries()) {
    const promise = fetch(url)
      .then(res => res.json())
      .then(data => { results[index] = data; });
    
    results.push(promise);
    
    if (urls.length >= limit) {
      const execute = promise.then(() => {
        executing.splice(executing.indexOf(execute), 1);
      });
      executing.push(execute);
      
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  
  await Promise.all(results);
  return results;
}

// 使用
const urls = Array(100).fill(0).map((_, i) => `/api/item/${i}`);
const results = await concurrentRequest(urls, 5); // 最多 5 个并发
```

**请求合并**：
```javascript
// DataLoader 模式
class DataLoader {
  constructor(batchFn, delay = 10) {
    this.batchFn = batchFn;
    this.delay = delay;
    this.queue = [];
    this.timer = null;
  }
  
  load(key) {
    return new Promise((resolve, reject) => {
      this.queue.push({ key, resolve, reject });
      
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.dispatch();
        }, this.delay);
      }
    });
  }
  
  async dispatch() {
    const queue = this.queue;
    this.queue = [];
    this.timer = null;
    
    const keys = queue.map(item => item.key);
    
    try {
      const results = await this.batchFn(keys);
      queue.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      queue.forEach(item => item.reject(error));
    }
  }
}

// 使用
const userLoader = new DataLoader(async (ids) => {
  const response = await fetch(`/api/users?ids=${ids.join(',')}`);
  return response.json();
});

// 10ms 内的多个请求会合并成一个
const user1 = await userLoader.load(1);
const user2 = await userLoader.load(2);
const user3 = await userLoader.load(3);
```

### 技术要点

- **Promise.all**：全部成功才返回，一个失败全部失败
- **Promise.allSettled**：等待全部完成，包含成功和失败
- **Promise.race**：返回最先完成的（成功或失败）
- **Promise.any**：返回第一个成功的

### 常见追问

**Q: 如何处理失败的请求？**

A:
- 自动重试（指数退避）
- 失败队列单独处理
- 记录失败原因，提供手动重试

---

## 资源预加载策略 {#资源预加载策略}

### 核心概念

**preload** - 预加载当前页面关键资源
```html
<link rel="preload" href="/font.woff2" as="font" crossorigin>
```
- 高优先级，立即加载
- 必须使用，否则浏览器警告

**prefetch** - 预取未来可能用到的资源
```html
<link rel="prefetch" href="/next-page.js" as="script">
```
- 低优先级，空闲时加载
- 浏览器可选择不加载

**preconnect** - 预连接到服务器
```html
<link rel="preconnect" href="https://cdn.example.com" crossorigin>
```
- 建立完整连接（DNS + TCP + TLS）
- 适用于确定要请求的跨域资源

**dns-prefetch** - 仅 DNS 预解析
```html
<link rel="dns-prefetch" href="//api.example.com">
```
- 成本最低
- 适用于大量跨域资源

### 使用场景

**字体优化**：
```html
<link rel="preload" href="/font.woff2" as="font" type="font/woff2" crossorigin>
<style>
@font-face {
  font-family: 'CustomFont';
  src: url('/font.woff2') format('woff2');
  font-display: swap; /* 立即使用备用字体，加载后交换 */
}
</style>
```

**路由预取**：
```javascript
// 鼠标悬停时预取
<Link 
  to="/products"
  onMouseEnter={() => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/chunks/products.js';
    document.head.appendChild(link);
  }}
>
  产品列表
</Link>
```

### 常见追问

**Q: preload 和 prefetch 的区别？**

A:
- **preload**：当前页面必需，高优先级，必须使用
- **prefetch**：未来可能需要，低优先级，可选

**Q: 如何避免滥用导致带宽浪费？**

A:
- 只预加载真正需要的资源
- 根据用户行为智能预取（如悬停时）
- 监控预加载资源的实际使用率

---

## 图片懒加载 {#图片懒加载}

### 实现方案

**方案一：原生 lazy loading（推荐）**
```html
<img src="image.jpg" loading="lazy" alt="图片">
```
- 最简单，浏览器原生支持
- Chrome 76+，Firefox 75+

**方案二：Intersection Observer**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // 加载真实图片
      observer.unobserve(img);
    }
  });
}, {
  rootMargin: '50px' // 提前 50px 加载
});

document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});
```

**方案三：Scroll 事件**
```javascript
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

const lazyLoad = throttle(() => {
  document.querySelectorAll('img[data-src]').forEach(img => {
    if (isInViewport(img)) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  });
}, 200);

window.addEventListener('scroll', lazyLoad);
```

### 优化技巧

**占位符**：
```html
<!-- 方式1：LQIP（低质量图片占位）-->
<img src="tiny-blur.jpg" data-src="full.jpg">

<!-- 方式2：BlurHash -->
<canvas width="32" height="32" data-blurhash="LGF5?xYk^6#M@-5c,1J5@[or[Q6."></canvas>

<!-- 方式3：纯色或渐变 -->
<div style="background: #f0f0f0; aspect-ratio: 16/9"></div>
```

**响应式图片**：
```html
<img
  src="small.jpg"
  srcset="small.jpg 400w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  loading="lazy"
>
```

### 常见追问

**Q: 为什么需要提前加载（rootMargin）？**

A: 避免用户看到图片加载过程。设置 50-100px 的提前量，用户滚动到图片前图片已经加载完成。

**Q: 如何处理图片加载失败？**

A:
```javascript
img.onerror = () => {
  img.src = '/placeholder-error.jpg'; // 显示错误占位图
};
```

---

## 代码分割与按需加载 {#代码分割与按需加载}

### 实现方式

**动态 import**：
```javascript
// 点击时再加载模块
button.addEventListener('click', async () => {
  const module = await import('./heavy-feature.js');
  module.init();
});

// React 路由懒加载
const AdminPage = lazy(() => import('./pages/Admin'));

<Suspense fallback={<Loading />}>
  <AdminPage />
</Suspense>

// Vue 路由懒加载
const routes = [
  {
    path: '/admin',
    component: () => import('./pages/Admin.vue')
  }
];
```

**Webpack 配置**：
```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        common: {
          minChunks: 2,
          name: 'common',
          priority: 5
        }
      }
    }
  }
};
```

### 分割策略

1. **按路由分割**：每个路由一个 chunk
2. **按功能分割**：大模块（富文本编辑器、图表库）单独打包
3. **按框架分割**：React/Vue 等框架单独打包
4. **公共代码提取**：多个页面共用的代码提取出来

### 常见追问

**Q: 如何决定代码分割的粒度？**

A:
- 太细：HTTP 请求过多，加载慢
- 太粗：单个文件太大，首屏慢
- 建议：单个 chunk 100-300KB，首屏必需的不拆分

---

## 虚拟列表 {#虚拟列表}

### 问题背景

渲染 10000+ 条数据时，DOM 节点过多导致性能问题。

### 实现原理

只渲染可见区域的数据：
```
总数据: 10000 条
可见区域: 10 条
实际渲染: 10 条（动态计算哪 10 条）
```

**核心思路**：
1. 计算可见区域可以显示多少条
2. 根据滚动位置计算应该显示哪些数据
3. 只渲染这部分数据
4. 用空白 div 撑起总高度

### 技术要点

```javascript
// 简化实现
const itemHeight = 50;       // 每项高度
const containerHeight = 600; // 容器高度
const visibleCount = Math.ceil(containerHeight / itemHeight);

container.addEventListener('scroll', () => {
  const scrollTop = container.scrollTop;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = startIndex + visibleCount;
  
  // 渲染 startIndex 到 endIndex 的数据
  renderItems(data.slice(startIndex, endIndex));
  
  // 设置偏移
  content.style.transform = `translateY(${startIndex * itemHeight}px)`;
});

// 设置总高度
container.style.height = `${data.length * itemHeight}px`;
```

### 使用现成库

```javascript
// React
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={10000}
  itemSize={50}
>
  {({ index, style }) => (
    <div style={style}>{data[index].name}</div>
  )}
</FixedSizeList>

// Vue
import { RecycleScroller } from 'vue-virtual-scroller';

<RecycleScroller
  :items="items"
  :item-size="50"
  key-field="id"
>
  <template #default="{ item }">
    <div>{{ item.name }}</div>
  </template>
</RecycleScroller>
```

### 常见追问

**Q: 为什么虚拟列表能提升性能？**

A:
- 减少 DOM 节点数量（10000 → 10）
- 减少浏览器重排重绘
- 降低内存占用

**Q: 虚拟列表的局限性？**

A:
- 每项高度必须固定或可预测
- SEO 不友好（内容未真实渲染）
- 实现复杂度高

---

---

## 网页加载进度条 {#网页加载进度条}

### 问题背景

【百度一面】如何实现网页加载进度条？

### 解决方案

（待补充）

### 技术要点

（待补充）

### 常见追问

（待补充）

---

## 请求耗时统计工具 {#请求耗时统计工具}

### 问题背景

【字节一面】设计一套全站请求耗时统计工具。

### 解决方案

（待补充）

### 技术要点

（待补充）

### 常见追问

（待补充）

---

## 相关知识点 {#相关知识点}

### 浏览器相关
- [浏览器基础](../foundations/browser.md) - 渲染原理、Performance API
- [网络基础](../foundations/network.md) - HTTP 缓存、CDN

### 框架优化
- [React 性能优化](../frameworks/react/patterns-and-performance.md#性能优化)
- [Vue 性能优化](../frameworks/vue/ecosystem.md#vue-性能优化)

### 工具链
- [Webpack](../tooling/webpack.md) - 代码分割配置
- [Vite](../tooling/vite.md) - 构建优化

---

**最后更新**：2024-10  
**维护者**：Hidetoshi Dekisugi  
**说明**：性能优化需要结合具体场景，避免过度优化
