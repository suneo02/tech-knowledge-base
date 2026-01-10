# Customer视图模块

客户管理相关视图组件，提供账户、列表、订单和用户笔记等功能。

## 目录结构

```
Customer/
├── MyAccount/           # 我的账户
├── MyList/             # 我的列表
│   └── downReport/     # 报告下载
├── MyOrder/            # 我的订单
├── UserNote/           # 用户笔记
├── handle/             # 处理函数
├── index.tsx           # 入口文件
├── index.less          # 样式文件
├── layer.css           # 层级样式
├── myMenu.jsx          # 菜单组件
└── myMenu.less         # 菜单样式
```

## 关键文件说明

- `index.tsx` - Customer视图的主入口组件
- `MyAccount/` - 账户管理相关组件
- `MyList/` - 列表管理功能，包含报告下载子模块
- `MyOrder/` - 订单管理功能，包含企业和个人订单
- `UserNote/` - 用户笔记功能，支持中英文
- `handle/` - 通用处理函数和菜单配置

## 依赖示意

```
Customer视图
├── 依赖: gel-ui组件库
├── 依赖: 公司通用组件
└── 依赖: 路由配置
```

## 相关文档

- [账户管理文档](./MyAccount/)
- [订单管理文档](./MyOrder/)
- [用户笔记文档](./UserNote/)