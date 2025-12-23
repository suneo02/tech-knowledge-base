# 静态资源管理

提供应用所需的图片、图标、动画等静态资源文件。

## 目录结构

```
assets/
├── alice/                          # AI 助手 Alice 形象资源
│   ├── alice.png                   # Alice 主形象
│   ├── alice-newYear.png           # 新年形象
│   ├── default.png                 # 默认头像
│   └── icon-alice.png              # Alice 图标
├── gif/                            # 动图资源
│   └── AliceChatHi.gif             # Alice 打招呼动画
├── header/                         # 头部标识资源
│   ├── svip.svg                    # 超级VIP标识
│   ├── vip.svg                     # VIP标识
│   └── wind.svg                    # Wind 品牌标识
├── icon/                           # 图标资源库
│   ├── report-ai/                  # AI 报告相关图标
│   │   ├── GenTable.svg            # 生成表格图标
│   │   ├── Translate.svg           # 翻译图标
│   │   └── PolishContent.svg       # 内容润色图标
│   ├── deepthink.svg               # 深度思考图标
│   ├── like.svg                    # 点赞图标
│   └── dislike.svg                 # 踩图标
├── img/                            # 图片资源
│   ├── brand120.png                # 品牌Logo
│   ├── default_company.png         # 默认公司图片
│   └── esg/                        # ESG 评级图片
│       ├── rating_AAA.png          # AAA评级
│       ├── rating_AA.png           # AA评级
│       └── rating_A.png            # A评级
└── index.ts                        # 资源统一导出
```

## 关键文件说明

- **alice/**: AI 助手 Alice 的各种形象和表情，用于聊天界面的个性化展示
- **icon/report-ai/**: AI 报告编辑功能专用图标集，支持翻译、润色、生成表格等操作
- **img/esg/**: ESG 评级等级图片，用于企业 ESG 评级展示
- **index.ts**: 静态资源的统一导出入口，提供便捷的资源引用方式

## 依赖关系

```
assets/
├── 被依赖关系
│   ├── biz/ai-chat: 使用 Alice 形象和对话图标
│   ├── biz/corp: 使用企业相关图标和 ESG 评级图片
│   └── common: 使用通用图标和标识资源
└── 上游依赖
    └── 无外部依赖，纯静态资源
```

## 使用示例

```typescript
import { AliceIcon, ESGRatingIcon, ReportAIIcon } from '@/assets'

// 使用 Alice 形象
<AliceIcon src={alice.default} alt="AI Assistant" />

// 使用 ESG 评级图标
<ESGRatingIcon rating="AAA" />

// 使用 AI 报告图标
<ReportAIIcon type="translate" />
```