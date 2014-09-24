/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 * 
 **************************************************************************/
 
 
/*
 * path:    src/util.js
 * desc:    
 * author:  songao(songao@baidu.com)
 * version: $Revision$
 * date:    $Date: 2014/06/13 13:29:11$
 */

define(function() {
    var util = {};

    /**
     * 创建唯一ID
     * @return {string}
     */
    util.uuid = function() {
        var uuid = Math.floor(Math.random() * 2147483648).toString(36);

        return uuid;
    };

    util.validate = require('Validator');

    return util;
});



















/* vim: set ts=4 sw=4 sts=4 tw=100 : */
