# 组件参考

## 主要组件

### CreditRPPreviewComp
信用报告预览组件，用于渲染企业信用报告。

**必填属性**:
- corpCode (string): 企业代码
- axiosInstance (AxiosInstance): Axios 实例
- packageInfo (UserPackageInfo): 用户套餐信息
- reportConfig (ReportPageJson): 报告配置
- apiTranslate (function): 数据翻译函数

**可选属性**:
- isDev (boolean): 开发模式标识
- onLoadingChange (function): 加载状态回调
- onError (function): 错误处理回调

### DDRPPreviewComp
尽调报告预览组件，属性接口与 CreditRPPreviewComp 相同。

## 布局组件

### RPPreviewComp
主预览组件，负责整体布局和状态管理。

**属性**:
- ctxValue (RPPreviewCtxType): 主Context值

### PreviewReportLeft
左侧导航组件，提供树形结构导航。

**属性**:
- onNodeSelected (function): 节点选择回调
- className (string): 自定义CSS类名
- style (CSSProperties): 自定义样式

**功能**: 树形导航、搜索过滤、展开控制、可见性管理

### PreviewReportContent
右侧内容组件，负责报告内容的渲染和展示。

**属性**:
- nodeKey (string): 当前激活的节点键
- onNodeSelected (function): 节点选择回调
- className (string): 自定义CSS类名
- style (CSSProperties): 自定义样式

**功能**: 报告封面、免责声明、动态表格渲染、附录展示

## 表格组件

### ConfigTable
配置化表格组件，根据配置动态选择表格类型。

**属性**:
- config (ReportDetailTableJson): 表格配置
- onDataLoadError (function): 数据加载错误回调
- className (string): 自定义CSS类名

**功能**: 配置解析验证、动态表格类型选择、数据获取缓存

### HorizontalTable
水平表格组件，适用于展示横向数据。

**属性**:
- columns (HorizontalTableColProps[]): 列配置
- dataSource (any[]): 数据源
- loading (boolean): 加载状态
- pagination (PaginationProps): 分页配置
- scroll (object): 滚动配置

### VerticalTable
垂直表格组件，适用于展示键值对数据。

**属性**:
- dataSource (Record<string, any>): 数据源
- columns (VerticalTableColProps[]): 列配置
- loading (boolean): 加载状态

### CrossTable
交叉表格组件，适用于复杂的行列交叉数据。

**属性**:
- config (CrossTableConfig): 交叉表格配置
- dataSource (any[]): 数据源
- loading (boolean): 加载状态

## 辅助组件

### PDFCover
PDF封面组件，用于显示报告封面信息。

### RPComment
免责声明组件，用于显示报告的免责声明信息。

### RPAppendix
附录组件，用于显示报告的附录信息。

### ZoomBar
缩放控制组件，用于控制页面缩放比例。

**属性**:
- percent (number): 当前缩放比例
- onChange (function): 缩放变化回调
- min (number): 最小缩放比例
- max (number): 最大缩放比例
- step (number): 缩放步长

### SectionHeading
章节标题组件，用于渲染报告章节标题。

**属性**:
- level (number): 标题层级
- title (string): 标题内容
- id (string): 标题ID，用于导航

## Hooks

### useRPPreviewCtx
获取主Context状态的Hook。

### usePreviewReportContentCtx
获取内容Context状态的Hook。

### useConfigTableData
表格数据获取Hook。

### useTreeHiddenStatus
树节点可见性管理Hook。

## Context

### RPPreviewCtxProvider
主Context提供者组件。

**属性**:
- value (RPPreviewCtxType): Context值
- children (ReactNode): 子组件

### PreviewReportContentCtxProvider
内容Context提供者组件。

**属性**:
- value (PreviewReportContentCtxType): Context值
- children (ReactNode): 子组件

## 样式定制

### CSS变量
支持的主题变量：
- --primary-color: 主色调
- --success-color: 成功色
- --warning-color: 警告色
- --error-color: 错误色
- --text-color: 文本色
- --border-color: 边框色
- --sidebar-width: 侧边栏宽度
- --header-height: 头部高度

### CSS类名
- .report-preview-wrapper: 整体容器
- .preview-report-left: 左侧导航区域
- .preview-report-content: 右侧内容区域
- .config-table: 配置化表格
- .section-heading: 章节标题
- .zoom-bar: 缩放控制条

## 事件类型

### 节点选择事件
包含节点ID和节点信息的对象。

### 缩放变化事件
包含缩放比例和缩放值的对象。

### 数据加载事件
包含加载状态、节点ID、数据源和错误信息。

## 错误类型

### API错误
包含错误代码、消息、配置和响应信息。

### 配置错误
包含配置键、配置值和期望类型。

### 渲染错误
包含组件名称、节点ID和属性信息。

## 扩展接口

### 自定义渲染器
包含名称和渲染函数的对象。

### 插件接口
包含名称、安装和卸载函数的对象。