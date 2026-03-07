# JavaScript 场景题：数据处理

## js中两个数组怎么取交集+(差集、并集、补集)

1. 最普遍的做法
    
    使用 **ES5** 语法来实现虽然会麻烦些，但兼容性最好，不用考虑浏览器 **JavaScript** 版本。也不用引入其他第三方库。
    
    直接使用 filter、concat 来计算
    
    ```jsx
    var a = [1,2,3,4,5]var b = [2,4,6,8,10]//交集var c = a.filter(function(v){ return b.indexOf(v) > -1 })//差集var d = a.filter(function(v){ return b.indexOf(v) == -1 })//补集var e = a.filter(function(v){ return !(b.indexOf(v) > -1) })        .concat(b.filter(function(v){ return !(a.indexOf(v) > -1)}))//并集var f = a.concat(b.filter(function(v){ return !(a.indexOf(v) > -1)}));
    ```
    
    对 Array 进行扩展
    
    ```jsx
    //数组功能扩展//数组迭代函数Array.prototype.each = function(fn){  fn = fn || Function.K;   var a = [];   var args = Array.prototype.slice.call(arguments, 1);   for(var i = 0; i < this.length; i++){       var res = fn.apply(this,[this[i],i].concat(args));       if(res != null) a.push(res);   }   return a;};//数组是否包含指定元素Array.prototype.contains = function(suArr){  for(var i = 0; i < this.length; i ++){      if(this[i] == suArr){          return true;      }   }   return false;}//不重复元素构成的数组Array.prototype.uniquelize = function(){   var ra = new Array();   for(var i = 0; i < this.length; i ++){      if(!ra.contains(this[i])){          ra.push(this[i]);      }   }   return ra;};//两个数组的交集Array.intersect = function(a, b){   return a.uniquelize().each(function(o){return b.contains(o) ? o : null});};//两个数组的差集Array.minus = function(a, b){   return a.uniquelize().each(function(o){return b.contains(o) ? null : o});};//两个数组的补集Array.complement = function(a, b){   return Array.minus(Array.union(a, b),Array.intersect(a, b));};//两个数组并集Array.union = function(a, b){   return a.concat(b).uniquelize();};
    ```
    
2. 使用 ES6 语法实现
    
    **ES6** 中可以借助扩展运算符（**…**）以及 **Set** 的特性实现相关计算，代码也会更加简单些。
    
    ```jsx
    var a = [1,2,3,4,5]var b = [2,4,6,8,10]console.log("数组a：", a);console.log("数组b：", b);var sa = new Set(a);var sb = new Set(b);// 交集let intersect = a.filter(x => sb.has(x));// 差集let minus = a.filter(x => !sb.has(x));// 补集let complement  = [...a.filter(x => !sb.has(x)), ...b.filter(x => !sa.has(x))];// 并集let unionSet = Array.from(new Set([...a, ...b]));
    ```
    
3. 使用 jQuery 实现
    
    ```jsx
    var a = [1,2,3,4,5]var b = [2,4,6,8,10]console.log("数组a：", a);console.log("数组b：", b);// 交集let intersect = $(a).filter(b).toArray();// 差集let minus = $(a).not(b).toArray();// 补集let complement  = $(a).not(b).toArray().concat($(b).not(a).toArray());// 并集let unionSet = $.unique(a.concat(b));
    ```
    


## 用正则和非正则实现123456789.12=》1，234，567，890.12

非正则：

如果数字带有小数点的话，可以使用toLocaleString()方法实现这个需求。

```jsx
b.toLocaleString();
```

正则：

1. 不带小数点
    
    ```jsx
    num.toString().replace(/(\d)(?=(?:\d{3})+$)/g,'$1,')
    ```
    
2. 带小数点
- 判读是否带有小数点
- 没有小数点，就用正则匹配实

```jsx
function numFormat(num) {    var c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() :        num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');    return c;}
```


## 写一个判断是否是空对象的函数

```jsx
function isEmpty(value) {    return (        value === null || value === undefined ||        (typeof value === 'object' && Object.keys(value).length === 0)    )}
```


## 代码题：颜色值16进制转10进制rgb

```jsx
function toRGB(color) {    var regex = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/ //匹配十六进制的正则    match = color.match(regex)  // 判断是否是十六进制颜色值    return match ? 'rgb(' + parseInt(match[1], 16) + ',' + parseInt(match[2], 16) + ',' + parseInt(match[3], 16) + ')' : color}
```


## flattern

**递归**

我们最一开始能想到的莫过于循环数组元素，如果还是一个数组，就递归调用该方法：

```jsx
var arr = [1, [2, [3, 4]]];

function flatten(arr) {
    var result = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        if (Array.isArray(arr[i])) {
            result = result.concat(flatten(arr[i]))
        } else {
            result.push(arr[i])
        }
    }
    return result;
}

console.log(flatten(arr))
```

**toString**

如果数组的元素都是数字，那么我们可以考虑使用 toString 方法，因为：

```jsx
[1, [2, [3, 4]]].toString() // "1,2,3,4"
```

调用 toString 方法，返回了一个逗号分隔的扁平的字符串，这时候我们再 split，然后转成数字不就可以实现扁平化了吗？

