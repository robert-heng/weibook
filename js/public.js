var Weibook = function(){

};
//判断数据中是否存在某一值
Array.prototype.S=String.fromCharCode(2);  
Array.prototype.haspara=function(e)  
{  
    var r=new RegExp(this.S+e+this.S);  
    return (r.test(this.S+this.join(this.S)+this.S));  
}
Weibook.prototype = {
    reqUrl : "http://120.27.162.246:8888/",
    domain : document.location.protocol + "//" + document.location.host,
    url : this.domain + "",
    //计算字符串所占的像素值
    compute : function(v){
        var d = document.getElementById('dvCompute');
        d.innerHTML = v;
        return { w: d.offsetWidth, h: d.offsetHeight };
    },
    // 星期映射
    getWeek : function(day){
        switch(day){
            case 1: return "星期一";
            case 2: return "星期二";
            case 3: return "星期三";
            case 4: return "星期四";
            case 5: return "星期五";
            case 6: return "星期六";
            case 0: return "星期日";
            default : return day;
        }
    },
    // 日期处理
    //格式 2015-09
    getMydate : function(date){
        var mydate = {},year = 0,month = 0;
        if(date){
            year = date.split("-")[0];
            month = date.split("-")[1];
        }
        switch(month){
            case "01": mydate.e = "January"; mydate.z = "壹月"; break;
            case "02": mydate.e = "February"; mydate.z = "贰月"; break;
            case "03": mydate.e = "March"; mydate.z = "叁月"; break;
            case "04": mydate.e = "April"; mydate.z = "肆月"; break;
            case "05": mydate.e = "May"; mydate.z = "伍月"; break;
            case "06": mydate.e = "June"; mydate.z = "陆月"; break;
            case "07": mydate.e = "July"; mydate.z = "柒月"; break;
            case "08": mydate.e = "August"; mydate.z = "捌月"; break;
            case "09": mydate.e = "September"; mydate.z = "玖月"; break;
            case "10": mydate.e = "October"; mydate.z = "拾月"; break;
            case "11": mydate.e = "November"; mydate.z = "拾壹月"; break;
            case "12": mydate.e = "December"; mydate.z = "拾贰月"; break;
            default : mydate.e = month; mydate.z = month; break;
        }
        switch((parseInt(year)-1959)%12){
            case 01: mydate.sx = "鼠年"; break;
            case 02: mydate.sx = "牛年"; break;
            case 03: mydate.sx = "虎年"; break;
            case 04: mydate.sx = "兔年"; break;
            case 05: mydate.sx = "龙年"; break;
            case 06: mydate.sx = "蛇年"; break;
            case 07: mydate.sx = "马年"; break;
            case 08: mydate.sx = "羊年"; break;
            case 09: mydate.sx = "猴年"; break;
            case 10: mydate.sx = "鸡年"; break;
            case 11: mydate.sx = "狗年"; break;
            case 12: mydate.sx = "猪年"; break;
            default : mydate.sx = year; break;
        }
        console.log(mydate);
        return mydate;
    },
    //返回规定长度的字符串  超出部分显示。。。
    cutStr : function(str,maxLength) {
        var str = str;
        var strlength = 0;
        if(maxLength){
            strlength = maxLength;
        }
        if(str&&str.length>strlength){
            str = str.slice(0,strlength) + "...";
        }
        return str;
    },
    // ajax请求
    dataConn : function (url, requestData, responseFn,type,backData,completeFn, async){
        var bd = backData;
        console.log(responseFn);
        $.ajax({
            type: (type != undefined ? type : "post"),
            url: url,
            dataType: "json",
            // contentType: "application/json;charset=UTF-8",
            data: requestData,
            jsonp:"callback",
            timeout: 1000000,
            crossDomain:true,
            cache: false,
            async: (async != undefined ? async : true),
            beforeSend: function(XMLHttpRequest,XMLHttpResponse,text){
                //设置header参数
                // XMLHttpRequest.setRequestHeader("Access-Control-Allow-Methods", "GET,POST");
            },
            success: function(data, textStatus, XMLHttpRequest){
                if (data != null) {
                    // if (data.retCode != "00000") {
                    //     alert(data.retCode + " : " + data.retInfo);
                    //     return false;
                    // }
                    if (responseFn != undefined && typeof(responseFn) == "function") {
                       // try {
                            responseFn(data, textStatus,backData);
                        //} catch (e) {
                          //  console.log("[PARSE ERROR] name : " + e.name + ", message: " + e.msg);

                        //}
                    }
                } 
            },
            error: function(XMLHttpRequest, error){
                if (error == "timeout") {
                    alert("请求超时：请求系统返回数据超时！请稍候再试吧…");
                }
            },
            complete: function(XMLHttpRequest, textStatus){
                console.log(textStatus);
                if (completeFn != undefined && typeof(completeFn) == "function") {
                    try {
                        completeFn(textStatus,bd);
                    } catch (e) {
                        alert("[ERROR] name : " + e.name + ", message: " + e.message);
                    }
                }
            }
        })
    }
}
/**
 
 * 时间对象的格式化;
 
 */
Date.prototype.format = function(format) {
    if (this == "Invalid Date") return "无";
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
            // millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
var weibook = new Weibook();

