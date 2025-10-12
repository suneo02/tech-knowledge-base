# 文档编写规范

> **文档目标**：建立统一的文档编写标准，确保知识库的一致性、可读性和可维护性。

## 目录

1. [核心原则](#核心原则)
2. [命名规范](#命名规范)
3. [文档组织策略](#文档组织策略)
4. [内容编写标准](#内容编写标准)
5. [维护与质量保证](#维护与质量保证)
6. [工具与工作流](#工具与工作流)
7. [常见问题与最佳实践](#常见问题与最佳实践)

---

## 核心原则

### 1. 内容优先原则
- **优先考虑内容的完整性**：一个文档可以较长，包含完整的主题内容
- **避免过度拆分**：相关内容应保持在同一文档中，便于连贯阅读
- **拆分时机**：只有当单个文档超过 1000 行或包含多个独立子主题时才考虑拆分

### 2. 可读性原则
- 使用清晰的层级结构（标题层级）
- 提供文档内目录导航（TOC）
- 使用合理的段落分隔和视觉分组
- 重要信息使用引用块或提示框突出显示

### 3. 可维护性原则
- 统一的命名规范
- 清晰的目录结构
- 相对路径链接
- 定期检查和更新

### 4. 渐进式原则
- 从概述到细节的内容组织
- 先介绍核心概念，再深入具体实现
- 提供适当的跨文档链接供深入阅读

---

## 命名规范

### 文件夹命名

**规则：使用 kebab-case（短横线分隔）**

- 全小写字母
- 单词间用短横线 `-` 分隔
- 避免使用空格、下划线或其他特殊字符
- 使用描述性名称，避免缩写

✅ **正确示例：**
```
web-front-end/
web-framework/
web-security/
database-systems/
computer-networking/
```

❌ **错误示例：**
```
Web Front End/        # 包含空格
Web_Front_End/        # 使用下划线
webFrontEnd/          # 使用驼峰命名
WFE/                  # 使用缩写
```

**原因说明：**
- kebab-case 在 URL 中更友好，避免编码问题
- 全小写避免跨平台文件系统大小写敏感问题
- 描述性名称提高可读性和可维护性

### 文件命名

**规则：使用 kebab-case（短横线分隔）**

- 全小写字母
- 单词间用短横线 `-` 分隔
- 文件扩展名保持原样（`.md`）
- 使用英文命名，中文内容放在文件内部

✅ **正确示例：**
```
web-scenario.md
web-performance.md
browser.md
visualization.md
auth-and-loading.md
package-managers.md
```

❌ **错误示例：**
```
Web_Scenario.md       # 使用下划线
webPerformance.md     # 使用驼峰命名
web scenario.md       # 包含空格
前端工程化.md         # 使用中文（不推荐）
```

**特殊文件命名约定：**
- `README.md` - 目录索引文件（全大写）
- `index.md` - 主题概述文件（全小写）
- `resources.md` - 资源汇总文件

### 图片和资源文件命名

**规则：使用描述性的 kebab-case 命名**

- 全小写字母
- 使用短横线分隔单词
- 保持原有的扩展名（`.png`, `.jpg`, `.jpeg`, `.svg` 等）
- 可包含日期信息（使用 ISO 格式：YYYY-MM-DD）

✅ **推荐示例：**
```
screenshot-2024-04-03-react-component.png
architecture-diagram.svg
user-flow-chart.png
database-schema.png
```

✅ **可接受示例：**
```
img-0437.jpeg         # 来自外部源的图片
untitled.png          # 临时图片（应尽快重命名）
```

---

##文档组织策略

### 目录结构设计

```
docs/
├── 技术领域/                    # 一级分类：按技术领域划分
│   ├── README.md               # 该领域的概述和导航
│   ├── 主题文档.md              # 完整的主题文档（可以较长）
│   ├── 子主题/                  # 二级分类：独立子主题
│   │   ├── README.md           # 子主题概述
│   │   ├── 详细文档.md          # 详细内容文档
│   │   └── assets/             # 相关资源文件
│   │       ├── images/         # 图片资源
│   │       └── files/          # 其他文件
│   └── resources.md            # 该领域的外部资源汇总
```

**示例结构：**
```
docs/
├── front-end/
│   ├── README.md                           # 前端总览
│   ├── architecture.md                     # 前端架构（完整文档）
│   ├── foundations/                        # 基础知识子分类
│   │   ├── browser.md                      # 浏览器原理（完整）
│   │   ├── network.md                      # 网络基础（完整）
│   │   └── security/                       # 安全相关
│   │       ├── xss-and-csrf.md            # XSS 和 CSRF 防护
│   │       └── content-security-policy.md  # CSP 策略
│   ├── frameworks/                         # 框架相关
│   │   ├── react/
│   │   │   ├── README.md                  # React 概述
│   │   │   ├── core-concepts.md           # 核心概念（完整文档）
│   │   │   ├── hooks.md                   # Hooks 详解（完整文档）
│   │   │   └── performance.md             # 性能优化
│   │   └── vue/
│   │       └── ...
│   └── resources.md                        # 前端学习资源
```

### 文档拆分决策

**何时保持单一文档：**
- 内容相互关联，需要连贯阅读
- 文档长度在 1000 行以内
- 主题单一且完整
- 频繁交叉引用的内容

**示例：** `hooks.md` 包含所有 React Hooks 的详细说明，虽然较长但保持完整性

**何时拆分文档：**
- 文档超过 1000 行且包含多个独立主题
- 内容可以独立阅读和理解
- 不同受众群体需要不同内容
- 更新频率差异较大的内容

**示例：** 前端框架拆分为 React、Vue、Angular 等独立目录

### README.md 的使用

每个目录的 `README.md` 应包含：

1. **简短介绍**：该目录/主题的概述（2-3 段）
2. **内容导航**：清晰的子文档列表和说明
3. **学习路径**：推荐的阅读顺序（如适用）
4. **快速链接**：常用参考和资源

**示例：**

```markdown
# 前端开发

> 本部分涵盖现代前端开发的核心知识，包括基础原理、框架使用、工程化实践等。

## 📚 内容导航

### 基础知识
- [浏览器原理](foundations/browser.md) - 浏览器渲染、事件循环、性能优化
- [网络基础](foundations/network.md) - HTTP、WebSocket、网络安全
- [安全实践](foundations/security/) - XSS、CSRF、CSP 等安全主题

### 框架与库
- [React](frameworks/react/) - React 生态系统完整指南
- [Vue](frameworks/vue/) - Vue.js 深入理解

### 工程化
- [构建工具](tooling/bundlers-and-modules.md) - Webpack、Vite 等构建工具详解
- [包管理](tooling/package-managers.md) - npm、yarn、pnpm 对比

## 📖 推荐学习路径

1. 基础知识：浏览器原理 → 网络基础 → 安全实践
2. 框架选择：React 或 Vue（根据项目需求）
3. 工程化实践：构建工具 → 包管理 → 测试

## 🔗 外部资源

完整的外部学习资源请参考 [resources.md](resources.md)
```

### 层级深度控制

**推荐层级：2-3 层**

```
✅ 推荐：
docs/front-end/frameworks/react/hooks.md        # 3层

⚠️ 谨慎使用：
docs/front-end/frameworks/react/hooks/use-effect/advanced.md  # 5层

❌ 避免：过深的嵌套会影响导航和维护
```

**处理复杂主题的策略：**
- 在单个文档内使用标题层级（H2-H6）而非创建新目录
- 使用文档内锚点链接
- 必要时使用表格或列表组织内容

---

## 内容编写标准

### Markdown 语法规范

#### 标题层级

```markdown
# H1 - 文档标题（每个文档只有一个）

## H2 - 主要章节

### H3 - 子章节

#### H4 - 小节

##### H5 - 细节说明

###### H6 - 最小单位（谨慎使用）
```

**最佳实践：**
- 不要跳过层级（如从 H2 直接到 H4）
- H1 标题应与文件名相关
- 使用描述性标题，避免"简介"、"其他"等模糊标题

#### 代码块

**始终指定语言类型：**

```markdown
\`\`\`javascript
function example() {
    console.log('Hello World');
}
\`\`\`

\`\`\`typescript
interface User {
    id: number;
    name: string;
}
\`\`\`

\`\`\`bash
npm install package-name
\`\`\`

\`\`\`python
def hello_world():
    print("Hello World")
\`\`\`
```

**支持的语言标识：**
- `javascript` / `js`
- `typescript` / `ts`
- `python` / `py`
- `bash` / `shell`
- `json`
- `yaml`
- `html`
- `css`
- `markdown`
- `sql`

#### 行内代码

使用反引号包裹：

```markdown
使用 `useState` Hook 来管理状态。
运行 `npm install` 安装依赖。
配置文件位于 `config/app.json`。
```

#### 链接和引用

**内部链接（相对路径）：**

```markdown
✅ 正确：
[React Hooks](frameworks/react/hooks.md)
[返回上级](../README.md)
[同级文档](browser.md)

❌ 错误：
[React Hooks](/docs/frameworks/react/hooks.md)  # 绝对路径
[React Hooks](https://example.com/hooks.md)     # 外部链接用于内部文档
```

**外部链接：**

```markdown
[MDN Web Docs](https://developer.mozilla.org/)
[React 官方文档](https://react.dev/)
```

**锚点链接（文档内导航）：**

```markdown
[跳转到命名规范](#命名规范)
[查看常见问题](#常见问题与最佳实践)
```

**图片引用：**

```markdown
![图片描述](assets/images/architecture-diagram.png)
![流程图](../assets/user-flow.png)
```

#### 列表

**无序列表：**

```markdown
- 第一项
- 第二项
  - 子项 1
  - 子项 2
- 第三项
```

**有序列表：**

```markdown
1. 第一步
2. 第二步
3. 第三步
```

**任务列表：**

```markdown
- [x] 已完成任务
- [ ] 待完成任务
- [ ] 另一个待办事项
```

#### 表格

```markdown
| 特性 | React | Vue | Angular |
|------|-------|-----|---------|
| 学习曲线 | 中等 | 简单 | 陡峭 |
| 性能 | 优秀 | 优秀 | 良好 |
| 生态系统 | 丰富 | 丰富 | 完整 |
```

**表格对齐：**

```markdown
| 左对齐 | 居中 | 右对齐 |
|:-------|:----:|-------:|
| 文本 | 文本 | 文本 |
```

#### 引用和提示

**引用块：**

```markdown
> 这是一个引用块，用于重要说明或摘要。

> **注意**：这是需要特别注意的内容。
```

**提示框（MkDocs Material 扩展）：**

```markdown
!!! note "提示"
    这是一个提示信息。

!!! warning "警告"
    这是需要注意的警告。

!!! info "信息"
    这是补充信息。

!!! tip "技巧"
    这是有用的技巧。

!!! danger "危险"
    这是危险操作警告。
```

### 内容组织模式

#### 概念解释文档结构

```markdown
# 主题标题

> 简短的一句话概述

## 概述

[2-3段文字介绍该主题的背景、重要性和应用场景]

## 核心概念

### 概念 1
[详细解释]

### 概念 2
[详细解释]

## 工作原理

[深入解释机制和原理]

## 实践示例

### 示例 1：基础用法
\`\`\`javascript
// 代码示例
\`\`\`

### 示例 2：高级用法
\`\`\`javascript
// 代码示例
\`\`\`

## 最佳实践

1. 实践 1
2. 实践 2
3. 实践 3

## 常见问题

### Q: 问题 1？
A: 回答 1

### Q: 问题 2？
A: 回答 2

## 相关资源

- [相关文档 1](link)
- [相关文档 2](link)
- [外部资源](link)
```

#### 教程文档结构

```markdown
# 教程标题

## 前置知识

- 需要了解的概念 1
- 需要了解的概念 2

## 学习目标

完成本教程后，你将能够：
1. 目标 1
2. 目标 2

## 步骤详解

### 步骤 1：准备工作

[说明和代码]

### 步骤 2：实现核心功能

[说明和代码]

### 步骤 3：测试和验证

[说明和代码]

## 完整示例

[完整代码示例]

## 扩展阅读

- [深入主题](link)
- [相关教程](link)
```

#### 参考文档结构

```markdown
# API 参考 / 命令参考

## 快速参考

[常用命令/API 表格]

## 详细说明

### 命令/API 1

**语法：**
\`\`\`
command [options]
\`\`\`

**参数：**
- `param1` - 参数说明
- `param2` - 参数说明

**示例：**
\`\`\`bash
command --option value
\`\`\`

### 命令/API 2

[同上结构]
```

### 代码示例编写规范

**原则：**
1. 代码要完整可运行（或明确标注伪代码）
2. 包含必要的注释
3. 遵循语言最佳实践
4. 使用有意义的变量名

**示例：**

```javascript
// ✅ 好的代码示例
/**
 * 使用 useEffect 处理副作用
 * 在组件挂载时获取数据，卸载时清理
 */
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchUser() {
            try {
                const response = await fetch(`/api/users/${userId}`);
                const data = await response.json();
                
                if (isMounted) {
                    setUser(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        }

        fetchUser();

        // 清理函数
        return () => {
            isMounted = false;
        };
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    return <div>{user.name}</div>;
}
```

```javascript
// ❌ 不好的代码示例（过于简化，缺少上下文）
useEffect(() => {
    fetchData();
}, []);
```

### 图表和可视化

**使用场景：**
- 架构图：展示系统结构
- 流程图：说明处理流程
- 时序图：展示交互顺序
- 关系图：说明组件关系

**推荐工具：**
- [Mermaid](https://mermaid.js.org/) - Markdown 内嵌图表
- [Draw.io](https://draw.io) - 专业图表工具
- [Excalidraw](https://excalidraw.com/) - 手绘风格图表

**Mermaid 示例：**

```markdown
\`\`\`mermaid
graph TD
    A[开始] --> B{条件判断}
    B -->|是| C[执行操作1]
    B -->|否| D[执行操作2]
    C --> E[结束]
    D --> E
\`\`\`
```

---

## 维护与质量保证

### 版本控制规范

#### Git Commit 消息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型：**
- `docs`: 文档更新
- `fix`: 修复错误（链接、拼写、格式等）
- `feat`: 新增内容
- `refactor`: 重构文档结构
- `style`: 格式调整（不影响内容）
- `chore`: 其他修改（配置文件等）

**示例：**

```bash
docs(front-end): add React Hooks detailed guide

- Add comprehensive explanation of useState and useEffect
- Include practical examples and best practices
- Add common pitfalls section

Closes #123
```

```bash
fix(network): correct broken links in TCP chapter

- Update relative paths after directory restructuring
- Fix image references
```

```bash
refactor(database): reorganize SQL chapters structure

- Merge basic and advanced SQL into single comprehensive doc
- Move examples to dedicated sections
- Update navigation in README
```

### 质量检查清单

#### 新文档发布前检查

- [ ] 文件命名符合 kebab-case 规范
- [ ] 文档包含清晰的标题和概述
- [ ] 所有代码块指定了语言类型
- [ ] 内部链接使用相对路径
- [ ] 图片文件已正确引用
- [ ] 无明显拼写和语法错误
- [ ] 代码示例可运行或明确标注
- [ ] 已在本地测试 MkDocs 构建
- [ ] 已更新相关目录的 README.md

#### 定期维护检查

**每月检查：**
- 运行 `mkdocs build` 检查断链
- 检查图片加载情况
- 更新过时的技术信息
- 检查外部链接有效性

**每季度检查：**
- 审查文档结构合理性
- 评估是否需要合并或拆分文档
- 更新技术版本信息
- 收集用户反馈并改进

### 文档更新流程

#### 创建新文档

1. **规划阶段**
   - 确定文档主题和范围
   - 选择合适的目录位置
   - 确定文档名称（kebab-case）

2. **编写阶段**
   - 创建文档文件
   - 按照内容组织模式编写
   - 添加必要的代码示例和图表

3. **集成阶段**
   - 更新所在目录的 README.md
   - 添加相关的交叉引用链接
   - 运行 `mkdocs serve` 本地预览

4. **发布阶段**
   - 运行质量检查清单
   - 提交 Git commit（遵循消息格式）
   - 推送到远程仓库

#### 更新现有文档

1. **评估更新范围**
   - 小改动：直接编辑
   - 大改动：考虑版本备份

2. **进行更新**
   - 保持原有风格和结构
   - 更新修改日期（如文档包含）
   - 检查受影响的链接

3. **验证更新**
   - 本地构建测试
   - 检查相关文档是否需要同步更新

#### 删除或重命名文档

1. **影响评估**
   - 搜索引用该文档的所有链接
   - 评估是否需要重定向

2. **执行操作**
   - 删除：确保清理所有引用
   - 重命名：更新所有引用链接

3. **记录变更**
   - 在 commit 消息中说明原因
   - 如有重大变更，更新 CHANGELOG

---

## 工具与工作流

### MkDocs 命令

#### 本地开发

```bash
# 启动本地服务器（支持热重载）
mkdocs serve

# 指定端口
mkdocs serve -a localhost:8001

# 详细输出
mkdocs serve --verbose
```

访问 `http://127.0.0.1:8000` 查看效果。

#### 构建和部署

```bash
# 构建静态网站
mkdocs build

# 清理后构建
mkdocs build --clean

# 检查配置
mkdocs build --strict  # 警告视为错误

# 部署到 GitHub Pages
mkdocs gh-deploy

# 强制推送（谨慎使用）
mkdocs gh-deploy --force
```

### 配置文件说明

`mkdocs.yml` 是项目配置文件，包含：

```yaml
# 网站信息
site_name: 项目名称
site_url: https://example.com
site_description: 项目描述

# 主题配置
theme:
  name: material
  language: zh
  features:
    - navigation.tabs
    - navigation.top
    - search.highlight

# 导航结构
nav:
  - 首页: index.md
  - 前端:
      - front-end/README.md
      - 基础: front-end/foundations/browser.md

# Markdown 扩展
markdown_extensions:
  - admonition
  - codehilite
  - toc:
      permalink: true

# 插件
plugins:
  - search
  - minify
```

### 编辑器配置

#### VS Code 推荐扩展

```json
{
  "recommendations": [
    "yzhang.markdown-all-in-one",     // Markdown 支持
    "davidanson.vscode-markdownlint", // Markdown 检查
    "shd101wyy.markdown-preview-enhanced", // 预览增强
    "bierner.markdown-mermaid",       // Mermaid 图表
    "streetsidesoftware.code-spell-checker" // 拼写检查
  ]
}
```

#### Markdown 编辑器配置

```json
{
  "markdown.preview.breaks": true,
  "markdown.preview.fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI'",
  "markdown.extension.toc.levels": "2..6",
  "[markdown]": {
    "editor.defaultFormatter": "yzhang.markdown-all-in-one",
    "editor.formatOnSave": true,
    "editor.wordWrap": "on"
  }
}
```

### 辅助脚本

#### 检查断链脚本

```bash
#!/bin/bash
# check-links.sh

echo "Building documentation..."
mkdocs build --strict

if [ $? -eq 0 ]; then
    echo "✅ Build successful! No broken links found."
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
```

#### 批量重命名脚本

```bash
#!/bin/bash
# rename-to-kebab-case.sh

# 将文件名转换为 kebab-case
for file in *.md; do
    newname=$(echo "$file" | sed 's/[A-Z]/-\L&/g' | sed 's/^-//' | sed 's/_/-/g' | tr '[:upper:]' '[:lower:]')
    if [ "$file" != "$newname" ]; then
        echo "Renaming: $file -> $newname"
        mv "$file" "$newname"
    fi
done
```

---

## 常见问题与最佳实践

### 常见问题

#### Q1: 为什么使用 kebab-case 而不是其他命名方式？

**A:** kebab-case 有以下优势：

1. **URL 友好**：浏览器 URL 中不需要编码，更简洁易读
2. **跨平台兼容**：避免 Windows/Linux/macOS 文件系统大小写问题
3. **可读性好**：短横线作为分隔符比下划线更清晰
4. **业界标准**：大多数现代 Web 项目采用此规范

#### Q2: 什么时候应该拆分文档，什么时候保持单一文档？

**A:** 决策框架：

**保持单一文档的情况：**
- 内容紧密相关，频繁交叉引用
- 需要连贯阅读理解
- 文档长度 < 1000 行
- 单一主题的完整说明

**拆分文档的情况：**
- 文档 > 1000 行且包含多个独立子主题
- 不同部分可独立阅读
- 更新频率差异大
- 面向不同受众

**示例：**
- ✅ 单一文档：《React Hooks 完整指南》（包含所有 Hooks）
- ✅ 拆分文档：《前端框架》→ React、Vue、Angular 独立目录

#### Q3: 如何处理中文内容和文件命名？

**A:** 推荐做法：

- **文件名**：使用英文 kebab-case
- **文件内容**：使用中文（本项目的主要语言）
- **标题**：使用中文
- **代码注释**：可以使用中文，但 API 和变量名用英文

**示例：**
```
文件名：react-hooks.md
内容标题：# React Hooks 详解
```

#### Q4: 图片文件应该放在哪里？

**A:** 两种组织方式：

**方式 1：按目录组织（推荐小型项目）**
```
docs/front-end/
├── frameworks/
│   ├── react/
│   │   ├── hooks.md
│   │   └── assets/
│   │       └── hooks-diagram.png
```

**方式 2：集中管理（推荐大型项目）**
```
docs/
├── assets/
│   └── images/
│       ├── front-end/
│       │   └── react-hooks-diagram.png
├── front-end/
│   └── frameworks/
│       └── react/
│           └── hooks.md
```

本项目采用**方式 1**，图片与文档就近存放。

#### Q5: 如何处理外部引用的资源（截图、PDF 等）？

**A:** 处理流程：

1. **重命名**：按照命名规范重命名文件
2. **存放**：放在对应主题的 `assets/` 目录
3. **引用**：使用相对路径引用
4. **文档化**：在 Markdown 中添加描述

**示例：**
```markdown
## 架构图

下图展示了 React 的组件渲染流程：

![React 渲染流程](assets/react-rendering-flow.png)

*图片来源：React 官方文档*
```

#### Q6: 如何确保文档的时效性？

**A:** 维护策略：

1. **版本标注**：在技术文档中标注相关版本
   ```markdown
   > 本文档基于 React 18.2 编写，最后更新：2024-10
   ```

2. **定期审查**：设置季度审查计划
3. **过时标记**：对过时内容添加警告
   ```markdown
   !!! warning "内容已过时"
       本节内容适用于 React 16.x，新版本请参考 [新文档](link)
   ```

4. **变更日志**：重要文档维护 changelog

#### Q7: 文档中的代码示例需要多详细？

**A:** 代码示例原则：

**基础概念** → 简洁示例（10-20 行）
```javascript
// 展示核心概念
const [count, setCount] = useState(0);
```

**详细教程** → 完整示例（50-100 行）
```javascript
// 包含错误处理、边界情况
function CompleteExample() {
    // 完整的组件实现
}
```

**参考文档** → 多种示例（基础 + 高级）
```javascript
// 基础用法
// 高级用法
// 边界情况
```

**原则：**
- 可运行 > 伪代码
- 包含必要注释
- 避免过度简化导致误导

### 最佳实践

#### 1. 文档编写流程

```
计划 → 草稿 → 充实内容 → 审查 → 发布 → 维护
  ↓       ↓        ↓         ↓       ↓       ↓
 确定    快速     添加代码   检查    本地    定期
 范围    框架     示例图表   清单    测试    更新
```

#### 2. 写作技巧

**从读者角度出发：**
- 先概述后细节
- 先为什么后怎么做
- 先常见后边缘

**保持一致性：**
- 术语使用一致
- 代码风格一致
- 格式模板一致

**提高可读性：**
- 使用短段落（3-5 句）
- 使用列表分解信息
- 使用标注突出重点
- 使用代码示例说明

#### 3. 内容组织技巧

**使用渐进式披露：**
```markdown
## 核心概念（必读）
基础内容...

## 高级主题（可选）
深入内容...

## 参考资料（查阅）
详细 API 文档...
```

**使用导航辅助：**
```markdown
## 目录
- [快速开始](#快速开始)
- [深入理解](#深入理解)
- [API 参考](#api-参考)

---

## 快速开始
...

## 深入理解
...
```

#### 4. 代码示例最佳实践

**完整性：**
```javascript
// ✅ 包含必要的 import
import React, { useState, useEffect } from 'react';

function Example() {
    // 完整的组件代码
}

export default Example;
```

**渐进式：**
```javascript
// 步骤 1：基础实现
const [count, setCount] = useState(0);

// 步骤 2：添加副作用
useEffect(() => {
    document.title = `Count: ${count}`;
}, [count]);

// 步骤 3：优化性能
const memoizedValue = useMemo(() => expensiveCompute(count), [count]);
```

**对比式：**
```javascript
// ❌ 不推荐：容易导致闭包问题
setCount(count + 1);

// ✅ 推荐：使用函数式更新
setCount(prevCount => prevCount + 1);
```

#### 5. 图表使用建议

**何时使用图表：**
- 文字难以清晰表达的架构
- 复杂的流程和交互
- 组件关系和依赖
- 数据流向和状态管理

**图表类型选择：**
- **流程图**：业务流程、算法步骤
- **架构图**：系统结构、模块划分
- **时序图**：组件交互、API 调用
- **状态图**：状态转换、生命周期

#### 6. 链接管理策略

**内部链接：**
```markdown
<!-- 清晰的链接文本 -->
详见 [React Hooks 完整指南](frameworks/react/hooks.md)

<!-- 避免模糊的"点击这里" -->
❌ 更多信息请[点击这里](link)
✅ 查看 [React 性能优化指南](link)
```

**外部链接：**
```markdown
<!-- 标注链接性质 -->
[React 官方文档](https://react.dev/)（官方）
[社区最佳实践](https://example.com)（社区）
```

**锚点链接：**
```markdown
<!-- 用于长文档导航 -->
[回到顶部](#文档编写规范)
[查看代码示例](#代码示例最佳实践)
```

---

## 附录

### 文档模板

#### 概念文档模板

```markdown
# [主题名称]

> [一句话概述该主题]

## 概述

[2-3 段介绍：背景、重要性、应用场景]

## 核心概念

### [概念 1]
[解释]

### [概念 2]
[解释]

## 工作原理

[详细说明]

## 示例

### 基础示例
\`\`\`language
// 代码
\`\`\`

### 高级示例
\`\`\`language
// 代码
\`\`\`

## 最佳实践

1. [实践 1]
2. [实践 2]

## 常见问题

### Q: [问题]？
A: [回答]

## 相关资源

- [内部链接](link)
- [外部资源](link)
```

#### 教程文档模板

```markdown
# [教程标题]

> [教程目标简述]

## 前置知识

- [要求 1]
- [要求 2]

## 学习目标

完成本教程后，你将能够：
1. [目标 1]
2. [目标 2]

## 步骤

### 步骤 1：[标题]
[说明]
\`\`\`language
// 代码
\`\`\`

### 步骤 2：[标题]
[说明]
\`\`\`language
// 代码
\`\`\`

## 完整代码

\`\`\`language
// 完整示例
\`\`\`

## 下一步

- [后续学习建议]
- [相关教程](link)
```

### Markdown 速查表

```markdown
# 标题 1
## 标题 2
### 标题 3

**粗体** *斜体* ***粗斜体***

[链接文本](URL)
![图片描述](图片路径)

`行内代码`

\`\`\`language
代码块
\`\`\`

- 无序列表
- 项目 2

1. 有序列表
2. 项目 2

> 引用

| 表格 | 列 |
|------|-----|
| 内容 | 内容 |

---

- [ ] 任务列表
- [x] 已完成
```

### 相关资源

**文档写作：**
- [Google Developer Documentation Style Guide](https://developers.google.com/style)
- [Microsoft Writing Style Guide](https://docs.microsoft.com/en-us/style-guide/welcome/)
- [Write the Docs](https://www.writethedocs.org/)

**Markdown 工具：**
- [Markdown Guide](https://www.markdownguide.org/)
- [MkDocs 官方文档](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

**版本控制：**
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git 文档工作流](https://www.atlassian.com/git/tutorials/comparing-workflows)

---

## 总结

本文档涵盖了知识库文档编写的完整规范：

1. **核心原则**：内容优先，避免过度拆分，保持可读性
2. **命名规范**：统一使用 kebab-case
3. **文档组织**：清晰的层级，合理的拆分策略
4. **内容标准**：规范的 Markdown 语法和代码示例
5. **质量保证**：定期检查和更新机制
6. **工具支持**：MkDocs 命令和辅助脚本

**记住：**
- 📖 文档是为读者服务的，优先考虑阅读体验
- 🔄 保持一致性比追求完美更重要
- 🚀 持续改进，定期维护
- 🤝 遵循规范，便于协作

---

**最后更新**：2024-10  
**维护者**：[您的名字]  
**反馈**：如有问题或建议，请提交 Issue
