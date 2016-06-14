/**
 * ajax请求时加载状态
 */
Look.prototype.loader = {
    show: function(){
        
    },
    hide: function(){
        
    }
}

/**
 * 返回字符串在规定字节长度内的值
 * @param val
 * @param max
 * @return String
 */
Look.prototype.getByteVal = function(val, max){
    var returnValue = '';
    var byteValLen = 0;
    var val = val.split("");
    for (var i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/ig) != null) {
            byteValLen += 2;
        } else {
            byteValLen += 1;
        }
        if (byteValLen > max) {
            break;
        }
        returnValue += val[i];
    }
    return returnValue;
}

/**
 * 返回字符串的字节长度
 * @param val
 * @return int
 */
Look.prototype.getByteLen = function(val){
    var len = 0, str = val.replace(" ", "$"), charCode = -1;
    for (var i = 0; i < str.length; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            len += 1;
        } else {
            len += 2;
        }
    }
    return len;
}

/**
 * 获取指定的URL中的hash参数值
 * @param {String} paramName URL参数
 * @return paramValue URL参数值
 */
  function getUrlParam(name){  
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
    var r = window.location.search.substr(1).match(reg);  
    if (r!=null) 
      return unescape(r[2]); 
    return null;  
  }

/**
 * 获取String中的参数值
 * @param key
 * @param source
 * @return
 */
Look.prototype.getStringParam = function(key, source){
    if (source.indexOf("#") != -1 || source.indexOf("?") != -1) {
        source = source.substr(1);
    }
    var arr = source.split("&");
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].split("=")[0] == key) {
            return arr[i].split("=")[1];
        }
    }
}

/**
 * 重新设置参数值
 * @param {Array} key 如：[["aa","11"],["bb","22"]]
 * @param {String} source
 * @return
 */
Look.prototype.setParam = function(key, source){
    var reg = /^[#]|[?]/, type = reg.exec(source), theNewStr = source.replace(eval("/(^[" + type + "])/"), "").replace(/&hash_random=[a-zA-Z0-9]+/g, "");
    function single(keyStr, sourceStr){
        var arr = sourceStr.split("&"), newArr = "";
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].split("=")[0] == keyStr[0]) {
                newArr += keyStr[0] + "=" + keyStr[1] + "&";
            } else {
                newArr += arr[i].split("=")[0] + "=" + arr[i].split("=")[1] + "&";
            }
        }
        return newArr.replace(/[&]$/, "");
    }
    for (var j = 0; j < key.length; j++) {
        theNewStr = single(key[j], theNewStr);
    }
    return type + theNewStr.replace(/[&]$/, "") + "&hash_random=" + look.generateGuid();
}

function getDevice(){
    re = /.*\?device=(ipad|iphone).*/;
    
    if(re.test(window.location.href)){
        return RegExp.$1;
    }
    else{
        return 'iphone';
    }
}
/**
 * 数据请求方法
 * @param requestData
 * @param httpHeader
 * @param responseFn
 * @return
 */
function dataConn(url, requestData, responseFn,type,backData,completeFn, async){
    $.ajax({
        type: (type != undefined ? type : "post"),
        url: url,
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        data: requestData,
        timeout: 20000,
        cache: false,
        async: (async != undefined ? async : true),
        beforeSend: function(XMLHttpRequest){
            // $("body").append('<div class="liner loading2"><img src="img/loading.gif"></div');
            XMLHttpRequest.setRequestHeader("source", "share");
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
            $(".liner").hide();
            if (error == "timeout") {
                alert("请求超时：请求系统返回数据超时！请稍候再试吧…");
            }
        },
        complete: function(XMLHttpRequest, textStatus){
            if (completeFn != undefined && typeof(completeFn) == "function") {
                try {
                    completeFn(textStatus);
                } catch (e) {
                    alert("[ERROR] name : " + e.name + ", message: " + e.message);
                }
            }
            $("#loading").hide();
        }
    });
}

/**
 * 同步加载页面
 * @param {String} container 页面存放的div容器
 * @param {String} url 加载的页面URL
 * @param {String} callback 回调函数
 */
function loadPage(container, url, callback) {
    url += '?t='+new Date().getTime();
	$.ajax({
		url : url,
		async : false,
        beforeSend: function(XMLHttpRequest){
            $(".loader").show();
        },
		success : function(html) {
            $(".loader").hide();
			$(container).html(html);
		},
		complete : function() {
			if(callback != undefined){
				try {
					callback();
				} catch (e) {
					alert("[ERROR] name: " + e.name + ", message: " + e.message);
				}
			}
		},
		error : function(XmlHttpRequest, textStatus, errorThrown) {
		}
	});
}
/**
 * 保留小数点后两位
 */
 changeTwoDecimal_f= function (floatvar)
{
    var f_x = parseFloat(floatvar);
    if (isNaN(f_x))
    {
    alert('function:changeTwoDecimal->parameter error');
    return false;
    }
    var f_x = Math.round(f_x*100)/100;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0)
    {
    pos_decimal = s_x.length;
    s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2)
    {
    s_x += '0';
    }
    return s_x;
}

//****************************
//*****获取cookit
//****************************
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return false;
}
//****************************
//*****创建cookit
//****************************
function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(2460601000));
        var expires = "; expires="+date.toGMTString();
    }
    else expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}
