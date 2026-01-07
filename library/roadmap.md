# 渐进式改进计划

## 已完成
- ✅ 前端领域完成结构规范化（foundations/frameworks/performance/scenarios/tooling）
- ✅ 建立统一的文档编写规范（见 `meta/writing-guidelines.md`）
- ✅ 统一命名约定（kebab-case）

## 进行中
- 🔄 完善各领域的 README.md 入口与导航
- 🔄 图片资源就近化（迁移到各域 assets/）
- 🔄 外链资源整理到 resources/

## 计划中
1. **补全入口导航**
   - 在 `network/`、`database-systems/`、`program-language/` 完善 README.md
   - 确保每个子域都有清晰的导航

2. **资源归位**
   - 将散落的图片迁至各自领域的 `assets/` 目录
   - 批量更新图片引用路径
   - 清理顶层 `assets/` 目录（仅保留通用资源）

3. **清理历史遗留**
   - 清理 `front-end/web-*` 旧目录（确认无引用后删除）
   - 将 `program-resource.md` 合并到 `resources/README.md`

4. **质量保证**
   - 增加链接检查脚本（markdown-link-check）
   - 增加图片引用检查
   - 统一 Lint/格式化工具
