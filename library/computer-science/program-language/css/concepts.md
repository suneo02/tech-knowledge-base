# CSS 概念


## BFC

得分点 块级格式化上下文、独立的渲染区域、不会影响边界以外的元素、形成BFC条件、float、position、overflow、display

标准回答 BFC(Block Formatting Context)块级格式化上下文，是Web页面一块独立的渲染区域，内部元素的渲染不会影响边界以外的元素。

BFC布局规则

- 内部盒子会在垂直方向，一个接一个地放置。
- Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠。
- 每个盒子（块盒与行盒）的margin box的左边，与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
- BFC的区域不会与float box重叠。
- BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
- 计算BFC的高度时，浮动元素也参与计算。 BFC形成的条件
    - `float`设置成 `left`或 `right`
    - `position`是`absolute` 或者`fixed`
    - `overflow`不是`visible`，为 `auto`、`scroll`、`hidden`
    - `display`是`flex`或者`inline-block` 等

BFC解决能的问题：清除浮动

加分回答

BFC的方式都能清除浮动，但是常使用的清除浮动的BFC方式只有`overflow:hidden` ,原因是使用float或者position方式清除浮动，虽然父级盒子内部浮动被清除了，但是父级本身又脱离文档流了，会对父级后面的兄弟盒子的布局造成影响。如果设置父级为`display:flex` ，内部的浮动就会失效。所以通常只是用`overflow: hidden`清除浮动。

IFC（Inline formatting contexts）：内联格式上下文。IFC的高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)，IFC中的line box一般左右都贴紧整个IFC，但是会因为float元素而扰乱。

GFC（GridLayout formatting contexts）：网格布局格式化上下文。当为一个元素设置display值为grid的时候，此元素将会获得一个独立的渲染区域。

FFC（Flex formatting contexts）：自适应格式上下文。display值为flex或者inline-flex的元素将会生成自适应容器

## 继承相关

css的继承：就是给父级设置一些属性，子级继承了父级的该属性，这就是我们的css中的继承。 官方解释，继承是一种规则，它允许样式不仅应用于特定的html标签元素，而且应用于其后代元素。

**无继承性的属性**

1、display：规定元素应该生成的框的类型

2、文本属性：

vertical-align：垂直文本对齐

text-decoration：规定添加到文本的装饰

text-shadow：文本阴影效果

white-space：空白符的处理

unicode-bidi：设置文本的方向

3、盒子模型的属性：width、height、margin 、margin-top、margin-right、margin-bottom、margin-left、border、 border-style、border-top-style、border-right-style、border-bottom-style、border-left-style、border-width、border-top-width、border-right-right、border-bottom-width、border-left-width、border-color、border-top-color、border-right-color、border-bottom-color、border-left-color、border-top、border-right、border-bottom、border-left、padding、padding-top、padding-right、padding-bottom、padding-left

4、背景属性：background、background-color、background-image、background-repeat、background-position、background-attachment

5、定位属性：float、clear、position、top、right、bottom、left、min-width、min-height、max-width、max-height、overflow、clip、z-index

6、生成内容属性：content、counter-reset、counter-increment

7、轮廓样式属性：outline-style、outline-width、outline-color、outline

8、页面样式属性：size、page-break-before、page-break-after

9、声音样式属性：pause-before、pause-after、pause、cue-before、cue-after、cue、play-during

**有继承性的属性**

1、字体系列属性

font：组合字体

font-family：规定元素的字体系列

font-weight：设置字体的粗细

font-size：设置字体的尺寸

font-style：定义字体的风格

font-variant：设置小型大写字母的字体显示文本，这意味着所有的小写字母均会被转换为大写，但是所有使用小型大写 字体的字母与其余文本相比，其字体尺寸更小。

font-stretch：对当前的 font-family 进行伸缩变形。所有主流浏览器都不支持。

font-size-adjust：为某个元素规定一个 aspect 值，这样就可以保持首选字体的 x-height。

2、文本系列属性

text-indent：文本缩进

text-align：文本水平对齐

line-height：行高

word-spacing：增加或减少单词间的空白（即字间隔）

letter-spacing：增加或减少字符间的空白（字符间距）

text-transform：控制文本大小写

