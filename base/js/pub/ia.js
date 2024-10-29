var iaURL = '../';		// 현황판 작업목록 루트경로
var ajaxURL = 'html/';	// 현황판 리스트 URL

var ia = {
	baseUrl : 'html/',
	init : function(){
		var _this = this;
		var lens = $('.ia-section-ajax').length;
		$('.ia-section-ajax').each(function(i){
			var file = $(this).data('file');
			var color = '#'+$(this).data('color');
			var graphHtml =
				'<li>'
				+'	<a href="#gIA'+i+'" data-role="spy-scroll">'
				+'		<span class="tit"><!-- 자동입력 --></span>'
				+'		<span class="bar" data-color="'+color+'"><span class="active"></span></span>'
				+'		<span class="pages"><em class="graph-complete"></em>/<em class="graph-total"></em></span>'
				+'	</a>'
				+'</li>';

			$(this).attr('id', 'gIA'+i);
			$('.ia-graph .graph').append(graphHtml);

			//IA페이지 로드 후 설정
			setTimeout(function(){
				_this.cal('#gIA'+i);
			}, 100);
			_this.url('#gIA'+i);

			if (lens - 1 == i){
				iaUI.spyScroll.init();
				setTimeout(function(){
					iaUI.accordion.init();
				},200)
			}
		})
	},
	cal : function(obj){
		//col-complete체크
		if ($(obj).find('[data-complete=완료]').length > 0){$(obj).find('[data-complete=완료]').parent().addClass('row-done')}
		if ($(obj).find('[data-complete=삭제]').length > 0){$(obj).find('[data-complete=삭제]').parent().addClass('row-del')}
		if ($(obj).find('[data-complete=제외]').length > 0){$(obj).find('[data-complete=제외]').parent().addClass('row-except')}
		$(obj).find('.row-del .col-num').removeClass('col-num');
		$(obj).find('.row-except .col-num').removeClass('col-num');

		//계산
		var cal_total = $(obj).find('.col-num').length;
		var cal_complete = $(obj).find('[data-complete=완료]').length;
		var cal_process = Math.round((cal_complete/cal_total)*100);

		//그래프
		var graph = $('.ia-graph a[href="'+obj+'"]');
		var graph_tit = $(graph).find('.tit');
		var graph_total = $(graph).find('.graph-total');
		var graph_complete = $(graph).find('.graph-complete');
		var graph_process = $(graph).find('.bar');
		var graph_active = $(graph).find('.bar .active');
		graph_total.text(cal_total);
		graph_complete.text(cal_complete);
		graph_process.attr('data-process', cal_process+'%');
		graph_active.css({backgroundColor:graph_process.data('color'), width:cal_process+'%'});

		//범례
		var legend_total = $(obj).find('.legend-total');
		var legend_complete = $(obj).find('.legend-complete');
		var legend_process = $(obj).find('.legend-process');
		legend_total.text(cal_total);
		legend_complete.text(cal_complete);
		if (cal_complete > 0){legend_process.text(cal_process+'%')}
		else {legend_process.text('0%')}

		//리스트
		var ia_num = $(obj).find('.col-num');
		var ia_depth4 = $(obj).find('td.col-4depth');
		var is_depth4 = false;
		var ia_depth5 = $(obj).find('td.col-5depth');
		var is_depth5 = false;
		var ia_tit = $(obj).find('.ia-h2 > a').text();
		graph_tit.html(ia_tit);

		//넘버링
		for (var i=0;i < cal_total;i++){
			ia_num.eq(i).text(i+1);
		}

		//depth4체크
		for (var j=0;j < ia_depth4.length;j++){
			if (ia_depth4.eq(j).text() != ''){
				is_depth4 = true;
			}
		}
		if (is_depth4 == false){$(obj).find('.col-4depth').hide()}

		//depth5체크
		for (var k=0;k < ia_depth4.length;k++){
			if (ia_depth5.eq(k).text() != ''){
				is_depth5 = true;
			}
		}
		if (is_depth5 == false){$(obj).find('.col-5depth').hide()}

		//메모 조건강조
		//$(obj).find('.col-memo p:contains("고도화 ver3")').css('color', 'red');
	},
	url : function(obj){
		$(obj).find('td.col-url').each(function(){
			var src = iaURL + $(this).text();
			$(this).empty().append('<a href="'+src+'" target="_blank">'+src+'</a>');
			/* Preview 모드
			if ($(obj).find('.ia-iframe-list').length){
				var depth1 = $(this).prevAll('.col-1depth').text();
				var depth2 = $(this).prevAll('.col-2depth').text();
				var itemTit = depth1 + ' > ' + depth2;
				var $objFrameList = $(obj).find('.ia-iframe-list');
				$objFrameList.append('<div class="item"><iframe src="'+src+'" frameborder="0"></iframe><div class="item-tit"><a href="'+src+'" target="_blank" class="item-link">'+itemTit+' (새창보기)</a></div></div>');
			}
			*/
		})
	},
}
var iaUI = {
	winEvent : function(){
		var setTime = null;
		$(window).on('scroll', function(){
			clearTimeout(setTime);
			setTime = setTimeout(function(){
				iaUI.scrolled.init();
			},10)
		})
	},
	top : function(){
		$(window).scrollTop(0);
	},
	spyScroll : {
		init : function(){
			$('[data-role=spy-scroll]').on('click', function(e){
				var target = $(this).attr('href');
				var topH = 90;
				$(window).scrollTop($(target).offset().top - topH);
				return false;
			})
		}
	},
	scrolled : {
		init : function(){
			if ($('html').scrollTop() > 50 || $('body').scrollTop() > 50){
				if (!$('#ia-wrap').is('.is-scrolled')){
					$('#ia-wrap').addClass('is-scrolled');
				}
			} else {
				if ($('#ia-wrap').is('.is-scrolled')){
					$('#ia-wrap.is-scrolled').removeClass('is-scrolled');
				}
			}
		}
	},
	accordion : {
		eleModule : '.ia-section-ajax',
		eleHeader : '.ia-section-header',
		eleBody : '.ia-section-body',
		init : function(){
			var _this = this;
			_this.event();
			//_this.action($(this.eleModule).eq(1).find(this.eleBody));
		},
		event : function(){
			var _this = this;
			$('.ia-graph a').on('click', function(){
				var id = $(this).attr('href');
				//_this.action($(id).find(_this.eleBody));
				$(id).find(_this.eleBody).css('height', 'auto');
			})
			$(_this.eleHeader).on('click', function(){
				_this.action($(this).next(_this.eleBody));
			})
		},
		action : function($this){
			//$(this.eleModule + ' ' + this.eleBody).css('height', '0');
			//$this.css('height', 'auto');
			if ($this.css('height') == '0px'){
				$this.css('height', 'auto');
			} else {
				$this.css('height', '0');
			}
		},
	},
	preview : {
		eleThumb : '.ia-tab-content.type-thumb',
		eleList : '.ia-tab-content.type-list',
		thumb : function(){
			$(this.eleThumb).addClass('is-visible');
			$(this.eleList).removeClass('is-visible');
		},
		list : function(){
			$(this.eleThumb).removeClass('is-visible');
			$(this.eleList).addClass('is-visible');
		},
	}
}

$(document).ready(function(){
	ia.init();
	iaUI.winEvent();
	iaUI.spyScroll.init();
	iaUI.scrolled.init();
})
