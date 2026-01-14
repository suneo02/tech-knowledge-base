# CSS 主题切换


**参考答案**：

方式一：主题层

这应该是实现主题功能的一种最常用的手段了。首先，我们的站点会有一个最初的基础样式（或者叫默认样式）；然后通过添加一些后续的额外的CSS来覆盖与重新定义部分样式。

具体实现

首先，我们引入基础的样式components.*文件

```css
@import "components.tabs";@import "components.buttons"
```

其中components.tabs文件内容如下

```css
.tab {    margin: 0;    padding: 0;    background-color: gray;}
```

然后，假设我们的某个主题的样式文件存放于theme.*文件：

对应于components.tabs，theme.tabs文件内容如下

```css
.tab {    background-color: red;}
```

因此，我们只需要引入主题样式文件即可

```css
@import "components.tabs";@import "components.buttons"@import "theme.tabs";
```

这样当前的样式就变为了

```css
.tab {    margin: 0;    padding: 0;    /* background-color: gray; */    background-color: red;}
```

优点

- 实现方式简单
- 可以实现将主题应用与所有元素

缺点

- 过多的冗余代码
- 许多的CSS其实是无用的，浪费了带宽
- 把样式文件切分到许多文件中，更加琐碎

---

方式二：有状态的主题

该方式可以实现基于条件选择不同的主题皮肤，并允许用户在客户端随时切换主题。非常适合需要客户端样式切换功能，或者需要对站点某一部分（区域）进行独立样式设置的场景。

具体实现

还是类似上一节中 Tab 的这个例子，我们可以将 Tab 部分的 (S)CSS 改为如下形式：

```css
.tab {    background-color: gray;.t-red&{    background-color: red;}.t-blue&{    background-color: blue;}}
```

这里我们把.t-red与.t-blue称为 Tab 元素的上下文环境（context）。Tab 元素会根据 context 的不同展示出不同的样式。

最后我们给body元素加上这个开关

```html
<body class="t-red"><ul class="tabs">...</ul></body>
```

此时 Tab 的颜色为红色。

当我们将t-red改为t-blue时，Tab 就变为了蓝色主题。

进一步的，我们可以创建一些 (S)CSS 的 util class（工具类）来专门控制一些 CSS 属性，帮助我们更好地控制主题。例如我们使用如下的.u-color-current类来控制不同主题下的字体颜色

```css
.u-color-current {.t-red&{    color: red;}.t-blue&{    color: blue;}}
```

这样，当我们在不同主题上下文环境下使用.u-color-current时，就可以控制元素展示出不同主题的字体颜色

```html
<body class="t-red"><h1 class="page-title u-color-current">...</h1></body>
```

上面这段代码会控制`<h1>`元素字体颜色为红色主题时的颜色。

优点

- 将许多主题放在了同一处代码中
- 非常适合主题切换的功能
- 非常适合站点局部的主题化
- 可以实现将主题应用于所有元素

缺点

- 有时有点也是缺点，将许多主题混杂在了同一块代码中
- 可能会存在冗余

---

方式三：配置主题

这种方式其实是在开发侧来实现主题样式的区分与切换的。基于不同的配置，配合一些开发的自动化工具，我们可以在开发时期根据配置文件，编译生成不同主题的 CSS 文件。

它一般会结合使用一些 CSS 预处理器，可以对不同的 UI 元素进行主题分离，并且向客户端直接提供主题样式下最终的 CSS。

具体实现

我们还是以 Sass 为例：

首先会有一份 Sass 的配置文件，例如settings.config.scss，在这份配置中定义当前的主题值以及一些其他变量

```css
$theme: red;
```

然后对于一个 Tab 组件，我们这么来写它的 Sass 文件

```css
.tab {    margin: 0;    padding: 0;@if ($theme == red) {    background-color: red;} @else {    background-color: gray;}}
```

这时，我们在其之前引入相应的配置文件后

```css
@import "settings.config";@import "components.tabs";
```

Tab 组件就会呈现出红色主题。

当然，我们也可以把我们的settings.config.scss做的更健壮与易扩展一些

```css
$config:(theme: red,env: dev,)//从$ config中获取相应的配置变量@function config($key) {    @return map-get($config, $key);}
```

与之前相比，这时候使用起来只需要进行一些小的修改，将直接使用theme变量改为调用config方法

