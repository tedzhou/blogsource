---
layout: post
title: "Safari 里CSS GPU加速下闪动的bug"
date: 2012-05-05 15:11
comments: true
categories: [mobile， hole]

---

## 背景
主要出现的场景是应用了iscroll后，页面会有各种闪动，主要是下面两种：
1. 页面初始化时闪动
2. 按home键再回到safari

iscroll为了加快滚动速度，使用了会开启gpu加速的属性`-webkit-transform: translateZ(0);`
gpu加速会使webkit单独为这个render tree分配一个compositing
layer，所以网上很多朋友都指出说可能是这个layer太大，导致渲染有bug。提出的解决思路是以毒攻毒，为iscroll下的子元素都设上`-webkit
-transform: translateZ(0);`，让子元素也有自己的layer，单独渲染就不会闪动了。

这个思路确实有用，但是在我们使用场景里面发现一级子元素不闪了，部分孙元素还在闪。然后我们再给孙元素加上，发现还有其他后代元素会闪。
一怒之下，写了个`#scrllor * {-webkit-transform: translateZ(0);}`，
让iscroll下所有的子孙元素都自己搞个layer，那坚决就不闪了。但是这么丑陋的方式有点不能接受，而且每个元素单独一个layer，webkit
需要维护好每个layer，那个可见哪个不可见，也是一个性能隐患点（iphone5性能太好了，没感觉出来）。

所以还是得想办法找出规律。之前和阿子看过另外一个iscroll闪动的问题（插入节点闪烁），就怀疑和高度有关系。

##设计实验

[Demo在这](http://tedzhou.github.com/demo/flicker/test3d.html)
两个纬度排列组合各种条件，这里直接给结论好了:
#### 若父节点有GPU加速，且高度（包括border）小于1280px，不闪。
#### 若父节点有GPU加速，且高度（包括border）大于1280px，父节点闪，子节点分一下情况:
1. 若子节点没有GPU加速，子节点也闪
2. 若子节点有GPU加速，且高度小于1280px,子节点不闪（子节点不闪的部分可以遮挡父节点的闪动）
3. 若子节点有GPU加速，且高度大于1280px,子节点闪

所以结论是，如果一个高于1280px的列表(ul)，那么就要让它的列表项(li)加上GPU加速,且要盖住整个列表，那么列表的闪动会被列表项给挡住。
而且如果列表项本身如果也超过1280px，那就要让他的孙元素盖住它，一直递归下去。

说明一下:1280px这种magic number是我在自己的ip5上的实验值，还没试过其他机器，不能保证每部机都一样。
这种结论还是有些无奈，目前的解决方案基本属于哪里闪往哪里加上`-webkit-transform: translateZ(0); `
归根道理都是iscroll启用了gpu加速导致的，后续研究直接用`position:absolute`来定位，如果性能影响不大，干脆绝对定位好了一了百了。


## 关于layer和GPU加速
#### 如何看layer
如图
{% img /images/layer.jpg %}

#### 怎样让元素单独成layer:
1. It's the root object for the page
2. It has explicit CSS position properties (relative, absolute or a transform)
3. It is transparent
4. Has overflow, an alpha mask or reflection
5. Has a CSS filter
6. Corresponds to `<canvas>` element that has a 3D (WebGL) context or an accelerated 2D context
7. Corresponds to a `<video>` element

#### layer怎么开GPU加速:

1. Layer has 3D or perspective transform CSS properties
2. Layer is used by `<video>` element using accelerated video decoding
3. Layer is used by a `<canvas>` element with a 3D context or accelerated 2D context
4. Layer is used for a composited plugin
5. Layer uses a CSS animation for its opacity or uses an animated webkit transform
6. Layer uses accelerated CSS filters
7. Layer has a descendant that is a compositing layer
8. Layer has a sibling with a lower z-index which has a compositing layer (in otherwords the layer is rendered on top of a composited layer)

[参考 GPU Accelerated Compositing in Chrome](http://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome)