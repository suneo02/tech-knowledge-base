# CSS 属性

## css3新特性

**参考答案**：

**通过百分比设置动画发生的时间**

动画是使元素从一种样式逐渐变化为另一种样式的效果。可以改变任意多的样式任意多的次数。可以用关键词 “from” 和 “to” 来设置动画变化发生的时间，其效果等同于 0% 和 100%。0% 是动画的开始，100% 是动画的完成。为了得到最佳的浏览器支持，应该始终定义 0% 和 100% 选择器。

```css
/* 当动画为 25% 及 50% 时改变背景色，然后当动画 100% 完成时再次改变 */
@keyframes myfirst {
  0% {
    background: red;
  }
  25% {
    background: yellow;
  }
  50% {
    background: blue;
  }
  100% {
    background: green;
  }
} /* 同时改变背景色和位置 */
@keyframes myfirst {
  0% {
    background: red;
    left: 0px;
    top: 0px;
  }
  25% {
    background: yellow;
    left: 200px;
    top: 0px;
  }
  50% {
    background: blue;
    left: 200px;
    top: 200px;
  }
  75% {
    background: green;
    left: 0px;
    top: 200px;
  }
  100% {
    background: red;
    left: 0px;
    top: 0px;
  }
}
```

**动画属性详解**

animation是除了animation-play-state属性所有动画属性的简写属性。

**语法：** animation : animation-name | animation-duration | animation-timing-function | animation-delay | animation-iteration-count | animation-direction

```css
/* 应用的动画为myfirst，一个动画周期为5秒，动画的速度曲线为linear，动画2秒后播放，播放次数为infinite，即无限循环，动画下一周期是否逆向播放取值alternate，即逆向播放 */
div {
  animation: myfirst 5s linear 2s infinite alternate; /* Firefox: */
  -moz-animation: myfirst 5s linear 2s infinite alternate; /* Safari 和 Chrome: */
  -webkit-animation: myfirst 5s linear 2s infinite alternate; /* Opera: */
  -o-animation: myfirst 5s linear 2s infinite alternate;
}
```

| 属性                      | 描述                                                     |
| ------------------------- | -------------------------------------------------------- |
| @keyframes                | 规定动画。                                               |
| animation                 | 所有动画属性的简写属性，除了 animation-play-state 属性。 |
| animation-name            | 规定 @keyframes 动画的名称。                             |
| animation-duration        | 规定动画完成一个周期所花费的秒或毫秒。默认是 0。         |
| animation-timing-function | 规定动画的速度曲线。默认是 “ease”。                      |
| animation-delay           | 规定动画何时开始。默认是 0。                             |
| animation-iteration-count | 规定动画被播放的次数。默认是 1。                         |
| animation-direction       | 规定动画是否在下一周期逆向地播放。默认是 “normal”。      |
| animation-play-state      | 规定动画是否正在运行或暂停。默认是 “running”。           |
| animation-fill-mode       | 规定对象动画时间之外的状态。                             |

1. CSS3 多列

   通过 CSS3够创建多个列来对文本进行布局，就像我们经常看到的报纸的布局一样。

   **CSS3 创建多列**

   column-count属性规定元素应该被分隔的列数。

```css
/* 将div中的文本分为3列 */
div {
  column-count: 3;
  -moz-column-count: 3; /* Firefox */
  -webkit-column-count: 3; /* Safari 和 Chrome */
}
```

**CSS3 规定列之间的间隔**

column-gap属性规定列之间的间隔。

```css
/* 设置列之间的间隔为 40 像素 */
div {
  column-gap: 40px;
  -moz-column-gap: 40px; /* Firefox */
  -webkit-column-gap: 40px; /* Safari 和 Chrome */
}
```

**CSS3 列规则**

column-rule属性设置列之间的宽度、样式和颜色规则。

**语法：** column-rule : column-rule-width | column-rule-style | column-rule-color

```css
div {
  column-rule: 3px outset #ff0000;
  -moz-column-rule: 3px outset #ff0000; /* Firefox */
  -webkit-column-rule: 3px outset #ff0000; /* Safari and Chrome */
}
```

| 属性              | 描述                                     |
| ----------------- | ---------------------------------------- |
| column-count      | 规定元素应该被分隔的列数。               |
| column-fill       | 规定如何填充列。                         |
| column-gap        | 规定列之间的间隔。                       |
| column-rule       | 设置所有 column-rule-\* 属性的简写属性。 |
| column-rule-width | 规定列之间规则的宽度。                   |
| column-rule-style | 规定列之间规则的样式。                   |
| column-rule-color | 规定列之间规则的颜色。                   |
| column-span       | 规定元素应该横跨的列数。                 |
| column-width      | 规定列的宽度。                           |
| columns           | 语法 : column-width column-count。       |

1. CSS3 用户界面

**CSS3 resize**

在 CSS3中resize属性设置是否可由用户调整元素尺寸。

```css
/* 设置div可以由用户调整大小 */
div {
  resize: both;
  overflow: auto;
}
```

**CSS3 box-sizing**

box-sizing属性允许您以确切的方式定义适应某个区域的具体内容。边框计算在width中

```css
/* 规定两个并排的带边框方框 */
div {
  box-sizing: border-box;
  -moz-box-sizing: border-box; /* Firefox */
  -webkit-box-sizing: border-box; /* Safari */
  width: 50%;
  float: left;
}
```

**CSS3 outline-offset**

outline-offset属性对轮廓进行偏移，并在超出边框边缘的位置绘制轮廓。

轮廓与边框有两点不同：

> 轮廓不占用空间；轮廓可能是非矩形；

```css
/* 规定边框边缘之外 15 像素处的轮廓 */
div {
  border: 2px solid black;
  outline: 2px solid red;
  outline-offset: 15px;
}
```

## css：inline-block 的 div 之间的空隙，原因及解决

**参考答案**：

display:inline-block布局的元素在chrome下会出现几像素的间隙，原因是因为我们在编辑器里写代码的时候，同级别的标签不写在同一 行以保持代码的整齐可读性，即inline-block布局的元素在编辑器里不在同一行，即存在换行符，因此这就是著名的inline-block“换行 符/空格间隙问题”。如果inline-block元素间有空格或是换行产生了间隙，那是正常的，应该的。如果没有空格与间隙才是不正常的（**IE6/7** block水平元素）。

**解决方法：**

1、把img标签的display属性改成block：

```css
img {
  dispaly: block;
}
```

2、把div中的字体大小设为0：

```css
div {
  font-size: 0;
}
```

3、如果是img，修改img的vertical-align属性：

```css
img {
  vertical-align: buttom;
}
img {
  vertical-align: middle;
}
img {
  vertical-align: top;
}
```

1. 移除标签间的空格

```html
<ul>
  <li>这是一个li</li>
  <li>这是另一个li</li>
  <li>这是另另一个li</li>
  <li>这是另另另一个li</li>
</ul>
// 方式二：在标签结束处消除换行符
<ul>
  <li>这是一个li</li>
  <li>这是另一个li</li>
  <li>这是另另一个li</li>
  <li>这是另另另一个li</li>
</ul>
// 方式三：HTML注释标签
<ul>
  <li>这是一个li</li>
  <!--    -->
  <li>这是另一个li</li>
  <!--    -->
  <li>这是另另一个li</li>
  <!--    -->
  <li>这是另另另一个li</li>
</ul>
```
