# CSS 属性


## 清除浮动

**参考答案**：

除浮动其实叫做闭合浮动更合适，因为是把浮动的元素圈起来，让父元素闭合出口和入口不让他们出来影响其他的元素。 在CSS中，clear属性用于清除浮动，其基本语法格式如下：

```css
选择器 {    clear: 属性值;}/*属性值为left,清除左侧浮动的影响  属性值为right,清除右侧浮动的影响  属性值为both,同时清除左右两侧浮动的影响*/
```

1. 额外标签法
    
    1.1 末尾标签法 通过在浮动元素的末尾添加一个空的标签。这是W3C推荐的做法，虽然比较简单，但是添加了无意义的标 签，结构化比较差，所以不推荐使用。下面三种写法都适用：
    
    ```
    1. <div style="clear:both"></div>
    2. .clear { clear:both }
        <div class="clear"></div>
    3..clear{ clear:both }
        <br class="clear" />    <!--也可以使用br等别的块级元素来清除浮动-->
    ```
    
    2.2 内部标签法，把div放进父盒子里，盒子会撑开，一般也不会用。
    
2. overflow
    
    给父级元素添加overflow样式方法。 代码比较简洁，可以通过触发BFC方式，但是因为本身overflow的本质是溢出隐藏的效果，所以有的时候也会有一些问题存在，比如内容增多的时候不会自动换行导致内容被隐藏掉，无法显示出要溢出的元素。
    
    ```css
    .father {        overflow: auto;      /* 加上这句话，就可以清除浮动   overflow = hidden|auto|scroll 都可以实现*/   }
    ```
    
3. 伪元素法（最常用）
    
    3.1 使用after伪元素清除浮动 after是在父元素中加一个盒子，这个元素是通过css添加上去的，符合闭合浮动思想，结构语义化正确。 父元素中加一个类名为clearfix 。但是这个方法IE6，7不识别，要进行兼容，使用zoom:1触发 hasLayout来清除浮动 代表网站：百度、淘宝、网易等
    
    ```css
    .clearfix:after{    content:".";  /*尽量不要为空，一般写一个点*/    height:0;     /*盒子高度为0，看不见*/    display:block;    /*插入伪元素是行内元素，要转化为块级元素*/    visibility:hidden;      /*content有内容，将元素隐藏*/    clear:both;}.clearfix {    *zoom: 1;   /*  *只有IE6,7识别 */}
    ```
    
    3.2 after伪元素空余字符法 父元素中加一个类名为clearfix，也需要兼容IE6、7
    
    ```css
    .clearfix::after{    content:"\200B";   /* content:'\0200'; 也可以 */    display:block;    height:0;    clear:both;}.clearfix {    *zoom: 1;}
    ```
    
    3.3 使用before和after双伪元素清除浮动（推荐） 完全符合闭合浮动思想的方法。 父元素中加一个类名为clearfix,需要兼容IE6、7 代表网站：小米、腾讯
    
    ```css
     .clearfix:before, .clearfix:after {        content: "";        display: table;    }    .clearfix:after {        clear: both;    }    .clearfix {        *zoom: 1;    }
    ```
    

## padding , margin 百分比单位依据

**参考答案**：

在CSS 盒模型中，依据CSS2.2文档，margin与padding的百分比指定值时，一律参考**包含盒的宽度**。 示例：

```css
        .father {    height: 100px;    width: 200px;    border: solid;}.son {    margin: 20%;    padding: 20%;    width: 50%;    height: 50%;}
```

如下图，包括padding-top/bottom,margin-top/bottom在内，所有padding和margin均是参考的包含块的宽度，故它们的值为200px * 20% = 40px。

## 父子边距重合

**参考答案**：

**效果：**

边界重叠是指两个或多个盒子(可能相邻也可能嵌套)的相邻边界(其间没有任何非空内容、补白、边框)重合在一起而形成一个单一边界。

父子元素的边界重叠

```
<style>
  .parent {
    background: #e7a1c5;
  }
  .parent .child {
    background: #c8cdf5;
    height: 100px;
    margin-top: 10px;
  }
</style>
<section class="parent">
  <article class="child"></article>
</section>
```

以为期待的效果：

