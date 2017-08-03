/**
 * citySelect
 * v-1.0.0
 * dataJson			    [Array]				json数据，是html显示的列表数据
 * convert              [Boolean]           转换json数据，以适应这个插件的运行，如果传入的格式是指定的格式则不需要，默认(true)
 * shorthand            [Boolean]           显示的是简称还是全称，默认(false)，显示全称
 * search               [Boolean]           开启搜索功能，默认(true)，开启
 * multiSelect          [Boolean]           多选设置，默认不开启
 * multiMaximum         [Number]            允许能选择几个，默认5，只用于多选
 * multiType            [Number]            值允许1或者0，默认0；只用于多选，选中的值显示是一行还是多行
 * placeholder          [String]            默认提示语
 * searchPlaceholder    [String]            搜索文本框的默认提示
 * hotCity              [Array]             热门城市显示数据，传就生成热门城市，没有就插件生成
 * onInit               [function]          插件初始化后的回调
 * onForbid             [function]          插件禁止后再点击的回调
 * onTabsAfter          [function]          点击tabs切换显示城市后的回调
 * onTabsForbid         [function]          tabs禁止后再点击的回调
 * onCallerAfter        [function]          选择城市后的回调
 */

(function ($, window) {
    var functionality = {};

    /**
     * 构造器
     */
    function Cityselect(options, selector) {
        this.options = $.extend({}, Cityselect.defaults, options);
        this.$selector = $(selector);
        this.multiSelectResult = [];
        this.multiSelectResultId = [];
        this.provinceId = [];
        this.values = [];
        this.selectIndex = 0;
        this.isfocus = true;

        this.init();
    }

    /**
     * 默认参数
     */
    Cityselect.defaults = {
        dataJson: null,
        convert: true,
        shorthand: false,
        search: true,
        multiSelect: false,
        multiMaximum: 5,
        multiType: 0,
        mosaic: ',',
        placeholder: '请选择城市',
        searchPlaceholder: '输入关键词搜索',
        hotCity: [],
        onInit: function () {},
        onForbid: function () {},
        onTabsAfter: function (target) {},
        onTabsForbid: function (target) {},
        onCallerAfter: function (target, values) {}
    };

    /**
     * 内部函数
     */
    functionality.recombine = function (data) {
        var resultId = [],
            result = [],
            province = [];

        //筛选出省份的ID
        $.each(data, function (key, value) {
            if (value.parentId === '100000') {
                resultId.push(value.id);
                province.push(value);
            }
        });

        //根据省份ID，查找出所有的城市
        for (var i = 0; i < resultId.length; i++) {
            $.each(data, function (key, value) {
                if (resultId[i] === value.parentId) {
                    result.push(value);
                }
            });
        }

        //存储省份
        this.province = province;

        return result;
    }

    functionality.filter = function (parameter) {
        var configure = parameter;

        //分类的城市
        parameter.filterCity = {
            HOT: [],
            A: [],
            B: [],
            C: [],
            D: [],
            E: [],
            F: [],
            G: [],
            H: [],
            I: [],
            J: [],
            K: [],
            L: [],
            M: [],
            N: [],
            O: [],
            P: [],
            Q: [],
            R: [],
            S: [],
            T: [],
            U: [],
            V: [],
            W: [],
            X: [],
            Y: [],
            Z: []
        };

        $.each(configure.newCityData, function (key, value) {
            //匹配城市数据
            switch (value.letter) {
                case ('A'):
                        parameter.filterCity.A.push(value);
                    break;
                case ('B'):
                        parameter.filterCity.B.push(value);
                    break;
                case ('C'):
                        parameter.filterCity.C.push(value);
                    break;
                case ('D'):
                        parameter.filterCity.D.push(value);
                    break;
                case ('E'):
                        parameter.filterCity.E.push(value);
                    break;
                case ('F'):
                        parameter.filterCity.F.push(value);
                    break;
                case ('G'):
                        parameter.filterCity.G.push(value);
                    break;
                case ('H'):
                        parameter.filterCity.H.push(value);
                    break;
                case ('I'):
                        parameter.filterCity.I.push(value);
                    break;
                case ('J'):
                        parameter.filterCity.J.push(value);
                    break;
                case ('K'):
                        parameter.filterCity.K.push(value);
                    break;
                case ('L'):
                        parameter.filterCity.L.push(value);
                    break;
                case ('M'):
                        parameter.filterCity.M.push(value);
                    break;
                case ('N'):
                        parameter.filterCity.N.push(value);
                    break;
                case ('O'):
                        parameter.filterCity.O.push(value);
                    break;
                case ('P'):
                        parameter.filterCity.P.push(value);
                    break;
                case ('Q'):
                        parameter.filterCity.Q.push(value);
                    break;
                case ('R'):
                        parameter.filterCity.R.push(value);
                    break;
                case ('S'):
                        parameter.filterCity.S.push(value);
                    break;
                case ('T'):
                        parameter.filterCity.T.push(value);
                    break;
                case ('U'):
                        parameter.filterCity.U.push(value);
                    break;
                case ('V'):
                        parameter.filterCity.V.push(value);
                    break;
                case ('W'):
                        parameter.filterCity.W.push(value);
                    break;
                case ('X'):
                        parameter.filterCity.X.push(value);
                    break;
                case ('Y'):
                        parameter.filterCity.Y.push(value);
                    break;
                case ('Z'):
                        parameter.filterCity.Z.push(value);
                    break;
                default:
            }

            //如果有设置热门城市，就输出设置的，反正就去取默认城市前面18条做热门城市
            if (parameter.options.hotCity.length < 1 && key < 18) {
                parameter.filterCity.HOT.push(value);
            } else {
                $.each(parameter.options.hotCity, function (hkey, hvaluef) {
                    if (hvaluef === value.name) {
                        parameter.filterCity.HOT.push(value);
                    }
                });
            }
        });

        return parameter.filterCity;
    }

    functionality.montage = function (citydata, letter) {
        var self = this,
            data = citydata === 0 ? self.filterCity : citydata,
            html = '',
            name;

        $.each(data, function (key, value) {

            name = self.options.shorthand ? value.shortName : value.name; //显示的是简称还是全称

            if (citydata < 1) {

                if (letter === key) {

                    $.each(value, function (lkey, lvalue) {
                        name = self.options.shorthand ? lvalue.shortName : lvalue.name; //显示的是简称还是全称

                        html += '<a href="javascript:;" class="caller" data-parentid="' + lvalue.parentId + '" data-id="' + lvalue.id + '" data-title="' + name + '" data-letter="' + lvalue.letter + '">' + name + '</a>';

                    });

                }

            } else {

                html += '<li class="caller" data-parentid="' + value.parentId + '" data-id="' + value.id + '" data-title="' + name + '" data-letter="' + value.letter + '">' +
                        '<span class="name">' + name + '</span>' +
                        '<span class="spell">' + value.pinyin + '</span>' +
                     '</li>';
            }

        });

        return html;
    }

    functionality.template = [
        '<div class="city-pavilion hide">',
            '<div class="city-tabs">',
                '<a href="javascript:;" class="tab-a active" data-letter="HOT">热门城市</a>',
                '<a href="javascript:;" class="tab-a" data-letter="AB">AB</a>',
                '<a href="javascript:;" class="tab-a" data-letter="CD">CD</a>',
                '<a href="javascript:;" class="tab-a" data-letter="EFG">EFG</a>',
                '<a href="javascript:;" class="tab-a" data-letter="HI">HI</a>',
                '<a href="javascript:;" class="tab-a" data-letter="JK">JK</a>',
                '<a href="javascript:;" class="tab-a" data-letter="LM">LM</a>',
                '<a href="javascript:;" class="tab-a" data-letter="NOP">NOP</a>',
                '<a href="javascript:;" class="tab-a" data-letter="QR">QR</a>',
                '<a href="javascript:;" class="tab-a" data-letter="S">S</a>',
                '<a href="javascript:;" class="tab-a" data-letter="TU">TU</a>',
                '<a href="javascript:;" class="tab-a" data-letter="VWX">VWX</a>',
                '<a href="javascript:;" class="tab-a" data-letter="Y">Y</a>',
                '<a href="javascript:;" class="tab-a" data-letter="Z">Z</a>',
            '</div>',
            '<div class="city-cont">',
                '{cont}',
                '<p>',
                '<a href="javascript:;" class="empty"><i></i>清空</a><span></span>',
                '<em>*可以直接搜索查找城市（支持名称、拼音模糊搜索）</em>',
                '</p>',
            '</div>',
        '</div>',
        '<div class="city-info{type}">',
            '{name}',
            '<div class="city-input {not}">',
                '<input type="text" class="input-search" value="" placeholder="{placeholder}" />',
            '</div>',
        '</div>',
        '<ul class="city-list hide"></ul>',
        '<div class="city-tips hide">最多只能选择<span>{maxnum}</span>项</div>'
    ];

    functionality.split = function (str) {
        var letArray = [];

        for ( var i = 0; i < str.length; i++ ) {
            letArray.push(str[i]);
        }

        return letArray;
    }
    
    functionality.groupArray = [
        'HOT',
        'AB',
        'CD',
        'EFG',
        'HI',
        'JK',
        'LM',
        'NOP',
        'QR',
        'S',
        'TU',
        'VWX',
        'Y',
        'Z'
    ];

    functionality.showDrop = function (event) {
        var self = this,
            configure = self.options,
            $target = $(event.target);

        //禁止点击后的回调
        if ($(event.currentTarget).hasClass('forbid')) {
            configure.onForbid.call(self);
            return false;
        }

        //点击删除
        if ($target.hasClass('del')) {
            functionality.deletes.call(self, $target);
            return false;
        }

        self.isfocus = true;
    
        self.$selector.addClass('down').find('.city-pavilion').removeClass('hide').siblings('.city-list').addClass('hide');

        $(event.currentTarget).find('.input-search').focus();

        //有值就加选中状态
        functionality.defSelected.call(self);
    }

    functionality.tabs = function (event) {
        var $target = $(event.target),
            configure = this.options,
            letter = $target.data('letter');
        
        //tabs禁止点击后的回调
        if ($target.hasClass('forbid')) {
            configure.onTabsForbid.call(self, $target);
            return false;
        }

        //添加选中状态
        $target.addClass('active').siblings().removeClass('active');

        //显示对应索引的城市列表
        this.$selector.find('dl').addClass('hide').siblings('.city-'+ letter).removeClass('hide');

        //切换列表回调
        configure.onTabsAfter.call(this, $target);
    }

    functionality.singleAchieve = function (event) {
        var $target = $(event.currentTarget),
            $input = this.$selector.find('.input-search'),
            $cityInfo = this.$selector.find('.city-info'),
            configure = this.options,
            parentId = $target.attr('data-parentid'),
            id = $target.attr('data-id'),
            name = $target.data('title');

        //存储选中的值
        this.values = [];
        this.values.push({ 'name': name, 'id': id, 'parentId': parentId });

        //添加选中状态
        this.$selector.find('.caller').removeClass('active');
        this.$selector.find('.caller[data-id="'+ id +'"]').addClass('active');

        //赋值选中的给文本框
        $cityInfo.find('span').remove();
        this.$selector.find('.city-input').before('<span data-id="'+ id +'" data-parentid="'+ parentId +'">'+ name +'<i class="del"></i></span>').find('.input-search').val('');

        //调整文本框位置
        functionality.singleResize.call(this);

        //隐藏弹窗
        this.$selector.removeClass('down').find('.city-pavilion, .city-list').addClass('hide');

        //没有开启搜索且数组是不为空
        if (!this.options.search && this.values.length > 0) {
            this.$selector.find('.city-input').addClass('hide');
        }

        //选择之后的回调
        configure.onCallerAfter.call(this, $target, this.values[0]);
    }

    functionality.multiAchieve = function (event) {
        var self = this,
            $selector = self.$selector,
            $target = $(event.currentTarget),
            $input = $selector.find('.input-search'),
            configure = self.options,
            parentId = $target.attr('data-parentid'),
            id = $target.attr('data-id'),
            name = $target.data('title'),
            inputVal = $input.val(),
            hasActive = $target.hasClass('active'),
            joinSpan, mosaicName;

        if (!hasActive) {
            //选中的是否大于限制的
            if (self.selectIndex >= configure.multiMaximum) {
                $selector.find('.city-tips').removeClass('hide');

                setTimeout(function() {
                    $selector.find('.city-tips').addClass('hide');
                }, 1000);

                return false;
            }

            //选择的城市
            if ($.inArray(name, self.multiSelectResult) < 0) {
                self.multiSelectResult.push(name);
                self.multiSelectResultId.push(id);
                self.provinceId.push(parentId);

                //拼接生成选中值
                joinSpan = '<span data-id="'+ id +'" data-parentid="'+ parentId +'">'+ name +'<i class="del"></i></span>';

                //添加选中状态
                $selector.find('.caller[data-id="'+ id +'"]').addClass('active');

                //添加选中的城市显示方式
                if (configure.multiType < 1) {
                    $selector.find('.city-input').before(joinSpan);
                }

                //选中数
                self.selectIndex += 1;
            }

        } else {
            //删除去掉选中城市
            self.multiSelectResult.splice($.inArray(name, self.multiSelectResult), 1);
            self.multiSelectResultId.splice($.inArray(id, self.multiSelectResultId), 1);
            self.provinceId.splice($.inArray(parentId, self.provinceId), 1);

            //去掉选中状态
            $selector.find('.caller[data-id="'+ id +'"]').removeClass('active');

            //删除选中的城市
            $selector.find('.city-info').find('span[data-id="'+ id +'"]').remove();

            //选中数
            self.selectIndex -= 1;
        }

        //存储选中的值
        self.values = [];
        self.multiSelectResult.length > 0 ? self.values.push({ 'name': self.multiSelectResult, 'id': self.multiSelectResultId, 'parentId': self.provinceId }) : '';

        //拼接后的选中name
        mosaicName = self.multiSelectResult.join(configure.mosaic);

        //添加选中的城市显示方式
        if (configure.multiType === 1) {
            $selector.find('.city-name').html('<span class="span-over" title="'+ mosaicName +'">'+ mosaicName +'</span>');
        }

        //有选中就清除，没有值就添加
        if (self.selectIndex < 1) {
            $selector.find('.city-input').addClass('not-val');
            $selector.find('.span-over').remove();
        } else {
            $selector.find('.city-input').removeClass('not-val');
        }

        //添加选中数
        $selector.find('p').find('span').text(self.selectIndex > 0 ? self.selectIndex : '');

        //选择之后的回调
        configure.onCallerAfter.call(self, $target, self.values[0]);
    }

    functionality.search = function (event) {
        var self = this,
            $target = $(event.target),
            configure = this.options,
            keyCode = event.keyCode,
            inputVal = $target.val(),
            result = [],
            resultHtml;

        //如果是按下shift/ctr/左右/command键不做事情
        if (keyCode === 16 || keyCode === 17 || keyCode === 18 || keyCode === 37 || keyCode === 39 || keyCode === 91 || keyCode === 93) {
            return false;
        }

        //如果不是按下enter/上下键的就做搜索事情
        if (keyCode !== 13 && keyCode !== 38 && keyCode !== 40) {

            self.isfocus = false;
    
            $.each(self.newCityData, function(key, value) {
                //拼音或者名称搜索
                if(value.pinyin.toLocaleLowerCase().search(inputVal.toLocaleLowerCase()) > -1 || value.name.search(inputVal) > -1 || value.id.search(inputVal) > -1 ){
                    result.push(value);
                }
            });

            resultHtml = result.length > 0 ? functionality.montage.call(self, result) : '<li class="not-have">没有找到<strong>'+ inputVal +'</strong>相关城市</li>';

            self.$selector.find('.city-list').html(resultHtml);

            //有值就加选中状态
            functionality.defSelected.call(self);

            //弹窗隐藏，搜索列表显示
            functionality.searchShow.call(self);
        }

        return false;
    }

    functionality.searchShow = function (event) {
        this.$selector.addClass('down').find('.city-pavilion').addClass('hide');
        this.$selector.find('.city-input').addClass('search-show');
        this.$selector.find('.city-list').removeClass('hide');
    }

    functionality.defSelected = function (event) {
        var self = this;

        //有选中的，就添加选中状态
        if (self.values.length > 0) {
            $.each(self.values[0].id, function (key, value) {
                self.$selector.find('.caller[data-id="'+ value +'"]').addClass('active');
            });
        }
    }

    functionality.operation = function (event) {
        var self = this,
            $selector = self.$selector,
            $cityList = $selector.find('.city-list'),
            $target = $(event.target),
            $items = $cityList.find('.caller'),
            hasNothave = $cityList.find('li').hasClass('not-have'),
            keyCode = event.keyCode,
            index = 0,
            direction,
            itemIndex;

        //按下enter键，执行选中事件
        if (keyCode === 13) {

            $cityList.find('.caller.hover').trigger('click');

            return false;
        }
        
        //按下上下键
        if (keyCode === 38 || keyCode === 40) {
            
            //方向
            direction = keyCode === 38 ? -1 : 1;

            //选中的索引
            itemIndex = $items.index($cityList.find('.caller.hover'));

            if (itemIndex < 0) {
                index = direction > 0 ? -1 : 0;
            } else {
                index = itemIndex;
            }

            //键盘去选择的索引
            index = index + direction;

            //循环选择
            index = index === $items.length ? 0 : index;

            //添加选中状态
            $items.removeClass('hover').eq(index).addClass('hover');

            if (!hasNothave) {
                //滚动条跟随定位
                functionality.scroll.call(self);
            }

            return false;

        }

    }

    functionality.scroll = function (event) {
        var self = this,
            $cityList = self.$selector.find('.city-list'),
            $callerHover = $cityList.find('.caller.hover'),
            oh = $cityList.outerHeight(),
            ch = $callerHover.outerHeight() + 1,
            dy = $callerHover.position().top,
            sy = $cityList.scrollTop();

        $cityList.animate({
            scrollTop: dy + ch - oh + sy
        }, 200);
    }

    functionality.singleResize = function () {
        var self = this,
            $selector = self.$selector,
            $cityInfo = $selector.find('.city-info'),
            _iw = $cityInfo.outerWidth(),
            _p = $cityInfo.innerWidth() - $cityInfo.width(),
            _sw = $cityInfo.find('span').outerWidth(true);

        $selector.find('.city-input').width(_iw - _sw - _p - 2);
    }

    functionality.multiResize = function () {
        var self = this,
            $selector = self.$selector,
            _h = $selector.outerHeight(true) - 1;

        $selector.find('.city-pavilion, .city-list').animate({
            'top': _h
        }, 10);
    }

    functionality.forbid = function () {
        var self = this;

        $.each(self.$selector.find('.city-cont').find('dl'), function (key, value) {
            var _this = $(value),
                _letter = _this.data('letter');

            if (!$(value).text()) {
                self.$selector.find('.tab-a[data-letter="'+ _letter +'"]').addClass('forbid');
            }
        });

    }

    functionality.deletes = function (target) {
        var self = this,
            $target = target,
            $parent = $target.parent(),
            name = $parent[0].innerText,
            id = $parent.attr('data-id'),
            parentId = $parent.data('parentid');

        //删除去掉选中城市
        self.multiSelectResult.splice($.inArray(name, self.multiSelectResult), 1);
        self.multiSelectResultId.splice($.inArray(id, self.multiSelectResultId), 1);
        self.provinceId.splice($.inArray(parentId, self.provinceId), 1);

        //存储剩下城市的值
        self.values = [];
        self.multiSelectResult.length > 0 ? self.values.push({ 'name': self.multiSelectResult, 'id': self.multiSelectResultId, 'parentId': self.provinceId }) : '';

        //删除
        $parent.remove();
        self.$selector.find('.caller[data-id="'+ id +'"]').removeClass('active');

        //如果是多选才执行以下事情
        if (self.options.multiSelect) {
            self.selectIndex -= 1;
            self.$selector.find('p').find('span').text(self.selectIndex > 0 ? self.selectIndex : '');

            //数组是空
            self.values.length < 1 ? self.$selector.find('.city-input').addClass('not-val') : '';
        } else {
            //调整文本框位置
            functionality.singleResize.call(self);

        }
    }

    /**
     * 原型方法
     */
    Cityselect.prototype.init = function () {
        var self = this,
            configure = this.options;

        //开启转换就用新的json，否则就用正常格式
        self.newCityData = configure.convert ? functionality.recombine.call(self, configure.dataJson) : configure.dataJson;

        //城市分类生成json
        functionality.filter(self);

        //主结构生成输出
        self.createSubject();

        //绑定事件
        self.bindEvent();

        //初始化回调
        configure.onInit.call(self);
    };

    Cityselect.prototype.groupCity = function () {
        var self = this,
            domtel = '',
            letterStr,
            groupArray,
            list,
            montage,
            hide;

        for ( var i = 0; i < functionality.groupArray.length; i++ ) {
            //字母数组
            groupArray = functionality.groupArray[i];

            //不是热点城市的字母就不做拆分处理
            letterStr = groupArray !== 'HOT' ? functionality.split(groupArray) : '';

            //添加隐藏class
            hide = i > 0 ? ' hide' : '';

            //创建对应的dl
            domtel += '<dl class="city-'+ groupArray + hide +'" data-letter="'+ groupArray +'">{dl}</dl>';

            if (letterStr && letterStr.length > 1) {

                list = '';

                for (var j = 0; j < letterStr.length; j++) {

                    montage = functionality.montage.call(self, 0, letterStr[j]);

                    //不为空就执行下面创建节点
                    if (montage) {

                        list += '<dt>'+ letterStr[j] +'</dt>'+
                                '<dd>'+ montage +'</dd>';

                    }

                }

            } else {

                montage = functionality.montage.call(self, 0, groupArray);
                
                //不为空就执行下面创建节点
                if (montage) {

                    list = groupArray !== 'HOT' ? 
                            '<dt>'+ groupArray +'</dt>'+
                            '<dd>'+ functionality.montage.call(self, 0, groupArray) +'</dd>' :
                            '<dd>'+ functionality.montage.call(self, 0, groupArray) +'</dd>';

                }

            }

            domtel = domtel.replace('{dl}', list);
        }

        return domtel;
    };

    Cityselect.prototype.createSubject = function () {
        var self = this,
            configure = self.options,
            template = functionality.template.join('');

        //添加搜索默认文本提示
        template = template.replace('{placeholder}', configure.searchPlaceholder);

        //添加多选提示最大选择数
        template = template.replace('{maxnum}', configure.multiMaximum);

        //添加多选选中的值显示的方式
        template = template.replace('{type}', configure.multiType === 1 ? ' multi-type' : '');

        //添加多选选中的值显示的方式
        template = template.replace('{name}', configure.multiType === 1 ? '<div class="city-name"></div>' : '');

        //添加多选class
        configure.multiSelect ? self.$selector.addClass('multi') : '';

        template = template.replace('{not}', 'not-val not-search');

        //把城市弹窗dom添加到容器中
        self.$selector.html(template.replace('{cont}', self.groupCity()));

        //没有开启搜索，就remove掉搜索dom

        if (!configure.search) {
            self.$selector.find('.city-input').addClass('not-search').html('<em>'+ configure.placeholder +'</em>');
            self.$selector.find('.city-cont').find('p').find('em').remove();
        } else {
            self.$selector.find('.city-input').removeClass('not-search');
        }

        //没有数据输出的就添加禁止点击
        functionality.forbid.call(self);
    }

    Cityselect.prototype.bindEvent = function (event) {
        var self = this,
            configure = self.options,
            $selector = self.$selector;

        //显示城市-弹窗
        $selector.on('click.cityselect', '.city-info', $.proxy(functionality.showDrop, self));

        //tabs-切换索引的城市显示
        $selector.on('click.cityselect', '.tab-a', $.proxy(functionality.tabs, self));

        //点击选择城市
        $selector.on('click.cityselect', '.caller', $.proxy(configure.multiSelect ? functionality.multiAchieve : functionality.singleAchieve, self));

        //点击清空
        $selector.on('click.cityselect', '.empty', $.proxy(self.clear, self));

        //搜索
        $selector.on('keyup.cityselect', '.input-search', $.proxy(functionality.search, self));

        //键盘切换列表
        $selector.on('keydown.cityselect', $.proxy(functionality.operation, self));
    }

    Cityselect.prototype.unBindEvent = function (event) {
        var self = this,
            $selector = self.$selector;
        
        $selector.off('click.cityselect', '.city-info');

        $selector.off('click.cityselect', '.tab-a');

        $selector.off('click.cityselect', '.caller');

        $selector.off('click.cityselect', '.empty');

        $selector.off('keyup.cityselect', '.input-search');

        $selector.off('keydown.cityselect');
    }

    Cityselect.prototype.setCityVal = function (val) {
        var self = this,
            configure = self.options,
            setCity = val.replace(/\s/g, ''),
            cityArray = setCity.split(','),
            name, joinSpan, mosaicName;

        if (val) {
            //存储设置城市变量
            self.cityVal = val;
            //根据多选还是单选，多选不能超过设定的个数输出; 单选只能输出一个，设置多个只会输出第一个
            !configure.multiSelect ? cityArray = cityArray.splice(0, 1) : cityArray = cityArray.splice(0, configure.multiMaximum);

            for (var i = 0; i < cityArray.length; i++) {

                $.each(self.newCityData, function (key, value) {
                    name = self.options.shorthand ? value.shortName : value.name; //显示的是简称还是全称

                    if (cityArray[i] === value.name) {

                        self.multiSelectResult.push(name);
                        self.multiSelectResultId.push(value.id);
                        self.provinceId.push(value.parentId);

                        //添加选中状态
                        self.$selector.find('.caller[data-id="'+ value.id +'"]').addClass('active');

                        //选中的值拼接dom
                        joinSpan = '<span data-id="'+ value.id +'" data-parentid="'+ value.parentId +'">'+ name +'<i class="del"></i></span>';

                        //添加选中的城市显示方式
                        if (configure.multiType < 1) {
                            self.$selector.find('.city-input').before(joinSpan);
                        }
                        
                    }

                });

                //如果是多选才执行以下事情
                if (self.options.multiSelect) {
                    self.selectIndex = i + 1;
                    self.$selector.find('p').find('span').text(i + 1);
                }

            };

            //存储设置城市的值
            self.values = [];
            self.multiSelectResult.length > 0 ? self.values.push({ 'name': self.multiSelectResult, 'id': self.multiSelectResultId, 'parentId': self.provinceId }) : '';

            //拼接后的选中name
            mosaicName = self.multiSelectResult.join(configure.mosaic);

            //添加选中的城市显示方式
            if (configure.multiType === 1) {
                self.$selector.find('.city-name').html('<span class="span-over" title="'+ mosaicName +'">'+ mosaicName +'</span>');
            }

            //有值就去掉此class
            self.values.length > 0 ? self.$selector.find('.city-input').removeClass('not-val') : '';

        }
    }

    Cityselect.prototype.getCityVal = function () {
        //返回选中的城市
        return this.values[0];
    }

    Cityselect.prototype.update = function (data) {
        var self = this,
            template = functionality.template.join('');

        if (data.length > 0) {
            //重新更新城市数据
            self.newCityData = data;
            //重新生成城市分组
            functionality.filter(self);
            //主结构生成输出
            self.createSubject();
            //有设置城市默认的就重新设置
            self.cityVal ? self.setCityVal(self.cityVal) : '';
        }
    }

    Cityselect.prototype.clear = function () {
        //清空选中的值
        this.multiSelectResult = [];
        this.multiSelectResultId = [];
        this.provinceId = [];
        this.values = [];
        this.selectIndex = 0;
        this.isfocus ? this.$selector.find('.input-search').val('').focus() : '';

        this.$selector.find('.caller').removeClass('active');
        this.$selector.find('p').find('span').text('');
        this.$selector.find('.city-info').find('span').remove();

        if (this.values.length < 1) {
            this.$selector.find('.city-input').removeClass('hide').addClass('not-val');
        }
    }

    Cityselect.prototype.status = function (status) {
        var self = this,
            $cityInfo = self.$selector.find('.city-info');

        if (status === 'disabled') {
            self.$selector.addClass('disabled').find('.input-search').prop('disabled', true);
            self.unBindEvent();
        } else if (status === 'readonly') {
            self.$selector.addClass('readonly').find('.input-search').prop('readonly', true);
            self.unBindEvent();
        }
    }

    //点击以外的地方就隐藏
    $(document).on('click.cityselect', function (event) {
        var $citySelect = $('.city-select');

        if ($citySelect.find(event.target).length < 1) {
            $citySelect.removeClass('down').find('.city-pavilion, .city-list').addClass('hide');
            $citySelect.find('.city-input').removeClass('search-show').find('.input-search').val('');
        }
    });

    $.fn.citySelect = function (options) {
        return new Cityselect(options, this);
    };

})(jQuery, window);