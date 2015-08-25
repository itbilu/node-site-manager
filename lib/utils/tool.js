var iconv = require('iconv-lite');
var crypto = require('crypto');

exports.getNumByChar=function(str, length) {
	var result = '';
	str = str.toLowerCase();
	for (var i = 0; i < length; i++) {
		if (str[i])
			result += ('000000000' + (str[i].charCodeAt() - 96)).slice(-2);
		else
			result += ('000000000'.slice(-2));
	}
	return result;
}

exports.getFixedInt=function(int, length) {
	return ('000000000000000' + int).slice(-length);
}

exports.getFixedRandomInt=function(length) {
	return ('000000000000000' + Math.random() * Math.pow(10, length)).slice(-length);
}

exports.getRandomNum = function(min, max)
{   
    var range = max - min;   
    var rand = Math.random();   
    return(min + Math.round(rand * range));   
}   

exports.getMd5=function(str) {
	var result = "";
	try {
		if (str && typeof str === "string") {
			var md5_str = crypto.createHash('md5');
			result = md5_str.update(str).digest('hex');
		}
		else
			result = "";

	} catch (err) {
		return result;
	}

	return result;
}

exports.distinct=function(arr) {
	var obj = {};
	arr.forEach(function (item) {
		obj[item] = 1
	})
	return Object.keys(obj);
}

//函数功能：json 排序  
// filed:(string)排序字段，  
// reverse: (bool) 是否倒置(是，为倒序)  
// primer (parse)转换类型  
//示例:list.sort(tool.sortJSONArry('downloadTimes',true,parseInt));
exports.sortJSONArry = function (filed, reverse, primer) {
	reverse = (reverse) ? -1 : 1;  
	  
	return function (a, b) {  
		a = a[filed];  
		b = b[filed];  
		  
		if (typeof (primer) != "undefined") {  
			a = primer(a);  
			b = primer(b);  
		}  
		  
		if (a < b) {  
			return reverse * -1;  
		}  
		if (a > b) {  
			return reverse * 1;  
		}  
	}  
}

exports.encodeURIComponentGBK=function(str)
{
	if(str==null || typeof(str)=='undefined' || str=='')
		return '';

	var a = str.toString().split('');

	for(var i =0; i<a.length; i++) {
		var ai = a[i];
		if( (ai>='0' && ai<='9') || (ai>='A' && ai<='Z') || (ai>='a' && ai<='z') || ai==='.' || ai==='-' || ai==='_') continue;
		var b = iconv.encode(ai, 'gbk');
		var e = ['']; // 注意先放个空字符串，最保证前面有一个%
		for(var j = 0; j<b.length; j++)
			e.push( b.toString('hex', j, j+1).toUpperCase() );
		a[i] = e.join('%');
	}
	return a.join('');
}

exports.toUnicode=function(str) {
    var res=[];
    for(var i=0;i < str.length;i++)
        res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
    return "\\u"+res.join("\\u");
}

exports.deUnicode=function(str) {
    str=str.replace(/\\/g,"%");
    return unescape(str);
}

exports.getClientIp=function(req) {
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for'); 
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
};

exports.addDays=function(date,days){
	var nd = new Date(date);
	   nd = nd.valueOf();
	   nd = nd + days * 24 * 60 * 60 * 1000;
	   nd = new Date(nd);

	return nd;
}

//将yyyy-MM-dd格式时间，软件换为支持Date.parse方法的yyyy/mm/dd格式时间
exports.convertDateParserString=function(timeString){	
    var regEx = new RegExp("\\-","gi");
     return timeString.replace(regEx,"/");
}

exports.trimRight=function(s){
    if(s == null) return "";
    var whitespace = new String(" \t\n\r");
    var str = new String(s);
    if (whitespace.indexOf(str.charAt(str.length-1)) != -1){
        var i = str.length - 1;
        while (i >= 0 && whitespace.indexOf(str.charAt(i)) != -1){
            i--;
        }
        str = str.substring(0, i+1);
    }
    return str;
}

exports.trimLeft=function(s){
    if(s == null) {
        return "";
    }
    var whitespace = new String(" \t\n\r");
    var str = new String(s);
    if (whitespace.indexOf(str.charAt(0)) != -1) {
        var j=0, i = str.length;
        while (j < i && whitespace.indexOf(str.charAt(j)) != -1){
            j++;
        }
        str = str.substring(j, i);
    }
    return str;
}

exports.trim=function(s){
    return trimRight(trimLeft(s));
}

exports.decodeHtml=function(val) {
    return val.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
}

exports.encodeHtml=function(val) {
    return val.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function encrypt(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
}
exports.encrypt=encrypt;

function decrypt(str, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}
exports.decrypt=decrypt;

/**
 * 生成随机字符串
 * @param {Number} length 字符串长度
 * @param {Number} flag 0.数字+字符+大写 1.数字 2.小写字符 3.大写
 */
exports.makeRandomStr=function(length, flag) {
    var str = '0123456789abcdefghijklmnopqrstuvwsyzABCDEFGHIJKLMNOPQRSTUVWSYZ';
    var min = 0;
    var max = 61;
    if (flag === 1) {
        max = 9;
    } else if (flag === 2) {
        min = 10;
        max = 35;
    } else if (flag === 3) {
        min = 36;
    }
    var backStr = '';
    for(var i=0;i<length;i++) {
        var idx = parseInt(Math.random()*(max-min)+min);
        backStr += str[idx];
    }
    return backStr;
};
