# 快速上手指南

## 环境准备

### 系统要求
- **操作系统**：Windows 10+ / macOS 10.15+ / Linux
- **Node.js**：版本 14.0.0 或更高
- **包管理器**：pnpm 或 npm
- **编辑器**：VS Code 或其他现代编辑器

### 安装 Node.js
1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载并安装 LTS 版本
3. 验证安装：
   ```bash
   node --version
   npm --version
   ```

### 安装 pnpm（推荐）
```bash
npm install -g pnpm
```

## 项目设置

### 1. 克隆项目
```bash
git clone <repository-url>
cd wind-zx
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 启动开发服务器
```bash
pnpm start
```

### 4. 访问项目
打开浏览器访问：`http://localhost:8081`

## 项目结构说明

### 核心文件
- `index.html` - 项目首页
- `contact.html` - 联系页面
- `other.html` - 其他页面
- `risk.html` - 风险页面
- `proxy.js` - 开发代理服务器
- `gulpfile.js` - 构建配置

### 资源目录
```
resource/
├── css/          # 样式文件
├── js/           # JavaScript文件
├── images/       # 图片资源
└── static/       # 其他静态资源
```

## 开发工作流

### 1. 页面开发
- 在根目录创建新的 HTML 文件
- 在 `resource/css/` 添加对应的样式文件
- 在 `resource/js/` 添加对应的脚本文件

### 2. 样式开发
- 使用 CSS3 编写样式
- 遵循响应式设计原则
- 使用模块化的样式组织

### 3. 脚本开发
- 使用 ES6+ 语法
- 使用 jQuery 进行 DOM 操作
- 通过代理服务器调用 API

### 4. 构建项目
```bash
pnpm run build
```

## 开发工具

### VS Code 推荐插件
- **Live Server** - 本地开发服务器
- **HTML CSS Support** - HTML/CSS 支持
- **JavaScript (ES6) code snippets** - ES6 代码片段
- **Prettier** - 代码格式化
- **ESLint** - 代码检查

### 浏览器开发工具
- **Chrome DevTools** - 调试和性能分析
- **Network** - 网络请求监控
- **Console** - 控制台调试
- **Elements** - DOM 结构查看

## 调试技巧

### 1. 控制台调试
```javascript
// 在浏览器控制台中调试
console.log('调试信息');
console.error('错误信息');
console.warn('警告信息');
```

### 2. 网络请求调试
- 使用浏览器 Network 面板
- 查看 API 请求和响应
- 检查代理服务器配置

### 3. 样式调试
- 使用浏览器 Elements 面板
- 实时修改 CSS 样式
- 查看响应式布局效果

## 常见问题

### 1. 端口冲突
如果 8081 端口被占用，修改 `proxy.js` 中的端口号：
```javascript
const PORT = 8082  // 修改为其他端口
```

### 2. 代理服务器问题
检查 `proxy.js` 中的代理配置：
```javascript
// 确保目标服务器地址正确
target: 'https://gel.wind.com.cn'
```

### 3. 版本号问题
如果静态资源版本号没有更新，运行构建命令：
```bash
pnpm run build
```

### 4. 跨域问题
检查代理服务器的 CORS 配置：
```javascript
proxyRes.headers['Access-Control-Allow-Origin'] = '*'
```

## 部署准备

### 1. 构建项目
```bash
pnpm run build
```

### 2. 检查构建产物
- 确保所有 HTML 文件的版本号已更新
- 检查静态资源路径是否正确
- 验证页面功能是否正常

### 3. 部署到服务器
- 将构建后的文件上传到 Web 服务器
- 配置 Nginx 或 Apache 服务器
- 设置正确的 MIME 类型

## 开发规范

### 1. 代码风格
- 使用 2 空格缩进
- 使用 UTF-8 编码
- 遵循 HTML5 语义化标准
- 使用 ES6+ 语法

### 2. 文件命名
- HTML 文件使用小写字母和连字符
- CSS 文件使用功能模块命名
- JavaScript 文件使用驼峰命名

### 3. 注释规范
```html
<!-- HTML 注释 -->
<div class="container">
  <!-- 内容区域 -->
</div>
```

```css
/* CSS 注释 */
.container {
  /* 容器样式 */
}
```

```javascript
// JavaScript 注释
function handleClick() {
  // 处理点击事件
}
```

## 学习资源

### 1. 技术文档
- [HTML5 规范](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
- [CSS3 规范](https://developer.mozilla.org/zh-CN/docs/Web/CSS)
- [JavaScript 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
- [jQuery 文档](https://api.jquery.com/)

### 2. 开发工具
- [VS Code 文档](https://code.visualstudio.com/docs)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [Gulp 文档](https://gulpjs.com/docs/en/getting-started/quick-start)

### 3. 最佳实践
- [Web 开发最佳实践](https://developer.mozilla.org/zh-CN/docs/Learn)
- [响应式设计指南](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [性能优化指南](https://developer.mozilla.org/zh-CN/docs/Web/Performance)

## 联系方式

如有问题或建议，请联系：
- **技术负责人**：[联系方式]
- **开发团队**：[团队联系方式]
- **项目文档**：[文档链接] 