![](https://www.notion.socss.assets/FBF418EDFFBC69B2240B0956DBBD0C6E.png)

img

而实际上效果如下:

![](https://www.notion.socss.assets/AC8FA610898DD0D5636F0B845C1F203E.png)

img

在这里父元素的高度不是 110px，而是 100px，在这里发生了高度坍塌。

**产生原因：**

是如果块元素的margin-top与它的第一个子元素的margin-top之间没有border、padding、inlinecontent、clearance来分隔，或者块元素的 margin-bottom 与它的最后一个子元素的 margin-bottom 之间没有border、padding、inlinecontent、height、min-height、max-height分隔，那么外边距会塌陷。子元素多余的外边距会被父元素的外边距截断。

**解决办法**：

父子元素的边界重叠得解决方案： 在父元素上加上 overflow:hidden;使其成为 BFC。

## css字体大小设置（三种）.em rem px

**参考答案**：

**px（绝对长度单位）**

相信对于前端来说px这个单位是大家并不陌生，px这个单位，兼容性可以说是相当可以，大家对px的了解肯 定是没有很大的问题的。

**em（相对长度单位）**

**使用：**

1. 浏览器的默认字体都是16px，那么1em=16px，以此类推计算12px=0.75em，10px=0.625em,2em=32px；
2. 这样使用很复杂，很难很好的与px进行对应,也导致书写、使用、视觉的复杂(0.75em、0.625em全是小数点)；
3. 为了简化font-size的换算，我们在body中写入一下代码
    
    ```css
    body {font-size: 62.5%;  } /*  公式16px*62.5%=10px  */
    ```
    
    这样页面中1em=10px,1.2em=12px,1.4em=14px,1.6em=16px，使得视觉、使用、书写都得到了极大的帮助。
    
    例子如下：
    
    ```html
    <div class="font1" style='font-size:1.6em'>我是1.6em</div>
    ```
    
    缺点：
    
    1. em的值并不是固定的；
    2. em会继承父级元素的字体大小（参考物是父元素的font-size；）；
    3. em中所有的字体都是相对于父元素的大小决定的；所以如果一个设置了font-size:1.2em的元素在另一个设置了font-size: 1.2em的元素里，而这个元素又在另一个设置了font-size:1.2em的元素里，那么最后计算的结果是1.2X1.2X1.2=1.728em
        
        ```html
        <div class="big">    我是大字体   <div class="small">我是小字体</div></div>
        ```
        
        样式为
        
        ```html
        <style>     body {font-size: 62.5%; } /*  公式:16px*62.5%=10px  */    .big{font-size: 1.2em}    .small{font-size: 1.2em}</style>
        ```
        
        但运行结果small的字体大小为：1.2em*1.2em=1.44em
        
    
    **rem（相对长度单位）**
    
    **使用：**
    
    1. 浏览器的默认字体都是16px，那么1rem=16px，以此类推计算12px=0.75rem，10px=0.625rem，2rem=32px；
    2. 这样使用很复杂，很难很好的与px进行对应,也导致书写、使用、视觉的复杂(0.75rem、0.625em全是小数点) ；
    3. 为了简化font-size的换算，我们在根元素html中加入font-size: 62.5%;
        
        ```css
        html {font-size: 62.5%;  } /*  公式16px*62.5%=10px  */
        ```
        
        这样页面中1rem=10px,1.2rem=12px,1.4rem=14px,1.6rem=16px;使得视觉、使用、书写都得到了极大的帮助；
        
        ```html
        <div class="font1" style='font-size:1.6rem'>我是1.6rem=16px</div>
        ```
        
    
    特点：
    
    1. rem单位可谓集相对大小和绝对大小的优点于一身
    2. 和em不同的是rem总是相对于根元素(如:root{})，而不像em一样使用级联的方式来计算尺寸。这种相对单位使用起来更简单。
    3. rem支持IE9及以上，意思是相对于根元素html（网页），不会像em那样，依赖于父元素的字体大小，而造成混乱。使用起来安全了很多。
        
        ```html
        <div class="big">    我是14px=1.4rem<div class="small">我是12px=1.2rem</div></div>
        ```
        
        ```html
        <style>    html {font-size: 10px;  } /*  公式16px*62.5%=10px  */    .big{font-size: 1.4rem}    .small{font-size: 1.2rem}</style>
        ```
        
    
    **注意：**
    
- 值得注意的浏览器支持问题： IE8，Safari 4或 iOS 3.2中不支持rem单位。
- 如果你的用户群都使用最新版的浏览器，那推荐使用rem，如果要考虑兼容性，那就使用px,或者两者同时使用。

## css3新特性

**参考答案**：

1. **CSS3 边框**
    
    在 css3 中新增的边框属性如下：
    
    **创建圆角**
    
    **语法：** border-radius : length length;
    
    length： 由浮点数字和单位标识符组成的长度值（如：20px）。不可为负值，如果为负值则与0展示效果一样。第一个值设置其水平半径，第二个值设置其垂直半径，如果第二个值省略则默认第二个值等于第一个值。
    
    ```css
    div{  border: 1px solid;  /* 设置每个圆角水平半径和垂直半径都为30px */  border-radius: 30px;}
    ```
    
    border-radius是4个角的缩写方法。四个角的表示顺序与border类似按照border-top-left-radius、border-top-right-radius、border-bottom-right-radius、border-bottom-left-radius的顺序来设置：
    
    ```css
    div{  border: 1px solid;  /* 如果 / 前后的值都存在，那么 / 前面的值设置其水平半径，/ 后面值设置其垂直半径，如果没有 / ，则水平和垂直半径相等 */  border-radius: 10px 15px 20px 30px / 20px 30px 10px 15px;  /* 上面写法等价于下面的写法，第一个值是水平半径，第二个值是垂直半径 */  border-top-left-radius: 10px 20px;  border-top-right-radius: 15px 30px;  border-bottom-right-radius: 20px 10px;  border-bottom-left-radius: 30px 15px;}
    ```
    
    border-radius指定不同数量的值遵循对角相等的原则，即指定了值的取指定值，没有指定值的与对角值相等，对角相等模型
    
    **边框阴影**
    
    通过属性box-shadow向边框添加阴影。
    
    **语法：** {box-shadow : [inset] x-offset y-offset blur-radius extension-radius spread-radiuscolor}
    
    说明：对象选择器 {box-shadow:[投影方式] X轴偏移量 Y轴偏移量 模糊半径 阴影扩展半径 阴影颜色}
    
    ```css
    div{  /* 内阴影，向右偏移10px，向下偏移10px，模糊半径5px，阴影缩小10px */  box-shadow: inset 10px 10px 5px -10px #888888;}
    ```
    
    **边框图片**
    
    **语法：**
    
    border-image : border-image-source || border-image-slice [ / border-image-width] || border-image-repeat
    
    border-image ： none | image [ number | percentage]{1,4} [ / border-width>{1,4} ] ? [ stretch | repeat | round ]{0,2}
    
    ```css
    div{  border-image:url(border.png) 30 30 round;  border-image: url(border.png) 20/10px repeat;}
    ```
    
2. **CSS3 背景**

**background-size属性**

在 CSS3 之前，背景图片的尺寸是由图片的实际尺寸决定的。在 CSS3 中，可以设置背景图片的尺寸，这就允许我们在不同的环境中重复使用背景图片。可以像素或百分比规定尺寸。如果以百分比规定尺寸，那么尺寸相对于父元素的宽度和高度。

```css
div {    background: url(bg_flower.gif);    /* 通过像素规定尺寸 */    background-size: 63px 100px;    /* 通过百分比规定尺寸 */    background-size: 100% 50%;    background-repeat: no-repeat;}
```

**background-origin属性**

规定背景图片的定位区域，背景图片可以放置于content-box、padding-box或border-box区域，

```css
div {    background: url(bg_flower.gif);    background-repeat: no-repeat;    background-size: 100% 100%;    /* 规定背景图片的定位区域 */    background-origin: content-box;}
```

**background-clip属性**

与background-origin属性相似，规定背景颜色的绘制区域，区域划分与background-origin属性相同。

```css
div {    background-color: yellow;    background-clip: content-box;}
```

**CSS3 多重背景图片**

CSS3 允许为元素设置多个背景图像

```css
body {    background-image: url(bg_flower.gif), url(bg_flower_2.gif);}
```

1. CSS3 文本效果

**text-shadow属性**

给为本添加阴影，能够设置水平阴影、垂直阴影、模糊距离，以及阴影的颜色。

```css
h1 {    text-shadow: 5px 5px 5px #FF0000;}
```

**text-wrap 属性**

设置区域内的自动换行。

**语法：**text-wrap: normal | none | unrestricted | suppress | break-word;

```css
/* 允许对长单词进行拆分，并换行到下一行 */p {    word-wrap: break-word;}
```

| 值 | 描述 |
| --- | --- |
| normal | 只在允许的换行点进行换行。 |
| none | 不换行。元素无法容纳的文本会溢出。 |
| break-word | 在任意两个字符间换行。 |
| suppress | 压缩元素中的换行。浏览器只在行中没有其他有效换行点时进行换行。 |
1. CSS3 字体

**字体定义**

在 CSS3 之前，web 设计师必须使用已在用户计算机上安装好的字体。但是通过 CSS3，web 设计师可以使用他 们喜欢的任意字体。当找到或购买到希望使用的字体时，可将该字体文件存放到 web 服务器上，它会在需要时 被自动下载到用户的计算机上。字体需要在 CSS3 @font-face 规则中定义。

```css
/* 定义字体 */@font-face {    font-family: myFont;    src: url('Sansation_Light.ttf'),    url('Sansation_Light.eot');     /* IE9+ */}div {    font-family: myFont;}
```

**使用粗体字体**

“Sansation_Light.ttf”文件 是定义的正常字体，“Sansation_Bold.ttf” 是另一个字体文件，它包含了 Sansation 字体的粗体字符。只要 font-family 为 “myFirstFont” 的文本需要显示为粗体，浏览器就会使用该字体。

（其实没弄清楚这样处理的原因，经测试直接在html中通过 b 标签也可以实现加粗的效果）

```css
/* 定义正常字体 */@font-face {    font-family: myFirstFont;    src: url('/example/css3/Sansation_Light.ttf'),    url('/example/css3/Sansation_Light.eot'); /* IE9+ */}/* 定义粗体时使用的字体 */@font-face {    font-family: myFirstFont;    src: url('/example/css3/Sansation_Bold.ttf'),    url('/example/css3/Sansation_Bold.eot'); /* IE9+ */    /* 标识属性 */    font-weight: bold;}div {    font-family: myFirstFont;}
```

1. CSS3 2D 转换

通过 CSS3 转换，我们能够对元素进行**移动、缩放、转动、拉长或拉伸**，转换是使元素改变形状、尺寸和位置的一种效果。

**translate() 方法**

通过 translate(x , y) 方法，元素根据给定的 left（x 坐标） 和 top（y 坐标） 位置参数从其当前位置移动，x为正值向右移动，为负值向左移动；y为正值向下移动，为负值向上移动；

```css
div {    transform: translate(50px, 100px);    -ms-transform: translate(50px, 100px); /* IE 9 */    -webkit-transform: translate(50px, 100px); /* Safari and Chrome */    -o-transform: translate(50px, 100px); /* Opera */    -moz-transform: translate(50px, 100px); /* Firefox */}
```

**rotate() 方法**

控制元素顺时针旋转给定的角度。为正值，元素将顺时针旋转。为负值，元素将逆时针旋转。

```css
div {    transform: rotate(30deg);    -ms-transform: rotate(30deg); /* IE 9 */    -webkit-transform: rotate(30deg); /* Safari and Chrome */    -o-transform: rotate(30deg); /* Opera */    -moz-transform: rotate(30deg); /* Firefox */}
```

**scale() 方法**

根据给定的宽度（X 轴）和高度（Y 轴）参数，控制元素的尺寸的增加、减少。

```css
div {    transform: scale(2, 4);    -ms-transform: scale(2, 4); /* IE 9 */    -webkit-transform: scale(2, 4); /* Safari 和 Chrome */    -o-transform: scale(2, 4); /* Opera */    -moz-transform: scale(2, 4); /* Firefox */}
```

**skew() 方法**

根据给定的水平线（X 轴）和垂直线（Y 轴）参数设置元素翻转给定的角度。

```css
/* 设置围绕 X 轴把元素翻转 30 度，围绕 Y 轴翻转 20 度。 */div {    transform: skew(30deg, 20deg);    -ms-transform: skew(30deg, 20deg); /* IE 9 */    -webkit-transform: skew(30deg, 20deg); /* Safari and Chrome */    -o-transform: skew(30deg, 20deg); /* Opera */    -moz-transform: skew(30deg, 20deg); /* Firefox */}
```

**matrix() 方法**

matrix() 方法把所有 2D 转换方法组合在一起。matrix() 方法需要六个参数，包含数学函数，允许旋转、缩放、移动以及倾斜元素。

```css
/* 使用 matrix 方法将 div 元素旋转 30 度 */div {    transform: matrix(0.866, 0.5, -0.5, 0.866, 0, 0);    -ms-transform: matrix(0.866, 0.5, -0.5, 0.866, 0, 0); /* IE 9 */    -moz-transform: matrix(0.866, 0.5, -0.5, 0.866, 0, 0); /* Firefox */    -webkit-transform: matrix(0.866, 0.5, -0.5, 0.866, 0, 0); /* Safari and Chrome */    -o-transform: matrix(0.866, 0.5, -0.5, 0.866, 0, 0); /* Opera */}
```

**2D Transform 方法汇总**

| 函数 | 描述 |
| --- | --- |
| matrix(n,n,n,n,n,n) | 定义 2D 转换，使用六个值的矩阵。 |
| translate(x,y) | 定义 2D 转换，沿着 X 和 Y 轴移动元素。 |
| translateX(n) | 定义 2D 转换，沿着 X 轴移动元素。 |
| translateY(n) | 定义 2D 转换，沿着 Y 轴移动元素。 |
| scale(x,y) | 定义 2D 缩放转换，改变元素的宽度和高度。 |
| scaleX(n) | 定义 2D 缩放转换，改变元素的宽度。 |
| scaleY(n) | 定义 2D 缩放转换，改变元素的高度。 |
| rotate(angle) | 定义 2D 旋转，在参数中规定角度。 |
| skew(x-angle,y-angle) | 定义 2D 倾斜转换，沿着 X 和 Y 轴。 |
| skewX(angle) | 定义 2D 倾斜转换，沿着 X 轴。 |
| skewY(angle) | 定义 2D 倾斜转换，沿着 Y 轴。 |
1. CSS3 3D 转换

CSS3 允许使用 3D 转换来对元素进行格式化

**rotateX() 方法**

```css
/* 设置元素围绕其 X 轴以给定的度数进行旋转 */div {    transform: rotateX(120deg);    -webkit-transform: rotateX(120deg); /* Safari 和 Chrome */    -moz-transform: rotateX(120deg); /* Firefox */}
```

**rotateY() 旋转**

```css
/* 设置元素围绕其 Y 轴以给定的度数进行旋转 */div {    transform: rotateY(130deg);    -webkit-transform: rotateY(130deg); /* Safari 和 Chrome */    -moz-transform: rotateY(130deg); /* Firefox */}
```

1. CSS3 过渡
    
    通过 CSS3可以在不使用 Flash 动画或 JavaScript 的情况下，当元素从一种样式变换为另一种样式时为元素添加效果。
    
    要实现这一点，必须规定以下两项内容：
    
    - 设置添加过渡效果的 CSS 属性；
    - 设置过渡效果的时长；
    
    **注意：** 如果时长未设置，则不会有过渡效果，因为默认值是 0。
    

**单项改变**

```css
/* 设置将变化效果添加在“宽度”上，时长为2秒；该时长在其他属性上并不适用 */div {    transition: width 2s;    -moz-transition: width 2s; /* Firefox 4 */    -webkit-transition: width 2s; /* Safari 和 Chrome */    -o-transition: width 2s; /* Opera */}/* 配合在一起使用的效果就是当鼠标移上去的时候宽度变为300px，这个过程耗时2秒 */div:hover {    width: 300px;}
```

**注意：** 当鼠标移出元素时，它会逐渐变回原来的样式。

**多项改变**

如需向多个样式添加过渡效果，请添加多个属性，由逗号隔开。

```css
/* 同时向宽度、高度和转换添加过渡效果 */div {    transition: width 2s, height 2s, transform 2s;    -moz-transition: width 2s, height 2s, -moz-transform 2s;    -webkit-transition: width 2s, height 2s, -webkit-transform 2s;    -o-transition: width 2s, height 2s, -o-transform 2s;}/* 当鼠标移上时宽度和高度都变成200px，同时旋转180度，每个属性变化都耗时2秒 */div:hover {    width: 200px;    height: 200px;    transform: rotate(180deg);    -moz-transform: rotate(180deg); /* Firefox 4 */    -webkit-transform: rotate(180deg); /* Safari and Chrome */    -o-transform: rotate(180deg); /* Opera */}
```

**过渡属性详解**

transition是简写属性，

**语法：** transition : transition-property | transition-duration | transition-timing-function | transition-delay;

```css
/* 设置在宽度上添加过渡效果，时长为1秒，过渡效果时间曲线为linear，等待2秒后开始过渡 */div {    transition: width 1s linear 2s;    -moz-transition: width 1s linear 2s; /* Firefox 4 */    -webkit-transition: width 1s linear 2s; /* Safari and Chrome */    -o-transition: width 1s linear 2s; /* Opera */}
```

| 属性 | 描述 |
| --- | --- |
| transition | 简写属性，用于在一个属性中设置四个过渡属性。 |
| transition-property | 规定应用过渡的 CSS 属性的名称。 |
| transition-duration | 定义过渡效果花费的时间。默认是 0。 |
| transition-timing-function | 规定过渡效果的时间曲线。默认是 “ease”。 |
| transition-delay | 规定过渡效果何时开始。默认是 0。 |
1. CSS3 动画
    
    通过 CSS3可以创建动画，这些动画可以取代网页中的画图片、Flash 动画以及 JavaScript。
    
    CSS3 中通过@keyframes 规则来创建动画。在 @keyframes 中规定某项 CSS 样式，就能创建由当前样式（动画开始前的样式）逐渐改为新样式（需要变到的样式）的动画效果。
    

**通过from , to关键字设置动画发生的时间**

```css
/* 通过@keyframes 创建动画 */@keyframes myfirst {    from {        background: red;    }    to {        background: yellow;    }}/* Firefox */@-moz-keyframes myfirst {    from {        background: red;    }    to {        background: yellow;    }}/* Safari 和 Chrome */@-webkit-keyframes myfirst {    from {        background: red;    }    to {        background: yellow;    }}/* Opera */@-o-keyframes myfirst {    from {        background: red;    }    to {        background: yellow;    }}/*   将创建的动画绑定到选择器，并至少指定以下两项 CSS3 动画属性   1.指定动画的名称；   2.指定动画的时长；*/div {    animation: myfirst 5s;    -moz-animation: myfirst 5s; /* Firefox */    -webkit-animation: myfirst 5s; /* Safari 和 Chrome */    -o-animation: myfirst 5s; /* Opera */}
```

**通过百分比设置动画发生的时间**

动画是使元素从一种样式逐渐变化为另一种样式的效果。可以改变任意多的样式任意多的次数。可以用关键词 “from” 和 “to” 来设置动画变化发生的时间，其效果等同于 0% 和 100%。0% 是动画的开始，100% 是动画的完成。为了得到最佳的浏览器支持，应该始终定义 0% 和 100% 选择器。

```css
/* 当动画为 25% 及 50% 时改变背景色，然后当动画 100% 完成时再次改变 */@keyframes myfirst {    0% {        background: red;    }    25% {        background: yellow;    }    50% {        background: blue;    }    100% {        background: green;    }}/* 同时改变背景色和位置 */@keyframes myfirst {    0% {        background: red;        left: 0px;        top: 0px;    }    25% {        background: yellow;        left: 200px;        top: 0px;    }    50% {        background: blue;        left: 200px;        top: 200px;    }    75% {        background: green;        left: 0px;        top: 200px;    }    100% {        background: red;        left: 0px;        top: 0px;    }}
```

**动画属性详解**

animation是除了animation-play-state属性所有动画属性的简写属性。

**语法：** animation : animation-name | animation-duration | animation-timing-function | animation-delay | animation-iteration-count | animation-direction

```css
/* 应用的动画为myfirst，一个动画周期为5秒，动画的速度曲线为linear，动画2秒后播放，播放次数为infinite，即无限循环，动画下一周期是否逆向播放取值alternate，即逆向播放 */div {    animation: myfirst 5s linear 2s infinite alternate;    /* Firefox: */    -moz-animation: myfirst 5s linear 2s infinite alternate;    /* Safari 和 Chrome: */    -webkit-animation: myfirst 5s linear 2s infinite alternate;    /* Opera: */    -o-animation: myfirst 5s linear 2s infinite alternate;}
```

| 属性 | 描述 |
| --- | --- |
| @keyframes | 规定动画。 |
| animation | 所有动画属性的简写属性，除了 animation-play-state 属性。 |
| animation-name | 规定 @keyframes 动画的名称。 |
| animation-duration | 规定动画完成一个周期所花费的秒或毫秒。默认是 0。 |
| animation-timing-function | 规定动画的速度曲线。默认是 “ease”。 |
| animation-delay | 规定动画何时开始。默认是 0。 |
| animation-iteration-count | 规定动画被播放的次数。默认是 1。 |
| animation-direction | 规定动画是否在下一周期逆向地播放。默认是 “normal”。 |
| animation-play-state | 规定动画是否正在运行或暂停。默认是 “running”。 |
| animation-fill-mode | 规定对象动画时间之外的状态。 |
1. CSS3 多列
    
    通过 CSS3够创建多个列来对文本进行布局，就像我们经常看到的报纸的布局一样。
    
    **CSS3 创建多列**
    
    column-count属性规定元素应该被分隔的列数。
    

```css
/* 将div中的文本分为3列 */div {    column-count: 3;    -moz-column-count: 3; /* Firefox */    -webkit-column-count: 3; /* Safari 和 Chrome */}
```

**CSS3 规定列之间的间隔**

column-gap属性规定列之间的间隔。

```css
/* 设置列之间的间隔为 40 像素 */div {    column-gap: 40px;    -moz-column-gap: 40px; /* Firefox */    -webkit-column-gap: 40px; /* Safari 和 Chrome */}
```

**CSS3 列规则**

column-rule属性设置列之间的宽度、样式和颜色规则。

**语法：** column-rule : column-rule-width | column-rule-style | column-rule-color

```css
div {    column-rule: 3px outset #ff0000;    -moz-column-rule: 3px outset #ff0000; /* Firefox */    -webkit-column-rule: 3px outset #ff0000; /* Safari and Chrome */}
```

| 属性 | 描述 |
| --- | --- |
| column-count | 规定元素应该被分隔的列数。 |
| column-fill | 规定如何填充列。 |
| column-gap | 规定列之间的间隔。 |
| column-rule | 设置所有 column-rule-* 属性的简写属性。 |
| column-rule-width | 规定列之间规则的宽度。 |
| column-rule-style | 规定列之间规则的样式。 |
| column-rule-color | 规定列之间规则的颜色。 |
| column-span | 规定元素应该横跨的列数。 |
| column-width | 规定列的宽度。 |
| columns | 语法 : column-width column-count。 |
1. CSS3 用户界面

**CSS3 resize**

在 CSS3中resize属性设置是否可由用户调整元素尺寸。

```css
/* 设置div可以由用户调整大小 */div {    resize: both;    overflow: auto;}
```

**CSS3 box-sizing**

box-sizing属性允许您以确切的方式定义适应某个区域的具体内容。边框计算在width中

```css
/* 规定两个并排的带边框方框 */div {    box-sizing: border-box;    -moz-box-sizing: border-box; /* Firefox */    -webkit-box-sizing: border-box; /* Safari */    width: 50%;    float: left;}
```

**CSS3 outline-offset**

outline-offset属性对轮廓进行偏移，并在超出边框边缘的位置绘制轮廓。

轮廓与边框有两点不同：

> 轮廓不占用空间；轮廓可能是非矩形；
> 

```css
/* 规定边框边缘之外 15 像素处的轮廓 */div {    border: 2px solid black;    outline: 2px solid red;    outline-offset: 15px;}
```

## css：inline-block 的 div 之间的空隙，原因及解决

**参考答案**：

display:inline-block布局的元素在chrome下会出现几像素的间隙，原因是因为我们在编辑器里写代码的时候，同级别的标签不写在同一 行以保持代码的整齐可读性，即inline-block布局的元素在编辑器里不在同一行，即存在换行符，因此这就是著名的inline-block“换行 符/空格间隙问题”。如果inline-block元素间有空格或是换行产生了间隙，那是正常的，应该的。如果没有空格与间隙才是不正常的（**IE6/7**  block水平元素）。

**解决方法：**

1、把img标签的display属性改成block：

```css
img {    dispaly: block;}
```

2、把div中的字体大小设为0：

```css
div {    font-size: 0;}
```

3、如果是img，修改img的vertical-align属性：

```css
img {    vertical-align: buttom;}img {    vertical-align: middle;}img {    vertical-align: top;}
```

1. 移除标签间的空格

```html
<ul>    <li>这是一个li</li>    <li>这是另一个li</li>    <li>这是另另一个li</li>    <li>这是另另另一个li</li></ul>// 方式二：在标签结束处消除换行符<ul>    <li>这是一个li    </li>    <li>这是另一个li    </li>    <li>这是另另一个li    </li>    <li>这是另另另一个li</li></ul>// 方式三：HTML注释标签<ul>    <li>这是一个li</li><!--    -->    <li>这是另一个li</li><!--    -->    <li>这是另另一个li</li><!--    -->    <li>这是另另另一个li</li></ul>
```
