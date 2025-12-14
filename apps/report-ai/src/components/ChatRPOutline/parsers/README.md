# parsers

大纲聊天消息解析器，封装大纲消息解析和显示逻辑

## 目录结构

```
parsers/
├── messageParser.tsx          # RPOutline 聊天消息解析器工厂
├── outline.ts                 # 大纲消息辅助工厂
└── index.ts                   # 统一导出
```

## 核心文件职责

### messageParser.tsx

RPOutline 聊天消息解析器工厂，负责拼装头部、内容、建议以及大纲编辑器消息

### outline.ts

大纲消息相关的辅助工厂，生成大纲编辑器和预览消息实体

## 大纲消息显示逻辑

根据消息位置自动选择合适的显示模式：

- 最后一条 agent 消息：编辑模式（允许修改）
- 历史 agent 消息：预览模式（只读）

## 模块依赖

```
ChatRPOutline
  └─> parsers
      ├─> messageParser (消息解析)
      └─> outline (大纲消息)
```