direction：规定文本的书写方向

color：文本颜色 a元素除外

3、元素可见性：visibility

4、表格布局属性：caption-side、border-collapse、border-spacing、empty-cells、table-layout

5、列表布局属性：list-style-type、list-style-image、list-style-position、list-style

6、生成内容属性：quotes

7、光标属性：cursor

8、页面样式属性：page、page-break-inside、windows、orphans

9、声音样式属性：speak、speak-punctuation、speak-numeral、speak-header、speech-rate、volume、voice-family、 pitch、pitch-range、stress、richness、、azimuth、elevation

**所有元素可以继承的属性**

1. 元素可见性：visibility
2. 光标属性：cursor

**内联元素可以继承的属性**

1. 字体系列属性
2. 除text-indent、text-align之外的文本系列属性

**块级元素可以继承的属性**

1. text-indent、text-align

## css预处理工具

**参考答案**：

**CSS 预处理器**是一个能让你通过预处理器自己独有的语法来生成CSS的程序。

css预处理器种类繁多，三种主流css预处理器是Less、Sass（Scss）及Stylus；它们各自的背景如下:

Sass：

2007年诞生，最早也是最成熟的CSS预处理器，拥有ruby社区的支持和compass这一最强大的css框架，目前受LESS影响，已经进化到了全面兼容CSS的SCSS（SCSS 需要使用分号和花括号而不是换行和缩进）。

Less：

2009年出现，受SASS的影响较大，但又使用CSS的语法，让大部分开发者和设计师更容易上手，在ruby社区之外支持者远超过SASS。其缺点是比起SASS来，可编程功能不够。优点是简单和兼容CSS，反过来也影响了SASS演变到了SCSS的时代，著名的Twitter Bootstrap就是采用LESS做底层语言的。

Stylus：

2010年产生，来自Node.js社区，主要用来给Node项目进行CSS预处理支持，在此社区之内有一定支持者，在广泛的意义上人气还完全不如SASS和LESS。

**比较**

在使用 CSS 预处理器之前最重要的是理解语法，幸运的是基本上大多数预处理器的语法跟 CSS 都差不多。

首先 Sass 和 Less 都使用的是标准的 CSS 语法，因此如果可以很方便的将已有的 CSS 代码转为预处理器代码，默认 Sass 使用 .sass 扩展名，而 Less 使用 .less 扩展名。

```css
h1 {    color: #0982C1;}
```

这是一个再普通不过的，不过 Sass 同时也支持老的语法，就是不包含花括号和分号的方式：

```css
h1color: #0982c1
```

而 Stylus 支持的语法要更多样性一点，它默认使用 .styl 的文件扩展名，下面是 Stylus 支持的语法

```css
/* style.styl */h1 {    color: #0982C1;}/* omit brackets */h1color: #0982C1;/* omit colons and semi-colons */h1color #0982C1
```

可以在同一个样式单中使用不同的变量，例如下面的写法也不会报错：

```css
h1 {    color #0982c1}h2font-size:1.2em
```

## 行内元素和块级元素什么区别，然后怎么相互转换

**参考答案:**

**块级元素**

1. 总是从新的一行开始，即各个块级元素独占一行，默认垂直向下排列；
2. 高度、宽度、margin及padding都是可控的，设置有效，有边距效果；
3. 宽度没有设置时，默认为100%；
4. 块级元素中可以包含块级元素和行内元素。

**行内元素**

1.和其他元素都在一行，即行内元素和其他行内元素都会在一条水平线上排列；

2.高度、宽度是不可控的，设置无效，由内容决定。

3.根据标签语义化的理念，行内元素最好只包含行内元素，不包含块级元素。

**转换**

当然块级元素与行内元素之间的特性是可以相互转换的。HTML可以将元素分为行内元素、块状元素和行内块状元素三种。

使用display属性能够将三者任意转换：

(1)display:inline;转换为行内元素；

(2)display:block;转换为块状元素；

(3)display:inline-block;转换为行内块状元素。

## 块元素哪些属性可以继承？

**参考答案**：

text-indent、text-align、visibility、cursor

## 盒模型

