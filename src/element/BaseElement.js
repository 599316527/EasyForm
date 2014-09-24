/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 * 
 **************************************************************************/
 
 
/*
 * path:    src/element/BaseElement.js
 * desc:    Element基类
 * author:  songao(songao@baidu.com)
 * version: $Revision$
 * date:    $Date: 2014/04/10 11:02:47$
 */

define(function(require) {
    var u = require('underscore');
    var lib = require('../lib');
    var util = require('../util');
    var EventTarget = require('mini-event/EventTarget');

    var IElement = require('./IElement');
    var elementMap = require('../elementMap');
    var IControl = require('../control/IControl');
    var controlMap = require('../controlMap');

    /**
     * Element 基类
     *
     * @constructor
     * @extends {mini-event.EventTarget}
     * @param {Object} schema 元素SCHEMA
     * @param {Object} [options] 配置参数
     *
     * @implements {IElement}
     */
    function BaseElement(schema, options) {
        /**
         * @type {Object}
         */
        this.schema = schema;

        /**
         * @type {Object}
         */
        this.options = options;

        /**
         * DOM 元素
         */
        this.main = null;

        /**
         * 元素ID
         */
        this.id = null;

        /**
         * 父元素
         */
        this.parent = null;

        /**
         * 验证规则，所有InputControl类型的控件都可以有这个属性.
         * @type {?string|Array.<string>}
         */
        this.rule;

        /**
         * 可配置的 option 的字段
         *
         * @type {Array.<string>}
         */
        this.optionKeys = (this.optionKeys || []).concat(['id', 'parent', 'main']);

        this.initOptions(options);

        if (this.schema['rules']) {
            this.initRules(this.schema['rules']);
        }
    }

    /**
     * ID 分隔符
     * @type {string}
     */
    BaseElement.seperator = '_-_';

    /**
     * 初始化选项
     *
     * @param {Object} [options] 构造函数传入的选项
     */
    BaseElement.prototype.initOptions = function(options) {
        options = options || {};

        var that = this;
        u.each(this.optionKeys, function(key, index) {
            if (options[key] != null) {
                that[key] = options[key];
            }
        });
    };

    /**
     * 初始化验证规则
     */
    BaseElement.prototype.initRules = function(rules) {
        var me = this;
        lib.forEach(rules, function(ruleSeg, ruleName) {
            me.setRule(ruleName, ruleSeg);
        });
    };

    /**
     * 生成ID
     *
     * @param {string=} opt_id ID后半部分
     */
    BaseElement.prototype.getId = function(opt_id) {
        if (opt_id != null) {
            return this.id + BaseElement.seperator + opt_id;
        }
        return this.id;
    };

    /**
     * 根据Element类型获取构造函数
     *
     * @param {ElementType} elementType 元素类型
     * @return {BaseElement}
     */
    BaseElement.prototype.getElementClass = function(elementType) {
        return elementMap[elementType] || null;
    };

    /**
     * 根据Control类型获取构造函数
     *
     * @param {ControlType} controlType 元素类型
     * @return {IControl}
     */
    BaseElement.prototype.getControlClass = function(controlType) {
        return controlMap[controlType] || null;
    };

    /**
     * 获取字段名
     *
     * @return {string}
     */
    BaseElement.prototype.getName = function() {
        return this.schema['name'];
    };

    /**
     * 获取默认值
     *
     * @return {Mixed}
     */
    BaseElement.prototype.getDefaultValue = function() {
        return this.schema['defaultValue'];
    };

    /**
     * 渲染元素
     *
     * @param {HTMLElement=} opt_main 主元素
     */
    BaseElement.prototype.render = function(opt_main) {
        if (opt_main != null) {
            this.main = opt_main;
        }
    };

    /**
     * 绑定事件
     */
    BaseElement.prototype.bindEvent = function() {};

    /**
     * 获取元素值
     */
    BaseElement.prototype.getValue = function() {
        return this.value;
    };

    /**
     * 获取元素预览值
     */
    BaseElement.prototype.getPreviewValue = function() {
        return this.getValue();
    };

    /**
     * 设置元素值
     */
    BaseElement.prototype.setValue = function(value) {
        this.value = value;
    };


    /**
     * 设置验证规则
     * 对于相同名称的验证规则，会被覆盖
     * @param {string} ruleName 验证规则的名称
     * @param {Array=} opt_ruleArgs 验证规则的参数
     */
    BaseElement.prototype.setRule = function(ruleName, opt_ruleArgs) {
        var ruleArgs = opt_ruleArgs || [],
            rule = [ruleName].concat(ruleArgs);
        if (!this.rule) {
            this.rule = [];
        }
        if (lib.isString(this.rule)) {
            this.rule = [this.rule];
        }
        for (var i = 0; i < this.rule.length; i++) {
            if (ruleName == getRuleName(this.rule[i])) {
                this.rule[i] = rule;
                return;
            }
        }
        this.rule.push(rule);

        /**
         * 返回rule的名称
         * @param {string|Array} rule 验证规则
         * @return {string} 验证规则名称
         */
        function getRuleName(rule) {
            return lib.isString(rule) ? rule.split(',')[0] : rule[0];
        }
    };


    /**
     * 验证控件的值
     * @return {boolean} true验证通过，false验证失败.
     */
    BaseElement.prototype.validate = function() {
        if (!this.rule) {
            return true;
        }

        return util.validate(this, this.rule, 'after');
    };

    /**
     * 显示错误信息，常用于后端验证错误显示
     * @param {string} errorMessage 需要显示的错误信息.
     */
    BaseElement.prototype.showError = function(errorMessage) {
        this.errorMessage = errorMessage;
        util.validate(this, 'backendError,this');
        this.errorMessage = null;
    };

    /**
     * FIXME 和全局的函数hideError有以来关系了...
     * 隐藏验证错误信息.
     */
    BaseElement.prototype.hideError = function() {
        util.validate.hideError(this.main);
    };


    lib.inherits(BaseElement, EventTarget);

    return BaseElement;
});



















/* vim: set ts=4 sw=4 sts=4 tw=100 : */
