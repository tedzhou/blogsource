---
layout: post
title: "touch上点击相关的东西"
date: 2013-10-28 14:10
comments: true
categories: 
---
# 总结一下这一年来做touch开发遇到的“点击问题”

做了一年的`touch`，光遇到点击相关的坑就不少，这里做个简单的小结。部分内容已经是博客里面有讲过的了，再简单提下好了。

## 元素太小touch*事件不触发

这个问题以前[有讲过](http://tedzhou.github.io/blog/2012/12/22/tap/)

可点击区域小于`14px（经验值）`的时候，`touchstart`/`touchmove`/`touchend`这些事件统统不会触发。而`click`事件没有影响。

解决方法其实也很简单，把元素搞大，或者用`click`事件。
注意的是`click`会比`touchend`慢`300ms`。

## 点击穿透问题

这个问题也[有讲过](http://tedzhou.github.io/blog/2013/05/21/tapclick/)。

我们知道`tap`事件其实是自定义事件，`zepto`的实现是在`touchstart`和`touchend`后触发`tap`。目的是当在同一个元素上触发了`touchstart`和`touchend`，我们就可以认为用户点一下这个元素，而`click`事件要在此后的`300ms`才触发。所以在`touch`项目中，我们一般用`tap`来代替`click`，要的就是快。

按理说使用`tap`是优化，但这个优化也带来代价。因为`webkit`有个这样的逻辑(我个人还是认为是`bug`啦)，当用户`tap`后，过了`300ms`在用户`tap`的位置触发一个`click`事件，坑爹的地方在于，即使`tap`的`taget`(可以认为是`touchstart`的 `target`)和`click`的`target`不是同一个对象，`click`一样触发。

这里坑就大了嘛。我`tap`了一个按钮A，在绑定的事件里面改变了`dom`，页面变化了，原来`tap`的位置变成了**另外一个按钮B**。这时，这个按钮B就被`click`了。

解决方法:

1. 如果页面`dom`要变化，建议用`click`，不过慢`300ms`.
2. 你也当然可以`tap`后`300ms`再变换`dom`，不过就没啥意义了。
3. 在`tap`后往`body`上绑定`captured`的`click`事件，`300ms`内触发的`click`事件如果`target`和`tap`的不一样，`preventDefault+stopPopagation`。

这里要注意一点，（之前的blog没讲)。关于方法3，还有要注意的是，如果后面的`click`要是`target`是`input`、`textarea`、`a`，`preventDefault`可以阻止掉它的`click`，但是阻止不了他们的`activeBehaviour`,也就是`textarea`会被`focus`。

## ios 非clickable元素click不了

这里其实大家都知道了, 上面两个问题让我们更多地选择用`click`，但是ios的`click`不太好用就是了。

看代码，下面那个按钮怎么点都没用

```html
    <p id="p">假按钮</p>
    <script>
        document.getElementById('p').addEventListener('click', function(){
            alert(1)
        })
    </script>
```

因为`ios`说`<p>`本来就是不可点的，如果要可点，就要给他加上`onclick`属性。所以把代码给成`<p id="p" onclick>假按钮</p>`就好了。


## ios7 一个非常诡异的问题

请有ios7的打开这个[demo](http://tedzhou.github.io/demo/ios7sucks.html), 点击那个黄色的`<p onclick>`的元素，然后页面同样的位置会出现一个`textarea`。然后点击这个`textarea`, ios7的浏览器会挂掉大概20秒, 直到20s输入法出来后才正常。

这个坑非常奇怪，尝试了有几个解决方法:

### 改页面结构

请看页面的源代码，我再页面最前生成了很多元素，如果把页面元素减少，卡顿的时间也会减少。如果把这10000个元素放在`textarea`后面，无论元素再多也不卡顿。这事非常神奇，无法解释。


```html
<script>
// create 10000 use less divs
var str = '';
for (var i = 0; i < 10000; i++) {
    str += '<div></div>';
}
document.getElementById('uselessDiv').innerHTML = str;
</script>

```

### 用`<button/>`

如果把`<p onclick>`改成`button`，这个问题也可以解决。


这就非常坑了，反正给苹果提bug了。

这里考虑了几个点:

1.  这里你不能用`tap`来代替`click`，首先，`tap`会穿透；即使`tap`不穿透，后面再`click`那个`textarea`还是会卡住。

2.  你不能把`<p>`里面的`onclick`干掉，否则就`click`不了。
3.  页面元素不是想少就能少的了。

所以，还是得用`<button/>`

# 结论
1. 尽量用`click`，慢那`300ms`和修这些坑比起来算什么。
2. 能点的东西还是用`button`比较安全，至少苹果能测一下。