1. 概念
CSS盒模型本质上是一个盒子，封装周围的HTML元素，它包括：外边距（margin）、边框（border）、内边距（padding）、实际内容（content）四个属性。
2. 标准模型和IE模型
    1. 区别 计算宽度和高度的不同
    - 标准盒模型：盒子总宽度/高度 =width/height + padding + border + margin。（ 即 width/height 只是 内容高度，不包含padding 和 border 值 ） - IE盒子模型：盒子总宽度/高度 =width/height + margin = (内容区宽度/高度 + padding + border) + margin。（ 即width/height 包含了padding 和 border 值 ）
    1. CSS如何设置这两种模型
        - 标准：box-sizing: content-box;( 浏览器默认设置 )
        - IE：box-sizing: border-box;
    2. JS如何获取盒模型对应的宽和高
        1. dom.style.width/height只能取到行内样式的宽和高，style 标签中和 link 外链的样式取不到。
        2. dom.currentStyle.width/height（只有IE兼容）取到的是最终渲染后的宽和高
        3. window.getComputedStyle(dom).width/height同（2）但是多浏览器支持，IE9 以上支持。
        4. dom.getBoundingClientRect().width/height也是得到渲染后的宽和高，大多浏览器支持。IE9 以上支持，除此外还可以取到相对于视窗的上下左右的距离。
        5. dom.offsetWidth/offsetHeight包括高度（宽度）、内边距和边框，不包括外边距。最常用，兼容性最好。
3. BFC（边距重叠解决方案）
    
    5.1 BFC基本概念
    
    **BFC: 块级格式化上下文** BFC基本概念：BFC是CSS布局的一个概念，是一块独立的渲染区域，是一个环境，里面的元素不会影响到外部的元素 。 父子元素和兄弟元素边距重叠，重叠原则取最大值。空元素的边距重叠是取margin与 padding 的最大值。
    
    5.2 BFC原理（渲染规则|布局规则）：
    
    （1）内部的Box会在垂直方向，从顶部开始一个接着一个地放置； （2）Box垂直方向的距离由margin(外边距)决定，属于同一个BFC的两个相邻Box的margin会发生重叠； （3）每个元素的margin Box的左边， 与包含块border Box的左边相接触，（对于从左到右的格式化，否则相反）。即使存在浮动也是如此； （4）BFC 在页面上是一个隔离的独立容器，外面的元素不会影响里面的元素，反之亦然。文字环绕效果，设置float； （5）BFC 的区域不会与float Box重叠（清浮动）; （6）计算BFC的高度时，浮动元素也参与计算。
    
    5.3 CSS在什么情况下会创建出BFC（即脱离文档流）
    
    0、根元素，即 HTML 元素（最大的一个BFC） 1、浮动（float 的值不为 none） 2、绝对定位元素（position 的值为 absolute 或 fixed） 3、行内块（display 为 inline-block） 4、表格单元（display 为 table、table-cell、table-caption、inline-block 等 HTML 表格相关的属性) 5、弹性盒（display 为 flex 或 inline-flex） 6、默认值。内容不会被修剪，会呈现在元素框之外（overflow 不为 visible）
    
    5.4 BFC作用（使用场景）
    
    1、自适应两（三）栏布局（避免多列布局由于宽度计算四舍五入而自动换行） 2、避免元素被浮动元素覆盖 3、可以让父元素的高度包含子浮动元素，清除内部浮动（原理：触发父div的BFC属性，使下面的子div都处在父div的同一个BFC区域之内） 4、去除边距重叠现象，分属于不同的BFC时，可以阻止margin重叠
    