```jsx
var arr = [1, [2, [3, 4]]];

function flatten(arr) {
    return arr.reduce(function (prev, next) {
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    }, [])
}

console.log(flatten(arr))
```

然而这种方法使用的场景却非常有限，如果数组是 [1, ‘1’, 2, ‘2’] 的话，这种方法就会产生错误的结果。

**reduce**

既然是对数组进行处理，最终返回一个值，我们就可以考虑使用 reduce 来简化代码：

```jsx
var arr = [1, [2, [3, 4]]];

function flatten(arr) {
    return arr.reduce(function (prev, next) {
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    }, [])
}

console.log(flatten(arr))
```

**…**

ES6 增加了扩展运算符，用于取出参数对象的所有可遍历属性，拷贝到当前对象之中：

```jsx
var arr = [1, [2, [3, 4]]];
console.log([].concat(...arr)); // [1, 2, [3, 4]]
```

我们用这种方法只可以扁平一层，但是顺着这个方法一直思考，我们可以写出这样的方法：

```jsx
var arr = [1, [2, [3, 4]]];

function flatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}

console.log(flatten(arr))
```

**undercore**

那么如何写一个抽象的扁平函数，来方便我们的开发呢，所有又到了我们抄袭 underscore 的时候了~

在这里直接给出源码和注释，但是要注意，这里的 flatten 函数并不是最终的 _.flatten，为了方便多个 API 进行调用，这里对扁平进行了更多的配置。

```jsx
/** 数组扁平化
 * @param {Array} input   要处理的数组
 * @param {boolean} shallow 是否只扁平一层
 * @param  {boolean} strict  是否严格处理元素，下面有解释
 * @param  {Array} output  这是为了方便递归而传递的参数
 * 源码地址：https://github.com/jashkenas/underscore/blob/master/underscore.js#L528
 */
function flatten(input, shallow, strict, output) {
    // 递归使用的时候会用到output 
    output = output || [];
    var idx = output.length;
    for (var i = 0, len = input.length; i < len; i++) {
        // 如果是数组，就进行处理
        var value = input[i];
        if (Array.isArray(value)) {
            // 如果是只扁平一层，遍历该数组，依此填入 output
            if (shallow) {
                var j = 0, length = value.length;
                while (j < length) {
                    output[idx++] = value[j++];
                }
            } else {// 如果是全部扁平就递归，传入已经处理的 output，递归中接着处理 output       
                flatten(value, shallow, strict, output);
                idx = output.length;
            }
        } else if (!strict) {// 不是数组，根据 strict 的值判断是跳过不处理还是放入 output    
            output[idx++] = value;
        }
    }
    return output;
}
```

解释下 strict，在代码里我们可以看出，当遍历数组元素时，如果元素不是数组，就会对 strict 取反的结果进行判断，如果设置 strict 为 true，就会跳过不进行任何处理，这意味着可以过滤非数组的元素，举个例子：

```jsx
var arr = [1, 2, [3, 4]];console.log(flatten(arr, true, true)); // [3, 4]
```

那么设置 strict 到底有什么用呢？不急，我们先看下 shallow 和 strct 各种值对应的结果：

- shallow true + strict false ：正常扁平一层
- shallow false + strict false ：正常扁平所有层
- shallow true + strict true ：去掉非数组元素
- shallow false + strict true ： 返回一个[]

我们看看 underscore 中哪些方法调用了 flatten 这个基本函数：

- *_.flatten**

首先就是 _.flatten：

```jsx
_.flatten = function (array, shallow) {    return flatten(array, shallow, false);};
```

在正常的扁平中，我们并不需要去掉非数组元素。

- *_.union**

接下来是 _.union：

该函数传入多个数组，然后返回传入的数组的并集，

举个例子：

```jsx
_.union([1, 2, 3], [101, 2, 1, 10], [2, 1]);=>[1, 2, 3, 101, 10]
```

如果传入的参数并不是数组，就会将该参数跳过：

```jsx
_.union([1, 2, 3], [101, 2, 1, 10], 4, 5);=>[1, 2, 3, 101, 10]
```

为了实现这个效果，我们可以将传入的所有数组扁平化，然后去重，因为只能传入数组，这时候我们直接设置 strict 为 true，就可以跳过传入的非数组的元素。

```jsx
// 关于 unique 可以查看《JavaScript专题之数组去重》[](https://github.com/mqyqingfeng/Blog/issues/27)function unique(array) {    return Array.from(new Set(array));}_.union = function () {    return unique(flatten(arguments, true, true));}
```

- *_.difference**

是不是感觉折腾 strict 有点用处了，我们再看一个 _.difference：

语法为：

```jsx
_.difference(array, * others)
```

效果是取出来自 array 数组，并且不存在于多个 other 数组的元素。跟 _.union 一样，都会排除掉不是数组的元素。

举个例子：

```jsx
_.difference([1, 2, 3, 4, 5], [5, 2, 10], [4], 3);=>[1, 3]
```

实现方法也很简单，扁平 others 的数组，筛选出 array 中不在扁平化数组中的值：

```jsx
function difference(array, ...rest) {    rest = flatten(rest, true, true);    return array.filter(function (item) {        return rest.indexOf(item) === -1;    })}
```