function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
}
//by函数接受一个成员名字符串做为参数
    //并返回一个可以用来对包含该成员的对象数组进行排序的比较函数
    var by = function(name){
        return function(o, p){
            var a, b;
            if (typeof o === "object" && typeof p === "object" && o && p) {
                a = o[name];
                b = p[name];
                if (a === b) {
                    return 0;
                }
                if (typeof a === typeof b) {
                    return a < b ? -1 : 1;
                }
                return typeof a < typeof b ? -1 : 1;
            }
            else {
                throw ("error");
            }
        }
    }
    //预览本地图片
    function previewImage(file,container,width,height)  
{  
  var MAXWIDTH  = 200;  
  var MAXHEIGHT = 155;  
  var div = document.getElementById(container);  
  if (file.files && file.files[0])  
  {  
    div.innerHTML = '<img id="preview-'+container+'">';  
    var img = document.getElementById("preview-"+container+"");
    img.onload = function(){  
        // var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);  
        // img.width = rect.width; 
        // img.height = rect.height;  
        // img.style.marginLeft = rect.left+'px';  
        // img.style.marginTop = rect.top+'px';  
        img.width = width;  
        img.height = height;  
        img.style.marginLeft ='0px';  
        img.style.marginTop = '0px'; 
    }  
    var reader = new FileReader();  
    reader.onload = function(evt){
        img.src = evt.target.result;
    }  
    reader.readAsDataURL(file.files[0]);  
  }  
  else  
  {  
    var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="'; 
    file.select();  
    var src = document.selection.createRange().text;  
    div.innerHTML = '<img id=imghead>';  
    var img = document.getElementById('imghead');  
    img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;  
    // var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);  
    // status =('rect:'+rect.top+','+rect.left+','+rect.width+','+rect.height);  
    div.innerHTML = "<div id=divhead style='width:200px;height:155px;"+sFilter+src+"\"'></div>";  
    // div.innerHTML = "<div id=divhead style='width:"+rect.width+"px;height:"+rect.height+"px;margin-top:"+rect.top+"px;margin-left:"+rect.left+"px;"+sFilter+src+"\"'></div>";  
  }  
}  
// function clacImgZoomParam( maxWidth, maxHeight, width, height ){  
//     var param = {top:0, left:0, width:width, height:height};  
//     if( width>maxWidth || height>maxHeight )  
//     {  
//         rateWidth = width / maxWidth;  
//         rateHeight = height / maxHeight;  
          
//         if( rateWidth > rateHeight )  
//         {  
//             param.width =  maxWidth;  
//             param.height = Math.round(height / rateWidth);  
//         }else  
//         {  
//             param.width = Math.round(width / rateHeight);  
//             param.height = maxHeight;  
//         }  
//     }  
      
//     param.left = Math.round((maxWidth - param.width) / 2);  
//     param.top = Math.round((maxHeight - param.height) / 2);  
//     return param;  
// } 
var localData = {
    hname:location.hostname?location.hostname:'localStatus',
    isLocalStorage:window.localStorage?true:false,
    dataDom:null,
    initDom:function(){ //初始化userData
        if(!this.dataDom){
            try{
                this.dataDom = document.createElement('input');//这里使用hidden的input元素
                this.dataDom.type = 'hidden';
                this.dataDom.style.display = "none";
                this.dataDom.addBehavior('#default#userData');//这是userData的语法
                document.body.appendChild(this.dataDom);
                var exDate = new Date();
                exDate = exDate.getDate()+30;
                this.dataDom.expires = exDate.toUTCString();//设定过期时间
            }catch(ex){
                return ex;
            }
        }
        return true;
    },
    set:function(key,value){
        if(this.isLocalStorage){
            window.localStorage.setItem(key,value);
        }else{
            if(this.initDom()){
                this.dataDom.load(this.hname);
                this.dataDom.setAttribute(key,value);
                this.dataDom.save(this.hname)
            }
        }
    },
    get:function(key){
        if(this.isLocalStorage){
            return window.localStorage.getItem(key);
        }else{
            if(this.initDom()){
                this.dataDom.load(this.hname);
                return this.dataDom.getAttribute(key);
            }
        }
    },
    remove:function(key){
        if(this.isLocalStorage){
            localStorage.removeItem(key);
        }else{
            if(this.initDom()){
                this.dataDom.load(this.hname);
                this.dataDom.removeAttribute(key);
                this.dataDom.save(this.hname)
            }
        }
    },
    clear:function(){
        window.localStorage.clear();
    }
}
    function getScrollTop(){  
        var scrollTop=0;  
        if(document.documentElement&&document.documentElement.scrollTop){  
            scrollTop=document.documentElement.scrollTop;  
        }else if(document.body){  
            scrollTop=document.body.scrollTop;  
        }  
        return scrollTop;  
    }
    // var mydate = new Date();
    // mydate.getYear(); //获取当前年份(2位)
    // mydate.getFullYear(); //获取完整的年份(4位,1970-????)
    // mydate.getMonth(); //获取当前月份(0-11,0代表1月)
    // mydate.getDate(); //获取当前日(1-31)
    // mydate.getDay(); //获取当前星期X(0-6,0代表星期天)
    // mydate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
    // mydate.getHours(); //获取当前小时数(0-23)
    // mydate.getMinutes(); //获取当前分钟数(0-59)
    // mydate.getSeconds(); //获取当前秒数(0-59)
    // mydate.getMilliseconds(); //获取当前毫秒数(0-999)
    // mydate.toLocaleDateString(); //获取当前日期
    // var mytime=mydate.toLocaleTimeString(); //获取当前时间
    // mydate.toLocaleString( ); //获取日期与时间