```css
.tab {    margin: 0;    padding: 0;@if (config(theme) == red) {    background-color: red;} @else {    background-color: gray;}}
```

优点

- 访问网站时，只会传输所需的 CSS，节省带宽
- 将主题的控制位置放在了一个地方（例如上例中的settings.config.scss文件）
- 可以实现将主题应用于所有元素

缺点

- 在 Sass 中会有非常多逻辑代码
- 只支持有限数量的主题
- 主题相关的信息会遍布代码库中
- 添加一个新主题会非常费劲

---

方式四：主题调色板

这种方式有些类似于我们绘图时，预设了一个调色板（palette），然后使用的颜色都从其中取出一样。

在实现主题功能时，我们也会有一个类似的“调色板”，其中定义了主题所需要的各种属性值，之后再将这些信息注入到项目中。

当你经常需要为客户端提供完全的定制化主题，并且经常希望更新或添加主题时，这种模式会是一个不错的选择。

具体实现

在方式三中，我们在一个独立的配置文件中设置了一些“环境”变量，来标示当前所处的主题。而在方式四中，我们会更进一步，抽取出一个专门的 palette 文件，用于存放不同主题的变量信息。

例如，现在我们有一个settings.palette.red.scss文件

```css
$color: red;$color-tabs-background:$color-red;
```

然后我们的components.tabs.scss文件内容如下

```css
.tabs {    margin: 0;    padding: 0;    backgroung-color: $ color-tabs-background;}
```

这时候，我们只需要引入这两个文件即可

```css
@import "settings.palette.red";@import "components.tabs";
```

可以看到，components.tabs.scss中并没有关于主题的逻辑判断，我们只需要专注于编辑样式，剩下就是选择所需的主题调色板（palette）即可。

优点

- 编译出来的样式代码无冗余
- 非常适合做一些定制化主题，例如一个公司采购了你们的系统，你可以很方便实现一个该公司的主题
- 可以从一个文件中完全重制出你需要的主题样式

缺点

- 由于主要通过设定不同变量，所以代码确定后，能实现的修改范围会是有限的

---

方式五：用户定制化

这种模式一般会提供一个个性化配置与管理界面，让用户能自己定义页面的展示样式。

“用户定制化”在社交媒体产品、SaaS 平台或者是 Brandable Software 中最为常见。

具体实现

要实现定制化，可以结合方式二中提到的 util class。

首先，页面中支持自定义的元素会被预先添加 util class，例如 Tab 元素中的u-user-color-background

```html
<ul class="tabs u-user-color-background">...</ul>
```

此时，u-user-color-background还并未定义任何样式。而当用户输入了一个背景色时，我们会创建一个``标签，并将 hex 值注入其中

```html
<style id="my-custom">    .u-user-color-background {        background-color: #00ffff;    }</style>
```

这时用户就得到了一个红色的 Tab。

优点

- 不需要开发人员的输入信息（是用户定义的）
- 允许用户拥有自己“独一无二”的站点
- 非常实用

缺点

- 不需要开发人员的输入信息也意味着你需要处理更多的“不可控”情况
- 会有许多的冗余
- 会浪费 CSS 的带宽
- 失去部分 CSS 的浏览器缓存能力

## 布局: 三栏布局(平均分布)

**参考答案：**

1. flex:1 : 设置父级弹性盒，子盒子三个各占1份
    
    ```html
     <div class="Grid">    <div class="Grid-cell">1/3</div>    <div class="Grid-cell">1/3</div>    <div class="Grid-cell">1/3</div>  </div>
    ```
    
    ```css
    .Grid {  display: flex;}.Grid-cell {  flex: 1;  background: #eee;  margin: 10px;}
    ```
    
2. flex 百分比
    
    ```html
    <div class="Grid">    <div class="Grid-cell col3"></div>    <div class="Grid-cell col3"></div>    <div class="Grid-cell clo3"></div></div>
    ```
    
    ```css
    .col3 {  flex: 0 0 33.3%;}
    ```
    
3. 流式布局
    
    ```html
    <div class="Grid">    <div class="Grid-cell col3"></div>    <div class="Grid-cell col3"></div>    <div class="Grid-cell clo3"></div></div>
    ```
    
    ```css
    .col3 {  width: 33.33%}
    ```
    

## 移动端 1px 问题

