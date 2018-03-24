# citySelect
citySelect是面向于PC端的一款基于JQuery的、整体功能都比较完善的拼音分类和集成搜索功能的城市选择插件。

## Version
>* 1.0.4

## Support
>* Internet Explorer 8+
>* Chrome for PC
>* Safari for PC
>* Firefox for PC

## Integrations
>* 支持拼音、名称模糊搜索功能
>* 可以键盘操作选择
>* 可以单选、多选模式切换
>* 可以修改热门城市

## Options

|名称|类型|默认|描述|
| ----- | ----- | ---- | ---- |
|dataJson|[Array]|默认空|城市数据源|
|convert|[Boolean]|true(转换)|转换数据，引入的数据源是citydata.js就需要转换；引入的是newcitydata.js就不需要|
|whole|[Boolean]|false(市级)|如果开启这个，需要引入的是citydata.js数据源才可以。显示市县级数据还是只显示市级数据|
|shorthand|[Boolean]|false(全称)|名称的全称、简称|
|multiSelect|[Boolean]|false(单选)|多选、单选|
|search|[Boolean]|true(搜索)|开启搜索|
|multiMaximum|[Number]|5(最多可选5个城市)|最多可选的城市个数(多选)|
|multiType|[Number]|0(多行)|值允许1或者0；只用于多选，选中的值显示是一行还是多行|
|placeholder|[String]|'请选择城市'|默认的提示语|
|searchPlaceholder|[String]|'输入关键词搜索'|搜索文本框默认的提示语|
|hotCity|[Array]| [] (取前面18条数据) |热门城市显示数据，传就生成热门城市，没有就插件生成|
|onInit|[function]|function () {}|插件初始化后的回调|
|onForbid|[function]|function () {}|插件禁止后再点击的回调|
|onTabsAfter|[function]|function (target) {}|点击tabs切换显示城市后的回调|
|onTabsForbid|[function]|function (target) {}|tabs禁止后再点击的回调|
|onCallerAfter|[function]|function (target, values) {}|选择城市后的回调|

## Introduce

CSS
``` css
<link rel="stylesheet" type="text/css" href="css/city-select.css">
```

Javascript
``` js
<script src="https://cdn.bootcss.com/jquery/1.8.1/jquery.js"></script>
<script type="text/javascript" src="js/citydata.js"></script>
<script type="text/javascript" src="js/citySelect-1.0.3.js"></script>
```

## Basic usage

class`city-select`是必要的，不能把它去掉

### 单选

HTML
``` html
<div class="city-select" id="single-select-1"></div>
```

Javascript
``` js
var singleSelect1 = $('#single-select-1').citySelect({
		dataJson: cityData,     //数据源
		multiSelect: false,     //单选
		shorthand: true,        //简称
		search: true,           //搜索
		onInit: function () {   //初始化回调
			console.log(this)
		},
		onTabsAfter: function (target) {    //切换tab回调
			console.log(target)
		},
		onCallerAfter: function (target, values) {  //选择后回调
			console.log(JSON.stringify(values))
		}
	});
	
// 单选设置默认城市
singleSelect1.setCityVal('北京市');
```

### 多选

HTML
``` html
<div class="city-select" id="multi-select-1"></div>
```

Javascript
``` js
var MulticitySelect1 = $('#multi-select-1').citySelect({
		dataJson: cityData,         //数据源
		multiSelect: true,          //多选
		multiMaximum: 6,            //可以选择的个数
		search: false,              //关闭搜索
		onInit: function () {       //初始化回调
			console.log(this)
		},
		onForbid: function () {     //禁止后点击的回调
			console.log(this)
		},
		onTabsAfter: function (target) {    //切换tab回调
			console.log(event)
		},
		onCallerAfter: function (target, values) {  //选择后回调
			console.log(JSON.stringify(values))
		}
	});
	
// 多选设置城市接口
MulticitySelect1.setCityVal('北京市, 天津市, 上海市, 广州市, 长沙市, 唐山市');
```

## Methods

|名称|描述|
|----|----|
|setCityVal(val)|设置城市默认<br><br>参数<br> * val: 传入的参数是用字符串的形式：'北京市, 天津市, 上海市, 广州市, 长沙市, 唐山市'<br><br>栗子<br>singleSelect.setCityVal('北京市')<br><br> `注意: 如果设置的城市超过multiMaximum设置的限制的个数，多出的是不会生效`|
|getCityVal()|可以拿到选中的城市的值认<br><br>栗子<br>singleSelect.getCityVal()<br><br> `注意: 只有在有选择城市的情况下，才能拿到城市的值或者是设置默认值后`|
|update(data)|更新城市数据源<br><br>参数<br> * data: 传入的是数组<br><br>栗子<br>singleSelect.update([{ "id": "110100", "name": "北京市", "parentId": "110000", "shortName": "北京", "letter": "B", "cityCode": "010", "pinyin": "Beijing" }, { "id": "120100", "name": "天津市", "parentId": "120000", "shortName": "天津", "letter": "T", "cityCode": "022", "pinyin": "Tianjin" }]);|
|status(status)|城市状态<br><br>参数<br> * status: 字符串-可以是readonly或disabled<br><br>栗子<br>singleSelect.status('disabled')|
|clear()|清空所有选中的值<br><br>栗子<br>singleSelect.clear()|
|bindEvent()|绑定事件<br><br>栗子<br>singleSelect.bindEvent()|
|unBindEvent()|销毁事件<br><br>栗子<br>singleSelect.unBindEvent()|
|showDrop()|显示事件<br><br>栗子<br>singleSelect.showDrop()|
|hideDrop()|隐藏事件<br><br>栗子<br>singleSelect.hideDrop()|

## DEMO

[https://lquan529.github.io/citySelect/](https://lquan529.github.io/citySelect/)

## LOG
2018.03.24-更新版本为1.0.4  
增加返回显示和隐藏接口

2017.09.25-更新版本为1.0.3  
增加一个参数whole，显示市级还是市县级数据；  
但是要求的是开启这个，必须是引入数据源是citydata.js文件

2017.08.31-更新版本为1.0.2  
修复点击清空操作后，不能再搜索的bug，  
多选计数的样式优化

2017.08.21-更新版本为1.0.1  
修复搜索一次之后不能再搜索的bug