'use strict';
var config = require('../../config');

function filter (ejs) {
    //增加默认值为'无'的filter
    ejs.filters.default = function (obj) {
        if (!obj) {
            return '未知'
        }
        return obj;
    };

    //默认值为空的filter
    ejs.filters.defaultEmpty = function (obj) {
        if (!obj) {
            return "";
        }
        return obj;
    }

    //默认值为0
    ejs.filters.defaultZero = function (obj) {
        if (!obj) {
            return 0;
        }
        return obj;
    }

    //转化value里的转义字符为标签
    ejs.filters.formatHtml = function(value){
        value.replace('\r\n', '<br/>');
        value.replace('\n','<br/>');

        return value;
    }

    //遮盖字符串
    ejs.filters.shadow = function(obj) {
        if (typeof obj === "string") {
            var start = 0;
            var end = obj.length;
            if (obj.length >4) {
                start = 2;
                end = obj.length -1;
            }
            var backStr = '';
            for(var i=0;i<obj.length;i++) {
                if(i>start && i<end) {
                    backStr +='*';
                } else {
                    backStr += obj[i];
                }
            }
            return backStr;
        } else {
            return '';
        }
    };

    //截取字符串
    ejs.filters.subString = function(start, length) {
        return function(obj) {
            if (!obj) {
                return ""
            } else if(obj.length > length){
                return obj.substr(start, length) + "...";
            } else {
                return obj;
            }
        }
    }

    //'yyyy-mm-dd'格式做时间
    ejs.filters.formatDate = function(obj) {
        if (!obj) {
            return "未知";
        } else {
            var date = new Date(obj);
            return date.getFullYear()+ '-'
            + ('0' + (date.getMonth() + 1)).slice(-2)+ '-'
            + ('0' + date.getDate()).slice(-2);
        }
    }

    //'yyyy-mm-dd'格式做时间
    ejs.filters.formatDateCN = function(obj) {
        if (!obj) {
            return "未知";
        } else {
            var date = new Date(obj);
            return date.getFullYear()+ '年'
            + ('0' + (date.getMonth() + 1)).slice(-2)+ '月'
            + ('0' + date.getDate()).slice(-2)+ '日';
        }
    }

    ejs.filters.getHourMinute12H = function(obj){
        if (!obj) {
            return "";
        } else {
            var d = new Date(obj);
            var hour = d.getHours();
            var apm = "AM";
            if(hour>12){
                hour = hour - 12;
                apm = "PM";
            }
            return hour+":"+ ('0' + d.getMinutes()).slice(-2) + '  '+ apm;
        }
    }

    ejs.filters.getHourMinute24H = function(obj){
        if (!obj) {
            return "";
        } else {
            var d = new Date(obj);

            return ('0'+d.getHours()).slice(-2)+":"+ ('0' + d.getMinutes()).slice(-2);
        }
    }

    return ejs;
};

exports.filter = filter;