**参考答案**：

**问题**：1px 的边框，在高清屏下，移动端的1px 会很粗

**产生原因**

那么为什么会产生这个问题呢？主要是跟一个东西有关，DPR(devicePixelRatio) 设备像素比，它是默认缩放为100%的情况下，设备像素和CSS像素的比值。

```
window.devicePixelRatio=物理像素 /CSS像素
复制代码
```

目前主流的屏幕DPR=2 （iPhone 8）,或者3 （iPhone 8 Plus）。拿2倍屏来说，设备的物理像素要实现1像素，而DPR=2，所以css 像素只能是 0.5。一般设计稿是按照750来设计的，它上面的1px是以750来参照的，而我们写css样式是以设备375为参照的，所以我们应该写的0.5px就好了啊！ 试过了就知道，iOS 8+系统支持，安卓系统不支持。

**解决方案**

1. WWDC对iOS统给出的方案
    
    在 WWDC大会上，给出来了1px方案，当写 0.5px的时候，就会显示一个物理像素宽度的 border，而不是一个css像素的 border。 所以在iOS下，你可以这样写。
    
    ```css
    border:0.5px solid #E5E5E5
    ```
    
    可能你会问为什么在3倍屏下，不是0.3333px 这样的？经过测试，在Chrome上模拟iPhone 8Plus，发现小于0.46px的时候是显示不出来。
    
    **总结：**
    
    - 优点：简单，没有副作用
    - 缺点：支持iOS 8+，不支持安卓。后期安卓follow就好了。
2. 使用边框图片
    
    ```css
     border: 1px solid transparent; border-image: url('./../../image/96.jpg') 2 repeat;
    ```
    
    **总结：**
    
    - 优点：没有副作用
    - 缺点：border颜色变了就得重新制作图片；圆角会比较模糊。
3. 使用box-shadow实现
    
    ```css
    box-shadow: 0  -1px 1px -1px #e5e5e5,   //上边线            1px  0  1px -1px #e5e5e5,   //右边线            0  1px  1px -1px #e5e5e5,   //下边线            -1px 0  1px -1px #e5e5e5;   //左边线
    ```
    
    **总结**
    
    - 优点：使用简单，圆角也可以实现
    - 缺点：模拟的实现方法，仔细看谁看不出来这是阴影不是边框。
4. 使用伪元素
    
    1条border
    
    ```css
    .setOnePx{  position: relative;  &::after{    position: absolute;    content: '';    background-color: #e5e5e5;    display: block;    width: 100%;    height: 1px; /*no*/    transform: scale(1, 0.5);    top: 0;    left: 0;  }}
    ```
    
    可以看到，将伪元素设置绝对定位，并且和父元素的左上角对齐，将width 设置100%，height设置为1px，然后进行在Y方向缩小0.5倍。
    
    4 条border
    
    ```css
    .setBorderAll{     position: relative;       &:after{           content:" ";           position:absolute;           top: 0;           left: 0;           width: 200%;           height: 200%;           transform: scale(0.5);           transform-origin: left top;           box-sizing: border-box;           border: 1px solid #E5E5E5;           border-radius: 4px;      }    }
    ```
    
    同样为伪元素设置绝对定位，并且和父元素左上角对其。将伪元素的长和宽先放大2倍，然后再设置一个边框，以左上角为中心，缩放到原来的0.5倍
    
    **总结：**
    
    - 优点：全机型兼容，实现了真正的1px，而且可以圆角。
    - 缺点：暂用了after 伪元素，可能影响清除浮动。
5. 设置viewport的scale值
    
    这个解决方案是利用viewport+rem+js 实现的。
    
    ```html
    <html>  <head>      <title>1px question</title>      <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">      <meta name="viewport" id="WebViewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">      <style>          html {              font-size: 1px;          }          * {              padding: 0;              margin: 0;          }          .top_b {              border-bottom: 1px solid #E5E5E5;          }          .a,.b {                      box-sizing: border-box;              margin-top: 1rem;              padding: 1rem;              font-size: 1.4rem;          }          .a {              width: 100%;          }          .b {              background: #f5f5f5;              width: 100%;          }      </style>      <script>          var viewport = document.querySelector("meta[name=viewport]");          //下面是根据设备像素设置viewport          if (window.devicePixelRatio == 1) {              viewport.setAttribute('content', 'width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no');          }          if (window.devicePixelRatio == 2) {              viewport.setAttribute('content', 'width=device-width,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no');          }          if (window.devicePixelRatio == 3) {              viewport.setAttribute('content', 'width=device-width,initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no');          }          var docEl = document.documentElement;          var fontsize = 32* (docEl.clientWidth / 750) + 'px';          docEl.style.fontSize = fontsize;      </script>  </head>  <body>      <div class="top_b a">下面的底边宽度是虚拟1像素的</div>      <div class="b">上面的边框宽度是虚拟1像素的</div>  </body></html>
    ```
    
    **总结**
    
    - 优点：全机型兼容，直接写1px不能再方便
    - 缺点：适用于新的项目，老项目可能改动大

