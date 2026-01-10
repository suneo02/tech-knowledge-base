# 特色企业视图模块

特色企业展示与筛选功能，提供企业特色信息的可视化展示和搜索过滤能力。

## 目录结构

```
Fetured/
├── comp/                          # 组件目录
│   ├── CascaderSelect/            # 级联选择器
│   ├── QualificationStatusSelect.tsx # 资质状态选择
│   └── SpecialStatisticsSection.tsx # 特殊统计区块
├── config/                        # 配置文件
│   ├── detail.ts                  # 详情配置
│   ├── index.ts                   # 配置入口
│   └── specialStatistics.ts      # 特殊统计配置
├── featuredList/                  # 特色列表
│   ├── bury.ts                    # 埋点配置
│   ├── config.ts                  # 列表配置
│   └── index.ts                   # 列表入口
├── handle/                        # 处理函数
│   └── date.ts                    # 日期处理
├── nameCodeMap/                   # 名称代码映射
│   ├── codeNameMap.ts             # 代码名称映射
│   ├── oldCodeNameMap.ts          # 旧代码名称映射
│   └── oldNameCodeMap.ts          # 旧名称代码映射
├── utils/                         # 工具函数
│   ├── common.ts                  # 通用工具
│   ├── index.ts                   # 工具入口
│   └── specialStatisticsUtils.ts  # 特殊统计工具
├── FeturedCard.jsx                # 特色企业卡片
├── FeturedCard.less               # 卡片样式
├── FeturedMap.jsx                 # 特色企业地图
├── SearchFetured.jsx              # 特色企业搜索
├── feturedTree.jsx                # 特色企业树
├── feturedcompany.less            # 企业样式
├── feturedcompany.tsx             # 企业组件
├── feturedlist.jsx                # 特色企业列表
├── feturedlist.less               # 列表样式
├── handle.ts                      # 主处理函数
└── util.js                        # 通用工具
```

## 关键文件说明

- `feturedcompany.tsx` - 特色企业主组件
- `FeturedCard.jsx` - 特色企业展示卡片
- `FeturedMap.jsx` - 特色企业地图展示
- `SearchFetured.jsx` - 特色企业搜索功能
- `feturedlist.jsx` - 特色企业列表组件
- `config/` - 各类配置文件，包含详情和特殊统计配置
- `featuredList/` - 特色列表相关功能
- `comp/` - 可复用组件集合
- `utils/` - 通用工具函数集合

## 依赖示意

```
特色企业视图
├── 依赖: gel-ui组件库
├── 依赖: 地图组件库
├── 依赖: 企业数据API
└── 依赖: 路由配置
```

## 相关文档

- [特色企业配置文档](./config/)
- [特色企业组件文档](./comp/)
- [特色企业工具文档](./utils/)