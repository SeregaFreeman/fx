var triggers = [],playedvideos = [],advertising=null,curTrigger = '';
var socialLink = 'https://www.dukascopy.com/tv/'; //social links (twitter, facebook)
var videoLink = '/tv/'; //TV page link - ajax link, embed(detach) video
var ajaxLink = '/tv/ajax/websocket'; //ajax (like socket)
var gSourceDir = '/inc/tv/'; //source directory for images
var facebookApiID = '345495072153951', imageUrl = 'http://www.dukascopy.com/video'; //image url for facebook post
var curVidStatStart = curVidStatComplete = curVidStatBegin = null;
var errAttempts = 0; //count for errors
var liveTriggers = false,jwWidth = 625, jwHeight = 360; //default - changeable in player options

if (typeof ISJAPAN == 'undefined') {
	ISJAPAN = false;
}
//THIS FUNCTIONS NEEDS TO BE IN ALL SCRIPTS WHERE INCLUDED JW PLAYER
//function jwOnReady() {}
//function jwOnPlaylistItem() {}
//function jwOnBeforePlay() {}
//function trackEvent() {}

function jwLoadPlayer(options, video)
{
	jwplayer.key="KqGDrpbhSfQkrI3Brm5Zu1zn9qlKiChHOFzmUw==";
	
//options  
	var lang   = (options.lang ? options.lang : 'en');
	var render   = (options.render ? options.render : 'flash'); 
	var rpt   = (options.repeat ? options.repeat : false);
	var trigVis   = (options.triggers ? true : false);
	liveTriggers   = (options.livetriggers ? true : false);
	var playlist  = (options.playlist ? true : false);
	var plVisible = (options.plshow ? true : false);
	var scrollVis = (options.scroller ? true : false); //news and currencies - websocket
	var adVis = (options.hasOwnProperty('ad') ? options.ad : false);
	var shareVis  = (options.share ? true : false);
	var logoVis  = (options.logo ? true : false);
	var youtubeVis  = (options.youtube ? options.youtube : false);
	var watermark  = (options.watermark ? options.watermark : '');
	var watermarkLink  = (options.wlink ? options.wlink : '');
	if (options.width) jwWidth = options.width;
	if (options.height) jwHeight = options.height;
//links
	var sourceDir = (options.sourcedir ?  options.sourcedir : '/inc/tv/');
	gSourceDir = sourceDir;
	var tvLink = (options.tvlink ?  options.tvlink : videoLink);
	videoLink = tvLink;
	ajaxLink = tvLink + 'ajax/websocket';

//create container and insert player to it - for triggers, playlist and scrollers
	$('#'+options.id).css('width', jwWidth+'px').css('height', jwHeight+'px');
	$('<div id="player_container" style="width:'+jwWidth+'px;height:'+jwHeight+'px;"></div>').insertAfter('#'+options.id);
	$('#player_container').prepend($('#'+options.id));
	
    var img = new Image();
    img.src = video.thumb;
    
    img.onerror = function() {
    	console.log('first video image load error...');
    };
    
    
//initialize jwplayer
	jwplayer(options.id).setup({
		file: video.video,
		image: video.thumb, 
		mediaid: video.id,	
		height: jwHeight,
		width: jwWidth,
		autostart: false, //true - doesn't work on mobile devices
		controls: true,
		repeat: rpt,
//		primary: $.browser.msie?'flash':'html5', //if IE - HTML5 (mp4 file)
		primary: (GetIEVersion()) ? 'flash' : render,
		listbar: {position: "none", size: 320}, //bottom, none, right
		logo: {file: watermark, link: watermarkLink}, //only in commercial licence
		abouttext : "Dukascopy TV", //only in commercial licence
		aboutlink : "https://www.dukascopy.com/tv/en/About/", //only in commercial licence
		//sharing : {}, //only in premium licence
	    //ga: {}, //idstring: "mediaid",trackingobject: "pageTracker" //only in premium licence
//	    skin: sourceDir + "js/jwplayer/jwplayerskins/six.xml",
	    events: {
	        onReady: function () {
	        	
	        	$('#lasttvlist').data('busy',0);
	        		
	        	if (typeof jwOnReady != 'undefined')
	        		jwOnReady();
	        	
	        	if (scrollVis || trigVis || adVis) startAjax(scrollVis,trigVis,sourceDir,adVis,lang);
	        	
	        	if (shareVis) showShareLinks(sourceDir); //share buttons - dock buttons (facebook, twitter)

                if (youtubeVis) showYoutubeLink(sourceDir); //youtube
	        	
	        	if (logoVis) showLogoLink(sourceDir); //Dukascopy Tv link
	        	
	        	if (playlist) showPlaylist(plVisible,sourceDir); //plylist on top + dock buttons
	        	
	        	//if window.open
	        	if (window.opener && window.opener.open && !window.opener.closed) {
	        		jwplayer().play();
	        	}
	        	
	        }, 
	        	
	        onPlay: function (state) { jwOnPlay();},
	        onPause: function (state) { jwOnPause();},
	        onError: function (state) { jwOnError(state);},
	        onPlaylistItem: function (state) { if ($('#lasttvlist').data('busy') == 1) { return; } jwOnPlaylistItem(state);},
	        onComplete: function (state) { jwOnComplete(); },
	        onTime: function (state) { jwOnTime(state);},
	        onSeek: function (state) { jwOnSeek(state);},
	        onFullscreen: function (state) { 
	        	if (playlist) jwOnFullscreen(sourceDir);
	        	if (jwplayer().getFullscreen()) {
	        		$('#player .jwvideo').css({
				        'height' : '100%',
				        'width' : '100%'
				    });
	        	} else {
	        		//$('#player_container .jwvideo video').attr('style',"");
	        	}
	        },
	        onBeforePlay: function (state) {  if ($('#lasttvlist').data('busy') == 1) { return; }  jwOnBeforePlay(); }
//	        onCaptionsChange: function (state) {jwonCaptionsChange(state);}
	    }
	});

	return jwplayer;
}