## BFC

**参考答案**：

1. **简介**
    
    在解释BFC之前，先说一下文档流。我们常说的文档流其实分为**定位流**、**浮动流**、**普通流** 三种。而普通流其实就是指BFC中的FC。FC(Formatting Context) ，直译过来是格式化上下文，它是页面中的一块渲染区域，有一套渲染规则，决定了其子元素如何布局，以及和其他元素之间的关系和作用。常见的FC有BFC、IFC，还有GFC和FFC。
    
    **BFC**(Block Formatting Context) 块级格式化上下文，是用于布局块级盒子的一块渲染区域。[MDN上的解释](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context) ：BFC是Web页面 CSS 视觉渲染的一部分，用于决定块盒子的布局及浮动相互影响范围的一个区域。
    
    注意：一个BFC的范围包含创建该上下文元素的所有子元素，但**不包括** 创建了新BFC的子元素的内部元素。这从另一方角度说明，一个元素不能同时存在于两个BFC中。因为如果一个元素能够同时处于两个BFC中，那么就意味着这个元素能与两个BFC中的元素发生作用，就违反了BFC的隔离作用。
    
2. **三种文档流的定位方案**
    
    **常规流(Normal flow)**
    
    - 在常规流中，盒一个接着一个排列;
    - 在块级格式化上下文里面， 它们竖着排列；
    - 在行内格式化上下文里面， 它们横着排列;
    - 当position为static或relative，并且float为none时会触发常规流；
    - 对于静态定位(static positioning)，position: static，盒的位置是常规流布局里的位置；
    - 对于相对定位(relative positioning)，position: relative，盒偏移位置由top、bottom、left、right属性定义。即使有偏移，仍然保留原有的位置，其它常规流不能占用这个位置。
    
    **浮动(Floats)**
    
    - 左浮动元素尽量靠左、靠上，右浮动同理
    - 这导致常规流环绕在它的周边，除非设置 clear 属性
    - 浮动元素不会影响块级元素的布局
    - 但浮动元素会影响行内元素的布局，让其围绕在自己周围，撑大父级元素，从而间接影响块级元素布局
    - 最高点不会超过当前行的最高点、它前面的浮动元素的最高点
    - 不超过它的包含块，除非元素本身已经比包含块更宽
    - 行内元素出现在左浮动元素的右边和右浮动元素的左边，左浮动元素的左边和右浮动元素的右边是不会摆放浮动元素的
    
    **绝对定位(Absolute positioning)**
    
    - 绝对定位方案，盒从常规流中被移除，不影响常规流的布局；
    - 它的定位相对于它的包含块，相关CSS属性：top、bottom、left、right；
    - 如果元素的属性position为absolute或fixed，它是绝对定位元素；
    - 对于position: absolute，元素定位将相对于上级元素中最近的一个relative、fixed、absolute，如果没有则相对于body；
3. **BFC触发方式**
    
    3.1 根元素，即HTML标签
    
    3.2 浮动元素：float值为left、right
    
    3.3 overflow值不为 visible，为auto、scroll、hidden
    
    3.4 display值为inline-block、table-cell、table-caption、table、inline-table、flex、inline-flex、grid、inline-grid
    
    3.5 定位元素：position值为absolute、fixed
    
    **注意：**display:table也可以生成BFC的原因在于Table会默认生成一个匿名的table-cell，是这个匿名的table-cell生成了BFC。
    
