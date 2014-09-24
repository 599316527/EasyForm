/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/


/*
 * path:    src/EasyForm.js
 * desc:    EasyForm constructor
 * author:  songao(songao@baidu.com)
 * version: $Revision$
 * date:    $Date: 2014/04/09 17:41:51$
 */

define(function(require) {
    var u = require('underscore');
    var lib = require('./lib');
    var util = require('./util');
    var IElement = require('./element/IElement');
    var BaseElement = require('./element/BaseElement');
    var IControl = require('./control/IControl');
    var ElementType = require('./ElementType');
    var elementMap = require('./elementMap');
    var ControlType = require('./ControlType');
    var controlMap = require('./controlMap');
    var styleCreator = require('./styleCreator');

    /**
     * EasyForm 构造函数
     * @param {Array.<Object>} schema 表单SCHEMA
     * @constructor
     */
    function EasyForm(schema) {
        /**
         * @type {Array.<Object>}
         */
        this.schema = schema;

        /**
         * @type {HTMLElement}
         */
        this.main = null;

        /**
         * @type {IElement}
         */
        this.root = null;

        // 初始化
        this.init();
    }

    /**
     * Element接口类
     * @type {Function}
     */
    EasyForm.IElement = IElement;

    /**
     * Element接口类
     * @type {Function}
     */
    EasyForm.IElement = IElement;

    /**
     * Control接口类
     * @type {Function}
     */
    EasyForm.IControl = IControl;

    /**
     * 元素类型
     * @type {Object}
     */
    EasyForm.ElementType = ElementType;

    /**
     * 元素集合
     * @type {Object.<ElementType, Function>}
     */
    EasyForm.elementMap = elementMap;

    /**
     * 注册元素类
     * @param {ElementType} elementType 元素类型
     * @param {Function} Element 实现了IElement接口的表单项渲染器类
     * @static
     */
    EasyForm.registerElement = function(elementType, Element) {
        if (!ElementType[elementType]) {
            ElementType[elementType] = elementType;
        }
        EasyForm.elementMap[elementType] = Element;
    };

    /**
     * 控件类型
     * @type {Object}
     */
    EasyForm.ControlType = ControlType;

    /**
     * 控件集合
     * @type {Object.<ControlType, Function>}
     */
    EasyForm.controlMap = controlMap;

    /**
     * 注册控件类
     * @param {ControlType} controlType 控件类型
     * @param {Function} Control 实现了IControl接口的表单控件类
     * @static
     */
    EasyForm.registerControl = function(controlType, Control) {
        if (!ControlType[controlType]) {
            ControlType[controlType] = controlType;
        }
        EasyForm.controlMap[controlType] = Control;
    };

    /**
     * EasyForm 初始化
     */
    EasyForm.prototype.init = function() {
        var schema = this.schema;

        this.root = this.constructElementTree(schema);
    };

    /**
     * 构建Element树
     * @param {Array.<Object>} schema 表单SCHEMA
     * @param {IElement=} opt_parent 父Element
     */
    EasyForm.prototype.constructElementTree = function(schema, opt_parent) {
        var itemSchema = schema;
        if (u.isArray(schema)) {
            itemSchema = {
                'name': '',
                'displayName': '',
                'datatype': ElementType.OBJECT,
                'items': schema
            };
        }
        var Constructor = EasyForm.elementMap[ElementType.OBJECT];
        return new Constructor(itemSchema);
    };

    /**
     * 生成ID
     * @param {string=} opt_part id后缀
     * @return {string}
     */
    EasyForm.prototype.getId = function(opt_part) {
        return opt_part ? (this.id + '-' + opt_part) : this.id;
    };

    /**
     * 创建样式标签
     */
    EasyForm.prototype.createStyles = function() {
        styleCreator.create(this.getId('style'), this.main);
    };

    /**
     * 渲染表单
     * @param {HTMLElement} main 表单容器元素
     */
    EasyForm.prototype.render = function(main) {
        // 先销毁之前的表单
        if (this.main) {
            this.dispose();
        }
        this.main = main;

        this.id = this.main.id || util.uuid();
        this.main.id = this.id;

        lib.addClass(main, 'ef-form');
        this.root.render(main);

        // 如果是build版本，css是存放在JS中，需要动态创建
        this.createStyles();
    };

    /**
     * 销毁表单
     */
    EasyForm.prototype.dispose = function() {
        if (!this.main) {
            return;
        }

        this.main.innerHTML = '';
        lib.removeClass(this.main, 'ef-form');

        this.main = null;
        // TODO
    };

    /**
     * 表单验证
     * @return {Boolean} 验证通过返回true
     */
    EasyForm.prototype.validate = function() {
        var controls = this.root.children;
        for (var i = 0; i < controls.length; i++) {
            if (!controls[i].validate()) {
                return false;
                break;
            }
        }
        return true;
    };

    /**
     * 隐藏错误
     */
    EasyForm.prototype.hideError = function() {
        var controls = this.root.children;
        for (var i = 0; i < controls.length; i++) {
            util.validate.hideError(controls[i].main, 'after');
        }
    };

    // 注册预定义元素
    var StringElement = require('./element/StringElement');
    var ObjectElement = require('./element/ObjectElement');
    var EnumElement   = require('./element/EnumElement');
    EasyForm.registerElement('STRING', StringElement);
    EasyForm.registerElement('OBJECT', ObjectElement);
    EasyForm.registerElement('ENUM', EnumElement);

    // 注册预定义控件
    var TextBox = require('./control/TextBox');
    var SelectBox = require('./control/SelectBox');
    EasyForm.registerControl('TEXTBOX', TextBox);
    EasyForm.registerControl('SELECTBOX', SelectBox);

    return EasyForm;
});



















/* vim: set ts=4 sw=4 sts=4 tw=100 : */