function pausePlayer()
{
	if (jwplayer().getState() == 'PLAYING' || jwplayer().getState() == 'BUFFERING') jwplayer().pause();
}

function detachPlayer(videoid, videolang)
{
	var quality = 0;
	var curPosition = 0;

	if((typeof videoid === 'undefined') || (typeof videolang === 'undefined'))
	{
		var currentItem = jwplayer().getPlaylistItem();
		
		if(currentItem.mediaid)
		{
	        quality = jwplayer().getCurrentQuality() != 0 ? '1' : '0';
	        curPosition = jwplayer().getPosition()*1000;
	        videolang = currentItem.lang;
	        videoid = currentItem.mediaid;
		}
		else
			return false;
	}

    var url = videoLink + videolang + "/view/" + videoid + '#' + quality + curPosition;       
    var windowName = "";
    var windowSize = 'width=665,height=510,scrollbars=yes,resizable=yes';

    pausePlayer();
    
    window.open(url, windowName, windowSize);
}

function jwOnComplete() //stop each time the playlist item stoped playing (not to play one by one)
{
	//console.log('load Video');
	//jwplayer().stop();
	//jwplayer().play();
}

function jwOnSeek(state)
{
	//console.log('Position: ' + state.position);
}

var pageTitle = null;
function jwOnPlay() //track to google start position + show title
{
	var curVidID = jwplayer().getPlaylistItem().mediaid + jwplayer().getCurrentQuality();
	
	if (curVidStatBegin != curVidID)
	{
		currentId = jwplayer().getPlaylistItem().mediaid;
		trackEvent({'name':'START', 'hd':jwplayer().getCurrentQuality()});
		curVidStatBegin = curVidID;	        		
	}
	
	if (typeof platform != 'undefined' && platform == 'mac') {
		var jwVideo = $('#player_container .jwvideo');
		jwVideo.addClass('isMacFixVideo');
	}
	
	$("#player_text").remove();
    errAttempts = 0;
}

function jwOnPause()
{
//	if (pageTitle) document.title = pageTitle;
}

function jwOnError(state) //on error - try to replay video
{
	errAttempts += 1;
	console.log('Player error (' + errAttempts + '): ' + state.message + '. Object: ' + JSON.stringify(state));

	if (errAttempts > 3)
	{
		jwplayer().stop();
        errAttempts = 0;
	}
	else
    {
        var curPosition = jwplayer().getPosition();
        if(curPosition > 0) //start playing from stopped position
        {
            jwplayer().stop();
		    jwplayer().play();
		    jwplayer().seek(curPosition);
        }
        else //change quality
        {
            jwplayer().setCurrentQuality(1 == jwplayer().getCurrentQuality()?0:1);
            jwplayer().stop();
            jwplayer().play();
	    }
    }
}

function jwOnTime(state) //track to google analytics - 10sec from start and 20 sec before end
{
	var curVidID = jwplayer().getPlaylistItem().mediaid + '' + jwplayer().getCurrentQuality();

	if (curVidStatStart != curVidID)
	{
		if (state.position > 10)
		{
			currentId = jwplayer().getPlaylistItem().mediaid;
			trackEvent({'name':'10SEC', 'hd':jwplayer().getCurrentQuality()});
			curVidStatStart = curVidID;
			
			errAttempts = 0;
		}
	}
	if (curVidStatComplete != curVidID)
	{
		if (state.position > state.duration-20)
		{
			currentId = jwplayer().getPlaylistItem().mediaid;
			trackEvent({'name':'20SEC', 'hd':jwplayer().getCurrentQuality()});
			curVidStatComplete = curVidID;
		}
	}
	
	if(advertising)
	{
		var adblock = get_cookie('DCTV_AD_BLOCK')?true:false;
		
		if ((state.position > 20) && (!adblock))
		{
			showAd();
		    setTimeout(function() {closeAd();}, (advertising.hasOwnProperty('deadline')?advertising.deadline:5)*1000);		
			advertising = false;
		}
	}
}

