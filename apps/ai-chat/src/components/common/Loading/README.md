# Loading 加载组件

一个基于 Ant Design Spin 组件封装的通用加载状态展示组件，提供居中显示和自定义配置选项。

## 特性

- 基于 Ant Design Spin 组件封装
- 自动居中显示
- 支持自定义大小和提示文案
- 支持自定义样式和类名
- 半透明背景遮罩
- 支持所有 Ant Design Spin 组件的属性

## 使用方法

### 基础用法

```tsx
import Loading from '@/components/common/Loading'

// 基础用法
;<Loading />
```

### 自定义大小

```tsx
import Loading from '@/components/common/Loading'

// 使用预设大小
<Loading size="large" />
<Loading size="default" />
<Loading size="small" />
```

### 自定义提示文案

```tsx
import Loading from '@/components/common/Loading'

// 使用 tip 属性
<Loading tip="加载中..." />

// 使用 title 属性（与 tip 效果相同）
<Loading title="加载中..." />
```

### 自定义样式

```tsx
import Loading from '@/components/common/Loading'

// 自定义样式
;<Loading className="custom-loading" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
```

## API

### LoadingProps

| 属性  | 说明                   | 类型     | 默认值 |
| ----- | ---------------------- | -------- | ------ |
| title | 加载提示文案（同 tip） | `string` | -      |

更多 API 请参考 [Ant Design Spin](https://ant-design.antgroup.com/components/spin-cn#api)，本组件支持 Spin 组件的所有属性。

## 注意事项

1. 组件会自动居中显示，并占据父容器的全部宽高
2. 默认带有半透明白色背景（rgba(255, 255, 255, 0.8)）
3. 最小高度为 200px，确保在小容器中也有足够的显示空间
4. title 和 tip 属性效果相同，优先使用 title
5. 继承了 Ant Design Spin 组件的所有特性和行为

## 最佳实践

1. 在异步加载数据时使用

   ```tsx
   const [loading, setLoading] = useState(true)

   useEffect(() => {
     fetchData().finally(() => setLoading(false))
   }, [])

   if (loading) return <Loading tip="数据加载中..." />
   ```

2. 在需要等待的操作中使用

   ```tsx
   <Loading tip="处理中..." delay={300} />
   ```

3. 配合错误处理使用

   ```tsx
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<Error | null>(null)

   if (loading) return <Loading tip="加载中..." />
   if (error) return <div>错误：{error.message}</div>
   ```

4. 在表单提交时使用

   ```tsx
   const [submitting, setSubmitting] = useState(false)

   const handleSubmit = async () => {
     setSubmitting(true)
     try {
       await submitForm()
     } finally {
       setSubmitting(false)
     }
   }

   return <Loading spinning={submitting} tip="提交中..." />
   ```
