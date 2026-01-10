# 版本价格组件

提供产品版本展示、价格表格和政策文档展示功能。

## 目录结构
```
comp/
├── MenuLeft.less               # 左侧菜单样式
├── MenuLeft.tsx                # 左侧菜单组件
├── PriceTableNormalRow.tsx     # 价格表格普通行
├── ProductCard.less            # 产品卡片样式
├── ProductCard.tsx             # 产品卡片组件
├── ProductDetail.less          # 产品详情样式
├── ProductDetail.tsx           # 产品详情组件
├── ProductIntro.less           # 产品介绍样式
├── ProductIntro.tsx            # 产品介绍组件
├── ProductList.less            # 产品列表样式
├── ProductList.tsx             # 产品列表组件
├── ProductVersion.less         # 产品版本样式
├── ProductVersion.tsx          # 产品版本组件
├── PolicyDocument.less         # 政策文档样式
└── PolicyDocument.tsx          # 政策文档组件
```

## 关键文件说明
- `MenuLeft.tsx` - 左侧导航菜单，提供版本价格页面导航
- `ProductCard.tsx` - 产品卡片组件，展示产品基本信息
- `PriceTableNormalRow.tsx` - 价格表格行组件，展示价格详情
- `ProductDetail.tsx` - 产品详情组件，展示完整产品信息
- `PolicyDocument.tsx` - 政策文档组件，展示相关政策信息

## 依赖示意
- 依赖：`antd` - UI组件库、`@ant-design/icons` - 图标库
- 上游：产品管理系统、价格策略模块
- 下游：版本价格页面、产品详情页面

## 相关文档
- [版本价格设计文档](../../../docs/version-price-design.md)
- [产品展示组件指南](../../../docs/product-display-guide.md)