function jwOnFullscreen(sourceDir) //hide playlist button on fullscreen
{
	if (jwplayer().getFullscreen())
		removePlaylistBtn();
	else
		addPlaylistBtn(sourceDir);
}

function showShareLinks(sourceDir)
{
	
	jwplayer().addButton(sourceDir+'img/detach2.png', 'Detach player', detachPlayer, '5'); //Detach player
	
	jwplayer().addButton(sourceDir+'img/facebook.png', 'Facebook', sendLinkToFacebook, '2');
	
	if(!ISJAPAN) {
		jwplayer().addButton(sourceDir+'img/twitter.png', 'Twitter', sendLinkToTwitter, '3');
	}
}

function showYoutubeLink(sourceDir)
{
	if(!ISJAPAN) {
		jwplayer().addButton(sourceDir+'/img/youtube2.png', 'Youtube', openYoutube, '4');
	}
}

function openYoutube()
{
    pausePlayer();

    var currentItem = jwplayer().getPlaylistItem();
    //send id to server - to get youtube information
    ajaxWebsocket({
        data:
        {
            action		:	'VIDEO_INFO',
            lang		:	currentItem.lang,
            id			:	currentItem.mediaid
        },
        url : videoLink + 'ajax/youtube',
        yes:function(data)
        {
            if(!data) return;

            if(data.hasOwnProperty('error'))
                var htmlYT = data.textTranslate;
            else
                var htmlYT = '<a href="'+data.video+'" target="_blank" style="color: #fff;">'+data.textTranslate+'</a><br /><br />' +
                    '<div style="position: absolute; bottom: 20px; right: 20px;height:auto;">' +
                        '<a href="'+data.commentsLink+'" target="_blank" style="color: #fff;">Total comments: '+data.commentCount+'</a><br />' +
                        'Total views: '+data.viewCount+'<br />' +
                        'Total likes: '+data.likeCount+'<br/>' +
                        'Total dislikes: '+data.dislikeCount+'<br/>' +
                    '</div>';

            $('#player_text div').append(htmlYT).css('background','');
        }
    });

    var html = '<div id="player_text" style="height:'+(jwHeight-20)+'px;z-index:10;" onclick="$(\'#player_text\').remove()">' +
            '<div style="height:'+(jwHeight-40)+'px;position:relative;padding:10px;background: url('+gSourceDir+'img/loading.gif) center center no-repeat;">' +
                '<p style="position: absolute;top: 10px;right:15px;cursor: pointer;font-weight:bold;font-size:20px;" onclick="$(\'#player_text\').remove()">x</p>' +
                '<img src="'+gSourceDir+'img/youtube_logo.png" alt="" style="height:60px;" /><br /><br />' +
            '</div>' +
        '</div>';

    $("#player_container").append(html);
}

function showLogoLink(sourceDir)
{
	jwplayer().addButton(sourceDir+'/img/logo.png', 'Dukascopy TV', openDukascopyTV, '6');
}

function openDukascopyTV()
{
	var currentItem = jwplayer().getPlaylistItem();
	var curLink = '/tv/';
	if (currentItem)
		curLink = curLink + currentItem.lang + '/#' + currentItem.mediaid
	else
		curLink = curLink + 'en/';
			
	window.open(curLink,'_blank');	
}

function sendLinkToTwitter()
{
	//https://twitter.com/intent/tweet?url=http%3A%2F%2Fwww.tearsofsteel.org%2F
	//get video link
	var currentItem = jwplayer().getPlaylistItem();

	if (currentItem)
	{
		//var curLink = 'http://twitter.com/home?status=' + encodeURIComponent(window.location.href);
		var curLink = '//twitter.com/home?status=' + encodeURIComponent(socialLink + currentItem.lang + '/issue/' + currentItem.mediaid);
		
		window.open(
				curLink,
				  '_blank'
				);
		
		//window.location = 'http://twitter.com/home?status=' + currentItem.sources[0].file;
	}
}

function sendLinkToFacebook()
{
	//http://www.facebook.com/sharer/sharer.php?u=
	var pic = '/inc/tv/img/tvlogo.png';
	var pictureVideo = trackVideo.thumb;
	if((pictureVideo.indexOf('index.php')>0) && (pictureVideo.indexOf('|')>0))
	{
		pic = pictureVideo.substr(0,pictureVideo.indexOf('|'));
		pic = imageUrl + pic.substr(pic.indexOf('index.php')+9,pic.length);
	}
	
	//get video link
	var currentItem = jwplayer().getPlaylistItem();

	if (currentItem)
	{
		if (ISJAPAN) {
			var curLink = '//www.facebook.com/DukascopyJP';
			window.open(
					curLink,
					  '_blank'
					);
		} else {
			var curLink = socialLink + currentItem.lang + '/issue/' + currentItem.mediaid;
		      //FB.init({appId: facebookApiID, status: true, cookie: true});
		        var obj = {
		          method: 'feed',
		          display: 'popup', //"display" must be one of "popup", "dialog", "iframe", "touch", "async", "hidden", or "none" 
		          //size: {width:640,height:480},
		          width:640,
		          height:480,
		          redirect_uri: 'http://www.facebook.com',
		          link: curLink,
		          picture: pic, //curData.thumb
		          name: trackVideo.title,
		          caption: trackVideo.program
		        };

		        //FB.ui(obj, callback);        
	
		        curLink = "https://www.facebook.com/dialog/feed?app_id="+facebookApiID;
		        for (var i in obj) {
		          if (obj.hasOwnProperty(i)) {
		        	  curLink += "&" + i + "=" + obj[i];
		          }
		        }
		        
				window.open(
						curLink,
						  '_blank'
						);
			
		}
	}
}