4. **约束规则**
    
    浏览器对BFC区域的约束规则：
    
    1. 生成BFC元素的子元素会一个接一个的放置。
    2. 垂直方向上他们的起点是一个包含块的顶部，两个相邻子元素之间的垂直距离取决于元素的margin特性。在BFC中相邻的块级元素的外边距会折叠( Mastering margin collapsing)
        1. 生成BFC元素的子元素中，每一个子元素左外边距与包含块的左边界相接触（对于从右到左的格式化，右外边距接触右边界），即使浮动元素也是如此（尽管子元素的内容区域会由于浮动而压缩），除非这个子元素也创建了一个新的BFC（如它自身也是一个浮动元素）。
    
    规则解读：
    
    1. 内部的Box会在垂直方向上一个接一个的放置
    2. 内部的Box垂直方向上的距离由margin决定。（完整的说法是：属于同一个BFC的两个相邻Box的margin会发生折叠，不同BFC不会发生折叠。）
    3. 每个元素的左外边距与包含块的左边界相接触（从左向右），即使浮动元素也是如此。（这说明BFC中子元素不会超出他的包含块，而position为absolute的元素可以超出他的包含块边界）
    4. BFC的区域不会与float的元素区域重叠
    5. 计算BFC的高度时，浮动子元素也参与计算
5. **作用**
    
    BFC是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面元素，反之亦然。我们可以利用BFC的这个特性来做很多事。
    
    5.1 阻止元素被浮动元素覆盖
    
    一个正常文档流的block元素可能被一个float元素覆盖，挤占正常文档流，因此可以设置一个元素的float、 display、position值等方式触发BFC，以阻止被浮动盒子覆盖。
    
    5.2 可以包含浮动元素
    
    通过改变包含浮动子元素的父盒子的属性值，触发BFC，以此来包含子元素的浮动盒子。
    
    5.3 阻止因为浏览器因为四舍五入造成的多列布局换行的情况
    
    有时候因为多列布局采用小数点位的width导致因为浏览器因为四舍五入造成的换行的情况，可以在最后一 列触发BFC的形式来阻止换行的发生。比如下面栗子的特殊情况
    
    5.4 阻止相邻元素的margin合并
    
    属于同一个BFC的两个相邻块级子元素的上下margin会发生重叠，(设置writing-mode:tb-rl时，水平 margin会发生重叠) 。所以当两个相邻块级子元素分属于不同的BFC时可以阻止margin重叠。 这里给任一个相邻块级盒子的外面包一个div，通过改变此div的属性使两个原盒子分属于两个不同的BFC，以此来阻止margin重叠。
    

## 移动端适配方案

**参考答案：**

适配思路

设计稿（750*1334） —> 开发 —> 适配不同的手机屏幕，使其显得合理

原则

1. 开发时方便，写代码时设置的值要和标注的 160px 相关
2. 方案要适配大多数手机屏幕，并且无 BUG
3. 用户体验要好，页面看着没有不适感

思路

1. 写页面时，按照设计稿写固定宽度，最后再统一缩放处理，在不同手机上都能用
2. 按照设计稿的标准开发页面，在手机上部分内容根据屏幕宽度等比缩放，部分内容按需要变化，需要缩放的元素使用 rem, vw 相对单位，不需要缩放的使用 px
3. 固定尺寸+弹性布局，不需要缩放

**viewport 适配**

根据设计稿标准（750px 宽度）开发页面，写完后页面及元素自动缩小，适配 375 宽度的屏幕

在 head 里设置如下代码

```html
<meta name="viewport" content="width=750,initial-scale=0.5">
```

initial-scale = 屏幕的宽度 / 设计稿的宽度

为了适配其他屏幕，需要动态的设置 initial-scale 的值

```html
<head>    <script>        const WIDTH = 750        const mobileAdapter = () => {            let scale = screen.width / WIDTH            let content = `width=${WIDTH}, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}`            let meta = document.querySelector('meta[name=viewport]')            if (!meta) {                meta = document.createElement('meta')                meta.setAttribute('name', 'viewport')                document.head.appendChild(meta)            }            meta.setAttribute('content', content)        }        mobileAdapter()        window.onorientationchange = mobileAdapter //屏幕翻转时再次执行    </script></head>
```

缺点就是边线问题，不同尺寸下，边线的粗细是不一样的（等比缩放后），全部元素都是等比缩放，实际显示效果可能不太好

**vw 适配（部分等比缩放）**

