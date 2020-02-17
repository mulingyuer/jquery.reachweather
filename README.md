
![](https://mulingyuer-1253375624.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87%E7%A9%BA%E9%97%B4/TIM%E6%88%AA%E5%9B%BE20200217164445.jpg)

图是我目前主题使用的样式，但是插件不带任何ui样式，他只有三个参数选项，通过传入的success函数进行天气数据对象的操作。

## 参数

| 参数    | 类型|  说明|
| --------- | -------- | -----: |
| baidukey| string | 百度普通ip定位开发者key |
| amapkey    | string |  高德天气开发者key| 
| success | function |  接受一个参数，该参数为返回的天气数据对象，具体可以查看高德天气说明 |

我们先看下success接受的data是什么东西

![](https://mulingyuer-1253375624.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87%E7%A9%BA%E9%97%B4/jQuery%20%E5%A4%A9%E6%B0%94%E6%8F%92%E4%BB%B6reachweather01.jpg)

可以看到他就是一个键值对的对象，可以通过点方法调用到对应得值。

## 调用方法

```javascript
 $.reachweather({
    baidukey: '百度开发者key',
    amapkey: '高德开发者key',
    success: function (data) {}
  });
```

success对应的匿名函数接受一个参数data，这个就是上面图的天气键值对了。

插件需要两个开发者key，自行申请：

**百度开发者key：**[链接](http://lbsyun.baidu.com/index.php?title=webapi/ip-api)

**高德开发者key：**[链接](https://lbs.amap.com/api/webservice/guide/api/weatherinfo/)

关于天气键值对的定义，在高德开发者key页面可以看到的，自行查询，这里就不重复了。

* * *

## demo

这个就不搞demo了，插件只是获取数据，方法也是自定义。

## 下载

[github](https://github.com/mulingyuer/jquery.reachweather)