function showPlaylist(plVisible, sourceDir)
{
	addPlaylistBtn(sourceDir);
}

function addPlaylistBtn(sourceDir)
{
	jwplayer().addButton(sourceDir+'/img/list.png', 'Playlist', openPlaylist, '1');
}

function removePlaylistBtn()
{
	jwplayer().removeButton('1');
}

function openPlaylist()
{
//	$("#player_playlist").show();
	$('#list1').fadeToggle();
}

function ajaxWebsocket(options) 
{	

	if (options && options.data) {
		options.data = JSON.stringify(options.data);
	}
	
	var settings = {	type:			'POST',
						url: 			ajaxLink,
						cache:			false,
						dataType:		'json',
						contentType:	'json/application; charset=UTF-8',
						success:		function(data,textStatus,XMLHttpRequest) {
							var status = parseInt(XMLHttpRequest.getResponseHeader('Ajax-Status'));
							if(status) {
								if(typeof this.yes == 'function') {
									this.yes(data);
								}
							} else {
								if(typeof this.no == 'function') {
									this.no(data);
								}
							}
						}
	};
	$.extend(settings, options);

	$.ajax(settings);
}

function sendStatistics(action,video,provider)
{
	var vLang = video.lang;
	if(video.hasOwnProperty('isUpdate'))
		if(video.isUpdate == '1')
			vLang = 'en';		
	
	var formVideoLink = videoLink;
	
	if (typeof action.videoLink != 'undefined') {
		formVideoLink = action.videoLink;
	}

	ajaxWebsocket({
		data:{
				action		:	'STATS',
				provider	:	provider,
				actName		:	action.name,
				hd			:	action.hd,
				lang		:	vLang,
				id			:	video.id
		},
		url : formVideoLink + 'ajax/statistics'
	});
}

function startAjax(scrollVis,trigVis,sourceDir,adVis,lang)
{
	var wGet = '';
	if(scrollVis) wGet += 'NC';
	if(trigVis) wGet += 'T';
	if(adVis) wGet += 'A';

	ajaxWebsocket({
		data:
		{
			action:'GET_'+wGet,
			lang: lang
		},
		yes:function(data)
		{
			if(!data) return;
			
			if (data['currencies'] || data['news'])
			{
				$.getScript(sourceDir+"js/jquery.webticker.js", function(){
					showScroller(data);
				});
			}
			
			if (data['triggers']) 
				showTriggers(data['triggers']);
			
			if (data['ad']) 
				advertising = data['ad'];
			
			setInterval(function(){intervalAjax(scrollVis,trigVis,lang);},3000);
		}
	});
}

function intervalAjax(scrollVis,trigVis,lang)
{
	var wGet = '';
	if(scrollVis) wGet += 'NC';
	if(trigVis) wGet += 'T';

	
	ajaxWebsocket({
		data:
		{
			action:'GET_'+wGet,
			lang: lang
		},
		yes:function(data)
		{
			if(!data) return;
			
			if (data['currencies'])
			{ 
				if($('#player_currency').length > 0)
					for(var i in data['currencies'])
					{
						if(data['currencies'].hasOwnProperty(i))
						{
							curValue = data['currencies'][i];
							curValue = curValue.split('|')[2].split(',')[1];
							
							if (parseFloat(curValue) > parseFloat($('#' + i.replace("/", "")).find('div.curValue a').html()))
								$('#' + i.replace("/", "")).removeClass('act').removeClass('noact').addClass('act').find('div.curValue a').html(curValue);
							else if (parseFloat(curValue) < parseFloat($('#' + i.replace("/", "")).find('div.curValue a').html())) 
								$('#' + i.replace("/", "")).removeClass('act').removeClass('noact').addClass('noact').find('div.curValue a').html(curValue);
						}
					}
				else
					showScroller(data);
			}	
			
			if (data['triggers'])
				triggers = checkTriggers(data['triggers']);
		}
	});		
}

