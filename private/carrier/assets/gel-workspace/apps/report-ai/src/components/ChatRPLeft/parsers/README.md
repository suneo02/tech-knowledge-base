# parsers

报告详情聊天消息解析器，封装消息解析工厂函数

## 目录结构

```
parsers/
├── detailMessageParser.tsx    # 报告详情聊天解析器工厂
└── index.ts                   # 统一导出
```

## 核心文件职责

### detailMessageParser.tsx

创建报告详情聊天解析器的工厂函数 `createRPDetailMessageParser`，解析 AI 返回的消息内容

## 模块依赖

```
ChatRPLeft
  └─> parsers
      └─> detailMessageParser (消息解析)
```
