/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/


/*
 * path:    src/control/SelectBox.js
 * desc:    下拉框控件
 * author:  songao(songao@baidu.com)
 * version: $Revision$
 * date:    $Date: 2014/04/11 18:26:41$
 */

define(function(require) {
    var u = require('underscore');
    var lib = require('../lib');
    var BaseControl = require('./BaseControl');
    var ESelect = require('esui/Select');

    /*function FSelect(options) {
        this.datasource = options.datasource;
        this.selectedIndex = options.selectedIndex;

        this.root = null;

        this.setup();
    }

    FSelect.prototype.setup = function() {
        var options = this.datasource;
        var select = document.createElement('select');
        var option;
        for (var i = 0; i < options.length; i++) {
            option = document.createElement('option');
            if (options[i]['displayValue']) {
                option.innerHTML = options[i]['displayValue'];
            } else {
                continue;
            }
            if (options[i]['value']) {
                option['value'] = options[i]['value'];
            }
            if (options[i]['selectedIndex']) {
                option['selected'] = true;
            }
            select.appendChild(option);
        };
        this.root = select;
    };

    FSelect.prototype.getValue = function() {
        return this.root.value;
    };

    FSelect.prototype.setValue = function(val) {
        this.root.value = val;
    };

    FSelect.prototype.appendTo = function(container) {
        if (container) {
            container.appendChild(this.root);
        }
    };

    FSelect.prototype.on = function(eventName, eventCallback) {
        this.root['on' + eventName] = eventCallback;
    };*/


    /**
     * SelectBox构造函数
     *
     * @param {Object} [options] 配置参数
     * @implements {IControl}
     * @extends {BaseControl}
     * @constructor
     */
    function SelectBox(options) {
        /**
         * 可配置的 option 的字段
         *
         * @type {Array.<string>}
         */
        this.optionKeys = ['datasource', 'name', 'selectedIndex'];

        BaseControl.apply(this, arguments);
    }

    /**
     * 初始化工作：创建esui控件等
     */
    SelectBox.prototype.init = function() {
        var datasource = this.datasource;
        for (var i = datasource.length - 1; i >= 0; i--) {
            datasource[i]['text'] = datasource[i]['displayValue'];
        };

        // 创建esui控件
        this.control = new ESelect({
            datasource: datasource,
            name: this.name,
            selectedIndex: this.selectedIndex || 0
        });
    };

    /**
     * 渲染控件和绑定控件事件
     */
    SelectBox.prototype.render = function() {
        // 渲染控件到容器
        this.control.appendTo(this.container);

        // 选择值变化事件
        var that = this;
        this.control.on(
            'change',
            function () {
                that.onchange();
            }
        );
    };

    lib.inherits(SelectBox, BaseControl);

    return SelectBox;


});



















/* vim: set ts=4 sw=4 sts=4 tw=100 : */