function showAd()
{
	$('#ad_container').remove();
	
	if(!advertising) return;
	
	var adContent = advertising.hasOwnProperty('data')?advertising.data:false;
	var adLink = advertising.hasOwnProperty('link')?advertising.link:'/tv';
	var adWidth = advertising.hasOwnProperty('width')?advertising.width:(jwWidth-100);
	var adBg = advertising.hasOwnProperty('bg')?advertising.bg:'transparent';
	if(adWidth < 300) adWidth = jwWidth;
	var adRight = Math.round((jwWidth-adWidth)/2);
	
	if(adContent)
		$("#player_container")
			.append('<a style="width:'+adWidth+'px;right:'+adRight+'px;background:'+adBg+'" id="ad_container" href="'+adLink+'" target="_blank">'+adContent+'</a>');
}

function closeAd()
{
	$('#ad_container').remove();
	
	var currentDate = new Date();
	expirationDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()+1, 0, 0, 0);
	
	document.cookie = "DCTV_AD_BLOCK=1;expires=" + expirationDate.toUTCString() + ";path=/";
}

function showScroller(data)
{
	$('#player_container').after('<div id="player_scroller">'+
	'<div id="player_currency" style="width:'+jwWidth+'px;"><ul></ul></div>'+
	'<div id="player_news" style="width:'+jwWidth+'px;"><ul></ul></div>'+
	'</div>');

	if (data['news'])
	{
		for(var i in data['news'])
			if(data['news'].hasOwnProperty(i))
				$('#player_news ul').append('<li id="' + data['news'][i].guid + '">'+
				'<a href="' + data['news'][i].url + '" target="_blank">'+
				data['news'][i].title + '</a>&nbsp;|&nbsp;</li>');
		
		$('#player_news ul').webTicker();
	}
	
	if (data['currencies'])
	{
		var curValue;//,curStatus=0
		for(var i in data['currencies'])
		{
			if(data['currencies'].hasOwnProperty(i))
			{					
				curLink = '/plugins/expandGlass/popup.php?instrument-name=' + i.replace("/", "") + '&interval=600&data-unit-count=100&presentation-type=candle';
				
				curValue = data['currencies'][i];
				curValue = curValue.split('|')[2].split(',')[1];
				
				if (curValue)
					$('#player_currency ul').append('<li id="'+i.replace("/", "")+'" class="">'+ //class="'+(curStatus ? 'act':'noact')+'"
							'<div class="curName"><a href="'+curLink+'" target="_blank">'+i+'</a></div>'+
							'<div class="curValue"><a href="'+curLink+'" target="_blank">'+curValue+'</a></div>'+
							'<div class="curArrow"></div>'+
							'<div class="curDelimeter">|</div>'+
							'</li>');	
			}
		}
		$('#player_currency ul').webTicker({travelocity: 0.07}); //0.05
	}				
	
//	setInterval(function(){intervalAjax();},3000);
}

var imgExt = 'svg'; //for trigger images - jpg for old browsers

function showTriggers(data)
{
	if($.browser.msie && $.browser.version < 10)
		imgExt = 'jpg';
	
	var trWidth = 140;
	$("#player_container").append('<div style="width:'+trWidth+'px;" id="triggers_container"></div>');
	
	triggers = checkTriggers(data);
}

function deleteTrigger(e)
{
	var id = $(this).attr('id');
	id = id.substr(12,id.length);
//	delete triggers[id];
	
	if (triggers)
		for(var i in triggers)
			if(triggers.hasOwnProperty(i))
				if (triggers[i].id == id)
				{
					delete triggers[i];
					
					curTrigger = '';
				}
//	drawTriggers(triggers);
	
	$('#trigger'+id).hide();
	$('#bigtrigger'+id).remove();
	
	e.stopPropagation(); 
    return false;
}

function collapseTrigger(e)
{
	var id = $(this).attr('id');
	id = id.substr(8,id.length);

	closeBigTrigger(id);
	
	e.stopPropagation(); 
    return false;
}

function closeBigTrigger(curElementID)
{
	$('#bigtrigger'+curElementID).hide().remove();
	if($('#trigger'+curElementID).data('remove') == '1') $('#trigger'+curElementID).remove();
	curTrigger = '';
}

function checkTriggers(data)
{
//	if ('' != curTrigger) return triggers;
	if (data)
		for(var i in data)
			if(data.hasOwnProperty(i))
				if($('#trigger'+data[i].id).length <= 0)
					triggers.push(data[i]);
	
	
	var now = new Date(); 
	var nDate_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());		
//	var bool = false;
	
	if (triggers)
	{
		for(var i in triggers)
			if(triggers.hasOwnProperty(i))
			{
				var dDate = new Date(triggers[i].ddate * 1000);
				var dDate_utc = new Date(dDate.getUTCFullYear(), dDate.getUTCMonth(), dDate.getUTCDate(),  dDate.getUTCHours(), dDate.getUTCMinutes(), dDate.getUTCSeconds());
				if (dDate_utc < nDate_utc)
				{
					if (curTrigger != triggers[i].id)
					{
						$('#trigger'+triggers[i].id).hide();
						$('#bigtrigger'+triggers[i].id).remove();							
						
						delete triggers[i];
					}
					else
						$('#trigger'+triggers[i].id).data('remove','1'); //if opened big trigger (or hovered), but need to remove this trigger
				}
				else if($('#trigger'+triggers[i].id).length <= 0)
				{
					getAndDrawOneTrigger(triggers[i], true);
				}
			}
		
//		triggers = data;
	}
	
	return triggers;
}