4. IFC
    
    6.1 IFC基本概念
    
    **IFC: 行内格式化上下文** IFC基本概念：
    
    ![](https://www.notion.socss.assets/CC01CC5BF7B84B6F99B134A44179B21D.png)
    
    img
    

6.2 IFC原理（渲染规则|布局规则）：

（1）内部的Box会在水平方向，从含块的顶部开始一个接着一个地放置； （2）这些Box之间的水平方向的margin，border和padding都有效； （3）Box垂直对齐方式：以它们的底部、顶部对齐，或以它们里面的文本的基线（baseline）对齐（默认， 文本与图片对其），例：line-heigth与vertical-align。

## 样式优先级

样式类型

样式类型分为三类

1. 行间

```xml
<h1 style="font-size:12px;color:#000;">我的行间CSS样式。</h1>
```

1. 内联

```xml
<style type="text/css">    h1{font-size:12px;    color:#000;    }</style>
```

1. 外部

```xml
<link rel="stylesheet" href="css/style.css">
```

选择器类型

- ID #id
- class .class
- 标签 p
- 通用*
- 属性[type=“text”]
- 伪类:hover
- 伪元素::first-line
- 子选择器、相邻选择器

权重计算规则

第一等：代表内联样式，如: style=””，权值为1000。 第二等：代表ID选择器，如：#content，权值为0100。 第三等：代表类，伪类和属性选择器，如.content，权值为0010。 第四等：代表类型选择器和伪元素选择器，如div p，权值为0001。 通配符、子选择器、相邻选择器等的。如*、>、+,权值为0000。 继承的样式没有权值。

比较规则

遵循如下法则：

- 选择器都有一个权值，权值越大越优先；
- 当权值相等时，后出现的样式表设置要优于先出现的样式表设置；
- 创作者的规则高于浏览者：即网页编写者设置的 CSS 样式的优先权高于浏览器所设置的样式；
- 继承的 CSS 样式不如后来指定的 CSS 样式；
- 在同一组属性设置中标有!important规则的优先级最大
- 通配符、子选择器、相邻选择器等的。虽然权值为0000，但是也比继承的样式优先。

！important

1. !important 的作用是提升优先级，换句话说。加了这句的样式的优先级是最高的（比内联样式的优先级还高)。

```html
<style>    p{    color:red !important;    }</style><p style="color:blue;">我显示红色</p>
```

1. ie7+和别的浏览器对important的这种作用的支持度都很好。只有ie6有些bug

```cpp
p{      color:red !important;      color:blue; }//会显示blue
```

但是这并不说明ie6不支持important，只是支持上有些bug。看下面

```cpp
p{     color:red !important;}p{    color:blue;} //这样就会显示的是red。说明ie6还是支持important的。</pre>
```

## 盒子塌陷是什么？

**盒子塌陷**

本应该在父盒子内部的元素跑到了外部。

**关于盒子塌陷的几种解决方法**

1. 最简单，直接，粗暴的方法就是盒子大小写死，给每个盒子设**定固定的width和height** ，直到合适为止，这样的好处是简单方便，兼容性好，适合只改动少量内容不涉及盒子排布的版面。缺点是非自适应，浏览器的窗口大小直接影响用户体验。
2. 给外部的父盒子也添加浮动，让其也脱离标准文档流，这种方法方便，但是对页面的布局不是很友好，不易维护。
3. 给父盒子添加overflow属性。
    - overflow:auto; 有可能出现滚动条，影响美观。
    - overflow:hidden; 可能会带来内容不可见的问题。
4. 父盒子里最下方引入清除浮动块。最简单的有：
    
    ```html
    <br style="clear:both;"/>
    ```
    
    有很多人是这么解决的，但是我们并不推荐，因为其引入了不必要的冗余元素 。
    
5. 用after伪元素清除浮动 给外部盒子的after伪元素设置clear属性，再隐藏它 这其实是对空盒子方案的改进，一种纯CSS的解决方案，不用引入冗余元素。
    
    ```html
    .clearfix {    *zoom: 1;}.clearfix:before, .clearfix:after {    display: table;    line-height: 0;    content: "";}.clearfix:after {    clear: both;}
    ```
    
    这也是bootstrap框架采用的清除浮动的方法。 这是一种纯CSS的解决浮动造成盒子塌陷方法，没有引入任何冗余元素，推荐使用此方法来解决CSS盒子塌陷。 备注：第五种方法虽好，但是低版本IE不兼容，具体选择哪种解决方法，可根据实际情况决定。
    
6. 给父盒子添加border
7. 给父盒子设置padding-top

## 为什么会出现盒子塌陷？

当父元素没设置足够大小的时候，而子元素设置了浮动的属性，子元素就会跳出父元素的边界（脱离文档流），尤其是当父元素的高度为auto时，而父元素中又没有其它非浮动的可见元素时，父盒子的高度就会直接塌陷为零， 我们称这是**CSS高度塌陷**。

