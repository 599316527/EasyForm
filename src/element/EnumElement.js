/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/


/*
 * path:    src/element/EnumElement.js
 * desc:    下拉框渲染类
 * author:  Kyle He(hekai02@baidu.com)
 * version: $Revision$
 * date:    $Date: 2014/09/22 19:27:13$
 */

define(function(require) {
    var u = require('underscore');
    var lib = require('../lib');
    var BaseElement = require('./BaseElement');

    /**
     * 下拉框渲染类
     *
     * @extends {BaseElement}
     * @constructor
     */
    function EnumElement() {
        BaseElement.apply(this, arguments);
    }

    /**
     * @override
     * 初始化验证规则
     */
    EnumElement.prototype.initRules = function(rules) {
        var me = this;
        lib.forEach(rules, function(ruleSeg, ruleName) {
            if (ruleName === 'notdefault') {
                if (ruleSeg) {
                    me.setRule(ruleName, 'this');
                }
            } else {
                me.setRule(ruleName, ruleSeg);
            }
        });
    };

    /**
     * 渲染函数
     * @override
     */
    EnumElement.prototype.render = function() {
        BaseElement.prototype.render.apply(this, arguments);
        lib.addClass(this.main, 'ef-item-enum');
        this.main.id = 'ef-item-' + this.schema['name'];

        this.main.innerHTML = '<div class="ef-item-key">' + u.escape(this.schema['displayName']) + '</div>';
        var container = document.createElement('div');
        lib.addClass(container, 'ef-item-value');
        this.main.appendChild(container);

        var selectedIndex = 0;
        if (this.schema['defaultValue']) {
            lib.forEach(this.schema['enumValues'], function(value, i) {
                if (this.schema['defaultValue'] === value['value']) {
                    selectedIndex = i;
                }
            });
        }

        var Constructor = this.getControlClass('SELECTBOX');
        this.control = new Constructor({
            container: container,
            name: this.schema['name'],
            datasource: this.schema['enumValues'],
            selectedIndex: selectedIndex
        });
        this.control.render();
    };

    /**
     * 获取默认值
     */
    EnumElement.prototype.getDefaultValue = function() {
        if (this.schema['defaultValue']) {
            return this.schema['defaultValue'];
        } else if (this.schema['enumValues']) {
            return this.schema['enumValues'][0]['value'];
        } else {
            return null;
        }
    };

    /**
     * 获取元素值
     */
    EnumElement.prototype.getValue = function() {
        return this.control.getValue();
    };

    /**
     * 设置元素值
     */
    EnumElement.prototype.setValue = function(value) {
        this.control.setValue(value);
    };

    lib.inherits(EnumElement, BaseElement);

    return EnumElement;
});



















/* vim: set ts=4 sw=4 sts=4 tw=100 : */