var triggerTimeoutId;
function getAndDrawOneTrigger(data, showHovered) //by type
{
//	var trHeight = 40;

//small trigger (design & types)	
	var triggerHTML = '<div id="trigger'+data.id+'" data-trigger="'+JSON.stringify(data).replace(/"/g,'&quot;').replace(/'/g,"&#039")+'" class="triggers" style="position: relative;">\
	<div class="close_triggers">\
		<div class="texpand" title="expand"></div>\
		<div class="tclose" title="close" id="closetrigger'+data.id+'"></div>\
	</div>';

	if (10 == data.triggerType) //live
	{
		if(!liveTriggers) return;
		
//		showHovered = false;
//		openBigTrigger();
		
		var country = data.countryLong;
		if ('United States' == country)
			country = 'USA';
		if ('United Kingdom' == country)
			country = 'UK';
		
		var t = data.titleShort,t1='',t2='';
		t = t.split("\n");
		if(t.length>1)
		{
			t1  = t[1];
			t2 = ', <span class="tadd">'+t[0]+'</span>';
		}
		else
			t1  = t[0];
		
		triggerHTML += '<div id="trigger'+data.id+'hover" class="trigger_hover"><p class="tflag tcur"><img src="'+gSourceDir+'img/triggers/flags/'+data.country+'.'+imgExt+'" />'+country+'</p></div>\
		<div style="height:35px;padding-top:5px;position:relative;">\
		<p class="ttext" style="background:url('+gSourceDir+'img/equalizerw.gif) no-repeat left center; padding-left: 20px;">'+data.currency+t2+'</p>\
		<p class="tadd">'+t1+'</p>\
		</div>\
		</div>';		
	}
	else if (3 == data.triggerType) //high\low
	{
		var trigName = 'low';
		if('H' == data.type)
			trigName = 'high';
		triggerHTML += '<div style="height:35px;padding-top:5px;position:relative;">\
		<p class="tcur">'+data.currency+'</p>\
		<p class="tadd">'+trigName+'&nbsp;'+data.price+'</p>\
		</div>\
		<div id="trigger'+data.id+'hover" class="trigger_hover"><p class="timg"><img src="'+gSourceDir+'img/triggers/bg_'+trigName+'.'+imgExt+'" /></p></div>\
		</div>';
	}
	else if (7 == data.triggerType) //figure
	{	
		triggerHTML += '<div style="height:35px;padding-top:5px;position:relative;">\
		<p class="tcur">'+data.currency+'</p>\
		<p class="tadd">FIGURE&nbsp;'+data.price+'</p>\
		</div>\
		<div id="trigger'+data.id+'hover" class="trigger_hover"><p class="timg"><img src="'+gSourceDir+'img/triggers/bg_figure.'+imgExt+'" /></p></div>\
		</div>';
	}	
	else if (6 == data.triggerType) //calendar
	{	
//		if (data.events)
//		{
			var textTime = '&nbsp;';
			
			if (data.date && data.waitTime)
			{
				var relTime = new Date(data.date);
				var relHour = '0' + relTime.getUTCHours();
				relHour = relHour.substr(relHour.length - 2,2); 
				var relMin = '0' + relTime.getUTCMinutes();
				relMin = relMin.substr(relMin.length - 2,2); 
	//			
	//			var inMinutes = data.events[0].TIME_TILL_RELEASE_TRUNC / 60;
	//			if (inMinutes == 2 || inMinutes == 6 || inMinutes == 11 ||inMinutes == 16 || inMinutes == 21 || inMinutes == 26 || inMinutes == 31)
	//				inMinutes -= 1;
				inMinutes = data.waitTime;
				
				textTime = 'IN '+inMinutes+' MIN ['+relHour+':'+relMin+' GMT]';
			}
			
			var country = data.countryLong;
			if ('United States' == country)
				country = 'USA';
			if ('United Kingdom' == country)
				country = 'UK';
			
			triggerHTML += '<div id="trigger'+data.id+'hover" class="trigger_hover"><p class="tflag tcur"><img src="'+gSourceDir+'img/triggers/flags/'+data.country+'.'+imgExt+'" />'+country+'</p></div>\
			<div style="height:35px;padding-top:5px;position:relative;">\
			<p class="ttext">'+data.titleShort+'</p>\
			<p class="tadd">'+textTime+'</p>\
			</div>\
			</div>';
//		}
//		else
//			return;
	}
	else 
		return ;
	
	
	$("#triggers_container").prepend(triggerHTML);	
	
	$('#trigger'+data.id).delegate('.tclose','click',deleteTrigger);
	$(document).delegate('#trigger'+data.id,'click',openBigTrigger);
	
	if(10 == data.triggerType && liveTriggers)
	{
		$('#trigger'+data.id).addClass('liveTriggers');
		
//		$('#trigger'+data.id).trigger('click',1);		
//		$('#trigger'+data.id).click();		
	}
	
    $('#trigger'+data.id).hover(function() {
    	var curElem = $(this);
        if (!triggerTimeoutId) {
        	triggerTimeoutId = window.setTimeout(function() {
        		triggerTimeoutId = null;
            	
		    	curTrigger = curElem.attr('id');
		    	curTrigger = curTrigger.substr(7,curTrigger.length);
		//    	$(this).stop();
		//    	$('.trigger_hover').stop(true,true);
		    	curElem.find('.trigger_hover').slideDown('normal');
        	}, 350);
        }
    }, function() {
    	if (triggerTimeoutId) {
    		window.clearTimeout(triggerTimeoutId);
    		triggerTimeoutId = null;
    	}
    	else
    	{
			$(this).stop(); 
			$('.trigger_hover').stop(true,true);
			//if($('.big_triggers').length <= 0) 
			curTrigger = '';
			$(this).find('.trigger_hover').slideUp('normal');
    	}
    });
	
//show opened trigger - when new added & hide it after some seconds	
	if (showHovered)
	{
		$('#trigger'+data.id+'hover').show();
		
		setTimeout(function(){$('#trigger'+data.id+'hover').hide()},4500);	
	}
}

function openBigTrigger(e)
{
//	$('#big'+id).show();
	var data = $(this).data('trigger');
	var curWidth = jwplayer().getWidth();
	var curHeight = jwplayer().getHeight();
	
	if (!data) return;
	if (!data.id) return;
	if (!curWidth || !curHeight) return;
	
	var curTopText = '';
	var curText = '';
	var curAdd = ''; //data.add
	var flag = '';
	var img = '';

	if (10 == data.triggerType)
	{
		flag = '<img src="'+gSourceDir+'img/triggers/flags/'+data.country+'.'+imgExt+'" style="height: '+parseInt((curHeight*0.16))+'px;margin-right: 5px;" align="center" />';
		curTopText = data.countryLong;
		curText = data.currency;	
		curAdd = data.title;
//		curAdd = curAdd.split("\n").join('<br>');
		curAdd=curAdd.split("\n");
		curAdd[0]='<span style="color:#fff">'+curAdd[0]+'</span>';
		curAdd = curAdd.join('<br>');		
	}
	else if (7 == data.triggerType)
	{
		img = '<div style="position:relative;width: '+parseInt((curWidth / 1.2))+'px;margin: 25px auto 0px auto;"><img src="'+gSourceDir+'img/triggers/bg_figure.'+imgExt+'" style="width: '+parseInt((curWidth / 1.2))+'px;" /></div>';
		
		curTopText = data.currency;
		curText = 'TOUCHED FIGURE LEVEL<br />RIGHT NOW';		
		curAdd = data.price;
	}
	else if (3 == data.triggerType)
	{
		var trigName = 'low';
		if('H' == data.type)
			trigName = 'high';		
		img = '<div style="position:relative;width: '+parseInt((curWidth / 1.2))+'px;margin: 25px auto 0px auto;"><img src="'+gSourceDir+'img/triggers/bg_'+trigName+'.'+imgExt+'" style="width: '+parseInt((curWidth / 1.2))+'px;" /></div>';
		
		curTopText = data.currency;
		curText = 'TOUCHED '+data.level+' '+trigName+'<br />RIGHT NOW';		
		curAdd = data.price;		
	}
	else if (6 == data.triggerType)
	{
			curAdd = '&nbsp;';
			
			if (data.date && data.waitTime)
			{
				var parHeight = parseInt((curHeight/10.5));
				var parFontSize = parseInt((curHeight*0.04)); 
				
				if (data.events)
					img = '<div style="position:relative;width: '+parseInt((curWidth / 1.2))+'px;margin: 25px auto 0px auto;">\
							<img src="'+gSourceDir+'img/triggers/bg_calendar.'+imgExt+'" style="width: '+parseInt((curWidth / 1.2))+'px;" />\
							<div style="position: absolute; top:-'+(parFontSize+5)+'px;right:25px;z-index:9;">\
								<div style="float: right;">\
									<p style="height:'+parHeight+'px; color:#fff;font-size: '+parFontSize+'px;">Cons</p>\
									<p style="height:'+parHeight+'px;font-size: '+parFontSize+'px;">'+data.events[0].consensus+'</p>\
									<p style="height:'+parHeight+'px;font-size: '+parFontSize+'px;">'+(data.events[1] ? data.events[1].consensus : '&nbsp;')+'</p>\
								</div>\
								<div style="float: right;">\
								<p style="height:'+parHeight+'px; color:#fff;font-size: '+parFontSize+'px;">Prev</p>\
								<p style="height:'+parHeight+'px;font-size: '+parFontSize+'px;">'+data.events[0].previous+'</p>\
								<p style="height:'+parHeight+'px;font-size: '+parFontSize+'px;">'+(data.events[1] ? data.events[1].previous : '&nbsp;')+'</p>\
								</div>\
							</div>\
							<div style="position: absolute; top:-'+(parFontSize+5)+'px;left:25px;z-index:9;">\
								<p style="height:'+parHeight+'px;font-size: '+parFontSize+'px;">&nbsp;</p>\
								<p style="height:'+parHeight+'px;color:#fff;margin:0px;font-size: '+parFontSize+'px;">'+data.events[0].details+'</p>\
								<p style="height:'+parHeight+'px;color:#fff;margin:0px;font-size: '+parFontSize+'px;">'+(data.events[1] ? data.events[1].details : '&nbsp;')+'</p>\
							</div>\
						</div>';
				
				var relTime = new Date(data.date);
				var relHour = '0' + relTime.getUTCHours();
				relHour = relHour.substr(relHour.length - 2,2); 
				var relMin = '0' + relTime.getUTCMinutes();
				relMin = relMin.substr(relMin.length - 2,2); 
	//			
	//			var inMinutes = data.events[0].TIME_TILL_RELEASE_TRUNC / 60;
	//			if (inMinutes == 2 || inMinutes == 6 || inMinutes == 11 ||inMinutes == 16 || inMinutes == 21 || inMinutes == 26 || inMinutes == 31)
	//				inMinutes -= 1;
				inMinutes = data.waitTime;	
				
				curAdd = 'IN '+inMinutes+' MIN ['+relHour+':'+relMin+' GMT]';
			}
			
			flag = '<img src="'+gSourceDir+'img/triggers/flags/'+data.country+'.'+imgExt+'" style="height: '+parseInt((curHeight*0.16))+'px;margin-right: 5px;" align="center" />';
			curTopText = data.countryLong;
			curText = data.titleShort;
	} else return;

	var currentItem = jwplayer().getPlaylistItem();
	sendStatistics({'name' : 1, 'hd' : 0}, {'lang':currentItem.lang, 'id':data.triggerType}, 15);
	
	var liveClick = '';
	var liveClass = '';
	var curTextKoef = 0.06;
	if(10 == data.triggerType && liveTriggers)
	{
		liveClass = ' big_triggersLive';
		liveClick = 'window.open(\''+data.link+'\',\'_blank\')';
		curTextKoef = 0.12;
	}
	
	$("#triggers_container").after('<div class="big_triggers'+liveClass+'" id="bigtrigger'+data.id+'" style="width: '+(curWidth)+'px;height: '+(curHeight)+'px;" onclick="closeBigTrigger(\''+data.id+'\');'+liveClick+'">\
			<h2 style="font-size: '+parseInt((curHeight*0.16))+'px;margin-top:'+parseInt((curHeight/7))+'px;margin-left:'+parseInt((curWidth/10))+'px;">\
				'+flag+curTopText+'\
			</h2>\
			<h3 style="font-size: '+parseInt((curHeight*curTextKoef))+'px;height: '+parseInt((curHeight * 0.06 * 2.5))+'px;margin-left:'+parseInt((curWidth/10))+'px;">\
				'+curText+'\
			</h3>\
			<p style="font-size: '+parseInt((curHeight*0.075))+'px;margin-left:'+parseInt((curWidth/10))+'px;">\
				'+curAdd+'\
			</p>\
			'+img+'\
			<!--<object data="'+gSourceDir+'img/triggers/bg5.svg" width="'+parseInt((curWidth / 1.2))+'px" type="image/svg+xml" style="width: '+parseInt((curWidth / 1.2))+'px;margin: 20px auto 0px auto;display: block;"></object>-->\
			<div class="close_triggers">\
				<div class="tcollapse" title="collapse" id="collapse'+data.id+'"></div>\
				<div class="tclose" title="close" id="closetrigger'+data.id+'"></div>\
			</div>\
			</div>');
	
//	$(document).delegate('#bigtrigger'+data.id,'click',closeBigTrigger);
	$('#bigtrigger'+data.id).find('.close_triggers').delegate('.tclose','click',deleteTrigger);
	$('#bigtrigger'+data.id).find('.close_triggers').delegate('.tcollapse','click',collapseTrigger);
	
	$('#bigtrigger'+data.id).show(function() {
//		var id = data.id;
		curTrigger = data.id;
	  });
}

function get_cookie(cookie_name)
{
  var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
 
  if ( results )
    return ( unescape ( results[2] ) );
  else
    return null;
}

/*If explorer*/
function GetIEVersion() {
  var sAgent = window.navigator.userAgent;
  var Idx = sAgent.indexOf("MSIE");

  // If IE, return version number.
  if (Idx > 0 || !!navigator.userAgent.match(/Trident\/7\./)) //If ie
    return true;
  else
    return false; //It is not IE
}
/*#If explorer*/