## css 伪类与伪元素区别

1. 伪类(pseudo-classes)
- 其核⼼就是⽤来选择DOM树之外的信息,不能够被普通选择器选择的⽂档之外的元素，⽤来添加⼀些选择器的特殊效果。
- ⽐如:hover :active :visited :link :visited :first-child :focus :lang等
- 由于状态的变化是⾮静态的，所以元素达到⼀个特定状态时，它可能得到⼀个伪类的样式；当状态改变时，它⼜会失去这个样式。
- 由此可以看出，它的功能和class有些类似，但它是基于⽂档之外的抽象，所以叫 伪类。
1. 伪元素(Pseudo-elements)
- DOM树没有定义的虚拟元素
- 核⼼就是需要创建通常不存在于⽂档中的元素，
- ⽐如::before ::after 它选择的是元素指定内容，表示选择元素内容的之前内容或之后内容。
- 伪元素控制的内容和元素是没有差别的，但是它本身只是基于元素的抽象，并不存在于⽂档中，所以称为伪元素。⽤于将特殊的效果添加到某些选择器
1. 伪类与伪元素的区别
- 表示⽅法
    - CSS2 中伪类、伪元素都是以单冒号:表示,
    - CSS2.1 后规定伪类⽤单冒号表示,伪元素⽤双冒号::表示，
    - 浏览器同样接受 CSS2 时代已经存在的伪元素(:before, :after, :first-line, :first-letter 等)的单冒号写法。
    - CSS2 之后所有新增的伪元素(如::selection)，应该采⽤双冒号的写法。
    - CSS3中，伪类与伪元素在语法上也有所区别，伪元素修改为以::开头。浏览器对以:开头的伪元素也继续⽀持，但建议规范书写为::开头
- 定义不同
    - 伪类即假的类，可以添加类来达到效果
    - 伪元素即假元素，需要通过添加元素才能达到效果
- 总结:
    - 伪类和伪元素都是⽤来表示⽂档树以外的“元素”。
    - 伪类和伪元素分别⽤单冒号:和双冒号::来表示。
    - 伪类和伪元素的区别，关键点在于如果没有伪元素(或伪类)，
    - 是否需要添加元素才能达到效果，如果是则是伪元素，反之则是伪类
    - 伪类和伪元素都不出现在源⽂件和DOM树中。也就是说在html源⽂件中是看不到伪类和伪元素的。
    - 伪类其实就是基于普通DOM元素⽽产⽣的不同状态，他是DOM元素的某⼀特征。
    - 伪元素能够创建在DOM树中不存在的抽象对象，⽽且这些抽象对象是能够访问到的。

## 行内元素的margin 和 padding

- 水平方向：水平方向上，都有效；
- 垂直方向：垂直方向上，都无效；（padding-top和padding-bottom会显示出效果，但是高度不会撑开，不会对周围元素有影响）

## min-width/max-width 和 min-height/max-height 属性间的覆盖规则？

**参考答案**：

1. max-width 会覆盖 width，即使 width 是行内样式或者设置了 !important。
2. min-width 会覆盖 max-width，此规则发生在 min-width 和 max-width 冲突的时候；

## 浏览器是怎样解析CSS选择器的？

**参考答案**：

CSS选择器的解析是从右向左解析的。若从左向右的匹配，发现不符合规则，需要进行回溯，会损失很多性能。若从右向左匹配，先找到所有的最右节点，对于每一个节点，向上寻找其父节点直到找到根元素或满足条件的匹配规则，则结束这个分支的遍历。两种匹配规则的性能差别很大，是因为从右向左的匹配在第一步就筛选掉了大量的不符合条件的最右节点( 叶子节点)，而从左向右的匹配规则的性能都浪费在了失败的查找上面。而在 CSS解析完毕后,需要将解析的结果与DOM Tree的内容-起进行分析建立-棵Render Tree，最终用来进行绘图。在建立Render Tree时(WebKit 中的「Attachment」过程)， 浏览器就要为每个DOM Tree中的元素根据CSS的解析结果(Style Rules)来确定生成怎样的Render Tree。