1. 开发者拿到设计稿（假设设计稿尺寸为750px，设计稿的元素标注是基于此宽度标注）
2. 开始开发，对设计稿的标注进行转换，把px换成vw。比如页面元素字体标注的大小是32px，换成vw为 (100/750)*32 vw
3. 对于需要等比缩放的元素，CSS使用转换后的单位
4. 对于不需要缩放的元素，比如边框阴影，使用固定单位px

关于换算，为了开发方便，利用自定义属性，CSS变量

```html
<head>    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">    <script>        const WIDTH = 750        //:root { --width: 0.133333 } 1像素等于多少 vw        document.documentElement.style.setProperty('--width', (100 / WIDTH))    </script></head>
```

注意此时，meta 里就不要去设置缩放了

业务代码里就可以写

```css
header {    font-size: calc(28vw * var(--width))}
```

实现了按需缩放

**rem 适配**

1. 开发者拿到设计稿（假设设计稿尺寸为750px，设计稿的元素标是基于此宽度标注）
2. 开始开发，对设计稿的标注进行转换
3. 对于需要等比缩放的元素，CSS使用转换后的单位
4. 对于不需要缩放的元素，比如边框阴影，使用固定单位px

假设设计稿的某个字体大小是 40px, 手机屏幕上的字体大小应为 420/750*40 = 22.4px (体验好)，换算成 rem（相对于 html 根节点，假设 html 的 font-size = 100px,）则这个字体大小为 0.224 rem

写样式时，对应的字体设置为 0.224 rem 即可，其他元素尺寸也做换算…

但是有问题

举个 ，设计稿的标注 是40px，写页面时还得去做计算，很麻烦（全部都要计算）

能不能规定一下，看到 40px ,就应该写 40/100 = 0.4 rem,这样看到就知道写多少了（不用计算），此时的 html 的 font-size 就不能是 100px 了，应该为 (420*100)/750 = 56px，100为我们要规定的那个参数

根据不同屏幕宽度，设置 html 的 font-size 值

```html
<head>    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">    <script>        const WIDTH = 750 //设计稿尺寸        const setView = () => {            document.documentElement.style.fontSize = (100 * screen.width / WIDTH) + 'px'        }        window.onorientationchange = setView        setView()    </script></head>
```

对于需要等比缩放的元素，CSS使用转换后的单位

```css
header {    font-size: .28rem;}
```

对于不需要缩放的元素，比如边框阴影，使用固定单位px

```css
header > span.active {    color: #fff;    border-bottom: 2px solid rgba(255, 255, 255, 0.3);}
```

假设 html 的 font size = 1px 的话，就可以写 28 rem 了，更方便了，但是浏览器对字体大小有限制，设为 1px 的话，在浏览器中是失效的，会以 12px（或者其他值） 做一个计算 , 就会得到一个很夸张的结果，所以可以把 html 写的大一些

使用 sass 库时

JS 处理还是一样的，但看着好看些

```css
@function px2rem($px) {    @return $px * 1rem / 100;}header {    font-size: px2rem(28);}
```

以上的三种适配方案，都是等比缩放，放到 ipad 上时（设计稿以手机屏幕设计的），页面元素会很大很丑，有些场景下，并不需要页面整体缩放（viewport 自动处理的也很好了），所以有时只需要合理的布局即可。

**弹性盒适配（合理布局）**

```html
<meta name="viewport" content="width=device-width">
```

使用 flex 布局

```css
section {    display: flex;}
```

总结一下，什么样的页面需要做适配（等比缩放）呢

- 页面中的布局是栅格化的

换了屏幕后，到底有多宽多高很难去做设置，整体的都需要改变，所以需要整体的缩放

- 头屏大图，宽度自适应，高度固定的话，对于不同的屏幕，形状就会发生改变（放到ipad上就变成长条了），宽度变化后，高度也要保持等比例变化

以上所有的适配都是宽度的适配，但是在某些场景下，也会出现高度的适配

比如大屏，需要适配很多的电视尺寸，要求撑满屏幕，不能有滚动条，此时若换个屏幕

此时需要考虑小元素用 vh, 宽和高都用 vh 去表示，中间的大块去自适应，这就做到了大屏的适配，屏幕变小了，整体变小了（体验更好），中间这块撑满了屏幕

对于更复杂的场景，需要更灵活考虑，没有一种适配方式可以囊括所有场景。
