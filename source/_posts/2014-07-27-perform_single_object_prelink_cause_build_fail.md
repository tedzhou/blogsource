title: 设置"Perform Single-Object Prelink“导致编译失败
date: 2014-07-27 12:25:47
tags: xcode
---

## Verify final result code for completed build operation

前段时间我在做一个代码重构的项目中发现一个Xcode奇怪的bug，我们往静态库里面加入了2000多个Objcetive C的class（工具生成），每个class一对.h.m文件，编译时XCode报错:

```
Verify final result code for completed build operation

Build operation failed without specifying any errors. Individual build tasks may have failed for unknown reasons. Some of these (up to 12) may be listed below.

```

当时定位出可能和文件数量有关，减少文件数量后错误解决。但我自己的新建了个工程，文件比这个工程多也没有问题，想必还有其他因素导致的。

我考虑了很多可能引起问题的因素，包括依赖太复杂，可能分析dependences的时候文件多爆了栈，也怀疑是某些编译选项导致的。最后才定位出是在`Perform Single-Object Prelink` 设为yes的时候，文件不能过多。

## "Perform Single-Object Prelink" 干嘛用的

去查这个选项干嘛用的过程中还是有不少收获的。要解释这个选项要从Objective-C的一个坑爹bug开始讲起。

### categories in static library

xcode编译的时候不会把静态库里面全部的类都加载进去，它会找主工程用到了哪些符号，然后把用到的加载进去。但是这个看起来很美的机制有个大坑，就是oc的分类是不生成符号的，也就是说，比如你在工程用了一个分类的方法`[NSString categoryMethod]`, 编译器只会认为需要用到`NSString`, 而不知道`categoryMethod`是静态库里一个分类的方法，所以不会去加载静态库的分类。

目前的解决方法就是给编译器一个标志，告诉编译器整个静态库都要加载:
1.  `-all-load`. 把所有静态库里的所有.o都加载
2.  `-force_load`. 可以指定加载哪个静态库的所有.o
3.  `-ObjC`. 把所有OC代码都加载。
4.  `Perform Single-Object Prelink`. 前3个编译选项都是设在主工程的，这个选项是设置在静态库的。表示把这个子工程预编译成一个.o文件，当整个静态库有一个符号被引用就把整个.o文件打包进去。

可能是`Perform Single-Object Prelink`的实现有bug，文件多了就挂了。

### 包大小

可能我们公司是整个互联网最关心安装包大小的公司了，明显以上的所有方法都是会增加包大小的。我接下来要做的事情就是把那2000多个类没用的代码干掉。


## 参考

在stackoverflow上有一篇解释category更完成的回答,各位可以参考:
[Objective-C categories in static library][1]


  [1]: http://stackoverflow.com/a/22264650/2882420
