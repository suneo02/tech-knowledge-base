# JavaScript 场景题：算法与工具

## function rand(min, max, N)：生成长度是N，且在min、max内不重复的整数随机数组

把考点拆成了4个小项；需要用递归算法实现： a) 生成一个长度为n的空数组arr。 b) 生成一个（min－max）之间的随机整数rand。 c) 把随机数rand插入到数组arr内，如果数组arr内已存在与rand相同的数字，则重新生成随机数rand并插入到 arr内[需要使用递归实现，不能使用for/while等循环] d) 最终输出一个长度为n，且内容不重复的数组arr。

```jsx
function buildArray(arr, n, min, max) {    var num = Math.floor(Math.random() * (max - min + 1)) + min;    if (!arr.includes(num)) {        arr.push(num);    }    return arr.length === n ? arr : buildArray(arr, n, min, max);}var result = buildArray([], 5, 2, 32);console.table(result);
```


## 字符串中的单词逆序输出（手写）

方法一：

```jsx
function strReverse(str) {    return str.split("").reverse().join("")}
```

方法二：

```jsx
function strReverse(str) {    var i = str.length;    var nstr = "";    i = i - 1;    for (var x = i; x >= 0; x--) {        nstr += str.charAt(x)    }    return nstr}
```

方法三：

```jsx
function strReverse(str) {    if (str.length == 0) return null;    var i = str.length;    var dstr = "";    while (--i >= 0) {        dstr += str.charAt(i);    }    return dstr;}
```

方法四：

```jsx
function strReverse(str) {    return str.split('').reduce((prev, next) => next + prev);}
```

方法五：

```jsx
function strReverse(str) {    var newstr = "";    for (var i = 0; i < str.length; i++) {        newstr = str.charAt(i) + newstr;    }    return newstr}
```

方法六：

```jsx
function strReverse(str) {    if (str.length === 1) {        return str    }    return str.slice(-1) + strReverse(str.slice(0, -1));}
```


## 不重复字符 最长子串 长度

思路分析：

对字符串进行遍历，使用String.prototype.indexOf()实时获取遍历过程中的无重复子串并存放于str，并保存当前状态最长无重复子串的长度为res，当遍历结束时，res的值即为无重复字符的最长子串的长度。

代码示例：

```jsx
/** * @param {string} s * @return {number} */var lengthOfLongestSubstring = function (s) {        var res = 0; // 用于存放当前最长无重复子串的长度        var str = ""; // 用于存放无重复子串        var len = s.length;        for (var i = 0; i < len; i++) {            var char = s.charAt(i);            var index = str.indexOf(char);            if (index === -1) {                str += char;                res = res < str.length ? str.length : res;            } else {                str = str.substr(index + 1) + char;            }        }        return res;    };
```


## 去掉字符串前后的空格

第五种方法在处理长字符串时效率最高

第一种：循环检查替换

```jsx
//供使用者调用function trim(s) {    return trimRight(trimLeft(s));}//去掉左边的空白function trimLeft(s) {    if (s == null) {        return "";    }    var whitespace = new String(" \t\n\r");    var str = new String(s);    if (whitespace.indexOf(str.charAt(0)) != -1) {        var j = 0, i = str.length;        while (j < i && whitespace.indexOf(str.charAt(j)) != -1) {            j++;        }        str = str.substring(j, i);    }    return str;}//去掉右边的空白 www.2cto.comfunction trimRight(s) {    if (s == null) return "";    var whitespace = new String(" \t\n\r");    var str = new String(s);    if (whitespace.indexOf(str.charAt(str.length - 1)) != -1) {        var i = str.length - 1;        while (i >= 0 && whitespace.indexOf(str.charAt(i)) != -1) {            i--;        }        str = str.substring(0, i + 1);    }    return str;}
```

第二种：正则替换

```html
<SCRIPT LANGUAGE="JavaScript">    String.prototype.Trim = function () {        return this.replace(/(^\s*)|(\s*$)/g, "");    }    String.prototype.LTrim = function () {        return this.replace(/(^\s*)/g, "");    }    String.prototype.RTrim = function () {        return this.replace(/(\s*$)/g, "");    }</SCRIPT>
```

第三种：使用jquery

```jsx
$.trim(str)//jquery内部实现为：function trim(str) {    return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');}
```

第四种：使用motools

```jsx
function trim(str) {    return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');}
```

第五种：裁剪字符串方式

```jsx
function trim(str) {    str = str.replace(/^(\s|\u00A0)+/, '');    for (var i = str.length - 1; i >= 0; i--) {        if (/\S/.test(str.charAt(i))) {            str = str.substring(0, i + 1);            break;        }    }    return str;}
```


## 判断输出console.log(0 == [])console.log([1] == [1])

```cpp
console.log([]==[]);  // falseconsole.log([]== 0);  // true
```

解析：

原始值的比较是值的比较： 它们的值相等时它们就相等（==） 对象和原始值不同，对象的比较并非值的比较,而是引用的比较： 即使两个对象包含同样的属性及相同的值，它们也是不相等的 即使两个数组各个索引元素完全相等，它们也是不相等的,所以[]!=[]

[]==0,是数组进行了隐士转换，空数组会转换成数字0，所以相等


## 三数之和

题目描述

给定一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？找出所有满足条件且不重复的三元组。

注意：答案中不可以包含重复的三元组。

```jsx
//例如, 给定数组 nums = [-1, 0, 1, 2, -1, -4]，//满足要求的三元组集合为：[    [-1, 0, 1],    [-1, -1, 2]]
```

解答

这题我们才用排序+双指针的思路来做，遍历排序后的数组，定义指针l和r,分别从当前遍历元素的下一个元素和数组的最后一个元素往中间靠拢，计算结果跟目标对比。

```jsx
var threeSum = function (nums) {    if (nums.length < 3) {        return [];    }    let res = [];    // 排序    nums.sort((a, b) => a - b);    for (let i = 0; i < nums.length; i++) {        if (i > 0 && nums[i] == nums[i - 1]) {            // 去重            continue;        }        if (nums[i] > 0) {            // 若当前元素大于0，则三元素相加之后必定大于0            break;        }        // l为左下标，r为右下标        let l = i + 1;        r = nums.length - 1;        while (l < r) {            let sum = nums[i] + nums[l] + nums[r];            if (sum == 0) {                res.push([nums[i], nums[l], nums[r]]);                while (l < r && nums[l] == nums[l + 1]) {                    l++                }                while (l < r && nums[r] == nums[r - 1]) {                    r--;                }                l++;                r--;            } else if (sum < 0) {                l++;            } else if (sum > 0) {                r--;            }        }    }    return res;};
```
