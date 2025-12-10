# ChatReference 组件设计文档

## 概述
ChatReference 组件用于展示聊天相关的参考资料列表，包括新闻、公告、研报等不同类型的资料。该组件支持点击跳转到详情页面，并根据不同的资料类型显示不同的标签样式。

## 详细功能说明
ChatReference 组件接收一个参考资料数组，并将其渲染为一个列表。每个列表项包含标题、发布日期、来源网站和类型标签。组件根据资料类型显示不同颜色的标签，并支持点击列表项跳转到相应的详情页面。

组件的主要功能包括：
1. 渲染参考资料列表，包括标题、发布日期、来源和类型标签
2. 根据资料类型显示不同颜色的标签
3. 支持点击列表项跳转到详情页面
4. 支持表格视图模式，可以调整样式
5. 支持国际化，可以根据语言设置显示不同的文本

组件的实现逻辑：
1. 接收参考资料数组和其他配置参数
2. 如果数组为空，则不渲染任何内容
3. 遍历数组，为每个资料项创建列表项
4. 处理日期格式化和类型标签文本
5. 处理点击事件，根据资料类型决定跳转行为

## 参数说明

### ChatReferenceProps
| 参数名 | 类型 | 描述 |
|-------|------|------|
| suggest | ReferenceItem[] | 参考资料数组，默认为空数组 |
| transLang | string | 翻译语言，用于国际化，可选 |
| tableView | boolean | 是否使用表格视图模式，可选 |
| ...rest | any | 其他传递给根元素的属性 |

### ReferenceItem
| 参数名 | 类型 | 描述 |
|-------|------|------|
| windcode | string | 资料的唯一标识符 |
| text | string | 资料的标题文本 |
| publishdate | string | 发布日期，可选 |
| type | string | 资料类型，如 'N'(资讯)、'A'(公告)、'R'(研报) 等 |
| sitename | string | 来源网站名称，可选 |
| docIdEncry | string | 文档加密ID，用于跳转，可选 |

## 返回值说明
组件返回一个 React 元素，渲染参考资料列表。如果 suggest 数组为空，则返回 null。

## 使用示例

```tsx
import React from 'react';
import { ChatReference } from '../components/ChatRoles/suggestion/Reference';

const ExampleComponent = () => {
  const referenceItems = [
    {
      windcode: 'news-001',
      text: '市场行情分析：2023年第二季度展望',
      publishdate: '2023-04-01',
      type: 'N',
      sitename: '财经网',
      docIdEncry: 'abc123',
    },
    {
      windcode: 'report-001',
      text: '行业研究报告：新能源汽车发展趋势',
      publishdate: '2023-03-15',
      type: 'R',
      sitename: '研究院',
      docIdEncry: 'def456',
    },
    {
      windcode: 'announcement-001',
      text: '公司公告：2022年年度报告',
      publishdate: '2023-03-30',
      type: 'A',
      sitename: '交易所',
      docIdEncry: 'ghi789',
    },
  ];

  return (
    <div className="example-container">
      <h2>参考资料</h2>
      <ChatReference 
        suggest={referenceItems} 
        transLang="CMN"
        tableView={false}
      />
    </div>
  );
};

export default ExampleComponent;
``` 