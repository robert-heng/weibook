$(function() {
	//获取年份
	var Side = function() {
		this.time_height = 56,
		this.containerH = 1044,
		this.containerW = 319,
		this.imgmargin = 20,
		this.infomargin = 14,
		this.pagepadding = 200,
		this.isfull = true,
		this.count = 1;
		this.changestate(false);
		this.getsideItem('feng82747460');
	}
	Side.prototype = {
		//获取页面年份和页数数据
		getsideItem: function(author_id) {
			var getItemUrl =  weibook.reqUrl + "search_profile?author_id=" + author_id,
				getItemType = "get";
			weibook.dataConn(getItemUrl, "", this.getItemBack, getItemType, this, this.reqComplete, false);
		},
		//填充左边侧栏
		getItemBack: function(data,text,obj) {
			var ui = data;
			var sideDiv = "";
			var sideItem = {};
			if (ui!=500) {
				for (var u in ui) {
					sideItem = ui[u];
					if(u!="author_id"){
						sideDiv += '<li><div class="year">' + u + '</div>';
						sideDiv += '<ul class="months">';
						for (var m = 0; m< sideItem.length; m++) {
							sideDiv += '<li class="side-item" author_id = "feng82747460" date="'+u+'-'+sideItem[m]+'" month="'+ sideItem[m] +'" >' + sideItem[m] + '月</li>';
						}
						sideDiv += '</ul></li>';
					}else{

					}
					
				}
				obj.changestate(true);
				$(".side-nav").append(sideDiv);
			}else{
				$("#show-next").text("没有更多数据了~");
			}
		},
		//修改显示状态
		changestate:function(ifshow){
			if(ifshow){
				$(".loading").hide();
				$(".page-container").show();
			}else{
				$(".loading").show();
				$(".page-container").hide();
			}
		},
		//创建一个页面 
		createPage:function(pagenum){
			var page = "";
			var pn = parseInt(pagenum);
			if (pn % 2 == 0) {
				page += '<div class="page page-leftB">';
			} else {
				page += '<div class="page page-rightB">';
			}
			page += '<div class="left-container"></div>';
			page += '<div class="right-container"></div>';
			if (pn % 2 == 0) {
				page += '<div class="page-num-left">' + (pn+1) + '<span class="foot-info">微书时光</span></div>';
			} else {
				page += '<div class="page-num-right">' + (pn+1) +'<span class="foot-info">微书时光</span></div>';
			}
			page += "</div>";
			return page;
		},
		//获取页面内容数据
		getpagesData: function(author_id,date,count) {
			var getItemUrl = weibook.reqUrl+ "search_one?author_id=" + author_id+ "&date=" + date + "&count="+ count,
				getItemType = "get";
			weibook.dataConn(getItemUrl,'', this.getpagesDataBack, getItemType, this, "", true);
		},
		//填充页面
		getpagesDataBack: function(data,text,obj) {
			var pageinfo = data.media;
			var newDate = {};
			var pageDiv = '';
			var containerW = obj.containerW;
			var containerH = obj.containerH;
			var imgmargin = obj.imgmargin;
			var infomargin = obj.infomargin;
			var timeH = obj.time_height;
			var pagepadding = obj.pagepadding;
			if (pageinfo && pageinfo.length > 0) {
				// for (var p = 0; p < 3; p++) {
				for (var p = 0; p < pageinfo.length; p++) {
					var news = pageinfo[p],
						news_time = '',
						news_info = '',
						news_img = '',
						lc_h = 0,
						rc_h = 0,
						lastpage = {},
						newsDate = new Date(news.timestamp*1000);
					// pageDiv = data.createPage(p);
					// $(".pages").append(pageDiv);
					//插入日期
					news_time += '<div class="news-time"><span class="day colorB-'+newsDate.format("MM") +'">'+ newsDate.format("dd") +'日</span> ';
					news_time += '<span class="time">' + newsDate.format("hh:mm") + '</span> ' + weibook.getWeek(newsDate.getDay()) + '</div>';
					lastpage = $(".page:last");
					lc_h = lastpage.find('.left-container').height();
					rc_h = lastpage.find('.right-container').height();
					if(lastpage.attr("cover")!="true"&&rc_h==0&&((lc_h+timeH)<=containerH)){
						lastpage.find('.left-container').append(news_time);
						lastpage.find('.left-container').css("height",lc_h+timeH+"px");
					}else if(lastpage.attr("cover")!="true"&&((rc_h+timeH)<=containerH)){
						lastpage.find('.right-container').append(news_time);
						lastpage.find('.right-container').css("height",rc_h+timeH+"px");
					}else{
						$(".pages").append(obj.createPage(p));
						lastpage = $(".page:last");
						lastpage.find('.left-container').append(news_time);
					}
					//插入信息
					news_info = '<p>'+ news.content +'</p>';
					var news_H = weibook.compute(news.content).h + infomargin;
					lc_h = lastpage.find('.left-container').height();
					rc_h = lastpage.find('.right-container').height();
					if(rc_h==0&&((lc_h+news_H)<=containerH)){
						lastpage.find('.left-container').append(news_info);
						lastpage.find('.left-container').css("height",lc_h+news_H+"px");
					}else if((rc_h+news_H)<=containerH){
						lastpage.find('.right-container').append(news_info);
						lastpage.find('.right-container').css("height",rc_h+news_H+"px");
					}else{
						$(".pages").append(obj.createPage(p++));
						lastpage = $(".page:last");
						lastpage.find('.left-container').append(news_info);
					}
					// lastpage.find('.left-container').append(news_info);
					//插入图片
					news_img = '';
					if(news.pic_info&&news.pic_info.length>0){
						for(var i = 0; i<news.pic_info.length;i++){
							var imgW = news.pic_info[i].width,imgH = news.pic_info[i].height,imgSH = 0,
							news_img = '<img src="'+news.pic_info[i].url +'">';
							imgSH = obj.containerW*imgH/imgW;
							lc_h = lastpage.find('.left-container').height();
							rc_h = lastpage.find('.right-container').height();
							// console.log((lc_h+imgSH+imgmargin)+"====="+obj.containerH);
							// console.log(imgSH);
							if(lc_h==0||(lc_h+imgSH+imgmargin)<obj.containerH){
							//左容器为空  或者  可以放入图片
								lastpage.find('.left-container').append(news_img);
								lastpage.find('.left-container').css("height",lc_h+imgSH+imgmargin + "px");
							}else if(rc_h==0||(rc_h+imgSH+imgmargin)<obj.containerH){
							//右容器为空 或者可以放入图片
								lastpage.find('.right-container').append(news_img);
								lastpage.find('.right-container').css("height",rc_h+imgSH+imgmargin + "px");
							}else{
							//上一个页面空间不够  新建页面
								$(".pages").append(obj.createPage(p++));
								lastpage = $(".page:last");
								lastpage.find('.left-container').append(news_img);
								lastpage.find('.left-container').css("height",imgSH+imgmargin + "px");
							}
						}
					}
				}
			}
			side.changestate(true);
		},
		reqComplete:function(status,obj){
			obj.changestate(true);
		}
	};
	//点击年份
	$(".side-nav").on("click", ".year", function() {
		$(".side-nav .active").next(".months").slideToggle(500);
		$(".side-nav .year").removeClass('active');
		side.count = 1;
		$(this).addClass("active");
		$(this).next(".months").slideToggle(500);
	});
	// 点击月份
	$(".side-nav").on("click", ".side-item", function() {
		side.changestate(false);
		if($(this).attr("cover")=="true"){
			$(".pages").html('<div class="page cover"></div>');
			side.changestate(true);
		}else{
			var author_id = $(this).attr("author_id");
			var date = $(this).attr("date");
			//月份封面
			var monthcover = "",dateArry = date.split("-"),mydate = weibook.getMydate(date);
			monthcover += "<div class='page' cover='true'>";
			monthcover += "<div class='month-info colorB-"+dateArry[1]+"'>";
			monthcover += "<div class='month-cover'>";
			monthcover += "<div class='n'>"+ dateArry[1] +"</div>";
			monthcover += "<div class='e'>"+ weibook.getMydate(date).e +"</div>";
			monthcover += "<div class='y'>"+ dateArry[0] + "  " + mydate.z + "  " + mydate.sx;
			monthcover += "</div></div></div></div>";
			$(".pages").html(monthcover);
			$(this).siblings('li').removeClass("active");
			$(this).toggleClass("active");
			$("#show-next").attr("author_id",author_id);
			$("#show-next").attr("date",date);
			side.getpagesData(author_id,date,side.count);
		}
		
	});
	//查看下个月
	$("#show-next").click(function() {
		var author_id = $(this).attr("author_id");
		var date = $(this).attr("date");
		side.getpagesData(author_id,date,++side.count);
	});
	var side = new Side();
});